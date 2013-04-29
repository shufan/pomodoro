Template.plan.created = function() {
  var planNav = [
    {
      navItem: "<i class=\"icon-remove\"></i>",
      navClass: "navleft"
    }, {
      navItem: "<h1>Plan Pomodoros for Today</h1>",
      navClass: "navtitle"
    }, {
      navItem: "",
      navClass: "navright empty"
    }
  ]
  Session.set("navInfo", planNav);
  var actbarNav = [
    {
      navItem: "<p>[ __ Pomodoro's Planned]</p>",
      navId: "plan-status"
    }, {
      navItem: "<p>Done</p>",
      navId: "done-button"
    }
  ];
  Session.set("actbarNavInfo", actbarNav);
}

Template.plan.rendered = function() {
  $('.navleft').hammer().on('tap', function(e) {
    Meteor.Router.to('/today');
  });

  $('.icon-angle-up').hammer().on('tap', function(e) {
    var task_id = $(this).parent().parent().attr('id');
    var numPlannedElement = $('#' + task_id + ' > .planned');
    numPlannedElement.html(parseInt(numPlannedElement.html()) + 1);
  });

  $('.icon-angle-down').hammer().on('tap', function(e) {
    var task_id = $(this).parent().parent().attr('id');
    var numPlannedElement = $('#' + task_id + ' > .planned');
    var numPlanned = parseInt(numPlannedElement.html());
    if (numPlanned > 0) {
      numPlannedElement.html(parseInt(numPlannedElement.html()) - 1);
    }
  });

  $('#done-button').hammer().on('tap', function(e) {
    $('.plan-list > li').each(function(i) {
      var task_id = $(this).attr('id');
      var numPlannedElement = $('#' + task_id + ' > .planned');
      var planned = parseInt(numPlannedElement.html());
      Meteor.call("updateTaskPlans", task_id, planned, undefined, function(err) {
        if (err) {
          // handle error
        } else {
          Meteor.Router.to('/today');
        }
      });
    });
  });
}

Template.plannableTasks.empty = function() {
  return (Tasks.find({"finished": false, "user": Meteor.user().username}).count() === 0);
}

Template.plannableTasks.incompleteTasks = function() {
  return Tasks.find({"finished": false, "user": Meteor.user().username});
}

Template.plannableTasks.left = function() {
  var completed = Pomodoros.find({"task_id": Session.get("currentTask")}).fetch().length;
  var left = this.expected - completed;
  if(left < 0) {
    return 0;
  } else {
    return left;
  }
}

Template.plannableTasks.planned = function() {
  var task = Planned.find({"task_id": this['_id']}).fetch();
  return task[0].planned;
}