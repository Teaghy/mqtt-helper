## 对mqtt.js的二次封装

```typescript
  import Mqtt from '@teaghy/mqtt-helper';
  const host = '127.0.0.1';
  const port = 1883;
  const client = new Mqtt(`ws://${host}:${port}/mqtt`, {
    clientId: 'iot_' + Math.random().toString(16).substr(2, 8),
    // clientId: 'HLInitMessages',
    username: 'admin',
    password: '123456',
  });
  client.connect();
  function updateData(data: any) {
    console.log(data);
  }
  client.subscribe('/node/test', updateData);
  window.onload = function () {
    const btn: HTMLElement = document.querySelector('#btn') as HTMLElement;
    btn.onclick = function () {
      console.log(1111);
      client.unsubscribe('/node/test', updateData);
    }   
  }
```
