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
    console.log(data.id);
    var divEl = $(`<div class='row collection-item list-item bold' id='${data.id}'>`);
    var symEl = $("<div class='s2'>");
    var priceEl = $("<div class='s3'>");
    var priceChgEl = $("<div class='s3'>");
    var delBtnEl = $("<button class='btn-floating btn-small waves-effect waves-light red remove'><i class='material-icons'>-</i></button>")
    var sym = data.symbol;
    var sym = sym.toUpperCase();
    var price = data.market_data.current_price.usd;
    var priceChg = data.market_data.price_change_24h;
    var priceChg = priceChg.toFixed(2);
    var priceChgPcnt = (priceChg/price*100).toFixed(2);
    symEl.text(sym);
    priceEl.text(`$${price.toLocaleString("en-US")}`);
    priceChgEl.text(`$${priceChg} (${priceChgPcnt}%)`);
    if (priceChg < 0) {
        priceChgEl.addClass("red-font");
    } else if (priceChg > 0) {
        priceChgEl.addclass("green-font");
    }

    divEl.append(symEl, priceEl, priceChgEl, delBtnEl);
    // divEl.text(`${sym} $${price.toLocaleString("en-US")} $${priceChg} (${priceChgPcnt}%)`);
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
    // var favCryp = localStorage.getItem("cryptoList");
    // if (!favCryp) {
    //     favCrypto = [];
    // } else {
    //     favCrypto = JSON.parse(favCryp);
    // }
    favCrypto.push(cryptoId);
    localStorage.setItem("cryptoList", JSON.stringify(favCrypto));
});

// $("#remove").on("click", function() {
//     var remId = $(this).parent().attr("id");
    
//     console.log(favCrypto);
//     for (i in favCrypto) {
//         if (remId === favCrypto[i]) {
//             favCrypto.splice(i, 1);
//         }
//     }
//     localStorage.setItem("cryptoList", JSON.stringify(favCrypto));

//     $(this).parent().remove();

//     return;
// });

// test search term
// var cryptoSearchTerm = "ADA";
// search(cryptoSearchTerm);

// async function search (cryptoSearchTerm) {
//     var cryptoId = await searchTermToId(cryptoSearchTerm);
//     cryptoApi(cryptoId);
// }