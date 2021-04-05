import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employee: Employee = new Employee();

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  emailMatcher = new MyErrorStateMatcher();

  firstnameFormControl = new FormControl('', [
    Validators.required,
  ]);

  firstnameMatcher = new MyErrorStateMatcher();

  lastnameFormControl = new FormControl('', [
    Validators.required,
  ]);

  lastnameMatcher = new MyErrorStateMatcher();

  addressFormControl = new FormControl('', [
    Validators.required,
  ]);

  addressMatcher = new MyErrorStateMatcher();

  mobileFormControl = new FormControl('', [
    Validators.required,
  ]);

  mobileMatcher = new MyErrorStateMatcher();

  constructor(private employeeService: EmployeeService,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  save() {
    this.employeeService
      .createEmployee(this.employee).subscribe(data => {
        console.log(data);
        this.employee = new Employee();
        // Convert Data to get the ID
        let result_data = JSON.stringify(data);
        let json_data = JSON.parse(result_data);
        this.gotoList();
        this.openSnackBarSuccess('Employee Created with ID: ' + json_data.id, 'Success');
      },
      error => {
        console.log(error);
        this.openSnackBarFail('Employee Creation Failed!', 'Fail');
      });
  }

  // Note: ems-snackbar-success is in style.css
  openSnackBarSuccess(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      panelClass: ['ems-snackbar-success']
    });
  }

  // Note: ems-snackbar-fail is in style.css
  openSnackBarFail(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      panelClass: ['ems-snackbar-fail']
    });
  }

  onSubmit() {
    this.save();
  }

  gotoList() {
    this.router.navigate(['/employees']);
  }
}
