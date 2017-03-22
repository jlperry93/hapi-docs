var fs = require('fs');

var CardStore = {};

CardStore.cards = {};

CardStore.initialize = function () {
    CardStore.cards = loadCards();
};

function loadCards () {
    //allows fs to read cards asynchronously
    var file = fs.readFileSync('./cards.json');
    return JSON.parse(file.toString());
}

module.exports = CardStore;