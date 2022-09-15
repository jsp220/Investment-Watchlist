var favStock = [];
$('#add').on('click', async function (event){ 

    event.preventDefault();
    var stockID = $(this).siblings("#search-term").val();
    favStock.push(stockID)
    console.log(favStock);
    localStorage.setItem('stockList', JSON.stringify(favStock));
    init();


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

    fetchStock(favStock)


 }

 init();


async function fetchStock(favStock){

    for (let stock of favStock ){

        const encodedParams = new URLSearchParams();
        encodedParams.append("symbol", `${stock}`);
    
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '95007c2cbdmshdc263a66001d842p14fe60jsn287c75076a56',
                'X-RapidAPI-Host': 'yahoo-finance97.p.rapidapi.com'
            },
            body: encodedParams
        };
    
        await fetch('https://yahoo-finance97.p.rapidapi.com/stock-info', options)
            .then(response => response.json())
            .then(function(response){
    
                var divEl = $("<div class='test'>");
                var price = response.data.currentPrice;
                var priceChg = (response.data.open - response.data.currentPrice).toFixed(3);
                var marketCap = response.data.marketCap;
                var symb = response.data.symbol;
                var priceChgpcnt = (priceChg/price*100).toFixed(2);
                divEl.text(`${symb} $${price} $${priceChg} (${priceChgpcnt}%)`);
                $(".fav-list").append(divEl);
    
            })
            .catch(err => console.error(err));

    }
}
