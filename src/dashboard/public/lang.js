/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function checkLang() {
  let lang = getParameterByName('lang');
  if (!lang && localStorage.getItem('lang')) {
    lang = localStorage.getItem('lang');
    let url = window.location.href;
    url = url.split('?')[0];
    url += `?lang=${lang}`;
    window.location.href = url;
  } else if (lang && localStorage.getItem('lang') !== lang) {
    localStorage.setItem('lang', lang);
    let url = window.location.href;
    url = url.split('?')[0];
    url += `?lang=${lang}`;
    window.location.href = url;
  }
  if (!lang) {
    lang = navigator.language;
    lang = lang.substr(0, 2);
    let url = window.location.href;
    url = url.split('?')[0];
    url += `?lang=${lang}`;
    window.location.href = url;
  }
}
checkLang();

function changeLang(lang) {
  localStorage.setItem('lang', lang);
  let url = window.location.href;
  url = url.split('?')[0];
  url += `?lang=${lang}`;
  window.location.href = url;
}
