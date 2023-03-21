import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mp-time-bar',
  templateUrl: './time-bar.component.html',
  styleUrls: ['./time-bar.component.scss'],
})
export class TimeBarComponent implements OnInit {
  progress: number | undefined;
  height: number | undefined;
  lowTime: boolean | undefined;

  ngOnInit() {
    this.setProgress(50)
  }

  setProgress(newVal: number) {
    this.progress = newVal;
    if (newVal < 20) {
      this.lowTime = true;
    }
  }

  getStyle() {
    return {
      'width': this.progress + '%'
    }
  }

}
