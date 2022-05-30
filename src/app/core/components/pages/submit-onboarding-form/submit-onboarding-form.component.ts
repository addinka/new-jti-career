import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { Arrays, Constant, HEALTH_TYPES } from '../../../utils/constant'
import { UserService } from 'src/app/core/services/user.service';
import { JobService } from 'src/app/core/services/job.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submit-onboarding-form',
  templateUrl: './submit-onboarding-form.component.html',
  styleUrls: ['./submit-onboarding-form.component.scss']
})
export class SubmitOnboardingFormComponent implements OnInit {
  public personalFormGroup: FormGroup;
  public emergencyFormGroup: FormGroup;
  public skckFormGroup: FormGroup;
  public BPJSKetenagaKerjaanFormGroup: FormGroup;
  public healthFormGroup: FormGroup;
  public BPJSKesehatanFormGroup: FormGroup;
  public accessFormGroup: FormGroup;
  public agreementFormGroup: FormGroup;

  public token: any = localStorage.getItem('token');;
  public blueformID: any;
  public onBoardingID: any;
  public formStatus: any;
  public userId = localStorage.getItem('id');

  public familyTypes = ['Spouse', 'Children'];
  public status = ['Permanent Employee', 'Non Permanent Employee', 'Visitor', 'Other'];
  public healthFamilyTypes = ['New', 'Changes', 'Terminate'];
  public bpjsFamilyTypes = ['New', 'Update', 'Non-Active'];
  public badge = ['New Employee', 'Replacement', 'Lost', 'Other'];
  public gender = ['Male', 'Female'];
  public maritalStatus = ['Single', 'Married', 'Divorced', 'Widow', 'Widower'];
  public healthTypes = HEALTH_TYPES;

  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    private jobService: JobService,
    public toastService: ToastService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.personalFormGroup = this.fb.group({
      employeeName: ['', Validators.required],
      serialNumber: [''], 
      dateOfEmployment: ['', Validators.required],
      department: [''],
      phoneNumber: ['', Validators.required], 
      email: ['', Validators.required],
    });

    this.emergencyFormGroup = this.fb.group({
      name1: ['', Validators.required],
      relation1: ['', Validators.required], 
      phoneNumber1: ['', Validators.required],
      name2: [''],
      relation2: [''], 
      phoneNumber2: [''],
    });

    this.skckFormGroup = this.fb.group({
      skckValidity: ['', Validators.required],
    });

    this.BPJSKetenagaKerjaanFormGroup = this.fb.group({
      isID: [false, Validators.required],
      IDDate: [''], 
      IDRemarks: [''],
      isSambungSaldo: [false, Validators.required],
      sambungSaldoRemarks: [''], 
      isBPJSKetenagakerjaan: [false, Validators.required],
      BPJSKetenagakerjaanDate: [''], 
      BPJSKetenagakerjaanRemarks: [''],
      motherName: ['', Validators.required],
      motherRemarks: [''], 
    });

    this.healthFormGroup = this.fb.group({
      healthInsuranceType: ['', Validators.required],
      healthCoverages: this.fb.array([]),
      healthEffectiveDate: ['', Validators.required],
      isIDCard: [false],
      isFamilyCard: [false],
      isBirthCertificate: [false],
    });

    this.BPJSKesehatanFormGroup = this.fb.group({
      BPJSKesehatanNumber: ['', Validators.required],
      motherName: ['', Validators.required],
      email: ['', Validators.required],
      nationality: ['', Validators.required],
      salary: ['', Validators.required],
      familyCardNumber: ['', Validators.required],
      address: ['', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      isIDCard: [false],
      isFamilyCard: [false],
      isBPJSKesehatanCard: [false],
      BPJSCoverages: this.fb.array([]),
    });

    this.accessFormGroup = this.fb.group({
      status: ['', Validators.required],
      badgeCategory: ['', Validators.required],
      validationStartPeriod: ['', Validators.required],
      validationEndPeriod: ['', Validators.required],
    });

    this.agreementFormGroup = this.fb.group({
      agreementFourPointOne: [''],
      agreementFourPointTwo: [''],
      agreementSeven: ['', Validators.required],
    });
   }

