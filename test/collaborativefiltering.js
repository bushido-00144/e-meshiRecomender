/**
 * Created by bushido on 2017/07/23.
 */
let CollaborateFiltering = require('../lib/collaborativefiltering');

let othersData = CollaborateFiltering.generateData(10, 20);

let users = [];
for(let user in othersData) {
    users.push(user);
}
let items = [];
for(let item in othersData[users[0]]) {
    items.push(item);
}

let recipientData = CollaborateFiltering.generateRecipientData(items);

let recommendItems = CollaborateFiltering.recommend(recipientData, othersData);
console.log(othersData);
console.log(recipientData);
console.log(recommendItems);
