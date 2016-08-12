import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';

import { Groups } from '/imports/api/groups/groups.js';

import moment from 'moment';
import randomColor from 'randomcolor';

import Chart from 'chart.js';

import './leaderboard.html';

Template.leaderboard.onCreated(() => {
    let instance = Template.instance();
    instance.data.graphUpdate = new Tracker.Dependency;
    instance.autorun(() => {
      let groupId = FlowRouter.getParam('id');
      instance.subscribe('userData', groupId);
      instance.subscribe('groups.id', groupId);
      instance.data.group = Groups.findOne();
    });

    instance.autorun(() => {
      //loop over history and build out the stats
      if (Groups.findOne()) {
        console.log('updating stats');
        let stats = {}, lastDate;
        if (instance.subscriptionsReady()) {
        Groups.findOne().members.forEach((user) => {
          stats[user.id] = {
            name: Meteor.users.findOne({_id: user.id}).profile.name,
            beers: {},
            points: [0]
          }
        })
        Groups.findOne().history.map((history) => {
          if (history.winningUser && history.winningUser.length === 1) {
            return {
              user: history.winningUser[0],
              beer: history.winningBeer.name,
              date: history.date
            }
          }
          return {
            date: history.date
          };
        }).forEach((history) => {
          if (history.hasOwnProperty('beer')) {
            stats[history.user].beers[history.beer] = (stats[history.user].beers[history.beer] || 0) + 1;
            Object.keys(stats).forEach((user) => {
              let lastScore = stats[user].points[stats[user].points.length-1];
              if (user === history.user) {
                stats[user].points.push(lastScore+1);
              } else {
                stats[user].points.push(lastScore);
              }
            })
          } else {
            Object.keys(stats).forEach((user) => {
              let lastScore = stats[user].points[stats[user].points.length-1];
              stats[user].points.push(lastScore)
            })
          }
        });
        instance.data.stats = stats;
        instance.data.graphUpdate.changed();
      }
    }
  })
});

Template.leaderboard.onRendered(() => {
  let instance = Template.instance();
  //make the graph
  instance.autorun(() => {
    instance.data.graphUpdate.depend();
    if (instance.data.stats) {
      let canvas = $('#pointsGraph');
      let datasets = Object.keys(instance.data.stats).map((stats) => {
        stats = instance.data.stats[stats];
        let color = randomColor();
        return {
          yAxisID: 'y-axis-1',
          label: stats.name,
          data: stats.points,
          fill: false,
          borderColor: color,
          backgroundColor: color,
          lineTension: 0.2
        }
      });

      let labels = instance.data.group.history.map((history) => {
        return moment(history.date).format('MMM DD');
      });
      labels.splice(0, 0, moment(instance.data.group.history[0].date).format('MMM DD'));

      let graph = new Chart(canvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          title: {
            display: true,
            text: 'Victory Point Timeline',
          },
          stacked: true,
          scales: {
            yAxes: [{
              id: 'y-axis-1', type: 'linear', display: true, ticks: {min: 0, max: instance.data.group.points.seasonWinPoints, maxTicksLimit: instance.data.group.points.seasonWinPoints}
            }]
          }
        }
      });
    }
  })
//  let instance = Template.instance();
//  instance.autorun(() => {
//    if (instance.data.stats) {
//    let datasets = Object.keys(instance.data.stats).map((stats) => {
//      return {
//        label: stats.name,
//        data: stats.points
//      }
//    });
//
//    let graph = new Chart(canvas, {
//      type: 'line',
//      data: {
//        labels: [1, 2, 3, 4],
//        datasets: datasets
//      }
//    });
//  }
//  });
});

Template.leaderboard.helpers({
  sortedMembers() {
    let instance = Template.instance();
    let users = instance.data.group.members;

    users.sort((user1, user2) => {
      return user2.points - user1.points;
    });

    return users.map((user) => {
      let userRecord = Meteor.users.findOne({_id: user.id});
      return Object.assign({}, user, userRecord);
    });
  },
  stats(user, item, def) {
    let stats = Template.instance().data.stats[user._id];
    try {
      if (item === 'beer') {
//        console.log(stats);
        return Object.keys(stats.beers).reduce((beer1, beer2) => {
          if (typeof beer1 === 'string') {
            beer1 = [beer1];
          }
          let count = stats.beers[beer1[0]], beer2Count = stats.beers[beer2];
          if (beer2Count === count) {
             beer1.push(beer2);
             return beer1;
          } else if (beer2Count > count) {
            return [beer2];
          } else {
            return beer1;
          }
        });
      }
    } catch (e) {
      return def;
    }
    return def;
  }
});
