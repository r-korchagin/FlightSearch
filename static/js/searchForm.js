/*global $*/
/*global moment*/

'use strict';

/*********************************************************************
 *                                                                   *
 *              This is the test Project                             *
 *                  for Flight Search                                *
 *                                                                   *
 *          Used id's from /static.html                              * 
 *  #search-btn   - Menu link to show search form                    *
 *  #airlines-btn - Menu link to show airlines list                  *
 *  #airports-btn - Menu link to show airports list                  *
 *  #search-content - render point for search form and search result *
 *  #airlines-content - render point for airlines table              *
 *  #airports-content - render point for airports table              *
 *                                                                   *
 ********************************************************************/

$(function() {
    renderSearchForm(); // Render empty search form
    initNavBtn(); // Set event for link in navbar
});

/** 
Render Search Form in the center of "section 0" 
   @airline - Not necessary. Object to search only if selected airline from airline table. 
   Type: Object  {code:"QF",name:"Qantas"}
*/
function renderSearchForm(airline) {
    $("#search-content").empty();
    $("#search-content").append(searchForm(airline));
    $('#date-flight').datetimepicker({
        format: "YYYY-MM-DD"
    }); // set date format for datetimepicker 
    // Create event
    initSelect2Field(); // init ajax request for from/to selection with search possibilities
    initSearchButton(airline); // init event for Search Button
}

/** 
Render Search Form at the top of "section 0" with placeholders and selected date
    @to -   Placeholder for select box named "TO" to show search criteria. Type: String
    @from - Placeholder for select box named "From" to show search criteria. Type: String
    @date - Date to show search criteria. Type: String
*/
function renderTopSearchForm(to, from, date) {
    $("#search-content").empty();
    $("#search-content").append(topSearchForm());
    $('#date-flight').datetimepicker({
        format: "YYYY-MM-DD"
    });
    // Create event
    initSelect2Field(to, from); // init ajax request for search airports with placeholders "to" and "from"
    if (date) $('#date-flight').data("DateTimePicker").date(date); // if date exist, set search date in datepicker
    initSearchButton();
}

/**
Render List of Airlines at "section 1" with search by current Airline 
*/
function renderAirlinesTable() {
    $.ajax({
            method: "GET",
            url: "/airlines",
        })
        .done(function(data) {
            $("#airlines-content").empty();

            if (data instanceof Array) {
                $("#airlines-content").append(airlinesTable(data));
                data.forEach(function(item) {
                    initFlightSearchBtn(item);
                });
            }
        });
}

/**
Render List of Airports at "section 2" 
*/
function renderAirportsTable() {
    $.ajax({
            method: "GET",
            url: "/airports",
        })
        .done(function(data) {
            $("#airports-content").empty();

            if (data instanceof Array) {
                $("#airports-content").append(airportsTable(data));
            }
        });
}


/**
Init event for Search Button
    @airline - Not necessary Object to search only if selected airline from airline table.
    Type: Object  {code:"QF",name:"Qantas"}
*/
function initSearchButton(airline) {
    $("#search-flight-data").click(function() {
        var from = $("#select-from-airport").val();
        var to = $("#select-to-airport").val();
        var date = getDateFromDatepicker($("#date-flight"));

        getSearchResult(from, to, date, airline); // Get Result from Server and render result
        /*
         *       For group airline search as better choice use getSearchResultAlternative 
         */
        // getSearchResultAlternative(from, to, date, airline);
    });
}

/**
Init event for Airlines Table
    @airline - Object to search only if selected airline from airline table.
    Type: Object  {code:"QF",name:"Qantas"}
*/
function initFlightSearchBtn(airline) {
    $("#search-flight-" + airline.code).click(function() {
        // Render Search Frorm
        renderSearchForm(airline);
        // Set SECTION 0
        setSection(0);

        return false;
    });
}

