import { Component } from '@angular/core';
import { UserDataService } from '../user-data.service';
import { KeyValuePipe, NgFor } from '@angular/common';
import { FilesService } from '../files.service';

@Component({
  selector: 'app-specs-view',
  standalone: true,
  imports: [NgFor, KeyValuePipe],
  templateUrl: './specs-view.component.html',
  styleUrl: './specs-view.component.css'
})
export class SpecsViewComponent {
  userDataService: UserDataService
  filesService: FilesService

  constructor (userDataService: UserDataService, filesService: FilesService) {
    this.userDataService = userDataService
    this.filesService = filesService
    this.filesService.getSpecs()
  }

  stringifySpec(spec: any): String {
    return JSON.stringify(spec, null, 2)
  }
}