function pomodorosPerDay(period) {
  //initialize data
  var data = {};
  var dataArray = [];
  for (var i = period-1; i >= 0; i--) {
    console.log(moment().subtract('days', i).format('YYYY[-]MM[-]DD'));
    data[moment().subtract('days', i).format('YYYY[-]MM[-]DD')] = 0;
  }
  var usertasks = [];
  var user = Meteor.user().username;
  var tasks = Tasks.find({user: user}).forEach(function(task) {
    usertasks.push(task._id);
  });
  var query = {$where: function() { return moment(this.date, 'YYYY[-]MM[-]DD').diff(moment().subtract('days', period), 'days') < period && moment(this.date, 'YYYY[-]MM[-]DD').diff(moment().subtract('days', period), 'days') > 0}};
  var pomodoros = Pomodoros.find(query).forEach(function(pomodoro) {
    if (usertasks.indexOf(pomodoro.task_id) >= 0) {
      if (data[pomodoro.date] == undefined) {
        data[pomodoro.date] = 1;
      } else {
        data[pomodoro.date] += 1;
      }
    }
  });
  $.each(data, function(date, count) {
    dataArray.push({date: date, count: count});
  })
  console.log(dataArray);
  return dataArray;
}

Template.profile.created = function() {
  var taskNav = [
    {
      navItem: "<i class=\"icon-chevron-left\"></i>",
      navClass: "navleft"
    }, {
      navItem: "<h1>"+Meteor.user().username+"'s Profile</h1>",
      navClass: "navtitle"
    }, {
      navItem: "",
      navClass: "navright empty"
    }
  ]
  Session.set("navInfo", taskNav);
}

Template.profile.rendered = function() {
  var data = pomodorosPerDay(parseInt(Session.get("graphperiod")));
  var barWidth;
  var width;
  if (Session.equals("graphperiod", "7")) {
    barWidth = 36;
    width = (barWidth + 10) * data.length;
  } else {
    barWidth = 10.5;
    width = (barWidth + .5) * data.length;
  }
  var height = 180;
  var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
  var y = d3.scale.linear().domain([0, d3.max(data, function(d) { return d.count; })]).
  rangeRound([0, height]);
  var chart = d3.select(".chart-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height + 20);
  // draw bars
  chart.selectAll("rect").data(data)
  .enter()
  .append("rect")
  .attr("x", function(d, i) { return x(i); })
  .attr("y", function(d) { return height - y(d.count); })
  .attr("height", function(d) { return y(d.count); })
  .attr("width", barWidth)
  .attr("fill", "#2d578b");
  // draw text
  chart.selectAll("text").data(data)
  .enter()
  .append("text")
  .attr("x", function(d, i) { return x(i) + barWidth; })
  .attr("y", function(d) { return height - y(d.count); })
  .attr("dx", -barWidth/2)
  .attr("dy", "1.2em")
  .attr("text-anchor", "middle")
  .text(function(d) { return d.count; })
  .attr("fill", "white");
  // draw axis labels
  if(Session.equals("graphperiod", "7")) {
    chart.selectAll("text.xAxis")
    .data(data)
    .enter().append("text")
    .attr("x", function(d, i) { return x(i) + barWidth; })
    .attr("y", height)
    .attr("dx", -barWidth/2)
    .attr("text-anchor", "middle")
    .text(function(d) { return moment(d.date, 'YYYY[-]MM[-]DD').format('ddd');})
    .attr("style", "font-size: 12; font-family: Roboto, sans-serif; color; black")
    .attr("transform", "translate(0, 18)")
    .attr("class", "xAxis");
  } else {
    chart.selectAll("text.xAxis")
    .data(data)
    .enter().append("text")
    .attr("x", function(d, i) { return x(i) + barWidth; })
    .attr("y", height)
    .attr("dx", -barWidth/2)
    .attr("text-anchor", function(d,i) {
      if (i == 0) {
        return "start";
      } else if (i == 30) {
        return "end";
      } else {
        return "middle"
      }
    })
    .text(function(d,i) 
      { if (i%15 == 0) { 
        return moment(d.date, 'YYYY[-]MM[-]DD').format('M[/]D'); 
      } else { 
        return ''; 
      } 
    })
    .attr("style", "font-size: 12; font-family: Roboto, sans-serif; color; black")
    .attr("transform", "translate(0, 18)")
    .attr("class", "xAxis");
  }

  chart.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", height)
  .attr("width", width)
  .style("stroke", "black")
  .style("fill", "none")
  .style("stroke-width", 1);

  $('.navleft').hammer().on('tap', function(e) {
    Meteor.Router.to('/');
  })

  $('.week-tab').hammer().on('tap', function(e) {
    Session.set("graphperiod", "7");
  });

  $('.month-tab').hammer().on('tap', function(e) {
    Session.set("graphperiod", "31");
  });
}

Template.basicStats.pomodoroCount = function(period) {
  var usertasks = [];
  var user = Meteor.user().username;
  var count = 0;
  var tasks = Tasks.find({user: user}).forEach(function(task) {
    usertasks.push(task._id);
  });
  var query = {$where: function() { return moment(this.date, 'YYYY[-]MM[-]DD').diff(moment().subtract('days', period), 'days') < period}};
  var pomodoros = Pomodoros.find(query).forEach(function(pomodoro) {
    if (usertasks.indexOf(pomodoro.task_id) >= 0) {
      count ++;
    }
  });
  return count;
}

Template.basicStats.weekmode = function() {
  return Session.equals("graphperiod", "7");
}