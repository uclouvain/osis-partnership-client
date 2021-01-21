import { Component, ElementRef } from '@angular/core';
import { AuthentificationService } from './services/authentification.service';
import { Observable } from 'rxjs';
import User from './interfaces/user';
import { HtmlElementPropertyService } from './services/html-element-property.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'osis-partnership-client';

  constructor(
    private authentificationService: AuthentificationService,
    private htmlElementPropertyService: HtmlElementPropertyService,
    elm: ElementRef
  ) {
    this.htmlElementPropertyService.setRef(elm);
  }

  currentUser(): Observable<User> {
    return this.authentificationService.currentUser;
  }
}
