import { Injectable } from '@angular/core';
import { addDays, addMonths, endOfMonth, format, parse, parseISO, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  static parseFechaFromServer(date: Date): string {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  static sumarDiasAFecha(fecha: Date, dias: number  = 0) {
    return addDays(fecha, dias);
  }

  static parsearSoloFecha(fecha: Date): string {
    return format(fecha, 'yyyy-MM-dd');
  }

  static parsearSoloHora(fecha: Date): string {
    return format(fecha, 'HH:mm:ss');
  }
  static parseHoraAHorasYMinutos(hora: string): string {
    const fecha = parse(hora, 'HH:mm:ss', new Date());
    return format(fecha, 'HH:mm');
  }

  static formatearFecha(fecha: Date | string) {
    // Si la fecha es un string, se convierte a un objeto Date
    const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha;

    // Formatear la fecha en el formato deseado
    return format(fechaObj, 'dd/MM/yyyy HH:mm:ss');
  }

  static formatearFechaSinHora(fecha: Date | string) {
    // Si la fecha es un string, se convierte a un objeto Date
    const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha;

    // Formatear la fecha en el formato deseado
    return format(fechaObj, 'dd/MM/yyyy');
  }
  static addMonths(date: Date, months: number) {
    return addMonths(date, months);
  }

  static obtenerPrimerDiaDelMes() {
    return startOfMonth(new Date());
  }

  static formatearFechaEnLetras(fecha: any) {
    return format(fecha, "d 'de' MMMM 'del' yyyy", { locale: es });
  }

  static obtenerYearActual(): number {
    return new Date().getFullYear();
  }

  static obtenerFechaActual(): string {
    return format(new Date(), 'yyyy-MM-dd');
  }

  static obtenerFechaFinSemana(): string {
    const hoy = new Date();
    const fechaFin = addDays(hoy, 7); // suma 6 días para completar 7 contando desde hoy
    return format(fechaFin, 'yyyy-MM-dd');
  }


  static obtenerRangoDelMes(fecha: any) {
    const baseDate = new Date(fecha);
    const inicioMes = format(startOfMonth(baseDate), 'yyyy-MM-dd');
    const finMes = format(endOfMonth(baseDate), 'yyyy-MM-dd');

    return { inicioMes, finMes };
 }



}