  ngOnInit() {
    this.route.queryParamMap.subscribe(
      queryParams => {
        console.log(queryParams);
        this.formStatus = queryParams['params'].status;
        if(this.formStatus === 'new'){
          this.blueformID = queryParams['params'].id;
          this.getBlueform();
          console.log('1')
        }else if(this.formStatus === 'new-profile'){
          this.getProfile();
          console.log('2')
        }else{
          this.onBoardingID = queryParams['params'].id;
          this.getOnBoardingForm()
          console.log('3')
        }
        
      });
  }

  getProfile() {
    this.userService.getProfile()
    .subscribe(response => {
        console.log(response);
        this.personalFormGroup.controls['employeeName'].setValue(response.name);
        this.personalFormGroup.controls['email'].setValue(response.email);
        this.personalFormGroup.controls['phoneNumber'].setValue(response.contact);

        this.BPJSKesehatanFormGroup.controls['city'].setValue(response.domicile);

      }, error =>{
        console.log(error);
        this.toastService.error(error.error.message);
      });
    }

  getBlueform(){
    this.userService.getBlueFormByUserId(this.userId)
    .subscribe(response => {
      console.log(response);
      let data = response.docs[0];

      // Personal Information
      let fullname = data.personalData.name.firstName + " " + data.personalData.name.middleName  + " " + data.personalData.name.lastName
      this.personalFormGroup.controls['employeeName'].setValue(fullname);
      this.personalFormGroup.controls['email'].setValue(data.personalData.email);
      this.personalFormGroup.controls['phoneNumber'].setValue(data.personalData.presentTelephone);

      // BPJSKesehatanFormGroup Information
      this.BPJSKesehatanFormGroup.controls['email'].setValue(data.personalData.email);
      this.BPJSKesehatanFormGroup.controls['address'].setValue(data.personalData.permanentAddress.street);
      this.BPJSKesehatanFormGroup.controls['province'].setValue(data.personalData.permanentAddress.province);
      this.BPJSKesehatanFormGroup.controls['city'].setValue(data.personalData.permanentAddress.city);
      this.BPJSKesehatanFormGroup.controls['postalCode'].setValue(data.personalData.permanentAddress.postalCode);
    }, error =>{
      console.log(error);
      this.toastService.error(error.error.message);
    });
  }

