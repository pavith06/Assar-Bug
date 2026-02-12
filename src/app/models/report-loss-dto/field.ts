export class Field {
  fieldId: string;
  fieldName: string;
  fieldType: string;
  aliasName: string;
  mandatory: boolean;
  isCoreData: boolean;
  defaultValues: string;
  entityName: string;
  columnName: string;
  value: string;
  dropDownList?: any[];
  readOnly?: boolean = true;
  icon: any
  referenceId: any
  index: number
  isSystemGenerated: boolean
  tempId: any
  minLength?: number;
  maxLength?: number;
  regex?: string;
  isActive?: boolean;
  pdfSrc?: string;
  fileName?: string;
  mimeType?:string;
  hasError? = false;
  fieldPosition?:number;
  errorMessage:string;
  isHidden?: boolean;
}
