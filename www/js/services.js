angular.module('dywthm.services', [])

.factory('Database', function() {
  function getPlushes(callback){
    var db = window.sqlitePlugin.openDatabase({ name: 'dywthm.db', location: 'default' }, function (db) {
      var query = 'SELECT * FROM plushes';
      var plushes = {};
      db.executeSql(query, [], function (selectRes){
        console.log("Executing Query");
        if (selectRes.rows.length < 0){
            callback([]);
            console.log('No Plushes Registered');
        } else {
          for (var i = 0; i < selectRes.rows.length; i++){
            var plush = {
              id: i,
              plushid : selectRes.rows.item(i).plushid,
              name: selectRes.rows.item(i).name,
              img: selectRes.rows.item(i).img,
              type: selectRes.rows.item(i).type
            };
            plushes.push(plush);
          }
          callback(plushes);
        }
      });
    });
  }
  function getPresses(callback){
    var db = window.sqlitePlugin.openDatabase({ name: 'dywthm.db', location: 'default' }, function (db) {
      var query = 'SELECT * FROM presses';
      var presses = {};
      db.executeSql(query, [], function (selectRes){
        console.log("Executing Query");
        if (selectRes.rows.length < 0){
            callback([]);
            console.log('No Presses Registered');
        } else {
          for (var i = 0; i < selectRes.rows.length; i++){
            var press = {
              id: i,
              plushid : selectRes.rows.item(i).plushid,
              date: selectRes.rows.item(i).date
            };
            presses.push(press);
          }
          callback(presses);
        }
      });
    });
  }
  function getUser(callback){
    var userData;

    var db = window.sqlitePlugin.openDatabase({ name: 'dywthm.db', location: 'default' }, function (db) {

      db.executeSql('SELECT * FROM user', [], function(res){
        console.log('Getting User Data');
        callback(res.rows.item(0));
      },function (error) {
        console.log('transaction error: ' + error.message);
      });

    }, function (error) {
      console.log('Open database ERROR: ' + JSON.stringify(error));
    });
  }
  return {

    getUser: function (callback){
      getUser(callback);
    },
    getPlushes: function(callback){
      getPlushes(callback);
    },
    getPresses: function(callback){
      getPresses(callback)
    },
    logout: function (callback){
      var db = window.sqlitePlugin.openDatabase({ name: 'dywthm.db', location: 'default' }, function (db) {
        db.executeSql('DELETE FROM user');
        db.executeSql('DELETE from plushes');
        db.executeSql('DELETE from presses');
        callback();
      });
    },
    checkLogin: function (callback){
      document.addEventListener('deviceready', function() {
        var db = window.sqlitePlugin.openDatabase({ name: 'dywthm.db', location: 'default' }, function (db) {

          db.executeSql('CREATE TABLE IF NOT EXISTS user (username, password, name)');
          db.executeSql('SELECT * FROM user', [], function (res){
              if (navigator.connection.type == Connection.NONE){
                callback(0);
              } else if (res.rows.length > 0){
                callback(1);
              } else {
                callback(2);
              }
            }, function (error) {
            console.log('transaction error: ' + error.message);
          })
        }, function (error) {
          console.log('Open database ERROR: ' + JSON.stringify(error));
        });
      });
    }
  }
})

