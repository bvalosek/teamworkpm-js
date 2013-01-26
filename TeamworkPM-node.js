define(function(require) {

    // node modules
    var request        = require('request');
    var Deferred       = require('JQDeferred');
    
    var BaseTeamworkPM = require('./TeamworkPM');

    var TeamworkPM = BaseTeamworkPM.extend();

    // hit the TeamworkPM API and return a jquery-style deferred, optionally
    // parse with parser if needed
    TeamworkPM.prototype.doRequest = function(opts)
    {
        var endpoint = opts.endpoint;
        var parser   = opts.parser;
        var method   = opts.method;
        var payload  = opts.data;
        var extra    = opts.extra;

        var url = this.getBaseUrl();
        url += endpoint + '.json' + (extra ? extra : '');

        var d = new Deferred();

        if (!method || method == 'get') {
            var r = request({
                url: url
            }, function(error, resp, body) {
                if (!error) {
                    var data = JSON.parse(body);
                    data = parser ? parser(data) : data;
                    d.resolve(data);
                } else {
                    d.reject(error);
                }
            });
        }

        else if (method == 'post') {
            request.post({
                url: url,
                body: JSON.stringify(payload)
            }, function(error, resp, body) {
                if (!error) {
                    var data = JSON.parse(body);
                    data = parser ? parser(data) : data;
                    d.resolve(data);
                } else {
                    d.reject(error);
                }
            });
        }

        return d;
    };

    return TeamworkPM;
});
