import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserTypePopupComponent } from './user-type-popup/user-type-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { ImplementConfigServiceService } from 'src/app/implement-config-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ImplementConfigurationEnum } from 'src/app/common/enum/enum';
import { TranslateService } from '@ngx-translate/core';
import imageCompression from "browser-image-compression";
@Component({
  selector: 'app-implement-config',
  templateUrl: './implement-config.component.html',
  styleUrls: ['./implement-config.component.scss'],
})
export class ImplementConfigComponent implements OnInit, AfterViewInit {

  active = true;
  inactive = false;
  ispaperAutoGen = true;
  implementConfigureVarNameList: implementConfigurationVo[] = [];
  insuranceDropDownDataList: string[] = [];
  inmplementConfigure: FormGroup;
  implementConfigurationVo: implementConfigurationVo[] = [];
  implementConfigurationVoCopy = new implementConfigurationVo();
  @ViewChild('paperConfigImpl') paperConfigImpl!: ElementRef;
  htmlTemplate: string;
  isShowInsuranceUser = false;

  constructor(public dialog: MatDialog,
    public service: ImplementConfigServiceService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService) {
    console.log('Constructor executed');
    this.inmplementConfigure = this.formBuilder.group({
      allocationBasedOn: [""],
      insuranceUserType: [""],
      digitalPaperCost: [""],
      sharePercentage: ["", [Validators.required]],
      paperAutoGeneration: ["", [Validators.required]],
      paperExpirationMail: ["", [Validators.required]],
      minimumPaperLimit: ["", [Validators.required]],
      prefix: ["", [Validators.required]],
      suffix: ["", [Validators.required]],
    });
    console.log('FormGroup initialized:', this.inmplementConfigure);
  }

  ngAfterViewInit() {
    this.htmlTemplate = this.paperConfigImpl.nativeElement.innerHTML;
    console.log('ngAfterViewInit: htmlTemplate captured:', this.htmlTemplate);
  }
  ngOnInit(): void {
    console.log('ngOnInit called');
    this.setColumnNameInList(ImplementConfigurationEnum.ALLOCATION_BASED_ON);
    this.setColumnNameInList(ImplementConfigurationEnum.DIGITAL_PAPER_COST);
    this.setColumnNameInList(ImplementConfigurationEnum.INSURANCE_USER_TYPE);
    this.setColumnNameInList(ImplementConfigurationEnum.SHARE_PERCENTAGE);
    this.setColumnNameInList(ImplementConfigurationEnum.PAPER_AUTO_GENERATION_FORMATE);
    this.setColumnNameInList(ImplementConfigurationEnum.PAPER_EXPIRATION_MAIL);
    this.setColumnNameInList(ImplementConfigurationEnum.MINIMUM_PAPER_LIMIT);
    this.setColumnNameInList(ImplementConfigurationEnum.SUFFIX);
    this.setColumnNameInList(ImplementConfigurationEnum.PREFIX);

    console.log('implementConfigureVarNameList:', this.implementConfigureVarNameList);

    this.getInsuredDropDownData();
    this.reArrageOrder(this.implementVar_name);
    this.getImplementConfigurationData(this.implementConfigureVarNameList);
  }

  setColumnNameInList(name: string) {
    const columnName = new implementConfigurationVo();
    columnName.columnName = name;
    this.implementConfigureVarNameList.push(columnName);
    console.log('Added column name:', name);
  }





async compressBackground(file: File) {
  const options = {
    maxSizeMB: 0.9,                  // stay under 1MB
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    initialQuality: 0.8
  };

  try {
    const compressed = await imageCompression(file, options);

    console.log("Original size:", (file.size / 1024).toFixed(2), "KB");
    console.log("Compressed size:", (compressed.size / 1024).toFixed(2), "KB");

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result;
        this.image = base64.split(",")[1];  // ✅ store base64 only, not header
      }
    };

