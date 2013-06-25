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
    if(Session.equals("autoStart", true)) {
      Session.set("autoStart", false);
      startTimer();
    }
  }

  $('.timer').innerHeight($(window).height() - $('.navbar').innerHeight() - $('.mode-select').innerHeight() - $('.name').innerHeight() - $('.big-actbar').innerHeight() - $('.timer-context').innerHeight());

  $('.navleft').hammer().on('tap', function(e) {
    if ($('#timer-elements').css('visibility') === 'visible') {
      for (var i = 0; i < timerIDs.length; i++)
        clearInterval(timerIDs[i]);
      timerIDs = [];
      for (var j = 0; j < pauseTimerIDs.length; j++)
        clearInterval(pauseTimerIDs[j]);
      pauseTimerIDs = [];
      Meteor.Router.to('/task/' + Session.get("currentTask"));
    } else {
      var details = $('#pomodoro-details').val();
      var date = $('#date').val();
      var time = $('#time').val();
      var location = $('#location').val();
      //TODO: popup to prevent accidentally discarding pomodoro
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
      Session.set("timerMode", "work");
      resetTimer();
      Meteor.defer(function() {
        $('.timer').css('background-color', 'white');
        $('#newpomodoro-elements').css('visibility', 'hidden');
        $('#timer-elements').css('visibility', 'visible');
        $("#startreset-button").hammer().off('tap');
        $("#startreset-button").hammer().on('tap', startTimer);
      });
    }
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
    soundManager.pause('alarm');
    var task_id = Session.get("currentTask");
    if (Session.equals("timerMode","work")) {
      $('#timer-elements').css('visibility', 'hidden');
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

      $("#timer").html(min+":"+sec);
      if(min == 0 && sec == 0) {
        for (var i = 0; i < timerIDs.length; i++) {
          clearInterval(timerIDs[i]);
        }
        timerIDs = [];  
        soundManager.play('alarm', {from: 0});
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
      sec = 00;
      min = 25;
      soundManager.play('alarm');
      soundManager.pause('alarm');
    } else if (Session.get("timerMode") === "break") {
      sec = 00;
      min = 05;
      soundManager.play('alarm');
      soundManager.pause('alarm');
      var actNav = [
          {
            actItem: "Enjoy Your Break!",
            actId: "break-message"
          }
        ]
        Session.set("actInfo", actNav);
    }
    $("#startreset-button").html("<p>Reset</p>");
    $("#startreset-button").hammer().off('tap');
    $("#startreset-button").hammer().on('tap', resetTimer);
    timerID = setInterval(countDown, 1000 );
    timerIDs.push(timerID);
  }

  function resetTimer()
  {
    if(Session.equals("timerMode","work")) {
      sec = 00;
      min = 25;
      $("#timer").html("25:00");
    } else {
      sec = 00;
      min = 05;
      $("#timer").html("05:00");
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
    soundManager.play('alarm');
    soundManager.pause('alarm');
    timerID = setInterval(countDown, 1000);
    timerIDs.push(timerID);
    $("#pauseresume-button").html("<p>Pause ("+ pauseMin+":"+pauseSec + ")</p>")
    $("#pauseresume-button").hammer().off('tap');
    $("#pauseresume-button").hammer().on('tap', pauseTimer);
  }
}