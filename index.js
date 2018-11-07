const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
module.exports = function(dmx,config = {port: 8080}){
  const app = express();
  app.use(express.static(path.join(__dirname, './dist/')));
  app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}));
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.get('/api/devices', (req, res) => {
    if(!dmx.devices) return res.json([])
    //let devices = //JSON.parse(JSON.stringify(dmx.devices))
    let devices = dmx.devices.map(x => {
      return {
        name: x.name,
        programs: x.getPrograms(),
        isRgb: x.isRgb,
        channels: x.channels,
        isGroup: x.isGroup,
        state: x.getChannelState()
      }
    }).sort((a,b) => a.isGroup ? -1 : 1)
    res.json(devices)
  });
  app.post('/api/blackout',(req,res) => {
    dmx.devices.forEach(device => device.blackout())
    res.json({success: true})
  })
  app.post('/api/device/set',(req,res) => {
    let device = dmx.devices.find(x => x.name === req.body.name)
    if(!req.body.name || !req.body.commands || !device) return res.json({success: false})
    let results = req.body.commands.map(command => {
      let result = false
      if(!command.args) command.args = []
      if(command.type && device[command.type] instanceof Function ) result = device[command.type](...command.args)
      if(!(result instanceof Object) || result instanceof dmx.Device || result instanceof dmx.Group) result = false
      return result
    })
    res.json({success: true,results: results})
  })
  app.get('/api/sequences',(req,res) => {
    if(!dmx.seqences) return res.json([])
    res.json(Object.keys(dmx.seqences).map(x => Object.assign({name: x, duration: dmx.seqences[x].duration || 100})))
  })
  app.post('/api/stopSequence/:name',(req,res) => {
    if(!req.params.name) return res.json({success: false})
    res.json({success: dmx.stopSeq(req.params.name)})
  })
  app.post('/api/runSequence/:name',(req,res) => {
    if(!req.params.name) return res.json({success: false})
    res.json({success: dmx.runSeq(req.params.name)})
  })
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'))
  });
  app.listen(config.port, () => console.log('Web interface started at localhost: '+config.port+'!'));

  return app
}
