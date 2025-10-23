import { Component, OnInit } from '@angular/core';

// Data Get
import {NgClass} from "@angular/common";
import {joboverview} from "@velzon/core/data/jobList";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  imports: [
    NgClass
  ],
  standalone: true
})
export class OverviewComponent implements OnInit {

  relatedjobs: any;
  bookmark: boolean = true;

  constructor() { }

  ngOnInit(): void {
    // Fetch Data
    this.relatedjobs = joboverview
  }

  bookmarklist() {
    if (this.bookmark == true) {
      this.bookmark = false
    } else {
      this.bookmark = true
    }
  }

}
