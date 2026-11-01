import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const teste = await readFile(new URL('../teste/index.html', import.meta.url), 'utf8');

const fullCheckout = 'https://pay.hotmart.com/S104906445L';
const simulatorCheckout = 'https://pay.hotmart.com/S104906445L?off=tccgcbrz&checkoutMode=6';

assert.match(root, new RegExp(`href="${fullCheckout}"`), 'A raiz deve manter o checkout anual atual.');
assert.doesNotMatch(root, /tccgcbrz/, 'A raiz não deve receber a oferta de entrada.');

assert.match(teste, /R\$\s*10,00/, 'A versão /teste deve mostrar R$ 10,00.');
assert.match(teste, /R\$\s*67,00/, 'A versão /teste deve mostrar R$ 67,00.');
assert.match(teste, /inclui somente o Simulador de Resultados/i, 'A oferta de R$ 10 deve limitar o acesso ao Simulador de Resultados.');
assert.match(teste, /não inclui as demais ferramentas do SGF/i, 'A limitação da oferta de R$ 10 deve ser explícita.');
assert.match(teste, new RegExp(`href="${simulatorCheckout.replace(/[?]/g, '\\?')}"`), 'A oferta de R$ 10 deve ter o checkout correto.');
assert.match(teste, new RegExp(`href="${fullCheckout}"`), 'A oferta anual deve ter o checkout correto.');

const checkoutAnchors = [...teste.matchAll(/<a\b[^>]*href="([^"]*pay\.hotmart\.com[^"]*)"[^>]*>([\s\S]*?)<\/a>/g)]
  .map(([, href, label]) => ({ href, label: label.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() }));
assert.ok(checkoutAnchors.length > 0, 'A versão /teste deve ter CTAs de checkout.');
for (const cta of checkoutAnchors) {
  assert.ok([fullCheckout, simulatorCheckout].includes(cta.href), `CTA de checkout inesperado: ${cta.href}`);
  const expectedLabel = cta.href === simulatorCheckout ? /SOMENTE O SIMULADOR/ : /ACESSO ANUAL COMPLETO/;
  assert.match(cta.label, expectedLabel, `CTA sem opção inequívoca: ${cta.label}`);
}
assert.ok(checkoutAnchors.some(({ href, label }) => href === simulatorCheckout && /SOMENTE O SIMULADOR/.test(label)), 'O CTA do simulador deve apontar para o checkout de R$ 10.');
assert.ok(checkoutAnchors.some(({ href, label }) => href === fullCheckout && /ACESSO ANUAL COMPLETO/.test(label)), 'O CTA anual deve apontar para o checkout de R$ 67.');

assert.match(teste, /GTM-P83M3DV/, 'A versão /teste deve preservar o GTM.');
assert.match(teste, /\/js\/hotmart-utm-tracker\.js/, 'A versão /teste deve carregar o tracker por caminho absoluto.');

for (const asset of ['/images/hero-header.png', '/images/mockup-desktop-mobile-opt.png', '/images/ferramentas-ipad.png', '/fonts/bricolage-grotesque-var.woff2']) {
  assert.ok(teste.includes(asset), `O ativo ${asset} deve funcionar a partir de /teste.`);
}

console.log('verificação /teste: OK');
