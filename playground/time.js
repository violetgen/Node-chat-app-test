const moment = require('moment');

var date = moment();
date.add(1, 'year');

console.log(date.format('MMM Do, YYYY, h:mm:ss a'));

var someTimeStamp = moment().valueOf();
console.log(someTimeStamp);