export class Job {
    public id: string;
    public title: string;
    public location: string;
    public experience: string;
    public education: string;
    public employment: string;
    public onBoardStart: string;
    public applied: boolean;


    constructor(id: string, title: string, location: string, experience: string, education: string,
        employment: string, onBoardStart: string, applied: boolean) {
        this.id = id;
        this.title = title;
        this.location = location;
        this.experience = experience;
        this.education = education;
        this.employment = employment;
        this.onBoardStart = onBoardStart;
        this.applied = applied;
    }
}
