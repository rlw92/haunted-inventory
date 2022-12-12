#! /usr/bin/env node

console.log('This script populates some items and item types to your database, needs to be rewritten to accomodate specific database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Itemtype = require('./models/itemtype')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var types = []


//reference genre create
function itemtypeCreate(name, cb) {
  var type = new Itemtype({ name: name });

  type.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item type: ' + type);
    types.push(type)
    cb(null, type);
  }   );
}

//reference bookcreate
function itemCreate(item_name,item_about,item_type,cb) {
  itemdetail = {
    item_name: item_name,
    item_about: item_about
  }
  if (item_type != false) itemdetail.item_type = item_type

  var item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}



function createItemtype(cb) {
    async.parallel([
        function(callback) {
          itemtypeCreate("Small", callback);
        },
        function(callback) {
          itemtypeCreate("Large", callback);
        },
        function(callback) {
          itemtypeCreate("Electronic", callback);
        }
        ],
        // optional callback
        cb);
}


function createItem(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Spooky Guitar', 'Found in an old abandoned music shop, owners have said they can hear the guitar playing by itself at night.', [types[0],], callback);
        },
        function(callback) {
          itemCreate("Terrifying Telescope", 'Look into the scope.....if you dare.',  [types[0],], callback);
        }
        ],
        // optional callback
        cb);
}




async.series([
    createItemtype,
    createItem

],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log("Yay");

    }
    // All done, disconnect from database
    mongoose.connection.close();
});
