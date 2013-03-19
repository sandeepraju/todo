(function() {

    // log
    console.log("defining logs");
    function log(msg) {
        if(console) {
            console.log(msg);
        }
    }

    log("defining ns");
    // Define namespace
    window.App = {
        Models: {},
        Views: {},
        Collections: {},
        Router: {}
    };

    log("creating vents object");
    var vents = _.extend({}, Backbone.Events);

    log("defining tasks model");
    // Define a task Model
    window.App.Models.Task = Backbone.Model.extend({
        defaults: {
            // should we give id here or not?!
            priority: 1,
            completed: false
        },
        // url: "/api/task",

        initialize: function() {

        }
    });

    log("defining collection of tasks model");
    // Define a Collection of 'task Models'
    window.App.Collections.Todo = Backbone.Collection.extend({
        model: window.App.Models.Task,
        url: "/api/task",

        initialize: function() {
            log("inside init of todo collection");
        }
    });


    log("defining task view");
    // view for a single task
    window.App.Views.Task = Backbone.View.extend({
        template : _.template($("#taskTemplate").html()),

        initialize: function() {
            log("inside init of the task view");
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    log("defining todo view");
    // view of a collection of tasks / todo
    window.App.Views.Todo = Backbone.View.extend({
        template : _.template($("#todoTemplate").html()),

        initialize: function() {
            // bind event handler to the custom show event
            log("inside init of todo view");
            vents.on("todo:show", this.show, this);
            vents.on("task:edit", this.edit, this);
        },

        // event handler
        show: function() {
            
            log("Showing Todo List");
            $(document.body).html(this.render().el);
        },

        // event handler
        edit: function(id) {
            log("task edit working! got id " + id);
            var taskEditView = new window.App.Views.TaskEdit({model: this.collection.get(id)});
            $(document.body).html(taskEditView.render().el);

            // this.render(task).el);
        },

        render: function() {
            
            this.$el.html(this.template({todo: this.collection.toJSON()}));
            return this;
        }
    });

    log("defining task edit view");
    window.App.Views.TaskEdit = Backbone.View.extend({
        template: _.template($("#taskEditTemplate").html()),

        initialize: function() {
            log("inside init of task edit view");
            // this.render();
        },

        events: {
            'click input.edit-submit': 'taskEditSubmit'
        },

        taskEditSubmit: function() {
            this.model.save({
                todo: "SAVED",
                priority: 5,
                completed: true
            });
            this.remove();
            // vents.trigger("todo:show");
            appRouter.navigate('', true);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;

        }
    });
   

    log("defining router");
    // Define router for the application
    window.App.Router.Todo = Backbone.Router.extend({
        routes: {
            "" : "index",
            "edit/:id" : "editTask",
            "delete/:id": "deleteTask"
        },

        index: function() {
            // called at route
            log("matched index route");
            vents.trigger("todo:show");
        },

        editTask: function(id) {
            log("matched editTask route with id " + id);
            // called with task is being edited
            vents.trigger("task:edit", id);
        },

        deleteTask: function() {
            log("matched deleteTask route");
            // called when the task is being deleted
        }
    });

    // log("creating a single task");
    // new window.App.Models.Task;

    log("creating collection with fetch data");
    todoCollection = new window.App.Collections.Todo;
    todoCollection.fetch()
    .done(function() {
        log("creating view for the collection")
        todoView = new window.App.Views.Todo({collection: todoCollection});
        

        log("creating task edit view");
        taskEdit = new window.App.Views.TaskEdit;

        log("creating router");
        appRouter = new window.App.Router.Todo;  // Create the router object
        Backbone.history.start();
    });

    
    
})();