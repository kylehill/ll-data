var getSeason = require("./get_season")
var async = require("async")
var _ = require("underscore")

var firstSeason = 60

module.exports = function(throughSeason, callback) {

  var process = function(err, results) {

    var aggregated = results.reduce(function(mem, season){
      return season.reduce(function(mem, player){
        var name = player.name
        
        mem[name] = mem[name] || { 
          name: name,
          de: 0,
          qpct: 0,
          forfeits: 0,
          seasons: 0,
        }

        mem[name].de += player.de
        mem[name].qpct += player.qpct
        mem[name].forfeits += player.forfeits
        mem[name].seasons += 1

        return mem
      }, mem)
    }, {})

    var processed = []
    for (var playerName in aggregated) {
      var player = aggregated[playerName]

      processed.push({
        name: playerName,
        seasons: player.seasons,
        de: (player.de / player.seasons),
        qpct: (player.qpct / player.seasons),
        frate: (player.forfeits / player.seasons)
      })
    }

    callback(null, processed)
  }

  async.map(_.range(firstSeason, throughSeason), getSeason, process)
}