import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
import { appConst } from 'src/app/service/app.const';

@Component({
  selector: 'app-report-header',
  templateUrl: './report-header.component.html',
  styleUrls: ['./report-header.component.scss']
})
export class ReportHeaderComponent {

  @Input() pageInfo: any;

  public appConst = appConst;
  searchvalue:string;
  closeIconEnable: boolean = false;
  constructor(public router:Router,
    private adminService: AdminService){}

  generatepage(){
    const edit='Generate'
    sessionStorage.setItem('edit',edit );
    this.router.navigate(['report-Data/report-list'])
  }

  checkUserIsAdmin() {
    return this.adminService.isAssociationUser();
  }

  checkPrivillege(privillegeName: string): boolean {
    let isEnabled = true;
    if(this.pageInfo && this.pageInfo.length > 0) {
      const privillege = this.pageInfo.find((prv: any) => prv.privilegeName === privillegeName);
      isEnabled = privillege.isEnabled;
    }
    return isEnabled;
  }

  Search(event){
    this.searchvalue = event.target.value;
    this.closeIconEnable = true;
    if(!this.searchvalue){
      this.closeIconEnable = false;
    }
    this.router.navigate([], { queryParams: { recSearchQuery: this.searchvalue } });
  }

  removeSearchValue(){
    this.searchvalue = "";
    this.closeIconEnable = false;
    this.router.navigate([], { queryParams: { recSearchQuery: this.searchvalue } });
  }

  handleKeyup(event: KeyboardEvent) {
    if (event.key === 'Backspace' && this.searchvalue === "" && this.closeIconEnable) {
      this.closeIconEnable = false;
    }
  }


}
