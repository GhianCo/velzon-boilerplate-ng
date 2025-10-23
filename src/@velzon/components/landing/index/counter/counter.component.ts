import { Component, OnInit } from '@angular/core';
import {CountUpModule} from "ngx-countup";

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  imports: [
    CountUpModule
  ],
  standalone: true
})

/**
 * Counter Component
 */
export class CounterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 2,
  };
}
