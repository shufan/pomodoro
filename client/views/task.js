Template.task.created = function() {
  var taskNav = [
    {
      navItem: "<i class=\"icon-chevron-left\"></i>",
      navClass: "navleft"
    }, {
      navItem: "<h1>Task Overview</h1>",
      navClass: "navtitle"
    }, {
      navItem: "<i class=\"icon-edit\"></i>",
      navClass: "navright"
    }
  ]
  Session.set("navInfo", taskNav);

  var actbarNav = [
    {
      navItem: "<p>Start Pomodoro</p><i class=\"icon-play\"></i>",
      navId: "start-button"
    }
  ];
  Session.set("actbarNavInfo", actbarNav);
}

Template.task.rendered = function() {
  $('.navleft').hammer().on('tap', function(e) {
    Meteor.Router.to('/');
  })

  $('#start-button').hammer().on('tap', function(e) {
    Meteor.Router.to('/timer');
  });
}

Template.taskinfo.currentTask = function() {
  var task = Tasks.find({"_id": Session.get("currentTask")}).fetch();
  return task[0];
}

Template.taskinfo.tags = function() {
  return this.tags;
}