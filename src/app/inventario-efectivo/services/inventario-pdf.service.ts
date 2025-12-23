import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class InventarioPdfService {

  constructor() { }

  /**
   * Genera un PDF con el resumen de operación de turno
   * @param resumenData - Datos del resumen de la operación de turno
   */
  generarPdfResumen(resumenData: any): void {
    const doc = new jsPDF('p', 'mm', 'a4'); // Landscape para mejor visualización de tablas
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 15;

    // Logo y encabezado (opcional - puedes agregar un logo si lo tienes)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMEN DE OPERACIÓN DE TURNO', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    // Información del turno en formato horizontal (una sola fila)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const headers = [
      'Turno',
      'Sala',
      'Apertura',
      'Cierre',
      'Gerente',
      'Supervisor'
    ];

    const infoTurno = [
      [
        resumenData.turno_nombre || '-',
        resumenData.sala || '-',
        resumenData.apertura || '-',
        resumenData.cierre || '-',
        resumenData.gerente || '-',
        resumenData.supervisor || '-'
      ]
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [headers],
      body: infoTurno,
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: 1,
        halign: 'center',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [128, 128, 128],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 7,
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' }
      },
      margin: { left: 10, right: 10 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 5;


    // TABLAS LADO A LADO: Inventario de Efectivo (60%) + Suma Diaria de Efectivo (40%)
    if (resumenData.inventario_apertura?.valores?.length > 0 || resumenData.inventario_cierre?.valores?.length > 0 || resumenData.suma_diaria?.categorias?.length > 0) {
      // Verificar si necesitamos una nueva página
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 15;
      }

      // Generar ambas tablas lado a lado
      this.generarTablasLadoALado(
        doc,
        resumenData.inventario_apertura,
        resumenData.inventario_cierre,
        resumenData.suma_diaria?.categorias || [],
        resumenData.suma_diaria?.total,
        yPosition,
        resumenData.simbolo_moneda
      );
      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Cuadro de certificación - posicionado al final de la página antes del cuadro de declaración
    const alturaCuadroCert = 8;
    const alturaFirmas = 12;
    const alturaCuadroDeclaracion = 12;
    const espacioEntreElementos = 5;
    const espacioCertFirmas = 30;

    // Calcular posición desde el final hacia arriba
    const posicionYDeclaracion = pageHeight - 30; // 30mm desde el margen inferior
    const posicionYFirmas = posicionYDeclaracion - alturaCuadroDeclaracion - espacioEntreElementos - alturaFirmas;
    const posicionYCertificacion = posicionYFirmas - espacioCertFirmas - alturaCuadroCert;

    // Cuadro de certificación
    const boxCertX = 15;
    const boxCertY = posicionYCertificacion;
    const boxCertW = pageWidth - 30;
    const boxCertH = alturaCuadroCert;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(boxCertX, boxCertY, boxCertW, boxCertH);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    const textoCertificacion = 'YO CERTIFICO QUE HE CONTADO Y REGISTRADO EL DINERO BAJO MI CUSTODIA DECLARANDO EN ESTE INVENTARIO DE EFECTIVO Y HE NOTIFICADO AL PERSONAL INDICADO CUALQUIER DISCREPANCIA';

    const lineasCertificacion = doc.splitTextToSize(textoCertificacion, pageWidth - 40);
    doc.text(lineasCertificacion, pageWidth / 2, boxCertY + 3.5, { align: 'center', maxWidth: pageWidth - 40 });

    // Líneas para firmas - posicionadas al final
    const yPosFirmas = posicionYFirmas;
    const firmaWidth = 80;
    const firmaSpacing = (pageWidth - 30 - (firmaWidth * 2)) / 3;

    // Firma 1 - Gerente
    const firma1X = 15 + firmaSpacing;
    doc.line(firma1X, yPosFirmas, firma1X + firmaWidth, yPosFirmas);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('GERENTE DE SALA', firma1X + (firmaWidth / 2), yPosFirmas + 4, { align: 'center' });
    doc.text('D.N.I.:', firma1X + (firmaWidth / 2), yPosFirmas + 8, { align: 'right' });

    // Firma 2 - Supervisor
    const firma2X = firma1X + firmaWidth + firmaSpacing;
    doc.line(firma2X, yPosFirmas, firma2X + firmaWidth, yPosFirmas);
    doc.text('SUPERVISOR DE TURNO', firma2X + (firmaWidth / 2), yPosFirmas + 4, { align: 'center' });
    doc.text('D.N.I.:', firma2X + (firmaWidth / 2), yPosFirmas + 8, { align: 'right' });

    // Cuadro de advertencia - siempre al final de la hoja
    const posicionYCuadro = posicionYDeclaracion;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(15, posicionYCuadro, pageWidth - 30, alturaCuadroDeclaracion);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    const textoDeclaracion = 'La información contenida en el presente documento tiene carácter de DECLARACIÓN JURADA. La sala, tomará en cuenta la información en ella consignada, reservándose el derecho de llevar a cabo las verificaciones correspondientes. En caso de detectarse que se ha omitido, ocultado o consignado información  falsa, se procederá con las acciones administrativas  y/o penales que corresponda.';

    const lineasTexto = doc.splitTextToSize(textoDeclaracion, pageWidth - 40);
    doc.text(lineasTexto, pageWidth / 2, posicionYCuadro + 4, { align: 'center', maxWidth: pageWidth - 40 });

    // Pie de página
    const totalPages = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.text(
        `Página ${i} de ${totalPages} - Generado el ${new Date().toLocaleString('es-PE')}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Guardar el PDF
    const fileName = `Resumen_Turno_${resumenData.turno_nombre}_${resumenData.apertura?.replace(/[: ]/g, '_')}.pdf`;
    doc.save(fileName);
  }

  /**
   * Genera dos tablas lado a lado: Inventario de Efectivo (60%) y Suma Diaria (40%)
   */
  private generarTablasLadoALado(
    doc: jsPDF,
    inventarioApertura: any,
    inventarioCierre: any,
    categoriasSumaDiaria: any[],
    total: string,
    startY: number,
    simbolo: string
  ): void {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Calcular anchos: 60% para inventario, 40% para suma diaria
    const margen = 10;
    const espacioEntreTablas = 5;
    const anchoInventario = (pageWidth - (margen * 2) - espacioEntreTablas) * 0.6;
    const anchoSumaDiaria = (pageWidth - (margen * 2) - espacioEntreTablas) * 0.4;

    // TABLA 1: INVENTARIO DE EFECTIVO (sin título fuera)
    this.generarTablaInventario(
      doc,
      inventarioApertura,
      inventarioCierre,
      startY,
      simbolo,
      margen,
      anchoInventario
    );

    const finTablaInventario = (doc as any).lastAutoTable.finalY;

    // TABLA 2: SUMA DIARIA DE EFECTIVO (al lado derecho, sin título fuera)
    const xSumaDiaria = margen + anchoInventario + espacioEntreTablas;

    this.generarTablaSumaDiaria(
      doc,
      categoriasSumaDiaria,
      total,
      startY,
      simbolo,
      xSumaDiaria,
      anchoSumaDiaria
    );

    const finTablaSumaDiaria = (doc as any).lastAutoTable.finalY;

    // Actualizar la posición Y al final de la tabla más larga
    (doc as any).lastAutoTable.finalY = Math.max(finTablaInventario, finTablaSumaDiaria);
  }
  /**
   * Genera la tabla de Inventario de Efectivo (Apertura y Cierre)
   */
  private generarTablaInventario(
    doc: jsPDF,
    inventarioApertura: any,
    inventarioCierre: any,
    startY: number,
    simbolo: string,
    xStart: number,
    tableWidth: number
  ): void {
    const cajasApertura = inventarioApertura?.cajas || [];
    const cajasCierre = inventarioCierre?.cajas || [];

    // Preparar encabezados
    const titleRow: any[] = [];
    const headers: any[] = [];
    const subHeaders: any[] = [''];

    // Fila de título "Inventario de Efectivo"
    const totalColumnas = 1 + cajasApertura.length + 1 + cajasCierre.length + 1;
    titleRow.push({
      content: 'Inventario de Efectivo',
      colSpan: totalColumnas,
      styles: {
        halign: 'center',
        fillColor: [169, 169, 169], // Gris medio
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8
      }
    });

    // Encabezado de Apertura (gris claro)
    headers.push({
      content: 'Descripción',
      colSpan: 1,
      styles: {fillColor: [211, 211, 211] } // Gris claro
    });
    // Encabezado de Apertura (gris claro)
    headers.push({
      content: 'Apertura',
      colSpan: cajasApertura.length + 1,
      styles: { halign: 'center', fillColor: [211, 211, 211] } // Gris claro
    });

    cajasApertura.forEach((caja: any) => {
      subHeaders.push(caja.caja_nombre);
    });
    subHeaders.push({ content: 'Total', styles: { halign: 'right' } });

    // Encabezado de Cierre (gris claro)
    headers.push({
      content: 'Cierre',
      colSpan: cajasCierre.length + 1,
      styles: { halign: 'center', fillColor: [211, 211, 211] } // Gris claro
    });

    cajasCierre.forEach((caja: any) => {
      subHeaders.push(caja.caja_nombre);
    });
    subHeaders.push({ content: 'Total', styles: { halign: 'right' } });

    // Preparar filas
    const rows: any[] = [];
    const valoresApertura = inventarioApertura?.valores || [];
    const valoresCierre = inventarioCierre?.valores || [];

    // Crear mapa de valores
    const todosLosValores = new Map<number, any>();

    valoresApertura.forEach((valor: any) => {
      todosLosValores.set(valor.valor_id, {
        valor_id: valor.valor_id,
        nombre: valor.nombre,
        apertura: valor,
        cierre: null
      });
    });

    valoresCierre.forEach((valor: any) => {
      if (todosLosValores.has(valor.valor_id)) {
        todosLosValores.get(valor.valor_id).cierre = valor;
      } else {
        todosLosValores.set(valor.valor_id, {
          valor_id: valor.valor_id,
          nombre: valor.nombre,
          apertura: null,
          cierre: valor
        });
      }
    });

    // Generar filas por cada valor
    todosLosValores.forEach((valorData) => {
      // Fila de categoría
      const totalCols = 1 + cajasApertura.length + 1 + cajasCierre.length + 1;
      rows.push([{
        content: `${valorData.nombre}`,
        colSpan: totalCols,
        styles: { fontStyle: 'bold', fillColor: [248, 249, 250], halign: 'left' }
      }]);

      // Agregar fila de Tipo de Cambio si es USD
      const codigoValor = valorData.apertura?.codigo || valorData.cierre?.codigo;
      const tcValor = valorData.apertura?.tc || valorData.cierre?.tc || '0.00';
      if (codigoValor === 'USD') {
        rows.push([
          {
            content: 'Tipo de cambio',
            styles: { fontStyle: 'italic', fillColor: [255, 243, 205] } // Color amarillo claro
          },
          {
            content: `S/. ${tcValor}`,
            colSpan: totalCols - 1,
            styles: { fontStyle: 'bold', fillColor: [255, 243, 205], halign: 'center' }
          }
        ]);
      }

      // Obtener denominaciones
      const denominacionesApertura = valorData.apertura?.denominaciones || [];
      const denominacionesCierre = valorData.cierre?.denominaciones || [];

      // Crear mapa de denominaciones
      const denomMap = new Map<number, any>();

      denominacionesApertura.forEach((denom: any) => {
        denomMap.set(denom.denominacion_id, {
          denominacion_id: denom.denominacion_id,
          descripcion: denom.descripcion,
          total_importe: denom.total_importe,
          apertura: denom,
          cierre: null
        });
      });

      denominacionesCierre.forEach((denom: any) => {
        if (denomMap.has(denom.denominacion_id)) {
          denomMap.get(denom.denominacion_id).cierre = denom;
        } else {
          denomMap.set(denom.denominacion_id, {
            denominacion_id: denom.denominacion_id,
            descripcion: denom.descripcion,
            total_importe: denom.total_importe,
            apertura: null,
            cierre: denom
          });
        }
      });

      // Generar fila por cada denominación
      denomMap.forEach((denomData) => {
        const row: any[] = [denomData.descripcion];

        // Cajas de Apertura
        if (denomData.apertura) {
          cajasApertura.forEach((caja: any) => {
            const cajaData = denomData.apertura.cajas?.find((c: any) => c.caja_id === caja.caja_id);
            row.push(`${cajaData?.cantidad}`);
          });
        } else {
          cajasApertura.forEach(() => row.push('-'));
        }
        row.push({
          content: `${simbolo} ${denomData.total_importe}`,
          styles: { fontStyle: 'bold', fillColor: [220, 220, 220], halign: 'right' } // Gris claro, alineado a la derecha
        });

        // Cajas de Cierre
        if (denomData.cierre) {
          cajasCierre.forEach((caja: any) => {
            const cajaData = denomData.cierre.cajas?.find((c: any) => c.caja_id === caja.caja_id);
            row.push(`${cajaData.cantidad}`);
          });
        } else {
          cajasCierre.forEach(() => row.push('-'));
        }
        row.push({
          content: `${simbolo} ${denomData.total_importe}`,
          styles: { fontStyle: 'bold', fillColor: [220, 220, 220], halign: 'right' } // Gris claro, alineado a la derecha
        });

        rows.push(row);
      });
    });

    // Fila de totales
    const totalApertura = inventarioApertura?.total || '0.00';
    const totalCierre = inventarioCierre?.total || '0.00';

    const rowTotal: any[] = [{ content: 'TOTAL', styles: { fontStyle: 'bold' } }];
    for (let i = 0; i < cajasApertura.length; i++) {
      rowTotal.push('');
    }
    rowTotal.push({
      content: `${simbolo} ${totalApertura}`,
      styles: { fontStyle: 'bold', fillColor: [200, 200, 200], halign: 'right' } // Gris medio, alineado a la derecha
    });
    for (let i = 0; i < cajasCierre.length; i++) {
      rowTotal.push('');
    }
    rowTotal.push({
      content: `${simbolo} ${totalCierre}`,
      styles: { fontStyle: 'bold', fillColor: [200, 200, 200], halign: 'right' } // Gris medio, alineado a la derecha
    });

    rows.push(rowTotal);

    autoTable(doc, {
      startY: startY,
      head: [titleRow, headers, subHeaders],
      body: rows,
      theme: 'striped',
      styles: { fontSize: 6, cellPadding: 1.1 }, // Aumentado de 0.5 a 1.5 para más espacio vertical
      headStyles: { fillColor: [128, 128, 128], textColor: 255, fontStyle: 'bold', fontSize: 6 }, // Gris oscuro
      columnStyles: {
        0: { cellWidth: 23 }
      },
      margin: { left: xStart, right: doc.internal.pageSize.getWidth() - xStart - tableWidth }
    });
  }
  /**
   * Genera la tabla de Suma Diaria de Efectivo
   */
  private generarTablaSumaDiaria(
    doc: jsPDF,
    categorias: any[],
    total: any,
    startY: number,
    simbolo: string,
    xStart: number,
    tableWidth: number
  ): void {
    // Fila de título "Suma Diaria de Efectivo"
    const titleRow = [{
      content: 'Suma Diaria de Efectivo',
      colSpan: 2,
      styles: {
        halign: 'center',
        fillColor: [169, 169, 169], // Gris medio
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8
      }
    }];

    const headers = [{content: 'Descripción', styles: { halign: 'left'}}];
    headers.push({
      content: 'Importe',
      styles: { halign: 'right'}
    });
    const rows: any[] = [];

    categorias.forEach(categoria => {
      // Fila de categoría con colores grises según tipo
      const colorFondo = categoria.tipo_operacion === 'ingreso' ? [200, 200, 200] : // Gris claro
                         categoria.tipo_operacion === 'egreso' ? [180, 180, 180] :  // Gris medio
                         [220, 220, 220]; // Gris muy claro

      rows.push([{
        content: `${categoria.nombre}`,
        colSpan: 2,
        styles: {
          fontStyle: 'bold',
          fillColor: colorFondo,
          halign: 'left'
        }
      }]);

      // Items de la categoría
      categoria.items?.forEach((item: any) => {
        rows.push([
          item.nombre,
          `${simbolo} ${item.importe}`
        ]);
      });
    });

    // Fila de total
    rows.push([
      { content: 'TOTAL', styles: { fontStyle: 'bold' } },
      { content: `${simbolo} ${total}`, styles: { fontStyle: 'bold' } }
    ]);

    autoTable(doc, {
      startY: startY,
      head: [titleRow, headers],
      body: rows,
      theme: 'striped',
      styles: { fontSize: 6, cellPadding: 0.9 }, // Aumentado de 0.5 a 1.5 para más espacio vertical
      headStyles: { fillColor: [128, 128, 128], textColor: 255, fontStyle: 'bold', fontSize: 6 }, // Gris oscuro
      columnStyles: {
        0: { cellWidth: tableWidth * 0.65, halign: 'left' },
        1: { cellWidth: tableWidth * 0.35, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: xStart, right: doc.internal.pageSize.getWidth() - xStart - tableWidth }
    });
  }
}
