import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Arrays } from 'src/app/core/utils/constant';
import { MatDatepickerInputEvent, MatInput } from '@angular/material';
import { JobService } from 'src/app/core/services/job.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';
import { RichTextEditor, PasteCleanup, ToolbarService, LinkService, ImageService,
  HtmlEditorService, TableService, ToolbarType } from '@syncfusion/ej2-angular-richtexteditor'
RichTextEditor.Inject(PasteCleanup);

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss'],
  providers: [  ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})

export class CreateJobComponent implements OnInit {
  @ViewChild('onBoardStartInput', {
    read: MatInput
  }) onBoardStartInput: MatInput;

  public createJobForm: FormGroup;

  public minLiveDate = new Date();
  public minEndDate = new Date(new Date().setDate(new Date().getDate() + 1));
  public maxEndDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  public minOnBoardDate = new Date(new Date().setDate(new Date().getDate() + 1));

  public defaultEndDate = new Date(new Date().setMonth(new Date().getMonth() + 2));
  public defaultOnBoardDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

  public catItems = [];
  public locItems = [];
  public lanItems = [];
  public expItems = [];
  public eduItems = [];
  public empItems = [];

  public hours = [];
  public selectedLiveHour: number;
  public selectedEndHour: number;

  public isFlexible = false;
  public isImmediately = false;
  public currentURL = this.router.url;
  public jobID = this.route.snapshot.params['id'];
  public otherLocation: any;

  public languages = [];

  public tools: object = {
    enable: true,
    type: ToolbarType.MultiRow,
    items: [
      'Bold', 'Italic', 'Underline', '|',
      'FontSize', '|', 'OrderedList', 'UnorderedList', '|',
      'LowerCase', 'UpperCase', '|',
      'Alignments', 'Indent', 'Outdent', '|', 'ClearFormat']
   };