.factory('Sync', function($http) {
  var link = 'https://sarick.tech:3000';
  return {
    now: function(callback) {
      var db = window.sqlitePlugin.openDatabase({ name: 'dywthm.db', location: 'default' }, function (db) {

        db.executeSql('SELECT * FROM user', [], function (res){

          var data = {
            user:res.rows.item(0)['username'],
            pass:res.rows.item(0)['password'],
            func:"get-data"
          }

          $http.post(link, data).then(function (response){

              document.addEventListener('deviceready', function() {
                var db = window.sqlitePlugin.openDatabase({ name: 'dywthm.db', location: 'default' }, function (db) {

                  db.transaction(function (tx) {
                    //CREATE TAG TABLE
                    tx.executeSql('CREATE TABLE IF NOT EXISTS plushes (id, plushid, name, img, type)');

                    tx.executeSql('DELETE FROM plushes');

                    //CREATE PANEL TABLE
                    tx.executeSql('CREATE TABLE IF NOT EXISTS presses (id, plushid, date)');

                    tx.executeSql('DELETE FROM panel');

                  }, function (error) {
                    console.log('clear - transaction error: ' + error.message);
                  }, function () {
                    console.log('clear - transaction ok');
                  });

                  db.transaction(function (tx) {
                    function contains(a, obj) {
                      var i = a.length;
                      while (i--) {
                       if (a[i][1] === obj) {
                         return true;
                       }
                      }
                      return false;
                    }
                    console.log("parsing response file");
                    var plushes = [];
                    var presses = [];
                    for (i = 0; i < response.data.length; i++){
                      presses.push([i, response.data[i]["plush_id"], response.data[i]["date"]]);
                      if (contains(plushes, response.data[i]["plush_id"]) === false){
                        plushes.push([i, response.data[i]["plush_id"], response.data[i]["plush_name"]]);
                      }
                    }
                    console.log("adding to plush database");
                    // PLUSHID!!!!
                    for (i = 0; i < plushes.length; i++){
                      tx.executeSql('INSERT INTO plushes (id, plushid, name, img, type) VALUES (' + i + ', ' + plushes[i][1] + ', ' + plushes[i][2] + ', "img/android.jpg","Android")');
                    }

                    console.log("adding to presses database");

                    for (i = 0; i < presses.length; i++){
                      tx.executeSql('INSERT INTO presses (id, plushid, date) VALUES (' + i + ', ' + presses[i][1] + ', ' + presses[i][2] + ')');
                    }



                    callback();

                  }, function (error) {
                    console.log('insert - transaction error: ' + error.message);
                  }, function () {
                    console.log('insert - transaction ok');
                  });

                }, function (error) {
                  console.log('Open database ERROR: ' + JSON.stringify(error));
                });
              });
            }, (function (res){
            console.log("sync - connection failed");
          }));
        });
      }, function (error) {
        console.log('Open database ERROR: ' + JSON.stringify(error));
      });
    },

    login: function(username, password, callback){

      var data = {
        user:username,
        pass:password,
        func:"user-auth"
      }

      $http.post(link, data).then(function (res){
        console.log ("server response:" + res.data['password']);

        if (res.data == "bad_credentials"){
          callback(2);

        } else {
          document.addEventListener('deviceready', function() {
            var db = window.sqlitePlugin.openDatabase({ name: 'dywthm.db', location: 'default' }, function (db) {

              db.transaction(function (tx) {
                tx.executeSql('DELETE FROM USER');
                tx.executeSql('INSERT INTO user (username, password, name) VALUES (?, ?, ?)',
                [username, password, res.data['name']]);

                callback(1);
              }, function (error) {
                console.log('transaction error: ' + error.message);
              }, function () {
                console.log('login - transaction ok');
              });
            }, function (error) {
              console.log('Open database ERROR: ' + JSON.stringify(error));
            });
          });
        }
      }, (function (res){
        console.log("login - connection failed");
        callback(0);
      }));
    },
    addPress: function(plushid, date, callback) {

        var db = window.sqlitePlugin.openDatabase({ name: 'dywthm.db', location: 'default' }, function (db) {

          db.executeSql('SELECT * FROM user', [], function (res){

            var data = {
              user:res.rows.item(0)['username'],
              pass:res.rows.item(0)['password'],
              func:"log-data",
              plush: plushid,
              date: date
            }

          $http.post(link, data).then(function (res){

            console.log(res.data);

            if (res.data == "success"){
              callback(true);
            } else {
              callback(false);
            }

          }, (function (res){
            console.log("add press - connection failed");
            callback(false);
          }));
        });
      }, function (error) {
        console.log('Open database ERROR: ' + JSON.stringify(error));
      });
    },
    addPlush: function(plushid, name, callback) {

        var db = window.sqlitePlugin.openDatabase({ name: 'dywthm.db', location: 'default' }, function (db) {

        db.executeSql('SELECT * FROM user', [], function (res){

          var data = {
            user:res.rows.item(0)['username'],
            pass:res.rows.item(0)['password'],
            func:"add-plush",
            nickname: name
          }

        $http.post(link, data).then(function (res){

          console.log(res.data);

          if (res.data == "success"){
            callback(true);
          } else {
            callback(false);
          }

        }, (function (res){
          console.log("add plush - connection failed");
          callback(false);
        }));
      });
      }, function (error) {
        console.log('Open database ERROR: ' + JSON.stringify(error));
      });
    },
    editPlush: function(plushid, name, callback) {

        var db = window.sqlitePlugin.openDatabase({ name: 'dywthm.db', location: 'default' }, function (db) {

        db.executeSql('SELECT * FROM user', [], function (res){

          var plushData = {
            plushid: plushid,
            name: name
          }

          var data = {
            user:res.rows.item(0)['username'],
            pass:res.rows.item(0)['password'],
            func:"edit-plush",
            parameter:JSON.stringify(plushData)
          }

        $http.post(link, data).then(function (res){

          console.log(res.data);

          if (res.data == "success"){
            callback(true);
          } else {
            callback(false);
          }

        }, (function (res){
          console.log("add plush - connection failed");
          callback(false);
        }));
      });
      }, function (error) {
        console.log('Open database ERROR: ' + JSON.stringify(error));
      });
    }
  }
})

