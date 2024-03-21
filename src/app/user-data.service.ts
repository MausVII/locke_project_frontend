import { Injectable } from '@angular/core';

interface User {
  id: string
  username: string
  role: string
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  url = "http://localhost:8080/api/v1/users/id/65ef310c769e4f7b49b4188c"
  recordsUrl = "http://localhost:8080/api/v1/users/id/65ef310c769e4f7b49b4188c/records"

  userData: User
  userRecords: any[] | [][] = new Array()

  constructor() {
    this.userData = {id: "", username: "", role: ""}
    this.fetchUserData().then(data => {
      this.userData = data
    })

    // From [[{a: x}, {b: y}, {}], [{}, {}, {}]] => [{a: x, b: y}, {}, {}]
    this.fetchUserRecords().then( data => {
      this.userRecords = data.map((record: any) => {
        // Return object from merging array of properties into one
        return Object.assign({}, ...record.map((field: any) => {
          let temp: any = {}
          temp[field.name] = this.convertData(field.data, field.dataType)
          return temp
        }))
      })
    })

  }

  async fetchUserData() : Promise<User> {
    const data = await fetch(this.url)
    return await data.json() ?? []
  }

  async fetchUserRecords() {
    const response = await fetch(this.recordsUrl)
    let jsonData = await response.json() ?? []
    return jsonData
  }

  private convertData(data: string, dType: string): string | number | Date {
    switch(dType) {
      case "Integer":
        return parseInt(data)
      case "Date":
        return new Date(data.replace("/", "-"))
      default:
        return data
    }
  }
  
  public get username() : string {
    return this.userData.username
  }

  public get records(): any {
    return this.userRecords
  }
  
  formatThumbUrl(key: string) {
    return `/assets/images/thumbs/${key}.jpg`
  }

  hasUser(): boolean {
    return this.userData.id ? true : false
  }
}

interface Field {
  name: string
  data: string | number
}

interface RawField {
  name: string
  data: string
  dataType: string
}