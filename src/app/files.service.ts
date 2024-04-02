import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment.development';
import { ReqInfoService } from './req-info.service';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  userId: string = ""
  userSpecs: Spec[] | [] = []
  userParsed: Parsed[] | [] = []
  userRecords: Record[] | [] = []
  constructor(private http: HttpClient, private router: Router, private infoService: ReqInfoService) { }

  public uploadSpecFile(file: File) {
    let reqData = new FormData()
    reqData.append("file", file)
    reqData.append("specName", file.name)

    this.http.post(`${environment.apiUrl}/files/spec/file/user/${this.userId}`, reqData, {observe: "response", withCredentials: true})
    .subscribe({ next: (res) => {
      if(res.status == 201) {
        
        this.infoService.succeededSpecUpload()
      } 
    }})
  }

  public uploadFlatFile(file: File, specId: string) {
    let reqData = new FormData()
    reqData.append("file", file)
    reqData.append("flatFileName", file.name)
    reqData.append("specFileId", specId)

    this.http.post(`${environment.apiUrl}/files/flat-file/user/${this.userId}`, reqData, {observe: "response", withCredentials: true})
    .subscribe({ next: res => {
      if (res.status == 201) {
        this.infoService.succeededFlatUpload()
      } else {
        this.infoService.failedFlatUpload()
      }
    }})
  }

  public getSpecs() {
    this.http.get<Spec[]>(`${environment.apiUrl}/files/spec-files/user/${this.userId}`, {withCredentials: true})
    .subscribe({ next: (data) => this.userSpecs = data})
  }

  public getRecords() {
    this.http.get<Record[]>(`${environment.apiUrl}/users/id/${this.userId}/records`, {withCredentials: true})
    .subscribe({ next: (data) => {
      this.userRecords = data
      this.userRecords.forEach(x => {
        if(x.fields.publishDate != undefined) {
         x.fields.publishDate = x.fields.publishDate.split('T')[0]
        }
      })
    }})
  }

  public filterRecords(filter: string, value: any) {
    return this.records.filter(x => x.fields[filter] != undefined && x.fields[filter] == value)
  }

  public getParsedFiles() {
    this.http.get<Parsed[]>(`${environment.apiUrl}/files/parsed-files/user/${this.userId}`, {withCredentials: true})
    .subscribe({ next: (data) =>  this.userParsed = data})
  }

  get specs() {
    return this.userSpecs
  }

  get parsed() {
    return this.userParsed
  }

  get records() {
    return this.userRecords
  }

  set setUserId(userId: string) {
    this.userId = userId
  }

  formatThumbUrl(key: string) {
    return `/assets/images/thumbs/${key}.jpg`
  }

  getTags(record: Record) {
    return Object.entries(record.fields).filter(x => x[0] != "thumbUrl")
  }
}

interface Spec {
  id: string
  userId: string
  name: string
  fields: Object[]
  parsedFileIds: string[]
  recordIds: string[]
  createdAt: string
}

interface Parsed {
  id: string
  name: string
  recordIds: string[]
  createdAt: string
}

interface Record {
  id: string
  fields: any
}