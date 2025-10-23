import { Component, OnInit, Input } from '@angular/core';
import {NgbProgressbar} from "@ng-bootstrap/ng-bootstrap";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-active-project',
  templateUrl: './active-project.component.html',
  styleUrls: ['./active-project.component.scss'],
  imports: [
    NgbProgressbar,
    NgClass
  ],
  standalone: true
})

/**
 * Active Project Component
 */
export class ActiveProjectComponent implements OnInit {

  // Upcoming Activities
  @Input() ActiveProjects: Array<{
    Pname?: string;
    profile?: string;
    Uname?: string;
    progress?: any;
    assignee: Array<{
      profile?: string;
    }>;
    status?: string;
    date?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
