import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { LoginComponent } from '../../dialogs/login/login.component';

import { JobService } from 'src/app/core/services/job.service';
import { NotificationService } from 'src/app/core/services/notification.service';

import { Constant, BASE_URL } from 'src/app/core/utils/constant';
import { AuthService } from 'src/app/core/services/auth.service';

import { Notification } from 'src/app/core/models/notification.model';
import { ToastService } from 'src/app/core/services/toast.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public currentToken: String;
  public currentRole: String;
  public currentName: String;
  public currentEmail: String = localStorage.getItem('id');
  public currentProfilePicture: String = '../../../../../assets/images/user_profpic.png';

  public mainRoute: Boolean;
  public getImageURL: any;
  public getRecruiterImageURL:any;

  public unreadNotification: boolean;

  public notifications: any[];

  constructor(
    private authService: AuthService,
    private dialog: DialogService,
    private jobService: JobService,
    private notificationService: NotificationService,
    private router: Router,
    private toastService: ToastService,
    private userService: UserService,
  ) {
    this.notifications = [];
    this.getRecruiterImageURL = BASE_URL;
    
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.currentProfilePicture = localStorage.getItem('profilePicture') + '?cacheBreak=' + new Date().getTime();
      }
    });

    this.authService.getCurrentToken()
      .subscribe(
        token => {
          this.currentToken = token;
        }
      );

    this.authService.getCurrentRole()
      .subscribe(
        role => {
          this.currentRole = role;
        }
      );

    this.authService.getCurrentName()
      .subscribe(
        name => {
          this.currentName = name;
        }
      );

    this.authService.getCurrentProfilePicture()
      .subscribe(
        profilePicture => {
          this.currentProfilePicture = profilePicture;
        }
    );
     
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (url.includes('home')) {
          document.getElementById('navbar-color').style.backgroundColor = '#00D6EA';
          this.mainRoute = true;
        } else {
          document.getElementById('navbar-color').style.backgroundColor = '#4273B3';
          this.mainRoute = false;
        }
      }
    });

    this.currentToken = localStorage.getItem('token');
    this.currentRole = localStorage.getItem('role');
    this.currentName = localStorage.getItem('name');

    // force reload image:
    this.currentProfilePicture = localStorage.getItem('profilePicture');
    if(this.currentRole !== 'Recruiter'){
      this.userService.getProfilePic(this.currentEmail+ '?cacheBreak=' + new Date().getTime()).subscribe(
        response => {
          this.picChangeAlumni(this.blobToFile(response, 'profPic'));
        },error =>{
            // console.log(error);
        });
    }

    // console.log(this.currentToken, this.currentRole);

    if (this.currentToken) {
      this.getNotifications();
    }
  }

  openDialogLogin() {
    const dialogRef = this.dialog.getLoginDialog();

    dialogRef.afterClosed().subscribe(result => {
      if (result.token) {
        this.getNotifications();
        if (result.role === 'User') {
          this.router.navigate(['/profile']);
          // location.reload();
        } else {
          this.router.navigate(['/admin/dashboard']);
        }
      }
    });
  }

  openDialogInviteApply() {
    this.dialog.getInviteExternal();
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
      this.getImageURL = reader.result;
    };

    reader.readAsDataURL(thePicture);
  }

  doLogOut() {
    this.notifications = [];
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  onNavigateToProfile() {
    if (this.currentToken === Constant.TOKEN_DUMMY) {
      // console.log('Not Available.');
    } else {
      this.router.navigateByUrl('/profile');
    }
  }

  onNavigateToHome() {
    if (this.currentRole === 'User') {
      this.router.navigateByUrl('/home');
    } else {
      this.router.navigateByUrl('/admin/dashboard');
    }
  }

  onSearchFromHeader(condition: boolean) {
    if (this.currentRole === 'User' || this.currentRole === null) {
      if (condition) {
        this.jobService.searchFromHeader = true;
      } else {
        this.jobService.searchFromHeader = false;
      }
      this.router.navigateByUrl('/jobs');
    } else {
      this.toastService.info('Please try again later');
    }
  }

  getNotifications() {
    this.unreadNotification = false;
    this.notificationService.getUserNotifications().subscribe(notes => {
      notes.docs.forEach(element => {
        if (!element.read) {
          this.unreadNotification = true;
        }
        this.notifications.push(new Notification(element.forwardLink, element.message, element.timestamp, element.read, element._id)
        );
      });
    });
  }

  onClickNotification(index: number) {
    const not = this.notifications[index];
    this.router.navigateByUrl(not.forwardLink);
    if (!not.read) {
      this.notificationService.readNotification(not.id)
        .subscribe(
          some => {
            not.read = true;

            for (let index = 0; index < this.notifications.length; index++) {
              const element = this.notifications[index];
              let flag = false;
              if (!element.read) {
                flag = true;
              } else if (index === this.notifications.length - 1 && element.read) {
                this.unreadNotification = false;
              }

              if (flag) {
                break;
              }
            }
          }
        );


    }
  }

  getImage(): String {
    return this.unreadNotification ?
      '../../../../../assets/images/ic_notification_on.svg' :
      '../../../../../assets/images/ic_notification_off.svg';
  }
}
