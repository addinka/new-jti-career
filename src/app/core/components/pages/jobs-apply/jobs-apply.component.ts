import { ApplicationService } from 'src/app/core/services/application.service';
import { UserService } from 'src/app/core/services/user.service';
import { CreateNewPasswordComponent } from '../../dialogs/create-new-password/create-new-password.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CreatePasswordComponent } from 'src/app/core/components/dialogs/create-password/create-password.component';
import { LoginComponent } from 'src/app/core/components/dialogs/login/login.component';
import { ResetPasswordComponent } from 'src/app/core/components/dialogs/reset-password/reset-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from 'src/app/core/services/job.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { JobDetailModel } from 'src/app/core/models/job.detail.model';
import { ToastService } from 'src/app/core/services/toast.service';
import { Arrays, BASE_URL, DOCUMENT_TYPE } from 'src/app/core/utils/constant';
import { RegexMapping } from 'src/app/core/utils/regex.mapping';
import { DialogService } from 'src/app/core/services/dialog.service';
import { e } from '@angular/core/src/render3';

@Component({
  selector: 'app-jobs-apply',
  templateUrl: './jobs-apply.component.html',
  styleUrls: ['./jobs-apply.component.scss'],

})
export class JobsApplyComponent implements OnInit {

  public applyForm: FormGroup;
  public workExperienceForm: FormGroup;
  public isDisabled: boolean;
  public isFlexible: boolean;
  public isRegistered: boolean;

  public lanItems: string[] = [];
  public expItems: string[] = [];
  public eduItems: string[] = [];
  public locItems: string[] = [];
  public infoItems: string[] = [];

  public isPasswordVisible = false;
  public isConfirmPasswordVisible = false;

  public user = {
    name: '',
    email: '',
    contact: '',
    linkedinURL: '',
    domicile: '',
    university: '',
    majorField: '',
    language: '',
    informationSource: '',
    companyName: [],
    jobdesk: [],
    position: [],
    startPeriod: [],
    endPeriod: [],
    status: '',
    degree: '',
    experience: '',
    selfDesc: '',
    qualification: '',
    password: '',
    attachments: {}
  };
  public basicSets: string[] = [
    'cv', 'portfolio'
  ];

  public documents = {
    saveChanges: false,
    editable: false,
    doc: [],
  };
  public documentType = DOCUMENT_TYPE;

  public steps: any = [
    {
      name: 'Personal Info',
      status: 'ongoing',
      date: null
    },
    {
      name: 'Apply',
      status: null,
      date: null
    },
    {
      name: 'Test',
      status: null,
      date: null
    },
    {
      name: 'Interview I',
      status: null,
      date: null
    },
    {
      name: 'Interview II',
      status: null,
      date: null
    },
    {
      name: 'On Board',
      status: null,
      date: null
    }
  ];

  public id: string;
  public job: JobDetailModel;
  public errorMessage: string;
  public isError = false;
  public pathPhoto;
  public isPathPhoto = false;

