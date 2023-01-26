const menuBtn = document.querySelector('.navigation__button');
const navigation = document.querySelector('.header');
const container = document.querySelector('.container');
const subListBtns = document.querySelectorAll('.sub-list__button');
const textWrapper = document.querySelector('.description__text-wrapper');
const menuBtns = document.querySelectorAll('.sub-list__button,.sub-list__item,.content__link[data-src]');
const descriptionTitle = document.querySelector('.description__title');
const dailyPlaylist = document.querySelector('.daily-playlist');
const description = document.querySelector('.description');
const content = document.querySelector('.content');
const aboutMenu = document.querySelector('.about__menu');
const filmsBlock = document.querySelector('.content__item[data-src="films"]');
const gamesBlock = document.querySelector('.content__item[data-src="games"');

const LETTER_WIDTH = 10.79;
const PADDING = 54;
const PREFIX_WIDTH = 129;
const ZAGONKA__URL = 'http://zagonka.zagonkov.gb.net';
const NOOB_CLUB_URL = 'https://www.noob-club.ru';
const SPINNER = '<img width="128" src="./img/spinner.svg" style="width: 200px; display: block; margin: 0 auto">';

// Кнопка бургера
menuBtn.addEventListener('click', () => {
  navigation.classList.toggle('header--opened');
  container.classList.toggle('container--withoutBG');
});
//
// закрытие меню при изменении размеров экрана
window.addEventListener('resize', () => {
  if (document.documentElement.clientWidth > 999) {
    navigation.classList.remove('header--opened');
  }
  window.location.pathname === '/about.html' ? formatText() : null;
});
//
// кнопки меню
subListBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.target.parentElement.querySelector('.sub-list').classList.toggle('sub-list--opened');
    e.target.classList.toggle('sub-list__button--active');
  });
});
//
// форматирование текста с описанием
window.location.pathname === '/about.html' ? formatText() : null;
function formatText() {
  const activeContent = document.querySelector('.description__item--active').querySelector('.description__text-wrapper');
  if (activeContent.parentElement.dataset.src === 'music' || activeContent.parentElement.dataset.src === 'games') return;
  const prefixContainer = document.querySelector('.description__item--active').querySelector('.description__content-prefix');
  const text = activeContent.textContent.replace(/[ ]+/g, ' ').replace(/\n/g, '').split(' ');
  const containerWidth = document.querySelector('.description__item--active').clientWidth - PREFIX_WIDTH - PADDING;

  let rows = 3;
  let tempString = '';
  for (let i = 0; i < text.length; i++) {
    if ((tempString + text[i]).length * LETTER_WIDTH > containerWidth) {
      rows++;
      tempString = text[i] + ' ';
      continue;
    }
    tempString += text[i] + ' ';
  }

  prefixContainer.innerHTML = '';
  for (let i = 0; i < rows; i++) {
    let star = ' * ';
    if (i === 0) star = '/**';
    if (i === rows - 1) star = ' */';
    prefixContainer.innerHTML += `<div><div class="description__numbers">${i + 1}</div><div class="description__stars">${star}</div></div>`;
  }
}
//
// смена контента на странице about
menuBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (e.target.dataset.src === 'contacts__item') return;
    e.preventDefault();
    changeContent(e.target);
  });
});

