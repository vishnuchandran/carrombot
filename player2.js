      var io = require('socket.io-client');
      var socket = io('http://10.7.90.8:4000');
      var connctionData = {"playerKey":"Basw3eDrFT", "gameKey":"alfr3EDLGT51WSxd39tG"};
      
      socket.on('connect', function(data) {
        socket.emit('connect_game',connctionData);
        
      });

      socket.on('connect_game', function(data) {
        
        console.log(data);
      });

      socket.on('your_turn', function(data) {
        //193.5484 -To- 806.4516
        console.log(data);
        var move = {position: Math.floor((Math.random() * 806.4516) + 193.5484), force: Math.floor((Math.random()*10000)+200), angle: Math.floor((Math.random() * 180) + 0)};
        console.log(move);
        socket.emit('player_input',move);
      });
      socket.on('opponent_turn', function(data) {
        
        console.log(data);
      });
      socket.on('player_input', function(data) {
        
        console.log(data);
      });

   