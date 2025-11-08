import jsPDF from 'jspdf';
import { SupplementationCochoInputs, SupplementationCochoCalculations, formatNumber } from './supplementation-cocho-calculator';

export function generateSupplementationCochoPDF(
  inputs: SupplementationCochoInputs,
  calculations: SupplementationCochoCalculations
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Calculo de Suplementacao no Cocho', pageWidth / 2, yPos, { align: 'center' });

  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  if (inputs.title) {
    doc.text(inputs.title, pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
  }

  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPos, { align: 'center' });

  yPos += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados de Entrada', 14, yPos);

  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const inputData = [
    ['Quantidade de Cabecas:', inputs.quantity_heads.toString()],
    ['Peso Medio do Rebanho:', formatNumber(inputs.average_weight_kg, 2) + ' kg'],
    ['Tipo de Suplementacao:', inputs.supplementation_type],
    ['Percentual de Consumo:', formatNumber(inputs.consumption_percentage, 2) + '%'],
    ['Peso do Saco:', formatNumber(inputs.bag_weight_kg, 0) + ' kg']
  ];

  inputData.forEach(([label, value]) => {
    doc.text(label, 14, yPos);
    doc.text(value, 100, yPos);
    yPos += 6;
  });

  yPos += 10;
  doc.setFillColor(34, 197, 94);
  doc.rect(14, yPos - 6, pageWidth - 28, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Resultados', 14 + 5, yPos);

  yPos += 10;
  doc.setFontSize(14);
  doc.text(
    `Consumo Diario: ${formatNumber(calculations.daily_consumption_kg, 2)} kg`,
    14 + 5,
    yPos
  );

  yPos += 10;
  doc.text(
    `Sacos por Dia: ${calculations.bags_per_day_rounded} sacos`,
    14 + 5,
    yPos
  );

  doc.setTextColor(0, 0, 0);

  yPos += 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Comparativo entre Tipos de Suplemento', 14, yPos);

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  doc.text('Tipo', 14, yPos);
  doc.text('Percentual', 80, yPos);
  doc.text('Kg/dia', 120, yPos);
  doc.text('Sacos/dia', 160, yPos);

  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, yPos, pageWidth - 14, yPos);

  yPos += 6;

  calculations.comparative_data.forEach((item) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    if (item.type === inputs.supplementation_type) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 197, 94);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }

    doc.text(item.type, 14, yPos);
    doc.text(`${formatNumber(item.percentage, 1)}%`, 80, yPos);
    doc.text(formatNumber(item.daily_kg, 2), 120, yPos);
    doc.text(item.bags.toString(), 160, yPos);

    yPos += 6;
  });

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  yPos += 10;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);

  const disclaimer = doc.splitTextToSize(
    'Calculadora de Suplementacao - resultado estimado com base no peso medio informado.',
    pageWidth - 28
  );

  disclaimer.forEach((line: string) => {
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
  });

  yPos += 6;
  doc.setFontSize(8);
  doc.text(
    `Relatorio gerado em ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}`,
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );

  doc.save(`suplementacao-cocho-${Date.now()}.pdf`);
}
