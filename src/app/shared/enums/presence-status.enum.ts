// export enum PresenceStatus {
//     OFFLINE, ONLINE, BUSY, AWAY
// }

export class PresenceStatus {
    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }

    // values 
    static OFFLINE = new PresenceStatus("0");
    static ONLINE = new PresenceStatus("1");
    static BUSY = new PresenceStatus("2");
    static AWAY = new PresenceStatus("3");
}

