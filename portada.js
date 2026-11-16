const ingenieria = document.getElementById('ingenieria');
if (ingenieria) {
  function restaurarLista() {
    if (location.hash === '#ingenieria' || history.state?.ingenieria) ingenieria.open = true;
  }
  restaurarLista();
  window.addEventListener('pageshow', restaurarLista);
  ingenieria.addEventListener('toggle', () => {
    history.replaceState({ ...history.state, ingenieria: ingenieria.open }, '');
  });
}
