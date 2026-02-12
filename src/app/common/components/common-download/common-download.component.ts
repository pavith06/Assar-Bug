import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FileTypeEnum } from 'src/app/models/report-loss-dto/FileTypeEnum';
import { EntityManagementService } from 'src/app/service/entitymanagement-service';
import { PurchaseStockService } from 'src/app/service/purchase-stock.service';
import { componentName } from '../../enum/enum';

@Component({
  selector: 'app-common-download',
  templateUrl: './common-download.component.html',
  styleUrls: ['./common-download.component.scss']
})
export class CommonDownloadComponent implements OnInit {
  downloadclose=true;
  @Output() choosedColumnValue = new EventEmitter<string[]>();
  @Output() paperDetailsTransactionList = new EventEmitter<string[]>();
  @Output() transactionList = new EventEmitter<string[]>();
  @Output() paperDetails = new EventEmitter<string[]>();
  @Input() columnContentFromParent:any[];

  downloadColumnList =['Digital Paper No','Policy Number','Insured Name','Registration Number','Effective From','Expire Date','Status'];

  @Input()
  value:string;
  ngOnInit(): void {
  }
  constructor(private service : EntityManagementService,private toastr : ToastrService,
    public purchaseService :PurchaseStockService){
  }

  close(){
    this.closedownload.emit();
  }
  PurchaseStockList: string[] = [];
  senddata(event:any){
    const list =this.columnContentFromParent.filter(data=>data.toLowerCase().includes(event.toLowerCase()));
    this.PurchaseStockList.push(...list);
    this.downloadColumnList.push(...list);
}

//backlend call
// getDropdownData(){
// this.purchaseService.getDrowpDownData().subscribe((data:any)=>{
//   this.displayedColumns=data.content;
// });
// }

//download
downloadData(){
  let downloadCompanentName =  sessionStorage.getItem("componentName");
  if(downloadCompanentName == componentName.Purchase_History){
    this.choosedColumnValue.emit(this.PurchaseStockList);
  }
  else if(downloadCompanentName == componentName.TRANSACTION_LIST){
    this.transactionList.emit(this.PurchaseStockList);
  }
  else if(downloadCompanentName== componentName.PAPER_DETAILS){
    this.paperDetails.emit(this.PurchaseStockList);
  }
  else if(downloadCompanentName== componentName.PAPER_DETAILS_TRANSACTION_LIST){
    this.paperDetailsTransactionList.emit(this.PurchaseStockList);
  }
}
selectall:boolean=false;
list:string[]=[];
chechbox(data:any)
{

  this.list.push(data);
  if(this.list[0]==="on")
  {
    this.selectall=!this.selectall;

    this.PurchaseStockList.push(...this.columnContentFromParent);
   if(this.selectall===true){
    this.downloadColumnList.push(...this.columnContentFromParent);
   }
  }
}
closecheckbox()
{
  this.listshow=false;

}
remove(element)
{
    if(this.PurchaseStockList.includes(element)){
      const index = this.PurchaseStockList.indexOf(element);
      this.PurchaseStockList.splice(index,1);
    }

}

private donwloadFile(value: any, downloadType: string) {

  const blob = new Blob([value], { type: 'application/vnd.ms-excel' });
    const file = new File([blob], 'report.xlsx', {
      type: 'application/vnd.ms-excel',
    });
    const fileURL = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = fileURL;
    a.target = '_blank';
    a.download = 'Excel' + '.xlsx';
    document.body.appendChild(a);
    a.click();
}

separatorKeysCodes: number[];
listshow:boolean=false;
showpurchaselist()
{
  this.listshow=!this.listshow;
}
@Output()
closedownload=new EventEmitter<boolean>()
}
