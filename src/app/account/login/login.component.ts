import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';

// Login Auth
import {NgClass} from "@angular/common";
import {NgbCarousel, NgbSlide} from "@ng-bootstrap/ng-bootstrap";
import {AuthLoginStore} from "@app/account/data-access/auth.login.store";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    NgClass,
    ReactiveFormsModule,
    RouterLink,
    NgbCarousel,
    NgbSlide,
    FormsModule
  ],
  standalone: true
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
  public authLoginStore = inject(AuthLoginStore);

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      sala_id: [1, [Validators.required]],
      user: ['', [Validators.required]],
      pass: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.authLoginStore.loadLogin(this.loginForm.value);
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
