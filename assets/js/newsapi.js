/*
    Created:    09/14/2022 
    Programmer: Brian Zoulko
    Notes:      Created this module to call and gather news detail
                for Project#1 - Investment-Watchlist.

    Modification
    ============
    09/14/2022 Brian Zoulko    Created news api call module as a function.
*/
const cCRYPTO_NEWS_URL = 'https://crypto-news-live3.p.rapidapi.com/news'


/* *****************
    CRYPTO News API.
******************** */
async function getCryptoNews(searchFor) {

    var cryptoAPIKey = ['4cd32','e560e','msh5d','71624','2c652','ea5p1','14f81','jsne9','cf0d2','8233d'];

    // Define options for FETCH call.
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': cryptoAPIKey.join(''),
            'X-RapidAPI-Host': 'crypto-news-live3.p.rapidapi.com'
        }
    };

    // Create Crypto News Object for all results.
    var bFoundNews = false;
    var objCrypto = [{
        source: "", 
        title: "",
        url: ""
    }];
    var rtnData = "";


    // ---------------------------------------------------------
    // F E T C H  News information using RapidAPI w/crypto-news.
    // ---------------------------------------------------------
    await fetch(cCRYPTO_NEWS_URL, options).then(function(response){

        return (response.json());

    }).then(function(data){

        // Initialize variables for pulling news detail.
        var sFind = searchFor.toUpperCase();

        // Remove the empty object created when initializing the object.
        objCrypto.pop(objResult);

        // Load news titles that contains matching text from
        // the "searchFor" parameter.
        for (let x = 0; x < data.length; x++) {            
            if (data[x].title.toUpperCase().search(sFind) > 0) {
                var objResult = {
                    source: data[x].title, 
                    title: data[x].source,
                    url: data[x].url
                };

                // // Display what was found to the console.
                // console.log("Index: " + x);
                // console.log("Source: " + objResult.source);
                // console.log("Title: " + objResult.title);
                // console.log("URL: " + objResult.url);
                // console.log("");

                objCrypto.push(objResult);
                bFoundNews = true;
            }
        }

        // // Dump found detail to console.
        // console.log("Items found: " + objCrypto.length);
        // for (let i = 0; i < objCrypto.length; i++) {
        //     console.log("objCrypto[" + i + "].source: " + objCrypto[i].source);
        //     console.log("objCrypto[" + i + "].title: " + objCrypto[i].title);
        //     console.log("objCrypto[" + i + "].url: " + objCrypto[i].url);
        //     console.log("");
        // }        
    
    }).catch(err => console.error(err));

    if (!bFoundNews) return;
    console.log("#1 in api rtn: " + objCrypto.length);
    return(objCrypto);
}