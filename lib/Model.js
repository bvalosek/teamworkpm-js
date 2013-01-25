define(function(require) {

    var Backbone   = require('backbone');
    var Collection = require('./Collection');

    var Model = Backbone.Model.extend();

    Model.prototype.sync = function(method, model, options)
    {
        if (!this._tpm)
            throw new Error('Model cannot be synced without a data context');

        if (method == 'read') {
            return this._tpm.doRequest({
                endpoint: this.endpoint(),
                parser: function(data) {
                    this.attributes = this.parse(data);
                    return this;
                }.bind(this)
            });
        }

        else if (method == 'create') {
            return this._tpm.doRequest({
                endpoint: this.endpoint(),
                method: 'post',
                data: this.toServer()
            });
        }
    };

    // Create another Model or Collection with the same data context
    Model.prototype.factory = function(M, opts)
    {
        return this._tpm.factory(M, opts);
    };

    // When extending, make sure to create a Collection class as well
    Model.extend = function(opts)
    {
        var M =  Backbone.Model.extend.apply(this, arguments);

        M.Collection = Collection.extend({
            model: M
        });

        return M;
    };

    // Return a projection to send back to the server
    Model.prototype.toServer = function()
    {
        return {};
    };

    // Process the data we recieve from the server
    Model.prototype.parse = function(data)
    {
        return data;
    };

    // Compute the URL
    Model.prototype.endpoint = function() { };

    return Model;
});
