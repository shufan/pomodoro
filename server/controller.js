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
  updateTask: function(id, name, tags, expected, completed, finished) {
    console.log("EDITING TASK INFO");
    var query = {_id: id};
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
  updateTaskPlans: function(id, planned, completed) {
    console.log("EDITING TASK PLANS");
    var query = {task_id: id};
    var partialUpdate = {$set: {}};
    if (planned != undefined) {
      partialUpdate['$set'].planned = planned;
    }
    if(completed != undefined) {
      partialUpdate['$set'].completed = completed;
    }
    return Planned.update(query, partialUpdate);
  }
});