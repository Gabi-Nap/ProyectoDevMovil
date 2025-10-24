import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { AuthService } from '../auth/authService';
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
  //boton logout
  async logout(){
    await this.authService.logout();
    this.router.navigate(["/login"]);
  }
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