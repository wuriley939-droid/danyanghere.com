(() => {
  const films = Array.from(document.querySelectorAll('[data-autoplay-film]'));

  const playFilm = (film) => {
    film.muted = true;
    const attempt = film.play();

    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => {});
    }
  };

  const startFilms = () => films.forEach(playFilm);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startFilms, { once: true });
  } else {
    startFilms();
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) startFilms();
  });
})();
