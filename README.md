TeamworkPM Javascript API
=========================

Javascript wrapper for TeamworkPM's API for both the browser and Node.

## Example ##

Real simple stuff.

```javascript
var teamworkPM = new TeamworkPM({
    apiKey: 'myApiKey',
    siteUrl: 'http://mysite.teamworkpm.net'
});

teamworkPM
    .fetchMe()
    .then(function(me) {
        console.log('Hello ' + me.attributes.username);

        return teamworkPM
            .getProject(1234)
            .getTasklists()
                .userId(me.id)
                .showMilestones()
                .status('active')
                .filter('upcoming')
                .includeOverdue()
            .fetch()
    })
    .then(function(lists) {
        return lists.fetchTimeEntries();
    })
    .then(function(lists) {
        console.log(lists.stats());
    });
```

Boom.

This is what we just did:

* Setup the API connection
* Get the user's info
* Politely greet the user
* Get all task lists that:
    * Are assigned to the user
    * Are active
    * Are upcoming or overdue
* Load any corresponding time entries into the task lists
* Display stats about all task lists

## Dependencies ##

* Backbone
* jQuery
* underscore.js
* moment.js

If running on the server with Node, you'll need the request and JQDeferred packages as well in the place of jquery's ajax and the Deferred object.
