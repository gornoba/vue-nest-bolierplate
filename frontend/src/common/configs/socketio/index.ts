import { io, Socket } from 'socket.io-client';
import { SocektError } from '@/common/interfaces/error.interface';
import { socketErrorHandler } from '../../util/error';

export default class Socketio {
  private socket: Socket | null;

  private namespace: string;

  private fnc: { (): void } | null;

  private timeout: number;

  constructor(namespace: string) {
    this.namespace = namespace;
    this.socket = null;
    this.fnc = null;
    this.timeout = 0;
  }

  private callback(fnc: () => void) {
    this.fnc = fnc;
  }

  config() {
    const googleUrl: RegExpExecArray | null = /.*(du.r.appspot.com)/g.exec(window.location.href);
    const urlExe: RegExpExecArray | null = /(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}(:8001|:8000)?/g.exec(
      window.location.href,
    );
    const url: string = googleUrl ? googleUrl[0] : urlExe ? urlExe[0] : '';

    this.socket = io(
      `${process.env.NODE_ENV === 'development' ? process.env.VUE_APP_DEVHOST : url}${
        this.namespace ? `/${this.namespace}` : ''
      }`,
      {
        transports: ['websocket'],
      },
    );

    this.connect();
  }

  connect(): Socket | undefined {
    if (this.socket) {
      this.socket.on('connect', () => {
        console.log(`${this.namespace} connected`);
      });

      this.socket.on('disconnect', () => {
        console.log(`${this.namespace} disconnected`);
      });

      this.socket.on('connect_error', (err) => {
        console.log(`${this.namespace} connect_error / ${err}`);
      });
      this.socket.on('connect_failed', (err) => {
        console.log(`${this.namespace} connect_failed / ${err}`);
      });

      this.socket.on(`${this.namespace}_error`, async (messages: SocektError) => {
        await socketErrorHandler(messages, null);
      });

      return this.socket;
    }

    return undefined;
  }

  private async disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // 만약 callback을 하지 않으면 [{data}, null] 형태로 서버로 전송. callback을 넣으면 {data} 형태로 전송
  emit(room: string, data: object, callback?: () => Promise<void | undefined>) {
    if (this.socket) {
      if (callback) {
        this.socket.emit(room, data, callback);
      } else {
        this.socket.emit(room, data);
      }
    }
  }

  broadcast(room: string, callback: () => Promise<void | undefined>) {
    if (this.socket) {
      this.socket.on(room, callback);
    }
  }
}
