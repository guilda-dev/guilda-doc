// Shared script of the lecture notes (lecture/*.html). Load it at the end of <body>.
// - Renders math: an element with data-tex="..." becomes KaTeX (display style for
//   .lec-math, inline for span.lec-math-inline). KaTeX is bundled in ../vendor/katex/;
//   a page that uses math loads katex.min.css and katex.min.js before this file.
//   Without KaTeX the TeX source stays as text.
// - Annotated equations (figure.lec-annot, styled by annotate.css): in the TeX,
//   \annot{k}{...} marks term k; the k-th <li> of ol.lec-annot-notes is its label.
//   On wide screens each label sits above or below the equation (li data-at="above",
//   default below) with an arrow to its term; when the labels do not fit in one row,
//   on narrow screens and in print, they stack below the equation, numbered.
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

  // \annot{k}{...} expands to \htmlClass, which KaTeX renders only when trusted;
  // only these class names are trusted.
  const KATEX_OPTIONS = {
    throwOnError: false,
    output: 'htmlAndMathml',
    macros: { '\\annot': '\\htmlClass{lec-annot-term lec-annot-t#1}{#2}' },
    trust: (ctx) => ctx.command === '\\htmlClass' && /^lec-annot-term lec-annot-t[1-7]$/.test(ctx.class)
  };

  function renderMath() {
    const katex = window.katex;
    document.querySelectorAll('[data-tex]').forEach((el) => {
      const tex = el.getAttribute('data-tex');
      if (!katex?.render) { el.textContent = tex; return; }
      try {
        katex.render(tex, el, { ...KATEX_OPTIONS, displayMode: el.classList.contains('lec-math') });
        el.classList.add('is-rendered');
      } catch (e) {
        el.textContent = tex;
      }
    });
  }

  // ---- Annotated equations ----
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const ARROW_GAP = 26;     // px between a label row and the equation
  const LABEL_GAP = 8;      // px between labels in one row
  const MIN_ARROW_WIDTH = 420;

  function svgEl(name, attrs) {
    const el = document.createElementNS(SVG_NS, name);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  // Box of a KaTeX term: union of its visible leaves (KaTeX's struts and the
  // spans of an inline element do not follow the glyphs).
  function termBox(term, origin) {
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    const leaves = [term, ...term.querySelectorAll('*')].filter((el) =>
      (el.children.length === 0 || el.tagName.toLowerCase() === 'svg') &&
      !el.closest('.pstrut, .strut, .vlist-s, .katex-mathml') && !(el.parentElement?.closest('svg')));
    leaves.forEach((el) => {
      const rc = el.getBoundingClientRect();
      if (rc.width < 0.5 || rc.height < 0.5) return;
      l = Math.min(l, rc.left); t = Math.min(t, rc.top); r = Math.max(r, rc.right); b = Math.max(b, rc.bottom);
    });
    if (!Number.isFinite(l)) return null;
    return { left: l - origin.left, top: t - origin.top, right: r - origin.left, bottom: b - origin.top };
  }

  // Places labels of one side in a row near the x of their terms; null when they do not fit.
  function placeRow(items, width) {
    const row = items.slice().sort((a, b) => a.cx - b.cx);
    row.forEach((it) => { it.x = Math.min(Math.max(it.cx - it.w / 2, 0), width - it.w); });
    for (let i = 1; i < row.length; i++) row[i].x = Math.max(row[i].x, row[i - 1].x + row[i - 1].w + LABEL_GAP);
    if (row.length && row[row.length - 1].x + row[row.length - 1].w > width) {
      row[row.length - 1].x = width - row[row.length - 1].w;
      for (let i = row.length - 2; i >= 0; i--) row[i].x = Math.min(row[i].x, row[i + 1].x - LABEL_GAP - row[i].w);
    }
    return row.length && row[0].x < 0 ? null : row;
  }

  function layoutAnnot(fig) {
    const math = fig.querySelector('.lec-math');
    const notes = [...fig.querySelectorAll('.lec-annot-notes > li')];
    if (!math || !math.classList.contains('is-rendered')) return;
    let layer = fig.querySelector(':scope > svg.lec-annot-layer');
    if (!layer) {
      layer = svgEl('svg', { class: 'lec-annot-layer', 'aria-hidden': 'true' });
      fig.prepend(layer);
    }
    layer.replaceChildren();
    fig.classList.remove('is-arrows');
    fig.style.paddingTop = fig.style.paddingBottom = '';
    notes.forEach((li) => { li.style.left = li.style.top = ''; });

    const items = notes.map((li, i) => ({ li, k: i + 1, at: li.dataset.at === 'above' ? 'above' : 'below',
      term: math.querySelector('.lec-annot-t' + (i + 1)) }));
    const width = fig.clientWidth;
    let arrows = width >= MIN_ARROW_WIDTH && math.scrollWidth <= math.clientWidth + 1 && items.every((it) => it.term);
    let rows = null;
    if (arrows) {
      fig.classList.add('is-arrows');
      const origin = fig.getBoundingClientRect();
      items.forEach((it) => {
        const box = termBox(it.term, origin);
        it.cx = box ? (box.left + box.right) / 2 : 0;
        it.w = it.li.offsetWidth; it.h = it.li.offsetHeight;
      });
      rows = { above: placeRow(items.filter((it) => it.at === 'above'), width) ?? null,
               below: placeRow(items.filter((it) => it.at === 'below'), width) ?? null };
      const used = (side) => items.some((it) => it.at === side);
      if ((used('above') && !rows.above) || (used('below') && !rows.below)) {
        arrows = false;
        fig.classList.remove('is-arrows');
      }
    }
    if (arrows) {
      const hAbove = Math.max(0, ...items.filter((it) => it.at === 'above').map((it) => it.h));
      const hBelow = Math.max(0, ...items.filter((it) => it.at === 'below').map((it) => it.h));
      fig.style.paddingTop = hAbove ? (hAbove + ARROW_GAP) + 'px' : '';
      fig.style.paddingBottom = hBelow ? (hBelow + ARROW_GAP) + 'px' : '';
    }

    // Measure after the paddings are set.
    const origin = fig.getBoundingClientRect();
    layer.setAttribute('width', fig.clientWidth);
    layer.setAttribute('height', fig.clientHeight);
    const defs = svgEl('defs', {});
    const markerId = 'lec-annot-head-' + (fig.dataset.annotId || (fig.dataset.annotId = Math.random().toString(36).slice(2, 8)));
    const marker = svgEl('marker', { id: markerId, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
    marker.appendChild(svgEl('path', { d: 'M0 1 L10 5 L0 9 Z', class: 'lec-annot-head' }));
    defs.appendChild(marker);
    layer.appendChild(defs);
    const mathBox = math.getBoundingClientRect();
    const mathTop = mathBox.top - origin.top, mathBottom = mathBox.bottom - origin.top;

    items.forEach((it) => {
      if (!it.term) return;
      math.querySelectorAll('.lec-annot-t' + it.k).forEach((term, j) => {
        const box = termBox(term, origin);
        if (!box) return;
        const pad = 3;
        layer.appendChild(svgEl('rect', { class: 'lec-annot-box lec-annot-c' + it.k,
          x: box.left - pad, y: box.top - pad, width: box.right - box.left + 2 * pad, height: box.bottom - box.top + 2 * pad, rx: 3 }));
        // The arrow goes to the occurrence nearest to the label's side.
        if (!it.box || (it.at === 'above' ? box.top < it.box.top - 1 : box.bottom > it.box.bottom + 1)) it.box = box;
        if (!arrows && j === 0) {
          const g = svgEl('g', { class: 'lec-annot-badge lec-annot-c' + it.k });
          g.appendChild(svgEl('circle', { cx: box.right + pad, cy: box.top - pad, r: 7 }));
          const t = svgEl('text', { x: box.right + pad, y: box.top - pad, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
          t.textContent = it.k;
          g.appendChild(t);
          layer.appendChild(g);
        }
      });
    });

    if (!arrows) return;
    items.forEach((it) => {
      if (!it.box) return;
      const above = it.at === 'above';
      const top = above ? 0 : mathBottom + ARROW_GAP;
      it.li.style.left = it.x + 'px';
      it.li.style.top = (above ? mathTop - ARROW_GAP - it.h : top) + 'px';
      const tx = (it.box.left + it.box.right) / 2;
      const ty = above ? it.box.top - 4 : it.box.bottom + 4;
      const ax = Math.min(Math.max(tx, it.x + 10), it.x + it.w - 10);
      const ay = above ? mathTop - ARROW_GAP : mathBottom + ARROW_GAP;
      const my = (ay + ty) / 2;
      const d = Math.abs(ax - tx) < 1 ? `M${ax} ${ay} L${tx} ${ty}` : `M${ax} ${ay} C${ax} ${my} ${tx} ${my} ${tx} ${ty}`;
      layer.appendChild(svgEl('path', { class: 'lec-annot-arrow', d, 'marker-end': `url(#${markerId})` }));
    });
  }

  function initAnnot() {
    const figs = [...document.querySelectorAll('figure.lec-annot')];
    if (!figs.length) return;
    const layoutAll = () => figs.forEach(layoutAnnot);
    let pending = 0;
    const schedule = () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(layoutAll); };
    layoutAll();
    document.fonts?.ready.then(schedule);
    window.addEventListener('load', schedule);
    document.addEventListener('guilda-langchange', schedule);
    if (window.ResizeObserver) {
      let lastWidths = new Map();
      const ro = new ResizeObserver((entries) => {
        if (entries.some((e) => lastWidths.get(e.target) !== e.contentRect.width)) {
          entries.forEach((e) => lastWidths.set(e.target, e.contentRect.width));
          schedule();
        }
      });
      figs.forEach((fig) => ro.observe(fig));
    } else {
      window.addEventListener('resize', schedule);
    }
    figs.forEach((fig) => fig.querySelector('.lec-math')?.addEventListener('scroll', schedule, { passive: true }));
  }

  function init() {
    splitCommands();
    renderMath();
    initAnnot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
