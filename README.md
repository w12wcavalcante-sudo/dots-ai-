# DOTS AI

Uma aplicação web simples para organizar tarefas e notas. Esta versão inicial guarda os dados localmente no navegador e permite exportar uma cópia em JSON.

## Ficheiros
- `index.html` — página principal
- `styles.css` — estilos e apresentação
- `app.js` — tarefas, notas e exportação
- `manifest.webmanifest` — configuração para instalação como aplicação web
- `sw.js` — cache básica para utilização offline
- `icon.svg` — ícone da aplicação
- `README.md` — estas instruções

## Publicar com GitHub Pages
1. Envia todos os ficheiros para a raiz do repositório.
2. No GitHub, abre **Settings → Pages**.
3. Em **Build and deployment**, escolhe **Deploy from a branch**.
4. Seleciona a branch `main` (ou `master`) e a pasta `/(root)`, e guarda.
5. Aguarda a publicação e abre o endereço apresentado pelo GitHub Pages.

## Nota
Esta é uma versão inicial sem integração com um modelo de IA, conta de utilizador ou sincronização na nuvem. As tarefas e notas ficam no armazenamento local do navegador; exporta os dados para criar uma cópia de segurança.
