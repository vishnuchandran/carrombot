      const io = require('socket.io-client');
      const socket = io('http://10.7.90.8:4000');
      const connctionData = { "playerKey": "", "gameKey": "alfr3EDLGT51WSxd39tG" };

      //connection
      socket.on('connect', function(data) {
        socket.emit('connect_game', connctionData);
      });


      socket.on('connect_game', function(data) {
        console.log(data);
      });


      socket.on('your_turn', function(data) {
        console.log(data);
        // let coin_positions = data;
        var move = {
          position: Math.floor((Math.random() * 806.4516) + 193.5484),
          force: 2000,
          angle: Math.floor((Math.random() * 180) + 0)
        };
        console.log(move);
        socket.emit('player_input', move);
      });



      socket.on('opponent_turn', function(data) {
        console.log(data);
      });



      socket.on('player_input', function(data) {
        console.log(data);
      });
