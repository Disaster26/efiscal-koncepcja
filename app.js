(function () {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function zamknij() { menu.classList.remove('otw'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Otwórz menu'); }
  burger.addEventListener('click', function () {
    var otw = menu.classList.toggle('otw');
    burger.setAttribute('aria-expanded', otw ? 'true' : 'false');
    burger.setAttribute('aria-label', otw ? 'Zamknij menu' : 'Otwórz menu');
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', zamknij); });

  // dolny pasek dopiero po przewinieciu za przycisk w hero
  var mob = document.getElementById('mob');
  var cta = document.getElementById('hero-cta');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      var pokaz = !e[0].isIntersecting && e[0].boundingClientRect.top < 0;
      mob.classList.toggle('widac', pokaz);
      mob.setAttribute('aria-hidden', pokaz ? 'false' : 'true');
      mob.querySelectorAll('a').forEach(function (a) { a.tabIndex = pokaz ? 0 : -1; });
    }).observe(cta);
  }

  // aktywna pozycja menu
  var linki = {};
  menu.querySelectorAll('a').forEach(function (a) { linki[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (wpisy) {
      wpisy.forEach(function (w) {
        var a = linki[w.target.id];
        if (a && w.isIntersecting) { Object.values(linki).forEach(function (x) { x.classList.remove('akt'); }); a.classList.add('akt'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(linki).forEach(function (id) { var s = document.getElementById(id); if (s) obs.observe(s); });
  }

  // formularz wyceny: w wersji pogladowej przygotowuje wiadomosc e-mail
  var form = document.getElementById('form');
  var blad = document.getElementById('blad');
  var podsum = document.getElementById('podsum');
  var etykiety = { imie: 'Imię i nazwisko', firma: 'Nazwa firmy', email: 'E-mail', tel: 'Telefon', prowadzona: 'Czy działalność jest prowadzona', forma: 'Forma prawna', przedmiot: 'Przedmiot działalności', rodzaj: 'Rodzaj księgowości', vat: 'Czynny podatnik VAT', zagr: 'Transakcje zagraniczne', etaty: 'Liczba etatów', umowy: 'Liczba umów cywilnoprawnych', wiad: 'Wiadomość' };
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var d = new FormData(form);
    var ok = String(d.get('imie')).trim() && /^\S+@\S+\.\S+$/.test(String(d.get('email')).trim());
    blad.hidden = !!ok;
    if (!ok) return;
    var linie = [];
    d.forEach(function (v, k) { v = String(v).trim(); if (v) linie.push(etykiety[k] + ': ' + v); });
    document.getElementById('mail-btn').href = 'mailto:biuro@e-fiscal.pl?subject=' + encodeURIComponent('Zapytanie o wycenę usług księgowych') + '&body=' + encodeURIComponent(linie.join('\n'));
    podsum.hidden = false;
    podsum.focus();
  });

  document.getElementById('rok').textContent = new Date().getFullYear();
})();
