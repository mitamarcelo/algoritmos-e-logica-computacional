/**
 * Adiciona botão de copiar aos blocos de código
 */
(function() {
  // Ícone de copiar (clipboard)
  var copyIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>';
  
  // Ícone de sucesso (check)
  var checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';

  function initCopyButtons() {
    document.querySelectorAll('.page-content pre').forEach(function(pre) {
      // Evitar duplicação se já foi processado
      if (pre.parentNode.classList && pre.parentNode.classList.contains('code-block')) {
        return;
      }

      // Criar container
      var wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      
      // Criar header
      var header = document.createElement('div');
      header.className = 'code-block-header';
      
      // Detectar linguagem
      var codeEl = pre.querySelector('code');
      var lang = 'código';
      if (codeEl && codeEl.className) {
        var match = codeEl.className.match(/language-(\w+)/);
        if (match) lang = match[1];
      }
      
      // Label da linguagem
      var label = document.createElement('span');
      label.className = 'code-block-label';
      label.textContent = lang;
      
      // Botão copiar
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.innerHTML = copyIcon + '<span>Copiar</span>';
      btn.setAttribute('aria-label', 'Copiar código');
      
      btn.addEventListener('click', function() {
        var code = pre.querySelector('code');
        var text = code ? code.textContent : pre.textContent;
        
        navigator.clipboard.writeText(text).then(function() {
          // Feedback visual
          btn.innerHTML = checkIcon + '<span>Copiado!</span>';
          btn.classList.add('copied');
          
          // Restaurar após 2 segundos
          setTimeout(function() {
            btn.innerHTML = copyIcon + '<span>Copiar</span>';
            btn.classList.remove('copied');
          }, 2000);
        }).catch(function(err) {
          console.error('Erro ao copiar:', err);
          // Fallback para browsers antigos
          var textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            btn.innerHTML = checkIcon + '<span>Copiado!</span>';
            btn.classList.add('copied');
            setTimeout(function() {
              btn.innerHTML = copyIcon + '<span>Copiar</span>';
              btn.classList.remove('copied');
            }, 2000);
          } catch (e) {
            console.error('Fallback também falhou:', e);
          }
          document.body.removeChild(textarea);
        });
      });
      
      header.appendChild(label);
      header.appendChild(btn);
      
      // Montar estrutura
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }

  // Executar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
  } else {
    initCopyButtons();
  }
})();

