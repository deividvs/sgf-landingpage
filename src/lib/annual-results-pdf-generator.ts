import jsPDF from 'jspdf';
import { AnnualResultsInputs, AnnualResultsCalculations, formatCurrency, formatNumber } from './annual-results-calculator';

export function generateAnnualResultsPDF(
  inputs: AnnualResultsInputs,
  calculations: AnnualResultsCalculations
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Apuração de Resultados Anuais', pageWidth / 2, yPos, { align: 'center' });

  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ano: ${inputs.year}`, pageWidth / 2, yPos, { align: 'center' });

  if (inputs.title) {
    yPos += 6;
    doc.text(inputs.title, pageWidth / 2, yPos, { align: 'center' });
  }

  yPos += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Cálculo de Receita', 14, yPos);

  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const revenueData = [
    ['Total de Cabeças:', inputs.total_heads.toLocaleString('pt-BR')],
    ['Peso Final Médio:', `${formatNumber(inputs.final_average_weight_kg, 1)} kg`],
    ['Rendimento de Carcaça:', `${formatNumber(inputs.carcass_yield_percentage, 1)}%`],
    ['Peso de Carcaça:', `${formatNumber(calculations.carcass_weight_kg, 1)} kg`],
    ['Arrobas por Cabeça:', `${formatNumber(calculations.arrobas_per_head, 2)} @`],
    ['Total de Arrobas:', `${formatNumber(calculations.total_arrobas, 1)} @`],
    ['Preço da Arroba:', formatCurrency(inputs.arroba_price)],
    ['Receita Total:', formatCurrency(calculations.total_revenue)]
  ];

  revenueData.forEach(([label, value], index) => {
    if (index === revenueData.length - 1) {
      doc.setFont('helvetica', 'bold');
    }
    doc.text(label, 14, yPos);
    doc.text(value, 100, yPos);
    yPos += 6;
  });

  yPos += 5;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Custos de Aquisicao', 14, yPos);

  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const acquisitionCosts = [
    ['Compra de Gado:', formatCurrency(inputs.cattle_purchase_cost)],
    ['Fretes:', formatCurrency(inputs.freight_cost)],
    ['Comissoes:', formatCurrency(inputs.commission_cost)],
    ['Total de Custos:', formatCurrency(calculations.total_cost)]
  ];

  acquisitionCosts.forEach(([label, value], index) => {
    if (index === acquisitionCosts.length - 1) {
      doc.setFont('helvetica', 'bold');
    }
    doc.text(label, 14, yPos);
    doc.text(value, 100, yPos);
    yPos += 6;
  });

  yPos += 5;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Despesas Operacionais', 14, yPos);

  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const operationalExpenses = [
    ['Pessoal:', formatCurrency(inputs.personnel_cost)],
    ['Aluguel de Pastos:', formatCurrency(inputs.pasture_lease_cost)],
    ['Racao/Suplementos/Medicamentos:', formatCurrency(inputs.feed_supplement_medicine_cost)],
    ['Taxas e Impostos:', formatCurrency(inputs.taxes_fees_cost)],
    ['Manutencao/Infraestrutura:', formatCurrency(inputs.infrastructure_maintenance_cost)],
    ['Outras Despesas:', formatCurrency(inputs.other_expenses_cost)],
    ['Total de Despesas:', formatCurrency(calculations.total_operational_expenses)]
  ];

  operationalExpenses.forEach(([label, value], index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    if (index === operationalExpenses.length - 1) {
      doc.setFont('helvetica', 'bold');
    }
    doc.text(label, 14, yPos);
    doc.text(value, 100, yPos);
    yPos += 6;
  });

  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  yPos += 5;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Indicadores por Cabeça', 14, yPos);

  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const perHeadMetrics = [
    ['Receita Média:', formatCurrency(calculations.revenue_per_head)],
    ['Custo por Cabeça:', formatCurrency(calculations.cost_per_head)],
    ['Despesa por Cabeça:', formatCurrency(calculations.expense_per_head)],
    ['Lucro por Cabeça:', formatCurrency(calculations.profit_per_head)]
  ];

  perHeadMetrics.forEach(([label, value]) => {
    doc.text(label, 14, yPos);
    doc.text(value, 100, yPos);
    yPos += 6;
  });

  yPos += 10;
  doc.setFillColor(240, 240, 240);
  doc.rect(14, yPos - 6, pageWidth - 28, 50, 'F');

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Resultado Final', 14 + 5, yPos);

  yPos += 8;
  doc.setFontSize(14);

  const resultColor = calculations.final_result >= 0 ? [22, 163, 74] : [220, 38, 38];
  doc.setTextColor(...resultColor);
  doc.text(
    `${calculations.final_result >= 0 ? 'Lucro Total' : 'Prejuizo Total'}: ${formatCurrency(Math.abs(calculations.final_result))}`,
    14 + 5,
    yPos
  );

  yPos += 8;
  const marginColor = calculations.profit_margin_percentage >= 0 ? [22, 163, 74] : [220, 38, 38];
  doc.setTextColor(...marginColor);
  doc.text(
    `Margem de Lucro Global: ${formatNumber(calculations.profit_margin_percentage, 2)}%`,
    14 + 5,
    yPos
  );

  doc.setTextColor(0, 0, 0);

  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Distribuicao sobre Receita Total (por cabeca):', 14 + 5, yPos);

  yPos += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const distributionData = [
    ['Receitas:', formatCurrency(calculations.revenue_per_head), '100,00%'],
    ['Custos:', formatCurrency(calculations.cost_per_head), `${formatNumber(calculations.cost_percentage, 2)}%`],
    ['Despesas:', formatCurrency(calculations.expense_per_head), `${formatNumber(calculations.expense_percentage, 2)}%`],
    ['Lucro:', formatCurrency(calculations.profit_per_head), `${formatNumber(calculations.profit_percentage, 2)}%`]
  ];

  distributionData.forEach(([label, value, percentage]) => {
    doc.text(label, 14 + 5, yPos);
    doc.text(value, 80, yPos);
    doc.text(percentage, 140, yPos);
    yPos += 5;
  });

  doc.setTextColor(0, 0, 0);

  yPos += 15;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Analise:', 14, yPos);

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
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Relatorio gerado em ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}`,
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );

  doc.save(`apuracao-anual-${inputs.year}.pdf`);
}
