// Shared script of the lecture notes (lecture/*.html). Load it at the end of <body>.
// - Renders math: an element with data-tex="..." becomes KaTeX (display style for
//   .lec-math, inline for span.lec-math-inline). KaTeX is bundled in ../vendor/katex/;
//   a page that uses math loads katex.min.css and katex.min.js before this file.
//   Without KaTeX the TeX source stays as text.
// - Splits the code of pre.lec-cmd into lines (span.lec-cmd-line), so that style.css
//   can show a ">>" prompt before each line without putting it in the copied text.
(function () {
  'use strict';

  function splitCommands() {
    document.querySelectorAll('pre.lec-cmd > code').forEach((code) => {
      const lines = code.textContent.replace(/\n+$/, '').split('\n');
      code.textContent = '';
      lines.forEach((line, i) => {
        if (i > 0) code.appendChild(document.createTextNode('\n'));
        const span = document.createElement('span');
        span.className = 'lec-cmd-line';
        span.textContent = line;
        code.appendChild(span);
      });
    });
  }

  function renderMath() {
    const katex = window.katex;
    document.querySelectorAll('[data-tex]').forEach((el) => {
      const tex = el.getAttribute('data-tex');
      if (!katex?.render) { el.textContent = tex; return; }
      try {
        katex.render(tex, el, { displayMode: el.classList.contains('lec-math'), throwOnError: false, output: 'htmlAndMathml' });
        el.classList.add('is-rendered');
      } catch (e) {
        el.textContent = tex;
      }
    });
  }

  function init() {
    splitCommands();
    renderMath();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
