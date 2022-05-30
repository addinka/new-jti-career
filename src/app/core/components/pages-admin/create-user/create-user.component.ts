import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RegexMapping } from 'src/app/core/utils/regex.mapping';
import { Avatar } from 'src/app/core/models/avatar.model';
import { RecruiterService } from 'src/app/core/services/recruiter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public recruiterService: RecruiterService,
    public router: Router
  ) { }

  public createUserForm: FormGroup;
  public avatarOptions: Avatar[] = [
    {
      path: 'assets/images/1.svg',
      selected: false
    },
    {
      path: 'assets/images/2.svg',
      selected: false
    },
    {
      path: 'assets/images/3.svg',
      selected: false
    },
    {
      path: 'assets/images/4.svg',
      selected: false
    },
    {
      path: 'assets/images/5.svg',
      selected: false
    },
    {
      path: 'assets/images/6.svg',
      selected: false
    },
    {
      path: 'assets/images/7.svg',
      selected: false
    },
    {
      path: 'assets/images/8.svg',
      selected: false
    },
    {
      path: 'assets/images/9.svg',
      selected: false
    },
    {
      path: 'assets/images/10.svg',
      selected: false
    },
    {
      path: 'assets/images/11.svg',
      selected: false
    },
    {
      path: 'assets/images/12.svg',
      selected: false
    }
  ];

  public roles = [
    'HR Recruiter',
    'HR Recruiter Intern'
  ];
  public errorMessage: string;

  ngOnInit() {
    // Create edit form.
    this.createUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern(RegexMapping.EMAIL_VALIDATOR)
      ])],
      title: ['', Validators.required],
      profpic: ['', Validators.required]
    });
  }

  activateAvatar(index: number) {

    for (let i = 0; i < this.avatarOptions.length; i++) {
      this.avatarOptions[i].selected = false;
    }

    this.avatarOptions[index].selected = true;
    this.createUserForm.patchValue({profpic : (index + 1).toString()});
  }

  onSubmit() {
    const value = this.createUserForm.value;
    this.onCreateUser(value);
    this.router.navigate(['/admin/manage-user']);
  }

  onCreateUser(data: any) {
    this.recruiterService.createRecruiter(data)
      .subscribe(response => {});
  }

  validateEmail() {
    if (this.createUserForm.value.email !== '' && this.createUserForm.controls.email.errors !== null) {
      this.errorMessage = 'Email format is wrong.';
    } else {
      this.errorMessage = '';
    }
  }
}
