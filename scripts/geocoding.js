// js file to test google geocoding api

// documentation: https://developers.google.com/maps/documentation/geocoding/requests-geocoding

// sample request https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&amp;key=YOUR_API_KEY

// google geocoding api key for this project
var googleGeocodingApiKey = process.env.GOOGLE_GEOCODING_API_KEY;

// google geocoding api url
var googleGeocodingApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

// function to get the latitude and longitude of a location
function getLatLng(location) {
    // create the url
    var url = googleGeocodingApiUrl + '?address=' + location + '&key=' + googleGeocodingApiKey;
    // make the request without using jquery
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            console.log('Latitude: ' + lat);
            console.log('Longitude: ' + lng);
        });
}

// call the function
const response = getLatLng('Istiklal mah.alparslan cad no 76/b inci bayan kuaförü atakum /samsun / ATAKUM / Samsun (Tel:5534995409)');

console.log(response);