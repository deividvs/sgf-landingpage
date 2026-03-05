import jsPDF from 'jspdf';
import type { ProductionCostInputs, ProductionCostResults } from './production-cost-calculator';

export function generateProductionCostPDF(
  inputs: ProductionCostInputs,
  results: ProductionCostResults,
  title: string = 'Cálculo de Custo de Produção'
) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPos = 20;

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Pecuária Simulador Pro', pageWidth / 2, yPos, { align: 'center' });

  yPos += 10;
  pdf.setFontSize(14);
  pdf.text(title, pageWidth / 2, yPos, { align: 'center' });

  yPos += 15;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, yPos);

  yPos += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dados de Entrada', 20, yPos);

  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const entryData = [
    ['Quantidade de Animais:', `${inputs.quantity_animals} cabeças`],
    ['Arrendamento Mensal:', `R$ ${inputs.lease_monthly.toFixed(2)}`],
    ['Suplementação Mensal:', `R$ ${inputs.supplementation_monthly.toFixed(2)}`],
    ['Mão de Obra Mensal:', `R$ ${inputs.labor_monthly.toFixed(2)}`],
    ['Custos Variáveis Mensais:', `R$ ${inputs.variable_costs_monthly.toFixed(2)}`],
    ['GMD (Ganho Médio Diário):', `${inputs.gmd_kg.toFixed(3)} kg/dia`],
    ['Rendimento de Carcaça:', `${inputs.carcass_yield_percentage.toFixed(1)}%`],
  ];

  entryData.forEach(([label, value]) => {
    pdf.text(label, 20, yPos);
    pdf.text(value, 120, yPos);
    yPos += 6;
  });

  yPos += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Resultados', 20, yPos);

  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const resultsData = [
    ['Despesa Mensal Total:', `R$ ${results.total_monthly_expense.toFixed(2)}`],
    ['Despesa Mensal por Animal:', `R$ ${results.monthly_expense_per_animal.toFixed(2)}`],
    ['Custo Diário por Animal:', `R$ ${results.daily_cost_per_animal.toFixed(2)}/dia`],
    ['Dias p/ Produzir 1@ Carcaça:', `${results.days_per_arroba.toFixed(2)} dias`],
    ['Custo por Arroba Produzida:', `R$ ${results.cost_per_arroba.toFixed(2)}/@`],
  ];

  resultsData.forEach(([label, value]) => {
    pdf.text(label, 20, yPos);
    pdf.text(value, 120, yPos);
    yPos += 6;
  });

  yPos += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');

  let classificationText = '';
  let classificationColor: [number, number, number] = [0, 0, 0];

  switch (results.classification) {
    case 'excelente':
      classificationText = 'Excelente Eficiência';
      classificationColor = [22, 163, 74];
      break;
    case 'media':
      classificationText = 'Dentro da Média';
      classificationColor = [234, 179, 8];
      break;
    case 'alto_custo':
      classificationText = 'Alto Custo - Precisa Revisar';
      classificationColor = [220, 38, 38];
      break;
  }

  pdf.setTextColor(...classificationColor);
  pdf.text(`Classificação: ${classificationText}`, 20, yPos);
  pdf.setTextColor(0, 0, 0);

  yPos += 15;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Interpretação:', 20, yPos);

  yPos += 6;
  pdf.setFont('helvetica', 'normal');

  const interpretations = [
    'Custo < R$ 270/@ = Excelente eficiência',
    'Custo entre R$ 270 e R$ 320/@ = Dentro da média',
    'Custo > R$ 320/@ = Alto custo, necessita revisão'
  ];

  interpretations.forEach((text) => {
    pdf.text(`• ${text}`, 25, yPos);
    yPos += 5;
  });

  yPos += 10;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Relatório gerado automaticamente pelo Pecuária Simulador Pro', pageWidth / 2, yPos, {
    align: 'center',
  });

  pdf.save(`custo-producao-${new Date().getTime()}.pdf`);
}
