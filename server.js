/**
 * Servidor de desenvolvimento local para preview do site
 * Usa o mesmo layout do Jekyll (_layouts/default.html)
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

// Carregar configuração do _config.yml
function loadConfig() {
  try {
    var configPath = path.join(__dirname, '_config.yml');
    var configContent = fs.readFileSync(configPath, 'utf-8');
    var config = {};
    configContent.split('\n').forEach(function(line) {
      var match = line.match(/^(\w+):\s*"?([^"#]+)"?/);
      if (match) {
        config[match[1]] = match[2].trim().replace(/^"|"$/g, '');
      }
    });
    return config;
  } catch (e) {
    return { title: 'Algoritmos e Lógica Computacional', description: '', baseurl: '' };
  }
}

// Carregar e processar o layout
function loadLayout() {
  var layoutPath = path.join(__dirname, '_layouts', 'default.html');
  return fs.readFileSync(layoutPath, 'utf-8');
}

// Processar template Jekyll simples
function processTemplate(template, data) {
  var result = template;
  
  // Processar {% if page.title %} ... {% endif %}
  result = result.replace(/\{%\s*if\s+page\.title\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g, function(match, content) {
    return data.page.title ? content : '';
  });
  
  // Processar {{ variavel | relative_url }}
  result = result.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, function(match, url) {
    return url; // No servidor local, não precisamos do baseurl
  });
  
  // Processar {{ page.title }}
  result = result.replace(/\{\{\s*page\.title\s*\}\}/g, data.page.title || '');
  
  // Processar {{ site.title }}
  result = result.replace(/\{\{\s*site\.title\s*\}\}/g, data.site.title || '');
  
  // Processar {{ site.description }}
  result = result.replace(/\{\{\s*site\.description\s*\}\}/g, data.site.description || '');
  
  // Processar {{ content }}
  result = result.replace(/\{\{\s*content\s*\}\}/g, data.content || '');
  
  return result;
}

// Adicionar script de live reload ao HTML
function addLiveReload(html) {
  var script = '\n<script>\n' +
    '  // Live reload para desenvolvimento\n' +
    '  (function() {\n' +
    '    var ws = new WebSocket("ws://localhost:4001");\n' +
    '    ws.onmessage = function() { location.reload(); };\n' +
    '    ws.onclose = function() {\n' +
    '      setTimeout(function() { location.reload(); }, 1000);\n' +
    '    };\n' +
    '  })();\n' +
    '</script>\n';
  
  return html.replace('</body>', script + '</body>');
}

// Processar arquivo Markdown
function processMarkdown(filePath) {
  var content = fs.readFileSync(filePath, 'utf-8');
  var parsed = matter(content);
  var html = marked(parsed.content);
  return { frontMatter: parsed.data, html: html };
}

// Renderizar página completa
function renderPage(pageTitle, content, config) {
  var layout = loadLayout();
  var data = {
    page: { title: pageTitle },
    site: { title: config.title, description: config.description },
    content: content
  };
  
  var html = processTemplate(layout, data);
  return addLiveReload(html);
}

// Rota principal
app.get('*', function(req, res) {
  var config = loadConfig();
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
  
  var filePath = path.join(__dirname, urlPath);
  
  if (!fs.existsSync(filePath)) {
    // Tentar com index.md
    var indexPath = path.join(__dirname, urlPath.replace('.md', ''), 'index.md');
    if (fs.existsSync(indexPath)) {
      var result = processMarkdown(indexPath);
      return res.send(renderPage(result.frontMatter.title, result.html, config));
    }
    return res.status(404).send(
      '<h1>Página não encontrada</h1>' +
      '<p>Arquivo: ' + filePath + '</p>' +
      '<a href="/">Voltar ao início</a>'
    );
  }
  
  try {
    var result = processMarkdown(filePath);
    res.send(renderPage(result.frontMatter.title, result.html, config));
  } catch (err) {
    res.status(500).send('Erro ao processar: ' + err.message);
  }
});

// Watch para mudanças e live reload
chokidar.watch([
  './**/*.md',
  './assets/**/*',
  './_layouts/**/*',
  './_config.yml'
], {
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
  console.log('║   Layout: _layouts/default.html                            ║');
  console.log('║   Config: _config.yml                                      ║');
  console.log('║                                                            ║');
  console.log('║   Alterações são recarregadas automaticamente.             ║');
  console.log('║   Pressione Ctrl+C para parar.                             ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
});
