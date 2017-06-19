/* global $ */

var modelFS = {

/**
Function return airports list
*/
modelAirports : function (doneCallback, failCallback){
    $.ajax({
            method: "GET",
            url: "/airports",
            dataType: "json"
        })
    
    .done(doneCallback)
    
    .fail(failCallback);
},

/**
Function return Airlines list
*/
modelAirlines : function (doneCallback, failCallback){
    $.ajax({
            method: "GET",
            url: "/airlines",
            dataType: "json"
        })
    
    .done(doneCallback)
    
    .fail(failCallback);
},

/**
Function return search result
*/
modelSearchResult : function (from, to, date, doneCallback, failCallback){
    $.ajax({
            method: "GET",
            url: "/airlines"
        })
    .done(function(msg) {
            var deferreds = [];
            if (msg instanceof Array) {
                msg.forEach(function(item) {
                    var ajax = $.ajax({
                        url: "/flight_search/" + item.code,
                        method: 'get',
                        dataType: "json",
                        data: {
                            date: date,
                            from: from,
                            to: to
                        }
                    });
                    // Push promise to 'deferreds' array
                    deferreds.push(ajax);
                });
                
                // exec deferreds
                $.when.all(deferreds).then(doneCallback, failCallback);
            }
        })
    .fail(failCallback);
}

};


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

