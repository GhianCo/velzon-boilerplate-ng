import { Component, OnInit, Input } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import {NgClass} from "@angular/common";
import {CountUpModule} from "ngx-countup";

@Component({
  selector: 'app-analatics-stat',
  templateUrl: './analatics-stat.component.html',
  styleUrls: ['./analatics-stat.component.scss'],
  imports: [
    FeatherModule,
    NgClass,
    CountUpModule
  ],
  standalone: true
})

/**
 * Analatics stat Component
 */
export class AnalaticsStatComponent implements OnInit {

  @Input() title: string | undefined;
  @Input() value: any | undefined;
  @Input() icon: string | undefined;
  @Input() persantage: string | undefined;
  @Input() profit: string | undefined;

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
