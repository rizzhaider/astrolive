import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { ILogListener, ALL, LogLevel, ILogMessage } from 'ng2-log-service';
@Injectable()
export class AppLogListener implements ILogListener {
    
    namespace = ALL;
    level = LogLevel.All;
   
    constructor() {
        this.namespace = ALL; // what namespace you want to listen for
        this.level = environment.logLevel; // log level
    }
    
 
    onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
       console.log(namespace + '|' + level + ': ', logMessage.message, logMessage.obj ? logMessage.obj : '');
    }
 
}