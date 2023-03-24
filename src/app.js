window.onload;
const valueSearchArray = ['USD', 'EUR', 'PLN', 'CZK', 'KZT'];
const imgValue = {
  UAN: './img/iconFlag/ukr.png',
  USD: './img/iconFlag/usa.png',
  EUR: './img/iconFlag/europe.png',
  KZT: './img/iconFlag/kzkhst.png',
  PLN: './img/iconFlag/poland.png',
  CZK: './img/iconFlag/czech.png',
};
const MONEY_VALUE = [];

const URL_API =
  'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

getResponse();
async function getResponse() {
  try {
    let response = await fetch(URL_API);
    let textJson = await response.json();
    filterAPI(textJson);
  } catch (error) {}
}
const filterAPI = (textJson) => {
  const time = textJson[1]['exchangedate'];
  updateTime(time);
  for (let i = 0; i < textJson.length; i++) {
    const element = textJson[i];
    for (let i = 0; i < valueSearchArray.length; i++) {
      const elem = valueSearchArray[i];
      element.cc === elem ? MONEY_VALUE.push(element) : null;
    }
  }
  const uanValue = {
    rate: 1,
    cc: 'UAN',
  };
  MONEY_VALUE.push(uanValue);
  MONEY_VALUE.map((e) => {
    e.backgroundImage = imgValue[e.cc];
  });

  return time;
};

const updateTime = function (time) {
  const timeLastResponse =
    document.querySelector('.app__attention').firstElementChild;
  timeLastResponse.innerHTML = time;
};

document.addEventListener('click', click);
function click(e) {
  const windGroup = document.querySelectorAll('.app__wind');
  const currentOptionGroup = document.querySelectorAll('.current');
  const windCurrency = e.target.parentElement;
  let cheker = true;
  // поміняти значення між вікнами
  if (e.target.id === 'arrow') {
    let buffer;
    buffer = `${currentOptionGroup[0].innerText}`;
    currentOptionGroup[0].innerText = currentOptionGroup[1].innerText;
    currentOptionGroup[1].innerText = buffer;
    MONEY_VALUE.forEach((obj) => {
      if (obj.cc === currentOptionGroup[0].innerText) {
        currentOptionGroup[0].style.backgroundImage = `url(${obj.backgroundImage})`;
      }
      if (obj.cc === currentOptionGroup[1].innerText) {
        currentOptionGroup[1].style.backgroundImage = `url(${obj.backgroundImage})`;
      }
    });
    input(e, true);
  }
  if (e.target.className.split(' ')[0] === 'option') {
    let windIsntActiv;
    let windActiv;
    windGroup.forEach((e) => {
      windCurrency.id !== e.id ? (windIsntActiv = e) : (windActiv = e);
    });
    const optionCurrent = windActiv.children[0];

    if (
      windCurrency.classList[1] === 'active' &&
      e.target.className === 'option current'
    ) {
      windGroup.forEach((e) => {
        e.classList.remove('active');
        e.classList.add('deactive');
        document.querySelectorAll('.minor').forEach((e) => {
          e.classList.toggle('minor');
          setTimeout(() => {
            e.remove();
          }, 300);
        });
      });
      return;
    }
    // закриття відкритих вікон при відкритті нового вікна

    if (windIsntActiv) {
      windIsntActiv.classList.remove('active');
      windIsntActiv.classList.remove('deactive');
      const hiIsntActiv = windIsntActiv.querySelectorAll('.minor');
      hiIsntActiv.forEach(() => {
        document.querySelectorAll('.minor').forEach((e) => {
          e.classList.toggle('minor');
          setTimeout(() => {
            e.remove();
          }, 300);
        });
      });
    }
    // відкриття актуального вікна
    if (windCurrency.classList[1] === 'active' && optionCurrent !== e.target) {
      optionCurrent.innerHTML = e.target.innerHTML;
      cheker = !cheker;
      MONEY_VALUE.forEach((obj) => {
        obj.cc === optionCurrent.innerHTML
          ? (optionCurrent.style.backgroundImage = `url(${obj.backgroundImage})`)
          : null;
        windActiv.classList.remove('active');
        windActiv.classList.add('deactive');
        const hiIsntActiv = windActiv.querySelectorAll('.minor');
        hiIsntActiv.forEach(() => {
          document.querySelectorAll('.minor').forEach((e) => {
            e.classList.toggle('minor');
            setTimeout(() => {
              e.remove();
            }, 300);
          });
        });
      });
    }
    if (windCurrency.classList[1] !== 'active' && cheker) {
      windsValues(MONEY_VALUE, windActiv, currentOptionGroup);
      windCurrency.classList.add('active');
      windCurrency.classList.remove('deactive');
    }
    input(e, true);
    cheker = !cheker;
    return;
  }
  // закривання всіх вікон при клиці на любе інше місце крім вікна
  windGroup.forEach((e) => {
    if (e.classList[e.classList.length - 1] === 'active') {
      e.classList.remove('active');
      e.classList.add('deactive');
      document.querySelectorAll('.minor').forEach((e) => {
        e.classList.toggle('minor');
        setTimeout(() => {
          e.remove();
        }, 300);
      });
    }
  });
}
const windsValues = (arrayObj, windActiv, optionCurrent) => {
  const newArrayObj = arrayObj.filter(
    (obj) =>
      obj.cc !== optionCurrent[0].innerText &&
      obj.cc !== optionCurrent[1].innerText
  );
  newArrayObj.forEach((obj) => {
    let option = document.createElement('p');
    option.innerText = obj.cc;
    option.style.backgroundImage = `url(${obj.backgroundImage})`;
    option.classList = 'option';
    windActiv.append(option);
    setTimeout(() => {
      option.classList.add('minor');
    }, 50);
  });
};

const input = (e, changeValue = false) => {
  const entry = document.querySelectorAll('.app__enter');
  const [entryTop, entryBottom] = [entry[0], entry[1]];
  const windsCurrent = document.querySelectorAll('.current');
  const [windTop, windBottom] = [windsCurrent[0], windsCurrent[1]];
  let valueTop, valueBottom;
  MONEY_VALUE.forEach((obj) => {
    if (obj.cc === windTop.innerText) {
      valueTop = obj.rate;
    }
    if (obj.cc === windBottom.innerText) {
      valueBottom = obj.rate;
    }
  });
  let rate;
  if (e.target === entryTop || (changeValue && entryTop.value > 0)) {
    rate = (entryTop.value * valueTop) / valueBottom;
    entryBottom.value =
      entryTop.value > 10
        ? parseFloat(rate.toFixed(1))
        : parseFloat(rate.toFixed(3));
  }
  if (e.target === entryBottom) {
    rate = (entryBottom.value * valueBottom) / valueTop;
    entryTop.value =
      entryBottom.value > 10
        ? parseFloat(rate.toFixed(1))
        : parseFloat(rate.toFixed(3));
    console.log(rate > 1);
  }
};
addEventListener('input', input);
