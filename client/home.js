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

  'click #signup-link': function(e, templ) {
    var signupNav = [
      {
        navItem: "<a href=\"/\">\<</a>",
        navClass: "navleft"
      }, {
        navItem: "<h1>Create account</h1>",
        navClass: "navtitle"
      }, {
        navItem: "",
        navClass: "navright empty"
      }
    ]
    Session.set("navInfo", signupNav);
  }
});