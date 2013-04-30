Meteor.Router.add({
  // all views are routed to from here
  '/': function() {
    if(Meteor.user()) {
      Session.setDefault("homePane", "tasks");
    }
    return 'home'
  },
  '/tasks': function() {
    Session.set("homePane", "tasks");
    return 'home'
  },
  '/completed': function() {
    Session.set("homePane", "completed");
    return 'home'
  },
  '/task/:id': function(id) {
    Session.set("currentTask", id);
    return 'task'
  },
  '/plan': 'plan',
  '/breaktimer': function() {
    Session.set("timerMode", "break");
    return 'timer'
  },
  '/worktimer': function() {
    Session.set("timerMode", "work");
    return 'timer'
  },
  '/timer': function() {
    return 'timer'
  },
  '/register': 'register',
  '/manualnewpomodoro': 'manualnewpomodoro',
  '/editpomodoro/:id': function(id) {
    Session.set("currentPomodoro", id);
    return 'editpomodoro'
  },
  '/profile': function() {
    Session.setDefault("graphperiod", "7");
    return'profile'
  },
  '/newtask': 'newtask',
  '/edittask': 'edittask'
});