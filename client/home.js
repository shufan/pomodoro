Deps.autorun(Template['secondary-nav'].created = function() {
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
});

Template['secondary-nav'].navInfo = function() {
  return Session.get("secondNavInfo");
}

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

Template.home.created = function() {
  var homeNav = [
    {
      navItem: "",
      navClass: "navleft empty"
    }, {
      navItem: "<h1>Pomodoro</h1>",
      navClass: "navtitle"
    }, {
      navItem: "<i class=\"icon-user\"></i>",
      navClass: "navright"
    }
  ]
  Session.set("navInfo", homeNav);
}

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

Template.loggedIn.hasActBar = function() {
  return (Session.get("homePane") === "today" || Session.get("homePane") === "tasks");
}

Deps.autorun(Template['act-bar'].created = function() {
  if (Session.get("homePane") === "today") {
    var actbarNav = [
      {
        navItem: "<p>[Today's Progress]</p>",
        navClass: "plan-status"
      }, {
        navItem: "<p>Plan</p>",
        navClass: "plan-button"
      }
    ];
  } else if (Session.get("homePane") === "tasks") {
    var actbarNav = [
      {
        navItem: "<i class=\"icon-plus\"></i><p>Add New Task</p>",
        navClass: "addtask-button"
      }
    ];
  }
  Session.set("actbarNavInfo", actbarNav);
});

Template['act-bar'].navInfo = function() {
  return Session.get("actbarNavInfo");
}