define(function(require) {

    var Model     = require('./Model');
    var TimeEntry = require('./TimeEntry');

    var User = Model.extend();

    User.prototype.parse = function(data)
    {
        var data = data.person;
        this.id = data.id;

        return {
            id: data.id,
            userName: data['user-name'],
            email: data['email-address'],
            lastLogin: moment(data['last-login'])
        };
    };

    User.prototype.endpoint = function()
    {
        return 'me';
    };

    User.prototype.timeLogFactory = function(task, minutes)
    {
        mintutes = minutes || 60;

        var log = new TimeEntry();
        log.attributes.minutes = minutes;
        log.attributes.date = moment().add('minutes', -minutes);
        log.taskId = task.id,
        log.attributes.userId = this.id,
        log.attributes.description = 'Worked on this task';
        log._tpm = this._tpm;

        return log;
    };

    return User;
});
