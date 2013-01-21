define(function(require) {

    var request  = require('request');
    var Deferred = require('JQDeferred');
    var moment   = require('moment');
    var Project  = require('./Project');

    var TeamworkPM = function(conf)
    {
        this.apiKey  = "";
        this.siteUrl = "";

        if (conf)
            this.setConfig(conf);
    };

    TeamworkPM.prototype.projectFactory = function(projectId)
    {
        var p = new Project();
        p._tpm = this;
        p.id = projectId;

        return p;
    };

    // stick in the username (api key) with the URL
    TeamworkPM.prototype.getBaseUrl = function()
    {
        var matches = this.siteUrl.match(/https?:\/\/(.*)\/?/, '');

        if (!matches[1])
            throw new Error("Invalid siteUrl");

        return 'http://' + this.apiKey + '@' + matches[1] + '/';
    };

    // hit the TeamworkPM API and return a jquery-style deferred, optionally
    // parse with parser if needed
    TeamworkPM.prototype.doRequest = function(opts)
    {
        var endpoint = opts.endpoint;
        var parser   = opts.parser;
        var method   = opts.method;
        var payload  = opts.data;

        var url = this.getBaseUrl();
        url += endpoint + '.json';

        console.log((method || 'get') + ': ' + endpoint);

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

    TeamworkPM.prototype.setConfig = function(config)
    {
        this.apiKey  = config.apiKey;
        this.siteUrl = config.siteUrl;
    };

    return TeamworkPM;
});