  getOnBoardingForm(){
    const healthArray = this.healthFormGroup.get('healthCoverages') as FormArray;
    const bpjsArray = this.BPJSKesehatanFormGroup.get('BPJSCoverages') as FormArray;
    this.getProfile();
    this.userService.getOnBoardingForm(this.onBoardingID, this.token)
    .subscribe(response => {
      console.log(response);
      let data = response.docs[0];

      // Personal Information
      this.personalFormGroup.controls['employeeName'].setValue(data.personalFormGroup.employeeName);
      this.personalFormGroup.controls['serialNumber'].setValue(data.personalFormGroup.serialNumber);
      this.personalFormGroup.controls['dateOfEmployment'].setValue(new Date(data.personalFormGroup.dateOfEmployment));
      this.personalFormGroup.controls['department'].setValue(data.personalFormGroup.department);
      this.personalFormGroup.controls['email'].setValue(data.personalFormGroup.email);
      this.personalFormGroup.controls['phoneNumber'].setValue(data.personalFormGroup.phoneNumber);

      // Emergency Information
      this.emergencyFormGroup.controls['name1'].setValue(data.emergencyFormGroup.name1);
      this.emergencyFormGroup.controls['relation1'].setValue(data.emergencyFormGroup.relation1);
      this.emergencyFormGroup.controls['phoneNumber1'].setValue(data.emergencyFormGroup.phoneNumber1);
      this.emergencyFormGroup.controls['name2'].setValue(data.emergencyFormGroup.name2);
      this.emergencyFormGroup.controls['relation2'].setValue(data.emergencyFormGroup.relation2);
      this.emergencyFormGroup.controls['phoneNumber2'].setValue(data.emergencyFormGroup.phoneNumber2);

      // SKCK Information
      this.skckFormGroup.controls['skckValidity'].setValue(new Date(data.skckValidity));

      // BPJS Ketenagakerjaan Information
      this.BPJSKetenagaKerjaanFormGroup.controls['isID'].setValue(data.BPJSKetenagaKerjaanFormGroup.isID);
      this.BPJSKetenagaKerjaanFormGroup.controls['IDDate'].setValue(data.BPJSKetenagaKerjaanFormGroup.IDDate);
      this.BPJSKetenagaKerjaanFormGroup.controls['IDRemarks'].setValue(data.BPJSKetenagaKerjaanFormGroup.IDRemarks);
      this.BPJSKetenagaKerjaanFormGroup.controls['isSambungSaldo'].setValue(data.BPJSKetenagaKerjaanFormGroup.isSambungSaldo);
      this.BPJSKetenagaKerjaanFormGroup.controls['sambungSaldoRemarks'].setValue(data.BPJSKetenagaKerjaanFormGroup.sambungSaldoRemarks);
      this.BPJSKetenagaKerjaanFormGroup.controls['isBPJSKetenagakerjaan'].setValue(data.BPJSKetenagaKerjaanFormGroup.isBPJSKetenagakerjaan);
      this.BPJSKetenagaKerjaanFormGroup.controls['BPJSKetenagakerjaanDate'].setValue(data.BPJSKetenagaKerjaanFormGroup.BPJSKetenagakerjaanDate);
      this.BPJSKetenagaKerjaanFormGroup.controls['BPJSKetenagakerjaanRemarks'].setValue(data.BPJSKetenagaKerjaanFormGroup.BPJSKetenagakerjaanRemarks);
      this.BPJSKetenagaKerjaanFormGroup.controls['motherName'].setValue(data.BPJSKetenagaKerjaanFormGroup.motherName);
      this.BPJSKetenagaKerjaanFormGroup.controls['motherRemarks'].setValue(data.BPJSKetenagaKerjaanFormGroup.motherRemarks);

      // Health Information
      for (let i = 0; i < data.healthFormGroup.healthCoverages.length; i++) {
        const newHealth = this.fb.group({
          name: [data.healthFormGroup.healthCoverages[i].name],
          relation: [data.healthFormGroup.healthCoverages[i].relation],
          birthDate: [new Date(data.healthFormGroup.healthCoverages[i].birthDate)], 
          gender: [data.healthFormGroup.healthCoverages[i].gender],
          type: [data.healthFormGroup.healthCoverages[i].type],
          remarks: [data.healthFormGroup.healthCoverages[i].remarks],
        });
        this.health().push(newHealth);
      }

      this.healthFormGroup.controls['healthInsuranceType'].setValue(data.healthFormGroup.healthInsuranceType);
      this.healthFormGroup.controls['healthEffectiveDate'].setValue(new Date(data.healthFormGroup.effectiveDate));
      this.healthFormGroup.controls['isIDCard'].setValue(data.healthFormGroup.isIDCard);
      this.healthFormGroup.controls['isFamilyCard'].setValue(data.healthFormGroup.isFamilyCard);
      this.healthFormGroup.controls['isBirthCertificate'].setValue(data.healthFormGroup.isBirthCertificate);

      // BPJS Kesehatan Information
      for (let i = 0; i < data.BPJSKesehatanFormGroup.BPJSCoverages.length; i++) {
        const newBPJS = this.fb.group({
          name: [data.BPJSKesehatanFormGroup.BPJSCoverages[i].name],
          idCardNumber: [data.BPJSKesehatanFormGroup.BPJSCoverages[i].idCardNumber],
          birthPlace: [data.BPJSKesehatanFormGroup.BPJSCoverages[i].birthPlace],
          birthDate: [new Date(data.BPJSKesehatanFormGroup.BPJSCoverages[i].birthDate)], 
          relation: [data.BPJSKesehatanFormGroup.BPJSCoverages[i].relation],
          gender: [data.BPJSKesehatanFormGroup.BPJSCoverages[i].gender],
          maritalStatus: [data.BPJSKesehatanFormGroup.BPJSCoverages[i].maritalStatus],
          faskesName: [data.BPJSKesehatanFormGroup.BPJSCoverages[i].faskesName],
          type: [data.BPJSKesehatanFormGroup.BPJSCoverages[i].type],
          remarks: [data.BPJSKesehatanFormGroup.BPJSCoverages[i].remarks],
        });
        this.BPJS().push(newBPJS);
      }

      this.BPJSKesehatanFormGroup.controls['BPJSKesehatanNumber'].setValue(data.BPJSKesehatanFormGroup.BPJSKesehatanNumber);
      this.BPJSKesehatanFormGroup.controls['motherName'].setValue(data.BPJSKesehatanFormGroup.motherName);
      this.BPJSKesehatanFormGroup.controls['email'].setValue(data.BPJSKesehatanFormGroup.email);
      this.BPJSKesehatanFormGroup.controls['nationality'].setValue(data.BPJSKesehatanFormGroup.nationality);
      this.BPJSKesehatanFormGroup.controls['salary'].setValue(data.BPJSKesehatanFormGroup.salary);
      this.BPJSKesehatanFormGroup.controls['familyCardNumber'].setValue(data.BPJSKesehatanFormGroup.familyCardNumber);
      this.BPJSKesehatanFormGroup.controls['address'].setValue(data.BPJSKesehatanFormGroup.address);
      this.BPJSKesehatanFormGroup.controls['province'].setValue(data.BPJSKesehatanFormGroup.province);
      this.BPJSKesehatanFormGroup.controls['city'].setValue(data.BPJSKesehatanFormGroup.city);
      this.BPJSKesehatanFormGroup.controls['postalCode'].setValue(data.BPJSKesehatanFormGroup.postalCode);
      this.BPJSKesehatanFormGroup.controls['effectiveDate'].setValue(data.BPJSKesehatanFormGroup.effectiveDate);
      this.BPJSKesehatanFormGroup.controls['isIDCard'].setValue(data.BPJSKesehatanFormGroup.isIDCard);
      this.BPJSKesehatanFormGroup.controls['isBPJSKesehatanCard'].setValue(data.BPJSKesehatanFormGroup.isBPJSKesehatanCard);
      this.BPJSKesehatanFormGroup.controls['BPJSKesehatanNumber'].setValue(data.BPJSKesehatanFormGroup.BPJSKesehatanNumber);

      // Access Information
      this.accessFormGroup.controls['status'].setValue(data.accessFormGroup.status);
      this.accessFormGroup.controls['badgeCategory'].setValue(data.accessFormGroup.badgeCategory);
      this.accessFormGroup.controls['validationStartPeriod'].setValue(data.accessFormGroup.validationStartPeriod);
      this.accessFormGroup.controls['validationEndPeriod'].setValue(data.accessFormGroup.validationEndPeriod);
      
      // Agreement Information
      this.agreementFormGroup.controls['agreementFourPointOne'].setValue(data.agreementFormGroup.agreementFourPointOne);
      this.agreementFormGroup.controls['agreementFourPointTwo'].setValue(data.agreementFormGroup.agreementFourPointTwo);
      this.agreementFormGroup.controls['agreementSeven'].setValue(data.agreementFormGroup.agreementSeven);

    },error =>{
      console.log(error);
      this.toastService.error(error.error.message);
    });

  }

