var requestURL = 'https://api.exchangerate.host/latest?base=usd&places=4';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
  var response = request.response;
  console.log(response);
  var USD = response.rates.USD
  var EUR = response.rates.EUR
  var JPY = response.rates.JPY
  var GBP = response.rates.GBP
  var AUD = response.rates.AUD
  var CAD = response.rates.CAD
  var CHF = response.rates.CHF
  var CNY = response.rates.CNY
  var HKD = response.rates.HKD
  var NZD = response.rates.NZD
  var SEK = response.rates.SEK
  var KRW = response.rates.KRW
  var SDG = response.rates.SDG
  var NOK = response.rates.NOK
  var MXN = response.rates.MXN

  console.log("USD:USD: " + USD);
  console.log("USD:EUR: " + EUR);
  console.log("USD:JPY: " + JPY);
  console.log("USD:GBP: " + GBP);
  console.log("USD:AUD: " + AUD);
  console.log("USD:CAD: " + CAD);
  console.log("USD:CHF: " + CHF);
  console.log("USD:CNY: " + CNY);
  console.log("USD:HKD: " + HKD);
  console.log("USD:NZD: " + NZD);
  console.log("USD:SEK: " + SEK);
  console.log("USD:KRW: " + KRW);
  console.log("USD:SDG: " + SDG);
  console.log("USD:NOK: " + NOK);
  console.log("USD:MXN: " + MXN);

}

$('.dropdown-trigger').dropdown();
