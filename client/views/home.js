Template.loggedOut.events({
  'click #login': function(e, templ) {
    e.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();
    Meteor.loginWithPassword(username, password, function(err) {
      if (err) {
        // error handling
        console.log(err);
      } else {
        // show an alert
      }
    });
  },
});

Template.home.todayList = function() {
  if (Session.get("homePane") === "today") {
    return true;
  }
}