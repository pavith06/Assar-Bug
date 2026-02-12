import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserProfileData } from '../models/user-profile-dto';
import { ChangePasswordDto } from '../models/profile-dto/change-password-dto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
 
  baseUrl=environment.API_BASE_URL+"/api/user-profile";
  private getProfilePicture = new BehaviorSubject<boolean>(false);
  constructor(private request:HttpClient) { }

  getUserProfileData(){
      return  this.request.get<UserProfileData>(this.baseUrl+"/get-user");
  }

  editUserProfileData(userData:UserProfileData){
    return this.request.post(this.baseUrl+"/update-user",userData);
  }

  changePassword(passwordDto: ChangePasswordDto) {
    return this.request.post(this.baseUrl+"/change-password",passwordDto);
  }

  saveUserProfileUrl(userId:number,profileUrl:string){
    return this.request.get(this.baseUrl+"/save-userProfileUrl?userId="+userId+"&url="+profileUrl);
  }

  getUserProfilePicture(userIdentity:string){
      return this.request.get(this.baseUrl+"/get-profilepic?user_identity="+userIdentity);
  }

  setValue(value: boolean) {
    this.getProfilePicture.next(value);
  }

  getValue() {
    return this.getProfilePicture.asObservable();
  }

}
