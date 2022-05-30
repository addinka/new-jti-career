// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

export interface CalenderDetailModel {
    TEST:        CalenderDetail[];
    INTERVIEW_1: CalenderDetail[];
    INTERVIEW_2: CalenderDetail[];
    ONBOARD:     CalenderDetail[];
}

export interface CalenderDetail {
    _id:            string;
    _rev:           string;
    jobID:          string;
    expSalary:      number;
    isNegotiable:   boolean;
    comments:       string;
    applicationID:  string;
    status:         string;
    userID:         string;
    userName:       string;
    recruiterID:    string;
    recruiterName:  string;
    auditRecords:   AuditRecord[];
    lastUpdated:    string;
    type:           string;
    inviteTime:     string;
    inviteLocation: string;
}

export interface AuditRecord {
    updaterID:   string;
    updaterType: string;
    action:      string;
    timestamp:   string;
}