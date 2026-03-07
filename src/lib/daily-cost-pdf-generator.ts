import jsPDF from 'jspdf';
import { DailyCostInputs, DailyCostResults } from './daily-cost-calculator';

export function generateDailyCostPDF(inputs: DailyCostInputs, results: DailyCostResults) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  pdf.setFillColor(16, 185, 129);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Relatório - Cálculo da Diária', pageWidth / 2, 20, { align: 'center' });

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${inputs.month}/${inputs.year}`, pageWidth / 2, 30, { align: 'center' });

  yPosition = 55;
  pdf.setTextColor(0, 0, 0);

  const headerColor: [number, number, number] = results.is_profitable ? [34, 197, 94] : [220, 38, 38];
  pdf.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  const resultText = results.is_profitable
    ? `LUCRO: ${formatCurrency(results.profit_per_arroba)} por arroba`
    : `PREJUÍZO: ${formatCurrency(Math.abs(results.profit_per_arroba))} por arroba`;
  pdf.text(resultText, pageWidth / 2, yPosition + 13, { align: 'center' });

  yPosition += 35;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Resumo Financeiro', margin, yPosition);

  yPosition += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const summary = [
    ['Custo Total Mensal:', formatCurrency(results.total_monthly_cost)],
    ['Total de Animais:', inputs.total_animals.toString()],
    ['Custo Diário por Animal:', formatCurrency(results.total_daily_cost)],
    ['Dias para Produzir 1 Arroba:', `${results.days_to_produce_arroba.toFixed(0)} dias`],
    ['Custo por Arroba:', formatCurrency(results.cost_per_arroba)],
    ['Preço de Mercado:', formatCurrency(inputs.market_arroba_price)],
    ['Margem por Arroba:', formatCurrency(results.profit_per_arroba)],
  ];

  summary.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 70, yPosition);
    yPosition += 6;
  });

  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Composição dos Custos', margin, yPosition);

  yPosition += 8;
  pdf.setFillColor(100, 100, 100);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 7, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Categoria', margin + 2, yPosition + 5);
  pdf.text('Valor', margin + 80, yPosition + 5);
  pdf.text('%', margin + 120, yPosition + 5);

  yPosition += 7;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');

  results.cost_breakdown_percentage
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .forEach((item, index) => {
      if (index % 2 === 0) {
        pdf.setFillColor(249, 250, 251);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 6, 'F');
      }
      pdf.text(item.category, margin + 2, yPosition + 4);
      pdf.text(formatCurrency(item.value), margin + 80, yPosition + 4);
      pdf.text(`${item.percentage.toFixed(1)}%`, margin + 120, yPosition + 4);
      yPosition += 6;
    });

  yPosition = pdf.internal.pageSize.getHeight() - 20;
  pdf.setFontSize(9);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Pecuária Simulador Pro - Relatório gerado automaticamente', pageWidth / 2, yPosition, { align: 'center' });

  const fileName = `Diaria_${inputs.month}_${inputs.year}.pdf`;
  pdf.save(fileName);
}
