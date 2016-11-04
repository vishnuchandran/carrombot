var underscore = require('underscore');

var position = [{
  x: 156.2939902233383,
  y: 662.8344827548491,
  type: 'black',
  id: 'b1'
}, {
  x: 456.1228108124389,
  y: 906.0810688798821,
  type: 'black',
  id: 'b2'
}, {
  x: 252.3327396888363,
  y: 832.708831200797,
  type: 'black',
  id: 'b3'
}, {
  x: 191.671955726271,
  y: 434.8960516319604,
  type: 'black',
  id: 'b4'
}, {
  x: 204.2472734129694,
  y: 892.4433259029794,
  type: 'black',
  id: 'b5'
}, {
  x: 584.7399650840681,
  y: 875.8135315582253,
  type: 'black',
  id: 'b6'
}, {
  x: 749.248358811746,
  y: 747.6679559304782,
  type: 'black',
  id: 'b7'
}, {
  x: 900.8547107994918,
  y: 461.64517502755916,
  type: 'black',
  id: 'b8'
}, {
  x: 500.7555259268013,
  y: 962.9489331712384,
  type: 'black',
  id: 'b9'
}, {
  x: 25.037743210186505,
  y: 786.4121327140809,
  type: 'white',
  id: 'w1'
}, {
  x: 195.4683959181928,
  y: 837.2592766137087,
  type: 'white',
  id: 'w2'
}, {
  x: 185.47973136556544,
  y: 763.4760417737233,
  type: 'white',
  id: 'w3'
}, {
  x: 572.3854299583264,
  y: 763.9040309203285,
  type: 'white',
  id: 'w4'
}, {
  x: 427.4059593865227,
  y: 974.7844559891818,
  type: 'white',
  id: 'w5'
}, {
  x: 418.38523887464993,
  y: 683.7248343746195,
  type: 'white',
  id: 'w6'
}, {
  x: 860.0975149144288,
  y: 326.0678733384465,
  type: 'white',
  id: 'w7'
}, {
  x: 370.7206428508524,
  y: 907.7460567113744,
  type: 'white',
  id: 'w8'
}, {
  x: 707.1217830928895,
  y: 835.8315938529678,
  type: 'white',
  id: 'w9'
}, {
  x: 100.75165314856056,
  y: 676.7172282563936,
  type: 'red',
  id: 'r1'
}, {
  x: 949.2770688057245,
  y: 589.6202004680064,
  type: 'stricker',
  id: 's1'
}];

var rightdc = [];
var rightuc = [];
var distance = [];
var rdpocketx = 967.7419;
var rdpockety = 32.2581;
var rupocketx = 967.7419;
var rupockety = 967.7419;
var length = position.length;
var flag = 0;

for (let i = 0; i < length; i++) {
  if (position[i].id != 's1') {
    if (position[i].x >= 467 && position[i].y <= 467) {
      var d = Math.sqrt((rdpocketx - position[i].x) * (rdpocketx - position[i].x) + (rdpockety - position[i].y) * (rdpockety - position[i].y));
      position[i].distance = d;
      position[i].hole = 'rd';
      distance.push(position[i]);
      rightdc.push(position[i]);
    }
    if (position[i].x >= 467 && position[i].y >= 467) {
      var d = Math.sqrt((rupocketx - position[i].x) * (rupocketx - position[i].x) + (rupockety - position[i].y) * (rupockety - position[i].y));
      position[i].distance = d;
      position[i].hole = 'ru';
      distance.push(position[i]);
      rightuc.push(position[i]);
    }
  }
}

//sorting coins according the distance from holes
function sortByAttribue(arr, attribute) {
  return arr.sort(function(a, b) {
    return a[attribute] > b[attribute];
  });
}

var sortbydistanceArray = sortByAttribue(distance, "distance");
console.log("this is sortbydistance", sortbydistanceArray);


// Finding the coins y intercept and angle
var sortbydistanceArrayLength = sortbydistanceArray.length;
//console.log(sortbydistanceArrayLength);

for (let i = 0; i < sortbydistanceArrayLength; i++) {

  if (sortbydistanceArray[i].hole === 'rd') {
    let slope = ((rdpockety - sortbydistanceArray[i].y) / (rdpocketx - sortbydistanceArray[i].x));
    let c = rdpockety - (slope * rdpocketx);

    //finding if there is any coin in the position where we place sriker
    if (c > 193.5484 && c < 806.4516) {
      for (let i = 0; i < length; i++) {
        if (position.id != 's1') {
          let dist = Math.sqrt((153.2258 - position[i].x) * (153.2258 - position[i].x) + (c - position[i].y) * (c - position[i].y));
          if (dist > 30 + 25) {
            let angle = 180 - (90 - (slope * (180 / 3.14)));
            console.log("y intercept rd",c);
            console.log("angle rd", angle);
            let move = {
              position: c,
              force: 2000,
              angle: angle
            };
            flag = 1;
            socket.emit('player_input', move);
            break;
          }
        }
      }
    }
    // let Y1 = Math.max(rdpockety, sortbydistanceArray[i].y);
    // let Y2 = Math.min(rdpocketx - sortbydistanceArray[i].x);
    // let X = rdpocketx - sortbydistanceArray[i].x;
    // let angle = (Math.acos((Y1 - Y2) / Math.sqrt(((Y1 - Y2) * (Y1 - Y2)) + (X * X))))*(180/3.141592653589793); 
    // console.log("angle rd", angle);

  }

  if (sortbydistanceArray[i].hole === 'ru') {
    // console.log(rupocketx,sortbydistanceArray[i].x,rupockety,sortbydistanceArray[i].y);
    let slope = ((rupockety - sortbydistanceArray[i].y) / (rupocketx - sortbydistanceArray[i].x));
    //console.log(slope);
    let c = rupockety - (slope * rupocketx);

    //finding if there is any coin in the position where we place sriker
    if (c > 193.5484 && c < 806.4516) {
      for (let i = 0; i < length; i++) {
        if (position.id != 's1') {
          let dist = Math.sqrt((153.2258 - position[i].x) * (153.2258 - position[i].x) + (c - position[i].y) * (c - position[i].y));
          if (dist > 30 + 25) {
            let angle = 180 - (90 - (slope * (180 / 3.14)));
            console.log("angle ru", angle);
            console.log("y intercept ru",c);
            let move = {
              position: c,
              force: 2000,
              angle: angle
            };
            flag = 1;
            //socket.emit('player_input', move);
            break;
          }
        }
      }
    }

    // let Y1 = Math.max(rupockety, sortbydistanceArray[i].y);
    // let Y2 = Math.min(rupocketx - sortbydistanceArray[i].x);
    // let X = rupocketx - sortbydistanceArray[i].x;
    // let angle = 180-((Math.acos((Y1 - Y2) / Math.sqrt(((Y1 - Y2) * (Y1 - Y2)) + (X * X))))*(180/3.141592653589793)); 
    // console.log("angle ru", angle);


  }
  // if(flag === 1) {
  //   break;
  // }

  // if(flag!=1 && i ===(sortbydistanceArrayLength -1 )) {
  //   console.log("entered")
  //   var move = {
  //         position: Math.floor((Math.random() * 806.4516) + 193.5484),
  //         force: 2000,
  //         angle: Math.floor((Math.random() * 180) + 0)
  //       };
  //       //console.log(move);
  //       //socket.emit('player_input', move);
  //       break;
  // }
}
