// import * as mqtt from 'mqtt';
const mqtt = require('mqtt/dist/mqtt.min');
// const mqtt = {}
/**
 * @author:
 * @description:
 */

interface MqttOption {
  // host: string;
  // port: number;
  password?: string;
  username?: string;
  clientId?: string;
}

const globalMap = new Map();

class Mqtt {
  // client = ; // mq连接实例
  client: any;

  options: MqttOption;

  subscriptions: string[] = []; // 已订阅的集合
  connectStatus = false;
  url = '';
  targetMap = new Map();

  constructor(url: string, options: MqttOption) {
    this.options = options;
    this.url = url;
    globalMap.set(url, this.targetMap);
    // this.connect();
  }

  // 连接
  connect() {
    this.client = mqtt.connect(this.url, this.options);
    return new Promise((resolve, reject) => {
      // 连接回调
      this.client.on('connect', () => {
        console.log('连接成功..');
        this.connectStatus = true;
        this.subscribeTopics(this.subscriptions);
        resolve(true);
      });
      this.client.on('error', (error: any) => {
        console.log('连接失败..', error);
        reject(error);
      });
      this.client.on('message', (topic: string, message: any) => {
        const depsMap = this.targetMap.get(topic);
        if (!depsMap) return;
        depsMap.set('data', JSON.parse(''.concat(message)));
        const deps = depsMap.get('fns');
        deps.forEach((effectFn: any) => {
          effectFn(depsMap.get('data'), topic);
        });
      });
    });
  }

  // 订阅
  /**
   *
   * @param topic
   * @returns {boolean}
   */
  subscribe(topic: string, callback: any) {
    if (this.subscriptions.findIndex((item) => item === topic) === -1) {
      this.subscriptions.push(topic);
    }
    let depsMap = this.targetMap.get(topic);
    if (!depsMap) {
      depsMap = new Map();
      this.targetMap.set(topic, depsMap);
    }
    let deps = depsMap.get('fns');
    if (!deps) {
      deps = new Set();
      depsMap.set('fns', deps);
    }
    if (callback) {
      deps.add(callback);
    }

    if (this.connectStatus) {
      this.client.subscribe(topic, (err: any) => {
        if (err) console.log('订阅失败', err);
      });
    }
  }
  subscribeTopics(topics: string[], effects?: void[]) {
    topics.forEach((topic, index) => {
      this.subscribe(topic, effects ? effects[index] : undefined);
    });
  }
  /**
   * 取消订阅
   */
  unsubscribe(topic: string, callback: any) {
    // console.log(callback);
    const index = this.subscriptions.findIndex((v) => v === topic);
    if (index >= 0) {
      this.subscriptions.splice(index, 1);
    }
    const depsMap = this.targetMap.get(topic);
    if (!depsMap) return;
    const deps = depsMap.get('fns');
    if (!deps.has(callback)) return;
    deps.delete(callback);
    if (deps.size === 0) {
      depsMap.delete(topic);
      this.client.unsubscribe(topic);
    }
  }
  close() {
    this.client.end(true);
    globalMap.delete(this.url);
  }
}

export default Mqtt;
