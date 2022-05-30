import { Component, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TestimonyService } from 'src/app/core/services/testimony.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { EventEmitterService } from 'src/app/core/services/event-emitter.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ProfpicPopUpComponent } from 'src/app/core/components/dialogs/profpic-pop-up/profpic-pop-up.component';

declare var jQuery:any;

@Component({
  selector: 'app-change-home-testimonies',
  templateUrl: './change-home-testimonies.component.html',
  styleUrls: ['./change-home-testimonies.component.scss']
})

export class ChangeHomeTestimoniesComponent implements OnInit {

  @ViewChild('myModal') myModal:ElementRef;
  
  testimonies = [];
  mode = ['view','view','view','view'];
  picFiles = [{},{},{},{}];
  currPicIndex = -1;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private testimonyService: TestimonyService,
    private toastService: ToastService,
    private eventEmitterService: EventEmitterService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getAllTestimonies();

    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeOverviewComponentFunction.subscribe((param) => { 
        this.fileChangeEvent(param);   
      });    
    }  
  }

  getAllTestimonies(){
    this.testimonyService.getTestimony('')
      .subscribe(response => {
        // console.log(response);
        this.testimonies = response.data;
        if (this.testimonies.length < 4) {
          for (let i = this.testimonies.length; i < 4; i++) {
            this.testimonies[i] = [];
            this.testimonies[i]._id = null;
            this.testimonies[i].applicantName = "";
            this.testimonies[i].role = "";
            this.testimonies[i].testimonyContent = "";
            this.testimonies[i].testimonyDisplayPic = "";
            this.testimonies[i].testimonyIndex = i;
          }
        }
        this.testimonies.sort((a, b) => (a.testimonyIndex > b.testimonyIndex) ? 1 : -1);
        for (let i = 0; i < this.testimonies.length; i++) {
          this.getTestimonyPic(this.testimonies[i]._id, i);
        }
      });
  }

  getTestimonyPic(_id, index){
    this.testimonyService.getTestimonyPic(_id).subscribe(response => {
      const unsafeImageUrl = URL.createObjectURL(response);
      const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      this.picFiles[index] = response;
      this.testimonies[index].testimonyDisplayPic = imageUrl;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ProfpicPopUpComponent, {
      height: '400px',
      width: '500px'
    });

    dialogRef.afterClosed()
      .subscribe(
        result => {
          // console.log(result);
        });
  }

  setIndex(i) {
    this.currPicIndex = i;
  }

  swap(i) {
    if(this.testimonies[i]._id === null || this.testimonies[i+1]._id === null) {
      this.toastService.error('Cannot swap empty testimonies');
    } else {

      // jQuery(this.myModal.nativeElement).modal('hide');

      let temp1 = this.testimonies[i];
      let temp2 = this.testimonies[i+1];
      let tempPic1 = this.picFiles[i];
      let tempPic2 = this.picFiles[i+1];
      this.testimonies[i] = temp2;
      this.testimonies[i+1] = temp1;
      this.picFiles[i] = tempPic2;
      this.picFiles[i+1] = tempPic1;

      let testimonyData = 
      {
        'id': temp1._id,
        'applicantName': temp1.applicantName,
        'testimonyContent': temp1.testimonyContent,
        'role': temp1.role,
        'testimonyIndex': temp2.testimonyIndex,
        'file': tempPic1
      };

      let testimonyData2 = 
      {
        'id': temp2._id,
        'applicantName': temp2.applicantName,
        'testimonyContent': temp2.testimonyContent,
        'role': temp2.role,
        'testimonyIndex': temp1.testimonyIndex,
        'file': tempPic2
      };

        this.testimonyService.updateTestimony(testimonyData)
        .subscribe(response => {
          // console.log(response);
        },
        error => {
          this.toastService.error('Something went wrong');
          // console.log(error);
        });

        this.testimonyService.updateTestimony(testimonyData2)
        .subscribe(response => {
          this.toastService.success('Testimony updated');
          // console.log(response);
          // let a = document.getElementsByClassName("modal-backdrop fade show");
          // // console.log(a);
          // let b = document.getElementsByClassName("modal fade");
          // // console.log(b[0]);
          // //a[0].classList.remove("show");
          // b[0].classList.remove("show");
          // b[0].removeAttribute("aria-modal");
          // b[0].removeAttribute("style");
          // a[0].remove();
        },
        error => {
          this.toastService.error('Something went wrong');
          // console.log(error);
        });
    }
  }

  update(testimonyData) {
    // console.log(testimonyData);
    this.testimonyService.updateTestimony(testimonyData)
      .subscribe(response => {
        this.toastService.success('Testimony updated');
        // console.log(response);
      },
      error => {
        this.toastService.error('Something went wrong');
        // console.log(error);
      });
  }

  fileChangeEvent(file: any): void {
    const unsafeImageUrl = URL.createObjectURL(file);
    const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
    this.picFiles[this.currPicIndex] = file;
    this.testimonies[this.currPicIndex].testimonyDisplayPic = imageUrl;
  }

  createTestimony(i) {
    const applicantNameValue = (<HTMLInputElement>document.getElementById('applicantName'+i)).value;
    const roleValue = (<HTMLInputElement>document.getElementById('role'+i)).value;
    const testimonyContentValue = (<HTMLInputElement>document.getElementById('testimonyContent'+i)).value;
    let file = {};

    if(this.picFiles[i] !== {}) {
      file = this.picFiles[i];
    }
    
    let testimonyData = 
    {
      'applicantName': applicantNameValue,
      'testimonyContent': testimonyContentValue,
      'role': roleValue,
      'testimonyIndex': i,
      'file': file
    };

    // console.log(testimonyData);

    if(testimonyData.file['size'] === undefined){
      this.toastService.error('Please Fill the applicant profile picture.');
    } else if(testimonyData.testimonyContent === ''){
      this.toastService.error('Please Fill the applicant testimonial description.');
    } else if(testimonyData.applicantName === ''){
      this.toastService.error('Please Fill the applicant name.');
    }else if(testimonyData.role === ''){
      this.toastService.error('Please Fill the applicant role.');
    } else {
      this.testimonyService.createTestimony(testimonyData)
      .subscribe(response => {
        // // console.log(response);
        this.testimonies[i] = response.data;
        this.getTestimonyPic(this.testimonies[i]._id, i);
        this.toastService.success('Testimony created.');
      },
      error => {
        this.toastService.error('Something went wrong.');
        // console.log(error);
      });
    this.changeMode(i);
    }
  }

  updateTestimony(i) {
    const applicantNameValue = (<HTMLInputElement>document.getElementById('applicantName'+i)).value;
    const roleValue = (<HTMLInputElement>document.getElementById('role'+i)).value;
    const testimonyContentValue = (<HTMLInputElement>document.getElementById('testimonyContent'+i)).value;
    let file = {};

    if(this.picFiles[i] !== {}) {
      file = this.picFiles[i];
    }
    
    let testimonyData = 
    {
      'id': this.testimonies[i]._id,
      'applicantName': applicantNameValue,
      'testimonyContent': testimonyContentValue,
      'role': roleValue,
      'testimonyIndex': i,
      'file': file
    };

    this.update(testimonyData);
    this.testimonies[i].applicantName = applicantNameValue;
    this.testimonies[i].role = roleValue;
    this.testimonies[i].testimonyContent = testimonyContentValue;
    this.changeMode(i);
  }

  deleteTestimony(i) {
    this.testimonyService.deleteTestimony(this.testimonies[i]._id)
      .subscribe(response => {
        // console.log(response);
        this.testimonies[i]._id = null;
        this.testimonies[i].applicantName = "";
        this.testimonies[i].role = "";
        this.testimonies[i].testimonyContent = "";
        this.testimonies[i].testimonyDisplayPic = "";
        this.toastService.success('Testimony deleted');
      },
      error => {
        this.toastService.error('Something went wrong');
        // console.log(error);
      });
    this.changeMode(i);
  }

  changeMode(i) {
    if(this.mode[i] === 'view') {
      this.mode[i] = 'edit';
    }
    else {
      this.mode[i] = 'view';
    }
  }
}