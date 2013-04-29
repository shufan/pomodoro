Template.newtask.created = function() {
  var taskNav = [
    {
      navItem: "<i class=\"icon-ban-circle\"></i>",
      navClass: "navleft"
    }, {
      navItem: "<h1>New Task</h1>",
      navClass: "navtitle"
    }, {
      navItem: "<i class=\"icon-ok\"></i>",
      navClass: "navright"
    }
  ]
  Session.set("navInfo", taskNav);
}

Template.newtask.rendered = function() {
  // set up tap events
  $('.navleft').hammer().on('tap', function(e) {
    Meteor.Router.to('/tasks');
  });

  $('.navright').hammer().on('tap', function(e) {
    e.preventDefault();
    var name = $('#name').val();
    var tags = $('#tags').val().split(/[\s,]+/);
    var expected = parseInt($('#pomodoros-expected').val());
    Meteor.call("addTask", name, tags, expected, function(err) {
      if (err) {
        // handle add task error
      } else {
        Meteor.Router.to('/tasks');
      }
    });
  });
}

Template.taskform.editing = function() {
  return $(location).attr("pathname") === "/edittask";
}