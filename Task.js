define(function(require) {

    var Model     = require('./Model');
    var Comment   = require('./Comment');
    var TimeEntry = require('./TimeEntry');
    var moment    = require('moment');
    var _         = require('underscore');

    var Task = Model.extend();

    Task.prototype.parse = function(data)
    {
        this.id = data.id;

        this.attributes = {
            id               : data.id,
            name             : data.content,
            description      : data.description,
            userId           : data['responsible-party-id'],
            taskListId       : data['todo-list-id'],
            progress         : data.progress,
            priority         : data.priority,
            dateCreated      : moment(data['created-on']),
            lastModified     : moment(data['last-changed-on']),
            completed        : data.completed == 'true',
            estimatedMinutes : parseInt(data['estimated-minutes'], 10) || 0,
            dateDue          : data['due-date']
                ? moment(data['due-date'], 'YYYYMMDD')
                : null
        };

        return this;
    };

    Task.prototype.getTimeEntries = function()
    {
        return this.timeEntries || [];
    };

    Task.prototype.isOverdue = function()
    {
        return moment().diff(this.attributes.dateDue, 'days', true) >= 1;
    };

    // logged minutes vs actual, never negative
    Task.prototype.minutesRemaining = function()
    {
        var delta = this.attributes.estimatedMinutes - this.totalLoggedMinutes();
        return delta > 0 ? delta : 0;
    };

    // total number of logged minutes here
    Task.prototype.totalLoggedMinutes = function()
    {
        if (!this.timeEntries)
            return 0;

        return _(this.timeEntries).reduce(function(acc, x) {
            return acc + x.attributes.minutes;
        }, 0);
    };

    Task.prototype.createComment = function(message)
    {
        return this.factory(Comment, {
            message: message,
            resourceType: 'todo_items',
            resourceId: this.id
        });
    };

    Task.prototype.createTimeEntry = function(minutes, description)
    {
        return this.factory(TimeEntry, {
            minutes     : minutes,
            date        : moment().add('minutes', -minutes),
            description : description || 'Worked on this task',
            taskId      : this.id
        });
    };

    return Task;
});
