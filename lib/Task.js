define(function(require) {

    var Model     = require('./Model');
    var Comment   = require('./Comment');
    var TimeEntry = require('./TimeEntry');
    var moment    = require('moment');

    var Task = Model.extend();

    Task.prototype.parse = function(data)
    {
        this.id = data.id;

        this.attributes = {
            id                 : data.id,
            content            : data.content,
            description        : data.description,
            responsiblePartyId : data['responsible-party-id'],
            taskListId         : data['todo-list-id'],
            progress           : data.progress,
            priority           : data.priority,
            dateCreated        : moment(data['created-on']),
            lastModified       : moment(data['last-changed-on']),
            complete           : data.completed,
            estimatedMinutes   : parseInt(data['estimated-minutes'], 10) || 0,
            dateDue            : data['due-date']
                ? moment(data['due-date'], 'YYYYMMDD')
                : null
        };

        return this;
    };

    Task.prototype.createComment = function(message)
    {
        var comment = this.factory(Comment);

        comment.setMessage(message);
        comment.attributes.resourceType = 'todo_items';
        comment.attributes.resourceId = this.id;

        return comment;
    };

    Task.prototype.createTimeEntry = function(minutes, description)
    {
        var entry = this.factory(TimeEntry);

        description = description || 'Worked on this task';

        entry.attributes = {
            minutes     : minutes,
            date        : moment().add('minutes', -minutes),
            description : description,
            taskId      : this.id
        };

        return entry;
    };

    return Task;
});
