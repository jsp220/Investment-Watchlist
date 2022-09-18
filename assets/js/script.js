/*
    Created:    09/15/2022 
    Programmer: Brian Zoulko, Joon Park, Ryan Dao, Qi Chen
    Notes:      Module provides api calls and stores detail in local storage.

    Modification
    ============
    09/15/2022 Brian Zoulko    Added newsapi.js to the Add function for the
                               adding the crypto news to the html web page.
*/

function DarkMode() {
    var toggle = document.body;
    toggle.classList.toggle("dark-mode");
 }

var favCrypto;
var favStock;

function init() {
    // Retrieve favorite assets data from local storage  (init for crypto)
    var favCryp = localStorage.getItem("cryptoList");
    if (!favCryp || favCryp == "undefined" || favCryp == "[]") {
        // $(".crypto-list").attr("style", "display: none");
        $(".crypto-list").parent().hide();

    } else {
        // $(".crypto-list").attr("style", "display: block");
        $(".crypto-list").parent().show();
        favCrypto = JSON.parse(favCryp);
        favCrypto.splice(10); // limit to 10 crypto?
        favCryptoApi(favCrypto);
    }

    // init for stock
    var favStoc = localStorage.getItem("stockList");
    if (!favStoc || favStoc == "undefined" || favStoc == "[]") {
        // $(".stock-list").attr("style", "display: none");
        $(".stock-list").parent().hide();
    } else {
        // $(".stock-list").attr("style", "display: block");
        $(".stock-list").parent().show();
        favStock = JSON.parse(favStoc);
        favStock.splice(10);
        for (let i in favStock){
            fetchStock(favStock[i])
        }
    }
}

async function favCryptoApi(favCrypto) {
    for (i in favCrypto) {
        var data = await cryptoApi(favCrypto[i]);
        appendFave(data);
    }
}

// cryptoApi using cryptoID
async function cryptoApi(cryptoId) {
    var cryptoApiUrl = "https://api.coingecko.com/api/v3/coins/" + cryptoId;
    
    var data = await fetch(cryptoApiUrl)
        .then(function(response) {
            return response.json();
        });
    return data;
}

function appendFave (data) {
    var divEl = $(`<div class='collection-item list-item bold' id='${data.id}'>`);
    var symEl = $("<button class='waves-effect waves-light btn-small load-news-item'>'s2'</button>");
    var priceEl = $("<div class='s3'>");
    var priceChgEl = $("<div class='s3'>");
    var delBtnEl = $("<button class='btn-floating btn-small waves-effect waves-light red remove'><i class='material-icons'>-</i></button>")
    var sym = data.symbol;
    var sym = sym.toUpperCase();
    var price = data.market_data.current_price.usd;
    var priceChg = data.market_data.price_change_24h;
    if (!priceChg) {
        priceChg = "0.00";
    } else if (Math.abs(priceChg) < 0.01) {
        priceChg = priceChg.toPrecision(2);
    } else {
        priceChg = priceChg.toFixed(2);
    }

    if (!price) {
        priceChgPcnt = "0.00";
        price = "0.00";
    } else {
        var priceChgPcnt = (priceChg/price*100).toFixed(2);
    }

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    
    if (price >= 0.01 || price < 0.00001) {
        price = formatter.format(price);
    } else {
        price = "$" + price;
    }
    
    symEl.text(sym);
    priceEl.text(price);
    priceChgEl.text(`$${priceChg} (${priceChgPcnt}%)`);
    if (priceChg < 0) {
        priceChgEl.addClass("red-font");
    } else if (priceChg > 0) {
        priceChgEl.addClass("green-font");
    }

    // $(".crypto-list").attr("style", "display: block");
    $(".crypto-list").parent().show();
    divEl.append(symEl, priceEl, priceChgEl, delBtnEl);
    $(".fav-list").append(divEl);

    $(".remove").on("click", function() {
        var remId = $(this).parent().attr("id");
        
        for (i in favCrypto) {
            if (remId === favCrypto[i]) {
                favCrypto.splice(i, 1);
            }
        }
        localStorage.setItem("cryptoList", JSON.stringify(favCrypto));

        if (favCrypto.length == 0) {
            // $(".crypto-list").attr("style", "display: none");
            $(".crypto-list").parent().hide();
            localStorage.clear();
        }
        $(this).parent().remove();
    });

    // 09/16/2022 BZ - Added new button for a quick reload of that item.
    $(".load-news-item").on("click", async function() { 
        var txtVal = $(this).parent().text().split("$");   
        console.log($(this).parent().siblings("h2").text());     
        var cryptoIdName = await searchTermToId(txtVal[0]);
        loadNewsFor(cryptoIdName[1]);
    });
}

