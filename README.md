# SGF — Sistema de Gestão da Fazenda

Landing page de vendas do SGF, um sistema de gestão financeira para pecuaristas brasileiros. O produto ajuda produtores rurais a calcular lucro, simular compras, controlar custos e tomar decisões baseadas em números — tudo pelo celular ou computador.

🔗 **Site ao vivo:** [sistema.victordarido.com.br](https://sistema.victordarido.com.br)

---

## Visão geral

A página é uma long-form sales page com foco em conversão, direcionando o visitante para a compra do acesso anual (R$ 67) via Hotmart.

### Seções da página

| # | Seção | Descrição |
|---|-------|-----------|
| 1 | **Hero** | Headline principal + vídeo demo em modal popup |
| 2 | **Problema** | Dores do pecuarista que trabalha sem controle |
| 3 | **Agravamento** | Consequências de não ter clareza dos números |
| 4 | **Planilha vs Sistema** | Comparação visual entre planilha e o SGF |
| 5 | **Ferramentas** | 10 ferramentas disponíveis dentro do sistema |
| 6 | **Objeções** | Quebra de objeções comuns |
| 7 | **Identificação** | Situações reais que o público-alvo já viveu |
| 8 | **Stack de valor** | Lista de tudo incluso + valores individuais |
| 9 | **Oferta** | Preço, condições e CTA principal de compra |
| 10 | **Garantia** | 7 dias de risco zero |
| 11 | **Quem é Victor Darido** | Bio do especialista |
| 12 | **FAQ** | Dúvidas frequentes (accordion) |
| 13 | **CTA Final** | Último bloco de conversão |

---

## Tech stack

- **HTML/CSS/JS** — Single-page estática, sem framework
- **Google Fonts** — Bricolage Grotesque (display), Source Sans 3 (body), DM Mono (monospace)
- **Google Tag Manager** — GTM-P83M3DV
- **GitHub Pages** — Hospedagem via branch `v4`
- **Cloudflare** — DNS + proxy para domínio customizado

---

## Estrutura de arquivos

```
├── index.html          # Página principal (HTML + CSS inline + JS)
├── style.css           # Estilos adicionais
├── global.css          # Estilos globais
├── script.js           # Interações (accordion FAQ, modal vídeo, animações)
├── server.js           # Servidor local para desenvolvimento
├── CNAME               # Domínio customizado (sistema.victordarido.com.br)
└── images/
    └── mockup-desktop-mobile.png   # Mockup do sistema em dispositivos
```

---

## Desenvolvimento local

```bash
# Opção 1: Abrir direto no navegador
open index.html

# Opção 2: Servidor local com Node.js
node server.js
# Acesse http://localhost:3000
```

---

## Deploy

O site é publicado automaticamente via **GitHub Pages** a partir da branch `v4`.

### Domínio customizado

| Serviço | Configuração |
|---------|-------------|
| **GitHub Pages** | Branch `v4`, folder `/ (root)` |
| **Cloudflare DNS** | CNAME `sistema` → `deividvs.github.io` |
| **HTTPS** | Gerenciado pelo GitHub Pages |

### Como publicar alterações

```bash
git add .
git commit -m "descrição da alteração"
git push origin v4
```

O GitHub Pages republica automaticamente em ~1-2 minutos.

---

## Links importantes

| Recurso | URL |
|---------|-----|
| Site ao vivo | https://sistema.victordarido.com.br |
| Repositório | https://github.com/deividvs/sgf-landingpage |
| Checkout (Hotmart) | https://pay.hotmart.com/S104906445L |
| GitHub Pages Settings | https://github.com/deividvs/sgf-landingpage/settings/pages |

---

## Autor

**Victor Darido** — Pecuarista no interior de São Paulo, formado em Administração. Criador do SGF e educador na área de gestão pecuária.

---

© 2026 SGF — Gestão de Fazenda. Todos os direitos reservados.
