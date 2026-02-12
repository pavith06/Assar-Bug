/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  // API url
  baseApiUrl =  environment.API_BASE_URL+"/api";

  constructor(private http:HttpClient) { }

  // Returns an observable
  upload(fileList,referenceId,referenceType):Observable<any> {

    if (JSON.stringify(fileList)!==JSON.stringify([null])) {
       // Create form data
       const formData = new FormData();

       // Store form name as "file" with file data
       for(let i=0; i<fileList.length; i++) {
        formData.append("file", fileList[i]);
       }

       // Make http post request over api
       // with formData as req
       return this.http.post(this.baseApiUrl + "/upload-file/" +referenceId+"/"+referenceType, formData)
    } else {
      return of(null);
    }
  }

  downloadFile(fileUrl) {
    return this.http.get(fileUrl, { responseType: 'blob' });
  }

  downloadImageByImageName(imageName: string): Observable<any> {
    return this.http.get(this.baseApiUrl + '/downloadFile/' + imageName, { responseType: 'blob' });
  }

  public getFileList(referenceId: number): Observable<any> {
    if (referenceId!== null) {
      return this.http.get<any>(this.baseApiUrl + '/getFileList/' + referenceId);
    }
  }

  public deleteFileList(fileIdList: number[]): Observable<any> {
    return this.http.post(this.baseApiUrl + '/deleteFileList', fileIdList);
  }

}
