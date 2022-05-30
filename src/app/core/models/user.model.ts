import { Notification } from './notification.model';

export class User {
    public name: string;
    public email: string;
    public contact: string;
    public linkedinURL: string;
    public domicile: string;
    public university: string;
    public majorField: string;
    public companyName: String[];
    public position: String[];
    public jobdesk: String[];
    public startPeriod: String[];
    public endPeriod: String[];
    public language: string;
    public degree: string;
    public experience: string;
    public selfDesc: string;
    public qualification: string;
    public lastUpdated: string;
    public type: string;
    public userID: string;
    public attachments: any[];
    public encryptedPass: string;
    public notifications: Notification[];

    constructor(
        name: string,
        email: string,
        contact: string,
        linkedinURL: string,
        domicile: string,
        university: string,
        majorField: string,
        companyName: String[],
        position: String[],
        jobdesk: String[],
        startPeriod: String[],
        endPeriod: String[],
        language: string,
        degree: string,
        experience: string,
        selfDesc: string,
        qualification: string,
        lastUpdate: string,
        type: string,
        userID: string,
        attachments: any[],
        encryptedPass: string,
        notifications: Notification[]) {
            this.name = name;
            this.email = email;
            this.contact = contact;
            this.linkedinURL =  linkedinURL;
            this.domicile = domicile;
            this.university = university;
            this.majorField = majorField;
            this.companyName = companyName;
            this.position = position;
            this.jobdesk = jobdesk;
            this.startPeriod = startPeriod;
            this.endPeriod = endPeriod;
            this.language = language;
            this.degree = degree;
            this.experience = experience;
            this.selfDesc = selfDesc;
            this.qualification = qualification;
            this.lastUpdated = lastUpdate;
            this.type = type;
            this.userID = userID;
            this.attachments = attachments;
            this.encryptedPass = encryptedPass;
            this.notifications = notifications;
    }
}
