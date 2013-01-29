define(function(require) {

    var Model     = require('./Model');
    var TimeEntry = require('./TimeEntry');

    var User = Model.extend();

    User.prototype.parse = function(data)
    {
        data = data.person;

        this.id = data.id;

        this.attributes = {
            id        : data.id,
            username  : data['user-name'],
            email     : data['email-address'],
            lastLogin : moment(data['last-login'])
        };
    };

    User.prototype.endpoint = function()
    {
        return 'me';
    };

    return User;
});
