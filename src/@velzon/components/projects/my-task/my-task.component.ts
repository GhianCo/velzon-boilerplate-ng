import { Component, OnInit, Input } from '@angular/core';
import {NgClass} from "@angular/common";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.scss'],
  imports: [
    NgClass,
    NgbTooltip
  ],
  standalone: true
})

/**
 * MyTask Component
 */
export class MyTaskComponent implements OnInit {

  // Upcoming Activities
  @Input() MyTask: Array<{
    name?: string;
    dedline?: string;
    status?: string;
    assignee: {
      name?: string;
      profile?: string;
    };
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
