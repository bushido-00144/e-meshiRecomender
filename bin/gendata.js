/**
 * Created by bushido on 2017/07/25.
 */
let models = require('../models');
let CollaborativeFiltering = require('../lib/collaborativefiltering');

let pickupTag = () => {
  return models.Tag.findAll().then((res) => {
    return res;
  });
};

let genTags = () => {
  let tags = [
    'ラーメン',
    'うどん',
    '食堂',
    '牛丼',
    'カレー'
  ];
  let tasks = [];
  for(let tag of tags) {
    tasks.push(models.Tag.create({Tag: tag}));
  }
  Promise.all(tasks).then((res) => {
    console.log('Created Tags');
  }).catch((err) => {
    console.log(err);
  });
};

let genUsers = (userNum) => {
  let createUserTasks = [];
  for(let i=65;i<65+userNum;i++) {
    createUserTasks.push(models.User.create({
      Name: 'user' + String.fromCharCode(i),
      Tag: ''
    }));
  }
  Promise.all(createUserTasks).then(()=> {
    console.log('Created Users');
  }).catch((err) => {
    console.log(err);
  });
};

let genReviews = () => {
  Promise.all([
    models.User.findAll(),
    models.Restaurant.findAll()
  ]).then((datas) => {
    return {
      Users: datas[0],
      Restaurants: datas[1]
    };
  }).then((datas) => {
    let tasks = [];
    for(let user of datas.Users) {
      for(let restaurant of datas.Restaurants) {
        if(Math.floor(Math.random() * 11 + 1) % 2 === 1) {
          tasks.push(models.Review.create({
            RestaurantID: restaurant.id,
            Reviewer: user.id,
            Comprehensive: CollaborativeFiltering.generateReview(),
            Taste: CollaborativeFiltering.generateReview(),
            Service: CollaborativeFiltering.generateReview()
          }));
        }
      }
    }
    Promise.all(tasks).then(() => {
      console.log('Created Review Datas');
    }).catch((err) => {
      console.log(err);
    });
  })
};

let main = () => {
  let args = process.argv;
  switch (args[2]) {
    case '-u':
      genUsers(Number(args[3]));
      break;
    case '-r':
      genReviews();
      break;
    case '-t':
      genTags();
      break;
  }
};

models.sequelize.sync().then(() => {
  main();
}).catch((err) => {
  console.log(err);
})