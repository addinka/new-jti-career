// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   'Set quicktype target language'

export class CalenderModel {
    date:  number;
    iso:   string;
    type:  Type;
    event: boolean;
    selected: boolean;

    constructor(date: number, iso: string, type: Type, event: boolean, selected: boolean) {
        this.date = date;
        this.iso = iso;
        this.type = type;
        this.event = event;
        this.selected = selected;
    }
}

export enum Type {
    Previous = 'previous',
    Current = 'current',
    Next = 'next'
}
