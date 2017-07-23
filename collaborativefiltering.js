'use strict';
let generateReview = () => {
    return Math.floor(Math.random() * 6 * 10) / 10;
};

let generateData = (itemNum, userNum) => {
    let model = {};
    for(let i=65;i<65+userNum;i++) {
        let userName = "user" + String.fromCharCode(i);
        model[userName] = {};
        for(let j=65;j<65+itemNum;j++) {
            let itemName = "item" + String.fromCharCode(j);
            model[userName][itemName] = generateReview();
            if(model[userName][itemName] <= 0) {
                delete model[userName][itemName];
            }
        }
    }
    return model;
};

/*
 * 類似度計算：ピアソン相関関数
 */
let getSimilarity = (userX, userY) => {
    // 共通して評価したアイテムの抽出
    let commonItems = [];
    for(let item in userX) {
        if(userY.hasOwnProperty(item))
            commonItems.push(item);
    }
    if(commonItems.length === 0) return 0;

    // レビュー値の合計
    let userXReviewSum = 0;
    let userYReviewSum = 0;
    for(let item of commonItems) {
        userXReviewSum += userX[item];
        userYReviewSum += userY[item];
    }

    // 評価の平方の計算
    let userXReviewPow = 0;
    let userYReviewPow = 0;
    for(let item of commonItems) {
        userXReviewPow = userX[item] * userX[item];
        userYReviewPow = userY[item] * userY[item];
    }

    // 積の計算
    let reviewProduct = 0;
    for(let item of commonItems) {
        reviewProduct += userX[item] * userY[item];
    }

    // スコアの計算
    let num = reviewProduct - (userXReviewSum * userYReviewSum / commonItems.length);
    let den = Math.sqrt((userXReviewPow - Math.pow(userXReviewSum, 2) / commonItems.length) * (userYReviewPow - Math.pow(userYReviewSum, 2) / commonItems.length));
    if(den === 0) return 0;

    return num / den;
};

let recommend = (recipient, others) => {
    let estimatedReview = {};
    let similarSum = {};
    for(let other in others) {
        // otherが評価していてrecipientが評価していない項目の抽出
        let unReviewItems = [];
        for(let item in others[other]) {
            if(!recipient.hasOwnProperty(item)) {
                unReviewItems.push(item);
            }
        }

        // recipientとotherの類似度計算
        let sim = getSimilarity(recipient, others[other]);

        // 未評価アイテムのrecipientの評価推測
        for(let item of unReviewItems) {
            estimatedReview[item] = estimatedReview[item] + (others[other][item] * sim) || 0;
            similarSum[item] = similarSum[item] + sim || 0;
        }
    }

    let recommendScores = {};
    for(let item in estimatedReview) {
        recommendScores[item] = estimatedReview[item] / similarSum[item];
    }
    return recommendScores;
};

/*
 * ユーザと評価アイテムの生成とランダム評価
 */
/*
const itemNum = 10;
const userNum = 5;

let model = generateData(itemNum, userNum);
let users = [];
for(let user in model) {
    users.push(user);
}

let items = [];
for(let item in model[users[0]]) {
    items.push(item);
}
*/

/*
 * 被推薦者のレビュー作成
 * ランダムにitemsからピックアップし、それらを評価する
 */
let generateRecipientData = (items) => {
    let recipientReview = {};
    let pickupedItem = [];
    let pickupNum = Math.floor(Math.random() * Math.floor(items.length * 0.8) + Math.floor(items.length * 0.4));
    for(let i=0;i<pickupNum;i++) {
        let picked = items[Math.floor(Math.random() * items.length)];
        while(pickupedItem.indexOf(picked) !== -1) {
            picked = items[Math.floor(Math.random() * items.length)];
        }
        pickupedItem.push(picked);
        recipientReview[picked] = generateReview();
        if(recipientReview[picked] <= 0) {
            delete recipientReview[picked];
        }
    }
    return recipientReview;
};

module.exports = {
    generateData: generateData,
    generateReview: generateReview,
    recommend: recommend,
    generateRecipientData: generateRecipientData
};
