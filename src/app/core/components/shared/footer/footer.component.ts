import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public year: number;

  /* Social medias. */
  public fbURL: string;
  public igURL: string;
  public ytURL: string;
  public liURL: string;
  public email: string;

  constructor() { }

  ngOnInit() {
     /* Init copyright year. */
     this.year = (new Date()).getFullYear();

     /* Init social medias URL. */
     this.fbURL = Constant.FB_URL;
     this.igURL = Constant.IG_URL;
     this.ytURL = Constant.YT_URL;
     this.liURL = Constant.LI_URL;
     this.email = Constant.EMAIL;
  }

}
