define(function(require) {

    var Model   = require('./Model');
    var Comment = require('./Comment');
    var moment  = require('moment');

    var Task = Model.extend();

    Task.prototype.parse = function(data)
    {
        this.id = data.id;

        this.attributes = {
            id: data.id,
            content: data.content,
            description: data.description,
            responsiblePartyId: data['responsible-party-id'],
            taskListId: data['todo-list-id'],
            progress: data.progress,
            priority: data.priority,
            dateCreated: moment(data['created-on']),
            lastModified: moment(data['last-changed-on']),
            complete: data.completed,
            estimatedMinutes: parseInt(data['estimated-minutes'], 10) || 0,
            dateDue: data['due-date'] ? moment(data['due-date'], 'YYYYMMDD') : null
        };

        return this;
    };

    Task.prototype.commentFactory = function(message)
    {
        var comment = new Comment();
        comment.setMessage(message);
        comment.attributes.resourceType = 'todo_items';
        comment.attributes.resourceId = this.id;
        comment._tpm = this._tpm;

        return comment;
    };

    return Task;
});
