/*
    Created:    09/14/2022 
    Programmer: Brian Zoulko
    Notes:      Created this module to call and gather news detail
                for Project#1 - Investment-Watchlist.

    Modification
    ============
    09/14/2022 Brian Zoulko    Created news api call module as a function.
*/
const cGOOGLE_NEWS_URL = 'https://google-news.p.rapidapi.com/v1/top_headlines?lang=en&country=US'
const cCRYPTO_NEWS_URL = 'https://crypto-news-live3.p.rapidapi.com/news'


/*
    GOOGLE News API.
*/
function getGoogleNews() {

    // Google News API options.
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4cd32e560emsh5d716242c652ea5p114f81jsne9cf0d28233d',
            'X-RapidAPI-Host': 'google-news.p.rapidapi.com'
        }
    };
    
    // ---------------------------------------------------------
    // F E T C H  News information using RapidAPI w/google-news.
    // ---------------------------------------------------------
    fetch(cNEWS_URL, options).then(function(response){

        return (response.json());

    }).then(function(data){

        console.log(data);

    }).catch(err => console.error(err));

}


/*
    CRYPTO News API.
*/
function getCryptoNews(searchFor) {

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4cd32e560emsh5d716242c652ea5p114f81jsne9cf0d28233d',
            'X-RapidAPI-Host': 'crypto-news-live3.p.rapidapi.com'
        }
    };

    // Crypto News Object for results.
    var objCrypto = {
        source: "", 
        title: "",
        url: ""
    }[0];


    // ---------------------------------------------------------
    // F E T C H  News information using RapidAPI w/crypto-news.
    // ---------------------------------------------------------
    fetch(cCRYPTO_NEWS_URL, options).then(function(response){

        return (response.json());

    }).then(function(data){

        console.log(data.length);
        var index = 0;
        var sFind = searchFor.toUpperCase();
        var objResult = {
            source: "", 
            title: "",
            url: ""
        };
    
        for (let x = 0; x < data.length; x++) {            
            if (data[x].title.toUpperCase().search(sFind) > 0) {
                objResult.title   = data[x].title;
                objResult.source  = data[x].source;
                objResult.url     = data[x].url; 
                objCrypto.push(objResult);
            }
        }
        console.log("index: " + index);

    }).catch(err => console.error(err));

    return (objCrypto);

}