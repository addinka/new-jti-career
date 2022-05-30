import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserService } from 'src/app/core/services/user.service';
import { HEALTH_TYPES } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-view-onboardform',
  templateUrl: './view-onboardform.component.html',
  styleUrls: ['../view-blueform/view-blueform.component.scss']
})
export class ViewOnboardformComponent implements OnInit {

  private onboardingFormId = this.route.snapshot.params['id'];
  private token = localStorage.getItem('token');

  public onboardform: any;
  public userId: any;
  public userData: any

  public healthTypes = HEALTH_TYPES;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private toastService: ToastService
) { }

  ngOnInit() {
    if (this.onboardingFormId) this.getOnboardform();
  }

  getOnboardform(){
    this.userService.getOnBoardingForm(this.onboardingFormId, this.token).subscribe(
      response=>{
        this.onboardform = response.docs[0] || {};
        this.userId = this.onboardform.userID;
        if (this.userId) {
          this.getUser()
        }
      },
      error=>{
        this.toastService.error("Cannot get user onboardform")
      }
    )
    // this.onboardform = {};
  }

  getUser() {
    this.userService.getUserById(this.userId).subscribe(
      response=>{
        this.userData = response;

        this.userService.getProfilePic(this.userId+ '?cacheBreak=' + new Date().getTime()).subscribe(
          response => {
            this.picChangeUser(this.blobToFile(response, 'profPic'));
          },error =>{
              // console.log(error);
          });
      },
      error=>{
        this.toastService.error("Failed Get User")
      })
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
      this.userData.profpic = reader.result;
    };
  
    reader.readAsDataURL(thePicture);
  }

  findPrice(healthInsuranceType) {
    const healthType = this.healthTypes.find(ht=>ht.name===healthInsuranceType);
    return healthType && healthType.price;
  }
}
