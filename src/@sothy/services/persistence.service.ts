import {Injectable, isDevMode} from '@angular/core';
import {isArray, keys as ObjectKeys} from 'lodash-es';

export interface PersistenceOptions {
    session: boolean;
}

@Injectable({providedIn: 'root'})
export class PersistenceService {
    localStorePrefix = 'cash_control_st_';
    cookiePrefix = 'cash_control_ck_';

    // Cache para el token decodificado
    private _decodedToken: any = null;
    private _tokenExpiry: number = 0;

    // ...existing code...

    /**
     * Decodifica un token JWT sin verificación de firma
     * @param token - El token JWT a decodificar
     * @returns El payload decodificado o null si el token es inválido
     */
    private decodeJWT(token: string): any {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Token JWT inválido');
            }

            const payload = parts[1];
            // Agregar padding si es necesario
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
            const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));

            return JSON.parse(decodedPayload);
        } catch (error) {
            if (isDevMode()) {
                console.error('Error decodificando token JWT:', error);
            }
            return null;
        }
    }

    /**
     * Obtiene el token decodificado del localStorage con cache
     * @param forceRefresh - Fuerza la actualización del cache
     * @returns El payload del token decodificado o null
     */
    getDecodedToken(forceRefresh: boolean = false): any {
        const now = Date.now();

        // Si hay cache válido y no se fuerza refresh, retornar cache
        if (!forceRefresh && this._decodedToken && now < this._tokenExpiry) {
            return this._decodedToken;
        }

        try {
            const token = this.get('token');

            if (!token) {
                this._decodedToken = null;
                this._tokenExpiry = 0;
                return null;
            }

            const decoded = this.decodeJWT(token);

            if (!decoded) {
                this._decodedToken = null;
                this._tokenExpiry = 0;
                return null;
            }

            // Cache por 5 minutos o hasta que expire el token
            const tokenExp = (decoded.exp || 0) * 1000; // exp está en segundos, convertir a ms
            const cacheExpiry = Math.min(now + (5 * 60 * 1000), tokenExp); // 5 minutos o exp del token

            this._decodedToken = decoded;
            this._tokenExpiry = cacheExpiry;

            return decoded;
        } catch (error) {
            if (isDevMode()) {
                console.error('Error obteniendo token decodificado:', error);
            }
            this._decodedToken = null;
            this._tokenExpiry = 0;
            return null;
        }
    }

    /**
     * Obtiene una propiedad específica del token
     * @param property - La propiedad a obtener (ej: 'sala_id', 'sub', 'email')
     * @param defaultValue - Valor por defecto si la propiedad no existe
     * @returns El valor de la propiedad o el valor por defecto
     */
    getTokenProperty<T = any>(property: string, defaultValue: T | null = null): T | null {
        const decoded = this.getDecodedToken();
        return decoded && decoded.hasOwnProperty(property) ? decoded[property] : defaultValue;
    }

    /**
     * Obtiene múltiples propiedades del token
     * @param properties - Array de propiedades a obtener
     * @returns Objeto con las propiedades encontradas
     */
    getTokenProperties(properties: string[]): { [key: string]: any } {
        const decoded = this.getDecodedToken();
        const result: { [key: string]: any } = {};

        if (!decoded) {
            return result;
        }

        properties.forEach(prop => {
            if (decoded.hasOwnProperty(prop)) {
                result[prop] = decoded[prop];
            }
        });

        return result;
    }

    /**
     * Verifica si el token existe y es válido
     * @returns true si el token es válido, false en caso contrario
     */
    isTokenValid(): boolean {
        const decoded = this.getDecodedToken();

        if (!decoded || !decoded.exp) {
            return false;
        }

        const now = Math.floor(Date.now() / 1000);
        return decoded.exp > now;
    }

    /**
     * Obtiene información completa del usuario desde el token
     * @returns Objeto con información del usuario o null
     */
    getUserInfo(): any {
        const decoded = this.getDecodedToken();

        if (!decoded) {
            return null;
        }

        // Propiedades comunes en tokens JWT
        const commonProps = ['sub', 'email', 'name', 'given_name', 'family_name', 'picture', 'sala_id', 'role', 'permissions'];
        return this.getTokenProperties(commonProps);
    }

    /**
     * Limpia el cache del token (útil al hacer logout)
     */
    clearTokenCache(): void {
        this._decodedToken = null;
        this._tokenExpiry = 0;
    }

    /**
     * Métodos de conveniencia para propiedades comunes
     */

    getSalaId() {
        return this.getTokenProperty('sala_id');
    }

    getUserId() {
        return this.getTokenProperty('sub');
    }

    getUserEmail() {
        return this.getTokenProperty('email');
    }

    getUserName() {
        return this.getTokenProperty('name');
    }

    getUserRole() {
        return this.getTokenProperty('role');
    }

    getUserPermissions(){
        return this.getTokenProperty('permissions', []);
    }

    /**
     * Codifica un objeto a Base64URL (usado en JWT)
     * Compatible con el decoder de AuthUtils
     */
    private base64UrlEncode(obj: any): string {
        const json = JSON.stringify(obj);
        // Usar el mismo método que AuthUtils espera para decodificar
        // Codificar caracteres Unicode correctamente
        const utf8 = unescape(encodeURIComponent(json));
        const base64 = btoa(utf8);
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    /**
     * Decodifica Base64 (método base)
     * Credits: https://github.com/atk
     */
    private base64Decode(str: string): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let output = '';

        str = String(str).replace(/=+$/, '');

        if (str.length % 4 === 1) {
            throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }

        for (
            let bc = 0, bs: any, buffer: any, idx = 0;
            (buffer = str.charAt(idx++));
            ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
                ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
                : 0
        ) {
            buffer = chars.indexOf(buffer);
        }

        return output;
    }

    /**
     * Decodifica Base64 con soporte Unicode
     */
    private base64DecodeUnicode(str: string): string {
        return decodeURIComponent(
            Array.prototype.map
                .call(
                    this.base64Decode(str),
                    (c: any) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join('')
        );
    }

    /**
     * Decodifica una cadena Base64URL a string con soporte Unicode
     */
    private base64UrlDecode(str: string): string {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw Error('Illegal base64url string!');
        }
        return this.base64DecodeUnicode(output);
    }

    /**
     * Crea un HMAC SHA256 (implementación simplificada)
     * NOTA: Esta es una implementación para cliente. En producción, idealmente 
     * el backend debería re-generar el token.
     */
    private async hmacSHA256(message: string, secret: string): Promise<string> {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const messageData = encoder.encode(message);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    /**
     * Re-genera el JWT con una propiedad actualizada en el payload
     */
    async regenerateTokenWithProperty(property: string, value: any, secret: string): Promise<string | null> {
        try {
            const currentToken = this.get('token');
            if (!currentToken) {
                throw new Error('No hay token disponible');
            }

            // Decodificar el token actual
            const parts = currentToken.split('.');
            if (parts.length !== 3) {
                throw new Error('Token JWT inválido');
            }

            // Decodificar header y payload
            const header = JSON.parse(this.base64UrlDecode(parts[0]));
            const payload = JSON.parse(this.base64UrlDecode(parts[1]));

            // Actualizar o agregar la propiedad
            payload[property] = value;

            // Regenerar el token
            const headerEncoded = this.base64UrlEncode(header);
            const payloadEncoded = this.base64UrlEncode(payload);
            const signatureInput = `${headerEncoded}.${payloadEncoded}`;
            const signature = await this.hmacSHA256(signatureInput, secret);

            const newToken = `${headerEncoded}.${payloadEncoded}.${signature}`;
            
            // Guardar el nuevo token
            this.set('token', newToken);
            
            // Actualizar cache
            this._decodedToken = payload;
            
            return newToken;
        } catch (error) {
            if (isDevMode()) {
                console.error('Error regenerando token:', error);
            }
            return null;
        }
    }

    /**
     * Actualiza una propiedad en el token JWT
     */
    async updateTokenProperty(property: string, value: any, secret?: string): Promise<void> {
        // Actualizar en caché
        if (this._decodedToken) {
            this._decodedToken[property] = value;
        }
        
        // Si se proporciona secret, regenerar el token
        if (secret) {
            await this.regenerateTokenWithProperty(property, value, secret);
        }
    }

    /**
     * Actualiza múltiples propiedades en el token JWT de una sola vez
     * @param properties - Objeto con las propiedades a actualizar {key: value}
     * @param secret - Secret key para regenerar el token
     */
    async updateTokenProperties(properties: { [key: string]: any }, secret?: string): Promise<void> {
        // Actualizar en caché
        if (this._decodedToken) {
            Object.keys(properties).forEach(key => {
                this._decodedToken![key] = properties[key];
            });
        }
        
        // Si se proporciona secret, regenerar el token con todas las propiedades
        if (secret) {
            try {
                const currentToken = this.get('token');
                if (!currentToken) {
                    throw new Error('No hay token disponible');
                }

                // Decodificar el token actual
                const parts = currentToken.split('.');
                if (parts.length !== 3) {
                    throw new Error('Token JWT inválido');
                }

                // Decodificar header y payload
                const header = JSON.parse(this.base64UrlDecode(parts[0]));
                const payload = JSON.parse(this.base64UrlDecode(parts[1]));

                // Actualizar o agregar todas las propiedades
                Object.keys(properties).forEach(key => {
                    payload[key] = properties[key];
                });

                // Regenerar el token
                const headerEncoded = this.base64UrlEncode(header);
                const payloadEncoded = this.base64UrlEncode(payload);
                const signatureInput = `${headerEncoded}.${payloadEncoded}`;
                const signature = await this.hmacSHA256(signatureInput, secret);

                const newToken = `${headerEncoded}.${payloadEncoded}.${signature}`;
                
                // Guardar el nuevo token
                this.set('token', newToken);
                
                // Actualizar cache
                this._decodedToken = payload;
            } catch (error) {
                if (isDevMode()) {
                    console.error('Error regenerando token con múltiples propiedades:', error);
                }
            }
        }
    }

    /**
     * Elimina una propiedad del token JWT
     */
    async removeTokenProperty(property: string, secret?: string): Promise<void> {
        // Eliminar del caché
        if (this._decodedToken && this._decodedToken.hasOwnProperty(property)) {
            delete this._decodedToken[property];
        }
        
        // Si se proporciona secret, regenerar el token sin la propiedad
        if (secret) {
            try {
                const currentToken = this.get('token');
                if (!currentToken) return;

                const parts = currentToken.split('.');
                if (parts.length !== 3) return;

                const header = JSON.parse(this.base64UrlDecode(parts[0]));
                const payload = JSON.parse(this.base64UrlDecode(parts[1]));

                // Eliminar la propiedad
                delete payload[property];

                // Regenerar el token
                const headerEncoded = this.base64UrlEncode(header);
                const payloadEncoded = this.base64UrlEncode(payload);
                const signatureInput = `${headerEncoded}.${payloadEncoded}`;
                const signature = await this.hmacSHA256(signatureInput, secret);

                const newToken = `${headerEncoded}.${payloadEncoded}.${signature}`;
                
                // Guardar el nuevo token
                this.set('token', newToken);
                
                // Actualizar cache
                this._decodedToken = payload;
            } catch (error) {
                if (isDevMode()) {
                    console.error('Error eliminando propiedad del token:', error);
                }
            }
        }
    }

    /**
     * Elimina múltiples propiedades del token JWT de una sola vez
     * @param properties - Array con los nombres de las propiedades a eliminar
     * @param secret - Secret key para regenerar el token
     */
    async removeTokenProperties(properties: string[], secret?: string): Promise<void> {
        // Eliminar del caché
        if (this._decodedToken) {
            properties.forEach(property => {
                if (this._decodedToken!.hasOwnProperty(property)) {
                    delete this._decodedToken![property];
                }
            });
        }
        
        // Si se proporciona secret, regenerar el token sin las propiedades
        if (secret) {
            try {
                const currentToken = this.get('token');
                if (!currentToken) return;

                const parts = currentToken.split('.');
                if (parts.length !== 3) return;

                const header = JSON.parse(this.base64UrlDecode(parts[0]));
                const payload = JSON.parse(this.base64UrlDecode(parts[1]));

                // Eliminar todas las propiedades
                properties.forEach(property => {
                    delete payload[property];
                });

                // Regenerar el token
                const headerEncoded = this.base64UrlEncode(header);
                const payloadEncoded = this.base64UrlEncode(payload);
                const signatureInput = `${headerEncoded}.${payloadEncoded}`;
                const signature = await this.hmacSHA256(signatureInput, secret);

                const newToken = `${headerEncoded}.${payloadEncoded}.${signature}`;
                
                // Guardar el nuevo token
                this.set('token', newToken);
                
                // Actualizar cache
                this._decodedToken = payload;
            } catch (error) {
                if (isDevMode()) {
                    console.error('Error eliminando propiedades del token:', error);
                }
            }
        }
    }

    private setPersistenceValue(key: string, value: unknown, options?: PersistenceOptions) {
        if (undefined !== value) {
            key = `${this.localStorePrefix}${key}`;
            const data = JSON.stringify(value);

            if (options && options.session) {
                return sessionStorage.setItem(key, data);
            }
            return localStorage.setItem(key, data);
        }
    }

    private getPersistenceValue(key: string, options?: PersistenceOptions) {
        key = `${this.localStorePrefix}${key}`;
        let value = void 0;

        try {
            const store = options && options.session ? sessionStorage : localStorage;
            value = JSON.parse(store.getItem(key) as any);
        } catch (error) {
            if (isDevMode()) {
                console.error(error);
            }
        }

        return value;
    }

    private escapeRegExp(e: string) {
        return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }

    set(key: string | { [key: string]: unknown }, value: unknown, options?: PersistenceOptions): void {
        try {
            const data = 'string' === typeof key ? {[key]: value} : key;
            for (let keys = ObjectKeys(data), i = 0, len = keys.length; i < len; i++) {
                this.setPersistenceValue(keys[i], data[keys[i]], options);
            }
        } catch {
            return this.setCookie(key, value);
        }
    }

    get(key: string | string[], options?: PersistenceOptions): any {
        try {
            const data: any = {};
            for (let keys = isArray(key) ? key : [key], i = 0, len = keys.length; i < len; i++) {
                data[keys[i]] = this.getPersistenceValue(keys[i], options);
            }
            return isArray(key) ? data : data[key];
        } catch {
            return this.getCookie(key);
        }
    }

    has(key: string, options?: PersistenceOptions): boolean {
        return !!this.get(key, options);
    }

    remove(key: string | string[], options?: PersistenceOptions) {
        try {
            const keys = isArray(key) ? key : [key];

            for (let i = 0, len = keys.length; i < len; i++) {
                // Si se está removiendo el token, limpiar cache
                if (keys[i] === 'token') {
                    this.clearTokenCache();
                }

                if (options && options.session) {
                    sessionStorage.removeItem(this.localStorePrefix + keys[i]);
                } else {
                    localStorage.removeItem(this.localStorePrefix + keys[i]);
                }
            }
        } catch {
            return this.removeCookie(key);
        }
    }

    // Cookies

    setCookie(key: string | { [key: string]: any }, value?: any): void {
        const data = 'string' === typeof key ? {[key]: value} : key;
        for (let keys = ObjectKeys(data), i = 0, len = keys.length; i < len; i++) {
            document.cookie = encodeURIComponent(this.cookiePrefix + keys[i]) + '=' + encodeURIComponent(JSON.stringify(data[keys[i]]));
        }
    }

    getCookie(key: string | string[]): any {
        const cookies = ';' + document.cookie + ';';
        const data: any = {};
        for (let keys = isArray(key) ? key : [key], i = 0, len = keys.length, k: any = void 0, s: any = void 0, d: any = void 0; i < len; i++) {
            k = this.escapeRegExp(encodeURIComponent(this.cookiePrefix + keys[i]));
            s = new RegExp(';\\s*' + k + '\\s*=\\s*([^;]+)\\s*;');
            d = cookies.match(s);
            data[keys[i]] = d ? JSON.parse(decodeURIComponent(d[1])) : null;
        }
        return isArray(key) ? data : data[key];
    }

    removeCookie(key: string | string[], usePrefix = true) {
        const o = isArray(key) ? key : [key];
        for (let r = 0, s = o.length; r < s; r++) {
            document.cookie = this.escapeRegExp(encodeURIComponent((usePrefix ? this.cookiePrefix : '') + o[r])) + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }
}

