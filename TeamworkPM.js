define(function(require) {

    var Project  = require('./Project');
    var User     = require('./User');
    var Base     = require('./Base');

    var TeamworkPM = Base.extend(function(conf)
    {
        this.apiKey  = "";
        this.siteUrl = "";

        if (conf)
            this.setConfig(conf);
    });

    // create an objects with the proper data context
    TeamworkPM.prototype.factory = function(M, opts)
    {
       var m = opts ? new M(opts) : new M();
       m._tpm = this;

       return m;
    }

    TeamworkPM.prototype.getMe = function()
    {
        return this._user;
    };

    TeamworkPM.prototype.getProject = function(projectId)
    {
        return this.factory(Project, { id: projectId });
    };

    TeamworkPM.prototype.getMyId = function()
    {
        return this._user ? this._user.id : null;
    };

    TeamworkPM.prototype.fetchMe = function()
    {
        var user = new User();
        user._tpm = this;

        var d = user.fetch();

        d.done(function() { this._user = user; }.bind(this));

        return d;
    };

    // stick in the username (api key) with the URL
    TeamworkPM.prototype.getBaseUrl = function()
    {
        var matches = this.siteUrl.match(/https?:\/\/(.*)\/?/, '');

        if (!matches[1])
            throw new Error("Invalid siteUrl");

        return 'http://' + this.apiKey + '@' + matches[1] + '/';
    };

    // needs to be implemented in an environment-specific way and return
    // something that implements the promise interface
    TeamworkPM.prototype.doRequest = function(opts) { };

    TeamworkPM.prototype.setConfig = function(config)
    {
        this.apiKey  = config.apiKey;
        this.siteUrl = config.siteUrl;
    };

    return TeamworkPM;
});
