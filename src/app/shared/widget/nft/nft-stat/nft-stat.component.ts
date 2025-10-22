import { Component, OnInit, Input } from '@angular/core';
import {NgClass} from "@angular/common";
import {CountUpModule} from "ngx-countup";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-nft-stat',
  templateUrl: './nft-stat.component.html',
  styleUrls: ['./nft-stat.component.scss'],
  imports: [
    NgClass,
    CountUpModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu
  ],
  standalone: true
})

/**
 * Nft-Stat Component
 */
export class NftStatComponent implements OnInit {

  @Input() icon: string | undefined;
  @Input() title: string | undefined;
  @Input() value: any | undefined;
  @Input() persantage: string | undefined;
  @Input() profit: string | undefined;
  @Input() bg_color: string | undefined;

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
