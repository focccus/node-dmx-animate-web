import { Component, OnInit } from '@angular/core';
import { DmxService, Microphone } from '../services/dmx.service'
@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  selDev
  soundSensitive = 40
  soundSmooth = 1
  constructor(private dmx: DmxService) { }
  devices = []
  ngOnInit() {
    this.mic = new Microphone(128)
    console.log(this.mic)
    var self = this
    this.mic.getRMS = function (spectrum) {
      if(self.devices.find(x => x.isSoundActive)){
      var rms = 0;
      var value = (spectrum[40] + spectrum[30] + spectrum[10] + spectrum[20]) / 4
      for (let spec of spectrum) {
        spec += (spec - value) / 200;
        rms += spec * spec;
      }
      rms /= spectrum.length;
      rms = Math.sqrt(rms);
      if(rms > self.soundSensitive){
        for(let activeDevice of self.devices.filter(x => x.reactSound && x.isSoundActive)){
          let args =  {}
          activeDevice.reactSound.forEach(x => args[x] = Math.floor(Math.random() * (rms - self.soundSensitive / 2) * 5))
          Object.assign(activeDevice.state,args)
          self.executeProgram(activeDevice,[{type: 'dim',args: [args,undefined,self.soundSmooth || 1]},{type:'run'}])
        }
      }
      return rms;
    }
    return 0
    }
    this.dmx.getDevices().then(res => {
      console.log(res)
      this.devices = res.map(x => {
        if(!x.state) x.state= {}
        if(!x.changeable) x.changeable= {}
        return x
      })
    })
  }
  mic
  micTimer
  toggleMic(device){
    device.isSoundActive = device.isSoundActive ? false : true
  }
  sliderChanged(device,e = undefined,channel = undefined){
    if(e && e.value >= 0){
      device.state[channel] = e.value
    }
    for(let channel in device.state){
      if(device.state[channel] <= 0) device.state[channel] = 'off'
    }
    this.dmx.setDevice({
      name: device.name,
      commands: [
        {
          type: "setChannels",
          args: [device.state]
        }
      ]
    })
  }
  getColor(device){
    return 'rgb(' + device.state.r + ',' + device.state.g + ',' + device.state.b +')'
  }
  onBlackout(){
    this.dmx.blackout().then(res => {
      if(res.success)     this.devices.forEach(x => x.state = {})

    })
  }
  error
  executeProgram(device,commands = []){
    this.error = ''
    this.dmx.setDevice({
      name: device.name,
      commands: commands
    }).then(res => {
      if(res.success && res.results && res.results[res.results.length - 1] && !device.isSoundActive) device.state = res.results[res.results.length - 1]
      if(!res.success) this.error = "Program not found!"
    })
  }
  executeInput(device,str){
    str = str.split('(')
    let name = str[0]
    let args = str[1]
    if(!args) return this.error = "Program not valid! Use name(arguments)"
    args = args.substr(0,args.length - 1).split(',').filter(x => x ? true : false)
    this.executeProgram(device,[{type: name,args: args}])
  }
  changePickColor(device,e){
    e = e.substr(4,e.length - 5).split(',').map(x => parseInt(x))
    device.state.r = e[0]
    device.state.g = e[1]
    device.state.b = e[2]
    this.sliderChanged(device)
  }
}
