// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

export interface NewRecruiterModel {
    docs:     Doc[];
    bookmark: string;
}

export interface Doc {
    _id:           string;
    _rev:          string;
    type:          string;
    name:          string;
    email:         string;
    title:         string;
    profpic:       string;
    isAdmin:       boolean;
    isSuperAdmin:  boolean;
    isActive:      boolean;
    lastUpdated:   string;
    encryptedPass: string;
    recruiterID?:  string;
    selected?:     boolean;
}
