import jsPDF from 'jspdf';
import type { PurchaseSimulationResults } from './purchase-calculator';

export function generatePurchasePDF(
  results: PurchaseSimulationResults,
  title: string = 'Simulação de Compra de Gado'
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('SIMULAÇÃO DE COMPRA DE GADO', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;

  results.suppliers.forEach((supplier, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    const isBest = index === results.best_supplier_index;

    doc.setFillColor(isBest ? 34 : 60, isBest ? 197 : 60, isBest ? 94 : 60);
    doc.rect(10, yPosition - 5, pageWidth - 20, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `${supplier.name}${isBest ? ' ⭐ MELHOR OPÇÃO' : ''}`,
      15,
      yPosition
    );
    doc.setTextColor(0, 0, 0);

    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text(`Cidade/Estado: ${supplier.city}`, 15, yPosition);
    yPosition += 6;
    doc.text(`Distância: ${supplier.distance_km} km`, 15, yPosition);
    yPosition += 6;
    doc.text(`Quantidade: ${supplier.quantity} cabeças`, 15, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DA COMPRA', 15, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');

    doc.text(`Peso médio: ${supplier.weight_kg.toFixed(0)} kg`, 15, yPosition);
    yPosition += 5;
    doc.text(`Preço/kg: R$ ${supplier.price_per_kg.toFixed(2)}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Preço/Cabeça: R$ ${supplier.price_per_head.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 15, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOS ADICIONAIS', 15, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');

    doc.text(`Comissão: ${supplier.commission_percentage}% = R$ ${supplier.commission_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 15, yPosition);
    yPosition += 5;
    doc.text(`ICMS: ${supplier.icms_percentage}% = R$ ${supplier.icms_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Frete/km: R$ ${supplier.freight_per_km.toFixed(2)}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Pedágio: R$ ${supplier.toll_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Frete/Cabeça: R$ ${supplier.freight_per_head.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 15, yPosition);
    yPosition += 8;

    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPosition - 4, pageWidth - 20, 20, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PREÇO FINAL', 15, yPosition);
    yPosition += 6;

    doc.setFontSize(11);
    doc.text(`Por Cabeça: R$ ${supplier.final_price_per_head.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Lote Completo: R$ ${supplier.final_price_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Qualidade (0-10): ${supplier.quality_score}`, 15, yPosition);
    yPosition += 8;

    doc.setFillColor(220, 220, 220);
    doc.rect(10, yPosition - 4, pageWidth - 20, 12, 'F');

    doc.setFont('helvetica', 'bold');
    doc.text(`Custo/@: R$ ${supplier.cost_per_arroba.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 15, yPosition);
    doc.text(`Custo/Kg: R$ ${supplier.cost_per_kg.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, pageWidth / 2, yPosition);

    yPosition += 15;
  });

  const fileName = `simulacao_compra_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
