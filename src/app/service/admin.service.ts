import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    isAssociationUser(): boolean {
        return sessionStorage.getItem('role')==='TRUE';
    }
}
