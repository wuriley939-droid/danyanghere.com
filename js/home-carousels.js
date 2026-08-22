(() => {
  const sources = [
    { src: '/assets/images/photography/xishuangbanna-vertical.jpg', href: '/rock/rock-temporarily/', label: 'rock' },
    { src: '/assets/images/ceramics/clay-09.jpg', href: '/clay/', label: 'clay' },
    { src: '/assets/images/new-york-and-around/ny-around-01.webp', href: '/new-york-and-around/', label: 'new york and around' },
    { src: '/assets/images/new-york-and-around/ny-around-02.webp', href: '/new-york-and-around/', label: 'new york and around' }
  ];

  const linearChannel = (value) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  };

  const luminance = ([red, green, blue]) => (
    0.2126 * linearChannel(red)
    + 0.7152 * linearChannel(green)
    + 0.0722 * linearChannel(blue)
  );

  const rgbToLab = ([redValue, greenValue, blueValue]) => {
    const red = linearChannel(redValue);
    const green = linearChannel(greenValue);
    const blue = linearChannel(blueValue);
    const pivot = (value) => (
      value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116
    );
    const x = pivot((0.4124 * red + 0.3576 * green + 0.1805 * blue) / 0.95047);
    const y = pivot(0.2126 * red + 0.7152 * green + 0.0722 * blue);
    const z = pivot((0.0193 * red + 0.1192 * green + 0.9505 * blue) / 1.08883);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  };

  const colorDistance = (left, right) => Math.sqrt(
    left.reduce((total, value, index) => total + Math.pow(value - right[index], 2), 0)
  );

  const analyze = (source) => new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const histogram = new Map();
        const luminances = [];

        for (let index = 0; index < pixels.length; index += 4) {
          if (pixels[index + 3] < 128) continue;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const key = `${red >> 5}-${green >> 5}-${blue >> 5}`;
          histogram.set(key, (histogram.get(key) || 0) + 1);
          luminances.push(luminance([red, green, blue]));
        }

        const dominantKey = [...histogram.entries()]
          .sort((left, right) => right[1] - left[1])[0][0];
        const dominant = dominantKey.split('-').map((value) => Number(value) * 32 + 16);
        luminances.sort((left, right) => left - right);
        const trim = Math.max(1, Math.floor(luminances.length * 0.05));
        const central = luminances.slice(trim, -trim);
        const mean = central.reduce((total, value) => total + value, 0) / central.length;

        resolve({
          ...source,
          orientation: image.naturalHeight / image.naturalWidth >= 1.1 ? 'portrait' : 'landscape',
          width: image.naturalWidth,
          height: image.naturalHeight,
          brightness: 0.65 * mean + 0.35 * luminance(dominant),
          lab: rgbToLab(dominant)
        });
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = reject;
    image.src = source.src;
  });

  const smoothLightToDark = (items) => {
    if (items.length < 2) return items;
    const brightnessSorted = [...items].sort((left, right) => right.brightness - left.brightness);
    const brightest = brightnessSorted[0].brightness;
    const darkest = brightnessSorted[brightnessSorted.length - 1].brightness;
    const span = Math.max(brightest - darkest, 0.0001);
    const bucketCount = Math.min(6, Math.max(3, Math.round(Math.sqrt(items.length))));
    const buckets = Array.from({ length: bucketCount }, () => []);

    brightnessSorted.forEach((item) => {
      const normalized = (brightest - item.brightness) / span;
      const bucketIndex = Math.min(bucketCount - 1, Math.floor(normalized * bucketCount));
      buckets[bucketIndex].push(item);
    });

    const result = [];
    buckets.forEach((bucket) => {
      const remaining = [...bucket];
      while (remaining.length) {
        const previous = result[result.length - 1];
        const chosen = previous
          ? remaining.reduce((best, candidate) => {
              const candidateCost = colorDistance(candidate.lab, previous.lab)
                + Math.abs(candidate.brightness - previous.brightness) * 75;
              const bestCost = colorDistance(best.lab, previous.lab)
                + Math.abs(best.brightness - previous.brightness) * 75;
              return candidateCost < bestCost ? candidate : best;
            })
          : remaining.reduce((best, candidate) => (
              candidate.brightness > best.brightness ? candidate : best
            ));
        result.push(chosen);
        remaining.splice(remaining.indexOf(chosen), 1);
      }
    });
    return result;
  };

  const makeSequence = (items, duplicate) => {
    const sequence = document.createElement('div');
    sequence.className = 'home-carousel-sequence';
    if (duplicate) sequence.setAttribute('aria-hidden', 'true');

    items.forEach((item) => {
      const link = document.createElement('a');
      link.className = 'home-carousel-item';
      link.href = item.href;
      link.setAttribute('aria-label', `View ${item.label}`);
      if (duplicate) link.tabIndex = -1;

      const image = document.createElement('img');
      image.src = item.src;
      image.alt = '';
      image.width = item.width;
      image.height = item.height;
      image.loading = 'lazy';
      image.decoding = 'async';

      const label = document.createElement('span');
      label.textContent = item.label;
      link.append(image, label);
      sequence.append(link);
    });
    return sequence;
  };

  const buildCarousel = (orientation, ordered) => {
    const viewport = document.querySelector(`[data-carousel="${orientation}"]`);
    if (!viewport || !ordered.length) return;
    const track = viewport.querySelector('.home-carousel-track');
    const returnPath = ordered.length > 2 ? ordered.slice(1, -1).reverse() : [];
    const cycle = [...ordered, ...returnPath];
    track.style.setProperty(
      '--carousel-duration',
      `${Math.max(52, cycle.length * 9)}s`
    );
    track.replaceChildren(makeSequence(cycle, false), makeSequence(cycle, true));
    viewport.setAttribute('aria-busy', 'false');
    viewport.classList.add('is-ready');
  };

  Promise.allSettled(sources.map(analyze)).then((results) => {
    const analyzed = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);
    buildCarousel('portrait', smoothLightToDark(analyzed.filter((item) => item.orientation === 'portrait')));
  });
})();
