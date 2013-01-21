define(function(require) {

    var Model     = require('./Model');
    var Tasklist  = require('./Tasklist');
    var TimeEntry = require('./TimeEntry');
    var moment    = require('moment');

    var Project = Model.extend();

    Project.prototype.endpoint = function()
    {
        return 'projects/' + this.id;
    };

    Project.prototype.getTasklists = function()
    {
        var lists = new Tasklist.Collection();
        lists._tpm = this._tpm;
        lists.projectId = this.id;

        return lists.fetch();
    };

    // retrieve all recent time logs
    Project.prototype.getTimeEntries = function()
    {
        var logs = new TimeEntry.Collection();
        logs._tpm = this._tpm;
        logs.projectId = this.id;

        return logs.fetch();
    };

    Project.prototype.parse = function(data)
    {
        var data = data.project;

        return {
            id: data.id,
            name: data.name,
            lastModified: moment(data['last-changed-on']),
            dateCreated: moment(data['created-on'])
        };
    };

    return Project;
});
