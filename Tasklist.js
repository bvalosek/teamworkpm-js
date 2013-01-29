define(function(require) {

    var Model     = require('./Model');
    var Task      = require('./Task');
    var TimeEntry = require('./TimeEntry');

    var Tasklist = Model.extend();

    Tasklist.Collection.prototype.userId = function(userId)
    {
        this.addOption('responsible-party-id', userId);
        return this;
    };

    Tasklist.Collection.prototype.showMilestones = function()
    {
        this.addOption('showMilestones', 'yes');
        return this;
    };

    Tasklist.Collection.prototype.showTasks = function(showTasks)
    {
        this.addOption('showTasks', showTasks === undefined ? 'yes' : 'no');
        return this;
    };

    Tasklist.Collection.prototype.getOverdueCount = function()
    {
        this.addOption('getOverdueCount', 'yes');
        return this;
    };

    Tasklist.Collection.prototype.getCompletedCount = function()
    {
        this.addOption('getCompletedCount', 'yes');
        return this;
    };

    // options are all, active (default), and completed
    Tasklist.Collection.prototype.status = function(s)
    {
        this.addOption('status', s);
        return this;
    };

    // all (default), upcoming, late, today, tomorrow
    Tasklist.Collection.prototype.filter = function(f)
    {
        this.addOption('filter', f);
        return this;
    };

    Tasklist.Collection.prototype.includeOverdue = function()
    {
        this.addOption('includeOverdue', 'yes');
        return this;
    };

    Tasklist.Collection.prototype.stats = function()
    {
        var total = 0, upcoming = 0, overdue = 0,
            mins = 0, logged = 0, remaining = 0,
            overdueMins = 0, overdueLogged = 0, overdueRemaining = 0;

        this.forEachTask(function(task) {
            total++;
            upcoming += task.isOverdue() ? 0 : 1;
            overdue += task.isOverdue() ? 1 : 0;
            mins += task.attributes.estimatedMinutes;
            logged += task.totalLoggedMinutes();
            remaining += task.minutesRemaining();
            overdueMins += task.isOverdue()
                ? task.attributes.estimatedMinutes
                : 0;
            overdueLogged += task.isOverdue()
                ? task.totalLoggedMinutes()
                : 0;
            overdueRemaining += task.isOverdue()
                ? task.minutesRemaining()
                : 0;
        });

        return {
            total: total,
            upcoming: upcoming,
            overdue: overdue,
            estimatedMinutes: mins,
            minutesLogged: logged,
            minutesRemaining: remaining,
            overdueTasks: {
                estimatedMinutes: overdueMins,
                minutesLogged: overdueLogged,
                minutesRemaining: overdueRemaining
            }
        };
    };

    Tasklist.prototype.parse = function(data)
    {
        this.id = data.id;

        this.attributes = {
            id               : data.id,
            name             : data.name,
            projectId        : data.project_id,
            description      : data.description,
            totalCompleted   : parseInt(data['completed-count'], 10),
            totalUncompleted : parseInt(data['uncompleted-count'], 10),
            totalOverdue     : parseInt(data['overdue-count'], 10),
        };

        // tasks included?
        if (data['todo-items']) {
            var tasks = data['todo-items'];
            var tpm = this._tpm;

            var collection = this.factory(Task.Collection);

            collection.tasklistId = this.id;

            collection.models = tasks.map(function(td) {
                var t = this.factory(Task);
                t.parse(td);
                return t;
            }.bind(this));

            this.attributes.tasks = collection;
        }
    };

    Tasklist.prototype.getTasks = function()
    {
        return this.attributes.tasks;
    };

    // Search over an entire collection of tasks lists for a specific task
    Tasklist.Collection.prototype.getTaskById = function(taskId)
    {
        var _task = null;

        var tasklist = this.find(function(tasklist) {
            _task = tasklist.attributes.tasks.find(function(task) {
                return task.id == taskId;
            });

            return _task;
        });

        return _task;
    };

    // Iterate over all tasks in all task lists
    Tasklist.Collection.prototype.forEachTask = function(fn)
    {
        this.each(function(taskList) {
            taskList.attributes.tasks.each(function(task) {
                fn(task);
            });
        });
    };

    // return array of tasks filtered by fn
    Tasklist.Collection.prototype.filterTasks = function(fn)
    {
        var ret = [];

        this.each(function(taskList) {
            tasks = taskList.attributes.tasks.filter(function(task) {
                return fn(task);
            });

            ret = ret.concat(tasks);
        });

        return ret;
    };

    // fetch + inject
    Tasklist.Collection.prototype.fetchTimeEntries = function()
    {
        var d = new this._tpm.Deferred();

        var entries = this.factory(TimeEntry.Collection);
        entries.projectId = this.projectId;
        entries.addOption('sortOrder', 'desc');

        entries.fetch().done(function(entries) {
            this.injectTimeEntries(entries);
            d.resolve(this);
        }.bind(this));

        return d;
    };

    // inject time information into each task from the collect of TimeEntry
    // objects
    Tasklist.Collection.prototype.injectTimeEntries = function(entries)
    {
        this.timeEntries = entries;

        // attach onto individual tasks
        entries.each(function(entry) {
            var task = this.getTaskById(entry.attributes.taskId);

            if (task) {
                task.timeEntries = task.timeEntries || [];
                task.timeEntries.push(entry);
            }

        }.bind(this));

        return this;
    };

    Tasklist.Collection.prototype.endpoint = function()
    {
        if (this.projectId)
            return 'projects/' + this.projectId + '/todo_lists';
    };

    Tasklist.Collection.prototype.parse = function(data, Model)
    {
        return data['todo-lists'];
    };

    return Tasklist;
});