/**
Init event with ajax request with search like "airports?q=Melbourne" for Select FROM and TO 
    @to - Not necessary String to set placeholder in Select TO. Type: String
    @from - Not necessary String to set placeholder in Select TO. Type: String
*/
function initSelect2Field(to, from) {
    [{
        selector: "select-to-airport",
        placeholder: to
    }, {
        selector: "select-from-airport",
        placeholder: from
    }].forEach(function(item) {
        $("#" + item.selector).select2({
            placeholder: item.placeholder ? item.placeholder : "Select Airport",
            ajax: {
                url: "/airports",
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        q: params.term, // search term
                    };
                },
                processResults: function(data) {
                    // parse the results into the format expected by Select2
                    var result = [];
                    data.forEach(function(item) {
                        result.push({
                            id: item.airportCode,
                            text: item.airportCode + "(" + item.airportName + ")"
                        });
                    });

                    return {
                        results: result
                    };
                }
            }
        });
    });
}

/**
Init event for navbar.
if Click "Search", set view "SECTION 0" and render search form
if Click "Airlines", set view "SECTION 1" and render Airlines Table
if Click "Airports", set view "SECTION 2" and render Airports Table
*/
function initNavBtn() {
    $("#search-btn").on('click.bs.dropdown', function(e) {

        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");

        renderSearchForm();

        // Show SECTION 0 with search form
        setSection(0);

        return false;
    });

    $("#airlines-btn").on('click.bs.dropdown', function(e) {

        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");

        renderAirlinesTable();

        // Show SECTION 1 with airlines table
        setSection(1);

        return false;
    });

    $("#airports-btn").on('click.bs.dropdown', function(e) {
        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");

        renderAirportsTable();

        // Show SECTION 2 with Airports table
        setSection(2);

        return false;
    });
}

/**
Load Airlines list and then search for flights for each airline
    @from - Not necessary. A string to search for the selected airport. Type: String "SYD"
    @to - Not necessary. A string to search for the selected airport. Type: String  "JFK"
    @date - Not necessary. A string to search for the selected Date. Type: String  "2018-09-02"
    @airline - Not necessary. A string to search only for the selected airline.
*/
function getSearchResult(from, to, date, airline) {
    if (airline) {
        $.ajax({
            method: "GET",
            url: "/flight_search/" + airline.code,
            data: {
                date: date,
                from: from,
                to: to
            }
        }).done(function(resultArr) {
            renderTopSearchForm(to, from, date);
            renderFlightSearchResult(resultArr);
        });
        return;
    }
    $.ajax({
            method: "GET",
            url: "/airlines"
        })
        .done(function(msg) {
            // Search flights for each airline
            var deferreds = [];
            if (msg instanceof Array) {
                msg.forEach(function(item) {
                    var ajax = $.ajax({
                        url: "/flight_search/" + item.code,
                        method: 'get',
                        data: {
                            date: date,
                            from: from,
                            to: to
                        }
                    });
                    // Push promise to 'deferreds' array
                    deferreds.push(ajax);
                });

                $.when.all(deferreds).then(function(objects) {
                    // Render Search result
                    var resultArr = [];
                    objects.forEach(function(item) {
                        resultArr = resultArr.concat(item[0]);
                    });
                    renderTopSearchForm(to, from, date);
                    renderFlightSearchResult(resultArr);
                });
            }
        });
}

/**
 Solution to get back an actual array instead of a pseudo-array
 in construction $.when.apply($, deferreds).then(function( Result1, Result2 ... ){})
 No need with alternative search
*/
if (typeof $.when.all === 'undefined') {
    $.when.all = function(deferreds) {
        var toArray = function(args) {
            return deferreds.length > 1 ? $.makeArray(args) : [args];
        };
        return $.Deferred(function(def) {
            $.when.apply($, deferreds).then(
                function() {
                    def.resolveWith(this, [toArray(arguments)]);
                },
                function() {
                    def.rejectWith(this, [toArray(arguments)]);
                });
        });
    };
}

