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

    log("vents");
    var vents = _.extend({}, Backbone.Events);

    log("defining tasks model");
    // Define a task Model
    window.App.Models.Task = Backbone.Model.extend({
        defaults: {
            // should we give id here or not?!
            priority: 1,
            completed: false
        },

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
            vents.on("task:edit", this.edit, this);
        },

        edit: function(id) {
            log("editing the task");
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
        },

        // event handler
        show: function() {
            
            log("Showing Todo List");
            $(document.body).append(this.render().el);
        },

        render: function() {
            
            this.$el.html(this.template({todo: this.collection.toJSON()}));
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
            log("matched editTask route");
            // called with task is being edited
            vents.trigger("task:edit",id);
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
        // todoView.show();
        log("creating router");
        new window.App.Router.Todo;  // Create the router object
        Backbone.history.start();
    });

    
    
})();