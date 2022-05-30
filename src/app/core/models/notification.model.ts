export class Notification {
    public forwardLink: string;
    public message: string;
    public timestamp: string;
    public read: string;
    public id: string;

    constructor(forwardLink: string, message: string, timestamp: string, read: string, id: string) {
        this.forwardLink = forwardLink;
        this.read = read;
        this.message = message;
        this.timestamp = timestamp;
        this.id = id;
    }
}

