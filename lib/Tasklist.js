define(function(require) {

    var Model = require('./Model');
    var Task  = require('./Task');

    var Tasklist = Model.extend();

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
        };

        // tasks included?
        if (data['todo-items']) {
            var tasks = data['todo-items'];
            var tpm = this._tpm;

            var collection = this.factory(Task.Collection);

            collection.tasklistId = this.id;

            collection.models = tasks.map(function(td) {
                var t = this.factory(Task);
                return t.parse(td);
            }.bind(this));

            this.attributes.tasks = collection;
        }

        return this;
    };

    // Search over an entire collection of tasks lists for a specific task
    Tasklist.Collection.prototype.findTaskById = function(taskId)
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
