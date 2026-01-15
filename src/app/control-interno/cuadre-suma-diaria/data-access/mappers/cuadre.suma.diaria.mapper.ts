import {MainMapper} from "@sothy/mappers/main.mapper";
import {DateTimeService} from "@shared/services/date.time.service";
import {NumberFormatterService} from "@shared/services/number-formatter.service";

export class CuadreSumaDiariaMapper extends MainMapper<any, any> {
  protected map(inventario_efectivo: any): any {
    return {
      ...inventario_efectivo,
      fecha: DateTimeService.formatearFecha(inventario_efectivo.fecha),
      inicio: DateTimeService.formatearFechaSinHora(inventario_efectivo.inicio),
      fin: DateTimeService.formatearFechaSinHora(inventario_efectivo.fin)
    }
  }

}
