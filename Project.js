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

    Project.prototype.getTasklists = function(opts)
    {
        var lists = this.factory(Tasklist.Collection);
        lists.projectId = this.id;
        lists._options = opts;

        return lists;
    };

    // retrieve all recent time logs
    Project.prototype.fetchTimeEntries = function()
    {
        var entries = this.factory(TimeEntry.Collection);
        entries.projectId = this.id;
        entries.addOption('sortOrder', 'desc');

        return entries.fetch();
    };

    Project.prototype.parse = function(data)
    {
        var data = data.project;

        return {
            id           : data.id,
            name         : data.name,
            lastModified : moment(data['last-changed-on']),
            dateCreated  : moment(data['created-on'])
        };
    };

    Project.prototype.createTimeEntry = function(minutes, description)
    {
        var entry = this.factory(TimeEntry);

        description = description || 'Worked on this project';

        entry.attributes = {
            minutes     : minutes,
            date        : moment().add('minutes', -minutes),
            description : description,
            projectId   : this.id
        };

        return entry;
    };

    return Project;
});
