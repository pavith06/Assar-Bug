export class AccessMappingSectionDto {
  sectionName:string;
  isView:boolean;
  isEdit:boolean;
  isDownload:boolean;
  isClone:boolean;
  isDisable:boolean;
  isNotification:boolean;
  sectionData:AccessMappingSectionDto[];
  sectionId:number;
  pageId:number;
}
