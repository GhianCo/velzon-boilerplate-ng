import { Component, OnInit } from '@angular/core';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {NgStepperModule} from "angular-ng-stepper";
import {CdkStep, CdkStepLabel} from "@angular/cdk/stepper";

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  imports: [
    BreadcrumbsComponent,
    NgStepperModule,
    CdkStep,
    CdkStepLabel
  ],
  standalone: true
})

/**
 * Wizard Component
 */
export class WizardComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Wizard', active: true }
    ];
  }

     // File Upload
     imageURL: any;
     fileChange(event: any) {
       let fileList: any = (event.target as HTMLInputElement);
       let file: File = fileList.files[0];
       const reader = new FileReader();
       reader.onload = () => {
         this.imageURL = reader.result as string;
           document.querySelectorAll('#user-img').forEach((element: any) => {
             element.src = this.imageURL;
           });
       }

       reader.readAsDataURL(file)
     }

}
