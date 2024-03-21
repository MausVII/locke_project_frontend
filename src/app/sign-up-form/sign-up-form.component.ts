import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.css'
})
export class LoginFormComponent {
  roles = ["User", "Admin"]
  
  userData = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
    role: new FormControl("User")
  })

  onSubmit() {
    console.log(this.userData.value)
  }

}
