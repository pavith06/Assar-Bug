import { Component, HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChequePopupComponent } from '../cheque-popup/cheque-popup.component';
import { ReportLossService } from 'src/app/service/report-loss.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { File_ref_tupe,  PaymentChoice } from 'src/app/common/enum/enum';
import { ToastrService } from 'ngx-toastr';
import { PurchaseStockData } from 'src/app/models/field-group-dto';
import { Observable, ReplaySubject } from 'rxjs';
import { FileUploadDTO } from 'src/app/models/entity-management-dto/insurance-company';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { PropertyValues } from 'src/app/models/purchase-stock-dto/propert-values-dto';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { JsonService } from 'src/app/service/json.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-purchase-stock-popup',
  templateUrl: './purchase-stock-popup.component.html',
  styleUrls: ['./purchase-stock-popup.component.scss']
})
export class PurchaseStockPopupComponent {

  creditCardCheckbox = false;
  paperAmt = 0;
  NumberOfPaper: number[] = [500, 1000, 2000];
  propName: string;
  propDecimal = 0;
  propDeci: string;
  numberOfKeyValue: number;
  validateinputvalue: boolean;
  englishJson: any;
  blockProceedToPay = false;
  Numberofpaper(event: any) {
    this.Papers = event.target.innerText;

  }
  fileName: string;
  purchase_id: number;
  paymentMethodSelect: string;

  constructor(public dialogRef: MatDialogRef<PurchaseStockPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog, private tosterservice: ToastrService, private fileService: FileUploadService,
    private dataservice: ReportLossService, private authorityPaperService : AuthorityPaperService,private json:JsonService, private translate: TranslateService) {
    this.Papers = data.noOfPaper;

    this.json.getEnglishJson().subscribe((response)=>{
      if(response){
        this.englishJson=response;
      }
    });

    if(data.purchaseAmount &&  data.Payment_Method){
      this.paymentMethodSelect = data.Payment_Method;
      this.totalCost = data.purchaseAmount;
    this.reactiveForm.get("totalCostValue").setValue(this.totalCost.toString());
    this.reactiveForm.get("paymentMethod").setValue(this.paymentMethodSelect.toString());
    }

    if (this.paymentMethodSelect === PaymentChoice.CHEQUE) {
      this.chequeisActive = false;
      this.chequeActive = true;
      this.credit_card = false;
      this.airtel = false;
      this.debitcard = false;
      this.upipayment = false;
      this.cheque = true;
      this.cash = false;
    }
    else if (this.paymentMethodSelect === PaymentChoice.CASH) {
      this.cashpaymentActive = true;
      this.cashpaymentInActive = false;
      this.credit_card = false;
      this.airtel = false;
      this.debitcard = false;
      this.upipayment = false;
      this.cheque = false;
      this.cash = true;
    }
    else if (this.paymentMethodSelect === PaymentChoice.CREDIDCARD) {
      this.credit_card = true;
      this.airtel = false;
      this.debitcard = false;
      this.upipayment = false;
      this.cheque = false;
      this.cash = false;
      this.creditcardisInActive = false;
      this.creditcardActive = true;
    }
    else if (this.paymentMethodSelect === PaymentChoice.UPI) {
      this.credit_card = false;
      this.airtel = false;
      this.debitcard = false;
      this.upipayment = true;
      this.cheque = false;
      this.cash = false;
      this.upiInActive = false;
      this.upiActive = true;

    }
    else if (this.paymentMethodSelect === PaymentChoice.AIRTELMONEY) {
      this.credit_card = false;
      this.airtel = true;
      this.debitcard = false;
      this.upipayment = false;
      this.cheque = false;
      this.cash = false;

      this.aittelmoneyInActive = false;
      this.airtelmoneyActive = true;
    }
    else if (this.paymentMethodSelect === PaymentChoice.DEBITCARD) {
      this.credit_card = false;
      this.airtel = false;
      this.debitcard = true;
      this.upipayment = false;
      this.cheque = false;
      this.cash = false;
      this.debitcardInActive = false;
      this.debitcardActive = true;
    }


  }
  totalCost = '0';


  closeDialog(value) {
    this.dialogRef.close(value);
  }

