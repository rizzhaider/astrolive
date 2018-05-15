import { LogLevel } from 'ng2-log-service';
export const environment = {
  production: true,
  envname: 'prod',
  baseRESTURI: 'https://rest.rockasap.com/TestSeries',
  baseWSURI: 'wss://turn.rockstand.in/signal/websocket', 
  logLevel: LogLevel.Error
};
