function pomodorosPerDay(period) {
  var data = {};
  var user = Meteor.user().username;
  var query = {"user": user, $where: function() { return moment(this.date(), 'YYYY[-]MM[-]DD').diff(moment().subtract('days', period), 'days') <= 7}};
  var pomodoros = Pomodoros.find(query).forEach(function(pomodoro) {
    if(data[pomodoro.date] == undefined) {
      data[pomodoro.date] == 1;
    } else {
      data[pomodoro.date] += 1;
    }
  });
  return data;
}