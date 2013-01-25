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
                endpoint: this.endpoint(),
                parser: function(data) {
                    data = this.parse(data);

                    // create all the corresponding models
                    this.models = data.map(function(m) {
                        var model = new Model();
                        model._tpm = tpm;
                        return model.parse(m);
                    });

                    return this;
                }.bind(this),
                extra: this.extra || null
            });
        }
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