async function searchTermToId(term) {
    var data = await fetch("https://api.coingecko.com/api/v3/coins/list")
        .then(function(response) {
            return response.json();
        })
    term = term.toLowerCase();
    var cryptoId = 0;
    var cryptoName = 0;
    for (i in data) {
        if (!data[i].id.startsWith("binance")) {
            if (term == data[i].id || term == data[i].name || term == data[i].symbol) {
                cryptoId = data[i].id;
                cryptoName = data[i].name;
                break;
            }
        }
    }
    if (!cryptoId) {       
        $("#warning").show();
        $("#warning").text("Search term not found.");

        var timer = setInterval(function() {
            $("#warning").fadeOut();
        }, 2000);
        return;
    }

    return [cryptoId, cryptoName];
}

async function fetchStock(stock) {

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

    var response = await fetch('https://yahoo-finance97.p.rapidapi.com/stock-info', options)
        .then(response => response.json())
    
    if (!response.data.symbol) {
        $("#warning").show();
        $("#warning").text("Search term not found.");

        var timer = setInterval(function() {
            $("#warning").fadeOut();
        }, 2000);
        return false;
    } else {
        var divEl = $(`<div class='collection-item list-item bold' id='${response.data.symbol.toLowerCase()}'>`);
        var symEl = $("<button class='waves-effect waves-light btn-small load-news-item'>'s2'</button>");
        var priceEl = $("<div class='s3'>");
        var priceChgEl = $("<div class='s3'>");
        var delBtnEl = $("<button class='btn-floating btn-small waves-effect waves-light red remove'><i class='material-icons'>-</i></button>")
        var sym = response.data.symbol;
        var price = response.data.currentPrice;
        var priceChg = response.data.currentPrice - response.data.open;
        if (!priceChg) {
            priceChg = 0;
        }

        var marketCap = response.data.marketCap;

        if (Math.abs(priceChg) > 0 && Math.abs(priceChg) < 0.01) {
            priceChg = priceChg.toPrecision(2);
        } else {
            priceChg = priceChg.toFixed(2);
        }

        if (!price) {
            priceChgPcnt = "0.00";
            price = "0.00";
        } else {
            var priceChgPcnt = (priceChg/price*100).toFixed(2);
        }

        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
            
        price = formatter.format(price);

        symEl.text(sym);
        priceEl.text(price);
        priceChgEl.text(`$${priceChg} (${priceChgPcnt}%)`);
        if (priceChg < 0) {
            priceChgEl.addClass("red-font");
        } else if (priceChg > 0) {
            priceChgEl.addClass("green-font");
        }          

        // $(".stock-list").attr("style", "display: block");
        $(".stock-list").parent().show();
        divEl.append(symEl, priceEl, priceChgEl, delBtnEl);
        $(".fav-stock-list").append(divEl);

        $(".remove").on("click", function() {
            var remId = $(this).parent().attr("id");
            
            console.log(remId)

            for (i in favStock) {
                if (remId === favStock[i]) {
                    favStock.splice(i, 1);
                }
            }
            localStorage.setItem("stockList", JSON.stringify(favStock));

            if (favStock.length == 0) {
                // $(".stock-list").attr("style", "display: none");
                $(".stock-list").parent().hide();
            } else {

            }

            $(this).parent().remove();
        });
        $(".load-news-item").on("click", async function() { 
            var txtVal = $(this).parent().text().split("$");   
            loadStockNewsFor(txtVal[0]);
        });
        return true;
    }
}

init();

