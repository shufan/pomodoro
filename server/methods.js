Meteor.methods({
  addTask: function(name, tags, expected, completed) {
    console.log("ADDING TASK");
    var task_id = Tasks.insert({
      user: Meteor.user().username,
      name: name,
      tags: tags,
      expected: expected,
      completed: completed,
      finished: false
    });
    Planned.insert({
      task_id: task_id,
      planned: 0,
      completed: 0
    });
    return task_id;
  },
  updateTask: function(task_id, name, tags, expected, completed, finished) {
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
    if(completed != undefined) {
      partialUpdate['$set'].completed = completed;
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
  updateTaskPlans: function(task_id, planned, completed) {
    console.log("EDITING TASK PLANS");
    var query = {task_id: task_id};
    var partialUpdate = {$set: {}};
    if (planned != undefined) {
      partialUpdate['$set'].planned = planned;
    }
    if(completed != undefined) {
      partialUpdate['$set'].completed = completed;
    }
    return Planned.update(query, partialUpdate);
  },
  deleteTaskPlans: function(task_id) {
    console.log("DELETING TASK PLANS");
    var query = {task_id: task_id};
    return Planned.remove(query);
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