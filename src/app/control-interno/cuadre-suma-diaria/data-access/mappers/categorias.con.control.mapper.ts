import {NumberFormatterService} from "@shared/services/number-formatter.service";

/**
 * Mapper para transformar la respuesta de categorías con control
 * Procesa los datos y calcula totales, diferencias y subtotales
 */
export class CategoriasConControlMapper {
  /**
   * Transforma la respuesta del API agregando cálculos procesados
   */
  static transform(data: any): any {
    if (!data || !data.categorias || !data.fechas) {
      return data;
    }

    // Calcular totales por item
    const categoriasConTotales = data.categorias.map((categoria: any) => ({
      ...categoria,
      items: categoria.items.map((item: any) => {
        const totalesItem = this.calcularTotalesItem(item, data.fechas, categoria.nombre);
        const totalesItemFormateados = this.formatearTotales(totalesItem);
        const valoresPorFechaFormateados = this.formatearValoresPorFecha(item, data.fechas, categoria.nombre);
        
        return {
          ...item,
          totales: totalesItem,
          totalesFormateados: totalesItemFormateados,
          registradoFormateado: valoresPorFechaFormateados.registrado,
          controlFormateado: valoresPorFechaFormateados.control,
          diferenciaFormateado: valoresPorFechaFormateados.diferencia
        };
      }),
      subtotales: this.calcularSubtotalesPorCategoria(categoria.items, data.fechas, categoria.nombre)
    }));

    // Calcular totales generales
    const totalesGenerales = this.calcularTotalesGenerales(categoriasConTotales, data.fechas);
    const totalesGeneralesFormateados = this.formatearTotalesGenerales(totalesGenerales);

    return {
      ...data,
      categorias: categoriasConTotales,
      totalesGenerales,
      totalesGeneralesFormateados
    };
  }

  /**
   * Formatea los totales de un item
   */
  private static formatearTotales(totales: any): any {
    return {
      registrado: NumberFormatterService.formatNumber(totales.registrado),
      control: NumberFormatterService.formatNumber(totales.control),
      diferencia: NumberFormatterService.formatNumber(totales.diferencia)
    };
  }

  /**
   * Formatea los valores por fecha de un item
   */
  private static formatearValoresPorFecha(item: any, fechas: string[], nombreCategoria: string): any {
    const esIndicador = nombreCategoria === 'INDICADORES';
    const registradoFormateado: any = {};
    const controlFormateado: any = {};
    const diferenciaFormateado: any = {};

    fechas.forEach(fecha => {
      registradoFormateado[fecha] = NumberFormatterService.formatNumber(item.registrado[fecha] || 0);
      
      if (esIndicador) {
        controlFormateado[fecha] = '-';
        diferenciaFormateado[fecha] = '-';
      } else {
        controlFormateado[fecha] = NumberFormatterService.formatNumber(item.control[fecha] || 0);
        const registrado = parseFloat(item.registrado[fecha]) || 0;
        const control = parseFloat(item.control[fecha]) || 0;
        diferenciaFormateado[fecha] = NumberFormatterService.formatNumber(control - registrado);
      }
    });

    return {
      registrado: registradoFormateado,
      control: controlFormateado,
      diferencia: diferenciaFormateado
    };
  }

  /**
   * Formatea los totales generales
   */
  private static formatearTotalesGenerales(totalesGenerales: any): any {
    const porFechaFormateado: any = {};

    Object.keys(totalesGenerales.porFecha).forEach(fecha => {
      const totales = totalesGenerales.porFecha[fecha];
      porFechaFormateado[fecha] = {
        registrado: NumberFormatterService.formatNumber(totales.registrado),
        control: NumberFormatterService.formatNumber(totales.control),
        diferencia: NumberFormatterService.formatNumber(totales.diferencia)
      };
    });

    return {
      porFecha: porFechaFormateado,
      general: {
        registrado: NumberFormatterService.formatNumber(totalesGenerales.general.registrado),
        control: NumberFormatterService.formatNumber(totalesGenerales.general.control),
        diferencia: NumberFormatterService.formatNumber(totalesGenerales.general.diferencia)
      }
    };
  }

