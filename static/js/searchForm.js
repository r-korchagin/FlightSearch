/*global $ viewFS modelFS */

'use strict';

/*********************************************************************
 *                                                                   *
 *              This is the test Project                             *
 *                  for Flight Search                                *
 *                                                                   *
 *          Used id's from /static.html                              * 
 *  #search-btn   - Nav menu link to show search form                *
 *  #airlines-btn - Nav menu link to show airlines list              *
 *  #airports-btn - Nav menu link to show airports list              *
 *  #search-content - render point for search form and search result *
 *  #airlines-content - render point for airlines table              *
 *  #airports-content - render point for airports table              *
 *                                                                   *
 ********************************************************************/


$(function() {
    // Nav menu list
    var navBtn = [
        {selector:"#search-btn",   controller : controllerSearchForm,  section: 0 },
        {selector:"#airlines-btn", controller : controllerAirlinesTable, section: 1 },
        {selector:"#airports-btn", controller : controllerAirportsTable, section: 2 }
        ];
    
    // Set event for link in navbar
    controllerNavBtn(navBtn); 
    // Set Search Form
    controllerSearchForm();
});

/**
 * Init event for navbar.
 * if Click "Search", set view "SECTION 0" and render search form
 * if Click "Airlines", set view "SECTION 1" and render Airlines Table
 * if Click "Airports", set view "SECTION 2" and render Airports Table
*/

function controllerNavBtn(btnList) {
    if (btnList instanceof Array){
        btnList.forEach(function(item){
            $(item.selector).on('click.bs.dropdown', function(e) {
                    
                $(".nav").find(".active").removeClass("active");
                $(this).parent().addClass("active");
        
                item.controller();
        
                // Set vie SECTION for each menu item
                setSection(item.section);
        
                return false;
            });
        });
    }
}


/** 
 * Controller Search Form "section 0" 
 */
function controllerSearchForm() {
    renderContent("#search-content", viewFS.searchFormView);
    initDatePicker(); // set datepicker date format
    initSelect2Field(); // set select2 par
    searchButtonEvent(); // set search btn event
}

/** 
 * Controller Search Form at the top of "section 0" with placeholders and selected date
 *   @to -   Placeholder for select box named "TO" to show search criteria. Type: String
 *   @from - Placeholder for select box named "From" to show search criteria. Type: String
 *   @date - Date to show search criteria. Type: String
 */
function controllerTopSearchForm(to, from, date) {
    renderContent("#search-content", viewFS.topSearchFormView);
    initDatePicker(); // set datepicker date format
    // Create event
    initSelect2Field(to, from); // set select2 par
    if (date) $('#date-flight').data("DateTimePicker").date(date); // if date exist, set search date in datepicker
    searchButtonEvent(); // set search btn event
}

/**
 * Load List of Airlines at "section 1" 
 */
function controllerAirlinesTable() {
    modelFS.modelAirlines(
        function(data) { renderContent("#airlines-content", viewFS.airlinesViewTable, data); },
        function(jqXHR, textStatus) {  errorHandler("#airlines-content",jqXHR, textStatus); }
        );
}


/**
 * Load List of Airports at "section 2" 
*/
function controllerAirportsTable() {
    modelFS.modelAirports(
        function(data) { renderContent("#airports-content", viewFS.airportsViewTable, data); },
        function(jqXHR, textStatus) {  errorHandler("#airports-content",jqXHR, textStatus); }
        );
}


/** 
 * Render View
 *   @selector - Selector
 *   @view     - View function
 *   @data     - View data
*/
function renderContent(selector, view, data){
    $(selector).empty();
    $(selector).append(view(data));
}

/**
 * Error handler 
*/
function errorHandler(selector, jqXHR, textStatus){
     renderContent(selector, viewFS.errorView, "Request failed: " + textStatus);
}


/**
Init event for Search Button
*/
function searchButtonEvent() {

    $("#search-flight-data").click(function() {
        var from = $("#select-from-airport").val();
        var to = $("#select-to-airport").val();
        var date = getDateFromDatepicker($("#date-flight"));
        
        controllerTopSearchForm(to, from, date);
        
        modelFS.modelSearchResult(from, to, date, 
            // done Callback function
            function(objects) {
                // Collect Search result
                var resultArr = [];
                objects.forEach(function(item) {
                    resultArr = resultArr.concat(item[0]);
                });
                if (resultArr.length === 0) renderContent("#search-result", viewFS.searchEmptyResultView);
                else renderContent("#search-result", viewFS.flightSearchResultView, resultArr);
            }, 
            // fail Callback function
            function(jqXHR, textStatus) {
                // handler error
                errorHandler("#search-result", jqXHR, textStatus);
            }
        );

    });
}


/**
Init event with ajax request with search like "airports?q=Melbourne" for Select FROM and TO 
    @to - Not necessary String to set placeholder in Select TO. Type: String
    @from - Not necessary String to set placeholder in Select TO. Type: String
*/
function initSelect2Field(to, from) {
    [{
        selector: "#select-to-airport",
        placeholder: to
    }, {
        selector: "#select-from-airport",
        placeholder: from
    }].forEach(function(item) {
        $(item.selector).select2({
            placeholder: item.placeholder ? item.placeholder : "Select Airport",
            ajax: {
                url: "/airports",
                dataType: 'json',
                delay: 250,
                data: function(params) { return { q: params.term }; },
                processResults: loadSelectOptions
            }
        });
    });
}

/**
 *  Function to parse the results into the format expected by Select2
 */
function loadSelectOptions(data){
    var result = [];
    data.forEach(function(item) {
        result.push({
            id: item.airportCode,
            text: item.airportName + " (" + item.airportCode + ")"
        });
    });

    return {
        results: result
    };
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
 *  Set datetimepicker date format 
 */
function initDatePicker(){
    $('#date-flight').datetimepicker({
        format: "YYYY-MM-DD"
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

