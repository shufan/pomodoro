Template.register.events({
  'click #signup': function(e, templ) {
    e.preventDefault();
    var options = {
      username: $("#username").val(),
      password: $("#password").val(),
      email: $("#email").val()
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