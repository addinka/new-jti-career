export class Filter {
    public name: string;
    public selected: boolean;

    constructor(name: string, selected: boolean) {
        this.name = name;
        this.selected = selected;
    }
}
