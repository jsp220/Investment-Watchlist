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
var favCrypto;

function init() {
    // Retrieve favorite assets data from local storage
    var favCryp = localStorage.getItem("cryptoList");
    console.log(favCryp);
    if (!favCryp) {
        $(".crypto-list").attr("style", "display: none");
    } else {
        $(".crypto-list").attr("style", "display: block");
        favCrypto = JSON.parse(favCryp);
        favCrypto.splice(10); // limit to 10 crypto?
        favCryptoApi(favCrypto);
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
    priceEl.text(`${price}`);
    priceChgEl.text(`$${priceChg} (${priceChgPcnt}%)`);
    if (priceChg < 0) {
        priceChgEl.addClass("red-font");
    } else if (priceChg > 0) {
        priceChgEl.addClass("green-font");
    }

    $(".crypto-list").attr("style", "display: block");
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
            $(".crypto-list").attr("style", "display: none");
            localStorage.clear();
        }
        $(this).parent().remove();
    });

    // 09/16/2022 BZ - Added new button for a quick reload of that item.
    $(".load-news-item").on("click", function() {
        var txtVal = $(this).parent().text().split("$");        
        loadNewsFor(txtVal[0]);
    });

}

async function searchTermToId(term) {
    var data = await fetch("https://api.coingecko.com/api/v3/coins/list")
        .then(function(response) {
            return response.json();
        })
    term = term.toLowerCase();
    var cryptoId = 0;
    for (i in data) {
        if (term == data[i].id || term == data[i].name || term == data[i].symbol) {
            cryptoId = data[i].id;
            break;
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

    return cryptoId;
}


init();

$("#add").on("click", async function(event) {
    event.preventDefault();

    var SearchTerm = $(this).siblings("#search-term").val();
    
    if (!SearchTerm) {
        $("#warning").show();
        $("#warning").text("Please enter a search term.");

        var timer = setInterval(function() {
            $("#warning").fadeOut();
        }, 2000);
        return;
    }

    if ($("input:radio[name=asset-type]:checked").val() == "Crypto") {
        var cryptoId = await searchTermToId(SearchTerm);

        if (!cryptoId) {
            $(this).siblings("#search-term").val("");
            return;
        }

        var favCryp = localStorage.getItem("cryptoList");
        if (!favCryp) {
            favCrypto = [];
        } else {
            favCrypto = JSON.parse(favCryp);
        }
        
        if (jQuery.inArray(cryptoId, favCrypto) == -1) {
            favCrypto.push(cryptoId);
            localStorage.setItem("cryptoList", JSON.stringify(favCrypto));

            var data = await cryptoApi(cryptoId);
            appendFave(data);   
        }
        $(this).siblings("#search-term").val("");

        // 09/15/2022 BZ - Created function to load news.
        loadNewsFor(SearchTerm);

        return;
    } else if ($("input:radio[name=asset-type]:checked").val() == "Stock") {
        
        $(this).siblings("#search-term").val("");
        return;
    }

});


/* **************************************************  
    09/15/2022 BZ - Created for loading news.
    Obtain news detail for requested search criteria.    
***************************************************** */
async function loadNewsFor(searchCriteria) {
    
    var objCrypto = await getCryptoNews(searchCriteria);
    var newsDetail = $(".right-box"); // Reset text every time.
    var newDivArea = $('<div class="added-news-area">');
    newsDetail.find('.added-news-area').remove();

    // Add Crypto News to the HTML page.
    if (objCrypto.length === 0) return;
    for (let i = 0; i < objCrypto.length; i++) {
        var newsDivItem = $(`<div class='added-news-items'>`);
        var newsItems = $(`<a href="${objCrypto[i].url}"  target="_blank" class='added-news-items'>`);
        newsItems.text(objCrypto[i].source);
        newsDivItem.append(newsItems);
        newDivArea.append(newsDivItem);
    }
    newsDetail.append(newDivArea);

}

// test search term
// var cryptoSearchTerm = "ADA";
// search(cryptoSearchTerm);

// async function search (cryptoSearchTerm) {
//     var cryptoId = await searchTermToId(cryptoSearchTerm);
//     cryptoApi(cryptoId);
// }
