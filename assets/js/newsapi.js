/*
    Created:    09/14/2022 
    Programmer: Brian Zoulko
    Notes:      Created this module to call and gather news detail
                for Project#1 - Investment-Watchlist.

    Modification
    ============
    09/14/2022 Brian Zoulko    Created news api call module as a function.
*/
const cNEWS_URL = 'https://google-news.p.rapidapi.com/v1/top_headlines?lang=en&country=US'

function getNews(strKey) {

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

    }).catch(err){

        alert(err);
        
    };

}