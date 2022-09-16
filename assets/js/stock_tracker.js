// Stock Tracker API
var favStock = [];
$('#add').on('click', async function (event){ 

    event.preventDefault();
    var stockID = $(this).siblings("#search-term").val();
    favStock.push(stockID)
    console.log(favStock);
    localStorage.setItem('stockList', JSON.stringify(favStock));
    fetchStock(favStock[favStock.length-1]);


 })
function init(){

    var favStocks = localStorage.getItem("stockList");
    if (!favStocks){

        favStocks = [];

    }
    else{
        favStock = JSON.parse(favStocks);
        favStock.splice(10);
        console.log(favStock);

    }
    for (let i in favStock){

        fetchStock(favStock[i])

    }


 }

 init();

async function fetchStock(stock){

        const encodedParams = new URLSearchParams();
        encodedParams.append("symbol", `${stock}`);
    
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': 'b6ec4136fdmsh09212626991ff6cp16d7b6jsne74cbf4e92d5',
                'X-RapidAPI-Host': 'yahoo-finance97.p.rapidapi.com'
            },
            body: encodedParams
        };
    
        await fetch('https://yahoo-finance97.p.rapidapi.com/stock-info', options)
            .then(response => response.json())
            .then(function(response){
    
                console.log(response);
                var divEl = $(`<div class='row collection-item list-item bold' id='${response.data.symbol}'>`);
                var symEl = $("<div class='s2'>");
                var priceEl = $("<div class='s3'>");
                var priceChgEl = $("<div class='s3'>");
                var delBtnEl = $("<button class='btn-floating btn-small waves-effect waves-light red remove'><i class='material-icons'>-</i></button>")
                var sym = response.data.symbol;
                var price = response.data.currentPrice;
                var priceChg = (response.data.currentPrice - response.data.open).toFixed(2);
                var marketCap = response.data.marketCap;
                var priceChgPcnt = (priceChg/price*100).toFixed(2);
                var delBtnEl = $("<button class='btn-floating btn-small waves-effect waves-light red remove'><i class='material-icons'>-</i></button>")
                var formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                     });
                  
                formatter.format(price);
            
                if (Math.abs(priceChg) < 0.01) {
                    priceChg = priceChg.toPrecision(2);
                } else {
                    priceChg = priceChg;
                }
                
                symEl.text(sym);
                priceEl.text(`$${price}`);
                priceChgEl.text(`$${priceChg} (${priceChgPcnt}%)`);
                if (priceChg < 0) {
                    priceChgEl.addClass("red-font");
                } else if (priceChg > 0) {
                    priceChgEl.addClass("green-font");
                }
            
                divEl.append(symEl, priceEl, priceChgEl, delBtnEl);
                $(".fav-list").append(divEl);
            
                $(".remove").on("click", function() {
                    var remId = $(this).parent().attr("id");
                    
                    console.log(favStock);
                    for (i in favStock) {
                        if (remId === favStock[i]) {
                            favStock.splice(i, 1);
                        }
                    }
                    
                    localStorage.setItem("stockList", JSON.stringify(favStock));
            
                    $(this).parent().remove();
                });
    
            })
            .catch(err => console.error(err));

    }


// Currency API

// fetch('https://api.exchangerate.host/latest?base=usd&places=4')
// var url = 'https://api.exchangerate.host/latest?base=usd&places=4';


// function currencyExchange(){
//         fetch(url)
//         .then(function (res) {
//         return res.json();
//         })
//         .then(function(data){
//             var USD = data.rates.USD
//             console.log(USD);
//             test()
//             console.log(test());
//             console.log(a);
//         })
//         .catch(function (err) {
//         console.error(err);
//         });
//     }
// currencyExchange()

// function test(){
//     var USD = data.rates.USD
//     var a = USD * 16;
// }

// var USD = rate.USD
// var EUR = response.rates.EUR
// var JPY = response.rates.JPY
// var GBP = response.rates.GBP
// var AUD = response.rates.AUD
// var CAD = response.rates.CAD
// var CHF = response.rates.CHF
// var CNY = response.rates.CNY
// var HKD = response.rates.HKD
// var NZD = response.rates.NZD
// var SEK = response.rates.SEK
// var KRW = response.rates.KRW
// var SDG = response.rates.SDG
// var NOK = response.rates.NOK
// var MXN = response.rates.MXN

// console.log("USD:USD: " + USD);
// console.log("USD:EUR: " + EUR);
// console.log("USD:JPY: " + JPY);
// console.log("USD:GBP: " + GBP);
// console.log("USD:AUD: " + AUD);
// console.log("USD:CAD: " + CAD);
// console.log("USD:CHF: " + CHF);
// console.log("USD:CNY: " + CNY);
// console.log("USD:HKD: " + HKD);
// console.log("USD:NZD: " + NZD);
// console.log("USD:SEK: " + SEK);
// console.log("USD:KRW: " + KRW);
// console.log("USD:SDG: " + SDG);
// console.log("USD:NOK: " + NOK);
// console.log("USD:MXN: " + MXN);


// $('.dropdown-trigger').dropdown();


