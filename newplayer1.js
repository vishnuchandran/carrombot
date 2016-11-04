const io = require('socket.io-client');
const socket = io('http://10.7.90.8:4000');
const connctionData = { "playerKey": "Bght4Erf5T", "gameKey": "alfr3EDLGT51WSxd39tG" };
//const connctionData = { "playerKey": "NcGkaA562k", "gameKey": "RAEyA4J9BIjn7mfZYFD4" };
var position;

var rdpocketx = 967.7419;
var rdpockety = 32.2581;
var rupocketx = 967.7419;
var rupockety = 967.7419;
var ldpocketx = 32.2581;
var ldpockety = 32.2581;
var lupocketx = 32.2581;
var lupockety = 967.7419;




//connection
socket.on('connect', function(data) {
  socket.emit('connect_game', connctionData);
});


socket.on('connect_game', function(data) {
  console.log(data);
});




socket.on('your_turn', function(data) {


  position = data.position;
  var length = position.length;
  var sortbydistanceArray = [];
  var distance = [];
  var flag = 0;
  var reboundflag = 0;
  //take a count of right upper side coins if it is zero we can hit the left uppercoins(rebound);
  var ruareaflag = 0;
  var rdareaflag = 0;

  for (let i = 0; i < length; i++) {
    if (position[i].id != 's1') {
      if (position[i].x > 178.2258 && position[i].y < 467) {
        var d = Math.sqrt((rdpocketx - position[i].x) * (rdpocketx - position[i].x) + (rdpockety - position[i].y) * (rdpockety - position[i].y));
        position[i].distance = d;
        position[i].hole = 'rd';
        distance.push(position[i]);
        reboundflag += 1;
        rdareaflag += 1;
      }
      if (position[i].x > 178.2258 && position[i].y > 467) {
        var d = Math.sqrt((rupocketx - position[i].x) * (rupocketx - position[i].x) + (rupockety - position[i].y) * (rupockety - position[i].y));
        position[i].distance = d;
        position[i].hole = 'ru';
        distance.push(position[i]);
        reboundflag += 1;
        ruareaflag += 1;
      }
      if (position[i].x <= 178.2258 && position[i].y <= 467) {
        var d = Math.sqrt((ldpocketx - position[i].x) * (ldpocketx - position[i].x) + (ldpockety - position[i].y) * (ldpockety - position[i].y));
        position[i].distance = d;
        position[i].hole = 'ld';
        distance.push(position[i]);
      }
      if (position[i].x <= 178.2258 && position[i].y > 467) {
        var d = Math.sqrt((lupocketx - position[i].x) * (lupocketx - position[i].x) + (lupockety - position[i].y) * (lupockety - position[i].y));
        position[i].distance = d;
        position[i].hole = 'lu';
        distance.push(position[i]);
      }
    }
  }


  //console.log(distance);
  sortbydistanceArray = sortByAttribue(distance, "distance");
  console.log("this is sortbydistance", sortbydistanceArray);
  // it is used to consider the red coin as the priority if it is in the first five of sorted array
  var redlimit;

  var sortbydistanceArrayLength = sortbydistanceArray.length;
  console.log(sortbydistanceArrayLength);
  if (sortbydistanceArrayLength <= 5) {
    redlimit = sortbydistanceArrayLength;
  } else {
    redlimit = 5
  }


  for (let i = 0; i < redlimit; i++) {
    if (sortbydistanceArray[i].id === 'r1') {
      sortbydistanceArray.unshift(sortbydistanceArray[i]);
      sortbydistanceArray.splice(i + 1, 1);
    }
  }


  for (let i = 0; i < sortbydistanceArrayLength; i++) {

    if (sortbydistanceArray[i].hole === 'rd') {
      let slope = ((rdpockety - sortbydistanceArray[i].y) / (rdpocketx - sortbydistanceArray[i].x));
      //let c = rdpockety - (slope * rdpocketx);

      //55 = 30+25 coin+striker radius.
      //testx and testy are points where striker should hit the coin.
      let testx1 = sortbydistanceArray[i].x + (55 * Math.sqrt(1 / (1 + (slope * slope))));
      let testx2 = sortbydistanceArray[i].x - (55 * Math.sqrt(1 / (1 + (slope * slope))));
      let testy1 = (slope * (testx1 - sortbydistanceArray[i].x) + sortbydistanceArray[i].y);
      let testy2 = (slope * (testx2 - sortbydistanceArray[i].x) + sortbydistanceArray[i].y);
      let a = distanceBtwPoints(testx1, testy1, rdpocketx, rdpockety);
      let b = distanceBtwPoints(testx2, testy2, rdpocketx, rdpockety);
      console.log('this is a', a);
      console.log('this is b', b);
      if (a > b) {
        testx = testx1;
        testy = testy1;
      } else {
        testx = testx2;
        testy = testy2;
      }
      console.log(sortbydistanceArray[i].x, sortbydistanceArray[i].y);
      console.log(testx, testy);
      console.log("------------------------------");
      //where is start placing the striker
      let startpoint = strikerStartYcoordinate(sortbydistanceArray[i]);


      //finding if there is any coin in the position where we place sriker
      for (let j = startpoint; j > 193.5484; j -= 30) {
        //console.log(j);
        let check = strikerPosition(sortbydistanceArray, j);
        console.log(check);

        if (check === true) {
          if (position.id != 's1') {

            let strikerm = ((j - testy) / (153.2258 - testx));

            let strikerSlope = Math.atan(Math.abs((j - testy) / (153.2258 - testx)));

            let obstacles = obstacleDetection(j, strikerm, sortbydistanceArray);


            console.log("this is obstacle count", obstacles);

            if (obstacles > 1) {
              if (startpoint === 806.4516) {
                force = 6500 + ((obstacles - 1) * 1000) + 1000;
                if (force > 10000) {
                  force = 10000;
                }
              } else {
                force = 4400 + ((obstacles - 1) * 1000);
                if (force > 10000) {
                  force = 10000;
                }
              }

            } else {
              if ((Math.abs(strikerm - slope)) > 3) {
                force = (sortbydistanceArray[i].distance / 100) * 250 + 6000;
              } else {
                if (startpoint === 806.4516) {
                  force = 6500 + ((sortbydistanceArray[i].distance / 100) * 400);
                  if (force > 10000) {
                    force = 10000;
                  }
                } else {
                  force = (sortbydistanceArray[i].distance / 100) * 225 + 4500;
                }

              }
            }



            let angle = (90 - (strikerSlope * (180 / Math.PI)));
            if (angle > 0 && angle < 180) {
              console.log("angle rd", angle);
              //console.log("y intercept rd",j);
              // console.log("------------------------------");

              let move = {
                position: j,
                force: force,
                angle: angle
              };
              flag = 1;
              console.log(move);
              socket.emit('player_input', move);
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

      let rutestx1 = sortbydistanceArray[i].x + (55 * Math.sqrt(1 / (1 + (slope * slope))));
      let rutesty1 = (slope * (rutestx1 - sortbydistanceArray[i].x) + sortbydistanceArray[i].y);
      let rutestx2 = sortbydistanceArray[i].x - (55 * Math.sqrt(1 / (1 + (slope * slope))));
      let rutesty2 = (slope * (rutestx2 - sortbydistanceArray[i].x) + sortbydistanceArray[i].y);
      let a = distanceBtwPoints(rutestx1, rutesty1, rupocketx, rupockety);
      let b = distanceBtwPoints(rutestx2, rutesty2, rupocketx, rupockety);
      console.log('this is a', a);
      console.log('this is b', b);
      if (a > b) {
        rutestx = rutestx1;
        rutesty = rutesty1;
      } else {
        rutestx = rutestx2;
        rutesty = rutesty2;
      }

      console.log(sortbydistanceArray[i].x, sortbydistanceArray[i].y);
      console.log(rutestx, rutesty);
      console.log("------------------------------");

      //where is start placing the striker
      let startpoint = strikerStartYcoordinate(sortbydistanceArray[i]);


      //finding if there is any coin in the position where we place sriker
      for (let j = startpoint; j < 806.4516; j += 30) {
        var check = strikerPosition(sortbydistanceArray, j);

        if (check === true) {
          if (position.id != 's1') {
            let strikerm = ((j - rutesty) / (153.2258 - rutestx));
            let strikerSlope = Math.atan(((j - rutesty) / (153.2258 - rutestx)));

            let obstacles = obstacleDetection(j, strikerm, sortbydistanceArray);
            console.log("this is obstacle count", obstacles);
            if (obstacles > 1) {
              if (startpoint === 193.5484) {
                force = 6500 + ((obstacles - 1) * 1000) + 1000;
                if (force > 10000) {
                  force = 10000;
                }


              } else {
                force = 4400 + ((obstacles - 1) * 1000);
                if (force > 10000) {
                  force = 10000;
                }
              }
            } else {
              if ((Math.abs(strikerm - slope)) > 3) {
                force = (sortbydistanceArray[i].distance / 100) * 250 + 6000;
              } else {
                if (startpoint === 193.5484) {
                  force = 6500 + ((sortbydistanceArray[i].distance / 100) * 400);
                  if (force > 10000) {
                    force = 10000;
                  }
                } else {
                  force = (sortbydistanceArray[i].distance / 100) * 225 + 4500;
                }

              }
            }


            let angle = 180 - (90 - (strikerSlope * (180 / Math.PI)));
            if (angle > 0) {
              console.log("angle ru", angle);
              // console.log("y intercept ru", c);
              // console.log("------------------------------");

              let move = {
                position: j,
                force: force,
                angle: angle
              };
              flag = 1;
              console.log(move)
              socket.emit('player_input', move);
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


    if (sortbydistanceArray[i].hole === 'lu' && (reboundflag <= 5 || ruareaflag <= 2)) {
      let slope = ((lupockety - sortbydistanceArray[i].y) / (lupocketx - sortbydistanceArray[i].x));
      let lutestx1 = sortbydistanceArray[i].x + (55 * Math.sqrt(1 / (1 + (slope * slope))));
      let lutesty1 = (slope * (lutestx1 - sortbydistanceArray[i].x) + sortbydistanceArray[i].y);
      let lutestx2 = sortbydistanceArray[i].x - (55 * Math.sqrt(1 / (1 + (slope * slope))));
      let lutesty2 = (slope * (lutestx2 - sortbydistanceArray[i].x) + sortbydistanceArray[i].y);
      let a = distanceBtwPoints(lutestx1, lutesty1, lupocketx, lupockety);
      let b = distanceBtwPoints(lutestx2, lutesty2, lupocketx, lupockety);
      console.log('this is a', a);
      console.log('this is b', b);
      if (a > b) {
        lutestx = lutestx1;
        lutesty = lutesty1;
      } else {
        lutestx = lutestx2;
        lutesty = lutesty2;
      }

      console.log(sortbydistanceArray[i].x, sortbydistanceArray[i].y);
      console.log(lutestx, lutesty);
      console.log("------------------------------");

      let strikerYcoordinate = rebound(lutestx, lutesty, 'lu', sortbydistanceArray);
      if (strikerYcoordinate != 0) {
        let edge = ((lutesty - strikerYcoordinate) / 2) + strikerYcoordinate;
        let newslope = Math.atan(Math.abs((edge - strikerYcoordinate) / (1000 - 153.2258)));
        let newangle = 180 - (90 - (newslope * (180 / Math.PI)));
        if (newangle > 0) {
          console.log("angle lu", newangle);
          console.log("y intercept lu", strikerYcoordinate);
          // console.log("------------------------------");

          let move = {
            position: strikerYcoordinate,
            force: 10000,
            angle: newangle
          };
          flag = 1;
          console.log(move);
          socket.emit('player_input', move);
        }
      }

    }

    if (sortbydistanceArray[i].hole === 'ld' && (reboundflag <= 5 || rdareaflag <= 2)) {
      let slope = ((ldpockety - sortbydistanceArray[i].y) / (ldpocketx - sortbydistanceArray[i].x));
      let ldtestx1 = sortbydistanceArray[i].x + (55 * Math.sqrt(1 / (1 + (slope * slope))));
      let ldtesty1 = (slope * (ldtestx1 - sortbydistanceArray[i].x) + sortbydistanceArray[i].y);
      let ldtestx2 = sortbydistanceArray[i].x - (55 * Math.sqrt(1 / (1 + (slope * slope))));
      let ldtesty2 = (slope * (ldtestx2 - sortbydistanceArray[i].x) + sortbydistanceArray[i].y);
      let a = distanceBtwPoints(ldtestx1, ldtesty1, ldpocketx, ldpockety);
      let b = distanceBtwPoints(ldtestx2, ldtesty2, ldpocketx, ldpockety);
      console.log('this is a', a);
      console.log('this is b', b);
      if (a > b) {
        ldtestx = ldtestx1;
        ldtesty = ldtesty1;
      } else {
        ldtestx = ldtestx2;
        ldtesty = ldtesty2;
      }

      console.log(sortbydistanceArray[i].x, sortbydistanceArray[i].y);
      console.log(ldtestx, ldtesty);
      console.log("------------------------------");

      let strikerYcoordinate = rebound(ldtestx, ldtesty, 'ld', sortbydistanceArray);
      if (strikerYcoordinate != 0) {
        let edge = ((ldtesty - strikerYcoordinate) / 2) + strikerYcoordinate;
        let newslope = Math.atan(Math.abs((strikerYcoordinate - edge) / (1000 - 153.2258)));
        let newangle = (90 - (newslope * (180 / Math.PI)));
        if (newangle > 0) {
          console.log("angle ld", newangle);
          console.log("y intercept ld", strikerYcoordinate);
          // console.log("------------------------------");

          let move = {
            position: strikerYcoordinate,
            force: 10000,
            angle: newangle
          };
          flag = 1;
          console.log(move);
          socket.emit('player_input', move);
        }
      }

    }


    if (flag === 1) {
      break;
    }
    if (flag != 1 && i === (sortbydistanceArrayLength - 1)) {
      console.log("entered")
      var move = {
        position: Math.floor((Math.random() * 806.4516) + 193.5484),
        force: 2000,
        angle: Math.floor((Math.random() * 180) + 0)
      };
      console.log(move);
      socket.emit('player_input', move);
      break;
    }
  }



});



socket.on('opponent_turn', function(data) {
  //console.log(data);
});



socket.on('player_input', function(data) {
  //console.log(data);
});



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
  var check = 0;
  for (i = 0; i < length; i++) {
    let x = 153.2258 - coinList[i].x;
    let y = currentStrikerPosition - coinList[i].y;
    let dist = Math.sqrt((x * x) + (y * y));
    if (dist < 55) {
      check = 1;
      return false;
    }
  }
  if (check === 0) {
    return true;
  }
}

function distanceBtwPoints(x1, y1, x2, y2) {
  return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
}



function rebound(strikerTargetX, strikerTargetY, holePosition, coinList) {
  let x = 153.2258;
  let check = 0;
  let y;
  let limit;
  let adder;
  if (holePosition === 'lu') {
    y = strikerTargetY - 200;
    limit = (y - 193.5484) / 25;
    adder = 25;
  } else {
    y = strikerTargetY + 200;
    limit = (806.4516 - y) / 25;
    adder = -25;
  }
  for (let i = 0; i < limit; i++) {
    let check = strikerPosition(coinList, y);
    if (check === true) {
      check = 1;
      return y;
    }
    y = y - 25;
  }
  if (check === 0) {
    return 0;
  }
}


function obstacleDetection(strikerPosition, slope, coinList) {
  let c = strikerPosition - (slope * (153.2258));
  let length = coinList.length;
  let count = 0;
  //distance btw a point and line 
  let A = -slope;
  let B = 1;
  let C = -c;
  for (i = 0; i < length; i++) {
    if (coinList[i].x > 153.2258) {
      let distan = (Math.abs(A * coinList[i].x + B * coinList[i].y + C)) / (Math.sqrt((A * A) + (B * B)));
      //console.log("distasnc", distan);
      if (distan < 30 + 25) {
        count += 1;
      }
    }
  }
  if (count > 0) {
    return count;
  } else {
    return 0;
  }
}

//determine where to place striker first

function strikerStartYcoordinate(targetCoin) {
  if (targetCoin.x === 500 && targetCoin.y === 500) {
    if (targetCoin.hole === 'ru') {
      return 193.5484;
    } else {
      return 806.4516;
    }
  } else if (targetCoin.x > 830 && (targetCoin.y > 467 && targetCoin.y < 806.4516)) {
    return 193.5484
  } else if (targetCoin.x >= 830 && (targetCoin.y <= 467 && targetCoin.y > 193.5484)) {
    return 806.4516;
  } else {
    return 467;
  }
}
