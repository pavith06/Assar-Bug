import { AccessMappingPageDto } from './access-Mapping-PageDto ';
export class MenuDto{
  menuId:number;
  isEnabled:boolean;
  pageData:AccessMappingPageDto[];
  menuName:string;
}