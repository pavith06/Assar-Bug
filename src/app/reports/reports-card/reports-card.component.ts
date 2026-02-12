import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { MenuSectionNames } from "src/app/common/enum/enum";
import { FileTypeEnum } from "src/app/models/report-loss-dto/FileTypeEnum";
import { PreviewReportVo, reportCardVo } from "src/app/models/report-loss-dto/report-loss-data";
import { AccessMappingPageDto } from "src/app/models/user-role-management/access-Mapping-PageDto ";
import { AccessMappingSectionDto } from "src/app/models/user-role-management/section-dto";
import { appConst } from "src/app/service/app.const";
import { GenerateReportService } from "src/app/service/generate-report.service";
import { ReportLossService } from "src/app/service/report-loss.service";
import { AppService } from "src/app/service/role access/service/app.service";


@Component({
  selector: 'app-reports-card',
  templateUrl: './reports-card.component.html',
  styleUrls: ['./reports-card.component.scss']
})


export class ReportsCardComponent implements OnInit{
  previewData = new PreviewReportVo();
 reportdVo:reportCardVo[]=[];
 reportdVCopyVo:reportCardVo[]=[];
pageInfo: any;
  searchvalue: string;
  reportCardPageAccessDto: AccessMappingSectionDto;
  reportPageAccessDto:AccessMappingPageDto;

constructor(
  private reportloss: ReportLossService,
  private route:Router,
  private getreportservice: GenerateReportService,
  private toastr : ToastrService,
  private activatedRoute:ActivatedRoute,
  private appService:AppService,
  private translate: TranslateService
){

  this.activatedRoute.queryParams.subscribe((queryParams: any) => {
    this.searchvalue = queryParams['recSearchQuery'];
    if( this.searchvalue !==  ""){
      this.reportdVo = this.reportdVCopyVo.filter((m) => String(m.reportName.toUpperCase()).includes(this.searchvalue.toUpperCase()));
    }else{
      this.reportdVo = this.reportdVCopyVo;
    }
    this.dataNotFound = (this.reportdVo?.length>0)?false:true;
 });

}

dataNotFound=false;

ngOnInit(): void {
  this.getPageAccess();
}
  getCardDetaild() {

    if(this.reportCardPageAccessDto.isView===false){
      return;
    }
  
   this.reportloss.getReportCard().subscribe((data)=>{
    if(data.content == undefined || data.content == null || data.content.length == 0){
      this.dataNotFound = true;
    }else{
      this.dataNotFound = false;
    }
    this.reportdVCopyVo= data.content;
    this.reportdVo = data.content;
   });
  }

  edit(data:any){
    const edit="Edit"
    sessionStorage.setItem('edit',edit );
    this.route.navigate(['report-Data/report-list'], { queryParams: { Identity: data.identity } });
  }
  download(data:any){

    this.previewData.reportData = data;
    this.previewData.filterVo = [];

    if(data.fileType == 0) {
      this.downloadReport(FileTypeEnum.EXCEL, this.previewData);
    }
    else if (data.fileType == 1) {
      this.downloadReport(FileTypeEnum.CSV, this.previewData)
    }
    else {
      this.downloadReport(FileTypeEnum.PDF, this.previewData)
    }
  }

  private downloadReport(downloadType: string, data: PreviewReportVo) {
    if (data.reportData.fileType == 0) {
      this.getreportservice.getByteSourceForExcelReport(data).subscribe(response => {
        if(response.size === 0){
          this.toastr.error(this.translate.instant('Toaster_error.invalid_report_generate_download'));
        }else{
          this.donwloadFile(response,  data.reportData.reportName,FileTypeEnum.EXCEL);
        }
      })
    }
    else if (data.reportData.fileType == 1) {
      this.getreportservice.getByteSourceForCsvReport(data).subscribe(response => {
        if(response.size === 0){
          this.toastr.error(this.translate.instant('Toaster_error.invalid_report_generate_download'));
        }else{
          this.donwloadFile(response, data.reportData.reportName,FileTypeEnum.CSV);
        }
      })
    }else{
      this.getreportservice.getByteSourceForPdfReport(data).subscribe(response => {
        if(response.size === 0){
          this.toastr.error(this.translate.instant('Toaster_error.invalid_report_generate_download'));
        }else{
          this.donwloadFile(response, data.reportData.reportName,FileTypeEnum.PDF);
        }
      })
    }
  }

  private donwloadFile(value: any, downloadType: string,donloadType:string) {
    const blob = new Blob([value], { type: donloadType});
    const downloadLink = document.createElement('a');
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.setAttribute('href', window.URL.createObjectURL(blob));
    downloadLink.setAttribute('download', downloadType);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }


  getEnabledPrivilegeFromMultipleRoles(sectionDataArray:AccessMappingSectionDto[]):AccessMappingSectionDto[]{
    const result: AccessMappingSectionDto[] = Object.values(
      sectionDataArray.reduce((accumulator, obj) => {
        let accessMappingAccumulator:AccessMappingSectionDto= null;
        if (!accumulator[obj.sectionName]) {
          accumulator[obj.sectionName] = obj;
        }
        accessMappingAccumulator=accumulator[obj.sectionName];
        if(obj.isView){          
          accessMappingAccumulator.isView=obj.isView;
        }
        if(obj.isClone){
          accessMappingAccumulator.isClone=obj.isClone;
        }
        if(obj.isDisable){
          accessMappingAccumulator.isClone=obj.isDisable;
        }
        if(obj.isDownload){
          accessMappingAccumulator.isDownload=obj.isDownload;
        }
        if(obj.isEdit){
          accessMappingAccumulator.isEdit=obj.isEdit;
        }
        if(obj.isNotification){
          accessMappingAccumulator.isNotification=obj.isNotification;
        }
        accumulator[obj.sectionName]=accessMappingAccumulator;
        return accumulator;
      }, {} as Record<string, AccessMappingSectionDto>)
    );
    
    return result
  }


  getPageAccess(): void {
    this.appService.getPageAccess(appConst.PAGE_NAME.REPORTS.PAGE_IDENTITY).subscribe((response: any) => {
      this.reportPageAccessDto = response.content;
      this.reportPageAccessDto.sectionData=this.getEnabledPrivilegeFromMultipleRoles(this.reportPageAccessDto?.sectionData);
      this.reportCardPageAccessDto = this.reportPageAccessDto.sectionData.find(x=>x.sectionName===MenuSectionNames.Reports)
      this.getCardDetaild();
    });
  }


}
