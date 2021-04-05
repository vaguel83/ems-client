import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
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
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent implements OnInit {

  id: number;
  employee: Employee;

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

  constructor(private route: ActivatedRoute, private router: Router,
              private employeeService: EmployeeService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.employee = new Employee();

    this.id = this.route.snapshot.params.id;

    this.employeeService.getEmployee(this.id)
      .subscribe(data => {
        console.log(data);
        this.employee = data;
      }, error => console.log(error));
  }

  updateEmployee() {
    // Check if all entries have values if not error
    if ( this.employee.firstName
      && this.employee.lastName
      && this.employee.address
      && this.employee.email
      && this.employee.mobile )
    {
      this.employeeService.updateEmployee(this.id, this.employee)
        .subscribe(data => {
          console.log(data);
          this.employee = new Employee();
          // Convert Data to get the ID
          const result_data = JSON.stringify(data);
          const json_data = JSON.parse(result_data);
          this.gotoList();
          this.openSnackBarSuccess('Employee with ID: ' + json_data.id + ' was updated', 'Success');
        }, error => {
          console.log(error);
          this.openSnackBarFail('Employee Update Failed!', 'Fail');
        });
    }
    else
    {
      this.openSnackBarFail('Not all fields are filled!', 'Fail');
    }
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
    this.updateEmployee();
  }

  gotoList() {
    this.router.navigate(['/employees']);
  }
}
