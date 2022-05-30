import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { EventEmitterService } from 'src/app/core/services/event-emitter.service';

@Component({
  selector: 'app-profpic-pop-up',
  templateUrl: './profpic-pop-up.component.html',
  styleUrls: ['./profpic-pop-up.component.scss']
})
export class ProfpicPopUpComponent implements OnInit {

  constructor(
    private eventEmitterService: EventEmitterService 
  ) { }

  ngOnInit() {
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  imageName: any;
  imageBlob: any;
  imageFile: any;

  dataURItoBlob(dataURI) {


    const byteString = window.atob(dataURI.replace(/^data:image\/(png|jpg);base64,/,''));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
  }
  

  cropIt() {
    if(this.croppedImage === '')
    {
      
    }
    else
    {
      this.imageName = 'profpic.png';
      this.imageBlob = this.dataURItoBlob(this.croppedImage);
      this.imageFile = new File([this.imageBlob], this.imageName, { type: 'image/png' });
      this.overviewComponentFunction(this.imageFile);
    }
  }

  overviewComponentFunction(param){    
    this.eventEmitterService.callOverviewComponentFunction(param);    
  }    
}