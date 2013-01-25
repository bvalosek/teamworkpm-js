define(function(require) {

    var Model = require('./Model');

    var Comment = Model.extend();

    Comment.prototype.endpoint = function()
    {
        return this.attributes.resourceType + '/'
            + this.attributes.resourceId + '/comments';
    };

    Comment.prototype.toServer = function()
    {
        return {
            comment: {
                body: this.attributes.message
            }
        };
    };

    return Comment;
});
