import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PaperDetailsListDto } from 'src/app/models/paper-details-dto/paper-details-list-dto';
import { FileTypeEnum } from 'src/app/models/report-loss-dto/FileTypeEnum';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { PaperDetailService } from 'src/app/service/paper-details.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-paper-details-popup',
  templateUrl: './view-paper-details-popup.component.html',
  styleUrls: ['./view-paper-details-popup.component.scss']
})
export class ViewPaperDetailsPopupComponent {
  paperDetailsDto = new PaperDetailsListDto();
  emailDataVo:PaperDetailsListDto[]=[];
  fileUrl: string;
  constructor(public dialogRef: MatDialogRef<ViewPaperDetailsPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,private paperService: PaperDetailService,
  private authorityPaperService : AuthorityPaperService,
  private toaster:ToastrService, private translate : TranslateService) {


     console.log('Dialog data:', data);
    dialogRef.disableClose = true;
    this.paperDetailsDto.createdDate = this.data.revokeData.createdDate;
    this.paperDetailsDto.pdDigiltaPaperId = this.data.revokeData.pdDigiltaPaperId;
    this.paperDetailsDto.pdInsuredName = this.data.revokeData.pdInsuredName;
    this.paperDetailsDto.digitalPaperId = this.data.revokeData.digitalPaperId;
    this.paperDetailsDto.pdPolicyNumber = this.data.revokeData.pdPolicyNumber;
    this.paperDetailsDto.pdEffectiveFrom = this.data.revokeData.pdEffectiveFrom;
    this.paperDetailsDto.pdExpireDate = this.data.revokeData.pdExpireDate;
    this.paperDetailsDto.pdPhoneNumber = this.data.revokeData.pdPhoneNumber;
    this.paperDetailsDto.pdEmailId = this.data.revokeData.pdEmailId;
    this.paperDetailsDto.vdRegistrationNumber = this.data.revokeData.vdRegistrationNumber;
    this.paperDetailsDto.vdChassis = this.data.revokeData.vdChassis;
    this.paperDetailsDto.vdLicensedToCarry = this.data.revokeData.vdLicensedToCarry;
    this.paperDetailsDto.vdMake = this.data.revokeData.vdMake;
    this.paperDetailsDto.vdModel = this.data.revokeData.vdModel;


     this.paperDetailsDto.vdVehicleMake = this.data.revokeData.vdVehicleMake;
     this.paperDetailsDto.reasonId = this.data.revokeData.reasonId;
     console.log("reason data", this.paperDetailsDto.reasonId);
   
    this.paperDetailsDto.vdUsage = this.data.revokeData.vdUsage;
    this.paperDetailsDto.insurer = this.data.revokeData.insurer;
    this.paperDetailsDto.companyId = this.data.revokeData.companyId;
    this.paperDetailsDto.companyName = this.data.revokeData.companyName;
    this.paperDetailsDto.fileURL = this.data.revokeData.fileURL;
console.log('Effective From:', this.paperDetailsDto.pdEffectiveFrom);
console.log('Expire Date:', this.paperDetailsDto.pdExpireDate);

  }

 


  closeDialog() {
    this.dialogRef.close('Pizza!');
  }

  getImage(item:PaperDetailsListDto){
    this.fileUrl=item.fileURL;
    return this.fileUrl;
  }

  // emailShare(data:PaperDetailsListDto){
  //   this.emailDataVo =[];
  //   this.emailDataVo.push(data);

  //   this.authorityPaperService.sendEmail(this.emailDataVo).subscribe((data:any)=>{
  //     if(data.content !== ''){
  //       this.toaster.success(this.translate.instant('Toaster_success.email'));
  //     }
  // });

  // }

emailShare(data: PaperDetailsListDto) {
  console.log("📩 Email share clicked");

  if (!this.fileUrl) {
    console.error("❌ No file URL available");
    return;
  }

  // Fetch image blob from server
  this.paperService.getImageFromUrl(this.fileUrl).subscribe((blob: Blob) => {
    console.log("✅ Original blob fetched:", blob);
    console.log("📏 Original size:", (blob.size/1024/1024).toFixed(2), "MB");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
      console.log("✅ Image loaded:", img.width, "x", img.height);

      // Draw image on canvas
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      // Compress to JPG (0.25 quality ~200 KB)
      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.25);
      console.log("📎 Compressed Base64 preview (first 80 chars):", compressedBase64.substring(0, 80));

      const base64Length = compressedBase64.split(",")[1].length;
      console.log("🧩 Base64 length:", base64Length);

      // Create fake file name
      const fileName = `compressed-${data.pdPolicyNumber}.jpg`;

      // Prepare payload
      this.emailDataVo = [{
        ...data,
        fileURL: compressedBase64, // send Base64
        fileExtension: "jpg",
        fileName: fileName
      }];

      console.log("📨 Final Payload ready to send:", this.emailDataVo);

      // Send email
      this.authorityPaperService.sendEmail(this.emailDataVo).subscribe({
        next: (resp) => console.log("✅ Email API Response:", resp),
        error: (err) => console.error("❌ Email send failed:", err)
      });
    };

    img.onerror = (err) => console.error("❌ Image load error:", err);
  });
}


async onDownloading() {
  if (!this.fileUrl) {
    console.error("No file URL found");
    return;
  }

  this.paperService.getImageFromUrl(this.fileUrl).subscribe(async (value) => {
    if (!value) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = URL.createObjectURL(value);

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `digital-paper-${this.paperDetailsDto.pdPolicyNumber}.jpg`; // save jpg
        a.click();
        URL.revokeObjectURL(url);

      }, "image/jpeg", 0.6); // ✅ JPEG + compression
    };
  });
}
 reasonMap: any = {
  1: 'Invalid Vehicle Details',
  2: 'Wrong Period of Cover',
  3: 'Suspension',
  4: 'Cancellation'
};

getReasonLabel(id: number | null) {
  if (!id) return ''; // hide if null
  return this.reasonMap[id] || '';
}

}
export class DialogData {
  revokeData: PaperDetailsListDto;

}
