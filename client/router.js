Meteor.Router.add({
  // all views are routed to from here
  '/': function() {
    if(Meteor.user()) {
      Session.setDefault("homePane", "today");
    }
    return 'home'
  },
  '/today': function() {
    Session.set("homePane", "today");
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
  '/register': 'register',
  '/newtask': 'newtask'
});