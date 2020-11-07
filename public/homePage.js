"use strict";

//const newUser = new UserForm();

const newLogoutButton = new LogoutButton();

newLogoutButton.action = () => ApiConnector.logout((response) => {
   if (response.success == false) { // а бывает и фолс?
      alert(response.error);
      return;
   }
   location.reload();
   });