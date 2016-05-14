// input.oninput = function() {
//   if (isNaN(this.value)) { // введено не число
//     // показать ошибку
//     this.className = "error";
//     error.innerHTML = 'Вы ввели не число. Исправьте, пожалуйста.'
//   }
// };

// var elem = document.getElementsByClassName('testClass');
// console.log(elem);

searchForm.oninput = function() {
  if (isNaN(this.value)) { // введено не число
    // показать ошибку
    this.className = "error";
    error.innerHTML = 'Вы ввели не число. Исправьте, пожалуйста.'
  }
};

// elem.addEventListener("input", testfunc);
// $('.testClass').on('input', function () {testfunc });

// function testfunc () { 

//     if (isNaN(this.value)) { // введено не число
//         // показать ошибку
//         this.className = "error";
//         error.innerHTML = 'Вы ввели не число. Исправьте, пожалуйста.'
//     };
// }

$(document).on('search-form', function () {
  var $item = $(this),
        value = $item.val();
  console.log('working');

  // А тут творим магию...
});

// elem.oninput = function() {
//   if (isNaN(this.value)) { // введено не число
//     // показать ошибку
//     // this.className = "error";
//     error.innerHTML = 'selected on ID  in JS file'
//   }
// };


// input.onfocus = function() {
//   if (this.className == 'error') { // сбросить состояние "ошибка", если оно есть
//     this.className = "";
//     error.innerHTML = "";
//   }
// };

$(function () { App.start() });