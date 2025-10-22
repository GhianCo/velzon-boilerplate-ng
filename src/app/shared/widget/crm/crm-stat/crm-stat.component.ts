import { Component, OnInit, Input } from '@angular/core';
import {CountUpModule} from "ngx-countup";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-crm-stat',
  templateUrl: './crm-stat.component.html',
  styleUrls: ['./crm-stat.component.scss'],
  imports: [
    CountUpModule,
    NgClass
  ],
  standalone: true
})

/**
 * Crm Stat Component
 */
export class CrmStatComponent implements OnInit {

  @Input() title: string | undefined;
  @Input() value: any | undefined;
  @Input() icon: string | undefined;
  @Input() profit: string | undefined;
  @Input() sign: string | undefined;
  @Input() percentage: string | undefined;

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
