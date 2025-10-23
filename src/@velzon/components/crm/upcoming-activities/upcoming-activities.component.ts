import { Component, OnInit, Input } from '@angular/core';
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-upcoming-activities',
  templateUrl: './upcoming-activities.component.html',
  styleUrls: ['./upcoming-activities.component.scss'],
  imports: [
    NgbTooltip
  ],
  standalone: true
})

/**
 * Upcoming Activites Component
 */
export class UpcomingActivitiesComponent implements OnInit {

  // Upcoming Activities
  @Input() UpcomingActivities: Array<{
    date?: string;
    day?: string;
    time?: string;
    content?: string;
    users: Array<{
      name?: string;
      profile?: string;
      variant?: string;
    }>;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
