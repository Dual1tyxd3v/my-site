const menuBtn = document.querySelector('.navigation__button');
const navigation = document.querySelector('.header');
const container = document.querySelector('.container');
const subListBtns = document.querySelectorAll('.sub-list__button');

// Кнопка меню
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
});
//
subListBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.target.parentElement.querySelector('.sub-list').classList.toggle('sub-list--opened');
    e.target.classList.toggle('sub-list__button--active');
  });
});
