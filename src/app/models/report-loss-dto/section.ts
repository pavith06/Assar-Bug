import { Field } from './field';

export class Section{
  sectionId:string;
  sectionName:string;
  sectionList:Section[];
  fieldList:Field[];
  isAllFilled: boolean;
  isViewable: boolean;
  isEditable: boolean;
  isDownloadable: boolean;
  isNotification: boolean;
  isEnabled : boolean;
  isExpanded?: boolean;
}
