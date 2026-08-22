(() => {
  'use strict';

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.querySelector('[data-clay-trace]');

  if (canvas && finePointer.matches && !reducedMotion.matches) {
    const context = canvas.getContext('2d', { alpha: true });
    const marks = [];
    let frame = 0;
    let lastX = -100;
    let lastY = -100;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      marks.length = 0;
    };

    const drawMark = (mark, opacity) => {
      context.save();
      context.translate(mark.x, mark.y);
      context.rotate(mark.angle);
      context.scale(mark.width, mark.height);
      context.beginPath();
      mark.edge.forEach((radius, index) => {
        const theta = (Math.PI * 2 * index) / mark.edge.length;
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.fillStyle = `rgba(91, 67, 70, ${opacity})`;
      context.fill();
      context.restore();
    };

    const render = (now) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let index = marks.length - 1; index >= 0; index -= 1) {
        const age = (now - marks[index].born) / marks[index].life;
        if (age >= 1) {
          marks.splice(index, 1);
          continue;
        }
        const opacity = 0.072 * Math.pow(1 - age, 1.65);
        drawMark(marks[index], opacity);
      }
      frame = marks.length ? requestAnimationFrame(render) : 0;
    };

    const isEmptyClay = (target) => {
      if (!(target instanceof Element)) return false;
      return !target.closest(
        'a, button, img, video, input, select, textarea, .site-header, .site-footer, .section-header, .pottery-piece, .pottery-lightbox'
      );
    };

    window.addEventListener('pointermove', (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      if (!isEmptyClay(event.target)) {
        lastX = event.clientX;
        lastY = event.clientY;
        return;
      }

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (Math.hypot(dx, dy) < 7) return;

      marks.push({
        x: event.clientX,
        y: event.clientY,
        born: performance.now(),
        life: 2050,
        angle: Math.atan2(dy, dx) + 0.12,
        width: 10.5 + Math.random() * 2.5,
        height: 6 + Math.random() * 1.7,
        edge: Array.from({ length: 10 }, () => 0.84 + Math.random() * 0.22),
      });
      if (marks.length > 150) marks.shift();
      lastX = event.clientX;
      lastY = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    }, { passive: true });

    window.addEventListener('resize', resize, { passive: true });
    resize();
  }

  const dialog = document.querySelector('[data-pottery-dialog]');
  const closeButton = document.querySelector('[data-pottery-close]');
  const dialogImage = document.querySelector('[data-pottery-dialog-image]');
  const dialogTitle = document.querySelector('[data-pottery-dialog-title]');
  const dialogMeta = document.querySelector('[data-pottery-dialog-meta]');
  let opener = null;

  if (!dialog || !closeButton || !dialogImage || !dialogTitle || !dialogMeta) return;

  document.querySelectorAll('.pottery-object').forEach((button) => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      if (!image) return;
      opener = button;
      dialogImage.src = image.currentSrc || image.src;
      dialogImage.alt = image.alt;
      dialogImage.width = image.width;
      dialogImage.height = image.height;
      dialogTitle.textContent = button.dataset.title || '';
      dialogMeta.textContent = button.dataset.meta || '';
      document.body.classList.add('pottery-dialog-open');
      dialog.showModal();
    });
  });

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('pottery-dialog-open');
    opener?.focus({ preventScroll: true });
  });
})();
