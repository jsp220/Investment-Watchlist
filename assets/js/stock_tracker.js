const encodedParams = new URLSearchParams();
encodedParams.append("symbol", "AAPL");

const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/x-www-form-urlencoded',
		'X-RapidAPI-Key': '95007c2cbdmshdc263a66001d842p14fe60jsn287c75076a56',
		'X-RapidAPI-Host': 'yahoo-finance97.p.rapidapi.com'
	},
	body: encodedParams
};

fetch('https://yahoo-finance97.p.rapidapi.com/stock-info', options)
	.then(response => response.json())
    .then(function(response){

        var current = response.data.currentPrice;
        var different = response.data.open - response.data.currentPrice;
        var marketCap = response.data.marketCap;
    
        console.log("Current Price: " + current);
        console.log("Diffrenet: " + different);
        console.log("Market Cap: " + marketCap);

    })
	.catch(err => console.error(err));
