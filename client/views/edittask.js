Template.edittask.created = function () {
  var taskNav = [
    {
      navItem: "<i class=\"icon-ban-circle\"></i>",
      navClass: "navleft"
    }, {
      navItem: "<h1>Edit Task</h1>",
      navClass: "navtitle"
    }, {
      navItem: "<i class=\"icon-ok\"></i>",
      navClass: "navright"
    }
  ]
  Session.set("navInfo", taskNav);
}

Template.edittask.rendered = function() {
  var task = Tasks.find({"_id": Session.get("currentTask")}).fetch()[0];
  $('#name').val(task.name);
  $('#tags').val(task.tags.join(', '));
  $('#pomodoros-expected').val(task.expected);
  
  $('.navleft').hammer().on('tap', function(e) {
    Meteor.Router.to('/task/' + Session.get("currentTask"));
  });

  $('.navright').hammer().on('tap', function(e) {
    e.preventDefault();
    var task_id = Session.get("currentTask");
    var name = $('#name').val();
    var tags = $('#tags').val().split(/[\s,]+/);
    var expected = parseInt($('#pomodoros-expected').val());
    Meteor.call("updateTask", task_id, name, tags, expected, function(err) {
      if (err) {
        // handle update task error
      } else {
        Meteor.Router.to('/task/' + task_id);
      }
    })
  });

  $('#delete-button').hammer().on('tap', function(e) {
    e.preventDefault();
    var task_id = Session.get("currentTask");
    Meteor.call("deleteTask", task_id);
    Meteor.call("deleteTaskPlans", task_id);
    Meteor.call("deletePomodorosForTask", task_id);
    Meteor.Router.to('/');
  });
}