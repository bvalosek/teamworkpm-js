define(function(require) {

    var Backbone = require('backbone');
    var Deferred = require('JQDeferred');

    var Collection = Backbone.Collection.extend();

    Collection.prototype.sync = function(method, model, options)
    {
        var Model = this.model;
        var tpm   = this._tpm;

        // do the TPM request, and parse out the response we get back, making
        // sure the deferred returns the backbone model
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
    };

    // get the array data source
    Collection.prototype.parse = function(data, Model)
    {
        return data;
    };

    // compute the URL
    Collection.prototype.endpoint = function() { };

    return Collection;
});
