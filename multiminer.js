var Reversi = require('./lib/reversi.js').default
var fs = require("fs")
try{
  fs.mkdirSync("./clovers")
}catch(e){}

var RUNSPERCHUNK = 250

var reversi = new Reversi()

while(true){
  var found = false
  console.log("Searching...")

  while(!found){
    var avg = false
    var mining = true
    var now = Date.now()
    var count = 0
    var start = Date.now();
    while(mining){
      reversi.mine()
      if(reversi.symmetrical){
        found=true
        mining=false
      }
      if(count++>RUNSPERCHUNK){
        mining=false
      }
    }
    var length = (Date.now()-now)/1000
    var persec = count/length
    if(!avg) avg = Math.round(persec)
    else avg = Math.round(1000 * (avg * 15/16 + (persec) * 1/16))/1000
    console.log(avg+"/s (view clovers/stats.json for more info)")

    var stats
    try{
      stats= fs.readFileSync("clovers/stats.json")
    }catch(e){

    }
    if(stats) {
      try{
        stats = JSON.parse(stats)
      }catch(e){

      }
    }else{
      stats = {started: Date.now()}
    }
    if(stats && stats.started){
      if(!stats.workers){
        stats.workers = {}
      }
      stats.workers[process.pid] = Date.now()
      if(!stats.perSec){
        stats.perSec = avg
      }else{
        stats.perSec = Math.round(1000 * (stats.perSec * 15/16 + (persec) * 1/16))/1000
      }
      fs.writeFileSync("clovers/stats.json",JSON.stringify(stats,null,2))
    }
  }

  console.log("FOUND",reversi.movesString)

  reversi.makeVisualBoard()
  var cleanLine = ""
  var fullThing = ""
  console.log(reversi.movesString)
  for (var i = 0; i < reversi.BOARDDIM; i++) {
    for (var j = 0; j < reversi.BOARDDIM; j++) {
      cleanLine+=reversi.visualBoard[i][j]
    }
    console.log(cleanLine)
    fullThing+=cleanLine+"\n"
    cleanLine=""
  }
  var details = reversi.RotSym+","+reversi.Y0Sym+","+reversi.X0Sym+","+reversi.XYSym+","+reversi.XnYSym+"\n"
  fs.writeFileSync("clovers/"+reversi.movesString,reversi.movesString+"\n\n"+fullThing+"\n"+details)



}
