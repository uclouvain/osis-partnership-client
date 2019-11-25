import { Component } from '@angular/core';
import { AuthentificationService } from './services/authentification.service';
import { Observable } from 'rxjs';
import User from './interfaces/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'osis-partnership-client';

  constructor(private authentificationService: AuthentificationService) {}

  currentUser(): Observable<User> {
    return this.authentificationService.currentUser;
  }
}
