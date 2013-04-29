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
      navItem: "<p>Mark as Complete</p><i class=\"icon-check\"></i>",
      navId: "status-button"
    },
    {
      navItem: "<p>Start Pomodoro</p><i class=\"icon-play\"></i>",
      navId: "start-button"
    }
  ];
  Session.set("actbarNavInfo", actbarNav);
}

Template.task.rendered = function() {
  var task = Tasks.find({"_id": Session.get("currentTask")}).fetch()[0];
  
  $('.navleft').hammer().on('tap', function(e) {
    Meteor.Router.to('/');
  })

  
  if (task.finished) {
    $('#status-button').html('<p>Mark as Incomplete</p><i class=\"icon-check-empty\"></i>')
    $('#status-button').hammer().off('tap');
    $('#status-button').hammer().on('tap', function(e) {
      Meteor.call("updateTask", Session.get("currentTask"), undefined, undefined, undefined, false);
      Meteor.call("initializeTaskPlans", task._id);
    });
  } else {
    $('#status-button').html('<p>Mark as Complete</p><i class=\"icon-check\"></i>')
    $('#status-button').hammer().off('tap');
    $('#status-button').hammer().on('tap', function(e) {
      Meteor.call("updateTask", Session.get("currentTask"), undefined, undefined, undefined, true);
      Meteor.call("deleteTaskPlans", task._id);
    });  
  }

  $('#start-button').hammer().on('tap', function(e) {
    Meteor.Router.to('/worktimer');
  });

  $('.navright').hammer().on('tap', function(e) {
    Meteor.Router.to('/edittask');
  })

  $('.pomodoro-history').innerHeight($(window).height() - 
    $('.navbar').innerHeight() * 2 - $('.header').innerHeight() * 4 - 
    $('.name').innerHeight() - $('.tags').innerHeight() - $('.expected-pomodoros').innerHeight() * 2 - 1);

  $('#add-pomodoro-button').hammer().on('tap', function(e) {
    Meteor.Router.to('/manualnewpomodoro');
  })

  $('.pomodoro-item').hammer().on('tap', function(e) {
    Meteor.Router.to('/editpomodoro/' + $(this).attr("id"));
  });
}

Template.taskinfo.currentTask = function() {
  var task = Tasks.find({"_id": Session.get("currentTask")}).fetch()[0];
  return task;
}

Template.taskinfo.tags = function() {
  return this.tags;
}

Template.taskinfo.pomodoros = function() {
  return Pomodoros.find({"task_id": Session.get("currentTask")}).fetch();
}

Template.taskinfo.completed = function() {
  return Pomodoros.find({"task_id": Session.get("currentTask")}).fetch().length;
}

Template['pomodoro-item'].dateFormat = function(date) {
  return moment(date).format('MMMM Do YYYY');
}

Template['pomodoro-item'].timeFormat = function(time) {
  return moment(time, 'h:mm a').format('h:mm a');
}