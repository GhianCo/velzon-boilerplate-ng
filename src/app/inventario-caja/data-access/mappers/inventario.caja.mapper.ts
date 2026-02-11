import {MainMapper} from "@sothy/mappers/main.mapper";
import {DateTimeService} from "@shared/services/date.time.service";
import {NumberFormatterService} from "@shared/services/number-formatter.service";

export class InventarioCajaMapper extends MainMapper<any, any> {
  protected map(inventario_caja: any): any {
    return {
      ...inventario_caja,
      apertura: DateTimeService.formatearFecha(inventario_caja.apertura),
      cierre: DateTimeService.formatearFecha(inventario_caja.cierre),
      sumadiaria: NumberFormatterService.formatNumber(inventario_caja.sumadiaria),
      totalinventario: NumberFormatterService.formatNumber(inventario_caja.totalinventario),
    }
  }

}
