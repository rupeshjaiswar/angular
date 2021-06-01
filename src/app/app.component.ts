import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { forbiddenNameValidator } from './shared/user-name.validator';
import { passwordValidator } from './shared/password.validator';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  registrationForm: FormGroup;

  get userName() {
    return this.registrationForm.get('userName');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get alternateEmails() {
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  addAlternateEmail() {
    this.alternateEmails.push(this.fb.control(''));
  }

  constructor(private fb: FormBuilder, private _registrationService: RegistrationService) { }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), forbiddenNameValidator(/password/)]],
      email: [''],
      subscribe: [false],
      password: [''],
      confirmPassword: [''],
      address: this.fb.group({
        city: [''],
        state: [''],
        postalCode: ['']
      }),
      alternateEmails: this.fb.array([])
    }, {validator: passwordValidator});

    this.registrationForm.get('subscribe')?.valueChanges
    .subscribe(checkedValue => {
      const email = this.registrationForm.get('email');
      if (checkedValue) {
        email?.setValidators(Validators.required);
      } else {
        email?.clearValidators();
      }
      email?.updateValueAndValidity();
    });

  }



  // title = 'reactive-forms';

  //using FormGroup and FormControl Service

  // registrationForm = new FormGroup({
  //   userName: new FormControl('Rupesh'),
  //   password: new FormControl(''),
  //   confirmPassword: new FormControl(''),
  //   address: new FormGroup({
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //     postalCode: new FormControl('')

  //   })
  // });

  loadApiData() {
    // this.registrationForm.setValue({
    //   userName: "Bruce Wayne",
    //   password: "test123",
    //   confirmPassword: "test123",
    //   address: {
    //     city: 'City',
    //     state: 'State',
    //     postalCode: '400076'
    //   }

    this.registrationForm.patchValue({
      userName: "Bruce Wayne",
      password: "test123",
      confirmPassword: "test123",
      // address: {
      //   city: 'City',
      //   state: 'State',
      //   postalCode: '400076'
      // }
    });
  }

  onSubmit() {
    // console.log(this.registrationForm.value);
    this._registrationService.register(this.registrationForm.value)
      .subscribe(
        response => console.log('Success', response),
        error => console.error('Error!', error)
      );
  }

  //using FormBuilder Service
}
