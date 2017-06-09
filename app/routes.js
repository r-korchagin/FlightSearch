/**************************************************************
 *                                                            *
 *                      ROTE TO CONTROLLER API                *
 *                                                            *
 **************************************************************/
const path = require('path');
const airlines = require('./api/airlines');
const airports = require('./api/airports');
const flights = require('./api/flights');


var getMainPage = function(req, res) {
    // __dirname : Resolve to project folder.
    res.sendFile(path.resolve(__dirname,'../static/index.html'));
};


exports.getMainPage     = getMainPage;
exports.getAirlines     = airlines.getAirlines;
exports.getAirports     = airports.getAirports;
exports.getFlightSearch = flights.getFlightSearch;