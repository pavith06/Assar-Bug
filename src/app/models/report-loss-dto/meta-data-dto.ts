import { Section } from './section';

export class MetaDataDto{
  pageId:string;
  pageName:string;
  enabled: boolean;
  sectionList:Section[];
  IsActive:string;
}

export class EntityMetaDataDto{
isActive:boolean;
metaData:MetaDataDto[];
}

export class userDissableDto{
  expiredDate: Date;
  identity:string;
  userId:number;
}
