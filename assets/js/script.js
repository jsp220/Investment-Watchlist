function DarkMode() {
    var toggle = document.body;
    toggle.classList.toggle("dark-mode");
 }







//  Crypto API

// for testing init
var abc = ["bitcoin", "ethereum"];
localStorage.setItem("cryptoList", JSON.stringify(abc)); //


function init() {
    // Retrieve favorite assets data from local storage
    var favCryp = localStorage.getItem("cryptoList");
    if (!favCryp) {
        var favCrypto = [];
    } else {
        favCrypto = JSON.parse(favCryp);
        favCrypto.splice(10); // limit to 10 crypto?
    }
    console.log(favCrypto);
    favCryptoApi(favCrypto);
}

function favCryptoApi(favCrypto) {
    for (i in favCrypto) {
        cryptoApi(favCrypto[i]);
    }
}

// cryptoApi using cryptoID
async function cryptoApi(cryptoId) {
    var cryptoApiUrl = "https://api.coingecko.com/api/v3/coins/" + cryptoId;
    
    console.log(cryptoApiUrl);

    var data = await fetch(cryptoApiUrl)
        .then(function(response) {
            return response.json();
        });
    
    console.log(data);
}

async function searchTermToId(term) {
    var data = await fetch("https://api.coingecko.com/api/v3/coins/list")
        .then(function(response) {
            return response.json();
        })
    term = term.toLowerCase();
    console.log(term);
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

async function search (cryptoSearchTerm) {
    var cryptoId = await searchTermToId(cryptoSearchTerm);
    cryptoApi(cryptoId);
}


// favCryptoApi();

// search bar 
// $("#add").on("click", async function() {
//     var cryptoSearchTerm = $(this).siblings("#search-term").val();
    
//     if (!cryptoSearchTerm) {
//         return;
//     }
    
//     var cryptoId = await searchTermToId(cryptoSearchTerm);
//     // cryptoApi(cryptoId);

// })


init();
var cryptoSearchTerm = "ADA";
search(cryptoSearchTerm);