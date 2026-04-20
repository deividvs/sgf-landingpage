import jsPDF from 'jspdf';
import { PremiumInputs, PremiumResults } from './premium-calculator';

export function generatePremiumPDF(inputs: PremiumInputs, results: PremiumResults) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  pdf.setFillColor(34, 197, 94);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Relatório - Diluição de Ágio', pageWidth / 2, 20, { align: 'center' });

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  pdf.text(`Data: ${currentDate}`, pageWidth / 2, 30, { align: 'center' });

  yPosition = 55;
  pdf.setTextColor(0, 0, 0);

  const situationColor =
    results.situation === 'premium'
      ? [220, 38, 38]
      : results.situation === 'discount'
      ? [34, 197, 94]
      : [107, 114, 128];

  pdf.setFillColor(situationColor[0], situationColor[1], situationColor[2]);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  const situationText =
    results.situation === 'premium'
      ? 'ÁGIO - Pagou Acima do Mercado'
      : results.situation === 'discount'
      ? 'DESÁGIO - Pagou Abaixo do Mercado'
      : 'NEUTRO - Preço de Mercado';
  pdf.text(situationText, pageWidth / 2, yPosition + 15, { align: 'center' });

  yPosition += 40;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dados de Entrada', margin, yPosition);

  yPosition += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  const inputData = [
    ['Valor da Arroba Atual:', formatCurrency(inputs.current_arroba_value)],
    ['Valor Pago pelo Animal:', formatCurrency(inputs.animal_paid_value)],
    ['Peso do Animal na Compra:', `${inputs.purchase_weight_kg.toFixed(1)} kg`],
    ['Período de Recria:', `${inputs.rearing_period_days} dias (${(inputs.rearing_period_days / 30).toFixed(1)} meses)`],
  ];

  inputData.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 80, yPosition);
    yPosition += 7;
  });

  yPosition += 5;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Resultados Calculados', margin, yPosition);

  yPosition += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  const resultsData = [
    ['Arrobas na Compra:', `${results.arrobas_at_purchase.toFixed(2)} @`],
    ['Custo por Kg Vivo:', formatCurrency(results.cost_per_kg)],
    ['Preço Pago por Arroba:', formatCurrency(results.paid_price_per_arroba)],
    ['Ágio/Deságio por Arroba:', formatCurrency(Math.abs(results.premium_discount_per_arroba))],
    ['Percentual:', `${Math.abs(results.premium_discount_percentage).toFixed(2)}% ${results.situation === 'premium' ? 'acima' : 'abaixo'} do mercado`],
    ['Total de Ágio/Deságio:', formatCurrency(Math.abs(results.total_premium_discount_per_animal))],
    ['Ágio Diário a Diluir:', formatCurrency(results.daily_premium_to_dilute)],
    ['GMD Necessário para Diluir:', `${results.daily_gain_needed_kg.toFixed(3)} kg/dia (${(results.daily_gain_needed_kg * 1000).toFixed(0)} g/dia)`],
  ];

  resultsData.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 80, yPosition);
    yPosition += 7;
  });

  yPosition += 10;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Análise e Interpretação', margin, yPosition);

  yPosition += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  let interpretation = '';
  if (results.situation === 'premium') {
    interpretation = `Você pagou R$ ${Math.abs(results.premium_discount_per_arroba).toFixed(2)} acima do preço de mercado por arroba. Para compensar este ágio de ${formatCurrency(Math.abs(results.total_premium_discount_per_animal))}, os animais precisam ganhar ${results.daily_gain_needed_kg.toFixed(3)} kg por dia durante o período de recria de ${inputs.rearing_period_days} dias.`;
  } else if (results.situation === 'discount') {
    interpretation = `Você pagou R$ ${Math.abs(results.premium_discount_per_arroba).toFixed(2)} abaixo do preço de mercado por arroba. Esta compra vantajosa representa um ganho de ${formatCurrency(Math.abs(results.total_premium_discount_per_animal))} por animal. O GMD necessário para diluir este deságio é de apenas ${results.daily_gain_needed_kg.toFixed(3)} kg/dia.`;
  } else {
    interpretation = `Você pagou o preço de mercado. Esta compra está equilibrada com os valores praticados no mercado atual.`;
  }

  const splitText = pdf.splitTextToSize(interpretation, pageWidth - 2 * margin);
  pdf.text(splitText, margin, yPosition);

  yPosition = pdf.internal.pageSize.getHeight() - 20;
  pdf.setFontSize(9);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Pecuária Simulador Pro - Relatório gerado automaticamente', pageWidth / 2, yPosition, {
    align: 'center',
  });

  const fileName = `Diluicao_Agio_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}
