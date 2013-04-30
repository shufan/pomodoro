Template.newpomodoro.rendered = function() {
  // set up tap events
  $('.navright').hammer().off('tap');
  $('.navright').hammer().on('tap', function(e) {
    e.preventDefault();
    var details = $('#pomodoro-details').val();
    var date = $('#date').val();
    var time = $('#time').val();
    var location = $('#location').val();
    if (details != "" && date != "" && time != "" && location != "") {
      var task_id = Session.get("currentTask");
      var task = Tasks.find({"_id": task_id}, {reactive: false}).fetch();
      // add session information to db
      var plannedTask = Planned.find({"task_id": task_id}, {reactive: false}).fetch();
      var completedToday = parseInt(plannedTask[0].completed);
      Meteor.call("addPomodoro", task_id, details, date, time, location, function(err) {
        var timerNav = [
          {
            navItem: "<i class=\"icon-remove\"></i>",
            navClass: "navleft"
          }, {
            navItem: "<h1>Pomodoro Timer</h1>",
            navClass: "navtitle"
          }, {
            navItem: "",
            navClass: "navright empty"
          }
        ]
        Session.set("navInfo", timerNav);
        Session.set("timerMode", "break");
        Session.set("autoStart", true);
        Meteor.defer(function() {
          $('#newpomodoro-elements').css('visibility', 'hidden');
          $('#timer-elements').css('visibility', 'visible');
        });
      });
    }
  });

  // populate session variable with nearby places
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var options = {
      params: {
        "client_id": "UMID0G3RR44NEWYPO31OU1BH5SQTA5SNBUHBYTJI1DSHRCB4",
        "client_secret": "UD4F3U4TZADA4OKUT01SQLY2H2VOBLSUFMDGZRPDSKLB2FBJ",
        "ll": lat + "," + lon,
        "v": "20130426"
      }
    }
    Meteor.http.call("GET", "https://api.foursquare.com/v2/venues/search", options, function(error, venues) {
      var places = [];
      venues.data.response.venues.forEach(function(place) {
        places.push(place.name);
      });
      Session.set("places", places);
    });
  });
}

Template.manualnewpomodoro.rendered = function() {
  var pomodoroNav = [
    {
      navItem: "<i class=\"icon-ban-circle\"></i>",
      navClass: "navleft"
    }, {
      navItem: "<h1>New Pomodoro Summary</h1>",
      navClass: "navtitle"
    }, {
      navItem: "<i class=\"icon-ok\"></i>",
      navClass: "navright"
    }
  ]
  Session.set("navInfo", pomodoroNav);
  // pre-fill inputs
  $('#date').val(moment().format('YYYY[-]MM[-]DD'));
  $('#time').val(moment().format('HH:mm'));
  $('#newpomodoro-elements').css('visibility', 'visible');
  // set up tap events
  $('.navleft').hammer().off('tap');
  $('.navleft').hammer().on('tap', function(e) {
    Meteor.Router.to('/task/' + Session.get("currentTask"));
  });
  $('.navright').hammer().off('tap');
  $('.navright').hammer().on('tap', function(e) {
    e.preventDefault();
    var details = $('#pomodoro-details').val();
    var date = $('#date').val();
    var time = $('#time').val();
    var location = $('#location').val();
    if (details != "" && date != "" && time != "" && location != "") {
      var task_id = Session.get("currentTask");
      var task = Tasks.find({"_id": task_id}, {reactive: false}).fetch();
      // add session information to db
      Meteor.call("addPomodoro", task_id, details, date, time, location, function(err) {
        var timerNav = [
          {
            navItem: "<i class=\"icon-remove\"></i>",
            navClass: "navleft"
          }, {
            navItem: "<h1>Pomodoro Timer</h1>",
            navClass: "navtitle"
          }, {
            navItem: "",
            navClass: "navright empty"
          }
        ]
        Session.set("navInfo", timerNav);
        Session.set("timerMode", "break");
        Session.set("autoStart", true);
        Meteor.defer(function() {
          Meteor.Router.to('/task/' + Session.get("currentTask"));
        });
      });
    }
  });

  // populate session variable with nearby places
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var options = {
      params: {
        "client_id": "UMID0G3RR44NEWYPO31OU1BH5SQTA5SNBUHBYTJI1DSHRCB4",
        "client_secret": "UD4F3U4TZADA4OKUT01SQLY2H2VOBLSUFMDGZRPDSKLB2FBJ",
        "ll": lat + "," + lon,
        "v": "20130426"
      }
    }
    Meteor.http.call("GET", "https://api.foursquare.com/v2/venues/search", options, function(error, venues) {
      var places = [];
      venues.data.response.venues.forEach(function(place) {
        places.push(place.name);
      });
      Session.set("places", places);
    });
  });
}

Template.pomodoroform.nearbyLocations = function() {
  return Session.get("places");
}

Template.pomodoroform.editing = function() {
  return $(location).attr("pathname") === "/editpomodoro/" + Session.get("currentPomodoro");
}