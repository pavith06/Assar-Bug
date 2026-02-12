import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DropDownServiceService {

  private baseUrl = environment.API_BASE_URL+"/api"

  constructor(private http:HttpClient) { }

  private parentFieldMap = [{
     parentFieldName: 'vdMake',
     childFieldName: 'vdModel'
    }
    ];

    getParentFieldMap(){
        return this.parentFieldMap;
    }

    getChildFieldName(parentFieldName: string): string {
      const childFieldObject = this.parentFieldMap.find((data) => data.parentFieldName === parentFieldName);
       if(childFieldObject) {
      return childFieldObject.childFieldName;
     }
       return '';
    }

  public getOption(fieldIdentity:string, fieldValue:string,fieldName:any):Observable<any>{
      return this.http.get(this.baseUrl+"/report/getDropDownData?fieldIdentity="+fieldIdentity+'&fieldValue='+fieldValue+'&fieldName='+fieldName);
  }


  public getChildDropDownList(fieldIdentity:string, fieldValue:string,fieldName:any):Observable<any>{
    return this.http.get(this.baseUrl+"/report/getDropDownData-digital-paper?fieldIdentity="+fieldIdentity+'&fieldValue='+fieldValue+'&fieldName='+fieldName);
}


}
