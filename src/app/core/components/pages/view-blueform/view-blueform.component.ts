import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-view-blueform',
  templateUrl: './view-blueform.component.html',
  styleUrls: ['./view-blueform.component.scss']
})
export class ViewBlueformComponent implements OnInit {

  private userId = this.route.snapshot.params['id'];
  // private token = localStorage.getItem('token');

  public blueform: any;
  public userData: any

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { 

  }

  ngOnInit() {
    if (this.userId) this.getBlueform();
  }
  
  getBlueform() {
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
      }
    );

    this.userService.getBlueFormByUserId(this.userId).subscribe(
      response=>{
        this.blueform = response.docs && response.docs[0];
      },
      error=>{
        this.toastService.error("Cannot get user blueform")
      }
    )
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
}
