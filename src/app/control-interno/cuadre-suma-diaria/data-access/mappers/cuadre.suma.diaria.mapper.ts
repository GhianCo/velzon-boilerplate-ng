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

export class CategoriasConRegistrosMapper {
  static transform(data: any): any {
    if (!data || !data.categorias) {
      return data;
    }

    return {
      ...data,
      categorias: data.categorias.map((categoria: any) => ({
        ...categoria,
        items: categoria.items.map((item: any) => {
          // Mantener los valores originales y agregar versiones formateadas
          const registradoFormateado: any = {};
          if (item.registrado) {
            Object.keys(item.registrado).forEach(fecha => {
              registradoFormateado[fecha] = NumberFormatterService.formatNumber(item.registrado[fecha]);
            });
          }
          
          return {
            ...item,
            registrado_formatted: registradoFormateado
          };
        })
      }))
    };
  }
}
