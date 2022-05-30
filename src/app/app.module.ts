import { AppMaterialModule } from './modules/app.material.module';
import { AppRoutingModule } from './modules/app.routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from './modules/app.dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule } from 'ngx-mask';
import { IConfig } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';

import { AuthGuardService } from './core/services/auth-guard.service';
import { ApplicationService } from './core/services/application.service';
import { AuthService } from './core/services/auth.service';
import { JobService } from './core/services/job.service';
import { RecruiterService } from './core/services/recruiter.service';
import { UserService } from './core/services/user.service';
import { TestimonyService } from './core/services/testimony.service';
import { WINDOW_PROVIDERS } from './core/services/window.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { AppComponent } from './app.component';
import { ApplicantComponent } from './core/components/pages-admin/jobs-ads-detail/components/applicant/applicant.component';
// tslint:disable-next-line: max-line-length
import { ApplicantDetailComponent } from './core/components/pages-admin/jobs-ads-detail/components/applicant-detail/applicant-detail.component';
import { ApplicantListComponent } from './core/components/pages-admin/jobs-ads-detail/components/applicant-list/applicant-list.component';
import { ApplicationStatusComponent } from './core/components/shared/application-status/application-status.component';
import { ChangePasswordComponent } from './core/components/pages/change-password/change-password.component';
import { CalenderComponent } from './core/components/pages-admin/dashboard/calender/calender.component';
import { CreateJobComponent } from './core/components/pages-admin/create-job/create-job.component';
import { CreateJobPreviewComponent } from './core/components/pages-admin/create-job-preview/create-job-preview.component';
import { CreateUserComponent } from './core/components/pages-admin/create-user/create-user.component';
import { DashboardComponent } from './core/components/pages-admin/dashboard/dashboard.component';
import { DocumentComponent } from './core/components/shared/document/document.component';
import { FilterComponent } from './core/components/shared/filter/filter.component';
import { HomeComponent } from './core/components/pages/home/home.component';
import { ChangeHomeComponent } from './core/components/pages/change-home/change-home.component';
import { ChangeHomeHotrolesComponent } from './core/components/pages/change-home-hotroles/change-home-hotroles.component';
import { ChangeHomeTestimoniesComponent } from './core/components/pages/change-home-testimonies/change-home-testimonies.component';
import { JobsApplyComponent } from './core/components/pages/jobs-apply/jobs-apply.component';
import { JobsAdsComponent } from './core/components/pages-admin/jobs-ads/jobs-ads.component';
import { JobsAdsDetailComponent } from './core/components/pages-admin/jobs-ads-detail/jobs-ads-detail.component';
import { JobsComponent } from './core/components/pages/jobs/jobs.component';
import { JobsDetailComponent } from './core/components/pages/jobs-detail/jobs-detail.component';
import { ManageUserComponent } from './core/components/pages-admin/manage-user/manage-user.component';
import { NotFoundComponent } from './core/components/shared/not-found/not-found.component';
import { TestimonialComponent } from './core/components/shared/testimonial/testimonial.component';
import { UserCardComponent } from './core/components/pages-admin/manage-user/components/user-card/user-card.component';
import { PaginationComponent } from './core/components/shared/pagination/pagination.component';
import { ProfileComponent } from './core/components/pages/profile/profile.component';
import { ProfileEditComponent } from './core/components/pages/profile-edit/profile-edit.component';
import { ProgressComponent } from './core/components/pages-admin/dashboard/progress/progress.component';
import { ProgressDetailComponent } from './core/components/pages-admin/dashboard/progress-detail/progress-detail.component';
import { LoginComponent } from './core/components/pages/login/login.component';

import { ApplicationStatusDirective } from './core/components/pages-admin/jobs-ads-detail/directives/application-status.directive';

import { FooterComponent } from './core/components/shared/footer/footer.component';
import { HeaderComponent } from './core/components/shared/header/header.component';
import { JobDetailShortComponent } from './core/components/shared/job-detail-short/job-detail-short.component';
import { JobDetailLongComponent } from './core/components/shared/job-detail-long/job-detail-long.component';
import { StepsComponent } from './core/components/shared/steps/steps.component';
import { StatusComponent } from './core/components/shared/status/status.component';
import { LoaderComponent } from './core/components/loader/loader.component';
import { MatCardModule } from '@angular/material';
import { UtilsService } from './core/services/utils.service';
import { FilterCandidateComponent } from './core/components/shared/filter-candidate/filter-candidate.component';
import { FilterJobComponent } from './core/components/shared/filter-job/filter-job.component';
import { CandidateListComponent } from './core/components/pages-admin/candidate-list/candidate-list.component';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ProfpicPopUpComponent } from './core/components/dialogs/profpic-pop-up/profpic-pop-up.component';
import { SubmitBlueformComponent } from './core/components/pages/submit-blueform/submit-blueform.component';
import { AllCandidateComponent } from './core/components/pages-admin/all-candidate/all-candidate.component';
import { FilterAllCandidateComponent } from './core/components/shared/filter-all-candidate/filter-all-candidate.component';
import { CvIndicatorComponent } from './core/components/shared/cv-indicator/cv-indicator.component';
import { ViewBlueformComponent } from './core/components/pages/view-blueform/view-blueform.component';
import { ViewOnboardformComponent } from './core/components/pages/view-onboardform/view-onboardform.component';
import { SubmitOnboardingFormComponent } from './core/components/pages/submit-onboarding-form/submit-onboarding-form.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    AppComponent,
    ApplicantComponent,
    ApplicantDetailComponent,
    ApplicantListComponent,
    ApplicationStatusComponent,
    ApplicationStatusDirective,
    ChangePasswordComponent,
    CalenderComponent,
    CreateJobComponent,
    CreateJobPreviewComponent,
    CreateUserComponent,
    DashboardComponent,
    DocumentComponent,
    FilterComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    ChangeHomeComponent,
    ChangeHomeHotrolesComponent,
    ChangeHomeTestimoniesComponent,
    JobDetailLongComponent,
    JobDetailShortComponent,
    JobsAdsComponent,
    JobsAdsDetailComponent,
    JobsApplyComponent,
    JobsComponent,
    JobsDetailComponent,
    ManageUserComponent,
    NotFoundComponent,
    PaginationComponent,
    ProfileComponent,
    ProfileEditComponent,
    ProgressComponent,
    ProgressDetailComponent,
    StatusComponent,
    StepsComponent,
    TestimonialComponent,
    UserCardComponent,
    LoginComponent,
    LoaderComponent,
    FilterCandidateComponent,
    FilterJobComponent,
    CandidateListComponent,
    ProfpicPopUpComponent,
    SubmitBlueformComponent,
    AllCandidateComponent,
    FilterAllCandidateComponent,
    CvIndicatorComponent,
    ViewBlueformComponent,
    ViewOnboardformComponent,
    SubmitOnboardingFormComponent
  ],
  imports: [
    AppMaterialModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    DialogModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    RichTextEditorAllModule,
    DragDropModule,
    ScrollingModule,
    ImageCropperModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 60000,
      disableTimeOut: false,
      tapToDismiss: false
    }),
    NgxMaskModule.forRoot(options)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
    ApplicationService,
    AuthService,
    AuthGuardService,
    JobService,
    RecruiterService,
    TestimonyService,
    UtilsService,
    UserService,
    WINDOW_PROVIDERS
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ProfpicPopUpComponent
  ]
})
export class AppModule { }