  fileList: File[] = [];
  fileListduplicate: File[] = null;
  filesize: number;
  fileboolean = false;
  readOnly?: boolean = true;
  fileType: string;
  Papers = '0';
  showFile = false;
  AvailableStockAmt = 0;
  updateFileDataCopyList = new updateFileList();
  purchaseDataList = new PurchaseStockData();
  fileNameList: updateFileList[] = [];

  reactiveForm = new FormGroup({
    numberOfPapers: new FormControl('', [Validators.required]),
    totalCostValue: new FormControl('', [Validators.required]),
    paymentMethod: new FormControl('', [Validators.required]),
    currencyType: new FormControl('', [Validators.required]),
  })

  ngOnInit(): void {
    // this.totalCost="0";
    this.getStockDetails();
    this.getplateFormValue();
  }

  get_Papers() {
    return this.reactiveForm.get('numberOfPapers')?.value;
  }

  set_Papers(value) {
    this.reactiveForm.get('numberOfPapers')?.setValue(value);
  }

  fileDelete(fileName: string) {
    this.fileNameList.forEach((element, index) => {
      if (element.name === fileName) {
        this.fileNameList.splice(index, 1);
        this.fileList.splice(index, 1);
      }
    })
    // let index = this.fileNameList.indexOf()
    // this.fileNameList.splice(index,1);
  }


  caption = 'Choose an image';

  captionPdf = 'Choose a PDF';

  base64Output: string;
  file: File = null;

