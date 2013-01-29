define(function(require) {

    var Backbone = require('backbone');
    var Deferred = require('JQDeferred');

    var Collection = Backbone.Collection.extend();

    Collection.prototype.sync = function(method, model, options)
    {
        var Model = this.model;
        var tpm   = this._tpm;

        if (!this._tpm)
            throw new Error('Collection cannot be synced without a data context');

        if (method == 'read') {
            return this._tpm.doRequest({
                endpoint : this.endpoint(),
                options  : this._options,
                parser   : function(data) {
                    data = this.parse(data);

                    if (!data) {
                        return [];
                    }

                    // create all the corresponding models
                    this.models = data.map(function(m) {
                        var model = new Model();
                        model._tpm = tpm;
                        model.parse(m);
                        return model;
                    });

                    return this;
                }.bind(this)
            });
        }
    };

    // addition URL options passed on request
    Collection.prototype.addOption = function(key, val)
    {
        this._options = this._options || {};
        this._options[key] = val;

        return this;
    };

    // Create another Model or Collection with the same data context
    Collection.prototype.factory = function(M, opts)
    {
        return this._tpm.factory(M, opts);
    };

    // Process the data received from the server to get the node containing all
    // of the models to parse
    Collection.prototype.parse = function(data, Model)
    {
        return data;
    };

    // Compute the URL
    Collection.prototype.endpoint = function() { };

    return Collection;
});
