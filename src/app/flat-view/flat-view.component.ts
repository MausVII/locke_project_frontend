import { Component } from '@angular/core';
import { UserDataService } from '../user-data.service';
import { NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-flat-view',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './flat-view.component.html',
  styleUrl: './flat-view.component.css'
})
export class FlatViewComponent {
  userDataService: UserDataService

  constructor(userDataService: UserDataService) {
    this.userDataService = userDataService
    // this.userDataService.getFilePaths()
  }

  hasNoFlatFiles() {
    return this.userDataService.parsed.length == 0
  }
  
  onDownload(filename: string) {
    this.userDataService.downloadFile(filename)
  }
}
