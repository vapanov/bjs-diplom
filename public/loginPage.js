"use strict";

const newUser = new UserForm();

newUser.loginFormCallback = (data) => ApiConnector.login(data, (response) => {
   if (response.success == false) {
      newUser.setLoginErrorMessage(response.error);
      return;
   }
   location.reload();
});


newUser.registerFormCallback = (data) => ApiConnector.register(data, (response) => {
   if (response.success == false) {
      newUser.setRegisterErrorMessage(response.error);
      return;
   }
   location.reload();
});

// теперь новый пользователь регистрируется и входит, но сразу после этого валятся ошибки в другой странице (