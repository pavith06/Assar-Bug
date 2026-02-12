import { PrevilageDto } from './previlage-dto';
import { AccessMappingSectionDto } from './section-dto';
export class AccessMappingPageDto {
  pageId:number;
  isEnabled:boolean;
  sectionData:AccessMappingSectionDto[];
  privilegeData:PrevilageDto[];
  pageName:string;
  displayName: string;
}
