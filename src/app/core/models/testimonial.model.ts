export class Testimonial {
    public path?: string;
    public text: string;
    public name: string;
    public role: string;

    constructor(path: string, text: string, name: string, role: string) {
        this.path = path;
        this.text = text;
        this.name = name;
        this.role = role;
    }
}
