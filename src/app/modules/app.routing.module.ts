import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../core/services/auth-guard.service';

import { ChangePasswordComponent } from '../core/components/pages/change-password/change-password.component';
import { CreateJobComponent } from '../core/components/pages-admin/create-job/create-job.component';
import { CreateJobPreviewComponent } from '../core/components/pages-admin/create-job-preview/create-job-preview.component';
import { CreateUserComponent } from '../core/components/pages-admin/create-user/create-user.component';
import { DashboardComponent } from '../core/components/pages-admin/dashboard/dashboard.component';
import { HomeComponent } from '../core/components/pages/home/home.component';
import { ChangeHomeComponent } from '../core/components/pages/change-home/change-home.component';
import { JobsAdsComponent } from '../core/components/pages-admin/jobs-ads/jobs-ads.component';
import { JobsAdsDetailComponent } from '../core/components/pages-admin/jobs-ads-detail/jobs-ads-detail.component';
import { JobsComponent } from '../core/components/pages/jobs/jobs.component';
import { JobsDetailComponent } from '../core/components/pages/jobs-detail/jobs-detail.component';
import { JobsApplyComponent } from '../core/components/pages/jobs-apply/jobs-apply.component';
import { ManageUserComponent } from '../core/components/pages-admin/manage-user/manage-user.component';
import { NotFoundComponent } from '../core/components/shared/not-found/not-found.component';
import { ProfileComponent } from '../core/components/pages/profile/profile.component';
import { ProfileEditComponent } from '../core/components/pages/profile-edit/profile-edit.component';
import { LoginComponent } from '../core/components/pages/login/login.component';
import { CandidateListComponent } from '../core/components/pages-admin/candidate-list/candidate-list.component';
import { SubmitBlueformComponent } from '../core/components/pages/submit-blueform/submit-blueform.component';
import { AllCandidateComponent } from '../core/components/pages-admin/all-candidate/all-candidate.component';
import { ViewBlueformComponent } from '../core/components/pages/view-blueform/view-blueform.component';
import { ViewOnboardformComponent } from '../core/components/pages/view-onboardform/view-onboardform.component';
import { SubmitOnboardingFormComponent } from '../core/components/pages/submit-onboarding-form/submit-onboarding-form.component';
import { ChatComponent } from '../core/components/pages/chat/chat.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'sign-up', component: JobsApplyComponent },
    {
        path: 'profile', children: [
            { path: '', component: ProfileComponent, pathMatch: 'full' },
            { path: 'edit', component: ProfileEditComponent },
        ]
    },
    { path: 'submit-onboarding-form', component: SubmitOnboardingFormComponent },
    {
        path: 'jobs', children: [
            { path: '', component: JobsComponent, pathMatch: 'full' },
            { path: ':id', component: JobsDetailComponent },
            { path: ':id/apply', component: JobsApplyComponent }
        ]
    },
    {
        path: 'admin', children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'change-home', component: ChangeHomeComponent },
            {
                path: 'jobs-ads', children: [
                    { path: '', component: JobsAdsComponent, pathMatch: 'full' },
                    { path: 'create', component: CreateJobComponent },
                    { path: 'edit/:id', component: CreateJobComponent },
                    { path: ':id', component: CreateJobPreviewComponent },
                    { path: ':id/:status', component: JobsAdsDetailComponent },
                ]
            },
            {
                path: 'manage-user', children: [
                    { path: '', component: ManageUserComponent, pathMatch: 'full' },
                    { path: 'create', component: CreateUserComponent },
                ]
            },
            {
                path: 'candidate-list', children: [
                    { path: '', component: CandidateListComponent, pathMatch: 'full'},
                    { path: 'potential/:flag', component: CandidateListComponent, pathMatch: 'full'}
                ]
            },
            { // nanti ganti
                path: 'all-candidate', component: AllCandidateComponent, pathMatch: 'full'
            }
        ],
        canActivate: [AuthGuard]
    },
    { path: 'jobs-ads/preview', component: CreateJobPreviewComponent },
    { path: 'create-user', component: CreateUserComponent },
    { path: 'set-password', component: ChangePasswordComponent },
    { path: 'submit-blueform', component: SubmitBlueformComponent },
    { path: 'view-blueform/:id', component: ViewBlueformComponent },
    { path: 'view-onboardform/:id', component: ViewOnboardformComponent },
    { path: 'login', component: LoginComponent },
    { path: 'chat', component: ChatComponent },
    { path: 'not-found', component: NotFoundComponent },
    // { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {
        scrollPositionRestoration: 'enabled'
    })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
