import jsPDF from 'jspdf';
import { BreakevenInputs, BreakevenCalculations, formatCurrency, formatNumber } from './breakeven-calculator';

export function generateBreakevenPDF(
  inputs: BreakevenInputs,
  calculations: BreakevenCalculations
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Cálculo do Ponto de Equilíbrio da Arroba', pageWidth / 2, yPos, { align: 'center' });

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
    ['Valor de Aquisição:', formatCurrency(inputs.acquisition_value)],
    ['Custo Diário por Animal:', formatCurrency(inputs.daily_cost)],
    ['Quantidade de Dias:', inputs.days_in_cycle.toString()],
    ['Peso Final (kg):', formatNumber(inputs.final_weight_kg, 2) + ' kg'],
    ['Valor Atual da Arroba:', formatCurrency(inputs.current_arroba_price)]
  ];

  inputData.forEach(([label, value]) => {
    doc.text(label, 14, yPos);
    doc.text(value, 100, yPos);
    yPos += 6;
  });

  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Cálculos Detalhados', 14, yPos);

  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const calculations_data = [
    ['Total de Arrobas Produzidas:', formatNumber(calculations.total_arrobas, 2)],
    ['Receita Total:', formatCurrency(calculations.total_revenue)],
    ['Total de Despesas:', formatCurrency(calculations.total_expenses)],
    ['', '']
  ];

  calculations_data.forEach(([label, value]) => {
    if (label === '') {
      yPos += 3;
      return;
    }
    doc.text(label, 14, yPos);
    doc.text(value, 100, yPos);
    yPos += 6;
  });

  yPos += 5;
  doc.setFillColor(240, 240, 240);
  doc.rect(14, yPos - 6, pageWidth - 28, 45, 'F');

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Resultado do Ponto de Equilíbrio', 14 + 5, yPos);

  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');

  const breakEvenColor = [34, 139, 230];
  doc.setTextColor(...breakEvenColor);
  doc.text(
    `Ponto de Equilíbrio: ${formatCurrency(calculations.breakeven_price)}/@`,
    14 + 5,
    yPos
  );

  yPos += 10;
  const profitColor = calculations.profit_per_arroba >= 0 ? [22, 163, 74] : [220, 38, 38];
  doc.setTextColor(...profitColor);
  doc.text(
    `${calculations.profit_per_arroba >= 0 ? 'Lucro' : 'Prejuízo'} por Arroba: ${formatCurrency(Math.abs(calculations.profit_per_arroba))}/@`,
    14 + 5,
    yPos
  );

  yPos += 10;
  doc.text(
    `Resultado Total: ${formatCurrency(Math.abs(calculations.final_result))}`,
    14 + 5,
    yPos
  );

  doc.setTextColor(0, 0, 0);

  yPos += 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Análise:', 14, yPos);

  yPos += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const interpretationLines = doc.splitTextToSize(
    calculations.interpretation.message,
    pageWidth - 28
  );

  interpretationLines.forEach((line: string) => {
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 14, yPos);
    yPos += 5;
  });

  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Comparativo:', 14, yPos);

  yPos += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const comparison = [
    `- Preço de Mercado: ${formatCurrency(inputs.current_arroba_price)}/@`,
    `- Ponto de Equilíbrio: ${formatCurrency(calculations.breakeven_price)}/@`,
    `- Diferença: ${formatCurrency(Math.abs(calculations.profit_per_arroba))}/@`
  ];

  comparison.forEach((line) => {
    doc.text(line, 14, yPos);
    yPos += 5;
  });

  yPos += 10;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}`,
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );

  doc.save(`ponto-equilibrio-${Date.now()}.pdf`);
}
