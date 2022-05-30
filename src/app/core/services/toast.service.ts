import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastrService: ToastrService) { }

  success(message: string) {
    this.toastrService.success(message, 'Success');
  }

  error(message: string) {
    this.toastrService.error(message, 'Error');
  }

  info(message: string) {
    this.toastrService.info(message, 'Info');
  }
}
