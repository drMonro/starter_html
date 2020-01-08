const TIMEOUT = 10000;
const SUCCESS_STATUS = 200;
const DATA_URL = `https://jsonplaceholder.typicode.com/posts`;
// const DEBOUNCE_INTERVAL = 500;
const GET_METHOD = `GET`;
// const POST_METHOD = `POST`;
const data = [];
const button = document.querySelector(`button`);

let sendRequest = (method, url) => {
  return new Promise(function (resolve, reject) {
    // Открываем новый XHR
    let request = new XMLHttpRequest();
    request.responseType = `json`;
    request.timeout = TIMEOUT;
    request.open(method, url);
    // После загрузки запроса
    // проверяем, был ли он успешным
    request.onload = function () {
      if (request.status === SUCCESS_STATUS) {
        // Если успешный, то резолвим промис
        resolve(request.response);
      } else {
        // Если нет, то реджектим промис
        reject(`Произошла ошибка. Код ошибки:` + request.status);
      }
    };
    request.addEventListener(`error`, function () {
      onErrorRequest(`Попытка возобновить соединениe`);
      if (method === `GET`) {
        // resolve(request.response);
      }
    });
    request.addEventListener(`timeout`, function () {
      onErrorRequest(`Запрос не успел выполниться за ` + request.timeout + `мс`);
    });
    request.send();
  });
};


// var debounce = function (cb) {
//   var lastTimeout = null;
//   var interval = DEBOUNCE_INTERVAL;
//   return function () {
//     var parameters = arguments;
//     if (lastTimeout) {
//       window.clearTimeout(lastTimeout);
//     }
//     lastTimeout = window.setTimeout(function () {
//       cb.apply(null, parameters);
//     }, interval);
//   };
// };

let onSuccessRequest = function (webData) {
  saveWebData(webData);
  renderData(data);
};

let saveWebData = function (webData) {
  webData.forEach(function (item, index) {
    data[index] = item;
  });
};

let renderData = function (items) {
  let fragment = document.createDocumentFragment();
  let dataBlock = document.querySelector(`div`);
  dataBlock.innerText = ``;

  items.forEach(function (item) {
    fragment.appendChild(createDataCard(item));
  });
  dataBlock.appendChild(fragment);
};

let createDataCard = function (item) {
  let cardTemplate = document.querySelector(`#dataCard`)
    .content
    .querySelector(`.dataCard`);
  let dataElement = cardTemplate.cloneNode(true);

  dataElement.querySelector(`.data_id`).textContent = item.id;
  dataElement.querySelector(`.data_userId`).textContent = item.userId;
  dataElement.querySelector(`.data_title`).textContent = item.title;
  dataElement.querySelector(`.data_body`).textContent = item.body;
  return dataElement;
};

let onErrorRequest = function (errorMessage) {
  let errorBlock = document.createElement(`div`);
  errorBlock.classList = `errorMessage`;
  errorBlock.style = `z-index: 100; margin: 0 auto; text-align: center; background-color: red;`;
  errorBlock.style.position = `absolute`;
  errorBlock.style.left = 0;
  errorBlock.style.right = 0;
  errorBlock.style.fontSize = `30px`;
  errorBlock.style.height = `30px`;
  errorBlock.style.borderBottom = `4px solid yellow`;
  errorBlock.textContent = errorMessage;
  document.body.insertAdjacentElement(`afterbegin`, errorBlock);
};

let onSend = function () {
  sendRequest(GET_METHOD, DATA_URL).then(onSuccessRequest, onErrorRequest);

}

button.addEventListener(`click`, onSend);


