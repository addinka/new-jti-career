export class Recruiter {
    public name: string;
    public title: string;
    public email: string;
    public isAdmin: boolean;
    public isSuperAdmin: boolean;
    public isActive: boolean;
    public profpic: string;

    constructor(name: string, title: string, email: string, isAdmin: boolean, isSuperAdmin: boolean, isActive: boolean, profpic: string) {
        this.name = name;
        this.title = title;
        this.email = email;
        this.isAdmin = isAdmin;
        this.isSuperAdmin = isSuperAdmin;
        this.isActive = isActive;
        this.profpic = profpic;
    }
}
