Template.register.created = function() {
  var signupNav = [
    {
      navItem: "<i class=\"icon-chevron-left\"></i>",
      navClass: "navleft"
    }, {
      navItem: "<h1>Create account</h1>",
      navClass: "navtitle"
    }, {
      navItem: "",
      navClass: "navright empty"
    }
  ];
  Session.set("navInfo", signupNav);
  // setup nav links
  Template.navbar.events ({
    'click .navleft': function(e, templ) {
      Meteor.Router.to('/');            
    } 
  });
}

Template.register.events({
  'click #signup': function(e, templ) {
    e.preventDefault();
    var options = {
      username: $("#username").val(),
      password: $("#password").val(),
    }
    var confirm = $("#confirm").val();
    if (confirm === options.password) {
      Accounts.createUser(options, function(err) {
        if (err) {
          // error handling
        } else {
          // login user
          Meteor.loginWithPassword(options.username, options.password, function(err) {
            if (err) {
              // error handling
            } else {
              // redirect to homepage
              Meteor.Router.to('/');            
            }
          });
        }
      });
    } else {
      // TODO: passwords did not match handling
    }
  }
});