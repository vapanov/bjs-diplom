"use strict";

const newUser = new UserForm();

newUser.loginFormCallback = (data) => ApiConnector.login(data, (response) => {
   if (response.success == false) {
      alert(response.error);
      return;
   }
   location.reload();
});

// регистрация прокатывает с уже готовыми учётными данными? ведь по уму должна быть другая проверка - на наличие такого пользователя и на сложность пароля?

newUser.registerFormCallback = (data) => ApiConnector.login(data, (response) => {
   if (response.success == false) {
      alert(response.error);
      return;
   }
   location.reload();
});