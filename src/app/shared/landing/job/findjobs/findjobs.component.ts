import { Component, OnInit } from '@angular/core';

// Data Get
import { findjob } from './data';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-findjobs',
  templateUrl: './findjobs.component.html',
  styleUrls: ['./findjobs.component.scss'],
  imports: [
    NgClass
  ],
  standalone: true
})
export class FindjobsComponent implements OnInit {

  findjobs: any;

  constructor() { }

  ngOnInit(): void {
    this.findjobs = findjob
  }

}