   public cleanup: object = {
     keepFormat: true,
     plainText: false,
   };

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router,
    public route: ActivatedRoute,
    private toastService: ToastService) {
    this.createJobForm = this.fb.group({
      id: [this.jobID, Validators.required],
      title: ['', Validators.required],
      categories: ['', Validators.required],
      location: ['', Validators.required],
      otherLocation:[''],
      onBoardStart: [this.defaultOnBoardDate, Validators.required],
      languageTemp: ['', Validators.required],
      languageOther: [''],
      language: [''],
      experience: ['', Validators.required],
      education: ['', Validators.required],
      employment: ['', Validators.required],
      jobDesc: [''],
      requirement: [''],
      benefits: [''],
      liveStart: [this.minLiveDate, Validators.required],
      liveEnd: [this.defaultEndDate, Validators.required],
    });
  }

  ngOnInit() {
    this.catItems = Arrays.CATEGORY;
    this.locItems = Arrays.LOCATION;
    this.lanItems = Arrays.LANGUAGE;
    this.expItems = Arrays.EXPERIENCE;
    this.eduItems = Arrays.EDUCATION;
    this.empItems = Arrays.EMPLOYMENT;

    this.setLiveEndHour();
    if (this.currentURL === ('/admin/jobs-ads/edit/' + this.jobID)) {
      this.onGetJobData();
    } else {
      this.createJobForm.removeControl('id');
    }
  }

  resetOnBoard() {
    this.onBoardStartInput.value = '';
  }

  setDefaultOnBoard() {
    this.createJobForm.controls['onBoardStart'].setValue(this.defaultOnBoardDate);
  }

  setLiveEndHour() {
    const today = new Date();
    const currentHour = today.getHours();

    for (let index = 0; index < 24; index++) {
      const len = index.toString().length;
      let viewValue: string;

      if (len === 1) {
        viewValue = '0' + index + '.00';
      } else {
        viewValue = index + '.00';
      }

      this.hours.push(
        { value: index, viewValue: viewValue }
      );
    }

    this.selectedLiveHour = currentHour + 1;
    if (this.selectedLiveHour === 24) {
      this.selectedLiveHour = 0;
    }
    this.selectedEndHour = 23;
  }

  onPreview() {
    const value = this.createJobForm.value;

    let onBoard = value.onBoardStart;
    if (this.isFlexible) {
      onBoard = 'F';
    }

    if (this.isImmediately) {
      onBoard = 'I';
    }

    if(value.location === 'Other'){
      value.location = value.otherLocation;
      delete value.otherLocation;
    }
    const data = {
      title: value.title,
      categories: value.categories,
      location: value.location,
      onBoardStart: onBoard,
      language: this.getLanguage(),
      experience: value.experience,
      education: value.education,
      employment: value.employment,
      jobDesc: value.jobDesc,
      requirement: value.requirement,
      benefits: value.benefits
    }
    localStorage.setItem("previewData", JSON.stringify(data));
    window.open('/admin/jobs-ads/preview');
    // window.open(
    //   '/admin/jobs-ads/preview?' +
    //   'title=' + value.title +
    //   '&category=' + value.categories.replace('&', '%26') +
    //   '&location=' + value.location +
    //   '&onBoard=' + onBoard +
    //   '&language=' + this.getLanguage() +
    //   '&experience=' + value.experience +
    //   '&education=' + value.education +
    //   '&employment=' + value.employment +
    //   '&description=' + value.jobDesc +
    //   '&requirement=' + value.requirement +
    //   '&benefit=' + value.benefits);
  }

  onSubmit() {
    const liveStart = this.createJobForm.get('liveStart').value;
    const liveEnd = this.createJobForm.get('liveEnd').value;
    const onBoardStart = this.createJobForm.get('onBoardStart').value;
    const language = this.getLanguage();

    liveStart.setHours(this.selectedLiveHour, 0, 0, 0);
    liveEnd.setHours(this.selectedEndHour, 0, 0, 0);
    onBoardStart.setHours(0, 0, 0, 0);

    this.createJobForm.removeControl('languageTemp');
    this.createJobForm.removeControl('languageOther');
    this.createJobForm.patchValue(
      {
        language: language,
        liveEnd: liveEnd,
        liveStart: liveStart,
        onBoardStart: onBoardStart
      }
    );

    if (this.isFlexible) {
      this.createJobForm.patchValue({ onBoardStart: 'F' });
    } else if (this.isImmediately) {
      this.createJobForm.patchValue({ onBoardStart: 'I' });
    }

    if(this.createJobForm.value.location === 'Other'){
      this.createJobForm.value.location = this.createJobForm.value.otherLocation;
      delete this.createJobForm.value.otherLocation;
    } else{
      delete this.createJobForm.value.otherLocation;
    }

    if (this.currentURL === '/admin/jobs-ads/create') {
      this.onCreateJob(this.createJobForm.value);
    } else {
      this.onEditJob(this.createJobForm.value);
    }
  }

  getLanguage(): string {
    const languageTemp = this.createJobForm.get('languageTemp').value;
    const languageOther = this.createJobForm.get('languageOther').value;
    let language = '';

    languageTemp.forEach((element: any, index: number) => {
      if (index === languageTemp.length - 1) {
        language += element;
      } else {
        language += element + ',';
      }
    });
    // .replace('Other', languageOther)
    return language;
  }

  selectLiveSchedule(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    const nextSelectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

    this.defaultEndDate.setHours(0, 0, 0, 0);
    this.defaultOnBoardDate.setHours(0, 0, 0, 0);

    if (+selectedDate >= +this.defaultEndDate) {
      this.defaultEndDate = nextSelectedDate;
      this.createJobForm.patchValue({ liveEnd: this.defaultEndDate });
    }

    if (+selectedDate >= +this.defaultOnBoardDate) {
      this.defaultOnBoardDate = nextSelectedDate;
      this.createJobForm.patchValue({ onBoardStart: this.defaultOnBoardDate });
    }

    this.createJobForm.patchValue({ liveStart: selectedDate });

    this.minOnBoardDate = nextSelectedDate;
    this.minEndDate = nextSelectedDate;
  }

  selectEndSchedule(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    this.createJobForm.patchValue({ liveEnd: selectedDate });
  }

  selectOnBoardSchedule(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    this.createJobForm.patchValue({ onBoardStart: selectedDate });
  }

  onCreateJob(data: any) {
    this.jobService.createJob(data)
      .subscribe(response => {
        this.toastService.success('Job successfully created');
        this.router.navigate(['/admin/jobs-ads']);
      });
  }

  onEditJob(data: any) {
    this.jobService.editJob(data)
      .subscribe(
        _ => {
          this.toastService.success('Job successfully updated');
          this.router.navigate(['/admin/jobs-ads']);
        },
        error => {
          this.toastService.error(error.error.message);
        }
      );
  }

  onGetJobData() {
    this.jobService.getJobDetail(this.jobID).toPromise()
      .then(
        data => {
          // console.log('data', data);
          this.minLiveDate = data.liveStart;
          if (data.onBoardStart === 'F') {
            this.isFlexible = true;
            this.createJobForm.controls['onBoardStart'].setValue(this.defaultOnBoardDate);
          } else if (data.onBoardStart === 'I') {
            this.isImmediately = true;
            this.createJobForm.controls['onBoardStart'].setValue(this.defaultOnBoardDate);
          } else {
            this.createJobForm.controls['onBoardStart'].setValue(new Date(data.onBoardStart));
            this.minOnBoardDate = new Date(data.onBoardStart);
          }

          if(data.location !== 'Jakarta' && data.location !== 'Bandung' && data.location !== 'Surabaya' && data.location !== 'Medan'){
            this.createJobForm.controls['location'].setValue('Other');
            this.createJobForm.controls['otherLocation'].setValue(data['location']);
          } else{
            this.createJobForm.controls['location'].setValue(data['location']);
          }

          const language = data.language;
          const languageTemp = language.split(', ');
          this.createJobForm.controls['title'].setValue(data['title']);
          this.createJobForm.controls['categories'].setValue(data['categories']);
          this.createJobForm.controls['languageTemp'].setValue(languageTemp);
          this.createJobForm.controls['experience'].setValue(data['experience']);
          this.createJobForm.controls['education'].setValue(data['education']);
          this.createJobForm.controls['employment'].setValue(data['employment']);
          this.createJobForm.controls['jobDesc'].setValue(data['jobDesc']);
          this.createJobForm.controls['requirement'].setValue(data['requirement']);
          this.createJobForm.controls['benefits'].setValue(data['benefits']);
          this.createJobForm.controls['liveStart'].setValue(new Date(data.liveStart));
          this.createJobForm.controls['liveEnd'].setValue(new Date(data.liveEnd));

          this.minEndDate = new Date(data.liveEnd);
        }
      );
  }

  selectLanguage(event: any) {
    this.languages = event.value;
    if (this.languages.includes('Other')) {
      this.createJobForm.controls['languageOther'].setValidators([Validators.required]);
    } else {
      this.createJobForm.controls['languageOther'].clearValidators();
      this.createJobForm.controls['languageOther'].updateValueAndValidity();
    }
  }
}