  public profpic: File;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private dialog: DialogService,
    private fb: FormBuilder,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private userService: UserService) {
    this.isFlexible = false;
    this.applyForm = this.fb.group({
      name: ['', Validators.required],
      contactNumber: ['', Validators.required],
      emailAddress: ['', Validators.compose([
        Validators.required,
        Validators.pattern(RegexMapping.EMAIL_VALIDATOR)
      ])],
      linkedinURL:[''],
      domicile: ['', Validators.required],
      otherDomicile: [''],
      university: [''],
      majorField: [''],
      language: ['', Validators.required],
      informationSource: [''],
      experience: ['', Validators.required],
      educationalDegree: ['', Validators.required],
      selfDescription: ['', Validators.required],
      qualifications: ['', Validators.required],
      others: [''],
      expectedSalary: [''],
      negotiable: [this.isFlexible],
      password: [''],
      confirmPassword: ['']
    });

    this.workExperienceForm = this.fb.group({
      workExperience: this.fb.array([])
    });

    const workExperienceArray = this.workExperienceForm.get('workExperience') as FormArray;
    workExperienceArray.push(this.fb.group({
      companyName: [],
      position: [],
      jobdesk: [],
      startPeriod: [],
      endPeriod: []
    }));

    this.setDisabled(false);
  }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      // Get user profile.
      this.isRegistered = true;
      this.onGetProfile();

      // Change steps status.
      this.steps[0].status = 'complete';
      this.steps[1].status = 'ongoing';

      this.setDisabled(true);
    }else{
      this.isRegistered = false;
      this.applyForm.controls['informationSource'].setValidators([Validators.required]);
    }

    // 'id' is the name of the route parameter.
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);

    // Get job detail.
    if (this.id !== undefined) {
      this.onGetJobDetail(this.id);
      this.applyForm.controls['others'].setValidators([Validators.required]);
      this.applyForm.controls['expectedSalary'].setValidators([Validators.required]);
    } else {
      this.id = '';
      this.applyForm.controls['password'].setValidators([Validators.required]);
      this.applyForm.controls['confirmPassword'].setValidators([Validators.required]);
    }

    this.lanItems = Arrays.LANGUAGE;
    this.expItems = Arrays.EXPERIENCE;
    this.eduItems = Arrays.EDUCATION;
    this.locItems = Arrays.LOCATION;
    this.infoItems = Arrays.INFORMATION;

    // Remove documents in basic sets
    this.documents.doc = [];

    // Add documents to basic sets
    if (localStorage.getItem('token') === null) {
      this.basicSets.forEach(
        type => {
          this.documents.doc.push({
            type: type,
            name: this.documentType[type],
            file: null,
            tempFile: null,
            mark: {
              delete: false,
              reupload: false,
              newUpload: false
            }
          });
        }
      );
    }

    // // console.log('Basic Sets: ', this.documents);
  }

  get workExperienceList() {
    const control = this.workExperienceForm.get('workExperience') as FormArray;
    return control;
  }

  workExperience(): FormArray {
    return this.workExperienceForm.get('workExperience') as FormArray;
  }

  newWorkExperience(): FormGroup {
    return this.fb.group({
      companyName: [''],
      position: [''],
      jobdesk: [''],
      startPeriod: [''],
      endPeriod: ['']
    });
  }

  addWorkExperience() {
    this.workExperience().push(this.newWorkExperience());
  }

  removeWorkExperience(i: number) {
    this.workExperience().removeAt(i);

    // this.doSubmit();
  }

  onGetJobDetail(id: string) {
    this.jobService.getJobDetail(id)
      .subscribe(response => {
        this.job = response;
      });
  }

  onGetProfile() {
    this.userService.getProfile().toPromise()
      .then(
        data => {
          this.user.attachments = data['attachments'];

          this.documents.doc = [];

          if (this.user.attachments.hasOwnProperty('cv')) {
            this.documents.doc.push({
              type: 'cv',
              name: this.documentType['cv'],
              file: 'any',
              tempFile: null,
              mark: {
                delete: false,
                reupload: false,
                newUpload: false
              }
            });
          } else {
            this.documents.doc.push({
              type: 'cv',
              name: this.documentType['cv'],
              file: null,
              tempFile: null,
              mark: {
                delete: false,
                reupload: false,
                newUpload: false
              }
            });
          }

          if (this.user.attachments.hasOwnProperty('portfolio')) {
            this.documents.doc.push({
              type: 'portfolio',
              name: this.documentType['portfolio'],
              file: 'any',
              tempFile: null,
              mark: {
                delete: false,
                reupload: false,
                newUpload: false
              }
            });
          } else {
            this.documents.doc.push({
              type: 'portfolio',
              name: this.documentType['portfolio'],
              file: null,
              tempFile: null,
              mark: {
                delete: false,
                reupload: false,
                newUpload: false
              }
            });
          }

          if (data.domicile !== 'Jakarta' && data.domicile !== 'Bandung' && data.domicile !== 'Surabaya' && data.domicile !== 'Medan') {
            this.applyForm.controls['domicile'].setValue('Other');
            this.applyForm.controls['otherDomicile'].setValue(data['domicile']);
          } else {
            this.applyForm.controls['domicile'].setValue(data['domicile']);
          }

          // console.log('HEY: ', data);
          this.applyForm.controls['name'].setValue(data['name']);
          this.applyForm.controls['contactNumber'].setValue(data['contact']);
          this.applyForm.controls['emailAddress'].setValue(data['email']);
          this.applyForm.controls['linkedinURL'].setValue(data['linkedinURL']);
          this.applyForm.controls['university'].setValue(data['university']);
          this.applyForm.controls['majorField'].setValue(data['majorField']);
          this.applyForm.controls['language'].setValue(data['language'].split(','));
          this.applyForm.controls['experience'].setValue(data['experience']);
          this.applyForm.controls['educationalDegree'].setValue(data['degree']);
          this.applyForm.controls['selfDescription'].setValue(data['selfDesc']);
          this.applyForm.controls['qualifications'].setValue(data['qualification']);
          // this.applyForm.controls['informationSource'].setValue(data['informationSource']);

          this.workExperienceForm = this.fb.group({
            workExperience: this.fb.array([])
          });

          for (let i = 0; i < data['workExperience'].length; i++) {
            const newWorkExperience = this.fb.group({
              companyName: [data['workExperience'][i].companyName],
              position: [data['workExperience'][i].position],
              jobdesk: [data['workExperience'][i].jobdesk],
              startPeriod: [data['workExperience'][i].startPeriod],
              endPeriod: [data['workExperience'][i].endPeriod]
            });

            this.workExperience().push(newWorkExperience);
          }

          this.applyForm.controls['language'].disable();
          this.applyForm.controls['experience'].disable();
          this.applyForm.controls['educationalDegree'].disable();
          this.userService.getProfilePic(data['email']+ '?cacheBreak=' + new Date().getTime()).subscribe(
            response => {
              this.picChangeUser(this.blobToFile(response, 'profPic'));
            },error =>{
                // console.log(error);
            });
          // this.pathPhoto = BASE_URL + data.profpic;
        }
      );


  }

  onSubmit() {
    const value = this.applyForm.getRawValue();
    if (value.domicile === 'Other') {
      value.domicile = value.otherDomicile;
      delete value.otherDomicile;
    } else{
      delete value.otherDomicile;
    }
    if (this.id === '') {
      if (this.applyForm.value.password === this.applyForm.value.confirmPassword) {
        this.onCreateUser();
      } else {
        this.toastService.error('Password not match');
      }
    } else {
      if (this.isDisabled) {
        this.onApplyJob();
      } else {
        console.log(this.user);
        this.openCreatePassword(value);
      }
    }
  }

  onCreateUser() {
    let companyName = [];
    let position = [];
    let jobdesk = [];
    let startPeriod = [];
    let endPeriod = [];

    if (this.workExperienceForm.value.workExperience !== []) {
      for (let i = 0; i < this.workExperienceForm.value.workExperience.length; i++) {
        companyName.push(this.workExperienceForm.value.workExperience[i].companyName);
        position.push(this.workExperienceForm.value.workExperience[i].position);
        jobdesk.push(this.workExperienceForm.value.workExperience[i].jobdesk);
        startPeriod.push(this.workExperienceForm.value.workExperience[i].startPeriod);
        endPeriod.push(this.workExperienceForm.value.workExperience[i].endPeriod);
      }
    }

    let domicile;
    if (this.applyForm.value.domicile === 'Other') {
      domicile = this.applyForm.value.otherDomicile;
      delete this.applyForm.value.otherDomicile;
    } else {
      domicile = this.applyForm.value.domicile;
      delete this.applyForm.value.otherDomicile;
    }

    const applicationData = {
      name: this.applyForm.value.name,
      email: this.applyForm.value.emailAddress,
      contact: this.applyForm.value.contactNumber,
      linkedinURL: this.applyForm.value.linkedinURL,
      domicile: domicile,
      university: this.applyForm.value.university,
      majorField: this.applyForm.value.majorField,
      companyName: companyName,
      position: position,
      jobdesk: jobdesk,
      startPeriod: startPeriod,
      endPeriod: endPeriod,
      language: this.applyForm.value.language,
      informationSource: this.applyForm.value.informationSource,
      degree: this.applyForm.value.educationalDegree,
      experience: this.applyForm.value.experience,
      selfDesc: this.applyForm.value.selfDescription,
      qualification: this.applyForm.value.qualifications,
      password: this.applyForm.value.password,
      pic: this.profpic,
      cv: this.documents.doc[0].file,
      portfolio: this.documents.doc[1].file
    };

    // console.log(applicationData);

    this.userService.createUser(applicationData).subscribe(
      data => {
        // console.log('----data app', data);
        this.toastService.success('New account created, please check your email to verify registration.');
        this.router.navigate(['/home']);
      },
      error => {
        // console.log(error);
        this.toastService.error('Create account failed');
        this.isError = true;
        this.errorMessage = error;
        // this.applyForm.reset();
      }
    );
  }

  onApplyJob() {
    const applicationData = {
      jobID: this.id,
      expSalary: Number(this.applyForm.value.expectedSalary),
      isNegotiable: this.applyForm.value.negotiable,
      comments: this.applyForm.value.others
    };

    this.applicationService.createApplication(applicationData).subscribe(
      data => {
        // console.log('----data app', data);
        // if (data.ok) {
          this.toastService.success('New application create');
          this.router.navigate(['/profile']);
        // }
      },
      error => {
        // console.log(error);
        this.toastService.error('Create application failed');
        this.isError = true;
        this.errorMessage = error;
        // this.applyForm.reset();
      }
    );
  }

  onChangeFlexibleValue() {
    this.isFlexible = !this.isFlexible;
    this.applyForm.patchValue({negotiable: this.isFlexible});
  }

  onSelectPhoto() {
    document.getElementById('photo').click();
  }

  onPhotoSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pathPhoto = e.target.result;
        this.isPathPhoto = true;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.profpic = event.target.files[0];
    }
  }

  openCreatePassword(value: any) {
    const dialogRef = this.dialog.getCreatePasswordDialog(value);

    dialogRef.afterClosed().subscribe(result => {
      let domicile;
      if (this.applyForm.value.domicile === 'Other') {
        domicile = this.applyForm.value.otherDomicile;
        delete this.applyForm.value.otherDomicile;
      } else {
        domicile = this.applyForm.value.domicile;
        delete this.applyForm.value.otherDomicile;
      }

      if (result.next) {
        // set user data
        this.user.name = this.applyForm.value.name;
        this.user.email = this.applyForm.value.emailAddress;
        this.user.contact = this.applyForm.value.contactNumber;
        this.user.linkedinURL = this.applyForm.value.linkedinURL;
        this.user.domicile = domicile;
        this.user.university = this.applyForm.value.university;
        this.user.majorField = this.applyForm.value.majorField;

        console.log(this.workExperienceForm.value.workExperience);
        if (this.workExperienceForm.value.workExperience !== []) {
          this.user.companyName = [];
          this.user.position = [];
          this.user.jobdesk = [];
          this.user.startPeriod = [];
          this.user.endPeriod = [];
          for (let i = 0; i < this.workExperienceForm.value.workExperience.length; i++) {
            if(this.workExperienceForm.value.workExperience[i].companyName === null){
              this.user.companyName.push('');
            }else{
              this.user.companyName.push(this.workExperienceForm.value.workExperience[i].companyName);
            }

            if(this.workExperienceForm.value.workExperience[i].position === null){
              this.user.position.push('');
            }else{
              this.user.position.push(this.workExperienceForm.value.workExperience[i].position);
            }

            if(this.workExperienceForm.value.workExperience[i].jobdesk === null){
              this.user.jobdesk.push('');
            }else{
              this.user.jobdesk.push(this.workExperienceForm.value.workExperience[i].jobdesk);
            }

            if(this.workExperienceForm.value.workExperience[i].startPeriod === null){
              this.user.startPeriod.push('');
            }else{
              this.user.startPeriod.push(this.workExperienceForm.value.workExperience[i].startPeriod);
            }

            if(this.workExperienceForm.value.workExperience[i].endPeriod === null){
              this.user.endPeriod.push('');
            }else{
              this.user.endPeriod.push(this.workExperienceForm.value.workExperience[i].endPeriod);
            }
            
          }
        }

        this.user.language = this.applyForm.value.language.toString();
        this.user.informationSource = this.applyForm.value.informationSource;
        this.user.status = ''; // UI don't provide this data.
        this.user.degree = this.applyForm.value.educationalDegree;
        this.user.experience = this.applyForm.value.experience;
        this.user.selfDesc = this.applyForm.value.selfDescription;
        this.user.qualification = this.applyForm.value.qualifications;
        this.user.qualification = this.applyForm.value.qualifications;
        this.user.password = result.data.password;

        console.log(typeof(this.documents.doc[0].file))
        const applicationData = {
          jobID: this.id,
          expSalary: Number(this.applyForm.value.expectedSalary),
          isNegotiable: this.applyForm.value.negotiable ? this.applyForm.value.negotiable : false,
          comments: this.applyForm.value.others,
          pic: this.profpic,
          cv: this.documents.doc[0].file,
          portfolio: this.documents.doc[1].file,
          user: this.user
        };

        console.log(applicationData);
        // Register and create new application - for guest
        this.applicationService.createApplication(applicationData).subscribe(
          data => {
            // if (data.ok) {
              this.toastService.success('New application create, please try to login');
              this.router.navigate(['/home']);
              // this.doLogin(this.user.email, this.user.password);
              this.applyForm.reset();
            // } else {
            //   this.toastService.error('Create application failed');
            // }
          },
          error => {
            this.toastService.error('Create application failed');
            this.isError = true;
            this.errorMessage = error;
            // this.applyForm.reset();
          }
        );
      }

    });
  }

  doLogin(email: string, password: string) {
    const credentials: any = {
      'email': email,
      'password': password
    };

    this.authService.login(credentials).toPromise()
      .then(
        data => {
          if (data.auth) {
            localStorage.setItem('token', data.token);
            this.router.navigate(['/profile']);
          }
        },
        error => {
          // console.log(error);
        }
      );
  }

  openLogin() {
    const dialogRef = this.dialog.getLoginDialog();

    dialogRef.afterClosed().subscribe(result => {
      if (result.token) {
        if (result.role === 'User') {
          // this.router.navigate(['/home']);
          // location.reload();
          this.setDisabled(true);
          this.onGetProfile();
          // console.log('login.. ');
        } else {
          this.router.navigate(['/admin/dashboard']);
        }
      }
    });
  }

  openResetPassword() {
    const dialogRef = this.dialog.getResetPasswordDialog();

    dialogRef.afterClosed().subscribe(result => {
      if (result.next === 'login') {
        this.openLogin();
      }
    });
  }

  setDisabled(value: boolean) {
    this.isDisabled = value;
    if (value) {
      this.applyForm.controls['name'].disable();
      this.applyForm.controls['domicile'].disable();
      this.applyForm.controls['contactNumber'].disable();
      this.applyForm.controls['emailAddress'].disable();
      this.applyForm.controls['university'].disable();
      this.applyForm.controls['majorField'].disable();
      this.applyForm.controls['language'].disable();
      this.applyForm.controls['experience'].disable();
      this.applyForm.controls['educationalDegree'].disable();
      this.applyForm.controls['selfDescription'].disable();
      this.applyForm.controls['qualifications'].disable();
      this.workExperienceForm.controls['workExperience'].disable();
    } else {
      this.applyForm.controls['name'].enable();
      this.applyForm.controls['domicile'].enable();
      this.applyForm.controls['contactNumber'].enable();
      this.applyForm.controls['emailAddress'].enable();
      this.applyForm.controls['university'].enable();
      this.applyForm.controls['majorField'].enable();
      this.applyForm.controls['language'].enable();
      this.applyForm.controls['experience'].enable();
      this.applyForm.controls['educationalDegree'].enable();
      this.applyForm.controls['selfDescription'].enable();
      this.applyForm.controls['qualifications'].enable();
      this.workExperienceForm.controls['workExperience'].enable();
    }
  }

  enableEdit() {
    this.documents.editable = !this.documents.editable;
  }

  saveDocumentChanges(saveChanges: boolean) {
    this.documents.editable = !this.documents.editable;
    this.documents.saveChanges = saveChanges;
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;
  
    // Cast to a File() type
    return theBlob as File;
  }
  
  picChangeUser(thePicture: File) {
    // for picture changes
    const reader = new FileReader();
    reader.onload = e => {
      this.pathPhoto = reader.result;
    };
  
    reader.readAsDataURL(thePicture);
  }
}
