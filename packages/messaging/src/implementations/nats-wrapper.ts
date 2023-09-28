import nats, { Message, Stan } from 'node-nats-streaming';
import { IMessage, IMessageService } from '../core';
import { randomUUID } from 'crypto';
import { injectable } from 'inversify';

@injectable()
class NatsWrapper implements IMessageService {
  private _client?: Stan;
  private _groupId?: string;
  protected ackWait = 120000;

  async init(
    url: string,
    clusterId: string,
    groupId: string,
    onClose: () => void
  ): Promise<void> {
    const clientId = randomUUID();
    console.log(
      'Connecting to NATS cluster: ',
      clusterId,
      ' with client id: ',
      clientId
    );
    this._client = nats.connect(clusterId, clientId, { url });
    this._groupId = groupId;

    return new Promise((resolve, reject) => {
      this._client!.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      this._client!.on('close', () => {
        console.log('NATS connection closed');
        onClose();
      });

      this._client!.on('error', (err) => {
        reject(err);
      });
    });
  }

  close() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    this._client.close();
  }

  subscribe(subject: string, callback: (data: any) => Promise<void>): void {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    const options = this._client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this._groupId!);

    const subscription = this._client.subscribe(
      subject,
      this._groupId!,
      options
    );

    subscription.on('message', async (msg: Message) => {
      console.log(`Message received: ${subject} / ${this._groupId}`);

      const parsedData = this.parseMessage(msg);
      await callback(parsedData);
      msg.ack();
    });
  }

  private parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }

  async publish(message: IMessage): Promise<void> {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    console.log('Publishing message: ', message);

    return new Promise((resolve, reject) => {
      this._client!.publish(
        message.subject,
        JSON.stringify(message.data),
        (err) => {
          if (err) {
            return reject(err);
          }

          console.log('Message published to subject', message.subject);
          resolve();
        }
      );
    });
  }
}

export default NatsWrapper;
