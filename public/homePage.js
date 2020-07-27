'use strict';

// Выход из личного кабинета
const logoutButton = new LogoutButton();
logoutButton.action = () => ApiConnector.logout(response => {
    if (response.success) {
        location.reload();
    }
});

// Получение информации о пользователе
ApiConnector.current(response => ProfileWidget.showProfile(response.data));

//Получение текущих курсов валюты
const ratesBoard = new RatesBoard();

function getStocks() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}

getStocks();
const timerGetStocks = setInterval(getStocks, 60 * 1000);

// Операции с деньгами
const moneyManager = new MoneyManager();

// Пополнение баланса
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            moneyManager.setMessage(false, `Баланс пополнен на ${data.amount} ${data.currency}`);
            ProfileWidget.showProfile(response.data);
        }
        else {
            moneyManager.setMessage(true, response.data);
        }
    });
}

// Конвертирование валюты
moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            moneyManager.setMessage(false, `Выполнена конвертация ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`);
            ProfileWidget.showProfile(response.data);
        }
        else {
            moneyManager.setMessage(true, response.data);
        }
    });
}

// Перевод валюты
moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            moneyManager.setMessage(false, `Выполнен перевод ${data.amount} ${data.currency}`);
            ProfileWidget.showProfile(response.data);
        }
        else {
            moneyManager.setMessage(true, response.data);
        }
    });
}

// Работа с избранным
const favoritesWidget = new FavoritesWidget();

//Начальный список избранного 
ApiConnector.getFavorites((response) => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

//Добавлениe пользователя в список избранных
favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritesWidget.setMessage(false, `Пользователь ${data.name} добавлен в избранное`);
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
        else {
            favoritesWidget.setMessage(true, response.data);
        }
    });
};

//Удаление пользователя из избранного
favoritesWidget.removeUserCallback = id => {
    ApiConnector.removeUserFromFavorites(id, response => {
        if (response.success) {
            favoritesWidget.setMessage(false, `Пользователь удален из избранного`);
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
        else {
            favoritesWidget.setMessage(true, response.data);
        }
    });
};