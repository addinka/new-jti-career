import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { PROFILE_URL } from 'src/app/core/utils/constant';

import { Arrays } from '../../../utils/constant';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  public editForm: FormGroup;
  public workExperienceForm: FormGroup;
  public domiciles: string[] = Arrays.LOCATION;
  public languages: string[] = Arrays.LANGUAGE;
  public experiences: string[] = Arrays.EXPERIENCE;
  public educations: string[] = Arrays.EDUCATION;

  public profileURL: any;
  public email: string;
  public myLanguage = [];
  myPic: any;
  myPicFile: File;
  public hasChanged: boolean;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public userService: UserService,
    public authService: AuthService,
    public toastService: ToastService) {
      // Create edit form.
      this.editForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        contact: ['', Validators.required],
        linkedinURL:[''],
        domicile: ['', Validators.required],
        otherDomicile: [''],
        university: [''],
        majorField: [''],
        languageTemp: ['', Validators.required],
        language: [''],
        experience: ['', Validators.required],
        degree: ['', Validators.required],
        selfDesc: ['', Validators.required],
        qualification: ['', Validators.required],
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
    }

  ngOnInit() {
    // window.addEventListener('beforeunload', (event) => {
    //   // Cancel the event as stated by the standard.
    //   event.preventDefault();
    //   // Chrome requires returnValue to be set.
    //   event.returnValue = '';
    // });

    // If user has not logged in,
    // navigate to home.
    if (!localStorage.getItem('token')) {
      this.router.navigate(['']);
    } else {
      // Get user profile.
      this.onGetProfile();
    }
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

  onGetProfile() {
    this.userService.getProfile().toPromise()
      .then(
        data => {
          const language: string[] = [data['language']];


          if (data.domicile !== 'Jakarta' && data.domicile !== 'Bandung' && data.domicile !== 'Surabaya' && data.domicile !== 'Medan') {
            this.editForm.controls['domicile'].setValue('Other');
            this.editForm.controls['otherDomicile'].setValue(data['domicile']);
          } else {
            this.editForm.controls['domicile'].setValue(data['domicile']);
          }

          console.log(data);
          this.editForm.controls['name'].setValue(data['name']);
          this.editForm.controls['email'].setValue(data['email']);
          this.editForm.controls['contact'].setValue(data['contact']);
          this.editForm.controls['linkedinURL'].setValue(data['linkedinURL']);
          this.editForm.controls['university'].setValue(data['university']);
          this.editForm.controls['majorField'].setValue(data['majorField']);
          this.editForm.controls['language'].setValue(language);
          this.myLanguage = language[0].split(',');
          this.editForm.controls['experience'].setValue(data['experience']);
          this.editForm.controls['degree'].setValue(data['degree']);
          this.editForm.controls['selfDesc'].setValue(data['selfDesc']);
          this.editForm.controls['qualification'].setValue(data['qualification']);

          this.workExperienceForm.controls['workExperience'] = this.fb.array([]);

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

          // Set profile picture URL.
          // this.profileURL = PROFILE_URL + data['email'];
          this.email = data['email'];

          this.userService.getProfilePic(this.email+ '?cacheBreak=' + new Date().getTime()).subscribe(
            response => {
              this.picChangeAlumni(this.blobToFile(response, 'profPic'));
            },error =>{
                // console.log(error);
            });
          }
        
      );
  }


  // here be spaghetti
  onSubmit() {
    let companyName = [];
    let position = [];
    let jobdesk = [];
    let startPeriod = [];
    let endPeriod = [];
    const language = this.getLanguage();
    if (this.workExperience().value !== []) {
      for (let i = 0; i < this.workExperience().value.length; i++) {
        companyName.push(this.workExperience().value[i].companyName);
        position.push(this.workExperience().value[i].position);
        jobdesk.push(this.workExperience().value[i].jobdesk);
        startPeriod.push(this.workExperience().value[i].startPeriod);
        endPeriod.push(this.workExperience().value[i].endPeriod);
      }
    }

    let domicile;
    if (this.editForm.value.domicile === 'Other') {
      domicile = this.editForm.value.otherDomicile;
      delete this.editForm.value.otherDomicile;
    } else {
      domicile = this.editForm.value.domicile;
      delete this.editForm.value.otherDomicile;
    }

    const applicationData = {
      name: this.editForm.value.name,
      email: this.editForm.value.email,
      contact: this.editForm.value.contact,
      linkedinURL: this.editForm.value.linkedinURL,
      domicile: domicile,
      university: this.editForm.value.university,
      majorField: this.editForm.value.majorField,
      companyName: companyName,
      position: position,
      jobdesk: jobdesk,
      startPeriod: startPeriod,
      endPeriod: endPeriod,
      language: language,
      degree: this.editForm.value.degree,
      experience: this.editForm.value.experience,
      selfDesc: this.editForm.value.selfDesc,
      qualification: this.editForm.value.qualification,
    };


    this.userService.updateUser(applicationData).subscribe(res => {
      this.toastService.success('Profile updated');
      this.authService.setCurrentName(this.editForm.controls['name'].value);
      if (this.hasChanged) {
        this.userService.postProfilePic(this.myPicFile).toPromise().then(x => this.router.navigate(['profile']));
      } else {
        this.router.navigate(['profile']);
      }
    });
  }

  getLanguage(): string {
    const languageTemp = this.editForm.get('languageTemp').value;
    let language = '';

    languageTemp.forEach((element: any, index: number) => {
      if (index === languageTemp.length - 1) {
        language += element;
      } else {
        language += element + ',';
      }
    });
    return language;
  }

  picChange(thePicture: File) {
    // for picture changes
    const reader = new FileReader();
    reader.onload = e => {
      this.myPic = reader.result;  // console.log(this.myPic);
    };
    reader.readAsDataURL(thePicture);
    this.hasChanged = true;
    this.myPicFile = thePicture;
  }

  onSelectedImage(theFileEvent: Event) {
    // console.log('an image has been selected');
    const file = (<HTMLInputElement>theFileEvent.target).files[0];
    // console.log(file);
    this.picChange(file);
  }

  // email?
  onChangePass() {
    this.authService.requestResetPassword(this.email).subscribe(
      data => {
        // console.log(data);
        this.toastService.success('Reset password link has been successfully sent to your email!');
      }, err => {
        // console.log(err);
        this.toastService.error('Failed to send reset password link');
      } );
  }

  onSelectPhoto() {
    document.getElementById('photo').click();
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    // Cast to a File() type
    return theBlob as File;
  }

  picChangeAlumni(thePicture: File) {
    // for picture changes
    const reader = new FileReader();
    reader.onload = e => {
      this.profileURL = reader.result;
    };

    reader.readAsDataURL(thePicture);
  }

}
