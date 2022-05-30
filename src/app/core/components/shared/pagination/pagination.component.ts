import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ApplicationService } from 'src/app/core/services/application.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() pagesCount: number;
  @Input() page: number;
  @Output() pagesJob = new EventEmitter;

  // public page: number;
  public pages: number[];
  public morePages: number[];
  public isLeft: boolean;
  public isRight: boolean;

  public firstShowPage = 0;
  public lastShowPage = 5;

  constructor(private applicationService: ApplicationService) { }

  ngOnChanges() {
    let flag = 0;

    // Reinitialize page.
    this.page = 1;

    // Reinitialize pages and more pages, every changes.
    this.pages = [];
    this.morePages = [];

    // Reinitialize first and last show page.
    this.firstShowPage = 0;
    this.lastShowPage = 5;
    // console.log(this.pagesCount);
    if (this.pagesCount < 4) {
      // Trigger when pages count less than 4.
      do {
        this.pages.push(flag + 1);
        flag++;
      } while (flag < this.pagesCount);
    } else {
      // Trigger when pages count more than 4,
      // and set pages & start flag.
      this.pages = [1, 2, 3, 4];
      flag = 4;

      // Loop for more pages.
      do {
        this.morePages.push(flag + 1);
        flag++;
      } while (flag < this.pagesCount);
    }

    if (this.pages.length === 1) {
      // Below function will trigger when page only 1,
      // Disable right click.
      this.isRight = false;
    } else {
      // Able right click.
      this.isRight = true;
    }

    // Disable left click.
    this.isLeft = false;
  }

  ngOnInit() {
    // Set page to 1.
    this.page = 1;

    // Disable left click.
    this.isLeft = false;

    // Disable right click.
    this.isRight = false;

    this.applicationService.onInitFilterEmitter().subscribe(data => {
      this.ngOnInit();
    })
  }

  onPrevious() {
    if (this.isLeft) {
      // Minus page by 1.
      this.page -= 1;

      // Get job by selected page.
      this.pagesJob.emit(this.page);

      // Able right click.
      this.isRight = true;

      // Below function will trigger when first show page not 1,
      // ex: [2, 3, 4 ,5]; [6, 7, 8, 9]
      // 2 and 6 is not 1.
      if (this.page === this.firstShowPage - 1) {
        // Minus last show page & first show page by 1.
        // ex: [2, 3, 4, 5] to [1, 2, 3, 4]
        // 2 to 1 & 5 to 4
        this.lastShowPage -= 1;
        this.firstShowPage -= 1;

        // (*) Add pages & more pages at first element.
        this.pages.unshift(this.pages[0] - 1);
        this.morePages.unshift(this.pages[3] + 1);

        // Remove pages at last element,
        // this function must be called after function above (*).
        this.pages.pop();

        // Check if first show pages is 1,
        // then disable left click.
        if (this.firstShowPage === 1) {
          this.isLeft = false;
        }
      } else if (this.page === 1) {
        // This function only trigger first run,
        // with pages max 4,
        // ex: [1, 2, 3, 4]; [1, 2]
        this.isLeft = false;
      }
    }
  }

  onNext() {
    if (this.isRight) {
      // Plus pages by 1.
      this.page += 1;

      // Get job by selected page.
      this.pagesJob.emit(this.page);

      // Able left click.
      this.isLeft = true;

      if (this.page === this.lastShowPage && this.page <= this.pagesCount) {
        // Plus last show page & first show page by 1.
        // ex: [2, 3, 4, 5] to [1, 2, 3, 4]
        // 5 to 6 & 4 to 5
        this.lastShowPage += 1;
        this.firstShowPage = this.pages[0] + 1;

        // Remove pages at first element.
        this.pages.shift();

        // (*) Add new pages at last element.
        this.pages.push(this.morePages[0]);

        // Remove more pages at first element,
        // this function must be called after function above (*).
        this.morePages.shift();

        // Check if last show pages is last page,
        // then disable right click.
        if (this.lastShowPage === this.pagesCount + 1) {
          this.isRight = false;
        }
      } else if (this.page === this.pagesCount) {
        // This function only trigger first run,
        // with pages max 4,
        // ex: [1, 2, 3, 4]; [1, 2]
        this.isRight = false;
      }
    }
  }

  onPage(page: number) {
    // Set selected page.
    this.page = page;

    // Get job by selected page.
    this.pagesJob.emit(page);

    if (page === 1 && this.pagesCount === 1) {
      // If page is 1 and it is last page,
      // disable left and right click.
      this.isLeft = false;
      this.isRight = false;
    } else if (page === 1 && this.pagesCount !== 1) {
      // If page is 1,
      // disable left, able right click.
      this.isLeft = false;
      this.isRight = true;
    } else if (page === this.pagesCount) {
      // If page is last page,
      // disable right, able left click.
      this.isLeft = true;
      this.isRight = false;
    } else {
      // If page is between first and last page.
      this.isLeft = true;
      this.isRight = true;
    }
  }
}