function changeContent(target) {
  const data = target.dataset.src.split('--')[0];
  descriptionTitle.textContent = data;
  content.classList.remove('about__content--long');
  description.classList.remove('about__description--short');
  description.classList.remove('hide');
  content.classList.remove('full');
  aboutMenu.classList.remove('about__menu--long');

  if (data === 'music' || data === 'games') {
    content.classList.add('about__content--long');
    description.classList.add('about__description--short');
  }
  if (data === 'films') {
    description.classList.add('hide');
    content.classList.add('full');
    aboutMenu.classList.add('about__menu--long');
  }

  const postfix = target.dataset.src.split('--')[1] ? '--' + target.dataset.src.split('--')[1] : '';
  document.querySelector('.description__item--active') && document.querySelector('.description__item--active').classList.remove('description__item--active');

  document.querySelector(`.description__item[data-src="${data}"`) && document.querySelector(`.description__item[data-src="${data}"`).classList.add('description__item--active');

  document.querySelector('.description__item--active')?.querySelector('.description__content-prefix') && formatText();

  document.querySelector('.content__item--active') && document.querySelector('.content__item--active').classList.remove('content__item--active');
  document.querySelector(`.content__item[data-src="${data + postfix}"]`) && document.querySelector(`.content__item[data-src="${data + postfix}"]`).classList.add('content__item--active');
  if (data === 'films') {
    loadFilmsCORS();
  }
  if (data === 'games' && target.dataset.catalog) {
    loadGamesCORS();
  }
}
//
async function loadGamesCORS() {
  gamesBlock.innerHTML = SPINNER;
  const html = await fetch(NOOB_CLUB_URL)
    .then(res => res.text())
    .then(res => res)
    .catch(e => loadGames());

  const div = document.createElement('div');
  div.innerHTML = html.split('<body')[1];
  const blocks = div.querySelector('.content').querySelectorAll('.entry');
  gamesBlock.innerHTML = '';
  renderGames(blocks, { blockTitle: 'Noob-Club', url: NOOB_CLUB_URL });
}

async function loadGames() {
  const data = new FormData();
  data.set('url', NOOB_CLUB_URL);
  return await fetch('content.php', { body: data, method: 'POST' })
    .then(res => res.text())
    .then(res => res)
    .catch(e => alert(e));
}
// загрузка списка фильмов
// -- загрузка с фронта
async function loadFilmsCORS() {
  filmsBlock.innerHTML = SPINNER;
  const html = await fetch(ZAGONKA__URL)
    .then(res => res.text())
    .then(res => res)
    .catch(e => loadFilms());

  const div = document.createElement('div');
  div.innerHTML = html.split('<body')[1];

  const blocks = div.querySelectorAll('.box4');
  const films = blocks[0];
  const newSerials = blocks[3];
  const newSeasons = blocks[4];
  filmsBlock.innerHTML = '';
  renderFilms({
    blocks: [films, newSerials, newSeasons],
    titles: ['@Zagonka new films', '@Zagonka new serials', '@Zagonka new seasons']
  });
}
// -- загрузка с php
async function loadFilms() {
  const data = new FormData();
  data.set('url', ZAGONKA__URL);
  return await fetch('content.php', { body: data, method: 'POST' })
    .then(res => res.text())
    .then(res => res)
    .catch(e => alert(e));
}
//
// отрисовка списка фильмов
function renderFilms({ blocks, titles }) {
  blocks.forEach((block, i) => {
    const div = document.createElement('div');
    div.classList.add('films');
    div.innerHTML = `<p class="films__title">${titles[i]}</p><div class="films__container"></div>`;
    block.querySelectorAll('.short').forEach((film) => {
      const imgSrc = ZAGONKA__URL + film.querySelector('img').dataset.srcset.replace(' 190w', '');
      const title = film.querySelector('a').textContent;
      const src = ZAGONKA__URL + film.querySelector('a').href.slice(film.querySelector('a').href.lastIndexOf('/'));
      div.querySelector('.films__container').innerHTML += `
        <a class="films__item" href="${src}" target="_blank">
          <img class="films__img" src="${imgSrc}">
          <p class="films__text">${title}</p>
        </a>
      `;
    });
    filmsBlock.append(div);
  });
}
//
function renderGames(blocks, { blockTitle, url }) {
  const div = document.createElement('div');
  div.classList.add('games');
  div.innerHTML = `<p class="games__title">${blockTitle}</p><div class="games__container"></div>`;
  blocks.forEach((block) => {
    const title = block.querySelector('a').textContent;
    const src = url + block.querySelector('a').href.slice(block.querySelector('a').href.lastIndexOf('/'));
    const content = block.querySelector('.entry-content');
    const img = content.querySelector('img').src;
    const text = content.textContent;
    div.querySelector('.games__container').innerHTML += `
        <div class="games__item">
          <a class="games__subtitle" href="${src}" target="_blank">${title}</a>
          <img class="games__img" src=${img}>
          <p class="games__text">${text}</p>
        </div>
      `;
    gamesBlock.append(div);
  });
}
