export class Author {
    public name: string;
    public profpic: string;
    public _id: string;
    public selected: boolean;

    constructor(name: string, profpic: string, _id: string, selected: boolean) {
        this.name = name;
        this.profpic = profpic;
        this._id = _id;
        this.selected = selected;
    }
}