  /**
   * Calcula totales para un item específico (suma de todas las fechas)
   */
  private static calcularTotalesItem(item: any, fechas: string[], nombreCategoria: string): any {
    const esIndicador = nombreCategoria === 'INDICADORES';
    
    const totalRegistrado = fechas.reduce((sum, fecha) => {
      return sum + (parseFloat(item.registrado[fecha]) || 0);
    }, 0);

    const totalControl = esIndicador ? 0 : fechas.reduce((sum, fecha) => {
      return sum + (parseFloat(item.control[fecha]) || 0);
    }, 0);

    const totalDiferencia = esIndicador ? 0 : fechas.reduce((sum, fecha) => {
      const registrado = parseFloat(item.registrado[fecha]) || 0;
      const control = parseFloat(item.control[fecha]) || 0;
      return sum + (control - registrado);
    }, 0);

    return {
      registrado: totalRegistrado,
      control: totalControl,
      diferencia: totalDiferencia
    };
  }

  /**
   * Calcula subtotales por categoría para cada fecha
   */
  private static calcularSubtotalesPorCategoria(items: any[], fechas: string[], nombreCategoria: string): any {
    const esIndicador = nombreCategoria === 'INDICADORES';
    const subtotalesPorFecha: any = {};

    fechas.forEach(fecha => {
      const subtotalRegistrado = items.reduce((sum, item) => {
        return sum + (parseFloat(item.registrado[fecha]) || 0);
      }, 0);

      const subtotalControl = esIndicador ? 0 : items.reduce((sum, item) => {
        return sum + (parseFloat(item.control[fecha]) || 0);
      }, 0);

      const subtotalDiferencia = esIndicador ? 0 : items.reduce((sum, item) => {
        const registrado = parseFloat(item.registrado[fecha]) || 0;
        const control = parseFloat(item.control[fecha]) || 0;
        return sum + (control - registrado);
      }, 0);

      subtotalesPorFecha[fecha] = {
        registrado: subtotalRegistrado,
        control: subtotalControl,
        diferencia: subtotalDiferencia
      };
    });

    // Calcular totales generales de la categoría
    const totalGeneral = {
      registrado: fechas.reduce((sum, fecha) => sum + subtotalesPorFecha[fecha].registrado, 0),
      control: fechas.reduce((sum, fecha) => sum + subtotalesPorFecha[fecha].control, 0),
      diferencia: fechas.reduce((sum, fecha) => sum + subtotalesPorFecha[fecha].diferencia, 0)
    };

    return {
      porFecha: subtotalesPorFecha,
      general: totalGeneral
    };
  }

  /**
   * Calcula totales generales considerando el tipo de operación de cada categoría
   */
  private static calcularTotalesGenerales(categorias: any[], fechas: string[]): any {
    const totalesPorFecha: any = {};

    // Calcular por cada fecha
    fechas.forEach(fecha => {
      let totalRegistrado = 0;
      let totalControl = 0;

      categorias.forEach(categoria => {
        const subtotal = categoria.subtotales.porFecha[fecha];
        
        if (categoria.tipo_operacion === '+') {
          // Sumar ingresos
          totalRegistrado += subtotal.registrado;
          totalControl += subtotal.control;
        } else if (categoria.tipo_operacion === '-') {
          // Restar egresos
          totalRegistrado -= subtotal.registrado;
          totalControl -= subtotal.control;
        } else if (categoria.tipo_operacion === 'diff') {
          // Las diferencias se suman
          totalRegistrado += subtotal.registrado;
          totalControl += subtotal.control;
        }
      });

      totalesPorFecha[fecha] = {
        registrado: totalRegistrado,
        control: totalControl,
        diferencia: totalControl - totalRegistrado
      };
    });

    // Calcular total general de todas las fechas
    const totalGeneral = {
      registrado: fechas.reduce((sum, fecha) => sum + totalesPorFecha[fecha].registrado, 0),
      control: fechas.reduce((sum, fecha) => sum + totalesPorFecha[fecha].control, 0),
      diferencia: fechas.reduce((sum, fecha) => sum + totalesPorFecha[fecha].diferencia, 0)
    };

    return {
      porFecha: totalesPorFecha,
      general: totalGeneral
    };
  }
}