  //------------- List of Array Field -----------------//

   //---- HEALTH INFORMATION -------//

   get healthList() {
    const control = this.healthFormGroup.get('healthCoverages') as FormArray;
    return control;
  }

  health(): FormArray {
    return this.healthFormGroup.get('healthCoverages') as FormArray;
  }

  newHealth(): FormGroup {
    return this.fb.group({
      name: ['',  Validators.required],
      birthDate: ['',  Validators.required],
      relation: ['',  Validators.required],
      gender: ['',  Validators.required],
      type: ['',  Validators.required],
      remarks: ['',  Validators.required]
    });
  }

  addHealth() {
    this.health().push(this.newHealth());
  }

  removeHealth(i: number) {
    this.health().removeAt(i);
  }

  //---- BPJS INFORMATION -------//

  get BPJSList() {
    const control = this.BPJSKesehatanFormGroup.get('BPJSCoverages') as FormArray;
    return control;
  }

  BPJS(): FormArray {
    return this.BPJSKesehatanFormGroup.get('BPJSCoverages') as FormArray;
  }

  newBPJS(): FormGroup {
    return this.fb.group({
      name: ['',  Validators.required],
      idCardNumber: ['',  Validators.required],
      birthPlace: ['',  Validators.required],
      birthDate: ['',  Validators.required],
      relation: ['',  Validators.required],
      gender: ['',  Validators.required],
      maritalStatus: ['',  Validators.required],
      faskesName: ['',  Validators.required],
      type: ['',  Validators.required],
      remarks: ['',  Validators.required]
    });
  }

  addBPJS() {
    this.BPJS().push(this.newBPJS());
  }

  removeBPJS(i: number) {
    this.BPJS().removeAt(i);
  }

