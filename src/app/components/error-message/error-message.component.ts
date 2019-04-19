import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent implements OnInit {

  public message: string;

  constructor(
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.errorMessage.subscribe(message => {
      console.log('message', message);
      this.message = message;
    });
  }

}
