/**
 * Created by bushido on 2017/07/24.
 */
'use strict';

let generateTagData = (len) => {
  let tags = [];
  for(let i=0;i<len;i++) {
    let tmp = Math.floor(Math.random() * 11 + 1);
    tags.push(tmp % 2);
  }
  return tags;
};

let getSimilarity = (vec1, vec2) => {
  let sim = 0;
  for(let i=0;i<vec1.length;i++) {
    if(vec1[i] === vec2[i])
      sim++;
  }
  return sim;
};

let recommend = (recipient, restaurants) => {
  if(!recipient.Tag) return [];
  let recipientTags = JSON.parse(recipient.Tag);
  let result = [];
  for(let restaurant of restaurants) {
    let sim = getSimilarity(recipientTags, JSON.parse(restaurant.Tag));
    if(sim > 0) {
      result.push({
        name: restaurant.Name,
        score: sim
      });
    }
  }
  return result;
};

module.exports = {
  generateTagData: generateTagData,
  getSimilarity: getSimilarity,
  recommend: recommend
};

