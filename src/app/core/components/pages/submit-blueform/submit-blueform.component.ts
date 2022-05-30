import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { Arrays, Constant } from '../../../utils/constant'
import { UserService } from 'src/app/core/services/user.service';
import { JobService } from 'src/app/core/services/job.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-submit-blueform',
  templateUrl: './submit-blueform.component.html',
  styleUrls: ['./submit-blueform.component.scss'],
})

export class SubmitBlueformComponent implements OnInit {
  public personalFormGroup: FormGroup;
  public jobFormGroup: FormGroup;
  public experienceFormGroup: FormGroup;
  public educationFormGroup: FormGroup;
  public skillFormGroup: FormGroup;
  public generalFormGroup: FormGroup;
  public crimeFormGroup: FormGroup;

  public isWNI: boolean;
  public isWNA: boolean;
  public isReady: boolean;
  public isNotReady: boolean;
  public isNotHaveLocation: boolean;
  public isJobDetail: boolean = false;
  public isEducationDetail: boolean = false;

  public token: any;
  public appId: any;
  public jobId: any;
  public blueformID: any;
  
  // Static Data
  public assignments = Arrays.ASSIGNMENTS;
  public employments = Arrays.EMPLOYMENT_TYPE;
  public exJTI = Arrays.EXJTI;
  public assignmentArray: string[] = [];
  public employmentArray: string[] = [];
  public exJTIArray: string[] = [];
  public types = ['High School', 'All Vocational Schools', 'All Colleges or University', 'Other Training Includes military schools and Equivalency Diplomas ']
  public familyTypes = ['Father', 'Mother', 'Siblings', 'Spouse', 'Child'];
  
  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    private jobService: JobService,
    public toastService: ToastService,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService
    ) {
    this.personalFormGroup = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required], 
      birthPlace: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      // postalCode: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      postalCode: ['', Validators.required],
      permanentAddress: ['', Validators.required],
      permanentProvince: ['', Validators.required],
      permanentCity: ['', Validators.required],
      permanentPostalCode: ['', Validators.required],
      presentTelephone: ['', Validators.required],
      permanentTelephone: ['', Validators.required],
      isUnderAge:[false],
      isOverAge:[false],
      isForeigner:[false],
      underAge : [0],
      overAge : [0],
      visa : [''],
      // families: this.fb.array([])
    });

    this.jobFormGroup = this.fb.group({
      position: ['', Validators.required],
      workLocation: ['', Validators.required],
      placement: ['', Validators.required],
      placementLoc1: [''], 
      placementLoc2: [''],
      expectedSalary: ['', Validators.required],
      startWorking: ['', Validators.required ],
    });

    this.experienceFormGroup = this.fb.group({
      jobs: this.fb.array([]),
      contactNumber: ['', Validators.required],
      contactEmail: ['', Validators.required],
      contactAnytime: [false, Validators.required],
      contactDate: ['']
    });

    this.educationFormGroup = this.fb.group({
      educations:this.fb.array([]),
      activitiesSocietiesAchievement: [''],
      scientificPaperTitle: [''],
      researchTitle: [''], 
      publicationTitle: [''],
      patent: ['']
    });

    this.skillFormGroup = this.fb.group({ 
      skills: this.fb.array([], Validators.required),
      languages: this.fb.array([])
    });

    this.generalFormGroup = this.fb.group({
      previouslyWorked: ['', Validators.required],
      previouslyWorkedDetail:[''],
      isAds:[false],
      isAgency: [false], 
      isOther: [false], 
      ads: [''],
      agency: [''],
      other: [''],
      anyRelatives:['', Validators.required], 
      relatives: this.fb.array([]),
      otherWorkAgreement: ['', Validators.required], 
      additionalInformation: [''],
    });

    this.crimeFormGroup = this.fb.group({
      criminalHistory: ['', Validators.required],
      underIndictmentsOrCharged: ['', Validators.required],
      honoredAsIndonesiaVeteran: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(
      queryParams => {
        this.token = queryParams['params'].userToken;
        this.appId = queryParams['params'].appliID;
        this.jobId = queryParams['params'].jobID;
        this.blueformID = queryParams['params'].blueformID;

        console.log(localStorage.getItem('token'))
        if(localStorage.getItem('token') !== null){
          this.authService.setSession(this.token);
        }
       
        // console.log('token', this.token);
        // console.log('appId',this.appId);
        // console.log('jobId',this.jobId);
        // console.log('bluefromId',this.blueformID);
      });

      if(this.blueformID !== undefined){
        this.getBlueform()
      } else {
        this.getProfile();
      }

      this.newSkill();
      this.getJob(this.jobId);
  }

  getProfile() {
    const experienceArray = this.experienceFormGroup.get('jobs') as FormArray;
    this.userService.getProfileToken(this.token).toPromise()
      .then(
        response => {
          // console.log(response);
          this.personalFormGroup.controls['firstName'].setValue(response.name);
          this.personalFormGroup.controls['permanentTelephone'].setValue(response.contact);
          this.personalFormGroup.controls['city'].setValue(response.domicile);
          this.personalFormGroup.controls['email'].setValue(response.userID);

          // Experience Information
          if(response.workExperience.length){
            for (let i = 0; i < response.workExperience.length; i++) {
              if(response.workExperience[i].endPeriod === null || response.workExperience[i].endPeriod === undefined ){
                experienceArray.push(this.fb.group({
                  companyName: [response.workExperience[i].companyName],
                  companyLocation: '',
                  position: [response.workExperience[i].position],
                  startPeriod: [new Date(response.workExperience[i].startPeriod)], 
                  endPeriod: [new Date(response.workExperience[i].endPeriod)],
                  startSalary: '',
                  endSalary: '',
                  jobDescription: [response.workExperience[i].jobdesk],
                  reasonOfQuit: '',
                  curr: [true],
                }));
              } else {
                experienceArray.push(this.fb.group({
                  companyName: [response.workExperience[i].companyName],
                  companyLocation: '',
                  position: [response.workExperience[i].position],
                  startPeriod: [new Date(response.workExperience[i].startPeriod)], 
                  endPeriod: [new Date(response.workExperience[i].endPeriod)],
                  startSalary: '',
                  endSalary: '',
                  jobDescription: [response.workExperience[i].jobdesk],
                  reasonOfQuit: '',
                  curr: [false],
                }));
              }
            }  
          }

           // Education Information
          const newEducation = this.fb.group({
            degree: 'Universitas',
            school: response.university,
            startPeriod: '', 
            endPeriod: '',
            fieldOfStudy: response.majorField,
            grade: '',
          });

          this.education().push(newEducation);
        }
      )
      .catch(
        err => {
          // console.log('err', err);
          if (err.message.includes('Failed to authenticate token')) {
            this.router.navigate(['']);
          }
        });
  }

  getBlueform(){
    const experienceArray = this.experienceFormGroup.get('jobs') as FormArray;

    this.userService.getBlueForm(this.blueformID, this.token)
    .subscribe(response => {
      console.log(response);
      let data = response.docs[0];

      // Personal Information
      this.personalFormGroup.controls['firstName'].setValue(data.personalData.name.firstName);
      this.personalFormGroup.controls['middleName'].setValue(data.personalData.name.middleName);
      this.personalFormGroup.controls['lastName'].setValue(data.personalData.name.lastName);
      this.personalFormGroup.controls['birthPlace'].setValue(data.personalData.birthPlace);
      this.personalFormGroup.controls['birthDate'].setValue(new Date(data.personalData.birthDate));
      this.personalFormGroup.controls['email'].setValue(data.personalData.email);
      this.personalFormGroup.controls['address'].setValue(data.personalData.mailAddress.street);
      this.personalFormGroup.controls['province'].setValue(data.personalData.mailAddress.province);
      this.personalFormGroup.controls['city'].setValue(data.personalData.mailAddress.city);
      this.personalFormGroup.controls['postalCode'].setValue(data.personalData.mailAddress.postalCode);
      this.personalFormGroup.controls['permanentAddress'].setValue(data.personalData.permanentAddress.street);
      this.personalFormGroup.controls['permanentProvince'].setValue(data.personalData.permanentAddress.province);
      this.personalFormGroup.controls['permanentCity'].setValue(data.personalData.permanentAddress.city);
      this.personalFormGroup.controls['permanentPostalCode'].setValue(data.personalData.permanentAddress.postalCode);
      this.personalFormGroup.controls['presentTelephone'].setValue(data.personalData.presentTelephone);
      this.personalFormGroup.controls['permanentTelephone'].setValue(data.personalData.permanentTelephone);
      this.personalFormGroup.controls['isUnderAge'].setValue(data.personalData.details.isUnder18);
      this.personalFormGroup.controls['isOverAge'].setValue(data.personalData.details.isOver55);
      this.personalFormGroup.controls['isForeigner'].setValue(data.personalData.details.isForeigner);
      this.personalFormGroup.controls['underAge'].setValue(data.personalData.details.ageIfUnder18);
      this.personalFormGroup.controls['overAge'].setValue(data.personalData.details.ageIfOver55);
      this.personalFormGroup.controls['visa'].setValue(data.personalData.details.visa);

      // for (let i = 0; i < data.familyBackground.length; i++) {
      //   const newFamily = this.fb.group({
      //     relationStatus: [data.familyBackground[i].relationStatus],
      //     name:[data.familyBackground[i].name],
      //     address: [data.familyBackground[i].address],
      //     telephoneNumber: [data.familyBackground[i].telephoneNumber],
      //     occupation: [data.familyBackground[i].occupation]
      //   });

      //   this.family().push(newFamily);
      // }

      // Job Information
      // this.jobFormGroup.controls['placement'].setValue(data.workStatement.placement.choice);
      // this.jobFormGroup.controls['placementLoc1'].setValue(data.workStatement.placement.location[0]);
      // this.jobFormGroup.controls['placementLoc2'].setValue(data.workStatement.placement.location[1]);
      // this.jobFormGroup.controls['expectedSalary'].setValue(data.workStatement.expectedSalary);
      // data.workStatement.typeOfWork

      // Experience Information
      if(data.workExperience.length){
        for (let i = 0; i < data.workExperience.length; i++) {
          if(data.workExperience[i].endPeriod === null || data.workExperience[i].endPeriod === undefined || data.workExperience[i].endPeriod === '' ){
            experienceArray.push(this.fb.group({
              companyName: [data.workExperience[i].companyName],
              companyLocation: [data.workExperience[i].companyLocation],
              position: [data.workExperience[i].position],
              startPeriod: [new Date(data.workExperience[i].startPeriod)], 
              endPeriod: [null],
              startSalary: [data.workExperience[i].startSalary],
              endSalary: [data.workExperience[i].endSalary],
              jobDescription: [data.workExperience[i].jobDescription],
              reasonOfQuit: [data.workExperience[i].reasonOfQuit],
              curr: [true],
            }));
          } else {
            experienceArray.push(this.fb.group({
              companyName: [data.workExperience[i].companyName],
              companyLocation: [data.workExperience[i].companyLocation],
              position: [data.workExperience[i].position],
              startPeriod: [new Date(data.workExperience[i].startPeriod)], 
              endPeriod: [new Date(data.workExperience[i].endPeriod)],
              startSalary: [data.workExperience[i].startSalary],
              endSalary: [data.workExperience[i].endSalary],
              jobDescription: [data.workExperience[i].jobDescription],
              reasonOfQuit: [data.workExperience[i].reasonOfQuit],
              curr: [false],
            }));
          }
        }  
      }
     
      
      this.experienceFormGroup.controls['contactNumber'].setValue(data.contactInformationOfLastCompany.contactNumber);
      this.experienceFormGroup.controls['contactEmail'].setValue(data.contactInformationOfLastCompany.contactEmail);
      this.experienceFormGroup.controls['contactAnytime'].setValue(data.contactInformationOfLastCompany.consent.contactAnytime);
      this.experienceFormGroup.controls['contactDate'].setValue(data.contactInformationOfLastCompany.consent.specificTime);

      // Education Information
      for (let i = 0; i < data.education.length; i++) {
        const newEducation = this.fb.group({
          degree: [data.education[i].degree],
          school: [data.education[i].school],
          startPeriod: [new Date(data.education[i].startPeriod)], 
          endPeriod: [new Date(data.education[i].endPeriod)],
          fieldOfStudy: [data.education[i].fieldOfStudy],
          grade: [data.education[i].grade],
        });
        this.education().push(newEducation);
      }

      this.educationFormGroup.controls['activitiesSocietiesAchievement'].setValue(data.activitiesSocietiesAchievement);
      this.educationFormGroup.controls['scientificPaperTitle'].setValue(data.accomplishment.scientificPaperTitle);
      this.educationFormGroup.controls['researchTitle'].setValue(data.accomplishment.researchTitle);
      this.educationFormGroup.controls['publicationTitle'].setValue(data.accomplishment.publicationTitle);
      this.educationFormGroup.controls['patent'].setValue(data.accomplishment.patent);

      // Skill Information
      for (let i = 0; i < data.skills.length; i++) {
        const newSkill = this.fb.group({
          skillName: [data.skills[i]],
        });

        this.skill().push(newSkill);
      }

      // General Information
      this.generalFormGroup.controls['previouslyWorked'].setValue(data.generalInformation.haveYouEver.previouslyWorked);
      this.generalFormGroup.controls['previouslyWorkedDetail'].setValue(data.generalInformation.haveYouEver.details);

      this.generalFormGroup.controls['isAds'].setValue(data.generalInformation.knowJTIFrom.isAds);
      this.generalFormGroup.controls['isAgency'].setValue(data.generalInformation.knowJTIFrom.isAgency);
      this.generalFormGroup.controls['isOther'].setValue(data.generalInformation.knowJTIFrom.isOther);
      this.generalFormGroup.controls['ads'].setValue(data.generalInformation.knowJTIFrom.ads);
      this.generalFormGroup.controls['agency'].setValue(data.generalInformation.knowJTIFrom.agency);
      this.generalFormGroup.controls['other'].setValue(data.generalInformation.knowJTIFrom.other);

      this.generalFormGroup.controls['anyRelatives'].setValue(data.generalInformation.anyRelatives);
      
      // Relatives Information
      for (let i = 0; i < data.generalInformation.relatives.length; i++) {
        const newRelative = this.fb.group({
          name: [data.generalInformation.relatives[i].name],
          position: [data.generalInformation.relatives[i].position]
        });

        this.relative().push(newRelative);
      }

      this.generalFormGroup.controls['otherWorkAgreement'].setValue(data.generalInformation.otherWorkAgreement);
      this.generalFormGroup.controls['additionalInformation'].setValue(data.generalInformation.additionalInformation);
      
      this.crimeFormGroup.controls['criminalHistory'].setValue(data.personalStatement.criminalHistory);
      this.crimeFormGroup.controls['description'].setValue(data.personalStatement.description);
      this.crimeFormGroup.controls['underIndictmentsOrCharged'].setValue(data.personalStatement.underIndictmentsOrCharged);
      this.crimeFormGroup.controls['honoredAsIndonesiaVeteran'].setValue(data.personalStatement.honoredAsIndonesiaVeteran);

      // console.log('personal', this.personalFormGroup.value)
      // console.log('job', this.jobFormGroup.value)
      console.log('experience', this.experienceFormGroup.value)
      // console.log('edu', this.educationFormGroup.value)
      // console.log('skill', this.skillFormGroup.value)
      // console.log('general', this.generalFormGroup.value)

    });
  }

  getJob(id){
    this.jobService.getJobDetail(id)
      .subscribe(response => {
        // console.log(response);
        this.jobFormGroup.controls['position'].setValue(response.title);
        this.jobFormGroup.controls['position'].disable();
        this.jobFormGroup.controls['position'].updateValueAndValidity();

        this.jobFormGroup.controls['workLocation'].setValue(response.location);
        this.jobFormGroup.controls['workLocation'].disable();
        this.jobFormGroup.controls['workLocation'].updateValueAndValidity();
      });
  }

  setForm(){
    if(!this.personalFormGroup.value.isUnderAge){
      this.personalFormGroup.controls['underAge'].setValue(0);
      this.personalFormGroup.controls['underAge'].updateValueAndValidity();
    }

    if(!this.personalFormGroup.value.isOverAge){
      this.personalFormGroup.controls['overAge'].setValue(0);
      this.personalFormGroup.controls['overAge'].updateValueAndValidity();
    }

    if(!this.personalFormGroup.value.isForeigner){
      this.personalFormGroup.controls['visa'].setValue('');
      this.personalFormGroup.controls['visa'].updateValueAndValidity();
    }

    if(this.isReady){
      this.jobFormGroup.controls['placement'].setValue('Ya');
    }else if(this.isNotReady){
      this.jobFormGroup.controls['placement'].setValue('Tidak');
      this.jobFormGroup.controls['placementLoc1'].setValue('');
      this.jobFormGroup.controls['placementLoc1'].updateValueAndValidity();
      this.jobFormGroup.controls['placementLoc2'].setValue('');
      this.jobFormGroup.controls['placementLoc2'].updateValueAndValidity();
    }else if(this.isNotHaveLocation){
      this.jobFormGroup.controls['placement'].setValue('Tidak memiliki lokasi pilihan');
      this.jobFormGroup.controls['placementLoc1'].setValue('');
      this.jobFormGroup.controls['placementLoc1'].updateValueAndValidity();
      this.jobFormGroup.controls['placementLoc2'].setValue('');
      this.jobFormGroup.controls['placementLoc2'].updateValueAndValidity();
    }

    if(!this.generalFormGroup.value.isAds){
      this.generalFormGroup.controls['ads'].setValue('');
      this.generalFormGroup.controls['ads'].updateValueAndValidity();
    }

    if(!this.generalFormGroup.value.isAgency){
      this.generalFormGroup.controls['agency'].setValue('');
      this.generalFormGroup.controls['agency'].updateValueAndValidity();
    }

    if(!this.generalFormGroup.value.isOther){
      this.generalFormGroup.controls['other'].setValue('');
      this.generalFormGroup.controls['other'].updateValueAndValidity();
    }

    // console.log(this.personalFormGroup.value)
    // console.log(this.generalFormGroup.value)
    // console.log(this.jobFormGroup.value)
  }

  selectAssignment(event, isChecked, type){
    // console.log(this.assignments);
    // console.log(isChecked)
    // console.log(event.target.value);

    if (isChecked) {
      // console.log('t')
      if(type === 'assignment'){
        this.assignmentArray.push(event.target.value)
      }else{
        this.employmentArray.push(event.target.value)
      }
      
    } else {
      // console.log('f')
      if(type === 'assignment'){
        let index = this.assignmentArray.indexOf(event.target.value);
        this.assignmentArray.splice(index, 1);
      }else{
        let index = this.employmentArray.indexOf(event.target.value);
        this.employmentArray.splice(index, 1);
      }
     
    }
    // console.log(this.assignmentArray);
    // console.log(this.employmentArray);
  }

  selectExJTI(event, isChecked){
    if (isChecked) {
      this.exJTIArray.push(event.target.value)
   } else {
     let index = this.exJTIArray.indexOf(event.target.value);
     this.exJTIArray.splice(index, 1);
   }
   
   // console.log(this.exJTIArray);
  }

  selectCurrentDate(index:any){
    // console.log(index)
    // console.log(this.experienceFormGroup.value.jobs[index]);

    const experienceForm = this.experienceFormGroup.get('jobs') as FormArray;
    const array = experienceForm.at(index) as FormGroup;

    // console.log(this.experienceFormGroup.value.jobs[index]);
    for(var i=0; i<=this.experienceFormGroup.value.jobs.length; i++){
      if(this.experienceFormGroup.value.jobs[i].curr === true){
        // console.log('true');
        experienceForm.at(i).patchValue({endPeriod: null});
        // console.log(this.experienceFormGroup.value.jobs[index]);
      }
    }
  }

  selectRelative(){
    const relativeArray = this.generalFormGroup.get('relatives') as FormArray;

    if(this.generalFormGroup.value.anyRelatives === 'Yes'){
      this.addRelative();
    }else{
      const control = <FormArray>this.generalFormGroup.controls['relatives'];
        for(let i = control.length-1; i >= 0; i--) {
            control.removeAt(i)
        }
    }
  }

  formCheck() {
    let skillArray = [];

    (this.skillFormGroup.get('skills') as FormArray).getRawValue().forEach(item => {
      skillArray.push(item['skillName']);
    });

    // console.log(skillArray);

    let jobArray = [];

    (this.experienceFormGroup.get('jobs') as FormArray).getRawValue().forEach(item => {
      if(item.endPeriod !== null){
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'].toString(),
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      } else {
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'],
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      }
    
    });

    // console.log(jobArray);

    let educationArray = [];

    (this.educationFormGroup.get('educations') as FormArray).getRawValue().forEach(item => {
      educationArray.push(
        {
          degree: item['degree'],
          school: item['school'],
          startPeriod: item['startPeriod'].toString(),
          endPeriod: item['endPeriod'].toString(),
          fieldOfStudy: item['fieldOfStudy'],
          grade: item['grade'].toString()
        });
    });

    // console.log(educationArray);

    // let familyArray = [];

    // (this.personalFormGroup.get('families') as FormArray).getRawValue().forEach(item => {
    //   familyArray.push(
    //     {
    //       relationStatus: item['relationStatus'],
    //       name: item['name'],
    //       address: item['address'],
    //       telephoneNumber: item['telephoneNumber'].toString(),
    //       occupation: item['occupation']
    //     });
    // });

    // console.log(familyArray);

    if(this.personalFormGroup.value.presentTelephone !== '' && this.personalFormGroup.value.presentTelephone !== null ){
      let telephone = this.personalFormGroup.value.presentTelephone.toString();
      this.personalFormGroup.controls['presentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['presentTelephone'].setValue('');
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }

    if(this.personalFormGroup.value.permanentTelephone !== '' && this.personalFormGroup.value.permanentTelephone !== null ){
      let telephone = this.personalFormGroup.value.permanentTelephone.toString();
      this.personalFormGroup.controls['permanentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['permanentTelephone'].setValue('');
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }

    let data = {
      personalData: {
        name: {
          firstName: this.personalFormGroup.value.firstName,
          middleName: this.personalFormGroup.value.middleName,
          lastName: this.personalFormGroup.value.lastName,
        },
        birthPlace: this.personalFormGroup.value.birthPlace,
        birthDate: this.personalFormGroup.value.birthDate.toString(),
        email: this.personalFormGroup.value.email,
        mailAddress: {
          street: this.personalFormGroup.value.address,
          province: this.personalFormGroup.value.province,
          city: this.personalFormGroup.value.city,
          postalCode: this.personalFormGroup.value.postalCode.toString()
        },
        permanentAddress: {
          street: this.personalFormGroup.value.permanentAddress,
          province: this.personalFormGroup.value.permanentProvince,
          city: this.personalFormGroup.value.permanentCity,
          postalCode: this.personalFormGroup.value.permanentPostalCode.toString()
        },
        presentTelephone: this.personalFormGroup.value.presentTelephone.toString(),
        permanentTelephone: this.personalFormGroup.value.permanentTelephone.toString(),
        
        details: {
          isUnder18:this.personalFormGroup.value.isUnderAge,
          ageIfUnder18:this.personalFormGroup.value.underAge,
          isOver55:this.personalFormGroup.value.isOverAge,
          ageIfOver55:this.personalFormGroup.value.overAge,
          isForeigner: this.personalFormGroup.value.isForeigner,
          visaIfForeigner:this.personalFormGroup.value.visa
        },
      },
      workStatement: {
        position: this.jobFormGroup.getRawValue().position,
        workLocation: this.jobFormGroup.getRawValue().workLocation,
        placement: {
          choice: this.jobFormGroup.value.placement,
          location: [this.jobFormGroup.value.placementLoc1, this.jobFormGroup.value.placementLoc2]
        },
        expectedSalary: this.jobFormGroup.value.expectedSalary.toString(),
        typeOfWork: this.assignmentArray,
        startDate: this.jobFormGroup.value.startWorking,
        employmentType: this.employmentArray
      },
      workExperience: jobArray,
      contactInformationOfLastCompany: {
        consent : {
          contactAnytime: this.experienceFormGroup.value.contactAnytime,
          specificTime: this.experienceFormGroup.value.contactDate,
        },
        contactNumber: this.experienceFormGroup.value.contactNumber.toString(),
        contactEmail: this.experienceFormGroup.value.contactEmail
      },
      education: educationArray,
      activitiesSocietiesAchievement:  this.educationFormGroup.value.activitiesSocietiesAchievement,
      accomplishment: {
        scientificPaperTitle:  this.educationFormGroup.value.scientificPaperTitle,
        researchTitle:  this.educationFormGroup.value.researchTitle,
        publicationTitle:  this.educationFormGroup.value.publicationTitle,
        patent: this.educationFormGroup.value.patent,
      },
      skills: skillArray,
      generalInformation: {
        haveYouEver: {
          previouslyWorked: this.generalFormGroup.value.previouslyWorked,
          details: this.generalFormGroup.value.previouslyWorkedDetail
        },
        anyRelatives: this.generalFormGroup.value.anyRelatives,
        relatives: this.generalFormGroup.value.relatives,
        knowJTIFrom: {
          ads: this.generalFormGroup.value.ads,
          isAds: this.generalFormGroup.value.isAds,
          agency: this.generalFormGroup.value.agency,
          isAgency: this.generalFormGroup.value.isAgency,
          other: this.generalFormGroup.value.other,
          isOther: this.generalFormGroup.value.isOther,
        },
        otherWorkAgreement: this.generalFormGroup.value.otherWorkAgreement,
        additionalInformation: this.generalFormGroup.value.additionalInformation,
      },
      personalStatement: {
        criminalHistory: this.crimeFormGroup.value.criminalHistory,
        underIndictmentsOrCharged: this.crimeFormGroup.value.underIndictmentsOrCharged,
        honoredAsIndonesiaVeteran: this.crimeFormGroup.value.honoredAsIndonesiaVeteran,
        description: this.crimeFormGroup.value.description,
      },
      applicationID: this.appId,
      jobID: this.jobId
    }

    console.log(data); 

    // console.log('personal', this.personalFormGroup.valid)
    // console.log('job', this.jobFormGroup.valid)
    // console.log('experience', this.experienceFormGroup.valid)
    // console.log('edu', this.educationFormGroup.valid)
    // console.log('skill', this.skillFormGroup.valid)
    // console.log('general', this.generalFormGroup.valid)

    // console.log('personal', this.personalFormGroup.value)
    // console.log('job', this.jobFormGroup.value)
    // console.log('experience', this.experienceFormGroup.value)
    // console.log('edu', this.educationFormGroup.value)
    // console.log('skill', this.skillFormGroup.value)
    // console.log('general', this.generalFormGroup.value)
  }

  formCheckPersonal() {
    console.log(this.personalFormGroup.controls);
    // Personal Form Group
    if(this.personalFormGroup.controls.firstName.status === 'INVALID') {
      this.toastService.error("Fill in your first name");

      return;
    } else if(this.personalFormGroup.controls.lastName.status === 'INVALID') {
      this.toastService.error("Fill in your last name");

      return;
    } else if(this.personalFormGroup.controls.birthPlace.status === 'INVALID') {
      this.toastService.error("Fill in your birth place");
      
      return;
    } else if(this.personalFormGroup.controls.birthDate.status === 'INVALID') {
      this.toastService.error("Fill in your birth date properly (MM/DD/YYYY)");
      
      return;
    } else if(this.personalFormGroup.controls.email.status === 'INVALID') {
      this.toastService.error("Fill in your email");
      
      return;
    } else if(this.personalFormGroup.controls.address.status === 'INVALID') {
      this.toastService.error("Fill in your present/mailing address");
      
      return;
    } else if(this.personalFormGroup.controls.province.status === 'INVALID') {
      this.toastService.error("Fill in your province");
      
      return;
    } else if(this.personalFormGroup.controls.city.status === 'INVALID') {
      this.toastService.error("Fill in your city");
      
      return;
    } else if(this.personalFormGroup.controls.postalCode.status === 'INVALID') {
      this.toastService.error("Fill in your postal code");
      
      return;
    } else if(this.personalFormGroup.controls.permanentAddress.status === 'INVALID') {
      this.toastService.error("Fill in your permanent address");
      
      return;
    } else if(this.personalFormGroup.controls.permanentProvince.status === 'INVALID') {
      this.toastService.error("Fill in your permanent province");
      
      return;
    } else if(this.personalFormGroup.controls.permanentCity.status === 'INVALID') {
      this.toastService.error("Fill in your permanent city");
      
      return;
    } else if(this.personalFormGroup.controls.permanentPostalCode.status === 'INVALID') {
      this.toastService.error("Fill in your permanent postal code");
      
      return;
    } else if(this.personalFormGroup.controls.presentTelephone.status === 'INVALID') {
      this.toastService.error("Fill in your present telephone number");
      
      return;
    } else if(this.personalFormGroup.controls.permanentTelephone.status === 'INVALID') {
      this.toastService.error("Fill in your permanent telephone number");
      
      return;
    }

    let skillArray = [];

    (this.skillFormGroup.get('skills') as FormArray).getRawValue().forEach(item => {
      skillArray.push(item['skillName']);
    });

    // console.log(skillArray);

    let jobArray = [];

    (this.experienceFormGroup.get('jobs') as FormArray).getRawValue().forEach(item => {
      if(item.endPeriod !== null){
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'].toString(),
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      } else {
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'],
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      }
    
    });

    // console.log(jobArray);

    let educationArray = [];

    (this.educationFormGroup.get('educations') as FormArray).getRawValue().forEach(item => {
      educationArray.push(
        {
          degree: item['degree'],
          school: item['school'],
          startPeriod: item['startPeriod'].toString(),
          endPeriod: item['endPeriod'].toString(),
          fieldOfStudy: item['fieldOfStudy'],
          grade: item['grade'].toString()
        });
    });

    // console.log(educationArray);

    // let familyArray = [];

    // (this.personalFormGroup.get('families') as FormArray).getRawValue().forEach(item => {
    //   familyArray.push(
    //     {
    //       relationStatus: item['relationStatus'],
    //       name: item['name'],
    //       address: item['address'],
    //       telephoneNumber: item['telephoneNumber'].toString(),
    //       occupation: item['occupation']
    //     });
    // });

    // console.log(familyArray);

    if(this.personalFormGroup.value.presentTelephone !== '' && this.personalFormGroup.value.presentTelephone !== null ){
      let telephone = this.personalFormGroup.value.presentTelephone.toString();
      this.personalFormGroup.controls['presentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['presentTelephone'].setValue('');
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }

    if(this.personalFormGroup.value.permanentTelephone !== '' && this.personalFormGroup.value.permanentTelephone !== null ){
      let telephone = this.personalFormGroup.value.permanentTelephone.toString();
      this.personalFormGroup.controls['permanentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['permanentTelephone'].setValue('');
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }

    let data = {
      personalData: {
        name: {
          firstName: this.personalFormGroup.value.firstName,
          middleName: this.personalFormGroup.value.middleName,
          lastName: this.personalFormGroup.value.lastName,
        },
        birthPlace: this.personalFormGroup.value.birthPlace,
        birthDate: this.personalFormGroup.value.birthDate.toString(),
        email: this.personalFormGroup.value.email,
        mailAddress: {
          street: this.personalFormGroup.value.address,
          province: this.personalFormGroup.value.province,
          city: this.personalFormGroup.value.city,
          postalCode: this.personalFormGroup.value.postalCode.toString()
        },
        permanentAddress: {
          street: this.personalFormGroup.value.permanentAddress,
          province: this.personalFormGroup.value.permanentProvince,
          city: this.personalFormGroup.value.permanentCity,
          postalCode: this.personalFormGroup.value.permanentPostalCode.toString()
        },
        presentTelephone: this.personalFormGroup.value.presentTelephone.toString(),
        permanentTelephone: this.personalFormGroup.value.permanentTelephone.toString(),
        
        details: {
          isUnder18:this.personalFormGroup.value.isUnderAge,
          ageIfUnder18:this.personalFormGroup.value.underAge,
          isOver55:this.personalFormGroup.value.isOverAge,
          ageIfOver55:this.personalFormGroup.value.overAge,
          isForeigner: this.personalFormGroup.value.isForeigner,
          visaIfForeigner:this.personalFormGroup.value.visa
        },
      },
      workStatement: {
        position: this.jobFormGroup.getRawValue().position,
        workLocation: this.jobFormGroup.getRawValue().workLocation,
        placement: {
          choice: this.jobFormGroup.value.placement,
          location: [this.jobFormGroup.value.placementLoc1, this.jobFormGroup.value.placementLoc2]
        },
        expectedSalary: this.jobFormGroup.value.expectedSalary.toString(),
        typeOfWork: this.assignmentArray,
        startDate: this.jobFormGroup.value.startWorking,
        employmentType: this.employmentArray
      },
      workExperience: jobArray,
      contactInformationOfLastCompany: {
        consent : {
          contactAnytime: this.experienceFormGroup.value.contactAnytime,
          specificTime: this.experienceFormGroup.value.contactDate,
        },
        contactNumber: this.experienceFormGroup.value.contactNumber.toString(),
        contactEmail: this.experienceFormGroup.value.contactEmail
      },
      education: educationArray,
      activitiesSocietiesAchievement:  this.educationFormGroup.value.activitiesSocietiesAchievement,
      accomplishment: {
        scientificPaperTitle:  this.educationFormGroup.value.scientificPaperTitle,
        researchTitle:  this.educationFormGroup.value.researchTitle,
        publicationTitle:  this.educationFormGroup.value.publicationTitle,
        patent: this.educationFormGroup.value.patent,
      },
      skills: skillArray,
      generalInformation: {
        haveYouEver: {
          previouslyWorked: this.generalFormGroup.value.previouslyWorked,
          details: this.generalFormGroup.value.previouslyWorkedDetail
        },
        anyRelatives: this.generalFormGroup.value.anyRelatives,
        relatives: this.generalFormGroup.value.relatives,
        knowJTIFrom: {
          ads: this.generalFormGroup.value.ads,
          isAds: this.generalFormGroup.value.isAds,
          agency: this.generalFormGroup.value.agency,
          isAgency: this.generalFormGroup.value.isAgency,
          other: this.generalFormGroup.value.other,
          isOther: this.generalFormGroup.value.isOther,
        },
        otherWorkAgreement: this.generalFormGroup.value.otherWorkAgreement,
        additionalInformation: this.generalFormGroup.value.additionalInformation,
      },
      personalStatement: {
        criminalHistory: this.crimeFormGroup.value.criminalHistory,
        underIndictmentsOrCharged: this.crimeFormGroup.value.underIndictmentsOrCharged,
        honoredAsIndonesiaVeteran: this.crimeFormGroup.value.honoredAsIndonesiaVeteran,
        description: this.crimeFormGroup.value.description,
      },
      applicationID: this.appId,
      jobID: this.jobId
    }

    console.log(data); 

    // console.log('personal', this.personalFormGroup.valid)
    // console.log('job', this.jobFormGroup.valid)
    // console.log('experience', this.experienceFormGroup.valid)
    // console.log('edu', this.educationFormGroup.valid)
    // console.log('skill', this.skillFormGroup.valid)
    // console.log('general', this.generalFormGroup.valid)

    // console.log('personal', this.personalFormGroup.value)
    // console.log('job', this.jobFormGroup.value)
    // console.log('experience', this.experienceFormGroup.value)
    // console.log('edu', this.educationFormGroup.value)
    // console.log('skill', this.skillFormGroup.value)
    // console.log('general', this.generalFormGroup.value)
  }

  formCheckJob() {
    console.log(this.jobFormGroup.controls);

    if(this.jobFormGroup.controls.position.status === 'INVALID') {
      this.toastService.error("Fill in your desired type of work");

      return;
    } else if(this.jobFormGroup.controls.workLocation.status === 'INVALID') {
      this.toastService.error("Fill in your desired work location");

      return;
    } else if(this.jobFormGroup.controls.placement.status === 'INVALID') {
      this.toastService.error("Fill in your geographic preference");

      return;
    } else if(this.jobFormGroup.controls.expectedSalary.status === 'INVALID') {
      this.toastService.error("Fill in your expected salary");

      return;
    } else if(this.jobFormGroup.controls.startWorking.status === 'INVALID') {
      this.toastService.error("Fill in your expected date to start working");

      return;
    }

    let skillArray = [];

    (this.skillFormGroup.get('skills') as FormArray).getRawValue().forEach(item => {
      skillArray.push(item['skillName']);
    });

    // console.log(skillArray);

    let jobArray = [];

    (this.experienceFormGroup.get('jobs') as FormArray).getRawValue().forEach(item => {
      if(item.endPeriod !== null){
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'].toString(),
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      } else {
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'],
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      }
    
    });

    // console.log(jobArray);

    let educationArray = [];

    (this.educationFormGroup.get('educations') as FormArray).getRawValue().forEach(item => {
      educationArray.push(
        {
          degree: item['degree'],
          school: item['school'],
          startPeriod: item['startPeriod'].toString(),
          endPeriod: item['endPeriod'].toString(),
          fieldOfStudy: item['fieldOfStudy'],
          grade: item['grade'].toString()
        });
    });

    if(this.personalFormGroup.value.presentTelephone !== '' && this.personalFormGroup.value.presentTelephone !== null ){
      let telephone = this.personalFormGroup.value.presentTelephone.toString();
      this.personalFormGroup.controls['presentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['presentTelephone'].setValue('');
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }

    if(this.personalFormGroup.value.permanentTelephone !== '' && this.personalFormGroup.value.permanentTelephone !== null ){
      let telephone = this.personalFormGroup.value.permanentTelephone.toString();
      this.personalFormGroup.controls['permanentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['permanentTelephone'].setValue('');
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }

    let data = {
      personalData: {
        name: {
          firstName: this.personalFormGroup.value.firstName,
          middleName: this.personalFormGroup.value.middleName,
          lastName: this.personalFormGroup.value.lastName,
        },
        birthPlace: this.personalFormGroup.value.birthPlace,
        birthDate: this.personalFormGroup.value.birthDate.toString(),
        email: this.personalFormGroup.value.email,
        mailAddress: {
          street: this.personalFormGroup.value.address,
          province: this.personalFormGroup.value.province,
          city: this.personalFormGroup.value.city,
          postalCode: this.personalFormGroup.value.postalCode.toString()
        },
        permanentAddress: {
          street: this.personalFormGroup.value.permanentAddress,
          province: this.personalFormGroup.value.permanentProvince,
          city: this.personalFormGroup.value.permanentCity,
          postalCode: this.personalFormGroup.value.permanentPostalCode.toString()
        },
        presentTelephone: this.personalFormGroup.value.presentTelephone.toString(),
        permanentTelephone: this.personalFormGroup.value.permanentTelephone.toString(),
        
        details: {
          isUnder18:this.personalFormGroup.value.isUnderAge,
          ageIfUnder18:this.personalFormGroup.value.underAge,
          isOver55:this.personalFormGroup.value.isOverAge,
          ageIfOver55:this.personalFormGroup.value.overAge,
          isForeigner: this.personalFormGroup.value.isForeigner,
          visaIfForeigner:this.personalFormGroup.value.visa
        },
      },
      workStatement: {
        position: this.jobFormGroup.getRawValue().position,
        workLocation: this.jobFormGroup.getRawValue().workLocation,
        placement: {
          choice: this.jobFormGroup.value.placement,
          location: [this.jobFormGroup.value.placementLoc1, this.jobFormGroup.value.placementLoc2]
        },
        expectedSalary: this.jobFormGroup.value.expectedSalary.toString(),
        typeOfWork: this.assignmentArray,
        startDate: this.jobFormGroup.value.startWorking,
        employmentType: this.employmentArray
      },
      workExperience: jobArray,
      contactInformationOfLastCompany: {
        consent : {
          contactAnytime: this.experienceFormGroup.value.contactAnytime,
          specificTime: this.experienceFormGroup.value.contactDate,
        },
        contactNumber: this.experienceFormGroup.value.contactNumber.toString(),
        contactEmail: this.experienceFormGroup.value.contactEmail
      },
      education: educationArray,
      activitiesSocietiesAchievement:  this.educationFormGroup.value.activitiesSocietiesAchievement,
      accomplishment: {
        scientificPaperTitle:  this.educationFormGroup.value.scientificPaperTitle,
        researchTitle:  this.educationFormGroup.value.researchTitle,
        publicationTitle:  this.educationFormGroup.value.publicationTitle,
        patent: this.educationFormGroup.value.patent,
      },
      skills: skillArray,
      generalInformation: {
        haveYouEver: {
          previouslyWorked: this.generalFormGroup.value.previouslyWorked,
          details: this.generalFormGroup.value.previouslyWorkedDetail
        },
        anyRelatives: this.generalFormGroup.value.anyRelatives,
        relatives: this.generalFormGroup.value.relatives,
        knowJTIFrom: {
          ads: this.generalFormGroup.value.ads,
          isAds: this.generalFormGroup.value.isAds,
          agency: this.generalFormGroup.value.agency,
          isAgency: this.generalFormGroup.value.isAgency,
          other: this.generalFormGroup.value.other,
          isOther: this.generalFormGroup.value.isOther,
        },
        otherWorkAgreement: this.generalFormGroup.value.otherWorkAgreement,
        additionalInformation: this.generalFormGroup.value.additionalInformation,
      },
      personalStatement: {
        criminalHistory: this.crimeFormGroup.value.criminalHistory,
        underIndictmentsOrCharged: this.crimeFormGroup.value.underIndictmentsOrCharged,
        honoredAsIndonesiaVeteran: this.crimeFormGroup.value.honoredAsIndonesiaVeteran,
        description: this.crimeFormGroup.value.description,
      },
      applicationID: this.appId,
      jobID: this.jobId
    }

    console.log(data);
  }

  formCheckExperience() {
    console.log(this.experienceFormGroup.controls);

    // Experience Form Group
    if(this.experienceFormGroup.controls.contactNumber.status === 'INVALID') {
      this.toastService.error("Fill in your contact number");

      return;
    } else if(this.experienceFormGroup.controls.contactEmail.status === 'INVALID') {
      this.toastService.error("Fill in your email");

      return;
    }

    let skillArray = [];

    (this.skillFormGroup.get('skills') as FormArray).getRawValue().forEach(item => {
      skillArray.push(item['skillName']);
    });

    // console.log(skillArray);

    let jobArray = [];

    (this.experienceFormGroup.get('jobs') as FormArray).getRawValue().forEach(item => {
      if(item.endPeriod !== null){
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'].toString(),
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      } else {
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'],
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      }
    
    });

    // console.log(jobArray);

    let educationArray = [];

    (this.educationFormGroup.get('educations') as FormArray).getRawValue().forEach(item => {
      educationArray.push(
        {
          degree: item['degree'],
          school: item['school'],
          startPeriod: item['startPeriod'].toString(),
          endPeriod: item['endPeriod'].toString(),
          fieldOfStudy: item['fieldOfStudy'],
          grade: item['grade'].toString()
        });
    });

    if(this.personalFormGroup.value.presentTelephone !== '' && this.personalFormGroup.value.presentTelephone !== null ){
      let telephone = this.personalFormGroup.value.presentTelephone.toString();
      this.personalFormGroup.controls['presentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['presentTelephone'].setValue('');
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }

    if(this.personalFormGroup.value.permanentTelephone !== '' && this.personalFormGroup.value.permanentTelephone !== null ){
      let telephone = this.personalFormGroup.value.permanentTelephone.toString();
      this.personalFormGroup.controls['permanentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['permanentTelephone'].setValue('');
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }

    let data = {
      personalData: {
        name: {
          firstName: this.personalFormGroup.value.firstName,
          middleName: this.personalFormGroup.value.middleName,
          lastName: this.personalFormGroup.value.lastName,
        },
        birthPlace: this.personalFormGroup.value.birthPlace,
        birthDate: this.personalFormGroup.value.birthDate.toString(),
        email: this.personalFormGroup.value.email,
        mailAddress: {
          street: this.personalFormGroup.value.address,
          province: this.personalFormGroup.value.province,
          city: this.personalFormGroup.value.city,
          postalCode: this.personalFormGroup.value.postalCode.toString()
        },
        permanentAddress: {
          street: this.personalFormGroup.value.permanentAddress,
          province: this.personalFormGroup.value.permanentProvince,
          city: this.personalFormGroup.value.permanentCity,
          postalCode: this.personalFormGroup.value.permanentPostalCode.toString()
        },
        presentTelephone: this.personalFormGroup.value.presentTelephone.toString(),
        permanentTelephone: this.personalFormGroup.value.permanentTelephone.toString(),
        
        details: {
          isUnder18:this.personalFormGroup.value.isUnderAge,
          ageIfUnder18:this.personalFormGroup.value.underAge,
          isOver55:this.personalFormGroup.value.isOverAge,
          ageIfOver55:this.personalFormGroup.value.overAge,
          isForeigner: this.personalFormGroup.value.isForeigner,
          visaIfForeigner:this.personalFormGroup.value.visa
        },
      },
      workStatement: {
        position: this.jobFormGroup.getRawValue().position,
        workLocation: this.jobFormGroup.getRawValue().workLocation,
        placement: {
          choice: this.jobFormGroup.value.placement,
          location: [this.jobFormGroup.value.placementLoc1, this.jobFormGroup.value.placementLoc2]
        },
        expectedSalary: this.jobFormGroup.value.expectedSalary.toString(),
        typeOfWork: this.assignmentArray,
        startDate: this.jobFormGroup.value.startWorking,
        employmentType: this.employmentArray
      },
      workExperience: jobArray,
      contactInformationOfLastCompany: {
        consent : {
          contactAnytime: this.experienceFormGroup.value.contactAnytime,
          specificTime: this.experienceFormGroup.value.contactDate,
        },
        contactNumber: this.experienceFormGroup.value.contactNumber.toString(),
        contactEmail: this.experienceFormGroup.value.contactEmail
      },
      education: educationArray,
      activitiesSocietiesAchievement:  this.educationFormGroup.value.activitiesSocietiesAchievement,
      accomplishment: {
        scientificPaperTitle:  this.educationFormGroup.value.scientificPaperTitle,
        researchTitle:  this.educationFormGroup.value.researchTitle,
        publicationTitle:  this.educationFormGroup.value.publicationTitle,
        patent: this.educationFormGroup.value.patent,
      },
      skills: skillArray,
      generalInformation: {
        haveYouEver: {
          previouslyWorked: this.generalFormGroup.value.previouslyWorked,
          details: this.generalFormGroup.value.previouslyWorkedDetail
        },
        anyRelatives: this.generalFormGroup.value.anyRelatives,
        relatives: this.generalFormGroup.value.relatives,
        knowJTIFrom: {
          ads: this.generalFormGroup.value.ads,
          isAds: this.generalFormGroup.value.isAds,
          agency: this.generalFormGroup.value.agency,
          isAgency: this.generalFormGroup.value.isAgency,
          other: this.generalFormGroup.value.other,
          isOther: this.generalFormGroup.value.isOther,
        },
        otherWorkAgreement: this.generalFormGroup.value.otherWorkAgreement,
        additionalInformation: this.generalFormGroup.value.additionalInformation,
      },
      personalStatement: {
        criminalHistory: this.crimeFormGroup.value.criminalHistory,
        underIndictmentsOrCharged: this.crimeFormGroup.value.underIndictmentsOrCharged,
        honoredAsIndonesiaVeteran: this.crimeFormGroup.value.honoredAsIndonesiaVeteran,
        description: this.crimeFormGroup.value.description,
      },
      applicationID: this.appId,
      jobID: this.jobId
    }

    console.log(data); 
  }

  formCheckSkill() {
    console.log(this.skillFormGroup.controls);

    if(this.skillFormGroup.controls.skills.status === 'INVALID') {
      this.toastService.error("Fill in your skillset");

      return;
    }
    
    let skillArray = [];

    (this.skillFormGroup.get('skills') as FormArray).getRawValue().forEach(item => {
      skillArray.push(item['skillName']);
    });

    // console.log(skillArray);

    let jobArray = [];

    (this.experienceFormGroup.get('jobs') as FormArray).getRawValue().forEach(item => {
      if(item.endPeriod !== null){
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'].toString(),
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      } else {
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'],
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      }
    
    });

    // console.log(jobArray);

    let educationArray = [];

    (this.educationFormGroup.get('educations') as FormArray).getRawValue().forEach(item => {
      educationArray.push(
        {
          degree: item['degree'],
          school: item['school'],
          startPeriod: item['startPeriod'].toString(),
          endPeriod: item['endPeriod'].toString(),
          fieldOfStudy: item['fieldOfStudy'],
          grade: item['grade'].toString()
        });
    });

    // console.log(educationArray);

    // let familyArray = [];

    // (this.personalFormGroup.get('families') as FormArray).getRawValue().forEach(item => {
    //   familyArray.push(
    //     {
    //       relationStatus: item['relationStatus'],
    //       name: item['name'],
    //       address: item['address'],
    //       telephoneNumber: item['telephoneNumber'].toString(),
    //       occupation: item['occupation']
    //     });
    // });

    // console.log(familyArray);

    if(this.personalFormGroup.value.presentTelephone !== '' && this.personalFormGroup.value.presentTelephone !== null ){
      let telephone = this.personalFormGroup.value.presentTelephone.toString();
      this.personalFormGroup.controls['presentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['presentTelephone'].setValue('');
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }

    if(this.personalFormGroup.value.permanentTelephone !== '' && this.personalFormGroup.value.permanentTelephone !== null ){
      let telephone = this.personalFormGroup.value.permanentTelephone.toString();
      this.personalFormGroup.controls['permanentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['permanentTelephone'].setValue('');
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }

    let data = {
      personalData: {
        name: {
          firstName: this.personalFormGroup.value.firstName,
          middleName: this.personalFormGroup.value.middleName,
          lastName: this.personalFormGroup.value.lastName,
        },
        birthPlace: this.personalFormGroup.value.birthPlace,
        birthDate: this.personalFormGroup.value.birthDate.toString(),
        email: this.personalFormGroup.value.email,
        mailAddress: {
          street: this.personalFormGroup.value.address,
          province: this.personalFormGroup.value.province,
          city: this.personalFormGroup.value.city,
          postalCode: this.personalFormGroup.value.postalCode.toString()
        },
        permanentAddress: {
          street: this.personalFormGroup.value.permanentAddress,
          province: this.personalFormGroup.value.permanentProvince,
          city: this.personalFormGroup.value.permanentCity,
          postalCode: this.personalFormGroup.value.permanentPostalCode.toString()
        },
        presentTelephone: this.personalFormGroup.value.presentTelephone.toString(),
        permanentTelephone: this.personalFormGroup.value.permanentTelephone.toString(),
        
        details: {
          isUnder18:this.personalFormGroup.value.isUnderAge,
          ageIfUnder18:this.personalFormGroup.value.underAge,
          isOver55:this.personalFormGroup.value.isOverAge,
          ageIfOver55:this.personalFormGroup.value.overAge,
          isForeigner: this.personalFormGroup.value.isForeigner,
          visaIfForeigner:this.personalFormGroup.value.visa
        },
      },
      workStatement: {
        position: this.jobFormGroup.getRawValue().position,
        workLocation: this.jobFormGroup.getRawValue().workLocation,
        placement: {
          choice: this.jobFormGroup.value.placement,
          location: [this.jobFormGroup.value.placementLoc1, this.jobFormGroup.value.placementLoc2]
        },
        expectedSalary: this.jobFormGroup.value.expectedSalary.toString(),
        typeOfWork: this.assignmentArray,
        startDate: this.jobFormGroup.value.startWorking,
        employmentType: this.employmentArray
      },
      workExperience: jobArray,
      contactInformationOfLastCompany: {
        consent : {
          contactAnytime: this.experienceFormGroup.value.contactAnytime,
          specificTime: this.experienceFormGroup.value.contactDate,
        },
        contactNumber: this.experienceFormGroup.value.contactNumber.toString(),
        contactEmail: this.experienceFormGroup.value.contactEmail
      },
      education: educationArray,
      activitiesSocietiesAchievement:  this.educationFormGroup.value.activitiesSocietiesAchievement,
      accomplishment: {
        scientificPaperTitle:  this.educationFormGroup.value.scientificPaperTitle,
        researchTitle:  this.educationFormGroup.value.researchTitle,
        publicationTitle:  this.educationFormGroup.value.publicationTitle,
        patent: this.educationFormGroup.value.patent,
      },
      skills: skillArray,
      generalInformation: {
        haveYouEver: {
          previouslyWorked: this.generalFormGroup.value.previouslyWorked,
          details: this.generalFormGroup.value.previouslyWorkedDetail
        },
        anyRelatives: this.generalFormGroup.value.anyRelatives,
        relatives: this.generalFormGroup.value.relatives,
        knowJTIFrom: {
          ads: this.generalFormGroup.value.ads,
          isAds: this.generalFormGroup.value.isAds,
          agency: this.generalFormGroup.value.agency,
          isAgency: this.generalFormGroup.value.isAgency,
          other: this.generalFormGroup.value.other,
          isOther: this.generalFormGroup.value.isOther,
        },
        otherWorkAgreement: this.generalFormGroup.value.otherWorkAgreement,
        additionalInformation: this.generalFormGroup.value.additionalInformation,
      },
      personalStatement: {
        criminalHistory: this.crimeFormGroup.value.criminalHistory,
        underIndictmentsOrCharged: this.crimeFormGroup.value.underIndictmentsOrCharged,
        honoredAsIndonesiaVeteran: this.crimeFormGroup.value.honoredAsIndonesiaVeteran,
        description: this.crimeFormGroup.value.description,
      },
      applicationID: this.appId,
      jobID: this.jobId
    }

    console.log(data); 

    // console.log('personal', this.personalFormGroup.valid)
    // console.log('job', this.jobFormGroup.valid)
    // console.log('experience', this.experienceFormGroup.valid)
    // console.log('edu', this.educationFormGroup.valid)
    // console.log('skill', this.skillFormGroup.valid)
    // console.log('general', this.generalFormGroup.valid)

    // console.log('personal', this.personalFormGroup.value)
    // console.log('job', this.jobFormGroup.value)
    // console.log('experience', this.experienceFormGroup.value)
    // console.log('edu', this.educationFormGroup.value)
    // console.log('skill', this.skillFormGroup.value)
    // console.log('general', this.generalFormGroup.value)
  }

  formCheckGeneral() {
    console.log(this.generalFormGroup.controls);

    if(this.generalFormGroup.controls.previouslyWorked.status === 'INVALID') {
      this.toastService.error("Fill in your previous employment status to JTI/IBM");

      return;
    } else if(this.generalFormGroup.controls.anyRelatives.status === 'INVALID') {
      this.toastService.error("Fill in your relative working status to JTI/IBM");

      return;
    } else if(this.generalFormGroup.controls.otherWorkAgreement.status === 'INVALID') {
      this.toastService.error("Fill in your other employment agreement status");

      return;
    }

    let skillArray = [];

    (this.skillFormGroup.get('skills') as FormArray).getRawValue().forEach(item => {
      skillArray.push(item['skillName']);
    });

    // console.log(skillArray);

    let jobArray = [];

    (this.experienceFormGroup.get('jobs') as FormArray).getRawValue().forEach(item => {
      if(item.endPeriod !== null){
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'].toString(),
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      } else {
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'],
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      }
    
    });

    // console.log(jobArray);

    let educationArray = [];

    (this.educationFormGroup.get('educations') as FormArray).getRawValue().forEach(item => {
      educationArray.push(
        {
          degree: item['degree'],
          school: item['school'],
          startPeriod: item['startPeriod'].toString(),
          endPeriod: item['endPeriod'].toString(),
          fieldOfStudy: item['fieldOfStudy'],
          grade: item['grade'].toString()
        });
    });

    if(this.personalFormGroup.value.presentTelephone !== '' && this.personalFormGroup.value.presentTelephone !== null ){
      let telephone = this.personalFormGroup.value.presentTelephone.toString();
      this.personalFormGroup.controls['presentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['presentTelephone'].setValue('');
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }

    if(this.personalFormGroup.value.permanentTelephone !== '' && this.personalFormGroup.value.permanentTelephone !== null ){
      let telephone = this.personalFormGroup.value.permanentTelephone.toString();
      this.personalFormGroup.controls['permanentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['permanentTelephone'].setValue('');
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }

    let data = {
      personalData: {
        name: {
          firstName: this.personalFormGroup.value.firstName,
          middleName: this.personalFormGroup.value.middleName,
          lastName: this.personalFormGroup.value.lastName,
        },
        birthPlace: this.personalFormGroup.value.birthPlace,
        birthDate: this.personalFormGroup.value.birthDate.toString(),
        email: this.personalFormGroup.value.email,
        mailAddress: {
          street: this.personalFormGroup.value.address,
          province: this.personalFormGroup.value.province,
          city: this.personalFormGroup.value.city,
          postalCode: this.personalFormGroup.value.postalCode.toString()
        },
        permanentAddress: {
          street: this.personalFormGroup.value.permanentAddress,
          province: this.personalFormGroup.value.permanentProvince,
          city: this.personalFormGroup.value.permanentCity,
          postalCode: this.personalFormGroup.value.permanentPostalCode.toString()
        },
        presentTelephone: this.personalFormGroup.value.presentTelephone.toString(),
        permanentTelephone: this.personalFormGroup.value.permanentTelephone.toString(),
        
        details: {
          isUnder18:this.personalFormGroup.value.isUnderAge,
          ageIfUnder18:this.personalFormGroup.value.underAge,
          isOver55:this.personalFormGroup.value.isOverAge,
          ageIfOver55:this.personalFormGroup.value.overAge,
          isForeigner: this.personalFormGroup.value.isForeigner,
          visaIfForeigner:this.personalFormGroup.value.visa
        },
      },
      workStatement: {
        position: this.jobFormGroup.getRawValue().position,
        workLocation: this.jobFormGroup.getRawValue().workLocation,
        placement: {
          choice: this.jobFormGroup.value.placement,
          location: [this.jobFormGroup.value.placementLoc1, this.jobFormGroup.value.placementLoc2]
        },
        expectedSalary: this.jobFormGroup.value.expectedSalary.toString(),
        typeOfWork: this.assignmentArray,
        startDate: this.jobFormGroup.value.startWorking,
        employmentType: this.employmentArray
      },
      workExperience: jobArray,
      contactInformationOfLastCompany: {
        consent : {
          contactAnytime: this.experienceFormGroup.value.contactAnytime,
          specificTime: this.experienceFormGroup.value.contactDate,
        },
        contactNumber: this.experienceFormGroup.value.contactNumber.toString(),
        contactEmail: this.experienceFormGroup.value.contactEmail
      },
      education: educationArray,
      activitiesSocietiesAchievement:  this.educationFormGroup.value.activitiesSocietiesAchievement,
      accomplishment: {
        scientificPaperTitle:  this.educationFormGroup.value.scientificPaperTitle,
        researchTitle:  this.educationFormGroup.value.researchTitle,
        publicationTitle:  this.educationFormGroup.value.publicationTitle,
        patent: this.educationFormGroup.value.patent,
      },
      skills: skillArray,
      generalInformation: {
        haveYouEver: {
          previouslyWorked: this.generalFormGroup.value.previouslyWorked,
          details: this.generalFormGroup.value.previouslyWorkedDetail
        },
        anyRelatives: this.generalFormGroup.value.anyRelatives,
        relatives: this.generalFormGroup.value.relatives,
        knowJTIFrom: {
          ads: this.generalFormGroup.value.ads,
          isAds: this.generalFormGroup.value.isAds,
          agency: this.generalFormGroup.value.agency,
          isAgency: this.generalFormGroup.value.isAgency,
          other: this.generalFormGroup.value.other,
          isOther: this.generalFormGroup.value.isOther,
        },
        otherWorkAgreement: this.generalFormGroup.value.otherWorkAgreement,
        additionalInformation: this.generalFormGroup.value.additionalInformation,
      },
      personalStatement: {
        criminalHistory: this.crimeFormGroup.value.criminalHistory,
        underIndictmentsOrCharged: this.crimeFormGroup.value.underIndictmentsOrCharged,
        honoredAsIndonesiaVeteran: this.crimeFormGroup.value.honoredAsIndonesiaVeteran,
        description: this.crimeFormGroup.value.description,
      },
      applicationID: this.appId,
      jobID: this.jobId
    }

    console.log(data); 
  }

  formCheckCrime() {
    console.log(this.crimeFormGroup.controls);

    if(this.crimeFormGroup.controls.criminalHistory.status === 'INVALID') {
      this.toastService.error("Fill in your criminal history status the last five years");

      return;
    } else if(this.crimeFormGroup.controls.underIndictmentsOrCharged.status === 'INVALID') {
      this.toastService.error("Fill in your under indictments or charged status ");

      return;
    } else if(this.crimeFormGroup.controls.honoredAsIndonesiaVeteran.status === 'INVALID') {
      this.toastService.error("Fill in your veteran discharge status");

      return;
    }

    let skillArray = [];

    (this.skillFormGroup.get('skills') as FormArray).getRawValue().forEach(item => {
      skillArray.push(item['skillName']);
    });

    // console.log(skillArray);

    let jobArray = [];

    (this.experienceFormGroup.get('jobs') as FormArray).getRawValue().forEach(item => {
      if(item.endPeriod !== null){
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'].toString(),
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      } else {
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'],
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      }
    
    });

    // console.log(jobArray);

    let educationArray = [];

    (this.educationFormGroup.get('educations') as FormArray).getRawValue().forEach(item => {
      educationArray.push(
        {
          degree: item['degree'],
          school: item['school'],
          startPeriod: item['startPeriod'].toString(),
          endPeriod: item['endPeriod'].toString(),
          fieldOfStudy: item['fieldOfStudy'],
          grade: item['grade'].toString()
        });
    });

    if(this.personalFormGroup.value.presentTelephone !== '' && this.personalFormGroup.value.presentTelephone !== null ){
      let telephone = this.personalFormGroup.value.presentTelephone.toString();
      this.personalFormGroup.controls['presentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['presentTelephone'].setValue('');
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }

    if(this.personalFormGroup.value.permanentTelephone !== '' && this.personalFormGroup.value.permanentTelephone !== null ){
      let telephone = this.personalFormGroup.value.permanentTelephone.toString();
      this.personalFormGroup.controls['permanentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['permanentTelephone'].setValue('');
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }

    let data = {
      personalData: {
        name: {
          firstName: this.personalFormGroup.value.firstName,
          middleName: this.personalFormGroup.value.middleName,
          lastName: this.personalFormGroup.value.lastName,
        },
        birthPlace: this.personalFormGroup.value.birthPlace,
        birthDate: this.personalFormGroup.value.birthDate.toString(),
        email: this.personalFormGroup.value.email,
        mailAddress: {
          street: this.personalFormGroup.value.address,
          province: this.personalFormGroup.value.province,
          city: this.personalFormGroup.value.city,
          postalCode: this.personalFormGroup.value.postalCode.toString()
        },
        permanentAddress: {
          street: this.personalFormGroup.value.permanentAddress,
          province: this.personalFormGroup.value.permanentProvince,
          city: this.personalFormGroup.value.permanentCity,
          postalCode: this.personalFormGroup.value.permanentPostalCode.toString()
        },
        presentTelephone: this.personalFormGroup.value.presentTelephone.toString(),
        permanentTelephone: this.personalFormGroup.value.permanentTelephone.toString(),
        
        details: {
          isUnder18:this.personalFormGroup.value.isUnderAge,
          ageIfUnder18:this.personalFormGroup.value.underAge,
          isOver55:this.personalFormGroup.value.isOverAge,
          ageIfOver55:this.personalFormGroup.value.overAge,
          isForeigner: this.personalFormGroup.value.isForeigner,
          visaIfForeigner:this.personalFormGroup.value.visa
        },
      },
      workStatement: {
        position: this.jobFormGroup.getRawValue().position,
        workLocation: this.jobFormGroup.getRawValue().workLocation,
        placement: {
          choice: this.jobFormGroup.value.placement,
          location: [this.jobFormGroup.value.placementLoc1, this.jobFormGroup.value.placementLoc2]
        },
        expectedSalary: this.jobFormGroup.value.expectedSalary.toString(),
        typeOfWork: this.assignmentArray,
        startDate: this.jobFormGroup.value.startWorking,
        employmentType: this.employmentArray
      },
      workExperience: jobArray,
      contactInformationOfLastCompany: {
        consent : {
          contactAnytime: this.experienceFormGroup.value.contactAnytime,
          specificTime: this.experienceFormGroup.value.contactDate,
        },
        contactNumber: this.experienceFormGroup.value.contactNumber.toString(),
        contactEmail: this.experienceFormGroup.value.contactEmail
      },
      education: educationArray,
      activitiesSocietiesAchievement:  this.educationFormGroup.value.activitiesSocietiesAchievement,
      accomplishment: {
        scientificPaperTitle:  this.educationFormGroup.value.scientificPaperTitle,
        researchTitle:  this.educationFormGroup.value.researchTitle,
        publicationTitle:  this.educationFormGroup.value.publicationTitle,
        patent: this.educationFormGroup.value.patent,
      },
      skills: skillArray,
      generalInformation: {
        haveYouEver: {
          previouslyWorked: this.generalFormGroup.value.previouslyWorked,
          details: this.generalFormGroup.value.previouslyWorkedDetail
        },
        anyRelatives: this.generalFormGroup.value.anyRelatives,
        relatives: this.generalFormGroup.value.relatives,
        knowJTIFrom: {
          ads: this.generalFormGroup.value.ads,
          isAds: this.generalFormGroup.value.isAds,
          agency: this.generalFormGroup.value.agency,
          isAgency: this.generalFormGroup.value.isAgency,
          other: this.generalFormGroup.value.other,
          isOther: this.generalFormGroup.value.isOther,
        },
        otherWorkAgreement: this.generalFormGroup.value.otherWorkAgreement,
        additionalInformation: this.generalFormGroup.value.additionalInformation,
      },
      personalStatement: {
        criminalHistory: this.crimeFormGroup.value.criminalHistory,
        underIndictmentsOrCharged: this.crimeFormGroup.value.underIndictmentsOrCharged,
        honoredAsIndonesiaVeteran: this.crimeFormGroup.value.honoredAsIndonesiaVeteran,
        description: this.crimeFormGroup.value.description,
      },
      applicationID: this.appId,
      jobID: this.jobId
    }

    console.log(data); 
  }

  //------------- List of Array Field -----------------//

  //---- FAMILIES INFORMATION -------//

  get familyList() {
    const control = this.personalFormGroup.get('families') as FormArray;
    return control;
  }

  family(): FormArray {
    return this.personalFormGroup.get('families') as FormArray;
  }

  newFamily(): FormGroup {
    return this.fb.group({
      relationStatus: ['',  Validators.required],
      name: ['',  Validators.required],
      address: ['',  Validators.required],
      telephoneNumber: ['',  Validators.required],
      occupation: ['',  Validators.required]
    });
  }

  addFamily() {
    this.family().push(this.newFamily());
  }

  removeFamily(i: number) {
    this.family().removeAt(i);
  }


  //---- JOBS -------//
  get jobList() {
    const control = this.experienceFormGroup.get('jobs') as FormArray;
    return control;
  }

  job(): FormArray {
    return this.experienceFormGroup.get('jobs') as FormArray;
  }

  newJob(): FormGroup {
    return this.fb.group({
      companyName: ['', Validators.required],
      companyLocation: ['', Validators.required],
      position: ['', Validators.required],
      startPeriod: ['', Validators.required], 
      endPeriod: [''],
      startSalary: ['', Validators.required],
      endSalary: ['', Validators.required],
      jobDescription: ['', Validators.required],
      reasonOfQuit: ['', Validators.required],
      curr: [false],
    });
  }

  addJob() {
    this.job().push(this.newJob());
  }

  removeJob(i: number) {
    this.job().removeAt(i);
  }

  //---- EDUCATION -------//


  get educationList() {
    const control = this.educationFormGroup.get('educations') as FormArray;
    return control;
  }
  
  education(): FormArray {
    return this.educationFormGroup.get('educations')  as FormArray;
  }

  newEducation(): FormGroup {
    return this.fb.group({
      degree: ['', Validators.required],
      school: ['', Validators.required],
      startPeriod: ['', Validators.required], 
      endPeriod: ['', Validators.required],
      fieldOfStudy: ['', Validators.required],
      grade: ['', Validators.required],
    });
  }
  
  addEducation() {
    this.education().push(this.newEducation());
  }

  removeEducation(i: number) {
    this.education().removeAt(i);
  }

  //---- SKILLS -------//

  get skillList() {
    const control = this.skillFormGroup.get('skills') as FormArray;
    return control;
  }

  skill(): FormArray {
    return this.skillFormGroup.get('skills') as FormArray;
  }

  newSkill(): FormGroup {
    return this.fb.group({
      skillName: ['']
    });
  }

  addSkill() {
    this.skill().push(this.newSkill());
  }

  removeSkill(i: number) {
    this.skill().removeAt(i);
  }

  //---- OTHER LANGUAGES -------//

  get languageList() {
      const control = this.skillFormGroup.get('languages') as FormArray;
      return control;
  }
  
  language(): FormArray {
    return this.skillFormGroup.get('languages') as FormArray;
  }

  newLanguage(): FormGroup {
    return this.fb.group({
      language: [''],
      proficiency: ['']
    });
  }

  addLanguage() {
    this.language().push(this.newLanguage());
  }

  removeLanguage(i: number) {
    this.language().removeAt(i);
  }

  //---- RELATIVES -------//

  get relativeList() {
    const control = this.generalFormGroup.get('relatives') as FormArray;
    return control;
}

relative(): FormArray {
  return this.generalFormGroup.get('relatives') as FormArray;
}

newRelative(): FormGroup {
  return this.fb.group({
    name: [''],
    position: ['']
  });
}

addRelative() {
  this.relative().push(this.newRelative());
}

removeRelative(i: number) {
  this.relative().removeAt(i);
}

  //------------- End List of Array Field -----------------//

  onSelectForm(type){
    // console.log(type);
    if(type==='job'){
      if(this.experienceFormGroup.value.jobs.length === 0){
        this.addJob();
      }
    }else{
      if(this.educationFormGroup.value.educations.length === 0){
        this.addEducation();
        }
    }
  }

  submitBlueForm(){
    // console.log('personal', this.personalFormGroup.valid)
    // console.log('job', this.jobFormGroup.valid)
    // console.log('experience', this.experienceFormGroup.valid)
    // console.log('edu', this.educationFormGroup.valid)
    // console.log('skill', this.skillFormGroup.valid)
    // console.log('general', this.generalFormGroup.valid)

    if(this.personalFormGroup.valid === false){
      this.toastService.error("Complete personal information!");
      return;
    } else if(this.jobFormGroup.valid === false){
      this.toastService.error("Complete job description information!");
      return;
    } else if(this.experienceFormGroup.valid === false){
      this.toastService.error("Complete work experience information!");
      return;
    } else if(this.educationFormGroup.valid === false){
      this.toastService.error("Complete educational history information!");
      return;
    } else if(this.skillFormGroup.valid === false){
      this.toastService.error("Complete the skill information!");
      return;
    } else if(this.generalFormGroup.valid === false){
      this.toastService.error("Complete the general information/information sheet!");
      return;
    }

    let skillArray = [];

    (this.skillFormGroup.get('skills') as FormArray).getRawValue().forEach(item => {
      skillArray.push(item['skillName']);
    });

    // console.log(skillArray);

    let jobArray = [];

    (this.experienceFormGroup.get('jobs') as FormArray).getRawValue().forEach(item => {
      if(item.endPeriod !== null){
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'].toString(),
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      }else {
        jobArray.push(
          {
            companyName: item['companyName'],
            companyLocation: item['companyLocation'],
            position: item['position'],
            startPeriod: item['startPeriod'].toString(),
            endPeriod: item['endPeriod'],
            startSalary: item['startSalary'].toString(),
            endSalary: item['endSalary'].toString(),
            jobDescription: item['jobDescription'],
            reasonOfQuit: item['reasonOfQuit'],
          });
      }
    
    });

    // console.log(jobArray);

    let educationArray = [];

    (this.educationFormGroup.get('educations') as FormArray).getRawValue().forEach(item => {
      educationArray.push(
        {
          degree: item['degree'],
          school: item['school'],
          startPeriod: item['startPeriod'].toString(),
          endPeriod: item['endPeriod'].toString(),
          fieldOfStudy: item['fieldOfStudy'],
          grade: item['grade'].toString()
        });
    });

    // console.log(educationArray);

    // let familyArray = [];

    // (this.personalFormGroup.get('families') as FormArray).getRawValue().forEach(item => {
    //   familyArray.push(
    //     {
    //       relationStatus: item['relationStatus'],
    //       name: item['name'],
    //       address: item['address'],
    //       telephoneNumber: item['telephoneNumber'].toString(),
    //       occupation: item['occupation']
    //     });
    // });

    // console.log(familyArray);

    if(this.personalFormGroup.value.presentTelephone !== '' && this.personalFormGroup.value.presentTelephone !== null ){
      let telephone = this.personalFormGroup.value.presentTelephone.toString();
      this.personalFormGroup.controls['presentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['presentTelephone'].setValue('');
      this.personalFormGroup.controls['presentTelephone'].updateValueAndValidity();
    }

    if(this.personalFormGroup.value.permanentTelephone !== '' && this.personalFormGroup.value.permanentTelephone !== null ){
      let telephone = this.personalFormGroup.value.permanentTelephone.toString();
      this.personalFormGroup.controls['permanentTelephone'].setValue(telephone);
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }else{
      this.personalFormGroup.controls['permanentTelephone'].setValue('');
      this.personalFormGroup.controls['permanentTelephone'].updateValueAndValidity();
    }

    let data = {
      personalData: {
        name: {
          firstName: this.personalFormGroup.value.firstName,
          middleName: this.personalFormGroup.value.middleName,
          lastName: this.personalFormGroup.value.lastName,
        },
        birthPlace: this.personalFormGroup.value.birthPlace,
        birthDate: this.personalFormGroup.value.birthDate && String(this.personalFormGroup.value.birthDate),
        email: this.personalFormGroup.value.email,
        mailAddress: {
          street: this.personalFormGroup.value.address,
          province: this.personalFormGroup.value.province,
          city: this.personalFormGroup.value.city,
          postalCode: this.personalFormGroup.value.postalCode && String(this.personalFormGroup.value.postalCode),
        },
        permanentAddress: {
          street: this.personalFormGroup.value.permanentAddress,
          province: this.personalFormGroup.value.permanentProvince,
          city: this.personalFormGroup.value.permanentCity,
          postalCode: this.personalFormGroup.value.permanentPostalCode && String(this.personalFormGroup.value.permanentPostalCode),
        },
        presentTelephone: this.personalFormGroup.value.presentTelephone && String(this.personalFormGroup.value.presentTelephone),
        permanentTelephone: this.personalFormGroup.value.permanentTelephone && String(this.personalFormGroup.value.permanentTelephone),
        
        details: {
          isUnder18:this.personalFormGroup.value.isUnderAge,
          ageIfUnder18:this.personalFormGroup.value.underAge,
          isOver55:this.personalFormGroup.value.isOverAge,
          ageIfOver55:this.personalFormGroup.value.overAge,
          isForeigner: this.personalFormGroup.value.isForeigner,
          visaIfForeigner:this.personalFormGroup.value.visa
        },
      },
      workStatement: {
        position: this.jobFormGroup.getRawValue().position,
        workLocation: this.jobFormGroup.getRawValue().workLocation,
        placement: {
          choice: this.jobFormGroup.value.placement,
          location: [this.jobFormGroup.value.placementLoc1, this.jobFormGroup.value.placementLoc2]
        },
        expectedSalary: this.jobFormGroup.value.expectedSalary && String(this.jobFormGroup.value.expectedSalary),
        typeOfWork: this.assignmentArray,
        startDate: this.jobFormGroup.value.startWorking,
        employmentType: this.employmentArray
      },
      workExperience: jobArray,
      contactInformationOfLastCompany: {
        consent : {
          contactAnytime: this.experienceFormGroup.value.contactAnytime,
          specificTime: this.experienceFormGroup.value.contactDate,
        },
        contactNumber: this.experienceFormGroup.value.contactNumber && String(this.experienceFormGroup.value.contactNumber),
        contactEmail: this.experienceFormGroup.value.contactEmail
      },
      education: educationArray,
      activitiesSocietiesAchievement:  this.educationFormGroup.value.activitiesSocietiesAchievement,
      accomplishment: {
        scientificPaperTitle:  this.educationFormGroup.value.scientificPaperTitle,
        researchTitle:  this.educationFormGroup.value.researchTitle,
        publicationTitle:  this.educationFormGroup.value.publicationTitle,
        patent: this.educationFormGroup.value.patent,
      },
      skills: skillArray,
      generalInformation: {
        haveYouEver: {
          previouslyWorked: this.generalFormGroup.value.previouslyWorked,
          details: this.generalFormGroup.value.previouslyWorkedDetail
        },
        anyRelatives: this.generalFormGroup.value.anyRelatives,
        relatives: this.generalFormGroup.value.relatives,
        knowJTIFrom: {
          ads: this.generalFormGroup.value.ads,
          isAds: this.generalFormGroup.value.isAds,
          agency: this.generalFormGroup.value.agency,
          isAgency: this.generalFormGroup.value.isAgency,
          other: this.generalFormGroup.value.other,
          isOther: this.generalFormGroup.value.isOther,
        },
        otherWorkAgreement: this.generalFormGroup.value.otherWorkAgreement,
        additionalInformation: this.generalFormGroup.value.additionalInformation,
      },
      personalStatement: {
        criminalHistory: this.crimeFormGroup.value.criminalHistory,
        underIndictmentsOrCharged: this.crimeFormGroup.value.underIndictmentsOrCharged,
        honoredAsIndonesiaVeteran: this.crimeFormGroup.value.honoredAsIndonesiaVeteran,
        description: this.crimeFormGroup.value.description,
      },
      applicationID: this.appId,
      jobID: this.jobId
    }
    console.log(data); 

    if(this.blueformID === undefined){
      this.userService.createBlueForm(data, this.token).subscribe(
        response => {
         this.toastService.success('Blueform has been submitted');
         this.router.navigate(['home'])
        },error =>{
            // console.log(error);
            this.toastService.error(error.error);
        });
    } else {
      this.userService.updateBlueForm(this.blueformID, data, this.token).subscribe(
        response => {
         this.toastService.success('Blueform has been submitted');
         this.router.navigate(['home'])
        },error =>{
            // console.log(error);
            this.toastService.error(error.error);
        });
    }
    
  }

}
