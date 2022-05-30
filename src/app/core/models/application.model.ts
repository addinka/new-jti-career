import { Job } from 'src/app/core/models/job.model';

export class Application {
    public applicationID: string;
    public jobID: string;
    public userID: string;
    public job: Job;
    public expSalary: number;
    public isNegotiable: boolean;
    public comments: string;
    public status: string;
    public auditRecords: any[];
    public lastUpdated: string;

    constructor(
        applicationID: string,
        jobID: string,
        userID: string,
        job: Job,
        expSalary: number,
        isNegotiable: boolean,
        comments: string,
        status: string,
        auditRecords: any[],
        lastUpdated: string
    ) {
        this.applicationID = applicationID;
        this.jobID = jobID;
        this.userID = userID;
        this.job = job;
        this.expSalary = expSalary;
        this.isNegotiable = isNegotiable;
        this.comments = comments;
        this.status = status;
        this.auditRecords = auditRecords;
        this.lastUpdated = lastUpdated;
    }
}
