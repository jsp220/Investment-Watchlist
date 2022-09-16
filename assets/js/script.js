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


//  Crypto API

// for testing init
var favCrypto = [];

function init() {
    // Retrieve favorite assets data from local storage
    var favCryp = localStorage.getItem("cryptoList");
    if (!favCryp) {
        favCrypto = [];
    } else {
        favCrypto = JSON.parse(favCryp);
        favCrypto.splice(10); // limit to 10 crypto?
    }
    // console.log(favCrypto);
    favCryptoApi(favCrypto);

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
    var divEl = $(`<div class='row collection-item list-item bold' id='${data.id}'>`);
    var symEl = $("<div class='s2'>");
    var priceEl = $("<div class='s3'>");
    var priceChgEl = $("<div class='s3'>");
    var delBtnEl = $("<button class='btn-floating btn-small waves-effect waves-light red remove'><i class='material-icons'>-</i></button>")
    var sym = data.symbol;
    var sym = sym.toUpperCase();
    var price = data.market_data.current_price.usd;
    var priceChg = data.market_data.price_change_24h;
    var priceChgPcnt = (priceChg/price*100).toFixed(2);

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
      
    formatter.format(price);

    if (Math.abs(priceChg) < 0.01) {
        priceChg = priceChg.toPrecision(2);
    } else {
        priceChg = priceChg.toFixed(2);
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
        
        console.log(favCrypto);
        for (i in favCrypto) {
            if (remId === favCrypto[i]) {
                favCrypto.splice(i, 1);
            }
        }
        localStorage.setItem("cryptoList", JSON.stringify(favCrypto));

        $(this).parent().remove();
    });
}

async function searchTermToId(term) {
    var data = await fetch("https://api.coingecko.com/api/v3/coins/list")
        .then(function(response) {
            return response.json();
        })
    term = term.toLowerCase();
    for (i in data) {
        if (term == data[i].id || term == data[i].name || term == data[i].symbol) {
            cryptoId = data[i].id;
            console.log(cryptoId);
            break;
        }
    }
    if (!cryptoId) {
        console.log("Search term not found"); // replace with code that displays error message in a modal
        return;
    }

    return cryptoId;
}




// favCryptoApi();

// search bar 

// allows the user to hit enter key to search instead of clicking the search button

init();

// $("#search-term").keypress(function (a) {
//     var key = a.which;
//     if (key == 13) {
//         $("#add").click();
//     }
// })

$("#add").on("click", async function(event) {
    event.preventDefault();

    var cryptoSearchTerm = $(this).siblings("#search-term").val();
    
    if (!cryptoSearchTerm) {
        return;
    }
    
    var cryptoId = await searchTermToId(cryptoSearchTerm);
    var data = await cryptoApi(cryptoId);
    appendFave(data);
    var favCryp = localStorage.getItem("cryptoList");
    if (!favCryp) {
        favCrypto = [];
    } else {
        favCrypto = JSON.parse(favCryp);
    }
    favCrypto.push(cryptoId);
    localStorage.setItem("cryptoList", JSON.stringify(favCrypto));

    $(this).siblings("#search-term").val("");

    // 09/15/2022 BZ - Created function to load news.
    loadNewsFor(cryptoSearchTerm);

});


/* **************************************************  
    09/15/2022 BZ - Created for loading news.
    Obtain news detail for requested search criteria.    
***************************************************** */
async function loadNewsFor(searchCriteria) {
    
    var objCrypto = await getCryptoNews(searchCriteria);
    var newsDetail = $(".crypto-news").text("News"); // Reset text every time.
    newsDetail.find('.added-news-items').remove();
    newsDetail.append($("<hr>"));

    // Add Crypto News to the HTML page.
    for (let i = 0; i < objCrypto.length; i++) {
        var newsItems = $(`<li class='added-news-items'>`);
        newsItems.text(objCrypto[i].source);
        newsDetail.append(newsItems);
    }

}

// test search term
// var cryptoSearchTerm = "ADA";
// search(cryptoSearchTerm);

// async function search (cryptoSearchTerm) {
//     var cryptoId = await searchTermToId(cryptoSearchTerm);
//     cryptoApi(cryptoId);
// }