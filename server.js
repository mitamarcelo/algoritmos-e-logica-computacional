/**
 * Servidor de desenvolvimento local para preview do site
 * Processa Markdown + YAML front matter e aplica o layout
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');
const chokidar = require('chokidar');
const { WebSocketServer } = require('ws');

const app = express();
const PORT = 4000;

// WebSocket para live reload
const wss = new WebSocketServer({ port: 4001 });

// Servir arquivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Template HTML base
function renderPage(title, content, config) {
  const baseUrl = config.baseurl || '';
  
  return '<!DOCTYPE html>\n' +
'<html lang="pt-BR">\n' +
'<head>\n' +
'  <meta charset="UTF-8">\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'  <title>' + (title ? title + ' | ' : '') + config.title + '</title>\n' +
'  <meta name="description" content="' + config.description + '">\n' +
'  \n' +
'  <!-- Google Fonts -->\n' +
'  <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
'  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
'  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap" rel="stylesheet">\n' +
'  \n' +
'  <!-- Highlight.js base -->\n' +
'  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">\n' +
'  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>\n' +
'  \n' +
'  <!-- Nosso CSS customizado -->\n' +
'  <link rel="stylesheet" href="' + baseUrl + '/assets/css/style.css">\n' +
'</head>\n' +
'<body>\n' +
'  <nav class="sidebar">\n' +
'    <div class="sidebar-header">\n' +
'      <h1>' + config.title + '</h1>\n' +
'      <p class="tagline">' + config.description + '</p>\n' +
'    </div>\n' +
'    <div class="nav-links">\n' +
'      <a href="' + baseUrl + '/" class="nav-link">\n' +
'        <span class="icon">📚</span> Início\n' +
'      </a>\n' +
'      <a href="' + baseUrl + '/Exercicios%20Resolvidos/Capitulo%208/" class="nav-link">\n' +
'        <span class="icon">📝</span> Capítulo 8\n' +
'      </a>\n' +
'    </div>\n' +
'  </nav>\n' +
'\n' +
'  <main class="content">\n' +
'    <article>\n' +
'      ' + (title ? '<header class="page-header"><h1>' + title + '</h1></header>' : '') + '\n' +
'      <div class="page-content">\n' +
'        ' + content + '\n' +
'      </div>\n' +
'    </article>\n' +
'  </main>\n' +
'\n' +
'  <!-- Highlight.js: definição customizada de Portugol -->\n' +
'  <script src="' + baseUrl + '/assets/js/portugol.js"></script>\n' +
'  \n' +
'  <!-- Botão de copiar código -->\n' +
'  <script src="' + baseUrl + '/assets/js/copy-code.js"></script>\n' +
'  \n' +
'  <script>\n' +
'    hljs.registerLanguage("portugol", window.hljsPortugol);\n' +
'    hljs.highlightAll();\n' +
'    \n' +
'    // Live reload\n' +
'    var ws = new WebSocket("ws://localhost:4001");\n' +
'    ws.onmessage = function() { location.reload(); };\n' +
'  </script>\n' +
'</body>\n' +
'</html>';
}

// Carregar configuração
function loadConfig() {
  try {
    const configPath = path.join(__dirname, '_config.yml');
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = {};
    configContent.split('\n').forEach(function(line) {
      const match = line.match(/^(\w+):\s*"?([^"]+)"?$/);
      if (match) {
        config[match[1]] = match[2].trim();
      }
    });
    return config;
  } catch (e) {
    return { title: 'Algoritmos e Lógica Computacional', description: '', baseurl: '' };
  }
}

// Processar arquivo Markdown
function processMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(content);
  const html = marked(parsed.content);
  return { frontMatter: parsed.data, html: html };
}

// Rota principal
app.get('*', function(req, res) {
  const config = loadConfig();
  // No servidor local, não usamos baseurl nos links
  config.baseurl = '';
  
  var urlPath = decodeURIComponent(req.path);
  
  // Remover o baseurl do início do path (caso venha de links antigos)
  var configBaseurl = '/algoritmos-e-logica-computacional';
  if (urlPath.startsWith(configBaseurl)) {
    urlPath = urlPath.substring(configBaseurl.length) || '/';
  }
  
  // Remover trailing slash e adicionar index.md ou .md
  if (urlPath.endsWith('/')) {
    urlPath = urlPath + 'index.md';
  } else if (!path.extname(urlPath)) {
    urlPath = urlPath + '.md';
  }
  
  // Se não for .md, ignorar
  if (!urlPath.endsWith('.md')) {
    return res.status(404).send('Não encontrado');
  }
  
  const filePath = path.join(__dirname, urlPath);
  
  if (!fs.existsSync(filePath)) {
    // Tentar com index.md
    const indexPath = path.join(__dirname, urlPath.replace('.md', ''), 'index.md');
    if (fs.existsSync(indexPath)) {
      const result = processMarkdown(indexPath);
      return res.send(renderPage(result.frontMatter.title, result.html, config));
    }
    return res.status(404).send(
      '<h1>Página não encontrada</h1>' +
      '<p>Arquivo: ' + filePath + '</p>' +
      '<a href="/">Voltar ao início</a>'
    );
  }
  
  try {
    const result = processMarkdown(filePath);
    res.send(renderPage(result.frontMatter.title, result.html, config));
  } catch (err) {
    res.status(500).send('Erro ao processar: ' + err.message);
  }
});

// Watch para mudanças e live reload
chokidar.watch(['./**/*.md', './assets/**/*', './_config.yml'], {
  ignored: /node_modules/,
}).on('change', function(changedPath) {
  console.log('📝 Arquivo alterado: ' + changedPath);
  wss.clients.forEach(function(client) { client.send('reload'); });
});

app.listen(PORT, function() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║   🚀 Servidor de desenvolvimento rodando!                  ║');
  console.log('║                                                            ║');
  console.log('║   Acesse: http://localhost:' + PORT + '                          ║');
  console.log('║                                                            ║');
  console.log('║   As alterações nos arquivos .md são recarregadas          ║');
  console.log('║   automaticamente no navegador.                            ║');
  console.log('║                                                            ║');
  console.log('║   Pressione Ctrl+C para parar.                             ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
});
