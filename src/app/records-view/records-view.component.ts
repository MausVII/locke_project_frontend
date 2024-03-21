import { Component } from '@angular/core';
import { UserDataService } from '../user-data.service';
import { NgFor } from '@angular/common';
import { ThumburlPipe } from '../thumburl.pipe';

@Component({
  selector: 'app-records-view',
  standalone: true,
  imports: [NgFor, ThumburlPipe],
  templateUrl: './records-view.component.html',
  styleUrl: './records-view.component.css'
})
export class RecordsViewComponent {
  userDataService: UserDataService

  constructor(userDataService: UserDataService) {
    this.userDataService = userDataService
  }
}
