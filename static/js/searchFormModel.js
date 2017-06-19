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

