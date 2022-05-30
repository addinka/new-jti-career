import { TESTIMONY_URL } from '../../../utils/constant';
import { Component, Inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { HotRoles } from 'src/app/core/models/hot-roles.model';
import { Testimonial } from 'src/app/core/models/testimonial.model';

import { AuthService } from 'src/app/core/services/auth.service';
import { JobService } from 'src/app/core/services/job.service';
import { TestimonyService } from 'src/app/core/services/testimony.service';
import { WINDOW } from 'src/app/core/services/window.service';

import { LoginComponent } from 'src/app/core/components/dialogs/login/login.component';
import { ResetPasswordComponent } from 'src/app/core/components/dialogs/reset-password/reset-password.component';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('animationDotBig', [
      state('show', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      state('hide', style({
        opacity: 0,
        transform: 'translateX(-100%)'
      })),
      transition('show => hide', animate('700ms 0.5s ease-out')),
      transition('hide => show', animate('700ms 0.5s ease-in'))
    ]),
    trigger('animationDotSmall', [
      state('show', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      state('hide', style({
        opacity: 0,
        transform: 'translateX(-1000%)'
      })),
      transition('show => hide', animate('700ms ease-out')),
      transition('hide => show', animate('700ms ease-in'))
    ]),
    trigger('animationDotBigInverse', [
      state('show', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      state('hide', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      transition('show => hide', animate('700ms 0.5s ease-out')),
      transition('hide => show', animate('700ms 0.5s ease-in'))
    ]),
    trigger('animationDotSmallInverse', [
      state('show', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      state('hide', style({
        opacity: 0,
        transform: 'translateX(1000%)'
      })),
      transition('show => hide', animate('700ms ease-out')),
      transition('hide => show', animate('700ms ease-in'))
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  public currentToken: String;
  public testimonyURL: string;

  testimonials: Testimonial[];
  hotRoles: HotRoles[];

  public dotPurpleState = 'hide';
  public dotLightBlueState = 'hide';
  public dotYellowState = 'hide';
  public dotBlueState = 'show';

  private eventOptions: boolean | { capture?: boolean, passive?: boolean };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private authService: AuthService,
    private dialog: DialogService,
    private jobService: JobService,
    private testimonyService: TestimonyService,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.testimonials = [];
    this.hotRoles = [];

    this.authService.getCurrentToken()
      .subscribe(
        token => {
          // console.log('current token: ', token);
          this.currentToken = token;
        }
      );
  }

  ngOnInit() {
    // Scroll to top.
    this.document.body.scrollTop = 0;

    this.eventOptions = true;
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, <any>this.eventOptions);
    });

    // Get hot roles job.
    this.onGetHotRolesJob();

    // Get testimony.
    this.onGetTestimony();

    this.currentToken = localStorage.getItem('token');
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll, <any>this.eventOptions);
  }

  onScroll = (): void => {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

    if (offset > 0) {
    }

    if (offset > 500) {
      this.ngZone.run(() => {
        this.changeState('purple');
      });
    }

    if (offset > 1000) {
      this.ngZone.run(() => {
        this.changeState('lightBlue');
      });
    }

    if (offset > 1500) {
      this.ngZone.run(() => {
        this.changeState('yellow');
      });
    }

    if (offset > 2000) {
      this.ngZone.run(() => {
        this.changeState('blue');
      });
    }
  }

  changeState(color: string) {
    switch (color) {
      case 'purple':
        this.dotPurpleState = 'show';
        break;
      case 'lightBlue':
        this.dotLightBlueState = 'show';
        break;
      case 'yellow':
        this.dotYellowState = 'show';
        break;
      case 'blue':
        this.dotBlueState = 'show';
        break;
      default:
        break;
    }
  }

  onGetHotRolesJob() {
    this.jobService.getHotRolesJobs()
      .subscribe(hotRoles => {
        // console.log(hotRoles);
        for (let index = 0; index < hotRoles.rows.length; index++) {
          this.hotRoles.push(new HotRoles(hotRoles.rows[index].value.jobID, hotRoles.rows[index].value.title, hotRoles.rows[index].value.hotRoleIndex));
        }
        this.hotRoles.sort((a, b) => a.index < b.index ? -1 : a.index > b.index ? 1 : 0);
        // console.log(this.hotRoles);
      });
  }
/*
  getreview() {
    this.testimonyService.getTestimony(this.offset).subscribe(res => {
      this.testimony = [...this.testimony, ...res];
 
    });

  }
*/
  onGetTestimony() {
    this.testimonyService.getTestimony('4')
      .subscribe(testimony => {
        for (let index = 0; index < 4; index++) {
          if(testimony.data[index] !== undefined)
          {
            const PROFILE_ID: string = testimony.data[index]._id;
            this.testimonyURL = TESTIMONY_URL + PROFILE_ID;

            this.testimonials.push(new Testimonial(this.testimonyURL,
              testimony.data[index].testimonyContent,
              testimony.data[index].applicantName,
              testimony.data[index].role));
          }
        }
      });
  }

  onScrollTop() {
    document.getElementById('top').scrollIntoView({
      behavior: 'smooth'
    });
  }

  onSearchFromHeader(search: string) {
    if (search === '') {
      this.jobService.searchFromHeader = false;
      this.router.navigate(['/jobs']);
    } else {
      this.jobService.searchFromHeader = false;
      this.router.navigate(['/jobs'], { queryParams: { search: search } });
    }
  }

  openLogin() {
    const dialogRef = this.dialog.getLoginDialog();

    dialogRef.afterClosed().subscribe(result => {
      if (result.token) {
        if (result.role === 'User') {
          this.router.navigate(['/profile']);
          // location.reload();
        } else {
          this.router.navigate(['/admin/dashboard']);
        }
      }
    });
  }

  openProfile() {
    this.router.navigate(['/profile']);
  }

  openResetPassword() {
    const dialogRef = this.dialog.getResetPasswordDialog();

    dialogRef.afterClosed().subscribe(result => {
      if (result.next === 'login') {
        this.openLogin();
      } else if (result.next) {
        this.authService.requestResetPassword(result.data).subscribe(
          data => {
            // console.log('Successfully request reset password!');
          },
          err => {
            // console.log('error', err);
          }
        );
      }
    });
  }

  onJobDetail(id: string) {
    window.open('/jobs/' + id);
  }
}
