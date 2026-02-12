import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { ChangePasswordPopupComponent } from './change-password-popup/change-password-popup.component';
import { ProfileService } from 'src/app/service/profile.service';
import { UserProfileData } from 'src/app/models/user-profile-dto';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { UserProfileReportType } from 'src/app/common/enum/enum';
import { PreviousRouteService } from 'src/app/service/previous-route.service';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  userData= new UserProfileData();
  roleList:string[];
  selectedFiles?: FileList;
  currentFile?: File;
  preview = '';
  fileUrl: any;
  userName=null;
  phoneNumber=null;
  previousUrl ='/dashboard/dash'

  userNameValueChange(username:any){
    this.userName=username;
  }

  phoneNumberValueChange(phoneNumber:any){
    this.phoneNumber=phoneNumber;
  }

  constructor(private userProfileService:ProfileService,public dialog: MatDialog,
    private route:Router, private toastr:ToastrService,
    private fileUploadService:FileUploadService,private previousRoute:PreviousRouteService
    ,private translate: TranslateService){

    }

  ngOnInit(): void {
      this.userProfileService.getUserProfileData().subscribe((value)=>{
        if(value){
          this.roleList=[];
          this.userData=value;
          this.getImage(this.userData.profileUrl);
          value.userRoleList.forEach((role)=>{
            this.roleList.push(role.roleName);
          })
        }
      });
      this.previousRoute.getRouterValue().subscribe(response=>{
        if (response) {
          this.previousUrl = response;
        }
      })

  }

  selectFile(event: any): void {

    this.preview = '/assets/ProfilePic.png';

    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File= this.selectedFiles.item(0);

      const allowedFileTypes = ['image/png', 'image/jpeg', 'image/png'];

      if (file) {

        if (!allowedFileTypes.includes(file.type)) {
          // Invalid file type
          this.toastr.error(this.translate.instant('File_errors.invalid_type'));
          return
        }

        this.currentFile = file;
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }

    }
  }


  editSave=true;

  editSaveChanges()
  {
    this.editSave=!this.editSave;
  }

  saveChanges(){
   const updatedUserData = new UserProfileData();
   if(this.userName!=null || this.phoneNumber!=null){
    updatedUserData.userName=this.userName;
    sessionStorage.setItem("username",updatedUserData.userName!=null?updatedUserData.userName:sessionStorage.getItem("username"));
    updatedUserData.phoneNumber=this.phoneNumber;

  // Assigning null value to the used variables inorder to avoid duplicate entries in further operations
    this.userName=null;
    this.phoneNumber=null
   }

   if(this.currentFile!=null && this.currentFile!=undefined && (updatedUserData.userName!=null || updatedUserData.phoneNumber)){
          this.updatingUserDataAndLogo(updatedUserData); // This method will be called when both profile picture and data are modified by user
   }
   else if(this.currentFile!=null && this.currentFile!=undefined ){
          this.updateProfilePicture();  // This method will be called when profile picture alone is modified by user
   }
   else{
          this.updateProfileData(updatedUserData); // This method will be called when profile data alone is modified by user
   }

  }

  updatingUserDataAndLogo(updatedUserData:UserProfileData){
    this.userProfileService.editUserProfileData(updatedUserData).subscribe((value)=>{
      if(value['content']){
        const userId:number=this.userData.userId;
        this.fileUploadService.upload(
          [this.currentFile],
          userId.toString(),
          UserProfileReportType.RP_TYPE).subscribe((response)=>{
            if(response) {
              const downloadUrl = response.content;
              this.fileUrl=downloadUrl
            }
            this.userProfileService.saveUserProfileUrl(userId,this.fileUrl).subscribe((data)=>{
              this.editSave=!this.editSave;
              this.toastr.success(this.translate.instant('Toaster_success.profile_update'));
              this.userProfileService.setValue(true);
            });
          });
      }
    })
  }


  updateProfilePicture() {
    const userId: number = this.userData.userId;
    this.fileUploadService.upload(
      [this.currentFile],
      userId.toString(),
      UserProfileReportType.RP_TYPE).subscribe((response) => {
        if (response) {
          const downloadUrl = response.content;
          this.fileUrl = downloadUrl
        }
        this.userProfileService.saveUserProfileUrl(userId, this.fileUrl).subscribe((data)=>{
          this.editSave = !this.editSave;
          this.toastr.success(this.translate.instant('Toaster_success.profile_update'));
          this.userProfileService.setValue(true);
        });
      });


  }


  updateProfileData(updatedUserData: UserProfileData) {
    this.userProfileService.editUserProfileData(updatedUserData).subscribe((value)=>{
      if(value['content']){
        this.editSave=!this.editSave;
        this.userProfileService.setValue(true);
        this.toastr.success(this.translate.instant('Toaster_success.profile_update'));
      }
    })
  }


  openDialog(): void {
    const no_of_paper = null;
    const paymentMethod = null;
    const dialogRef = this.dialog.open(ChangePasswordPopupComponent, {
      width: '550px',
      // height: '560px',
      data: {
        // noOfPaper: no_of_paper,
        // Payment_Method: paymentMethod

      },

    });

    dialogRef.afterClosed().subscribe(result => {

      this.ngOnInit();

    });
  }

  onBack(){
    this.route.navigate([this.previousUrl]);
  }

  getImage(profileUrl: string): void {
    this.preview=''
    if(profileUrl===null || this.preview===''){
      this.preview='/assets/ProfilePic.png';
    }
    this.fileUploadService.downloadImageByImageName(profileUrl).subscribe((response:Blob)=>{
      const reader = new FileReader();
        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };
       reader.readAsDataURL(response);
    });
  }
}

