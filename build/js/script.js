const menuBtn = document.querySelector('.navigation__button');
const navigation = document.querySelector('.header');
const container = document.querySelector('.container');
const subListBtns = document.querySelectorAll('.sub-list__button');
const textWrapper = document.querySelector('.description__text-wrapper');
const menuBtns = document.querySelectorAll('.sub-list__button,.sub-list__item,.content__link[data-src]');
const descriptionTitle = document.querySelector('.description__title');
const dailyPlaylist = document.querySelector('.daily-playlist');

const LETTER_WIDTH = 10.79;
const PADDING = 54;
const PREFIX_WIDTH = 129;

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
  formatText();
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
textWrapper.addEventListener('resize', formatText);

formatText();
function formatText() {
  const activeContent = document.querySelector('.description__item--active').querySelector('.description__text-wrapper');
  if (activeContent.parentElement.dataset.src === 'music') return;
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
  const postfix = target.dataset.src.split('--')[1] ? '--' + target.dataset.src.split('--')[1] : '';
  document.querySelector('.description__item--active').classList.remove('description__item--active');
  document.querySelector(`.description__item[data-src="${data}"`).classList.add('description__item--active');
  formatText();

  document.querySelector('.content__item--active') && document.querySelector('.content__item--active').classList.remove('content__item--active');
  document.querySelector(`.content__item[data-src="${data + postfix}"]`) && document.querySelector(`.content__item[data-src="${data + postfix}"]`).classList.add('content__item--active');
}
