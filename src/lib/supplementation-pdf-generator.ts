import jsPDF from 'jspdf';
import { SupplementationInputs, SupplementationResults, SUPPLEMENTATION_TYPES } from './supplementation-calculator';

export function generateSupplementationPDF(inputs: SupplementationInputs, results: SupplementationResults) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  pdf.setFillColor(22, 163, 74);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Relatório - Cálculo de Suplementação', pageWidth / 2, 20, { align: 'center' });

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

  pdf.setFillColor(22, 163, 74);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  const typeLabel = SUPPLEMENTATION_TYPES[inputs.supplementation_type]?.label || 'Personalizado';
  pdf.text(`Tipo de Suplementação: ${typeLabel}`, pageWidth / 2, yPosition + 15, { align: 'center' });

  yPosition += 40;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dados de Entrada', margin, yPosition);

  yPosition += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  const inputData = [
    ['Quantidade de Animais:', `${inputs.animal_quantity} cabeças`],
    ['Peso Médio do Rebanho:', `${inputs.average_weight_kg.toFixed(1)} kg`],
    ['Tipo de Suplementação:', typeLabel],
    ['Percentual de Consumo:', `${inputs.consumption_percentage}%`],
    ['Peso do Saco:', `${inputs.bag_weight_kg} kg`],
  ];

  inputData.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 80, yPosition);
    yPosition += 7;
  });

  yPosition += 10;
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'F');
  yPosition += 8;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Resultados do Cálculo', margin + 5, yPosition);

  yPosition += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  const resultsData = [
    ['Consumo Diário Total:', `${results.daily_consumption_kg.toFixed(1)} kg`],
    ['Sacos por Dia (Exato):', `${results.bags_per_day.toFixed(2)} sacos`],
    ['Sacos por Dia (Arredondado):', `${results.bags_per_day_rounded} sacos`],
  ];

  resultsData.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin + 5, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 85, yPosition);
    yPosition += 7;
  });

  yPosition += 15;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Tabela Comparativa de Suplementação', margin, yPosition);

  yPosition += 8;

  pdf.setFillColor(100, 100, 100);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Tipo', margin + 2, yPosition + 6);
  pdf.text('% Consumo', margin + 60, yPosition + 6);
  pdf.text('Kg/dia', margin + 95, yPosition + 6);
  pdf.text('Sacos/dia', margin + 130, yPosition + 6);

  yPosition += 8;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  results.comparison_table.forEach((row, index) => {
    if (row.type === inputs.supplementation_type) {
      pdf.setFillColor(220, 252, 231);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 7, 'F');
      pdf.setFont('helvetica', 'bold');
    } else {
      if (index % 2 === 0) {
        pdf.setFillColor(249, 250, 251);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 7, 'F');
      }
      pdf.setFont('helvetica', 'normal');
    }

    pdf.text(row.type_label, margin + 2, yPosition + 5);
    pdf.text(`${row.percentage}%`, margin + 60, yPosition + 5);
    pdf.text(row.daily_kg.toFixed(1), margin + 95, yPosition + 5);
    pdf.text(row.bags_per_day.toString(), margin + 130, yPosition + 5);

    yPosition += 7;
  });

  yPosition += 10;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Fórmula de Cálculo', margin, yPosition);

  yPosition += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const formula = `Consumo Diário Total (kg) = Peso Médio × (% Consumo ÷ 100) × Quantidade de Animais`;
  const splitFormula = pdf.splitTextToSize(formula, pageWidth - 2 * margin);
  pdf.text(splitFormula, margin, yPosition);

  yPosition += 10;
  const example = `Exemplo: ${inputs.average_weight_kg} kg × ${inputs.consumption_percentage}% × ${inputs.animal_quantity} = ${results.daily_consumption_kg.toFixed(1)} kg/dia`;
  const splitExample = pdf.splitTextToSize(example, pageWidth - 2 * margin);
  pdf.text(splitExample, margin, yPosition);

  yPosition = pdf.internal.pageSize.getHeight() - 20;
  pdf.setFontSize(9);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Pecuária Simulador Pro - Relatório gerado automaticamente', pageWidth / 2, yPosition, {
    align: 'center',
  });

  const fileName = `Calculo_Suplementacao_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}
