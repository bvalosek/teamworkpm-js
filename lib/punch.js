define(function(require) {

    var TeamworkPM = require('lib/TeamworkPM');


    // pull out the hash tags / task IDs from the commit message
    var commitMsg = process.argv[2];

    if (!commitMsg) {
        console.log('no commit message supplied');
        process.exit(1);
    }

    var tags      = commitMsg.match(/#(\S+)/g);
    tags          = tags.map(function(t) { return t.replace('#', ''); });
    var commitMsg = commitMsg.replace(/#(\S+)/g, '');
    var taskIds   = tags.filter(function(t) { return t.match(/^\d+$/); });

    console.log('hash tags found: ', tags);
    console.log('task IDs found:  ', taskIds);

    // connect to teamwork PM
    var config = require('config');
    var tpm = new TeamworkPM(config);
    var project = tpm.projectFactory(config.projectId);
    var me = null;

    tpm.getMe()
    .then(function(user) {
        me = user;
        console.log('Hello ' + me.attributes.userName);
        return project.getTasklists();
    })
    .then(function(lists) {
        var task = lists.findTaskById(taskIds[0]);

        log = me.timeLogFactory(task, 120);
        console.log(log.toServer());
        log.save();
    });



});