  formCheck(){
    if(this.skckFormGroup.value.skckValidity.toString() === "" || this.skckFormGroup.value.skckValidity.toString() === "Invalid Date"){
      this.skckFormGroup.controls['skckValidity'].setValue(null);
      this.skckFormGroup.controls['skckValidity'].updateValueAndValidity();
    }

    // Health Assurance
    let healthArray = [];

    (this.healthFormGroup.get('healthCoverages') as FormArray).getRawValue().forEach(item => {
      healthArray.push(
        {
          name: item['name'],
          birthDate: item['birthDate'],
          relation: item['relation'],
          gender: item['gender'],
          type: item['type'],
          remarks:item['remarks'],
        });
    });

    // BPJS Assurance
    let bpjsArray = [];

    (this.BPJSKesehatanFormGroup.get('BPJSCoverages') as FormArray).getRawValue().forEach(item => {
      bpjsArray.push(
        {
          name: item['name'],
          idCardNumber:item['idCardNumber'],
          birthPlace:item['birthPlace'],
          birthDate:item['birthDate'],
          relation:item['relation'],
          gender:item['gender'],
          maritalStatus:item['maritalStatus'],
          faskesName:item['faskesName'],
          type:item['type'],
          remarks: item['remarks'],
        });
    });

    let data = {
      userID: this.userId,
      status: '',
      personalFormGroup: {
          employeeName: this.personalFormGroup.value.employeeName,
          serialNumber:this.personalFormGroup.value.serialNumber,
          dateOfEmployment: this.personalFormGroup.value.dateOfEmployment,
          department: this.personalFormGroup.value.department,
          phoneNumber: this.personalFormGroup.value.phoneNumber,
          email: this.personalFormGroup.value.email,
      },
      emergencyFormGroup: {
        name1: this.emergencyFormGroup.value.name1,
        relation1: this.emergencyFormGroup.value.relation1,
        phoneNumber1: this.emergencyFormGroup.value.phoneNumber1,
        name2: this.emergencyFormGroup.value.name2,
        relation2: this.emergencyFormGroup.value.relation2,
        phoneNumber2: this.emergencyFormGroup.value.phoneNumber2,
      },
      skckValidity: this.skckFormGroup.value.skckValidity,
      BPJSKetenagaKerjaanFormGroup: {
        isID: this.BPJSKetenagaKerjaanFormGroup.value.isID,
        IDDate: this.BPJSKetenagaKerjaanFormGroup.value.IDDate,
        IDRemarks:this.BPJSKetenagaKerjaanFormGroup.value.IDRemarks,
        isSambungSaldo: this.BPJSKetenagaKerjaanFormGroup.value.isSambungSaldo,
        sambungSaldoRemarks: this.BPJSKetenagaKerjaanFormGroup.value.sambungSaldoRemarks,
        isBPJSKetenagakerjaan: this.BPJSKetenagaKerjaanFormGroup.value.isBPJSKetenagakerjaan,
        BPJSKetenagakerjaanDate: this.BPJSKetenagaKerjaanFormGroup.value.BPJSKetenagakerjaanDate,
        BPJSKetenagakerjaanRemarks:this.BPJSKetenagaKerjaanFormGroup.value.BPJSKetenagakerjaanRemarks,
        motherName: this.BPJSKetenagaKerjaanFormGroup.value.motherName,
        motherRemarks: this.BPJSKetenagaKerjaanFormGroup.value.motherRemarks,
      },
      healthFormGroup: {
        healthInsuranceType: this.healthFormGroup.value.healthInsuranceType,
        healthCoverages: healthArray,
        effectiveDate: this.healthFormGroup.value.healthEffectiveDate,
        isIDCard: this.healthFormGroup.value.isIDCard,
        isFamilyCard: this.healthFormGroup.value.isFamilyCard,
        isBirthCertificate: this.healthFormGroup.value.isBirthCertificate,
      },
      BPJSKesehatanFormGroup: {
        BPJSKesehatanNumber: this.BPJSKesehatanFormGroup.value.BPJSKesehatanNumber,
        motherName: this.BPJSKesehatanFormGroup.value.motherName,
        email: this.BPJSKesehatanFormGroup.value.email,
        nationality: this.BPJSKesehatanFormGroup.value.nationality,
        salary: this.BPJSKesehatanFormGroup.value.salary,
        familyCardNumber: this.BPJSKesehatanFormGroup.value.familyCardNumber,
        address: this.BPJSKesehatanFormGroup.value.address,
        province:this.BPJSKesehatanFormGroup.value.province,
        city: this.BPJSKesehatanFormGroup.value.city,
        postalCode: this.BPJSKesehatanFormGroup.value.postalCode && String(this.BPJSKesehatanFormGroup.value.postalCode),
        effectiveDate: this.BPJSKesehatanFormGroup.value.effectiveDate,
        isIDCard: this.BPJSKesehatanFormGroup.value.isIDCard,
        isFamilyCard:this.BPJSKesehatanFormGroup.value.isFamilyCard,
        isBPJSKesehatanCard: this.BPJSKesehatanFormGroup.value.isBPJSKesehatanCard,
        BPJSCoverages: bpjsArray
      },
      accessFormGroup: {
        status: this.accessFormGroup.value.status,
        badgeCategory: this.accessFormGroup.value.badgeCategory,
        validationStartPeriod:this.accessFormGroup.value.validationStartPeriod,
        validationEndPeriod: this.accessFormGroup.value.validationEndPeriod,
      },
      agreementFormGroup: {
        agreementFourPointOne: this.agreementFormGroup.value.agreementFourPointOne,
        agreementFourPointTwo: this.agreementFormGroup.value.agreementFourPointTwo,
        agreementSeven: this.agreementFormGroup.value.agreementSeven,
      }
    }

    console.log(data)

    console.log('personal', this.personalFormGroup.valid)
    console.log('emergency', this.emergencyFormGroup.valid)
    console.log('skck', this.skckFormGroup.valid)
    console.log('ketenagakerjaan', this.BPJSKetenagaKerjaanFormGroup.valid)
    console.log('health', this.healthFormGroup.valid)
    console.log('kesehatan', this.BPJSKesehatanFormGroup.valid)
    console.log('access', this.accessFormGroup.valid)
    console.log('agreement', this.agreementFormGroup.valid)

    console.log('personal', this.personalFormGroup.value)
    console.log('emergency', this.emergencyFormGroup.value)
    console.log('skck', this.skckFormGroup.value)
    console.log('ketenagakerjaan', this.BPJSKetenagaKerjaanFormGroup.value)
    console.log('health', this.healthFormGroup.value)
    console.log('kesehatan', this.BPJSKesehatanFormGroup.value)
    console.log('access', this.accessFormGroup.value)
    console.log('agreement', this.agreementFormGroup.value)
  }

