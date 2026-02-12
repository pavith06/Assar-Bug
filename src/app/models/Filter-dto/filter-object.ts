export class FilterObject {
  columnName:string;
  condition:string;
  aliasName: string;
  type: string;
  value: string[];
  dropdown: any[];
  radio: RadioButtonObject[];
  dropdownCopy?:string[];
  dataType:string;
  isMax?:boolean;
}


export class RadioButtonObject {
  name: string;
  value: boolean;
}
