import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NgbCarousel, NgbSlide} from "@ng-bootstrap/ng-bootstrap";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss'],
  imports: [
    NgbCarousel,
    NgbSlide,
    ReactiveFormsModule,
    NgClass
  ],
  standalone: true
})

/**
 * Cover Component
 */
export class CoverComponent implements OnInit {

 // Login Form
 passresetForm!: UntypedFormGroup;
 submitted = false;
 fieldTextType!: boolean;
 error = '';
 returnUrl!: string;
 // set the current year
 year: number = new Date().getFullYear();
 // Carousel navigation arrow show
 showNavigationArrows: any;

 constructor(private formBuilder: UntypedFormBuilder) { }

 ngOnInit(): void {
   /**
    * Form Validatyion
    */
    this.passresetForm = this.formBuilder.group({
     email: ['', [Validators.required]]
   });
 }

 // convenience getter for easy access to form fields
 get f() { return this.passresetForm.controls; }

 /**
  * Form submit
  */
  onSubmit() {
   this.submitted = true;

   // stop here if form is invalid
   if (this.passresetForm.invalid) {
     return;
   }
 }
}
