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

  console.log(USD);
  console.log(EUR);
  console.log(JPY);
  console.log(GBP);
  console.log(AUD);
  console.log(CAD);
  console.log(CHF);
  console.log(CNY);
  console.log(HKD);
  console.log(NZD);
  console.log(SEK);
  console.log(KRW);
  console.log(SDG);
  console.log(NOK);
  console.log(MXN);

}