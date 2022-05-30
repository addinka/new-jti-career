import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog, MatDialogRef } from '@angular/material';

import { CreatePasswordComponent } from '../components/dialogs/create-password/create-password.component';
import { EditAuthorComponent } from '../components/dialogs/edit-author/edit-author.component';
import { EditCollaboratorsComponent } from '../components/dialogs/edit-collaborators/edit-collaborators.component';
import { InviteComponent } from '../components/dialogs/invite/invite.component';
import { LoginComponent } from '../components/dialogs/login/login.component';
import { RejectApplicationComponent } from '../components/dialogs/reject-application/reject-application.component';
import { ResetPasswordComponent } from '../components/dialogs/reset-password/reset-password.component';
import { WithdrawApplicationComponent } from '../components/dialogs/withdraw-application/withdraw-application.component';
import { DeleteRecruiterComponent } from '../components/dialogs/delete-recruiter/delete-recruiter.component';
import { SendBlueFormComponent } from '../components/dialogs/blueform/blueform.component';
import { InviteExternalComponent } from '../components/dialogs/invite-external/invite-external.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private ws = '468px';
  private wl = '1100px';
  private backdropClasss = 'backgroundBlur';
  private scrollStrategy = this.overlay.scrollStrategies.noop();

  constructor(
    private matDialog: MatDialog,
    private overlay: Overlay
  ) { }

  /**
   * Open dialog template.
   * @param component - component instance
   * @param data - data option to pass information to the dialog component
   */
  open(component: any, data?: Object, width?: string): MatDialogRef<any, any> {
    return this.matDialog.open(component, {
      data: data,
      // disableClose: true,
      width: width === undefined ? this.ws : width,
      backdropClass: this.backdropClasss,
      scrollStrategy: this.scrollStrategy
    });
  }

  /**
   * As candidate
   * or recruiter want to login.
   */
  getLoginDialog(): MatDialogRef<LoginComponent, any> {
    return this.open(LoginComponent);
  }

  /**
   * As candidate
   * or recruiter want to reset password.
   */
  getResetPasswordDialog(): MatDialogRef<ResetPasswordComponent, any> {
    return this.open(ResetPasswordComponent);
  }

  /**
   * As candidate
   * want to create account with fill password only.
   * @param user - apply form value
   */
  getCreatePasswordDialog(user: any): MatDialogRef<CreatePasswordComponent, any> {
    return this.open(CreatePasswordComponent, { user: user });
  }

  /**
   * As candidate want to withdraw application.
   * @param id - application ID
   */
  getWithdrawDialog(id: string): MatDialogRef<WithdrawApplicationComponent, any> {
    return this.open(WithdrawApplicationComponent, { id: id });
  }

  /**
   * As recruiter want to invite candidate.
   * @param type - Test, Interview I, Interview II, On Board
   * @param applicant - profpic, name, applicationID
   */
  getInviteDialog(type: String, applicant: any): MatDialogRef<InviteComponent, any> {
    // gadipake ini sepertinya
    const data = {
      type: type,
      profpic: applicant.profpic,
      name: applicant.name,
      appliID: applicant.application.applicationID
    };

    return this.open(InviteComponent, data);
  }

  /**
   * Modified version, suited for candidate page
   */
  getInviteCandidateDialog(type: String, applicant: any): MatDialogRef<InviteComponent, any> {
    const data = {
      type: type,
      profpic: applicant.user.profpic,
      name: applicant.user.name,
      appliID: applicant._id,
      userID: applicant.userID,
      jobID: applicant.jobID,
      blueFormFilled: applicant.blueFormFilled
    };

    return this.open(InviteComponent, data);
  }

  /**
   * As recruiter want to eliminate candidate application.
   * @param id - application ID
   */
  getRejectDialog(id: string, status?: string): MatDialogRef<RejectApplicationComponent, any> {
    return this.open(RejectApplicationComponent, { id, status });
  }

  /**
   * As recruiter want to edit author.
   * @param job - TODO: Add description here
   */
  getEditAuthorDialog(job: any): MatDialogRef<EditAuthorComponent, any> {
    return this.open(EditAuthorComponent, { job: job }, this.wl);
  }

  /**
   * As recruiter want to edit collaborator.
   * @param job - TODO: Add description here
   */
  getEditCollaboratorDialog(job: any): MatDialogRef<EditCollaboratorsComponent, any> {
    return this.open(EditCollaboratorsComponent, { job: job }, this.wl);
  }

  /**
   * As recruiter want to delete recruiter as member.
   * @param recruiter - TODO: Add description here
   */
  getDeleteRecruiterDialog(recruiter: any): MatDialogRef<DeleteRecruiterComponent, any> {
    return this.open(DeleteRecruiterComponent, { recruiter: recruiter });
  }

  /**
   * As recruiter want to send blue form to candidate.
   * @param candidate - Candidate Data
   */
   getSendBlueFormDialog(candidate: any): MatDialogRef<SendBlueFormComponent, any> {
     // console.log(candidate)
    const data = {
      profpic: candidate.profpic,
      name: candidate.name,
      candidateID: candidate._id,
    };
    return this.open(SendBlueFormComponent, data);
  }

  /**
   * Invite external candidate to apply, send to their email
   */
  getInviteExternal(): MatDialogRef<InviteExternalComponent, any> {
    return this.open(InviteExternalComponent);
  }
}