  onFileSelected(event) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
    });
  }
  matcher(event) {
    const allowedRegex = /[0-9]/g;
    if (!event.key.match(allowedRegex)) {
      event.preventDefault();
    }
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }




  // onChange(event: any) {


  //   this.file = event.target.files[0];
  //   this.fileName = this.file.name;
  //   this.fileType = this.file.type;

  //   this.fileList.push(event.target.files[0]);
  //   this.convertFile(event.target.files[0]).subscribe(base64 => {
  //     this.base64Output = base64;

  //     this.showFile = true;
  //     const fileOk = new updateFileList;
  //     fileOk.name = event.target.files[0].name;
  //     fileOk.size = event.target.files[0].size * 0.000977;
  //     fileOk.file = this.base64Output;
  //     fileOk.fileType = event.target.files[0].type;

  //     this.fileNameList.push(fileOk);
  //     const size = this.fileList[this.fileList.length - 1].size;
  //     this.filesize = size / 1024;
  //     if (this.filesize < 20.728640) { /* empty */ }
  //   });

  // }

  onChange(event: any) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const files = event.target.files;
    const kb = 1024;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name;
        const round = Math.floor(Math.log(file.size) / Math.log(kb));
        const size = `${parseFloat((file.size / Math.pow(kb, round)).toFixed(0))} ${sizes[round]}`
      this.fileList.push(file);
      this.convertFile(file).subscribe(base64 => {
        const fileOk = new updateFileList();
        fileOk.name = fileName;
        fileOk.size = size;
        fileOk.file = base64;
        fileOk.fileType = file.type;
        this.fileNameList.push(fileOk);
      });
    }
    this.hiddenInput.nativeElement.value = null;
    this.hiddenInput.nativeElement.click();
    this.showFile = true;
  }

  @ViewChild('fileDropRef') hiddenInput: ElementRef;

  getplateFormValue() {
    this.dataservice.getplateformValue().subscribe((response: any) => {
      if (response) {
        const propertyDto: PropertyValues[] = response.content;
        propertyDto.forEach(value => {
          if (value.propertyName === 'currency') {
            this.propName = value.propertyValue;
          } else if (value.propertyName === 'cost/paper') {
            const numberValue = parseFloat(value.propertyValue);
            this.propDecimal = this.propDecimal + numberValue;
          } else if(value.propertyName === 'decimal'){
            this.propDeci = value.propertyValue
          }
        })
        if(this.Papers != '0'){
          this.totalCoustCalcu(this.Papers);
        }
      }
    });
  }
  totalCoustCalcu(event) {
    if (event != undefined) {
      const stringEvent = event.toString().replaceAll(',','');
      let data = Number(stringEvent);
      if (data === undefined) {
        data = 1;
      }
      const calculatedAmount = this.propDecimal * data;
      if(this.propDeci){
      this.totalCost = (calculatedAmount.toLocaleString()) + this.propDeci;
      this.reactiveForm.get("totalCostValue").setValue(this.totalCost.toString());
      this.reactiveForm.get("currencyType").setValue(this.propName);
      const val = this.reactiveForm.value.numberOfPapers.toString().replaceAll(',','');
      this.numberOfKeyValue = Number(val);
      const value = this.reactiveForm.controls.numberOfPapers.valid;
      this.validateinputvalue = value;
      }
    }
  }

  paperCost(value) {
    if(value !== undefined && value !== null){
    const numberValue = parseFloat(value.replace(/,/g, '')); // Remove existing commas and parse the number.
    if (!isNaN(numberValue)) {
      const formattedNumber = numberValue.toLocaleString('en-IN');
      this.Papers = formattedNumber;
    }
  }
  }

  getStockDetails() {
    this.dataservice.getStockDetails().subscribe((response: any) => {
      const stockDetailsResponce = response
      if (stockDetailsResponce) {
        this.AvailableStockAmt = stockDetailsResponce.stockCount - stockDetailsResponce.usedCount;
      }
    });
  }

  openDialog(i: number): void {
    const dialogRef = this.dialog.open(ChequePopupComponent, {
      width: '937px',
      height: '374px',
      data: {
        image: this.fileNameList[i].file,
        fileType: this.fileNameList[i].fileType,
        name:this.fileNameList[i].name

      }

    });

    dialogRef.afterClosed().subscribe();
  }

  credit_card = false;
  airtel = false;
  debitcard = false;
  upipayment = false;
  cheque = false;
  cash = false;


  creditcardisInActive = true;
  creditcardActive = false;
  aittelmoneyInActive = true;
  airtelmoneyActive = false;
  debitcardInActive = true;
  debitcardActive = false;
  upiInActive = true;
  upiActive = false;
  chequeisActive = true;
  chequeActive = false;
  cashpaymentActive = false;
  cashpaymentInActive = true;

  creditcard() {

    this.credit_card = true;
    this.airtel = false;
    this.debitcard = false;
    this.upipayment = false;
    this.cheque = false;
    this.cash = false;
    this.showFile=false;
    if(this.fileNameList.length>0){
      this.fileNameList=[];
    }


    this.creditcardisInActive = false;
    this.creditcardActive = true;
    this.airtelmoneyActive = false;
    this.aittelmoneyInActive = true;
    this.debitcardActive = false;
    this.debitcardInActive = true;
    this.upiActive = false;
    this.upiInActive = true;
    this.chequeisActive = true;
    this.chequeActive = false;
    this.cashpaymentActive = false;
    this.cashpaymentInActive = true;
    this.reactiveForm.get("paymentMethod").setValue(PaymentChoice.CREDIDCARD);
  }
  airtelMoney() {
    this.credit_card = false;
    this.airtel = true;
    this.debitcard = false;
    this.upipayment = false;
    this.cheque = false;
    this.cash = false;
    this.showFile=false;
    if(this.fileNameList.length>0){
      this.fileNameList=[];
    }

    this.creditcardisInActive = true;
    this.creditcardActive = false;
    this.aittelmoneyInActive = false;
    this.airtelmoneyActive = true;
    this.debitcardInActive = true;
    this.debitcardActive = false;
    this.upiInActive = true;
    this.upiActive = false;
    this.chequeisActive = true;
    this.chequeActive = false;
    this.cashpaymentActive = false;
    this.cashpaymentInActive = true;
    this.reactiveForm.get("paymentMethod").setValue(PaymentChoice.AIRTELMONEY);
  }
  debitCard() {
    this.credit_card = false;
    this.airtel = false;
    this.debitcard = true;
    this.upipayment = false;
    this.cheque = false;
    this.cash = false;
    this.showFile=false;
    if(this.fileNameList.length>0){
      this.fileNameList=[];
    }

    this.creditcardisInActive = true;
    this.creditcardActive = false;
    this.aittelmoneyInActive = true;
    this.airtelmoneyActive = false;
    this.debitcardInActive = false;
    this.debitcardActive = true;
    this.upiInActive = true;
    this.upiActive = false;
    this.chequeisActive = true;
    this.chequeActive = false;
    this.cashpaymentActive = false;
    this.cashpaymentInActive = true;
    this.reactiveForm.get("paymentMethod").setValue(PaymentChoice.DEBITCARD);
  }
  upi() {
    this.credit_card = false;
    this.airtel = false;
    this.debitcard = false;
    this.upipayment = true;
    this.cheque = false;
    this.cash = false;
    this.showFile=false;
    if(this.fileNameList.length>0){
      this.fileNameList=[];
    }

    this.creditcardisInActive = true;
    this.creditcardActive = false;
    this.aittelmoneyInActive = true;
    this.airtelmoneyActive = false;
    this.debitcardInActive = true;
    this.debitcardActive = false;
    this.upiInActive = false;
    this.upiActive = true;
    this.chequeisActive = true;
    this.chequeActive = false;
    this.cashpaymentActive = false;
    this.cashpaymentInActive = true;
    this.reactiveForm.get("paymentMethod").setValue(PaymentChoice.UPI);
  }
  chequemethod() {
    this.credit_card = false;
    this.airtel = false;
    this.debitcard = false;
    this.upipayment = false;
    this.cheque = true;
    this.cash = false;

    this.creditcardisInActive = true;
    this.creditcardActive = false;
    this.aittelmoneyInActive = true;
    this.airtelmoneyActive = false;
    this.debitcardInActive = true;
    this.debitcardActive = false;
    this.upiInActive = true;
    this.upiActive = false;
    this.chequeisActive = false;
    this.chequeActive = true;
    this.cashpaymentActive = false;
    this.cashpaymentInActive = true;
    this.reactiveForm.get("paymentMethod").setValue(PaymentChoice.CHEQUE);
  }
  cashPayment() {
    this.credit_card = false;
    this.airtel = false;
    this.debitcard = false;
    this.upipayment = false;
    this.cheque = false;
    this.cash = true;

    this.creditcardisInActive = true;
    this.creditcardActive = false;
    this.aittelmoneyInActive = true;
    this.airtelmoneyActive = false;
    this.debitcardInActive = true;
    this.debitcardActive = false;
    this.upiInActive = true;
    this.upiActive = false;
    this.chequeisActive = true;
    this.chequeActive = false;
    this.cashpaymentActive = true;
    this.cashpaymentInActive = false;
    this.reactiveForm.get("paymentMethod").setValue(PaymentChoice.CASH);
  }
  senddata(data) {
    alert(alert)
  }

  checkbox(event: any) {
    this.creditCardCheckbox = event.target.value;
  }
  sensorval = window.innerWidth < 600 ? true : false
  @HostListener('window:resize', ['$event'])
    onResize(event: any){
      this.sensorval=event.target.innerWidth<600?true:false

    }

  proceedTopay() {
    // if (this.reactiveForm.valid) {
    this.blockProceedToPay = true;
    const numberOFPaper:any = this.reactiveForm.controls['numberOfPapers'].value;
    this.purchaseDataList.numberOfPapers =numberOFPaper?.toString().replaceAll(',','');
    this.purchaseDataList.paymentMethod = this.reactiveForm.controls['paymentMethod'].value;
    this.purchaseDataList.totalCostValue = Number(this.reactiveForm.controls['totalCostValue'].value.replaceAll(',',''));
    this.purchaseDataList.currencyType = this.reactiveForm.controls['currencyType'].value;
    this.purchaseDataList.uploadFileName = (this.fileNameList.length > 0)?true:false;

    let inValidFileFormate = false;

    if (this.purchaseDataList.paymentMethod === "CHEQUE" || this.purchaseDataList.paymentMethod === "CASH") {

      if(this.fileList.length===0 && (this.purchaseDataList.numberOfPapers===null || this.purchaseDataList.numberOfPapers===undefined) ){
            this.blockProceedToPay = false;
            const errMsg:string=this.translate.instant('Offline_Payment_Errors.file_and_paperCount_invalid');
            this.tosterservice.error(errMsg+' '+this.purchaseDataList.paymentMethod);
      }

      else if(this.fileList.length===0){
        this.blockProceedToPay = false;
        const errMsg1:string=this.translate.instant('Offline_Payment_Errors.file_invalid1');
        const errMsg2:string=this.translate.instant('Offline_Payment_Errors.file_invalid2');
        const errorMsg3 = this.purchaseDataList.paymentMethod.charAt(0).toUpperCase() + this.purchaseDataList.paymentMethod.slice(1).toLowerCase()
        this.tosterservice.error(this.translate.instant(errMsg1 +errorMsg3 +errMsg2));
        return ;
      }

      else if (this.fileList.length>15) {
        this.blockProceedToPay = false;
        this.tosterservice.error(this.translate.instant('Offline_Payment_Errors.file_length_invalid'));
        return;
      }
      this.fileList.forEach(oneFile => {
       const inValidFile =  this.validateFile(oneFile);
       if (inValidFile) {
        inValidFileFormate = inValidFile;
        return;
       }
      });
    }
    if (inValidFileFormate) {
      this.blockProceedToPay = false;
      return;
    }

    const val = this.reactiveForm.value.numberOfPapers?.toString().replaceAll(',','');
    this.numberOfKeyValue = Number(val);
    if(this.purchaseDataList.numberOfPapers && this.purchaseDataList.paymentMethod && this.numberOfKeyValue >= 100){
    this.dataservice.saveOrUpdate(this.purchaseDataList).subscribe((response: any) => {

      this.purchase_id = response.content;
      if(this.purchaseDataList.paymentMethod !== 'CHEQUE' && this.purchaseDataList.paymentMethod !== 'CASH'){
        const successMsg1= this.translate.instant('Online_Payment_Success.message1');
        const successMsg2=this.translate.instant('Online_Payment_Success.message2');
        const stockCount = Number(this.purchaseDataList.numberOfPapers);
          this.tosterservice.success("",successMsg1+stockCount.toLocaleString() +successMsg2);
          this.closeDialog(this.purchase_id);
      }
      if (this.purchaseDataList.paymentMethod === "CHEQUE" || this.purchaseDataList.paymentMethod === "CASH") {

        const fileData: FileUploadDTO = {
          fileList: this.fileList,
          companyId: String(this.purchase_id),
          fieldName: File_ref_tupe.ref_type
        };
        this.fileService.upload(fileData.fileList, this.purchase_id, fileData.fieldName).subscribe((data)=>{
          this.tosterservice.success("",this.translate.instant('Offline_Payment_Success.message1'));
          this.closeDialog(this.purchase_id);
        });
      }

    });
    }
     else if ((this.purchaseDataList.paymentMethod === '') && !this.reactiveForm.controls.numberOfPapers.valid){
      this.blockProceedToPay = false;
      this.tosterservice.error(this.translate.instant('Online_Payment_Errors.payment_method_and_number_invalid'));
    }
    else if (this.purchaseDataList.numberOfPapers === null && this.fileList.length!=0) {
      this.blockProceedToPay = false;
      this.tosterservice.error(this.translate.instant('Offline_Payment_Errors.file_valid_and_paperCount_invalid'));
    }
    else if (this.reactiveForm.controls.numberOfPapers.valid && this.purchaseDataList.paymentMethod === ''){
      this.blockProceedToPay = false;
      this.tosterservice.error(this.translate.instant('Online_Payment_Errors.payment_method_invalid'));
    }
    else if((!this.reactiveForm.controls.numberOfPapers.valid) && (this.purchaseDataList.paymentMethod !== '') && (this.purchaseDataList.paymentMethod !=='CHEQUE'||'CASH')){
      this.blockProceedToPay = false;
      this.tosterservice.error(this.translate.instant('Online_Payment_Errors.file_valid_and_paperCount_invalid'));
    }

    this.authorityPaperService.setAddNew(true);

  }





  validateFile(file: File): boolean {
    const fileSize = file.size; // File size in bytes
    const allowedFileSize = 1024 * 1024 * 20; // 20MB

    const fileExtensions = file.name.split('.').slice(1);

    if (fileSize > allowedFileSize) {
      // File size exceeds the allowed limit
      this.tosterservice.error(this.translate.instant('File_errors.file_size_error'));
      return true;
    }

    const allowedFileTypes = ['image/png','application/pdf', 'image/jpeg', 'image/png'];

    if (!allowedFileTypes.includes(file.type)) {
      // Invalid file type
      this.tosterservice.error(this.translate.instant('File_errors.invalid_type'));
      return true;
    }

    if(fileExtensions.length>1){
      this.tosterservice.error(this.translate.instant('File_errors.extension_error'));
      return true;
    }

    return false;
  }


}
export class updateFileList {
  name: string;
  file: any;
  size: any;
  fileType: string;
}

export class DialogData {

  noOfPaper: any;
  Payment_Method: any;
  purchaseAmount: any;
}