  submitForm(type){
    if(type !== 'draft'){
      if(this.personalFormGroup.valid === false){
        this.toastService.error("Complete personal information!");
        return;
      } else if(this.emergencyFormGroup.valid === false){
        this.toastService.error("Complete emergency contact information!");
        return;
      } else if(this.skckFormGroup.valid === false){
        this.toastService.error("Complete SKCK information!");
        return;
      } else if(this.BPJSKetenagaKerjaanFormGroup.valid === false){
        this.toastService.error("Complete BPJS Ketenagakerjaan information!");
        return;
      } else if(this.healthFormGroup.valid === false){
        this.toastService.error("Complete health coverage information!");
        return;
      } else if(this.BPJSKesehatanFormGroup.valid === false){
        this.toastService.error("Complete BPJS Kesehatan information!");
        return;
      }else if(this.accessFormGroup.valid === false){
        this.toastService.error("Complete access and badge information!");
        return;
      }else if(this.agreementFormGroup.valid === false){
        this.toastService.error("Complete agreement information!");
        return;
      }
    }

    if(this.personalFormGroup.value.dateOfEmployment === null || this.personalFormGroup.value.dateOfEmployment.toString() === "" || this.personalFormGroup.value.dateOfEmployment.toString() === "Invalid Date"){
      this.personalFormGroup.controls['dateOfEmployment'].setValue(null);
      this.personalFormGroup.controls['dateOfEmployment'].updateValueAndValidity();
    }

    if(this.skckFormGroup.value.skckValidity === null || this.skckFormGroup.value.skckValidity.toString() === "" || this.skckFormGroup.value.skckValidity.toString() === "Invalid Date" ){
      this.skckFormGroup.controls['skckValidity'].setValue(null);
      this.skckFormGroup.controls['skckValidity'].updateValueAndValidity();
    }

    if(this.BPJSKetenagaKerjaanFormGroup.value.IDDate === null|| this.BPJSKetenagaKerjaanFormGroup.value.IDDate.toString() === "" || this.BPJSKetenagaKerjaanFormGroup.value.IDDate.toString() === "Invalid Date"){
      this.BPJSKetenagaKerjaanFormGroup.controls['IDDate'].setValue(null);
      this.BPJSKetenagaKerjaanFormGroup.controls['IDDate'].updateValueAndValidity();
    }

    if(this.BPJSKetenagaKerjaanFormGroup.value.BPJSKetenagakerjaanDate === null || this.BPJSKetenagaKerjaanFormGroup.value.BPJSKetenagakerjaanDate.toString() === "" || this.BPJSKetenagaKerjaanFormGroup.value.BPJSKetenagakerjaanDate.toString() === "Invalid Date"){
      this.BPJSKetenagaKerjaanFormGroup.controls['BPJSKetenagakerjaanDate'].setValue(null);
      this.BPJSKetenagaKerjaanFormGroup.controls['BPJSKetenagakerjaanDate'].updateValueAndValidity();
    }

    if( this.healthFormGroup.value.healthEffectiveDate === null || this.healthFormGroup.value.healthEffectiveDate.toString() === "" || this.healthFormGroup.value.healthEffectiveDate.toString() === "Invalid Date"){
      this.healthFormGroup.controls['healthEffectiveDate'].setValue(null);
      this.healthFormGroup.controls['healthEffectiveDate'].updateValueAndValidity();
    }

    if(this.BPJSKesehatanFormGroup.value.effectiveDate === null || this.BPJSKesehatanFormGroup.value.effectiveDate.toString() === "" || this.BPJSKesehatanFormGroup.value.effectiveDate.toString() === "Invalid Date" ){
      this.BPJSKesehatanFormGroup.controls['effectiveDate'].setValue(null);
      this.BPJSKesehatanFormGroup.controls['effectiveDate'].updateValueAndValidity();
    }

    if(this.accessFormGroup.value.validationStartPeriod  === null || this.accessFormGroup.value.validationStartPeriod.toString() === "" || this.accessFormGroup.value.validationStartPeriod.toString() === "Invalid Date"){
      this.accessFormGroup.controls['validationStartPeriod'].setValue(null);
      this.accessFormGroup.controls['validationStartPeriod'].updateValueAndValidity();
    }

    if(this.accessFormGroup.value.validationEndPeriod === null || this.accessFormGroup.value.validationEndPeriod.toString() === "" || this.accessFormGroup.value.validationEndPeriod.toString() === "Invalid Date"){
      this.accessFormGroup.controls['validationEndPeriod'].setValue(null);
      this.accessFormGroup.controls['validationEndPeriod'].updateValueAndValidity();
    }

     // Health Assurance
     let healthArray = [];

     (this.healthFormGroup.get('healthCoverages') as FormArray).getRawValue().forEach(item => {
       healthArray.push(
         {
           name: item['name'],
           birthDate: item['birthDate'],
           relation: item['relation'],
           gender: item['gender'],
           type: item['type'],
           remarks:item['remarks'],
         });
     });
 
     // BPJS Assurance
     let bpjsArray = [];
 
     (this.BPJSKesehatanFormGroup.get('BPJSCoverages') as FormArray).getRawValue().forEach(item => {
       bpjsArray.push(
         {
           name: item['name'],
           idCardNumber:item['idCardNumber'],
           birthPlace:item['birthPlace'],
           birthDate:item['birthDate'],
           relation:item['relation'],
           gender:item['gender'],
           maritalStatus:item['maritalStatus'],
           faskesName:item['faskesName'],
           type:item['type'],
           remarks: item['remarks'],
         });
     });
 
     let data = {
       userID: this.userId,
       status: type,
       personalFormGroup: {
           employeeName: this.personalFormGroup.value.employeeName,
           serialNumber:this.personalFormGroup.value.serialNumber,
           dateOfEmployment: this.personalFormGroup.value.dateOfEmployment,
           department: this.personalFormGroup.value.department,
           phoneNumber: this.personalFormGroup.value.phoneNumber && String(this.personalFormGroup.value.phoneNumber),
           email: this.personalFormGroup.value.email,
       },
       emergencyFormGroup: {
         name1: this.emergencyFormGroup.value.name1,
         relation1: this.emergencyFormGroup.value.relation1,
         phoneNumber1: this.emergencyFormGroup.value.phoneNumber1 && String(this.emergencyFormGroup.value.phoneNumber1),
         name2: this.emergencyFormGroup.value.name2,
         relation2: this.emergencyFormGroup.value.relation2,
         phoneNumber2: this.emergencyFormGroup.value.phoneNumber2 && String(this.emergencyFormGroup.value.phoneNumber2),
       },
       skckValidity: this.skckFormGroup.value.skckValidity,
       BPJSKetenagaKerjaanFormGroup: {
         isID: this.BPJSKetenagaKerjaanFormGroup.value.isID,
         IDDate: this.BPJSKetenagaKerjaanFormGroup.value.IDDate,
         IDRemarks:this.BPJSKetenagaKerjaanFormGroup.value.IDRemarks,
         isSambungSaldo: this.BPJSKetenagaKerjaanFormGroup.value.isSambungSaldo,
         sambungSaldoRemarks: this.BPJSKetenagaKerjaanFormGroup.value.sambungSaldoRemarks,
         isBPJSKetenagakerjaan: this.BPJSKetenagaKerjaanFormGroup.value.isBPJSKetenagakerjaan,
         BPJSKetenagakerjaanDate: this.BPJSKetenagaKerjaanFormGroup.value.BPJSKetenagakerjaanDate,
         BPJSKetenagakerjaanRemarks:this.BPJSKetenagaKerjaanFormGroup.value.BPJSKetenagakerjaanRemarks,
         motherName: this.BPJSKetenagaKerjaanFormGroup.value.motherName,
         motherRemarks: this.BPJSKetenagaKerjaanFormGroup.value.motherRemarks,
       },
       healthFormGroup: {
         healthInsuranceType: this.healthFormGroup.value.healthInsuranceType,
         healthCoverages: healthArray,
         effectiveDate: this.healthFormGroup.value.healthEffectiveDate,
         isIDCard: this.healthFormGroup.value.isIDCard,
         isFamilyCard: this.healthFormGroup.value.isFamilyCard,
         isBirthCertificate: this.healthFormGroup.value.isBirthCertificate,
       },
       BPJSKesehatanFormGroup: {
         BPJSKesehatanNumber: this.BPJSKesehatanFormGroup.value.BPJSKesehatanNumber,
         motherName: this.BPJSKesehatanFormGroup.value.motherName,
         email: this.BPJSKesehatanFormGroup.value.email,
         nationality: this.BPJSKesehatanFormGroup.value.nationality,
         salary: this.BPJSKesehatanFormGroup.value.salary,
         familyCardNumber: this.BPJSKesehatanFormGroup.value.familyCardNumber,
         address: this.BPJSKesehatanFormGroup.value.address,
         province:this.BPJSKesehatanFormGroup.value.province,
         city: this.BPJSKesehatanFormGroup.value.city,
         postalCode: this.BPJSKesehatanFormGroup.value.postalCode && String(this.BPJSKesehatanFormGroup.value.postalCode),
         effectiveDate: this.BPJSKesehatanFormGroup.value.effectiveDate,
         isIDCard: this.BPJSKesehatanFormGroup.value.isIDCard,
         isFamilyCard:this.BPJSKesehatanFormGroup.value.isFamilyCard,
         isBPJSKesehatanCard: this.BPJSKesehatanFormGroup.value.isBPJSKesehatanCard,
         BPJSCoverages: bpjsArray
       },
       accessFormGroup: {
         status: this.accessFormGroup.value.status,
         badgeCategory: this.accessFormGroup.value.badgeCategory,
         validationStartPeriod:this.accessFormGroup.value.validationStartPeriod,
         validationEndPeriod: this.accessFormGroup.value.validationEndPeriod,
       },
       agreementFormGroup: {
         agreementFourPointOne: this.agreementFormGroup.value.agreementFourPointOne,
         agreementFourPointTwo: this.agreementFormGroup.value.agreementFourPointTwo,
         agreementSeven: this.agreementFormGroup.value.agreementSeven,
       }
     }
 
     console.log(data)



    if(this.formStatus === 'new' || this.formStatus === 'new-profile'){
      this.userService.createOnBoardingForm(data).subscribe(
        response => {
          console.log(response);
          if(type === 'submit'){
            this.toastService.success('Onboarding form has been submitted.');
          }else{
            this.toastService.success('Onboarding form has been save as draft.');
          }
         this.router.navigate(['/profile'])
        },error =>{
            console.log(error);
            this.toastService.error(error.error.message);
        });
    }else{
      this.userService.submitOnBoardingForm(this.onBoardingID, data).subscribe(
        response => {
          if(type === 'submit'){
            this.toastService.success('Onboarding form has been submitted.');
          }else{
            this.toastService.success('Onboarding form has been save as draft.');
          }
        
         this.router.navigate(['/profile'])
        },error =>{
            console.log(error);
            this.toastService.error(error.error.message);
        });
    }

    
  }

}
