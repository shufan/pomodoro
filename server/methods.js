Meteor.methods({
  addTask: function(name, tags, expected) {
    console.log("ADDING TASK");
    var task_id = Tasks.insert({
      user: Meteor.user().username,
      name: name,
      tags: tags,
      expected: expected,
      today: false, 
      finished: false
    });
    return task_id;
  },
  updateTask: function(task_id, name, tags, expected, today, finished) {
    console.log("EDITING TASK INFO");
    var query = {_id: task_id};
    var partialUpdate = {$set: {}};
    if(name != undefined) {
      partialUpdate['$set'].name = name;
    }
    if(tags != undefined) {
      partialUpdate['$set'].tags = tags;
    }
    if(expected != undefined) {
      partialUpdate['$set'].expected = expected;
    }
    if(today != undefined) {
      partialUpdate['$set'].today = today;
    }
    if(finished != undefined) {
      partialUpdate['$set'].finished = finished;
    }
    return Tasks.update(query, partialUpdate);
  },
  deleteTask: function(task_id) {
    console.log("DELETING TASK");
    var query = {_id: task_id};
    return Tasks.remove(query);
  },
  addPomodoro: function(task_id, details, date, time, location) {
    console.log("ADDING POMODORO");
    var pomodoro_id = Pomodoros.insert({
      task_id: task_id,
      details: details,
      date: date,
      time: time,
      location: location,
    });
    return pomodoro_id;
  },
  updatePomodoro: function(pomodoro_id, details, date, time, location) {
    console.log("EDITING POMODORO");
    var query = {_id: pomodoro_id};
    var partialUpdate = {$set: {}};
    if (details != undefined) {
      partialUpdate['$set'].details = details;
    }
    if(date != undefined) {
      partialUpdate['$set'].date = date;
    }
    if(time != undefined) {
      partialUpdate['$set'].time = time;
    }
    if(location != undefined) {
      partialUpdate['$set'].location = location;
    }
    return Pomodoros.update(query, partialUpdate);
  },
  deletePomodoro: function(pomodoro_id) {
    console.log("DELETING POMODORO");
    var query = {_id: pomodoro_id};
    return Pomodoros.remove(query);
  },
  deletePomodorosForTask: function(task_id) {
    console.log("DELETING POMODOROS FOR TASK " + task_id);
    var query = {task_id: task_id};
    return Pomodoros.remove(query);
  }
});