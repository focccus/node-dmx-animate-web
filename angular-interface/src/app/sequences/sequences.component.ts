import { Component, OnInit } from '@angular/core';
import { DmxService } from '../services/dmx.service'

@Component({
  selector: 'app-sequences',
  templateUrl: './sequences.component.html',
  styleUrls: ['./sequences.component.scss']
})
export class SequencesComponent implements OnInit {
  sequences = []
  constructor(private dmx: DmxService) { }

  ngOnInit() {
    this.dmx.getSequences().then(res => {
      console.log(res)
      this.sequences = res
    })
  }
  playing
  playTimer
  runSeq(seq){
    this.playing = seq
    seq.progress = 0
    this.dmx.runSequence(seq.name).then(res => {
      console.log(res)
    })
    let self = this
    console.log((seq.duration || 50) / 100)
    this.playTimer = setInterval(() => {
      seq.progress += 1
      if(seq.progress >= 100){
        self.playing = undefined
        clearInterval(self.playTimer)
      }
    }, Math.ceil((seq.duration || 50) / 90))
  }
  stopSeq(seq){
    this.playing = undefined
    clearInterval(this.playTimer)
    this.dmx.stopSequence(seq.name).then(res => {
      console.log(res)
    })
  }

}
