var underscore = require('underscore');

var position = [{
  x: 282.21675201878446,
  y: 893.3213434509095,
  type: 'black',
  id: 'b1'
}, {
  x: 791.2517343044567,
  y: 319.98975287031715,
  type: 'black',
  id: 'b2'
}, {
  x: 394.414451992246,
  y: 127.14137458647593,
  type: 'black',
  id: 'b3'
}, {
  x: 974.2847842230408,
  y: 464.3321941757242,
  type: 'black',
  id: 'b4'
}, {
  x: 896.3911073328441,
  y: 306.1648786632515,
  type: 'black',
  id: 'b5'
}, {
  x: 367.4865042073287,
  y: 791.8318558445015,
  type: 'black',
  id: 'b6'
}, {
  x: 898.8847564324391,
  y: 412.39850792956435,
  type: 'black',
  id: 'b7'
}, {
  x: 953.3780896396406,
  y: 417.4572313571452,
  type: 'black',
  id: 'b8'
}, {
  x: 881.2027467652366,
  y: 511.9407202509605,
  type: 'black',
  id: 'b9'
}, {
  x: 956.6253160827542,
  y: 321.2817608088909,
  type: 'white',
  id: 'w2'
}, {
  x: 632.5599681820057,
  y: 946.2255969631824,
  type: 'white',
  id: 'w3'
}, {
  x: 537.4573616329683,
  y: 730.0268032267318,
  type: 'white',
  id: 'w4'
}, {
  x: 411.5771212377056,
  y: 661.4296406004846,
  type: 'white',
  id: 'w5'
}, {
  x: 969.1664880419556,
  y: 267.52067777240455,
  type: 'white',
  id: 'w6'
}, {
  x: 971.0409392471379,
  y: 370.10484768065726,
  type: 'white',
  id: 'w7'
}, {
  x: 174.05761126245625,
  y: 306.63127771090933,
  type: 'white',
  id: 'w8'
}, {
  x: 520.2002015365147,
  y: 606.0617491987508,
  type: 'white',
  id: 'w9'
}, {
  x: 904.7029718657932,
  y: 356.4407423217196,
  type: 'red',
  id: 'r1'
}, {
  x: 846.5468880898945,
  y: 362.2366982135947,
  type: 'white',
  id: 'w1'
}, {
  x: 382.824522196758,
  y: 271.5928833433886,
  type: 'stricker',
  id: 's1'
}];

var distance = [];
var rdpocketx = 967.7419;
var rdpockety = 32.2581;
var rupocketx = 967.7419;
var rupockety = 967.7419;
var flag = 0;



var length = position.length;



for (let i = 0; i < length; i++) {
  if (position[i].id != 's1') {
    if (position[i].x >= 153.2258 && position[i].y <= 467) {
      var d = Math.sqrt((rdpocketx - position[i].x) * (rdpocketx - position[i].x) + (rdpockety - position[i].y) * (rdpockety - position[i].y));
      position[i].distance = d;
      position[i].hole = 'rd';
      distance.push(position[i]);
    }
    if (position[i].x >= 153.2258 && position[i].y >= 467) {
      var d = Math.sqrt((rupocketx - position[i].x) * (rupocketx - position[i].x) + (rupockety - position[i].y) * (rupockety - position[i].y));
      position[i].distance = d;
      position[i].hole = 'ru';
      distance.push(position[i]);
    }
  }
}



var sortbydistanceArray = sortByAttribue(distance, "distance");
//console.log("this is sortbydistance", sortbydistanceArray);


var sortbydistanceArrayLength = sortbydistanceArray.length;
//console.log(sortbydistanceArrayLength);




for (let i = 0; i < 1; i++) {

  if (sortbydistanceArray[i].hole === 'rd') {
    let slope = ((rdpockety - sortbydistanceArray[i].y) / (rdpocketx - sortbydistanceArray[i].x));
    //let c = rdpockety - (slope * rdpocketx);

    //55 = 30+25 coin+striker radius.
    //testx and testy are points where striker should hit the coin.
    let testx = sortbydistanceArray[i].x + (55 * Math.sqrt(1 / (1 + (slope * slope))));
    let testy = (slope * (testx - sortbydistanceArray[i].x) + sortbydistanceArray[i].y);


    console.log(sortbydistanceArray[i].x, sortbydistanceArray[i].y);
    //console.log(testx,testy);
    //console.log("------------------------------");

    //finding if there is any coin in the position where we place sriker
    for (let j = 806.4516; j > 800; j -= 30) {
      //console.log(j);
      let check = strikerPosition(sortbydistanceArray, j);
      console.log(check);
      console.log('--------------------------------------------');
      if (check === true) {
        if (position.id != 's1') {
          //console.log(dist);
          let strikerSlope = Math.abs((j - testy) / (153.2258 - testx));
          //console.log("this is slope", strikerSlope);
          let angle = 90 - (strikerSlope * (180 / 3.14));
          if (angle > 0) {
            console.log("angle rd", angle);
            //console.log("y intercept rd",j);
            // console.log("------------------------------");

            let move = {
              position: j,
              force: 2000,
              angle: angle
            };
            flag = 1;
            //socket.emit('player_input', move);
            break;
          }
        }
      }
      if (flag === 1) {
        break;
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
    //let c = rupockety - (slope * rupocketx);

    let rutestx = sortbydistanceArray[i].x + (55 * Math.sqrt(1 / (1 + (slope * slope))));
    let rutesty = (slope * (rutestx - sortbydistanceArray[i].x) + sortbydistanceArray[i].y);


    //finding if there is any coin in the position where we place sriker
    for (let j = 193.5484; j < 806.4516; j += 30) {
      var check = strikerPosition(sortbydistanceArray, j);

      if (check === true) {
        if (position.id != 's1') {
          let strikerSlope = ((j - rutesty) / (153.2258 - rutestx));
          let angle = 180 - (90 - (strikerSlope * (180 / 3.14)));

          if (angle > 0) {
            console.log("angle ru", angle);
            // console.log("y intercept ru", c);
            // console.log("------------------------------");

            let move = {
              position: j,
              force: 2000,
              angle: angle
            };
            flag = 1;
            //socket.emit('player_input', move);
            break;
          }
        }
      }
      if (flag === 1) {
        break;
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

  if (flag === 1) {
    break;
  }
}

//sorting coins according the distance from holes
function sortByAttribue(arr, key) {
  return arr.sort(function(a, b) {
    var x = a[key];
    var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

//finding if there is any coin in striker placing position
function strikerPosition(coinList, currentStrikerPosition) {
  let length = coinList.length
  console.log(length);
  var check = 0;
  console.log("coin list", coinList);
  console.log(currentStrikerPosition);
  for (i = 0; i < length; i++) {
    let x = 153.2258 - coinList[i].x;
    let y = currentStrikerPosition - coinList[i].y;
    let dist = Math.sqrt((x*x)+(y*y));
    console.log(dist);
    if (dist < 55) {
      check = 1;
      return false;
    }
    //console.log("hii");
  }
  if(check === 0) {
    return true;
  }
}
