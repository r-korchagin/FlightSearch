/**********************
 *                    *
 *      Page View     *
 *                    *
 **********************/

/* global moment */

var viewFS = {

/**
Function render flight search result
    @el - Search Result Data Array. [{airline,flightNum,start,finish,distance,durationMin ...},{..},{..}]
    Type: Array
*/
flightSearchResultView : function (data) {
    var resultList = "<div class=\"tab-pane\">";  // scroll container  
    data.forEach(function(el) {
        resultList += viewFS.flightSearchView(el);
    });
    resultList += "</div>";
    return resultList;
},
/**
Function return html for each searching result
    @el - Search Result object. {airline,flightNum,start,finish,distance,durationMin ...}
    Type: Object
*/
flightSearchView : function (el) {
    return "\
  			<div class=\"result-box\">\
				<div class=\"row\">\
					<div class=\"col-md-1\">\
							<label class=\"control-label\">" + el.airline.name + " (" + el.airline.code + ")</label>\
					</div>\
					<div class=\"col-md-3\">\
						<div class=\"row\">\
						    <label class=\"col-md-2 control-label\">FROM:</label>\
							<p class=\"col-md-10\">" + el.start.airportName + " (" + el.start.airportCode + ")</label>\
						</div>\
						<div class=\"row\">\
							<label class=\"col-md-2 control-label\">Date:</label>\
							<p class=\"col-md-10\">" + moment(el.start.dateTime).format('MMMM Do YYYY, h:mm:ss a') + "</p>\
						</div>\
					</div>\
					<div class=\"col-md-3\">\
						<div class=\"row\">\
						    <label class=\"col-md-2 control-label\">To:</label>\
						    <p class=\"col-md-10 control-label\">" + el.finish.airportName + " (" + el.finish.airportCode + ")</p>\
						</div>\
						<div class=\"row\">\
						    <label class=\"col-md-2 control-label\">Date:</label>\
						    <p class=\"col-md-10 control-label\">" + moment(el.finish.dateTime).format('MMMM Do YYYY, h:mm:ss a') + "</p>\
						</div>\
					</div>\
					<div class=\"col-md-2\">\
						<div class=\"row\">\
							<label class=\"control-label\">Duration:</label>\
						</div>\
						<div class=\"row\">\
						    <label class=\"control-label\">" + el.durationMin + " min.</label>\
						</div>\
					</div>\
					<div class=\"col-md-2\">\
						<div class=\"row\">\
							<label class=\"control-label\">Price:</label>\
						</div>\
						<div class=\"row\">\
						    <label class=\"control-label\">" + el.price + " $</label>\
						</div>\
					</div>\
				</div>\
            </div>\
  ";
},

/**
Function return html for empty searching result
*/
searchEmptyResultView : function() {
   return "\
            <p class=\"content-subtitle\">Can not find anything by your request</p>\
            <p class=\"content-subtitle\">Try to find again</p>\
   "; 
},

/**
Function return html for airlines search result
    @data - Airlines list Data Array. [{code,name},{..},{..}]
    Type: Array
*/
airlinesViewTable : function (data) {
    var rows = "";
    data.forEach(function(item) {
        rows += viewFS.airlinesRow(item);
    });
    return "\
            <div class=\"tab-pane\">\
    			<table class=\"table table-hover table-color\">\
				  <thead>\
					<tr>\
					  <th>Airline Code</th>\
					  <th>Airline Name</th>\
					</tr>\
				  </thead>\
				  <tbody>" + rows + "</tbody>\
				</table>\
			</div>\
    ";
},

/**
Function return html for airports search result
    @data - Airports list Data Array. [{airportCode,airportName,cityCode,cityName...},{..},{..}]
    Type: Array
*/
airportsViewTable : function (data) {
    if (!data instanceof Array) return "";
    var rows = "";
    data.forEach(function(item) {
        rows += viewFS.airportsRowView(item);
    });
    return "\
            <div class=\"tab-pane\">\
    			<table class=\"table table-hover table-color\">\
				  <thead>\
					<tr>\
					  <th>Airport Code</th>\
					  <th>Airport Name</th>\
					  <th>City Code</th>\
					  <th>City Name</th>\
					  <th>Country Code</th>\
					  <th>Country Name</th>\
					  <th>State Code</th>\
					  <th>TZ</th>\
					</tr>\
				  </thead>\
				  <tbody>" + rows + "</tbody>\
				</table>\
			</div>\
    ";
},

/**
Function return html for Error
*/
errorView : function (text) {
    return "\
					  <p class=\"content-subtitle\">"+text+"</p>\
    ";
},

/**
Function return html for each airline in Airlines list
    @el - element of airlines list Data Array. {code,name}
    Type: Object
*/
airlinesRow : function (el) {
    return "\
  					<tr>\
					  <td>" + el.code + "</td>\
					  <td>" + el.name + "</td>\
					</tr>\
  ";
},


/**
Function return html for each airport in airpots list
    @el - element of airports list Data Array. {airportCode,airportName,cityCode,cityName...}
    Type: Object
*/
airportsRowView : function (el) {
    return "\
  					<tr>\
					  <td>" + el.airportCode + "</td>\
					  <td>" + el.airportName + "</td>\
					  <td>" + el.cityCode + "</td>\
					  <td>" + el.cityName + "</td>\
					  <td>" + el.countryCode + "</td>\
					  <td>" + el.countryName + "</td>\
					  <td>" + el.stateCode + "</td>\
					  <td>" + el.timeZone + "</td>\
					</tr>\
  ";
},

/**
Function return html start search form
    @airline - Not necessary. If exist, show selected airline search in header.
    Type: Object  {code:"QF",name:"Qantas"}
*/
searchFormView : function (airline) {
    var header = airline ? airline.name : "";
    return "\
        <div class=\"content-wrapper\">\
  			<p class=\"content-subtitle\"> Search " + header + " flight</p>\
			<div class=\"well-searchbox\">\
                <form class=\"form-horizontal\" role=\"form\">\
				<div class=\"row\">\
					<div class=\"col-md-3\">\
						<div class=\"form-group\">\
							<label class=\"col-md-4 control-label\">From</label>\
							<div class=\"col-md-8\">\
								<select class=\"form-control\" id=\"select-from-airport\">\
								</select>\
							</div>\
						</div>\
					</div>\
					<div class=\"col-md-4\">\
						<div class=\"form-group\">\
							<label class=\"col-md-4 control-label\">To</label>\
							<div class=\"col-md-8\">\
								<select class=\"form-control\" id=\"select-to-airport\">\
								</select>\
							</div>\
						</div>\
					</div>\
					<div class=\"col-md-4\">\
						<div class=\"form-group\">\
							<label class=\"col-md-4 control-label\">Date</label>\
							<div class=\"col-md-8\">\
								<div class='input-group date' id='date-flight'>\
									<input type='text' class=\"form-control\" />\
									<span class=\"input-group-addon\">\
										<span class=\"glyphicon glyphicon-calendar\"></span>\
									</span>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
                </form>\
            </div>\
			<div class=\"button-container\" id=\"search-flight-data\">\
			    <p class=\"button\"><span class=\"glyphicon glyphicon-search\"></span> Search flight</p>\
			</div>\
		</div>\
  ";
},

/**
Function return html for search form placed on top
*/

topSearchFormView : function () {
    return "\
        <div class=\"top-content-wrapper\">\
			<div class=\"well-searchbox\">\
                <form class=\"form-horizontal\" role=\"form\">\
				<div class=\"row\">\
					<div class=\"col-md-3\">\
						<div class=\"form-group\">\
							<label class=\"col-md-3 control-label\">From:</label>\
							<div class=\"col-md-9\">\
								<select class=\"form-control\" id=\"select-from-airport\">\
								</select>\
							</div>\
						</div>\
					</div>\
					<div class=\"col-md-3\">\
						<div class=\"form-group\">\
							<label class=\"col-md-3 control-label\">To:</label>\
							<div class=\"col-md-9\">\
								<select class=\"form-control\" id=\"select-to-airport\">\
								</select>\
							</div>\
						</div>\
					</div>\
					<div class=\"col-md-3\">\
						<div class=\"form-group\">\
							<label class=\"col-md-3 control-label\">Date:</label>\
							<div class=\"col-md-9\">\
								<div class='input-group date' id='date-flight'>\
									<input type='text' class=\"form-control\" />\
									<span class=\"input-group-addon\">\
										<span class=\"glyphicon glyphicon-calendar\"></span>\
									</span>\
								</div>\
							</div>\
						</div>\
					</div>\
					<div class=\"col-md-2\">\
								<div class=\"top-button-container\" id=\"search-flight-data\">\
								    <p class=\"search-button\"><span class=\"glyphicon glyphicon-search\"></span> Search flight</p>\
								</div>\
					</div>\
				</div>\
                </form>\
            </div>\
            <div id='search-result'></div>\
		</div>\
  ";
}

};