/**
Alternative search for flights for each airline
    @from - Not necessary. A string to search for the selected airport. Type: String "SYD"
    @to - Not necessary. A string to search for the selected airport. Type: String  "JFK"
    @date - Not necessary. A string to search for the selected Date. Type: String  "2018-09-02"
    @airline - Not necessary. A string to search only for the selected airline.
    
For use replace getSearchResult() in function initSearchButton()
*/
function getSearchResultAlternative(from, to, date, airline) {
    $.ajax({
            method: "GET",
            url: (airline != undefined) ? "/flight_search/" + airline.code : "/flight_search",
            data: {
                date: date,
                from: from,
                to: to
            }
        })
        .done(function(resultArr) {
            // Render Search result
            renderTopSearchForm(to, from, date);
            renderFlightSearchResult(resultArr);
        });
}

/**
Function show selected section
    @num - Number of section.
    Type: Numbrer
Section 0  - .background[0].down-scroll, .background[1].down-scroll .background[2].down-scroll
Section 1  - .background[0].up-scroll, .background[1].down-scroll .background[2].down-scroll
Section 2  - .background[0].up-scroll, .background[1].up-scroll .background[2].down-scroll
*/
function setSection(num) {
    [0, 1, 2].forEach(function(item) {
        if (item >= num) {
            $(".background").eq(item).removeClass("down-scroll").addClass("up-scroll");
        }
        else {
            $(".background").eq(item).removeClass("up-scroll").addClass("down-scroll");
        }
    });
}

/**
Function get Date from datepicker and convert to String ""YYYY-MM-DD""
    @el - jQuery selector of DateTimePicker.
    Type: Object
*/
function getDateFromDatepicker(el) {
    var m = el.data("DateTimePicker").date();
    if (m !== null && m.isValid()) return m.format("YYYY-MM-DD");
}




/**
Function render flight search result
    @el - Search Result Data Array. [{airline,flightNum,start,finish,distance,durationMin ...},{..},{..}]
    Type: Array
*/
function renderFlightSearchResult(data) {
    var resultList = "<div class=\"tab-pane\">";  // scroll container  
    data.forEach(function(el) {
        resultList += flightSearchView(el);
    });
    resultList += "</div>";
    $("#search-content > div.top-content-wrapper").append(resultList);
}

/**
Function return html for each searching result
    @el - Search Result object. {airline,flightNum,start,finish,distance,durationMin ...}
    Type: Object
*/
function flightSearchView(el) {
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
}

/**
Function return html for airlines search result
    @data - Airlines list Data Array. [{code,name},{..},{..}]
    Type: Array
*/
function airlinesTable(data) {
    var rows = "";
    data.forEach(function(item) {
        rows += airlinesRow(item);
    });
    return "\
    			<table class=\"table table-hover table-color\">\
				  <thead>\
					<tr>\
					  <th>Airline Code</th>\
					  <th>Airline Name</th>\
					</tr>\
				  </thead>\
				  <tbody>" + rows + "</tbody>\
				</table>\
    ";
}

/**
Function return html for each airline in Airlines list
    @el - element of airlines list Data Array. {code,name}
    Type: Object
*/
function airlinesRow(el) {
    return "\
  					<tr>\
					  <td>" + el.code + "</td>\
					  <td><a class=\"table-color\" href=\"#\" id=\"search-flight-" + el.code + "\">" + el.name + "</td>\
					</tr>\
  ";
}

/**
Function return html for airports search result
    @data - Airports list Data Array. [{airportCode,airportName,cityCode,cityName...},{..},{..}]
    Type: Array
*/
function airportsTable(data) {
    var rows = "";
    data.forEach(function(item) {
        rows += airportsRow(item);
    });
    return "\
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
    ";
}

/**
Function return html for each airport in airpots list
    @el - element of airports list Data Array. {airportCode,airportName,cityCode,cityName...}
    Type: Object
*/
function airportsRow(el) {
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
}

/**
Function return html start search form
    @airline - Not necessary. If exist, show selected airline search in header.
    Type: Object  {code:"QF",name:"Qantas"}
*/
function searchForm(airline) {
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
}

/**
Function return html for search form placed on top
*/
function topSearchForm() {
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
		</div>\
  ";
}
