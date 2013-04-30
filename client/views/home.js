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

  if (Session.get("homePane") === "tasks") {
    var secondNav = [
      {
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
    Meteor.Router.to('/profile');
  })
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

Template.loggedIn.tasksActive = function() {
  return Session.get("homePane") === "tasks";
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

  $('.task-item').hammer().on('hold', function(e) {
    e.gesture.stopDetect();
    var task = Tasks.find({'_id': $(this).attr("id")}).fetch()[0];
    if (!task.finished) {
      if (!task.today) {
        Meteor.call("updateTask", task._id, undefined, undefined, undefined, true, undefined);
      } else {
        Meteor.call("updateTask", task._id, undefined, undefined, undefined, false, undefined);
      }
    }
  })
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
Template.tasksList.today = function() {
  return this.today;
}

Template.tasksList.formatTags = function() {
  return this.tags.join(', ');
}

Template.tasksList.incompleteTasks = function() {
  return Tasks.find({"finished": false, "user": Meteor.user().username});
}

Template.tasksList.completed = function() {
  return Pomodoros.find({"task_id": this._id}).fetch().length;
}

Template.tasksList.empty = function() {
  return (Tasks.find({"finished": false, "user": Meteor.user().username}).count() === 0);
}

Template.completedList.completeTasks = function() {
  return Tasks.find({"finished": true, "user": Meteor.user().username});
}

Template.completedList.completed = function() {
  return Pomodoros.find({"task_id": this._id}).fetch().length;
}

Template.completedList.empty = function() {
  return (Tasks.find({"finished": true, "user": Meteor.user().username}).count() === 0);
}

Template.completedList.formatTags = function() {
  return this.tags.join(', ');
}