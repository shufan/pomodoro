////////////////////////////////////////////
//secondary-nav Template Setup and Helpers//
////////////////////////////////////////////
Template['secondary-nav'].navInfo = function() {
  return Session.get("secondNavInfo");
}

///////////////////////////////////
//home Template Setup and Helpers//
///////////////////////////////////

Deps.autorun(Template.home.created = function() {
  var homeNav = [
    {
      navItem: "<i class=\"icon-signout\"></i>",
      navClass: "navleft"
    }, {
      navItem: "<h1>Pomodoro</h1>",
      navClass: "navtitle"
    }, {
      navItem: "<i class=\"icon-user\"></i>",
      navClass: "navright"
    }
  ]
  Session.set("navInfo", homeNav);

  if (Session.get("homePane") === "today") {
    var actbarNav = [
      {
        navItem: "<p>[Today's Progress]</p>",
        navId: "plan-status"
      }, {
        navItem: "<p>Plan</p>",
        navId: "plan-button"
      }
    ];
  } else if (Session.get("homePane") === "tasks") {
    var actbarNav = [
      {
        navItem: "<p>Add New Task</p><i class=\"icon-plus\"></i>",
        navId: "addtask-button"
      }
    ];
  }
  Session.set("actbarNavInfo", actbarNav);

  if (Session.get("homePane") === "today") {
    var secondNav = [
      {
        navItem: "<h2>Today</h2>",
        navClass: "today-tab current"
      }, {
        navItem: "<h2>Tasks</h2>",
        navClass: "tasks-tab"
      }, {
        navItem: "<h2>Completed</h2>",
        navClass: "completed-tab"
      }
    ];
  } else if (Session.get("homePane") === "tasks") {
    var secondNav = [
      {
        navItem: "<h2>Today</h2>",
        navClass: "today-tab"
      }, {
        navItem: "<h2>Tasks</h2>",
        navClass: "tasks-tab current"
      }, {
        navItem: "<h2>Completed</h2>",
        navClass: "completed-tab"
      }
    ];
  } else {
    var secondNav = [
      {
        navItem: "<h2>Today</h2>",
        navClass: "today-tab"
      }, {
        navItem: "<h2>Tasks</h2>",
        navClass: "tasks-tab"
      }, {
        navItem: "<h2>Completed</h2>",
        navClass: "completed-tab current"
      }
    ]
  }
  Session.set("secondNavInfo", secondNav);

  Template['secondary-nav'].events({
    'click .today-tab': function(e, templ) {
      Meteor.Router.to('/today');
    },
    'click .tasks-tab': function(e, templ) {
      Meteor.Router.to('/tasks');
    },
    'click .completed-tab': function(e, templ) {
      Meteor.Router.to('/completed');
    }
  });
});

Template.home.rendered = function() {
  // set up tap events
  $('.navleft').hammer().on('tap', function(e) {
    e.preventDefault();
    Meteor.logout();
  });

  $('.navright').hammer().on('tap', function(e) {
    e.preventDefault();
  });
}

////////////////////////////////////////
//loggedOut Template Setup and Helpers//
////////////////////////////////////////

Template.loggedOut.events({
  'click #login': function(e, templ) {
    e.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();
    Meteor.loginWithPassword(username, password, function(err) {
      if (err) {
        // error handling
        console.log(err);
      } else {
        // show an alert
      }
    });
  },
});

///////////////////////////////////////
//loggedIn Template Setup and Helpers//
///////////////////////////////////////
Template.loggedIn.hasActBar = function() {
  return (Session.get("homePane") === "today" || Session.get("homePane") === "tasks");
}

Template.loggedIn.todayActive = function() {
  return Session.get("homePane") === "today";
}

Template.loggedIn.tasksActive = function() {
  return Session.get("homePane") === "tasks";
}

Template.loggedIn.completedActive = function() {
  return Session.get("homePane") === "completed"
}

Template.loggedIn.rendered = function() {
  $('#addtask-button').hammer().on('tap', function(e) {
    e.preventDefault();
    Meteor.Router.to('/newtask');
  });

  $('#plan-button').hammer().on('tap', function(e) {
    e.preventDefault();
    Meteor.Router.to('/plan');
  });

  $('.task-item').hammer().on('tap', function(e) {
    Meteor.Router.to('/task/' + $(this).attr("id"));
  });
}

//////////////////////////////////////
//act-bar Template Setup and Helpers//
//////////////////////////////////////
// Deps.autorun(Template.home.created = function() {
  
// });

Template['act-bar'].navInfo = function() {
  return Session.get("actbarNavInfo");
}

///////////////////////////////////
//List Template Setup and Helpers//
///////////////////////////////////
Template.todayList.empty = function() {
  var tasks = [];
  Planned.find({"planned": {"$gt": 0}}).forEach(function(task) {
    if (Tasks.find({"_id": task.task_id}).fetch()[0].user === Meteor.user().username) {
      tasks.push(task);
    }
  });
  return tasks.length === 0;
}

Template.todayList.plannedTasks = function() {
  var tasks = [];
  Planned.find({"planned": {"$gt": 0}}).forEach(function(task) {
    if (Tasks.find({"_id": task.task_id}).fetch()[0].user === Meteor.user().username) {
      tasks.push(task);
    }
  });
  return tasks;
}

Template.todayList.taskName = function() {
  var task = Tasks.find({"_id": this.task_id}).fetch();
  return task[0].name;
}

Template.tasksList.incompleteTasks = function() {
  return Tasks.find({"finished": false, "user": Meteor.user().username});
}

Template.tasksList.empty = function() {
  return (Tasks.find({"finished": false, "user": Meteor.user().username}).count() === 0);
}

Template.completedList.completeTasks = function() {
  return Tasks.find({"finished": true, "user": Meteor.user().username});
}

Template.completedList.empty = function() {
  return (Tasks.find({"finished": true, "user": Meteor.user().username}).count() === 0);
}