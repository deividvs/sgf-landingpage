import jsPDF from 'jspdf';
import type { CarcassYieldInputs, CarcassYieldResults } from './carcass-yield-calculator';

export function generateCarcassYieldPDF(
  inputs: CarcassYieldInputs,
  results: CarcassYieldResults,
  title: string = 'Fechamento de Lote'
) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  let yPos = 20;

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const date = new Date().toLocaleDateString('pt-BR');
  pdf.text(`Data: ${date}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dados do Rebanho', 20, yPos);
  yPos += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Quantidade de Animais: ${inputs.quantity_animals} cabeças`, 20, yPos);
  yPos += 6;
  pdf.text(`GMD - Ganho Médio Diário: ${inputs.gmd_kg.toFixed(3)} kg/dia`, 20, yPos);
  yPos += 6;
  pdf.text(`Rendimento de Carcaça: ${inputs.carcass_yield_percentage}%`, 20, yPos);
  yPos += 12;

  if (inputs.final_weight_kg && inputs.arroba_price) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Dados de Venda', 20, yPos);
    yPos += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Peso Final Estimado: ${inputs.final_weight_kg} kg`, 20, yPos);
    yPos += 6;
    pdf.text(`Preço da Arroba: R$ ${inputs.arroba_price.toFixed(2)}`, 20, yPos);
    yPos += 12;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Resultados', 20, yPos);
  yPos += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  if (results.carcass_weight_per_animal) {
    pdf.text(
      `Peso de Carcaça por Animal: ${results.carcass_weight_per_animal.toFixed(2)} kg`,
      20,
      yPos
    );
    yPos += 6;
  }

  if (results.total_carcass_weight_kg) {
    pdf.text(
      `Peso Total de Carcaça: ${results.total_carcass_weight_kg.toFixed(2)} kg`,
      20,
      yPos
    );
    yPos += 6;
  }

  if (results.arrobas_per_animal) {
    pdf.text(
      `Arrobas por Animal: ${results.arrobas_per_animal.toFixed(2)} @`,
      20,
      yPos
    );
    yPos += 6;
  }

  if (results.total_arrobas) {
    pdf.text(`Total de Arrobas: ${results.total_arrobas.toFixed(2)} @`, 20, yPos);
    yPos += 6;
  }

  if (results.revenue_per_animal) {
    pdf.text(
      `Receita por Animal: R$ ${results.revenue_per_animal.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      20,
      yPos
    );
    yPos += 6;
  }

  if (results.total_revenue) {
    pdf.setFont('helvetica', 'bold');
    pdf.text(
      `Receita Total Estimada: R$ ${results.total_revenue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      20,
      yPos
    );
    yPos += 12;
    pdf.setFont('helvetica', 'normal');
  }

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Metodologia de Cálculo', 20, yPos);
  yPos += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const methodology = [
    '1. Peso de Carcaça por Animal = Peso Vivo × (Rendimento de Carcaça / 100)',
    '2. Peso Total de Carcaça = Peso de Carcaça por Animal × Quantidade de Animais',
    '3. Arrobas por Animal = Peso de Carcaça por Animal / 15 kg',
    '4. Total de Arrobas = Peso Total de Carcaça / 15 kg',
    '5. Receita por Animal = Arrobas por Animal × Preço da Arroba',
    '6. Receita Total = Total de Arrobas × Preço da Arroba',
  ];

  methodology.forEach((line) => {
    pdf.text(line, 20, yPos);
    yPos += 5;
  });

  yPos += 5;
  pdf.setFontSize(9);
  pdf.setTextColor(100);
  pdf.text(
    'Nota: 1 arroba = 15 kg de carcaça. O rendimento de carcaça típico varia entre 50% e 55%.',
    20,
    yPos
  );

  const footerY = pdf.internal.pageSize.height - 15;
  pdf.setFontSize(8);
  pdf.setTextColor(150);
  pdf.text('Gerado pelo Sistema de Simulação Pecuária', pageWidth / 2, footerY, {
    align: 'center',
  });

  pdf.save(`rendimento-carcaca-${new Date().getTime()}.pdf`);
}
