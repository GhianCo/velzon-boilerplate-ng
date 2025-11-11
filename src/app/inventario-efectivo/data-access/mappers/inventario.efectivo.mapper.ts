import {MainMapper} from "@sothy/mappers/main.mapper";
import {DateTimeService} from "@shared/services/date.time.service";

export class InventarioEfectivoMapper extends MainMapper<any, any> {
  protected map(inventario_efectivo: any): any {
    return {
      ...inventario_efectivo,
      fecha: DateTimeService.formatearFecha(inventario_efectivo.fecha),
    }
  }

}
