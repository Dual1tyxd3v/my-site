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
const mainMenu = document.querySelector('.main__menu');
// const filmsBlock = document.querySelector('.content__item[data-src="films"]');
const gamesBlock = document.querySelector('.content__item[data-src="games"');
const inputs = document.querySelectorAll('input[type="text"],textarea');
const error = document.querySelector('.error');
const errorMessage = document.querySelector('.error__text');
const errorBtn = document.querySelector('.error__btn');
const errorTitle = document.querySelector('.error__title');
const projectsChecks = document.querySelectorAll('.sub-list__checkbox');
const projectsSubtitle = document.querySelector('.description__subtitle');

const LETTER_WIDTH = 10.79;
const PADDING = 54;
const PREFIX_WIDTH = 129;
const ANALYTICS_URL = 'https://moexapi.vercel.app/analytics';

// --- WIP
/* const ZAGONKA_URL = 'http://zagonka1.zagonkov.gb.net';
const FILMS_API = 'http://localhost:3002/films';
const FILMS_TITLES = ['@Zagonka new films', '@Zagonka new serials', '@Zagonka new seasons']; */
//
async function analytics() {
  const reffer = document.referrer || null;
  const page = window.location.href;
  await fetch(ANALYTICS_URL, {
    method: 'POST',
    body: JSON.stringify({
      reffer,
      page,
    }),
    headers: {
      'Content-type': 'application/json',
    },
  });
}
analytics();

const api = {
  GAMES: 'https://moexapi.vercel.app/nclub',
  MESSAGE: 'https://moexapi.vercel.app/message',
};
const SPINNER = '<img width="128" src="./img/spinner.svg" style="width: 200px; display: block; margin: 0 auto">';
const form = document.querySelector('.form');

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
  window.location.pathname.includes('/about.html') ? formatText() : null;
  window.location.pathname.includes('/contacts.html') ? formatCodeText() : null;
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
document.fonts.ready.then(() => (window.location.pathname.includes('/about.html') ? formatText() : null));

function formatText() {
  const activeContent = document
    .querySelector('.description__item--active')
    ?.querySelector('.description__text-wrapper');
  const prefixContainer = document
    .querySelector('.description__item--active')
    ?.querySelector('.description__content-prefix');

  if (!prefixContainer) return;

  const rows = 1 + (activeContent.querySelector('p') && activeContent.querySelector('p').clientHeight / 27);

  prefixContainer.innerHTML = '';
  for (let i = 0; i < rows; i++) {
    let star = ' * ';
    if (i === 0) star = '/**';
    if (i === rows - 1) star = ' */';
    prefixContainer.innerHTML += `<div><div class="description__numbers">${
      i + 1
    }</div><div class="description__stars">${star}</div></div>`;
  }
}
//
// смена контента на странице main
menuBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (e.target.dataset.src === 'contacts__item') return;
    e.preventDefault();
    changeContent(e.target);
  });
});

function changeContent(target) {
  if (projectsChecks.length !== 0) {
    return;
  }
  const data = target.dataset.src.split('--')[0];
  descriptionTitle.textContent = target.textContent.trim().replace('=>', '');
  content.classList.remove('main__content--long');
  description.classList.remove('main__description--short');
  description.classList.remove('hide');
  content.classList.remove('full');
  mainMenu.classList.remove('main__menu--long');

  if (data === 'music' || data === 'games') {
    content.classList.add('main__content--long');
    description.classList.add('main__description--short');
  }
  /* if (data === 'films') {
    description.classList.add('hide');
    content.classList.add('full');
    mainMenu.classList.add('main__menu--long');
  } */

  const postfix = target.dataset.src.split('--')[1] ? '--' + target.dataset.src.split('--')[1] : '';
  document.querySelector('.description__item--active') &&
    document.querySelector('.description__item--active').classList.remove('description__item--active');

  document.querySelector(`.description__item[data-src="${data}"`) &&
    document.querySelector(`.description__item[data-src="${data}"`).classList.add('description__item--active');

  document.querySelector('.description__item--active')?.querySelector('.description__content-prefix') && formatText();

  document.querySelector('.content__item--active') &&
    document.querySelector('.content__item--active').classList.remove('content__item--active');
  document.querySelector(`.content__item[data-src="${data + postfix}"]`) &&
    document.querySelector(`.content__item[data-src="${data + postfix}"]`).classList.add('content__item--active');
  /* if (data === 'films') {
    loadFilms();
  } */
  if (data === 'games' && target.dataset.catalog) {
    loadGames();
  }
}
//
// загрузка списка новостей
async function loadGames() {
  gamesBlock.innerHTML = SPINNER;
  const { data } = await fetch(api.GAMES)
    .then((res) => res.json())
    .catch((e) => {
      showError('Ошибка загрузки.<br>Перезагрузите страницу 1', res.status);
      throw new Error(e);
    });

  gamesBlock.innerHTML = '';
  renderGames(data, 'Noob-Club');
}

