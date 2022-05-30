import { Component, OnInit } from '@angular/core';
import { RecruiterService } from 'src/app/core/services/recruiter.service';
import { Recruiter } from 'src/app/core/models/recruiter.model';
import { BASE_URL } from 'src/app/core/utils/constant';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})

export class ManageUserComponent implements OnInit {

  recruiters: Recruiter[] = [];
  isCreateUsser: boolean;

  constructor(
    private dialogService: DialogService,
    private recruiterService: RecruiterService,
    private toastService: ToastService,
    private utilsService: UtilsService) {
    this.isCreateUsser = this.getCurrentRole();
  }

  ngOnInit() {
    this.getRecruiters();
  }

  /**
   * Privilage to Super Admin and Admin
   * only that can create new member.
   * @returns boolean
   */
  getCurrentRole(): boolean {
    const token = localStorage.getItem('token');
    const tokenDecoded = this.utilsService.getDecodedToken(token);

    return tokenDecoded.isSuperAdmin || tokenDecoded.isAdmin;
  }

  getRecruiters() {
    this.recruiterService.getRecruiters()
      .subscribe(response => {
        const res = response.docs;
        const len = res.length;
        const currentId = localStorage.getItem('id');

        if (res[0]._id !== currentId) {
          for (let i = 0; i < len; i++) {
            if (res[i]._id === currentId) {
              const tempRes = res[0];
              res[0] = res[i];
              res[i] = tempRes;
            }
          }
        }

        for (let i = 0; i < len; i++) {
          const recruiter = res[i];
          this.addRecruiter(recruiter);
        }
      });
  }

  addRecruiter(recruiter: any) {
    this.recruiters.push(new Recruiter(
      recruiter.name,
      recruiter.title,
      recruiter.email,
      recruiter.isAdmin,
      recruiter.isSuperAdmin,
      recruiter.isActive,
      BASE_URL + recruiter.profpic
    ));
  }

  /**
   * Call toogle admin service, and
   * change admin status of selected index.
   * @param index - recruiter index
   */
  onToogleAdmin(index: number) {
    const recruiter = this.recruiters[index];
    this.recruiterService.toogleAdmin(recruiter.email)
      .subscribe(_ => {
        recruiter.isAdmin = !recruiter.isAdmin;
        if (recruiter.isAdmin) {
          this.toastService.success('Change ' + recruiter.name + ' to Admin');
        } else {
          this.toastService.success('Change ' + recruiter.name + ' to Normal Recruiter');
        }
      });
  }

  /**
   * Call toogle active service, and
   * change active status of selected index.
   * @param index - recruiter index
   */
  onToogleActive(index: number) {
    const recruiter = this.recruiters[index];
    this.recruiterService.toogleActive(recruiter.email)
      .subscribe(_ => {
        recruiter.isActive = !recruiter.isActive;
        if (recruiter.isActive) {
          this.toastService.success(recruiter.name + ' is activate');
        } else {
          this.toastService.success(recruiter.name + ' is deactivate');
        }
      });
  }

   /**
   * Open delete recruiter dialog,
   * remove selected index from array of recruiters.
   * @param index - recruiter index
   */
  openRejectDialog(index: number) {
    const recruiter = this.recruiters[index];
    const dialogRef = this.dialogService.getDeleteRecruiterDialog(recruiter);

    dialogRef.afterClosed().subscribe(result => {
      if (result.isDelete) {
        this.recruiters.splice(index, 1);
      }
    });
  }
}