$("#add").on("click", async function(event) {
    event.preventDefault();

    var searchTerm = $(this).siblings("#search-term").val();
    // console.log($('#crypto').is(":checked"));
    // console.log($('#stock').is(":checked"));
    var crypto = $('#crypto').is(":checked")
    var stock = $('#stock').is(':checked')

    if (!searchTerm) {
        $("#warning").show();
        $("#warning").text("Please enter a search term.");

        var timer = setInterval(function() {
            $("#warning").fadeOut();
        }, 2000);
        return;
    }

    if (crypto) {
          
        var cryptoIdName = await searchTermToId(searchTerm);

        if (!cryptoIdName[0]) {
            $(this).siblings("#search-term").val("");
            return;
        }

        var favCryp = localStorage.getItem("cryptoList");

        if (!favCryp || favCryp == "undefined") {
            favCrypto = [];
        } else {
            favCrypto = JSON.parse(favCryp);
        }
        
        if (jQuery.inArray(cryptoIdName[0], favCrypto) == -1) {
            favCrypto.push(cryptoIdName[0]);
            localStorage.setItem("cryptoList", JSON.stringify(favCrypto));

            var data = await cryptoApi(cryptoIdName[0]);
            appendFave(data);   
        }

        $(this).siblings("#search-term").val("");

        // 09/15/2022 BZ - Created function to load news.
        loadNewsFor(cryptoIdName[1]);

        return;
        
    } else if (stock) {

        var stockId = $(this).siblings("#search-term").val();

        var favStoc = localStorage.getItem("stockList");

        if (!favStoc || favStoc == "undefined") {
            favStock = [];
        } else {
            favStock = JSON.parse(favStoc);
        }

        if (jQuery.inArray(stockId, favStock) == -1) {
            
            var stockSuccess = await fetchStock(stockId);
            if (!stockSuccess) {
                $(this).siblings("#search-term").val("");
                console.log("a")
                return;
            } else {
                favStock.push(stockId);
                localStorage.setItem("stockList", JSON.stringify(favStock));
            }
        }

        $(this).siblings("#search-term").val("");
    }  
});

/* **************************************************  
    09/15/2022 BZ - Created for loading news.
    Obtain news detail for requested search criteria.    
***************************************************** */
async function loadNewsFor(searchCriteria) {
    
    var objCrypto = await getCryptoNews(searchCriteria);
    var newsDetail = $(".right-box"); 
    // Reset text every time.
    var newDivArea = $('<div class="added-news-area">');
    newsDetail.find('.added-news-area').remove();

    // Add Crypto News to the HTML page.
    if (!objCrypto) {
        console.log("no news found");
        return;
    }
    
    objCrypto.splice(10);
    
    for (let i in objCrypto) {
        // var newsDivItem = $(`<div class='added-news-items'>`);
        var newsDivItem = $(`<div class='news-items'>`);
        var newsItems = $(`<a href="${objCrypto[i].url}"  target="_blank" class='added-news-items'>`);
        newsItems.text(objCrypto[i].source);
        newsDivItem.append(newsItems);
        newDivArea.append(newsDivItem);
    }

    newsDetail.append(newDivArea);
}


async function stockNews(searchFor){

    // Define options for FETCH call.
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3c1de3c74amsha8d8f057b36bd85p16c3bcjsnf67f38a740dd',
            'X-RapidAPI-Host': 'google-news1.p.rapidapi.com'
        }
    };

    // Create Crypto News Object for all results.
    var bFoundNews = false;
    var objStock = [{
        source: "", 
        title: "",
        url: ""
    }];
    var rtnData = "";
    
    var stockID = searchFor
    // F E T C H  News information using RapidAPI w/crypto-news.
    await fetch(`https://google-news1.p.rapidapi.com/search?q=${stockID}&country=US&lang=en-US&when=30d&source=cnn.com&limit=50`, options)
	.then(response => response.json())
	.then(function(response){

        // Initialize variables for pulling news detail.
        var sFind = searchFor.toUpperCase();

        // Remove the empty object created when initializing the object.
        objStock.pop(objResult);

        // Load news titles that contains matching text from
        // the "searchFor" parameter.
        for (let x = 0; x < response.articles.length; x++) {            
                var objResult = {
                    source: response.articles[x].source.title, 
                    title: response.articles[x].title,
                    url: response.articles[x].link
                };

                objStock.push(objResult);
                bFoundNews = true;
        }
    }).catch(err => console.error(err));
    return objStock;
}

async function loadStockNewsFor(searchCriteria) {
    var objStock = await stockNews(searchCriteria);
    var newsDetail = $(".right-box"); 
    // Reset text every time.
    var newDivArea = $('<div class="added-news-area">');
    newsDetail.find('.added-news-area').remove();

    // Add Crypto News to the HTML page.
    if (!objStock) {
        console.log("no news found");
        return;
    }

    objStock.splice(10);

    for (var i=0; i<objStock.length; i++) {
        var newsDivItem = $(`<div class='news-items'>`);
        var newsItems = $(`<a href="${objStock[i].url}"  target="_blank" class='added-news-items'>`);
        newsItems.text(objStock[i].title);
        newsDivItem.append(newsItems);
        newDivArea.append(newsDivItem);
    }

    newsDetail.append(newDivArea);
}

