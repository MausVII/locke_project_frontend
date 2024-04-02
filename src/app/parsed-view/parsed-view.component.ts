import { Component } from '@angular/core';
import { UserDataService } from '../user-data.service';
import { NgFor, KeyValuePipe } from '@angular/common';
import { FilesService } from '../files.service';

@Component({
  selector: 'app-parsed-view',
  standalone: true,
  imports: [NgFor, KeyValuePipe],
  templateUrl: './parsed-view.component.html',
  styleUrl: './parsed-view.component.css'
})
export class ParsedViewComponent {
  filesService: FilesService

  constructor(filesService: FilesService) {
    this.filesService = filesService
    this.filesService.getParsedFiles()
  }

  stringifyParsedFile(parsedFile: any) {
    return JSON.stringify(parsedFile, null, 2)
  }
}
