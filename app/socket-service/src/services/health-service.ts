import { wsInstance } from '../server';
import WebSocket from 'ws';

class HealthService {
  static instance: HealthService;
  constructor() {
    if (HealthService.instance) {
      return HealthService.instance;
    }

    HealthService.instance = this;

    wsInstance.getWss().on('connection', (ws: WebSocket) => {
      // @ts-ignore
      ws.isAlive = true;

      ws.on('error', (err) => {
        console.error(err);
      });

      ws.on('pong', () => {
        // @ts-ignore
        ws.isAlive = true;
      });
    });

    wsInstance.getWss().on('close', () => {
      // @ts-ignore
      clearInterval(this.interval);
    });
  }

  start = () => {
    // @ts-ignore
    this.interval = setInterval(() => {
      wsInstance.getWss().clients.forEach((ws) => {
        if (ws.isAlive === false) {
          console.log('Terminating dead websocket connection...');
          ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    console.log('Health Service started...');
  };
}

export default HealthService;
