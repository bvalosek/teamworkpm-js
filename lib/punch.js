define(function(require) {

    var TeamworkPM = require('lib/TeamworkPM-node');
    var Project    = require('lib/Project');
    var _          = require('underscore');
    var moment     = require('moment');






    // first argument is everything
    var commitMsg = process.argv[2];
    if (commitMsg) {
        console.log('no commit message supplied');
        process.exit(1);

        // extract tags if we got em
        var tags   = commitMsg.match(/#(\S+)/g);
        var taskId = null;

        if (tags) {
            tags      = tags.map(function(t) { return t.replace('#', ''); });
            taskId    = tags.filter(function(t) { return t.match(/^\d+$/); })[0];

            commitMsg = commitMsg.replace(/#(\S+)/g, '');
        }

        // trim
        commitMsg = commitMsg.replace(/ [ ]+/g, '');

        console.log('hash tags found: ', tags || '[none]');
        console.log('task ID found:   ', taskId || '[none]');
        console.log('commit message:  ', commitMsg);
    }


    // connect to teamwork PM
    var config = require('config');
    var tpm = new TeamworkPM(config);

    var project   = tpm.factory(Project, { id: config.projectId });
    var tasklists = null;
    var task      = null;

    // load user
    tpm.fetchMe()

    // load project
    .then(function(user) {
        return project.fetch();
    })

    // get all tasks
    .then(function() {
        console.log('Hello ' + tpm.getMe().attributes.userName);
        return project.getTasklists();
    })

    // get all time logs
    .then(function(lists) {
        tasklists = lists;
        return project.fetchTimeEntries();
    })

    // save the time entry
    .then(function(logs) {
        var log = logs.lastEntryByUser(tpm.getMe());
        var minsElapsed = log.minutesSinceEnd();
        minsElapsed = minsElapsed > 4*60 ? 60 : minsElapsed;

        // create new entry
        var entry = null;

        // if we got a task
        if (taskId)
        {
            console.log('assuming ' + minsElapsed + ' minutes for this commit');
            var task = tasklists.findTaskById(taskId);
            console.log('Logging entry for task: "'
                + task.attributes.content + '"');

            entry = task.createTimeEntry(minsElapsed, commitMsg);
            entry.save();
        } else if (commitMsg) {
            console.log('assuming ' + minsElapsed + ' minutes for this commit');
            console.log('Logging entry for project: "'
                + project.attributes.name + '"');

            entry = project.createTimeEntry(minsElapsed, commitMsg);
            entry.save();
        }

        // setup time entries
        tasklists.injectTimeEntries(logs);

        // display info
        var tasks = tasklists.filterTasks(function(x) {
            return x.attributes.dateDue
                && x.attributes.responsiblePartyId == tpm.getMyId();
        });

        console.log('My tasks with due dates: ' +  tasks.length);

        var lateTasks = _(tasks).filter(function(task) {
            return moment().diff(task.attributes.dateDue, 'days') > 1;
        });

        console.log('My late tasks: ' + lateTasks.length);

        var loggedTasks = _(tasks).filter(function(task) {
        });
    });




});
