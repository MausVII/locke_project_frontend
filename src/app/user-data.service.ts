import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';
import { ReqInfoService } from './req-info.service';
import { saveAs } from 'file-saver';
import { FilesService } from './files.service';

interface User {
  id: string
  username: string
  role: Role[]
  createdAt: Date | null
  specFileIds: string[]
  parsedFileIds: string[]
  recordIds: string[]
}

interface Role {
  id: string
  authority: string
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  filesService: FilesService
  reqInfoService: ReqInfoService
  userData: User
  lastHistory: MetaTag | null = null
  token: string | null = null

  constructor(private http: HttpClient, private router: Router, filesService: FilesService, reqInfoService: ReqInfoService) {
    this.userData = {id: "", username: "", role: [], createdAt: null, specFileIds: [], parsedFileIds: [], recordIds: []}
    this.filesService = filesService
    this.reqInfoService = reqInfoService
  }

  signup(userData: {username: string, password: string, role: string}) {
    this.http.post<User>(`${environment.apiUrl}/users/register`, {
      username: userData.username, password: userData.password, role: userData.role
    }, {observe: "response", withCredentials: true})
    .subscribe({next: res => {
      if(res.status == 400) {

      } else if(res.body) {
        this.userData = res.body
        this.router.navigate(['home'])
      }
    }})
  }

  login(userData: {username: string, password: string}) {
    this.http.post<User>(`${environment.apiUrl}/auth/login`, {
      username: userData.username,
      password: userData.password
    }, {
      observe: "response",
      withCredentials: true,
    })
    .subscribe({
      next: (res) => {
        if(res.body) {
          if(res.headers.get('authorization')) {
            this.token = res.headers.get('authorization')
          }

          this.userData = res.body
          this.filesService.setUserId = res.body.id
          this.filesService.getRecords()
          this.filesService.getSpecs()
          this.getLastHistory()

          this.router.navigate(['home'])
        }
      }
    })
  }

  getUserData() {
    this.http.get<User>(`${environment.apiUrl}/users/${this.userData.id}`, {withCredentials: true})
    .subscribe({ next: (data) => this.userData = data})
  }

  logout() {
    this.reqInfoService.logInSucceeded()
    this.userData = {id: "", username: "", role: [], createdAt: null, specFileIds: [], parsedFileIds: [], recordIds: []}
    this.token = null
  }

  public uploadSpecFile(file: File) {
    let reqData = new FormData()
    reqData.append("file", file)
    reqData.append("specName", file.name)

    this.http.post(`${environment.apiUrl}/files/spec-file/user/${this.userData.id}`, reqData, {observe: "response", withCredentials: true})
    .subscribe({ next: res => {
      if (res.status == 201) {
        this.reqInfoService.succeededSpecUpload()
      } else {
        this.reqInfoService.failedSpecUpload()
      }
    }})
  }

  public uploadFlatFile(file: File, specId: string) {
    let reqData = new FormData()
    reqData.append("file", file)
    reqData.append("flatFileName", file.name)
    reqData.append("specFileId", specId)

    this.http.post(`${environment.apiUrl}/files/flat-file/user/${this.userData.id}`, reqData, {observe: "response", withCredentials: true})
    .subscribe({ next: res => {
      if (res.status == 201) {
        this.reqInfoService.succeededFlatUpload()

        this.filesService.getRecords()
      } else {
        this.reqInfoService.failedFlatUpload()
      }
    }})
  }

  public getLastHistory() {
    this.http.get<MetaTag>(`${environment.apiUrl}/files/history/last/${this.userData.id}`, {withCredentials: true})
    .subscribe({ next: (data) => {
      this.lastHistory = data
    }})
  }

  get specs() {
    return this.userData.specFileIds
  }

  get parsed() {
    return this.userData.parsedFileIds
  }

  get records() {
    return this.userData.recordIds
  }

  // getFilePaths() {
  //   this.http.get<string[]>(`${environment.apiUrl}/files/flat-files/paths/user/${this.userData.id}`)
  //   .subscribe({ next: data => {
  //     this.userFlatFiles = data
  //   }})
  // }

  downloadFile(filename: string) {
    this.http.get(`${environment.apiUrl}/files/flat-files/file/${filename}/user/${this.userData.id}`,
    {responseType: 'arraybuffer', withCredentials: true})
    .subscribe({ next: data => {
      saveAs(new Blob([data]), filename)
    }})
  }
  
  public get username() : string {
    return this.userData.username
  }

  public isAdmin(): boolean {
    return this.userData.role.filter(x => x.authority == "ADMIN").length == 1
  }

  public get createdAt(): string {
    return this.userData.createdAt ? this.userData.createdAt?.toString().split("T")[0].replaceAll("-", "/") 
    : ""
  }

  public get hasSpecs(): boolean {
    return this.userData.specFileIds.length > 0
  }

  public get history() {
    return this.lastHistory
  }

  formatThumbUrl(key: string) {
    return `/assets/images/thumbs/${key}.jpg`
  }

  hasUser(): boolean {
    return this.userData.id ? true : false
  }
}

interface MetaTag {
  id: string
  userId: string
  createdAt: Date
  operation: string
  fileName: string
  fileId: string
  recordsCreated: string[]
}