.factory('Plushes', function(Database) {
  var plushes = [{
    "name": "Octobiwan",
    "id": 1,
    "type": "Octocat",
    "daily": 9,
    "monthly": 69,
    "yearly": 420,
    "lifetime": 1984,
    "hours": 173,
    "avg": 17.38,
    "img": "img/octobiwan.jpg"
  },{
    "name": "Domo Arigato",
    "id": 2,
    "type": "Android",
    "daily": 9,
    "monthly": 69,
    "yearly": 420,
    "lifetime": 1984,
    "hours": 173,
    "avg": 17.38,
    "img": "img/android.jpg"
  },{
    "name": "Octobiwan Kenobi",
    "id": 3,
    "type": "Octocat",
    "daily": 9,
    "monthly": 69,
    "yearly": 420,
    "lifetime": 1984,
    "hours": 173,
    "avg": 17.38,
    "img": "img/octobiwan.jpg"
  }];

  return {
    all: function() {
      return plushes;
    },
    get: function(id, callback) {
      Database.getPlushes(function (plushes) {
        for (var i = 0; i < plushes.length; i++) {
          if (plushes[i].id === parseInt(id)) {
            callback (plushes[i]);
          }
        }
      });
    },
    getAll: function(){
      var total = {
        "daily": 0,
        "monthly": 0,
        "yearly": 0,
        "lifetime": 0,
        "hours": 0,
        "avg": 0
      }
      for (i = 0; i < plushes.length; i++) {
        total["daily"] += plushes[i]["daily"];
        total["monthly"] += plushes[i]["monthly"];
        total["yearly"] += plushes[i]["yearly"];
        total["lifetime"] += plushes[i]["lifetime"];
        total["hours"] += plushes[i]["hours"];
      }
      total["avg"] = parseFloat(total["lifetime"])/parseFloat(total["hours"]);
      total["avg"] = Number(total["avg"]).toFixed(1);
      return total;
    }
  };
})
.factory('Presses', function(Database){
  return{
    get: function(id, callback) {
      Database.getPresses(function (presses) {
        for (var i = 0; i < presses.length; i++) {
          if (presses[i].id === parseInt(id)) {
            callback (presses[i]);
          }
        }
      });
    }
  }
});
