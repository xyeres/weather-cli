const https = require("https");
const http = require("http");
// const { parse } = require("node:path");
const qs = require("querystring");
const api = require("./api.json");

function printError(error) {
    console.error(error.message);
}

function printWeather(weather) {
    console.log(`The temperature in ${weather.name} is ${weather.main.temp}F with ${weather.weather[0].description}`)
}

function get(query) {
    try {
        const params = {
            APPID: api.key,
            units: 'imperial'
        }

        const zipCode = parseInt(query);
        if (!isNaN(zipCode)) {
            params.zip = zipCode + ",us"
        } else {
            params.q = query + ",us";
        }
        const url = `https://api.openweathermap.org/data/2.5/weather?${qs.stringify(params)}`;
        const request = https.get(url, response => {
            if (response.statusCode === 200) {
                let body = "";
                // Read the data
                response.on('data', chunk => {
                    body += chunk;
                });
                response.on('end', () => {
                    try {
                    // parse data
                    const weather = JSON.parse(body);
                    // print data
                    printWeather(weather);
                    } catch(e) {
                        printError(e);
                    }

                });
            } else {
                const statusErrorCode = new Error(`There was an error fetching weather data for "${query}". (${http.STATUS_CODES[response.statusCode]})`);
                printError(statusErrorCode)
            }

        })
        request.on('error', err => {
            printError(err);
        })
    } catch(e) {
        printError(e);
    }
    
}

module.exports.get = get;
