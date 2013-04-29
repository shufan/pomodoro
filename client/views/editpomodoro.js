Template.editpomodoro.created = function () {
  var taskNav = [
    {
      navItem: "<i class=\"icon-ban-circle\"></i>",
      navClass: "navleft"
    }, {
      navItem: "<h1>Edit Pomodoro</h1>",
      navClass: "navtitle"
    }, {
      navItem: "<i class=\"icon-ok\"></i>",
      navClass: "navright"
    }
  ]
  Session.set("navInfo", taskNav);
}

Template.editpomodoro.rendered = function() {
  var pomodoro = Pomodoros.find({"_id": Session.get("currentPomodoro")}).fetch()[0];
  $('#pomodoro-details').val(pomodoro.details);
  $('#date').val(pomodoro.date);
  $('#time').val(pomodoro.time);
  $('#location').replaceWith('<input name=\"location\" id=\"location\" type=\"text\">');
  $('#location').val(pomodoro.location);
  $('.navleft').hammer().on('tap', function(e) {
    Meteor.Router.to('/task/' + Session.get("currentTask"));
  });

  $('.navright').hammer().on('tap', function(e) {
    e.preventDefault();
    var pomodoro_id = Session.get("currentPomodoro");
    var details = $('#pomodoro-details').val();
    var date = $('#date').val();
    var time = $('#time').val();
    var location = $('#location').val();
    Meteor.call("updatePomodoro", pomodoro_id, details, date, time, location, function(err) {
      if (err) {
        // handle update task error
      } else {
        Meteor.Router.to('/task/' + Session.get("currentTask"));
      }
    });
  });

  $('#delete-button').hammer().on('tap', function(e) {
    e.preventDefault();
    var pomodoro_id = Session.get("currentPomodoro");
    Meteor.call("deletePomodoro", pomodoro_id);
    Meteor.Router.to('/task/' + Session.get("currentTask"));
  })
}
