import {Observable} from 'rxjs';
import {EmployeeService} from '../employee.service';
import {Employee} from '../employee';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DialogDeleteComponent} from '../dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  // This is the full list with all the info uncomment this and the commented html lists for the full list.
  // displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'address', 'mobile', 'actions'];
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'actions'];
  employees_data: Observable<Employee[]>;

  constructor(private employeeService: EmployeeService,
              private router: Router,
              private snackBar: MatSnackBar,
              private deleteDialog: MatDialog) {}

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.employees_data = this.employeeService.getEmployeesList();
  }

  openDeleteDialog(id: number){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.deleteDialog.open(DialogDeleteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      if ( value === true )
      {
        this.deleteEmployee(id);
      }
    });
  }

  deleteEmployee(id: number) {
      this.employeeService.deleteEmployee(id)
        .subscribe(
          data => {
            console.log(data);
            this.reloadData();
            this.openSnackBarSuccess('Employee with ID: ' + id + ' was deleted', 'Success');
          },
          error => {
            console.log(error);
            this.openSnackBarFail('Employee deletion Failed!', 'Fail');
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

  employeeDetails(id: number){
    this.router.navigate(['details', id]);
  }

  updateEmployee(id: number){
    this.router.navigate(['update',id]);
  }
}
