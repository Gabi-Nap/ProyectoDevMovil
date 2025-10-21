import { Component } from '@angular/core';
import { AuthService } from '../auth/authService';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page {
  email = '';
  password = '';

  constructor(private authService: AuthService,private router: Router) {}

  async login() {
    try {
      const user = await this.authService.login(this.email, this.password);
      console.log('Login correcto:', user);
      this.router.navigate(['/tabs/tab1']);
    } catch (err) {
      console.error(err);

    }
  }

  
}