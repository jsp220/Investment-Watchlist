/*
    Created:    09/14/2022 
    Programmer: Brian Zoulko
    Notes:      Created this module to call and gather news detail
                for Project#1 - Investment-Watchlist.

    Modification
    ============
    09/14/2022 Brian Zoulko    Created news api call module as a function.
*/
// const cGOOGLE_NEWS_URL = 'https://google-news.p.rapidapi.com/v1/top_headlines?lang=en&country=US'
const cCRYPTO_NEWS_URL = 'https://crypto-news-live3.p.rapidapi.com/news'


// /*
//     GOOGLE News API.
// */
// function getGoogleNews() {
//
//     // Google News API options.
//     const options = {
//         method: 'GET',
//         headers: {
//             'X-RapidAPI-Key': '4cd32e560emsh5d716242c652ea5p114f81jsne9cf0d28233d',
//             'X-RapidAPI-Host': 'google-news.p.rapidapi.com'
//         }
//     };
//
//     // Create Crypto News Object for all results.
//     var bFoundNews = false;
//     var objNews = [{
//         articles: [{
//             id: "",
//             link: "",
//             published: "",
//             source: { 
//                 href: "",
//                 title: "",
//             },
//             title: "",
//             updated: ""
//         }],
//         feed: {
//             language: "",
//             link: "",
//             rights: "",
//             subtitle: "",
//             title: "",
//             updated: ""
//         },
//     }];
//
//   
//     // ---------------------------------------------------------
//     // F E T C H  News information using RapidAPI w/google-news.
//     // ---------------------------------------------------------
//     fetch(cGOOGLE_NEWS_URL, options).then(function(response){
//
//         return (response.json());
//
//     }).then(function(data){
//
//         // Initialize variables for pulling news detail.
//         var sFind = searchFor.toUpperCase();
//         var objResult = {
//             articles: [{
//                 id: "",
//                 link: "",
//                 published: "",
//                 source: { 
//                     href: "",
//                     title: "",
//                 },
//                 title: "",
//                 updated: ""
//             }],
//             feed: {
//                 language: "",
//                 link: "",
//                 rights: "",
//                 subtitle: "",
//                 title: "",
//                 updated: ""
//             }
//         }
//
//
//         // Remove empty object created initially.
//         objCrypto.pop(objResult);
//
//         // Load news titles that contains matching text from
//         // "SearchFor" parameter.
//         for (let x = 0; x < data.length; x++) {            
//             if (data[x].title.toUpperCase().search(sFind) > 0) {
//                 objResult.title   = data[x].title;
//                 objResult.source  = data[x].source;
//                 objResult.url     = data[x].url;
//                 objCrypto.push(objResult);
//                 bFoundNews = true;
//             }
//         }
//
//         // Dump found detail to console.
//         console.log("Items found: " + objCrypto.length);
//         for (let i = 0; i < objCrypto.length; i++) {
//             console.log("Item[" + i + "]: " + objCrypto[i].url);
//         }
//
//     }).catch(err => console.error(err));
//
//     if (!bFoundNews) return;
//     return (objCrypto);
//
// }


/*
    CRYPTO News API.
*/
function getCryptoNews(searchFor) {

    // Define options for FETCH call.
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4cd32e560emsh5d716242c652ea5p114f81jsne9cf0d28233d',
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


    // ---------------------------------------------------------
    // F E T C H  News information using RapidAPI w/crypto-news.
    // ---------------------------------------------------------
    fetch(cCRYPTO_NEWS_URL, options).then(function(response){

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
    return (objCrypto);

}