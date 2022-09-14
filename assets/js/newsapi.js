function getNews(strKey) {

    // --------------------------------------------------------------------------
    // F E T C H  Geocoding URL detail for a city to get lattitude and longitude.
    // --------------------------------------------------------------------------
    var city = ((typeof btn == "string") ? btn : btn.text());
    var geocodeURL = cGEOCODE_URL + "&q=" + city.replace(" ","%20") + ",,&limit=3";

    fetch(geocodeURL).then(function(response){

        return response.json();

    }).then(function(data) {

        rtnCode = parseInt(data.cod);
        if (rtnCode < 200 || rtnCode > 299 || data.length == 0) {
            alert("Error with (Geocode) city URL: /n/n" + geocodeURL);
            removeCity(btn.text());
            btn.remove();
        } else {


            // -----------------------------------------------------
            // F E T C H  Weather URL to obtain current city detail.
            // -----------------------------------------------------
            var lattitude = data[0].lat;
            var longitude = data[0].lon;
            var weatherURL = cWEATHER_URL + "&q=" + city.replace(" ","%20") + "&lat=" + lattitude + "&lon=" + longitude;

            fetch(weatherURL).then(function(response){

                return response.json();

            }).then(function(data) {
                
                rtnCode = parseInt(data.cod);
                if (rtnCode < 200 || rtnCode > 299 || data.length == 0) {
                    alert("Error with (Weather) URL: /n/n" + weatherURL);
                    removeCity(btn.text());
                    btn.remove();
                } else {

                    // load Current City Weather.                    
                    var cityIcon = $(`<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Current weather image.">`);
                    cityName.text(city + " (" + getDate() + ")");
                    cityName.append(cityIcon);
                    cityTemp.text("Temp: " + data.main.temp + " \xB0F");
                    cityWind.text("Wind: " + data.wind.speed + " MPH");
                    cityHumidity.text("Humidity: " + data.main.humidity + " %");
                    cityUVIndex.text("UV Index: ");                    


                    // ---------------------------------------------------
                    // F E T C H  5-Day Forecast URL for the current city.
                    // ---------------------------------------------------
                    var forecastURL = cFORECAST_URL + "&lat=" + lattitude + "&lon=" + longitude + "&cnt=" + cMaxDays ;

                    fetch(forecastURL).then(function(response){

                        return response.json();

                    }).then(function(data) {
                        
                        rtnCode = parseInt(data.cod);
                        if (rtnCode < 200 || rtnCode > 299 || data.length == 0) {
                            alert("Error with (Forecast) URL: /n/n" + forecastURL);
                            removeCity(btn.text());
                            btn.remove();
                        } else {
                    
                            // Load 5-Day forecast detail.
                            for (var d = 0; d < cMaxDays; d++) {
                                var i = d+1;
                                var forecastIcon = $(`<img src="https://openweathermap.org/img/wn/${data.list[d].weather[0].icon}.png" alt="Forecast weather icon.">`);
                                $(`.day${i}-date`).text(getDate(i));                                
                                $(`.day${i}-date`).append(forecastIcon);
                                $(`.day${i}-weather-icon`).attr("src", );
                                $(`.day${i}-city-temp`).text("Temp: " + data.list[d].main.temp + " \xB0F");
                                $(`.day${i}-city-wind`).text("Wind: " + data.list[d].wind.speed + " MPH");
                                $(`.day${i}-city-humidity`).text("Humidity: " + data.list[d].main.humidity + " %");
                            }

                        }

                    })

                }

            })

            

        }
    })
}