// загрузка списка фильмов
async function loadFilms() {
  await fetch(FILMS_API, {
    body: JSON.stringify({ url: ZAGONKA_URL }),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        showError('Ошибка загрузки.<br>Перезагрузите страницу 1', res.status);
        throw new Error('Error');
      }
      return res.json();
    })
    .then((res) => {
      if (res.error) {
        showError(res.error, '000');
        throw new Error(res.error);
      }
      renderFilms({ blocks: res.data, titles: FILMS_TITLES });
    })
    .catch((e) => {
      showError('Ошибка загрузки.<br>Перезагрузите страницу', '001');
      return null;
    });
}
//
// отрисовка списка фильмов
function renderFilms({ blocks, titles }) {
  filmsBlock.innerHTML = '';
  blocks.forEach((block, i) => {
    const div = document.createElement('div');
    div.classList.add('films');
    div.innerHTML = `<p class="films__title">${titles[i]}</p><div class="films__container"></div>`;

    block.forEach(({ imgSrc, title, src }) => {
      div.querySelector('.films__container').innerHTML += `
        <a class="films__item" href="${ZAGONKA_URL}${src}" target="_blank">
          <img class="films__img" src="${ZAGONKA_URL}${imgSrc}">
          <p class="films__text">${title}</p>
        </a>
      `;
    });
    filmsBlock.append(div);
  });
}
//
// отрисовка новостей
function renderGames(blocks, blockTitle) {
  const div = document.createElement('div');
  div.classList.add('games');
  div.innerHTML = `<p class="games__title">${blockTitle}</p><div class="games__container"></div>`;

  blocks.forEach((block) => {
    const { title, src, img, text } = block;
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
//
// перерисовка блока с кодом
inputs &&
  inputs.forEach((input) => {
    input.addEventListener('input', (e) => {
      const data = e.target.dataset.src;
      document.querySelector(`.${data}`).textContent = `'${input.value}'`;
      formatCodeText();
    });
  });

formatCodeText();
function formatCodeText() {
  const codeWrapper = document.querySelector('.contacts__code');
  if (!codeWrapper) return;

  const lineHeight = +getComputedStyle(codeWrapper).lineHeight.replace('px', '');
  const rows = codeWrapper.clientHeight / lineHeight;
  const prefixContainer = document.querySelector('.contacts__prefix');
  prefixContainer.innerHTML = '';
  for (let i = 1; i < rows + 1; i++) {
    prefixContainer.innerHTML += `<div>${i}</div>`;
  }
}
//
// отправка формы
form &&
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const check = checkForm(e.target);
    check && sendMessage();
  });

async function sendMessage() {
  const name = form.querySelector('#name').value;
  const text = form.querySelector('#message').value;
  const email = form.querySelector('#email').value;

  const message = `
  Имя: ${name}
  E-mail: ${email}
  Сообщение: ${text}`;

  const answer = await fetch(api.MESSAGE, {
    method: 'POST',
    body: JSON.stringify({ message }),
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((e) => alert(e.message));
  if (answer.isSuccess) {
    showThanks();
    formReset(form);
  }
}
// -- сброс формы
function formReset(form) {
  form.reset();
  document.querySelector('.js-name').textContent = '""';
  document.querySelector('.js-email').textContent = '""';
  document.querySelector('.js-message').textContent = '""';
}
// -- показ окна спасибо
function showThanks() {
  document.querySelector('.description__item--active').classList.remove('description__item--active');
  document.querySelector('.thanks').classList.add('description__item--active');
}
// -- проверка валидности формы
function checkForm(form) {
  const name = form.querySelector('#name').value.length > 1;
  !name
    ? (form.querySelector('.name__error').textContent = '//некорректное имя')
    : (form.querySelector('.name__error').textContent = '');
  const message = form.querySelector('#message').value.length > 0;
  !message
    ? (form.querySelector('.message__error').textContent = '//введите текст сообщения')
    : (form.querySelector('.message__error').textContent = '');
  const email = form.querySelector('#email').value.match(/.+@.+\..+/i);
  !email
    ? (form.querySelector('.email__error').textContent = '//некорректный email')
    : (form.querySelector('.email__error').textContent = '');

  return name && email && message;
}
//
// диалоговое окно с ошибкой
errorBtn &&
  errorBtn.addEventListener('click', () => {
    error.style.display = 'none';
  });
function showError(message, status) {
  errorMessage.innerHTML = message;
  errorTitle.textContent = `System Error - ${status}`;
  error.style.display = 'flex';
}
//
// изменение заголовков списка проектов
function addProjectNumber() {
  if (!projectsChecks) return;
  const projects = document.querySelectorAll('.description__item--active');
  projects.forEach((project, i) => {
    project.querySelector('.project__number').textContent = i + 1;
  });
}

projectsChecks.length && addProjectNumber();

function changeProjectsSubtitle() {
  const activeChecks = document.querySelectorAll('.js-checked');
  if (projectsChecks.length === activeChecks.length) {
    projectsSubtitle.textContent = 'все';
    return;
  }
  projectsSubtitle.textContent = '';
  activeChecks.forEach((check, i) => {
    projectsSubtitle.textContent += check.dataset.src + (i + 1 === activeChecks.length ? '' : ',');
  });
}
projectsChecks.length && changeProjectsSubtitle();

projectsChecks.length &&
  projectsChecks.forEach((box) => {
    box.addEventListener('change', (e) => {
      let action = '';
      if (e.target.checked) {
        action = 'add';
        e.target.classList.add('js-checked');
      } else {
        action = 'remove';
        e.target.classList.remove('js-checked');
      }
      const data = e.target.dataset.src;
      document.querySelectorAll(`.project[data-src="${data}"]`).forEach((project) => {
        project.classList[action]('description__item--active');
      });
      changeProjectsSubtitle();
      addProjectNumber();
    });
  });
//
