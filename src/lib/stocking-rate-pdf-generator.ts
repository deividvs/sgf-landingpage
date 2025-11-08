import jsPDF from 'jspdf';
import { StockingRateInputs, StockingRateResults } from './stocking-rate-calculator';

export function generateStockingRatePDF(inputs: StockingRateInputs, results: StockingRateResults) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  pdf.setFillColor(20, 184, 166);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Relatório - Taxa de Lotação', pageWidth / 2, 20, { align: 'center' });

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

  let headerColor: [number, number, number];
  if (results.classification === 'ideal') {
    headerColor = [34, 197, 94];
  } else if (results.classification === 'underutilized') {
    headerColor = [234, 179, 8];
  } else {
    headerColor = [220, 38, 38];
  }

  pdf.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(results.classification_label, pageWidth / 2, yPosition + 15, { align: 'center' });

  yPosition += 40;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dados de Entrada', margin, yPosition);

  yPosition += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  const inputData = [
    ['Tamanho da Área:', `${inputs.area_ha.toFixed(1)} ha`],
    ['Quantidade de Animais:', `${inputs.animal_quantity} cabeças`],
    ['Peso Médio dos Animais:', `${inputs.average_weight_kg.toFixed(1)} kg`],
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
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F');
  yPosition += 8;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Resultados do Cálculo', margin + 5, yPosition);

  yPosition += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  const resultsData = [
    ['Peso Total do Rebanho:', `${results.total_weight_kg.toFixed(0)} kg`],
    ['Unidades Animais (UA):', `${results.total_animal_units.toFixed(2)} UA`],
    ['Taxa de Lotação:', `${results.stocking_rate_ua_ha.toFixed(2)} UA/ha`],
  ];

  resultsData.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin + 5, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 85, yPosition);
    yPosition += 7;
  });

  yPosition += 15;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Diagnóstico', margin, yPosition);

  yPosition += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const splitSuggestion = pdf.splitTextToSize(results.suggestion, pageWidth - 2 * margin);
  pdf.text(splitSuggestion, margin, yPosition);

  yPosition += splitSuggestion.length * 5 + 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Referência de Classificação', margin, yPosition);

  yPosition += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const classifications = [
    { label: 'Subutilização', range: '< 1 UA/ha', description: 'Potencial produtivo não explorado', color: [234, 179, 8] },
    { label: 'Ideal', range: '1 a 3 UA/ha', description: 'Área bem aproveitada', color: [34, 197, 94] },
    { label: 'Superlotação', range: '> 3 UA/ha', description: 'Risco de degradação da pastagem', color: [220, 38, 38] },
  ];

  classifications.forEach((item) => {
    pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
    pdf.circle(margin + 3, yPosition - 2, 3, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.text(item.label, margin + 10, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.range, margin + 50, yPosition);

    yPosition += 5;
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(item.description, margin + 10, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);

    yPosition += 8;
  });

  yPosition += 5;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Fórmulas de Cálculo', margin, yPosition);

  yPosition += 8;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  const formulas = [
    `1. Peso Total = Quantidade de Animais × Peso Médio`,
    `   ${inputs.animal_quantity} × ${inputs.average_weight_kg} kg = ${results.total_weight_kg.toFixed(0)} kg`,
    ``,
    `2. Unidades Animais (UA) = Peso Total ÷ 450 kg`,
    `   ${results.total_weight_kg.toFixed(0)} kg ÷ 450 = ${results.total_animal_units.toFixed(2)} UA`,
    ``,
    `3. Taxa de Lotação = UA Total ÷ Área (ha)`,
    `   ${results.total_animal_units.toFixed(2)} UA ÷ ${inputs.area_ha} ha = ${results.stocking_rate_ua_ha.toFixed(2)} UA/ha`,
  ];

  formulas.forEach((line) => {
    pdf.text(line, margin, yPosition);
    yPosition += 5;
  });

  yPosition = pdf.internal.pageSize.getHeight() - 20;
  pdf.setFontSize(9);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Pecuária Simulador Pro - Relatório gerado automaticamente', pageWidth / 2, yPosition, {
    align: 'center',
  });

  const fileName = `Taxa_Lotacao_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}
