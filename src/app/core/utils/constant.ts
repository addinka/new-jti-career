import { environment } from 'src/environments/environment';

export const BASE_URL = environment.baseURL;
export const PROFILE_URL = BASE_URL + 'user/profpic/';
export const TESTIMONY_URL = BASE_URL + 'testimony/testimonyPic/';

export enum Messages {
  JOB_NOT_FOUND = 'No job opening',
  PAGE_NOT_FOUND = 'Page not found',
}

export namespace TestUsers {

  const DEFAULT_PASSWORD = 'password';

  export enum Emails {
    CANDIDATE = 'candidate@ibm-jti.com',
    RECRUITER = 'recruiter@ibm-jti.com'
  }

  export enum Roles {
    CANDIDATE = 'CANDIDATE',
    RECRUITER = 'RECRUITER'
  }

  export const CREDENTIALS = {
    [Emails.CANDIDATE]: { PASSWORD: DEFAULT_PASSWORD, ROLE: Roles.CANDIDATE },
    [Emails.RECRUITER]: { PASSWORD: DEFAULT_PASSWORD, ROLE: Roles.RECRUITER }
  };
}




export enum Constant {
  // Unlimited Token
  // tslint:disable-next-line:max-line-length
  TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InN5c3RlbV9hZG1pbiIsInR5cGUiOiJSZWNydWl0ZXIiLCJpc0FkbWluIjp0cnVlLCJpc1N1cGVyQWRtaW4iOnRydWUsImlhdCI6MTU1MzY3NTEwMn0.VV-KyYxDhZgH2Lse_Dr8wdM40BYuIDFtY30oQgp6_rE',

  TOKEN_DUMMY = 'c3njr8031',

  // tslint:disable-next-line:max-line-length
  EXAMPLE_TESTIMONIAL = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In posuere elementum arcu id suscipit. Maecenas gravida posuere molestie. Mauris eget felis porta, tempor tortor sed, ornare turpis.',

  // Social Media URLs
  FB_URL = 'https://www.facebook.com/IBMJTI/',
  IG_URL = 'https://www.instagram.com/jticareer/',
  YT_URL = 'https://www.youtube.com/channel/UCREHB4YQYgYSxSs0WvmxtzQ',
  LI_URL = 'https://www.linkedin.com/company/ibm-jti/about/',
  EMAIL = 'career@ibm-jti.com',
}

export class Arrays {
  public static ENTRY = ['10', '20', '30', '40', '50'];
  public static STATUS = ['applied', 'shortlist', 'test', 'inter1', 'inter2', 'hired', 'rejected','withdrawn', 'eliminated'];
  // tslint:disable-next-line: max-line-length
  public static CATEGORY = ['Accounting & Finance', 'Admin', 'Customer Service', 'Engineering', 'Human Resources', 'IT & Software', 'Legal', 'Sales Support'];
  public static LOCATION = ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Other'];
  public static LANGUAGE = ['English', 'Indonesian', 'Other'];
  public static EXPERIENCE = ['Under Graduate', 'Fresh Graduate', 'Early Professional (1-3 Years Exp.)', 'Professional (> 3 Years Exp.)'];
  public static EDUCATION = ['SMK', 'D2', 'D3', 'Bachelor', 'Master'];
  public static INFORMATION = ['JTIers', 'Kalibrr', 'LinkedIn', 'JobStreet', 'Job Fair', 'Career', 'Instagram', 'Referral', 'Other'];
  public static EMPLOYMENT = ['Regular', 'Contract', 'Part Time', 'Internship' ];
  public static MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  public static FILTER = ['Language', 'Education', 'Experience'];
  public static INVITATION = ['Shortlist', 'Test', 'Interview I', 'Interview II', 'On Board', 'Withdraw'];
  public static ASSIGNMENTS = [
    {
      name: 'Shift Work',
      isActive: false
    },
    {
      name: 'Overtime Work',
      isActive: false
    },
    {
      name: 'Rotational Work Schedule',
      isActive: false
    },
    {
      name: 'Work Schedule that includes Saturday and Sunday',
      isActive: false
    }
  ]

  public static EMPLOYMENT_TYPE = [
    {
      name: 'Regular',
      isActive: false
    },
    {
      name: 'Part Time',
      isActive: false
    },
    {
      name: 'Temporary',
      isActive: false
    },
    {
      name: 'Summer/Vocational',
      isActive: false
    },
    {
      name: 'Fixed Term Hire',
      isActive: false
    }
  ]

  public static EXJTI = [
    {
      name: 'Pernah Bekerja',
      isActive: false
    },
    {
      name: 'Melamar',
      isActive: false
    }
  ]
  public static CANDIDATE_SEARCH_TYPES = ['name', 'number', 'title', 'qualification'];
}

export const CV_COLOR = {
  green: '#2CC058',
  red: '#E16685',
  yellow: '#F7B563',
}

export const DOCUMENT_TYPE = {
  cv: 'CV',
  portfolio: 'Portfolio',
  blueform: 'Blueform',
  onboardForm: 'Onboard Form',
  educert: 'Edu. Certificate',
  transcript: 'Transcript',
  birthcert: 'Birth Certificate',
  idcard: 'ID Card',
  familycard: 'Family Card',
  marriagecert: 'Marriage Certificate',
  bpjs: 'BPJS',
  npwp: 'NPWP',
  bankaccount: 'Bank Account',
  refletter: 'Reference Letter',
  skck: 'SKCK'
};

export const HEALTH_TYPES = [
  {
    name: 'EMPLOYEE ONLY',
    price: 'FREE OF CHARGE'
  },
  {
    name: 'EMPLOYEE & SPOUSE',
    price: 'Rp36.200'
  },
  {
    name: 'EMPLOYEE & CHILDREN',
    price: 'Rp49.365'
  },
  {
    name: 'EMPLOYEE & FAMILY *',
    price: 'Rp85.560'
  },
]