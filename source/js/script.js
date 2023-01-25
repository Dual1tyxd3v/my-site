const menuBtn = document.querySelector('.navigation__button');
const navigation = document.querySelector('.header');
const container = document.querySelector('.container');
const subListBtns = document.querySelectorAll('.sub-list__button');
const textWrapper = document.querySelector('.description__text-wrapper');
const prefixContainer = document.querySelector('.description__content-prefix');
const LINE_HEIGHT = 18;
const LETTER_WIDTH = 11;

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
textWrapper.addEventListener('resize', formatText);

formatText();
function formatText() {
  const text = textWrapper.textContent.replace(/[ ]+/g,' ').split(' ');
  const containerWidth = textWrapper.clientWidth - 53;
  let stroke = 3;
  let temp = '';
  for (let i = 0; i < text.length; i++) {
    if ((temp + text[i]).length * 10.79 > containerWidth) {
      stroke++;
      temp = text[i] + ' ';
      continue;
    }
    temp += text[i] + ' ';
  }

  prefixContainer.innerHTML = "";
  for (let i = 0; i < stroke; i++) {
    let star = ' * ';
    if (i === 0 ) star = '/**';
    if (i === stroke - 1) star = ' */';
    prefixContainer.innerHTML += `<div><div class="description__numbers">${i + 1}</div><div class="description__stars">${star}</div></div>`;
  }
}
