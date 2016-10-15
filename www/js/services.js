angular.module('dywthm.services', [])

.factory('Dolls', function() {
  var dolls = [{
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
      return dolls;
    },
    get: function(id) {
      for (i = 0; i < dolls.length; i++) {
        if (dolls[i].id == id){
          return dolls[i];
        }
      }
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
      for (i = 0; i < dolls.length; i++) {
        total["daily"] += dolls[i]["daily"];
        total["monthly"] += dolls[i]["monthly"];
        total["yearly"] += dolls[i]["yearly"];
        total["lifetime"] += dolls[i]["lifetime"];
        total["hours"] += dolls[i]["hours"];
      }
      total["avg"] = parseFloat(total["lifetime"])/parseFloat(total["hours"]);
      total["avg"] = Number(total["avg"]).toFixed(1);
      return total;
    }
  };
});
