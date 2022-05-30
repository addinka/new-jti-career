import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input() recruiter: any;
  @Input() index: any;

  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() toogleActive: EventEmitter<any> = new EventEmitter();
  @Output() toogleAdmin: EventEmitter<any> = new EventEmitter();

  buttonAdminStatus: String = 'not-allowed';

  // Current role of logged in recruiter.
  isSuperAdmin: boolean;
  isAdmin: boolean;

  constructor(
    private utilsService: UtilsService) {
    const token = localStorage.getItem('token');
    const tokenDecoded = this.utilsService.getDecodedToken(token);

    this.isSuperAdmin = tokenDecoded.isSuperAdmin;
    this.isAdmin = tokenDecoded.isAdmin;
  }

  ngOnInit() {
    if (this.isSuperAdmin && !this.recruiter.isSuperAdmin) {
      this.buttonAdminStatus = 'clickable';
    }
  }

  onToogleAdmin() {
    if (this.isSuperAdmin && !this.recruiter.isSuperAdmin) {
      this.toogleAdmin.emit(this.index);
    }
  }

  onDeleteRecruiter() {
    this.delete.emit(this.index);
  }

  onToogleActive() {
    this.toogleActive.emit(this.index);
  }
}
