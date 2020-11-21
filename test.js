const {getInfo} = require('ytdl-getinfo')

getInfo('Muzzy - Endgame').then(info => {
    // info.items[0] contains information of the first search result
    console.log(info.items[0].url)    
  })