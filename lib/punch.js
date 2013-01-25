define(function(require) {

    var TeamworkPM = require('lib/TeamworkPM');
    var Project    = require('lib/Project');

    // pull out the hash tags / task IDs from the commit message
    var commitMsg = process.argv[2];

    if (!commitMsg) {
        console.log('no commit message supplied');
        process.exit(1);
    }

    var tags      = commitMsg.match(/#(\S+)/g);

    if (!tags) {
        console.log('no tags, exiting');
        process.exit(0);
    }

    tags          = tags.map(function(t) { return t.replace('#', ''); });
    var commitMsg = commitMsg.replace(/#(\S+)/g, '');
    commitMsg     = commitMsg.replace(/ [ ]+/g, '');
    var taskId    = tags.filter(function(t) { return t.match(/^\d+$/); })[0];

    console.log('hash tags found: ', tags);
    console.log('task ID found:   ', taskId);
    console.log('commit message:  ', commitMsg);

    if (!taskId) {
        console.log('not task Id, nothing to do here');
        process.exit(0);
    }

    // connect to teamwork PM
    var config = require('config');
    var tpm = new TeamworkPM(config);

    var project = tpm.factory(Project, { id: config.projectId });
    var me = null;
    var tasklists = null;
    var task = null;


    // load user
    tpm.fetchMe()

    // get all tasks
    .then(function(user) {
        console.log('Hello ' + tpm.getMe().attributes.userName);
        return project.getTasklists();
    })

    // get all time logs
    .then(function(list) {
        tasklists = list
        return project.getTimeEntries();
    })

    .then(function(logs) {
        var log = logs.lastEntryByUser(tpm.getMe());
        var minsElapsed = moment().diff(log.getEndTime(), 'minutes');
        console.log('assuming ' + minsElapsed + ' minutes for this commit');

        // get task
        var task = tasklists.findTaskById(taskId);

        if (!task) {
            console.log('task not found');
            process.exit(1);
        }

        console.log('Logging entry for task: "' + task.attributes.content + '"');

        var newLog = me.timeLogFactory(task, minsElapsed);
        newLog.attributes.description = commitMsg;
        newLog.save();
    });




});
