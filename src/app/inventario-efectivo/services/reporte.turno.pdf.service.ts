import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ReporteTurnoPdfService {

  /**
   * Genera un PDF consolidado de 2 páginas:
   *   Página 1 — Inventario de Efectivo
   *   Página 2 — Suma Diaria de Efectivo
   */
  generarPdfReporteTurno(resumenData: any): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageHeight = doc.internal.pageSize.getHeight();
    const turnoAbierto = resumenData.abierta;

    // Página 1: Inventario de Efectivo
    this.agregarPaginaInventario(doc, resumenData, turnoAbierto);
    this.agregarFooter(doc);

    // Página 2: Suma Diaria — solo si el turno está cerrado
    if (!turnoAbierto) {
      doc.addPage();
      this.agregarPaginaSumaDiaria(doc, resumenData);
      this.agregarFooter(doc);
    }

    // Numeración de páginas unificada
    const totalPages = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.text(
        `Página ${i} de ${totalPages} - Generado el ${new Date().toLocaleString('es-PE')}`,
        doc.internal.pageSize.getWidth() / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    const fileName = `Reporte_Turno_${resumenData.turno_nombre}_${resumenData.apertura?.replace(/[: ]/g, '_')}.pdf`;
    doc.save(fileName);
  }

  // ─── Páginas ───────────────────────────────────────────────────────────────

  private agregarPaginaInventario(doc: jsPDF, resumenData: any, turnoAbierto: boolean): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let yPosition = this.agregarEncabezadoTurno(
      doc,
      'INVENTARIO DE EFECTIVO - TURNO ' + resumenData.turno_nombre?.toUpperCase(),
      resumenData
    );

    const tieneInventario = resumenData.inventario_apertura?.valores?.length > 0 ||
      (!turnoAbierto && resumenData.inventario_cierre?.valores?.length > 0);

    if (tieneInventario) {
      if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = 15; }
      this.generarTablaInventario(
        doc,
        resumenData.inventario_apertura,
        turnoAbierto ? null : resumenData.inventario_cierre,
        yPosition,
        resumenData.simbolo_moneda,
        10,
        pageWidth - 20
      );
    }
  }

  private agregarPaginaSumaDiaria(doc: jsPDF, resumenData: any): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let yPosition = this.agregarEncabezadoTurno(
      doc,
      'DETALLE DE MOVIMIENTOS - TURNO ' + resumenData.turno_nombre?.toUpperCase(),
      resumenData
    );

    if (resumenData.suma_diaria?.categorias?.length > 0) {
      if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = 15; }
      this.generarTablaSumaDiaria(
        doc,
        resumenData.suma_diaria.categorias,
        resumenData.suma_diaria.total,
        yPosition,
        resumenData.simbolo_moneda,
        10,
        pageWidth - 20
      );
    }
  }

  // ─── Helpers compartidos ───────────────────────────────────────────────────

  /** Escribe el título y la tabla de info del turno. Devuelve el Y siguiente. */
  private agregarEncabezadoTurno(doc: jsPDF, titulo: string, resumenData: any): number {
    const pageWidth = doc.internal.pageSize.getWidth();
    const yTitulo = 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(titulo, pageWidth / 2, yTitulo, { align: 'center' });

    autoTable(doc, {
      startY: yTitulo + 6,
      head: [['Sala', 'Apertura', 'Cierre', 'Gerente', 'Supervisor']],
      body: [[
        resumenData.sala || '-',
        resumenData.apertura || '-',
        resumenData.cierre || '-',
        resumenData.gerente || '-',
        resumenData.supervisor || '-'
      ]],
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 1, halign: 'center', valign: 'middle' },
      headStyles: { fillColor: [128, 128, 128], textColor: 255, fontStyle: 'bold', fontSize: 7, halign: 'center' },
      margin: { left: 10, right: 10 }
    });

    return (doc as any).lastAutoTable.finalY + 5;
  }

  /** Certificación, firmas y declaración jurada en la página activa. */
  private agregarFooter(doc: jsPDF): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const posicionYDeclaracion = pageHeight - 30;
    const posicionYFirmas = posicionYDeclaracion - 20;
    const posicionYCertificacion = posicionYFirmas - 25;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(15, posicionYCertificacion, pageWidth - 30, 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    const textoCert = 'YO CERTIFICO QUE HE CONTADO Y REGISTRADO EL DINERO BAJO MI CUSTODIA DECLARANDO EN ESTE INVENTARIO DE EFECTIVO Y HE NOTIFICADO AL PERSONAL INDICADO CUALQUIER DISCREPANCIA';
    doc.text(doc.splitTextToSize(textoCert, pageWidth - 40), pageWidth / 2, posicionYCertificacion + 3.5, { align: 'center', maxWidth: pageWidth - 40 });

    const firmaWidth = 80;
    const firmaSpacing = (pageWidth - 30 - firmaWidth * 2) / 3;
    const firma1X = 15 + firmaSpacing;
    const firma2X = firma1X + firmaWidth + firmaSpacing;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    [{ x: firma1X, label: 'GERENTE DE SALA' }, { x: firma2X, label: 'SUPERVISOR DE TURNO' }].forEach(({ x, label }) => {
      doc.line(x, posicionYFirmas, x + firmaWidth, posicionYFirmas);
      doc.text(label, x + firmaWidth / 2, posicionYFirmas + 4, { align: 'center' });
      doc.text('D.N.I.:', x + firmaWidth / 2, posicionYFirmas + 8, { align: 'right' });
    });

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(15, posicionYDeclaracion, pageWidth - 30, 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    const textoDecl = 'La información contenida en el presente documento tiene carácter de DECLARACIÓN JURADA. La sala, tomará en cuenta la información en ella consignada, reservándose el derecho de llevar a cabo las verificaciones correspondientes. En caso de detectarse que se ha omitido, ocultado o consignado información falsa, se procederá con las acciones administrativas y/o penales que corresponda.';
    doc.text(doc.splitTextToSize(textoDecl, pageWidth - 40), pageWidth / 2, posicionYDeclaracion + 4, { align: 'center', maxWidth: pageWidth - 40 });
  }

  // ─── Tablas ────────────────────────────────────────────────────────────────

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
    const tieneCierre = cajasCierre.length > 0 || (inventarioCierre?.valores?.length > 0);
    const totalColumnas = 1 + cajasApertura.length + 1 + (tieneCierre ? cajasCierre.length + 1 : 0);

    const titleRow: any[] = [{
      content: 'Inventario de efectivo',
      colSpan: totalColumnas,
      styles: { halign: 'center', fillColor: [169, 169, 169], textColor: 255, fontStyle: 'bold', fontSize: 8 }
    }];

    const headers: any[] = [
      { content: 'Descripción', colSpan: 1, styles: { fillColor: [211, 211, 211] } },
      { content: 'Apertura', colSpan: cajasApertura.length + 1, styles: { halign: 'center', fillColor: [211, 211, 211] } },
      ...(tieneCierre ? [{ content: 'Cierre', colSpan: cajasCierre.length + 1, styles: { halign: 'center', fillColor: [211, 211, 211] } }] : [])
    ];

    const subHeaders: any[] = [''];
    cajasApertura.forEach((c: any) => subHeaders.push(c.caja_nombre));
    subHeaders.push({ content: 'Total', styles: { halign: 'right' } });
    if (tieneCierre) {
      cajasCierre.forEach((c: any) => subHeaders.push(c.caja_nombre));
      subHeaders.push({ content: 'Total', styles: { halign: 'right' } });
    }

    const rows: any[] = [];
    const todosLosValores = new Map<number, any>();

    (inventarioApertura?.valores || []).forEach((v: any) =>
      todosLosValores.set(v.valor_id, { nombre: v.nombre, apertura: v, cierre: null })
    );
    (inventarioCierre?.valores || []).forEach((v: any) => {
      if (todosLosValores.has(v.valor_id)) {
        todosLosValores.get(v.valor_id).cierre = v;
      } else {
        todosLosValores.set(v.valor_id, { nombre: v.nombre, apertura: null, cierre: v });
      }
    });

    todosLosValores.forEach((valorData) => {
      rows.push([{
        content: valorData.nombre,
        colSpan: totalColumnas,
        styles: { fontStyle: 'bold', fillColor: [248, 249, 250], halign: 'left' }
      }]);

      const codigo = valorData.apertura?.codigo || valorData.cierre?.codigo;
      const tc = valorData.apertura?.tc || valorData.cierre?.tc || '0.00';
      if (codigo === 'USD') {
        rows.push([
          { content: 'Tipo de cambio', styles: { fontStyle: 'italic', fillColor: [255, 243, 205] } },
          { content: `S/. ${tc}`, colSpan: totalColumnas - 1, styles: { fontStyle: 'bold', fillColor: [255, 243, 205], halign: 'center' } }
        ]);
      }

      const denomMap = new Map<number, any>();
      (valorData.apertura?.denominaciones || []).forEach((d: any) =>
        denomMap.set(d.denominacion_id, { descripcion: d.descripcion, total_importe: d.total_importe, apertura: d, cierre: null })
      );
      (valorData.cierre?.denominaciones || []).forEach((d: any) => {
        if (denomMap.has(d.denominacion_id)) {
          denomMap.get(d.denominacion_id).cierre = d;
        } else {
          denomMap.set(d.denominacion_id, { descripcion: d.descripcion, total_importe: d.total_importe, apertura: null, cierre: d });
        }
      });

      denomMap.forEach((dd) => {
        const row: any[] = [dd.descripcion];
        if (dd.apertura) {
          cajasApertura.forEach((c: any) => row.push(`${dd.apertura.cajas?.find((x: any) => x.caja_id === c.caja_id)?.cantidad ?? '-'}`));
        } else {
          cajasApertura.forEach(() => row.push('-'));
        }
        row.push({ content: `${simbolo} ${dd.apertura?.total_importe ?? '0.00'}`, styles: { fontStyle: 'bold', fillColor: [220, 220, 220], halign: 'right' } });
        if (tieneCierre) {
          if (dd.cierre) {
            cajasCierre.forEach((c: any) => row.push(`${dd.cierre.cajas?.find((x: any) => x.caja_id === c.caja_id)?.cantidad ?? '-'}`));
          } else {
            cajasCierre.forEach(() => row.push('-'));
          }
          row.push({ content: `${simbolo} ${dd.cierre?.total_importe ?? '0.00'}`, styles: { fontStyle: 'bold', fillColor: [220, 220, 220], halign: 'right' } });
        }
        rows.push(row);
      });
    });

    const rowTotal: any[] = [{ content: 'TOTAL', styles: { fontStyle: 'bold' } }];
    cajasApertura.forEach((_: any, i: number) => {
      const colTotal = inventarioApertura?.totales_columnas?.[i] ?? '0.00';
      rowTotal.push({ content: `${simbolo} ${colTotal}`, styles: { fontStyle: 'bold', fillColor: [200, 200, 200], halign: 'left' } });
    });
    rowTotal.push({ content: `${simbolo} ${inventarioApertura?.total || '0.00'}`, styles: { fontStyle: 'bold', fillColor: [200, 200, 200], halign: 'right' } });
    if (tieneCierre) {
      cajasCierre.forEach((_: any, i: number) => {
        const colTotal = inventarioCierre?.totales_columnas?.[i] ?? '0.00';
        rowTotal.push({ content: `${simbolo} ${colTotal}`, styles: { fontStyle: 'bold', fillColor: [200, 200, 200], halign: 'left' } });
      });
      rowTotal.push({ content: `${simbolo} ${inventarioCierre?.total || '0.00'}`, styles: { fontStyle: 'bold', fillColor: [200, 200, 200], halign: 'right' } });
    }
    rows.push(rowTotal);

    autoTable(doc, {
      startY,
      head: [titleRow, headers, subHeaders],
      body: rows,
      theme: 'striped',
      styles: { fontSize: 6, cellPadding: 1.1 },
      headStyles: { fillColor: [128, 128, 128], textColor: 255, fontStyle: 'bold', fontSize: 6 },
      columnStyles: { 0: { cellWidth: 23 } },
      margin: { left: xStart, right: doc.internal.pageSize.getWidth() - xStart - tableWidth }
    });
  }

  private generarTablaSumaDiaria(
    doc: jsPDF,
    categorias: any[],
    total: any,
    startY: number,
    simbolo: string,
    xStart: number,
    tableWidth: number
  ): void {
    const titleRow = [{
      content: 'Detalle de movimientos',
      colSpan: 2,
      styles: { halign: 'center', fillColor: [169, 169, 169], textColor: 255, fontStyle: 'bold', fontSize: 8 }
    }];

    const headers: any[] = [
      { content: 'Descripción', styles: { halign: 'left' } },
      { content: 'Importe',     styles: { halign: 'right' } }
    ];

    const rows: any[] = [];
    categorias.forEach((cat: any) => {
      const colorFondo = cat.tipo_operacion === 'ingreso' ? [200, 200, 200] :
                         cat.tipo_operacion === 'egreso'  ? [180, 180, 180] : [220, 220, 220];
      rows.push([{ content: cat.nombre, styles: { fontStyle: 'bold', fillColor: colorFondo, halign: 'left' } },
                { content: `${simbolo} ${cat.total}`, styles: { fontStyle: 'bold', fillColor: colorFondo} }
      ]);
      cat.items?.forEach((item: any) => rows.push([item.nombre, `${simbolo} ${item.importe}`]));
    });
    rows.push([
      { content: 'TOTAL', styles: { fontStyle: 'bold' } },
      { content: `${simbolo} ${total}`, styles: { fontStyle: 'bold', halign: 'right' } }
    ]);

    autoTable(doc, {
      startY,
      head: [titleRow, headers],
      body: rows,
      theme: 'striped',
      styles: { fontSize: 6, cellPadding: 0.9 },
      headStyles: { fillColor: [128, 128, 128], textColor: 255, fontStyle: 'bold', fontSize: 6 },
      columnStyles: {
        0: { cellWidth: tableWidth * 0.7, halign: 'left' },
        1: { cellWidth: tableWidth * 0.3, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: xStart, right: doc.internal.pageSize.getWidth() - xStart - tableWidth }
    });
  }
}