    reader.readAsDataURL(compressed);
  } catch (e) {
    console.error("PNG compression failed:", e);
  }
}


  getImplementConfigurationData(dataList: implementConfigurationVo[]) {
    console.log('Fetching saved configuration with dataList:', dataList);
    this.service.getSavedConfiguration(dataList).subscribe((data: any) => {
      console.log('Response for saved configuration:', data);
      if (data.content.length !== 0) {
        data.content.forEach(element => {
          console.log('Config element:', element);
          if (element.columnName === ImplementConfigurationEnum.ALLOCATION_BASED_ON) {
            if (element.value === "None") {
              this.isShowInsuranceUser = true;
            } else {
              this.isShowInsuranceUser = false;
            }
            this.inmplementConfigure.controls['allocationBasedOn'].setValue(element.value);
          } else if (element.columnName === ImplementConfigurationEnum.DIGITAL_PAPER_COST) {
            this.inmplementConfigure.controls['digitalPaperCost'].setValue(element.value);
          } else if (element.columnName === ImplementConfigurationEnum.INSURANCE_USER_TYPE) {
            this.inmplementConfigure.controls['insuranceUserType'].setValue(element.insuranceUserValue);
          } else if (element.columnName === ImplementConfigurationEnum.SHARE_PERCENTAGE) {
            this.inmplementConfigure.controls['sharePercentage'].setValue(element.value);
          } else if (element.columnName === ImplementConfigurationEnum.PAPER_EXPIRATION_MAIL) {
            this.inmplementConfigure.controls['paperExpirationMail'].setValue(element.value);
          } else if (element.columnName === ImplementConfigurationEnum.MINIMUM_PAPER_LIMIT) {
            this.inmplementConfigure.controls['minimumPaperLimit'].setValue(element.value);
          } else if (element.columnName === ImplementConfigurationEnum.SUFFIX) {
            this.inmplementConfigure.controls['suffix'].setValue(element.value);
          } else if (element.columnName === ImplementConfigurationEnum.PREFIX) {
            this.inmplementConfigure.controls['prefix'].setValue(element.value);
          } else if (element.columnName === ImplementConfigurationEnum.PAPER_AUTO_GENERATION_FORMATE) {
            this.inmplementConfigure.controls['paperAutoGeneration'].setValue(element.value);
          }
        });
        console.log('Form values after loading saved configuration:', this.inmplementConfigure.value);
      }
    });
  }

  getInsuredDropDownData() {
    console.log('Fetching insured user dropdown data');
    this.service.getInsuredUserList().subscribe((data: any) => {
      this.insuranceDropDownDataList = data.content;
      console.log('Insurance dropdown data loaded:', this.insuranceDropDownDataList);
    });
  }

  paperFields() {
    this.active = true;
    this.inactive = false;
    console.log('Switched to paperFields view - active:', this.active);
  }

  setSuffixInPaperDetails() {
    const prefixValue = this.inmplementConfigure.get("prefix").value;
    const suffixValue = this.inmplementConfigure.get("suffix").value;
    let value = '';
    if (suffixValue !== null && suffixValue !== undefined) {
      value = prefixValue + suffixValue;
    } else {
      value = prefixValue;
    }
    this.inmplementConfigure.controls['paperAutoGeneration'].setValue(value);
    console.log('Set paperAutoGeneration form value:', value);
  }

  saveImplementConfiguration() {
    //console.log('saveImplementConfiguration called');
    if (this.inmplementConfigure.valid) {
      this.implementConfigurationVo = []; 

      this.getImplementConfigurationObject(ImplementConfigurationEnum.ALLOCATION_BASED_ON, 'allocationBasedOn');
      this.getImplementConfigurationObject(ImplementConfigurationEnum.DIGITAL_PAPER_COST, 'digitalPaperCost');
      this.getImplementConfigurationObject(ImplementConfigurationEnum.INSURANCE_USER_TYPE, 'insuranceUserType');
      this.getImplementConfigurationObject(ImplementConfigurationEnum.SHARE_PERCENTAGE, 'sharePercentage');
      this.getImplementConfigurationObject(ImplementConfigurationEnum.PAPER_AUTO_GENERATION_FORMATE, 'paperAutoGeneration');
      this.getImplementConfigurationObject(ImplementConfigurationEnum.PAPER_EXPIRATION_MAIL, 'paperExpirationMail');
      this.getImplementConfigurationObject(ImplementConfigurationEnum.MINIMUM_PAPER_LIMIT, 'minimumPaperLimit');
      this.getImplementConfigurationObject(ImplementConfigurationEnum.SUFFIX, 'suffix');
      this.getImplementConfigurationObject(ImplementConfigurationEnum.PREFIX, 'prefix');

      // console.log('Form Values:', this.inmplementConfigure.value);
      // console.log('implementConfigurationVo:', this.implementConfigurationVo);
      // console.log('implementVar_name:', this.implementVar_name);
      // console.log('Header:', this.header);
      // console.log('Content:', this.content);
      // console.log('HTML Template:', this.htmlTemplate);
      // console.log('Base64 Image:', this.image);

      this.service.saveImplementationConfiguration(this.implementConfigurationVo).subscribe((data: any) => {
        console.log('saveImplementationConfiguration response:', data);
        if (data.content !== '') {
          this.ngAfterViewInit();
          this.saveDigitalPaperTemplate();
        }
      });
    } else {
      console.warn('Form invalid, cannot save configuration');
      this.toastr.error(this.translate.instant('Toaster_error.mandatory_fields'));
    }
  }

  saveDigitalPaperTemplate() {
    if (this.htmlTemplate !== null && this.htmlTemplate !== undefined) {
      console.log('Saving digital paper template...');
      this.service.saveDigitalPaperTemplate(this.htmlTemplate).subscribe((data: any) => {
        console.log('saveDigitalPaperTemplate response:', data);
        if (data.content) {
          this.toastr.success(this.translate.instant('Toaster_success.save'));
        }
      });
    } else {
      console.warn('htmlTemplate is null or undefined. Skipping template save');
    }
  }

  getImplementConfigurationObject(columnname: string, value: string) {
    const obj1 = new implementConfigurationVo();
    if (columnname === "Insurance User Type") {
      obj1.columnName = columnname;
      obj1.insuranceUserValue = this.inmplementConfigure.get(value).value;
    } else {
      obj1.columnName = columnname;
      obj1.value = this.inmplementConfigure.get(value).value;
    }
    this.implementConfigurationVo.push(obj1);
    console.log('Added config object:', obj1);
  }

  disableForInsurance() {
    this.isShowInsuranceUser = !this.isShowInsuranceUser;
    console.log('Toggled isShowInsuranceUser:', this.isShowInsuranceUser);
  }

  waterMark() {
    this.active = false;
    this.inactive = true;
    console.log('Switched to watermark view - active:', this.active, 'inactive:', this.inactive);
  }

  implementVar_name = [
    { name: 'PolicyHolder', value: '@InuredName' },
    { name: 'Policy No', value: '@PolicyNumber' },
    { name: 'Make & Type', value: '@VehicleMake' },
    { name: 'Inception Date', value: '@EffectiveFrom' },
    { name: 'Expiry Date', value: '@EffectiveTo' },
    // { name: 'Time', value: '@EffectiveTo' },
    { name: 'Registration', value: '@RegistrationNo' },
    { name: 'Chassis', value: '@ChassisNo' },
    { name: 'Licensed to Carry', value: '@LicensedToCarry' },
    { name: 'Usage', value: '@Usage' },
    { name: 'Insurer', value: '@Insurer' },
    // { name: 'DP Generated by', value: '@UserName' },
  ];

  header: any[] = [];
  content: any[] = [];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.implementVar_name, event.previousIndex, event.currentIndex);
    console.log('Item dragged from', event.previousIndex, 'to', event.currentIndex);
    this.header = [];
    this.content = [];
    this.reArrageOrder(this.implementVar_name);
  }

  reArrageOrder(movies: any) {
    const duplicatMovies1 = movies;
    const duplicatMovies2 = movies;
    this.header = duplicatMovies2.slice(0, 4);
    this.content = duplicatMovies1.slice(4, movies.length);
    console.log('Header after rearrange:', this.header);
    console.log('Content after rearrange:', this.content);
  }

  openDialog(): void {
    console.log('Opening UserTypePopupComponent dialog');
    const dialogRef = this.dialog.open(UserTypePopupComponent, {
      width: '441px',
      height: '239px',
      data: {
        insuredUserType: this.insuranceDropDownDataList
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result) {
        this.getInsuredDropDownData();
      }
    });
  }

  action = "Generate Paper";
  file: File = null;
  filename = null;
  fileNameList: updateFileList[] = [];
  fileList: File[] = [];
  caption = 'Choose an image';

  captionPdf = 'Choose a PDF';

  base64Output: string;

  onFileSelected(event) {
    console.log('File selected:', event.target.files[0]);
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
      console.log('File converted to base64');
    });
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    console.log('Reading file for base64 conversion:', file.name);
    return result;
  }

  image: any;
  opacityImage: number;

  onChange(event: any) {
    this.opacityValue = 100;
    const files = event.target.files[0];
    console.log('onChange file selected:', files);

    const file = files;
    const fileName = file.name;

    this.fileList.push(file);
    this.convertFile(file).subscribe(base64 => {
      const fileOk = new updateFileList();
      fileOk.name = fileName;
      fileOk.file = base64;
      fileOk.fileType = file.type;
      this.image = fileOk.file;
      this.filename = fileOk.name;
      console.log('File converted and added:', fileOk);
    });
    this.compressBackground(file);
  }

  DeleteFile() {
    this.filename = null;
    this.fileNameList = [];
    this.image = null;
    console.log('File deleted from component variables');
  }

  opacityValue = 100;

  opcaity($event: any) {
    const data = Number($event.target.value)
    const imgvalue = data / 100;
    this.opacityImage = imgvalue;
    console.log('Opacity changed to:', imgvalue);
  }
}

export class updateFileList {
  name: string;
  file: any;
  size: any;
  fileType: string;
}

export class implementConfigurationVo {
  columnName: string;
  value: string;
  id: number
  insuranceUserValue: string[];
}
