import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
import { appConst } from 'src/app/service/app.const';
import { AppService } from 'src/app/service/role access/service/app.service';

@Component({
  selector: 'app-reports-config',
  templateUrl: './reports-config.component.html',
  styleUrls: ['./reports-config.component.scss'],
})
export class ReportsConfigComponent implements OnInit {
  pageInfo: any;
  public appConst = appConst;
  pageId = appConst.PAGE_NAME.REPORTS.PAGEID;

  constructor(private router: Router, private appService: AppService,
    private adminService: AdminService) {}
  edit: string;
  ngOnInit(): void {
    this.getPrivilege();
    const edit = sessionStorage.getItem('edit');
    if (edit == 'Edit') {
      this.edit = edit;
    } else if (edit == 'Generate') {
      this.edit = edit;
    }
  }

  checkUserIsAdmin() {
    return this.adminService.isAssociationUser();
  }

  generatepage() {
    this.router.navigate(['report-Data/reports-card']);
  }

  getPrivilege() {
    this.appService.getPrivilegeForPage(this.pageId).subscribe((res: any) => {
      this.pageInfo = res.content;
      this.getPageInfo(this.pageId);
    });
  }

  getPageInfo(pageID: number): boolean {
    if (this.pageInfo != null || this.pageInfo !== undefined) {
      const pageValue =
        this.pageInfo &&
        (this.pageInfo.length === 0 ||
          this.pageInfo.find((element: any) => element.pageId === pageID));
      return pageValue;
    } else {
      return true;
    }
  }

  checkPrivillege(privillegeName: string): boolean {
    let isEnabled = true;
    if (this.pageInfo && this.pageInfo.length > 0) {
      const privillege = this.pageInfo.find(
        (prv: any) => prv.privilegeName === privillegeName
      );
      isEnabled = privillege.isEnabled;
    }
    return isEnabled;
  }
}
