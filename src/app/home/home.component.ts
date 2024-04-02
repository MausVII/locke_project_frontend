import { Component, OnChanges } from '@angular/core';
import { UserDataService } from '../user-data.service';
import { ReqInfoService } from '../req-info.service';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilesService } from '../files.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userDataService: UserDataService
  filesService: FilesService
  reqInfoService: ReqInfoService

  specFileId: string = ""

  constructor(userDataService: UserDataService, filesService: FilesService, reqInfoService: ReqInfoService) {
    this.userDataService = userDataService
    this.filesService = filesService
    this.reqInfoService = reqInfoService
  }

  ngOnChanges() {
    this.userDataService.getUserData()
  }

  onSpecFileSelect(event: any) {
    const file: File = event.target.files[0]
    this.filesService.uploadSpecFile(file)
  }

  onUploadAttempt() {
    if (this.specFileId == "") {
      
    }
  }

  onFlatFileSelect(event: any) {
    if(this.userDataService.hasSpecs) {
      const file: File = event.target.files[0]
      this.userDataService.uploadFlatFile(file, this.specFileId)
    } else {
      this.reqInfoService.attemptInvalidFlatUpload()
    }
  }

  
}
