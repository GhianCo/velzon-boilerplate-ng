import {MainMapper} from "@sothy/mappers/main.mapper";
import {DateTimeService} from "@shared/services/date.time.service";
import {NumberFormatterService} from "@shared/services/number-formatter.service";

export class InventarioEfectivoMapper extends MainMapper<any, any> {
  protected map(inventario_efectivo: any): any {
    return {
      ...inventario_efectivo,
      apertura: DateTimeService.formatearFecha(inventario_efectivo.apertura),
      cierre: DateTimeService.formatearFecha(inventario_efectivo.cierre),
      sumadiaria: NumberFormatterService.formatNumber(inventario_efectivo.sumadiaria),
      totalinventario: NumberFormatterService.formatNumber(inventario_efectivo.totalinventario),
    }
  }

}
