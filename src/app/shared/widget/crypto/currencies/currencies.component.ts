import { Component, OnInit, Input } from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss'],
  imports: [
    NgClass
  ],
  standalone: true
})

/**
 * Currencies Component
 */
export class CurrenciesComponent implements OnInit {

   // Currencies data
   @Input() Currencies: Array<{
    image?: string;
    coinName?: string;
    price?: string;
    change?: string;
    profit?: string;
    balance?: string;
    coin?: string;

  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
