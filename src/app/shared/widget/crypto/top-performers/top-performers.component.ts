import { Component, OnInit, Input } from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-top-performers',
  templateUrl: './top-performers.component.html',
  styleUrls: ['./top-performers.component.scss'],
  imports: [
    NgClass
  ],
  standalone: true
})

/**
 * Top Perfomers Component
 */
export class TopPerformersComponent implements OnInit {

  // Top Perfomers
  @Input() TopPerformers: Array<{
    image?: string;
    coinName?: string;
    price?: string;
    change?: string;
    profit?: string;
    balance?: string;
    percentage?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
