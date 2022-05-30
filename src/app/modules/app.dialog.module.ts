import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from './app.material.module';

import { CreatePasswordComponent } from '../core/components/dialogs/create-password/create-password.component';
import { CreateNewPasswordComponent } from '../core/components/dialogs/create-new-password/create-new-password.component';
import { InviteComponent } from '../core/components/dialogs/invite/invite.component';
import { LoginComponent } from '../core/components/dialogs/login/login.component';
import { ResetPasswordComponent } from '../core/components/dialogs/reset-password/reset-password.component';
import { WithdrawApplicationComponent } from '../core/components/dialogs/withdraw-application/withdraw-application.component';
import { EditAuthorComponent } from '../core/components/dialogs/edit-author/edit-author.component';
import { AuthorCardComponent } from '../core/components/shared/author-card/author-card.component';
import { CollaboratorCardComponent } from '../core/components/shared/collaborator-card/collaborator-card.component';
import { EditCollaboratorsComponent } from '../core/components/dialogs/edit-collaborators/edit-collaborators.component';
import { RejectApplicationComponent } from '../core/components/dialogs/reject-application/reject-application.component';
import { DeleteRecruiterComponent } from '../core/components/dialogs/delete-recruiter/delete-recruiter.component';
import { SendBlueFormComponent } from '../core/components/dialogs/blueform/blueform.component';
import { InviteExternalComponent } from '../core/components/dialogs/invite-external/invite-external.component';

@NgModule({
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        CreatePasswordComponent,
        CreateNewPasswordComponent, // TODO: Remove this dialog component if not useable
        LoginComponent,
        ResetPasswordComponent,
        WithdrawApplicationComponent,
        InviteComponent,
        EditAuthorComponent,
        EditCollaboratorsComponent,
        AuthorCardComponent,
        CollaboratorCardComponent,
        RejectApplicationComponent,
        DeleteRecruiterComponent,
        SendBlueFormComponent,
        InviteExternalComponent
    ],
    exports: [
        CreatePasswordComponent,
        CreateNewPasswordComponent,
        LoginComponent,
        ResetPasswordComponent,
        WithdrawApplicationComponent,
        InviteComponent,
        EditAuthorComponent,
        EditCollaboratorsComponent,
        AuthorCardComponent,
        CollaboratorCardComponent,
        RejectApplicationComponent,
        DeleteRecruiterComponent,
        SendBlueFormComponent,
        InviteExternalComponent
    ],
    entryComponents: [
        CreatePasswordComponent,
        CreateNewPasswordComponent,
        LoginComponent,
        ResetPasswordComponent,
        WithdrawApplicationComponent,
        InviteComponent,
        EditAuthorComponent,
        EditCollaboratorsComponent,
        AuthorCardComponent,
        CollaboratorCardComponent,
        RejectApplicationComponent,
        DeleteRecruiterComponent,
        SendBlueFormComponent,
        InviteExternalComponent
    ],
})
export class DialogModule { }
