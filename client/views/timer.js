Template.timer.created = function() {
  var task = Tasks.find({"_id": Session.get("currentTask")}).fetch();
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

  var actNav = [
    {
      actItem: "<p>Pause (3:00)</p>",
      actId: "pauseresume-button"
    }, {
      actItem: "<p>Start</p>",
      actId: "startreset-button"
    }
  ]
  Session.set("actInfo", actNav);
}

Template['big-actbar'].actInfo = function() {
  return Session.get("actInfo");
}

Template.timer.currentTask = function() {
  var task = Tasks.find({"_id": Session.get("currentTask")}).fetch();
  return task[0];
}

Template.timer.breakTimer = function() {
  return Session.get("timerMode") === "break";
}

Template.timer.rendered = function() {
  var sec;
  var min;
  var pauseSec = 00;
  var pauseMin = 3;
  var timerIDs = [];
  var pauseTimerIDs = [];

  if (Session.equals("timerMode", "work")) {
    $('#work-button').addClass("current");
  } else if (Session.equals("timerMode", "break")) {
    $('#break-button').addClass("current");
  }

  $('.timer').innerHeight($(window).height() - $('.navbar').innerHeight() - $('.mode-select').innerHeight() - $('.name').innerHeight() - $('.big-actbar').innerHeight());

  $('.navleft').hammer().on('tap', function(e) {
    for (var i = 0; i < timerIDs.length; i++)
      clearInterval(timerIDs[i]);
    timerIDs = [];
    for (var j = 0; j < pauseTimerIDs.length; j++)
      clearInterval(pauseTimerIDs[j]);
    pauseTimerIDs = [];
    Meteor.Router.to('/task/' + Session.get("currentTask"));
  });

  $('#work-button').hammer().on('tap', function(e) {
    for (var i = 0; i < timerIDs.length; i++) {
      clearInterval(timerIDs[i]);
    }
    timerIDs = [];
    for (var j = 0; j < pauseTimerIDs.length; j++) {
      clearInterval(pauseTimerIDs[j]);
    }
    pauseTimerIDs = [];
    Session.set("timerMode", "work");
  });

  $('#break-button').hammer().on('tap', function(e) {
    for (var i = 0; i < timerIDs.length; i++) {
      clearInterval(timerIDs[i]);
    }
    timerIDs = [];
    for (var j = 0; j < pauseTimerIDs.length; j++) {
      clearInterval(pauseTimerIDs[j]);
    }
    pauseTimerIDs = [];
    Session.set("timerMode", "break");
  });

  $('#stopalarm-button').hammer().on('tap', function(e) {
    var task_id = Session.get("currentTask");
    var task = Tasks.find({"_id": task_id}, {reactive: false}).fetch();
    var completed = parseInt(task[0].completed);
    if (Session.equals("timerMode","work")) {
      Meteor.call("updateTask", Session.get("currentTask"), undefined, undefined, undefined, completed + 1, undefined, function(err) {
        if (err) {
          // handle error
        } else {
          var plannedTask = Planned.find({"task_id": task_id}, {reactive: false}).fetch();
          var completedToday = parseInt(plannedTask[0].completed);
          Meteor.call("updateTaskPlans", task_id, undefined, completedToday + 1);
          var actNav = [
            {
              actItem: "<p>Enjoy Your Break!</p>",
              actId: "break-message"
            }
          ]
          Session.set("actInfo", actNav);
          Session.set("timerMode", "break");
          startTimer();
        }
      });
    } else if(Session.equals("timerMode", "break")) {
      var actNav = [
        {
          actItem: "<p>Pause (3:00)</p>",
          actId: "pauseresume-button"
        }, {
          actItem: "<p>Start</p>",
          actId: "startreset-button"
        }
      ]
      Session.set("actInfo", actNav);
      Session.set("timerMode", "work");
      resetTimer();
    }
  });

  $('#startreset-button').hammer().on('tap', startTimer);

  $('#pauseresume-button').hammer().on('tap', pauseTimer);

  function countDown()
  {
    if (!(min == 0 && sec == 0)) {
      min = (sec == 0) ? min-1 : min;
      sec = (sec > 0) ? sec-1 : 59;

      if (min < 10 && String(min).length < 2) min = "0" + min;
      if (sec < 10) sec = "0" + sec;

      $("#timer").html(min+"m " + sec+"s");
      if(min == 0 && sec == 0) {
        for (var i = 0; i < timerIDs.length; i++) {
          clearInterval(timerIDs[i]);
        }
        timerIDs = [];      
        $('.timer').css('background-color','red');
        var actNav = [
          {
            actItem: "Stop Alarm",
            actId: "stopalarm-button"
          }
        ]
        Session.set("actInfo", actNav);
      }
    }
  }

  function startTimer()
  {
    if (Session.get("timerMode") === "work") {
      sec = 10;
      min = 00;
    } else if (Session.get("timerMode") === "break") {
      sec = 05;
      min = 00;
    }
    $("#startreset-button").html("<p>Reset</p>");
    $("#startreset-button").hammer().off('tap');
    $("#startreset-button").hammer().on('tap', resetTimer);
    timerID = setInterval(countDown, 1000 );
    timerIDs.push(timerID);
  }

  function resetTimer()
  {
    console.log("timer" + timerIDs);
    console.log("pause" + pauseTimerIDs);
    if(Session.equals("timerMode","work")) {
      sec = 10;
      min = 00;
      $("#timer").html("00m 10s");
    } else {
      sec = 05;
      min = 00;
      $("#timer").html("00m 05s");
    }
    
    pauseSec = 00;
    pauseMin = 3;
    for (var i = 0; i < timerIDs.length; i++) {
      clearInterval(timerIDs[i]);
    }
    timerIDs = [];
    for (var j = 0; j < pauseTimerIDs.length; j++) {
      clearInterval(pauseTimerIDs[j]);
    }
    pauseTimerIDs = [];
    $("#startreset-button").html("<p>Start</p>");
    $("#startreset-button").hammer().off('tap');
    $("#startreset-button").hammer().on('tap', startTimer);
    $("#pauseresume-button").html("<p>Pause (3:00)</p>");
    $("#pauseresume-button").hammer().off('tap');
    $("#pauseresume-button").hammer().on('tap', pauseTimer);
  }

  function pauseTimer()
  {
    if (timerIDs.length !== 0) {
      for (var i = 0; i < timerIDs.length; i++) {
        clearInterval(timerIDs[i]);
      }
      timerIDs = [];
      if (pauseSec < 10 && String(pauseSec).length < 2) pauseSec = "0" + pauseSec;
      $("#pauseresume-button").html("<p>Resume ("+ pauseMin+":"+pauseSec + ")</p>");
      $("#pauseresume-button").hammer().off('tap');
      $("#pauseresume-button").hammer().on('tap', resumeTimer);

      pauseTimerID = setInterval( function() {
        if (pauseMin == 0 && pauseSec == 0) {
          resumeTimer();
        }
        else {
          pauseMin = (pauseSec == 0) ? pauseMin-1 : pauseMin;
          pauseSec = (pauseSec > 0) ? pauseSec-1 : 59;

          if (pauseSec < 10) pauseSec = "0" + pauseSec;

          $("#pauseresume-button").html("<p>Resume ("+ pauseMin+":"+pauseSec + ")</p>");
        }
      }, 1000);
      pauseTimerIDs.push(pauseTimerID);
    }
  }

  function resumeTimer() {
    for (var j = 0; j < pauseTimerIDs.length; j++) {
      clearInterval(pauseTimerIDs[j]);
    }
    pauseTimerIDs = [];
    timerID = setInterval(countDown, 1000);
    timerIDs.push(timerID);
    $("#pauseresume-button").html("<p>Pause ("+ pauseMin+":"+pauseSec + ")</p>")
    $("#pauseresume-button").hammer().off('tap');
    $("#pauseresume-button").hammer().on('tap', pauseTimer);
  }
}