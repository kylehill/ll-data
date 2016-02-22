var csv = require("csv-parse")
var fs = require("fs")
var _ = require("underscore")

var parseSeasonCSV = function(err, data){
  return data.map(function(player){
    return {
      name: player.Player,
      wins: player.Wins * 1,
      losses: player.Losses * 1,
      ties: player.Ties * 1,
      forfeits: player.FL * 1,
      mp: player.Pts * 1,
      qpct: player.QPct * 1,
      de: player.DE * 1,
      tca: player.TCA * 1,
      caa: player.CAA * 1,
      rundle: player.Rundle,
      rank: player["Rundle Rank"] * 1,
      level: player.Rundle.split(" ")[0],
      league: player.League
    }
  })
}

module.exports = function(season, callback) {

  var parser = csv({ columns: true }, function(err, data){
    callback(err, parseSeasonCSV(err, data))
  })

  var str = fs.createReadStream('data/LL' + season + '.csv')
    .pipe(parser)

}