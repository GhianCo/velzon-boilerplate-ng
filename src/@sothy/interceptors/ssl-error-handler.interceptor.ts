import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

/**
 * Flag global para evitar mostrar múltiples alertas SSL
 */
let sslAlertShown = false;

/**
 * Interceptor funcional para manejar errores de certificados SSL
 * Detecta errores SSL en URLs con IPs locales y ofrece opciones al usuario
 */
export const sslErrorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Verificar si es un error de SSL/Certificate
      if (isSSLError(error, req.url)) {
        // Solo mostrar la alerta si no se ha mostrado ya
        if (!sslAlertShown) {
          sslAlertShown = true;
          showSslErrorAlert(req.url);
        }

        // Retornar el error original sin retry
        return throwError(() => error);
      }

      // Si no es un error SSL, propagar el error original
      return throwError(() => error);
    })
  );
};

/**
 * Verifica si el error es relacionado con SSL/Certificados
 */
function isSSLError(error: HttpErrorResponse, url: string): boolean {
  // Verificar si la URL contiene una IP local
  const isLocalIP = /https?:\/\/(?:10\.|192\.168\.|172\.(?:1[6-9]|2[0-9]|3[01])\.|127\.0\.0\.1)/.test(url);

  if (!isLocalIP) {
    return false;
  }

  // Verificar diferentes tipos de errores SSL/Certificate
  return checkSSLErrorTypes(error);
}

/**
 * Verifica los diferentes tipos de errores SSL
 */
function checkSSLErrorTypes(error: HttpErrorResponse): boolean {
  // Status codes relacionados con SSL/Certificate errors
  const sslStatusCodes = [0, 500, 502, 503, 524];
  const hasSSLStatusCode = sslStatusCodes.includes(error.status);

  // Mensajes de error específicos de certificados SSL
  const errorMessage = (error.message || '').toLowerCase();
  const errorText = (error.error?.message || '').toLowerCase();
  const statusText = (error.statusText || '').toLowerCase();
  const errorString = JSON.stringify(error).toLowerCase();

  const sslErrorPatterns = [
    'err_cert_authority_invalid',
    'err_cert_common_name_invalid',
    'err_cert_date_invalid',
    'err_cert_invalid',
    'err_ssl_protocol_error',
    'err_ssl_version_or_cipher_mismatch',
    'net::err_cert_',
    'net::err_ssl_',
    'ssl',
    'certificate',
    'cert_',
    'tls',
    'handshake',
    'unknown error',
    'connection refused',
    'network error'
  ];

  const hasSSLErrorMessage = sslErrorPatterns.some(pattern =>
    errorMessage.includes(pattern) ||
    errorText.includes(pattern) ||
    statusText.includes(pattern) ||
    errorString.includes(pattern)
  );

  // Para errores status 0 con HTTPS + IP local, asumir que es SSL
  const isNetworkErrorOnHTTPS = error.status === 0 && (error.url?.startsWith('https://') ?? false);

  return (hasSSLStatusCode && (hasSSLErrorMessage || isNetworkErrorOnHTTPS)) || isNetworkErrorOnHTTPS;
}


/**
 * Muestra una alerta SweetAlert2 con opciones para manejar el error SSL
 */
function showSslErrorAlert(problematicUrl: string): void {
  Swal.fire({
    title: '⚠️ Error de Certificado SSL',
    html: `
      <div class="text-start">
        <p class="mb-3">Se detectó un problema con el certificado SSL en:</p>
        <div class="p-3 bg-light rounded mb-3">
          <code class="text-danger">${problematicUrl}</code>
        </div>
        <p class="mb-2"><strong>Opciones disponibles:</strong></p>
        <ul class="text-start">
          <li><strong>Abrir en nueva pestaña:</strong> Aceptar el certificado manualmente</li>
          <li><strong>Refrescar:</strong> Intentar nuevamente</li>
        </ul>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: '<i class="ri-external-link-line"></i> Abrir en nueva pestaña',
    denyButtonText: '<i class="ri-refresh-line"></i> Refrescar página',
    cancelButtonText: '<i class="ri-close-line"></i> Cerrar',
    confirmButtonColor: '#3085d6',
    denyButtonColor: '#f39c12',
    cancelButtonColor: '#6c757d',
    allowOutsideClick: false,
    allowEscapeKey: true,
    customClass: {
      popup: 'ssl-error-popup',
      confirmButton: 'btn btn-primary',
      denyButton: 'btn btn-warning',
      cancelButton: 'btn btn-secondary'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Usuario eligió abrir en nueva pestaña
      openUrlInNewTab(problematicUrl);
      resetSslAlertFlag();
    } else if (result.isDenied) {
      // Usuario eligió refrescar página
      refreshPage();
    } else {
      // Usuario cerró el diálogo
      resetSslAlertFlag();
    }
  });
}

/**
 * Abre la URL problemática en una nueva pestaña
 */
function openUrlInNewTab(url: string): void {
  try {
    const newTab = window.open(url, '_blank', 'noopener,noreferrer');

    if (!newTab) {
      // Si el navegador bloquea pop-ups
      Swal.fire({
        title: '🚫 Bloqueador de Pop-ups Detectado',
        html: `
          <div class="text-start">
            <p class="mb-3">No se pudo abrir la nueva pestaña automáticamente.</p>
            <p class="mb-2">Por favor, copie y pegue esta URL en una nueva pestaña:</p>
            <div class="p-3 bg-light rounded">
              <input type="text" class="form-control" value="${url}" readonly onclick="this.select()">
            </div>
            <small class="text-muted mt-2 d-block">Haga click en el campo para seleccionar y copiar</small>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'ssl-error-popup',
          confirmButton: 'btn btn-primary'
        }
      });
    }
  } catch (error) {
    console.error('Error al abrir nueva pestaña:', error);

    Swal.fire({
      title: '❌ Error al Abrir Nueva Pestaña',
      html: `
        <div class="text-start">
          <p class="mb-3">Error al abrir nueva pestaña.</p>
          <p class="mb-2">Por favor, copie y pegue esta URL manualmente:</p>
          <div class="p-3 bg-light rounded">
            <input type="text" class="form-control" value="${url}" readonly onclick="this.select()">
          </div>
        </div>
      `,
      icon: 'error',
      confirmButtonText: 'Entendido',
      customClass: {
        popup: 'ssl-error-popup',
        confirmButton: 'btn btn-primary'
      }
    });
  }
}

/**
 * Recarga la página actual
 */
function refreshPage(): void {
  window.location.reload();
}

/**
 * Resetea el flag de alerta después de un tiempo
 */
function resetSslAlertFlag(): void {
  // Resetear el flag después de 30 segundos
  setTimeout(() => {
    sslAlertShown = false;
  }, 30000); // 30 segundos
}

