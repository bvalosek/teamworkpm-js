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

    project.fetch()
    .then(function(project) {
        return project.getTasklists();
    })
    .then(function(tasklists) {
        var task = tasklists.findTaskById(taskIds[0]);

        var comment = task.commentFactory(commitMsg);
        comment.save();

        console.log(task);
    });



});
