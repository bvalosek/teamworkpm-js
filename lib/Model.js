define(function(require) {

    var Backbone   = require('backbone');
    var Deferred   = require('JQDeferred');
    var Collection = require('./Collection');

    var Model = Backbone.Model.extend();

    Model.prototype.sync = function(method, model, options)
    {
        if (method == 'read') {
            // do the TPM request, and parse out the response we get back, making
            // sure the deferred returns the backbone model
            return this._tpm.doRequest({
                endpoint: this.endpoint(),
                parser: function(data) {
                    this.attributes = this.parse(data);
                    return this;
                }.bind(this)
            });
        }

        else if (method == 'create') {
            console.log(method);
            return this._tpm.doRequest({
                endpoint: this.endpoint(),
                method: 'post',
                data: this.toServer()
            });
        }
    };

    // create the collection object as well
    Model.extend = function(opts)
    {
        var M =  Backbone.Model.extend.apply(this, arguments);

        M.Collection = Collection.extend({
            model: M
        });

        return M;
    };

    // transform back into server representation
    Model.prototype.toServer = function()
    {
        return {};
    };

    // get the data in a legit format
    Model.prototype.parse = function(data)
    {
        return data;
    };

    // compute the URL
    Model.prototype.endpoint = function() { };

    return Model;
});
