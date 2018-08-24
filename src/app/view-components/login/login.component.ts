import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderUsernameService } from '../../services/header-information-services/header-content.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router,  private headerService: HeaderUsernameService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.loginForm = this.formBuilder.group({
      username: ['', [
        Validators.required
      ]]
    });
  }

  onLogin(){
    
    if (this.loginForm.valid) {
      this.headerService.changeUserName(this.loginForm.get("username").value.trim());
      this.router.navigate(['/introduction']);
    }

  }

}
