import jsPDF from 'jspdf';
import { SimulationInputs, SimulationResults } from './calculations';

export function generatePDF(inputs: SimulationInputs, results: SimulationResults) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number, decimals = 2) => {
    return value.toFixed(decimals);
  };

  const addText = (text: string, x: number, size: number = 10, style: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.text(text, x, yPos);
  };

  const addLine = () => {
    yPos += 2;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 8;
  };

  const addSection = (title: string) => {
    yPos += 5;
    doc.setFillColor(34, 197, 94);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    addText(title, 17, 12, 'bold');
    doc.setTextColor(0, 0, 0);
    yPos += 10;
  };

  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Pecuaria Simulador Pro', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Relatorio de Simulacao', pageWidth / 2, 30, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPos = 50;

  addSection('INFORMACOES DO REBANHO');
  addText(`Descricao: ${inputs.herd_description}`, 17);
  yPos += 6;
  addText(`Quantidade: ${inputs.quantity} animais`, 17);
  yPos += 6;
  addText(`Peso Inicial: ${formatNumber(inputs.initial_weight)} kg`, 17);
  addText(`Peso Final: ${formatNumber(inputs.final_weight)} kg`, pageWidth / 2);
  yPos += 6;
  addText(`Peso a Ganhar: ${formatNumber(results.weight_to_gain)} kg`, 17);
  addText(`GMD: ${formatNumber(inputs.average_daily_gain, 3)} kg/dia`, pageWidth / 2);
  yPos += 6;
  addText(`Meses ate Venda: ${formatNumber(results.months_to_sell)} meses`, 17);
  yPos += 2;

  addSection('RESUMO FINANCEIRO');
  yPos += 2;
  addText('RECEITA TOTAL:', 17, 11, 'bold');
  addText(formatCurrency(results.total_revenue), pageWidth - 60, 11, 'bold');
  yPos += 8;
  addLine();

  addText('Custo de Reposicao:', 17);
  addText(formatCurrency(results.acquisition_costs), pageWidth - 60);
  yPos += 6;
  addText('Arrendamento:', 17);
  addText(formatCurrency(results.lease_costs), pageWidth - 60);
  yPos += 6;
  addText('Mao de Obra:', 17);
  addText(formatCurrency(results.labor_costs), pageWidth - 60);
  yPos += 6;
  addText('Suplementacao:', 17);
  addText(formatCurrency(results.supplement_costs), pageWidth - 60);
  yPos += 6;
  addText('Outras Despesas:', 17);
  addText(formatCurrency(results.other_costs), pageWidth - 60);
  yPos += 8;

  addLine();
  addText('TOTAL DESPESAS:', 17, 11, 'bold');
  addText(formatCurrency(results.total_expenses), pageWidth - 60, 11, 'bold');
  yPos += 10;

  addLine();

  const isProfit = results.result_per_animal * inputs.quantity > 0;
  addText('RESULTADO TOTAL:', 17, 12, 'bold');
  doc.setTextColor(isProfit ? 34 : 239, isProfit ? 197 : 68, isProfit ? 94 : 68);
  addText(formatCurrency(results.result_per_animal * inputs.quantity), pageWidth - 60, 12, 'bold');
  doc.setTextColor(0, 0, 0);
  yPos += 12;

  addSection('INDICADORES');
  addText(`Margem de Lucro: ${formatNumber(results.profit_margin_percentage)}%`, 17);
  yPos += 6;
  addText(`Resultado por Animal: ${formatCurrency(results.result_per_animal)}`, 17);
  yPos += 6;
  addText(`Custo por Arroba: ${formatCurrency(results.cost_per_arroba)}`, 17);
  yPos += 6;
  addText(`Custo Mensal Total por Cabeca: ${formatCurrency(results.monthly_cost_total)}`, 17);
  yPos += 10;

  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Gerado em: ' + new Date().toLocaleString('pt-BR'), pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

  doc.save(`Simulacao_${inputs.herd_description}_${new Date().getTime()}.pdf`);
}
