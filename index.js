var getSeason = require("./get_season")
var getTotals = require("./get_totals")
var _ = require("underscore")
var async = require("async")

var rundle = "E Maritime Div 3"

var qpct_basis = 5
var de_basis = 1

async.auto({

  totaldata: function(callback) {
    getTotals(67, callback)
  },

  seasondata: function(callback) {
    getSeason(67, callback)
  },

  playerlist: [ "seasondata", function(callback, results){
    var playerlist = results.seasondata.filter(function(player){
      return player.rundle === rundle
    }).map(function(player){
      return player.name
    })

    callback(null, playerlist)
  }],

  playerdata: [ "totaldata", "playerlist", function(callback, results){
    var players = results.totaldata.filter(function(player){
      return (results.playerlist.indexOf(player.name) > -1)
    })

    callback(null, players)
  }]

}, function(err, results){
  
  var data = results.playerdata
  
  var avg_qpct = (data.reduce(function(mem, player){
    return mem + player.qpct
  }, 0) / data.length)
  var avg_de = (data.reduce(function(mem, player){
    return mem + player.de
  }, 0) / data.length)

  var adjustedData = results.playerdata.map(function(player){
    var qpct = player.qpct = (100 * (player.qpct / avg_qpct))
    var de = player.de = (100 * (player.de / avg_de))

    player.adj = ((player.qpct + player.de) / 2) - player.frate - 75
    return player
  })

  console.log(_.sortBy(adjustedData, function(player){
    return player.adj * -1
  }))

})

