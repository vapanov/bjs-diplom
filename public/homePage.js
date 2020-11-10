"use strict";


// запрос деавторизации 
const newLogoutButton = new LogoutButton();

newLogoutButton.action = () => ApiConnector.logout((response) => {
   if (response.success == false) { // а бывает и фолс?
      alert(response.error);
      return;
   }
   location.reload();
   });


// Запрос на получение текущего пользователя (current)
// если ответ успешный, то вызываем отображение данных профиля (ProfileWidget.showProfile) в который передаём данные ответа от сервера.
ApiConnector.current((response) => {
   if (response.success == false) {
      // выбросить на страницу входа?
      return;
   }
   ProfileWidget.showProfile(response.data);
});


//запрос на получение курсов валют
const newRatesBoard = new RatesBoard();

function getRates () {
   ApiConnector.getStocks((response) => {
      if (response.success == false) {
         // не обновляем имеющиеся данные и выходим
         return;
      }
      newRatesBoard.clearTable(); // очищаем таблицу
      newRatesBoard.fillTable(response.data); // заполняем таблицу новыми даными
   });
}

getRates(); // получаем текущие курсы и заполняем таблицу
let timerId = setInterval(() => getRates(), 60000); // обновляем таблицу раз в минуту


// Операции с деньгами
const newMoneyManager = new MoneyManager();

// зачисление
newMoneyManager.addMoneyCallback = ((data) => {
   ApiConnector.addMoney(data, ((response) => {
      let message = response.error;
      if (response.success == true) {
         ProfileWidget.showProfile(response.data);
         message = `Сумма ${data.amount} зачислена на счёт ${data.currency}`;
      }
      newMoneyManager.setMessage(response.success, message);
   }));
});

//конвертация
newMoneyManager.conversionMoneyCallback = ((data) => {
   ApiConnector.convertMoney(data, ((response) => {
      let message = response.error;
      if (response.success == true) {
         ProfileWidget.showProfile(response.data);
         message = `${data.fromAmount} из ${data.fromCurrency} сконвертированы в ${data.targetCurrency}`;
      }
      newMoneyManager.setMessage(response.success, message);
   }));
});

//перевод
newMoneyManager.sendMoneyCallback = ((data) => {
   ApiConnector.transferMoney(data, ((response) => {
      let message = response.error;
      if (response.success == true) {
         ProfileWidget.showProfile(response.data);
         message = `${data.amount} из ${data.currency} переведены ${data.to}`;
      }
      newMoneyManager.setMessage(response.success, message);
   }));
});


//избранное
const newFavoritesWidget = new FavoritesWidget();

// Запрос начального списока избранного:
ApiConnector.getFavorites((response) => {
   if (response.success == false) {
      // выбросить на страницу входа?
      return;
   }
   newFavoritesWidget.clearTable(); // При успешном запросе очищаем текущий список избранного (clearTable).
   newFavoritesWidget.fillTable(response.data); // отрисовываем полученные данные (fillTable).
   newMoneyManager.updateUsersList(response.data); // заполняем выпадающий список для перевода денег (updateUsersList). !!!! в переводе денег data содержит индекс пользователя из фаворитов, можно было бы читать имя
});

// Добавление пользователя в список избранных:
newFavoritesWidget.addUserCallback = ((data) => {
   ApiConnector.addUserToFavorites(data, ((response) => {
      let message = response.error;
      if (response.success == true) {
         newFavoritesWidget.clearTable();
         newFavoritesWidget.fillTable(response.data);
         newMoneyManager.updateUsersList(response.data);
         message = `Пользователь ${data.name} добавлен в избранные`;
      }
      newFavoritesWidget.setMessage(response.success, message);
   }));
});

// Удаление пользователя из избранного
newFavoritesWidget.removeUserCallback = ((data) => {
   ApiConnector.removeUserFromFavorites(data, ((response) => {
      let message = response.error;
      if (response.success == true) {
         newFavoritesWidget.clearTable();
         newFavoritesWidget.fillTable(response.data);
         newMoneyManager.updateUsersList(response.data);
         message = `Пользователь ${data} удалён из избранных`;
      }
      newFavoritesWidget.setMessage(response.success, message);
   }));
});