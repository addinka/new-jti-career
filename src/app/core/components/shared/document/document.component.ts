
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnChanges {

  @Input() applicantID?: string;
  @Input() applyForm: boolean;
  @Input() document: any;
  @Input() editable: any;
  @Input() saveChanges: any;
  @Input() index: number;
  @Input() onboardForm: any;
  public tempFile: File = null;

  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: any): void {
    if (this.saveChanges && !this.applyForm) {
      if (this.document.mark.delete) {
        this.userService.deleteDocument(this.document.type).subscribe(
          data => {
            // console.log('data ', data);
          },
          err => {
            // console.log('Failed delete document: ', this.document.type, '\nError:', err);
          }
        );
        this.document.file = null;
        this.document.mark.delete = false;
      }
      if (this.document.mark.reupload) {
        // Set file to upload then remove from tempFile
        this.document.file = this.tempFile;
        this.tempFile = null;

        this.userService.uploadDocument(this.document.type, this.document.file).subscribe(
          data => {
            this.document.mark.newUpload = true;
            // console.log('Document ', this.document.type, ' successfully uploaded : ', data);
          },
          err => {
            // console.log('Failed uploaded document: ', this.document.type, '\nError:', err);
          }
        );
        this.document.mark.reupload = false;
      }
    } else {
      this.document.mark.delete = false;
      this.document.mark.reupload = false;
    }
  }

  markToReupload() {
    // Document is marked to reupload, then remove mark and remove temporary file
    if (this.document.mark.reupload) {
      // this.document.mark.reupload = false;
      // this.tempFile = null;
    } else {
      this.chooseFile('inputReupload' + this.document.type);
    }
  }

  markToDelete() {
    this.document.mark.delete = !this.document.mark.delete;
  }

  getReuploadIcon() {
    if (this.document.mark.reupload) {
      return 'assets/images/ic_reupload_blue.svg';
    } else {
      return 'assets/images/ic_reupload.svg';
    }
  }

  getFolderIcon() {
    if (this.document.mark.newUpload) {
      return 'assets/images/ic_folder_new.svg';
    } else {
      return 'assets/images/ic_folder.svg';
    }
  }

  getDeleteIcon() {
    if (this.document.mark.delete) {
      return 'assets/images/ic_close_red.svg';
    } else {
      return 'assets/images/ic_close_grey.svg';
    }
  }

  isDocMarkedToReupload() {
    return this.document.mark.reupload;
  }

  isDocMarkedToDelete() {
    return this.document.mark.delete;
  }

  chooseFile(id: string) {
    document.getElementById(id).click();
  }

  handleFileInput(files: FileList) {
    // Editable - file disimpen di temp
    if (!this.document.mark.reupload && this.editable) {
      this.tempFile = files.item(0);
      this.document.mark.reupload = true;
    } else {
      // File langsung di upload
      this.document.file = files.item(0);
      if (!this.applyForm) {
        this.userService.uploadDocument(this.document.type, this.document.file).subscribe(
          data => {
            this.document.mark.newUpload = true;
            this.tempFile = null;
            // console.log('Document ', this.document.type, ' successfully uploaded : ', data);
          },
          err => {
            // console.log('Failed uploaded document: ', this.document.type, '\nError:', err);
          }
        );
      }
    }
  }

  onGetDocument() {
    // console.log('doc type:', this.document.type);
    if (this.document.type === 'blueform') {
      window.open(`/view-blueform/${this.applicantID}`)
      return;
    }
    if (this.document.type === 'onboardForm') {
      window.open(`/view-onboardform/${this.onboardForm.id}`)
    }
    this.userService.getDocument(this.document.type, this.applicantID !== undefined ? this.applicantID : undefined).subscribe(
      response => {
        const url = window.URL.createObjectURL(response);
        window.open(url, '_blank');
      });
  }
}
