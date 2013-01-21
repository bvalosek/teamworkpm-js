define(function(require) {

    var Model   = require('./Model');
    var moment  = require('moment');

    var TimeEntry = Model.extend();

    TimeEntry.prototype.parse = function(data)
    {
        this.id = data.id;

        this.attributes = {
            id: data.id,
            projectId: parseInt(data['project-id'], 10),
            taskId: parseInt(data['todo-item-id'], 10),
            description: data.description,
            startDate: moment(data.date),
            minutes: parseInt(data['minutes'], 10)
                + 60*parseInt(data['hours'], 10)
        };

        return this;
    };

    TimeEntry.Collection.prototype.endpoint = function()
    {
        if (this.projectId)
            return 'projects/' + this.projectId + '/time_entries';
    };

    TimeEntry.Collection.prototype.parse = function(data)
    {
        return data['time-entries'];
    };

    return TimeEntry;
});
