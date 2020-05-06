import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  glolabUrl: string = "http://localhost:9092/";
  addUserUrl: string = "api/users/addUser";

  constructor(private httpClient: HttpClient) { }


  addUser(user: User) {
    return this.httpClient.post(`${this.glolabUrl}${this.addUserUrl}`, user, { responseType: 'text' as 'json' });
  }

}
