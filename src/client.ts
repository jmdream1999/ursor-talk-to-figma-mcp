import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3055');
const NODE_ID = '1:2620';  // URL에서 확인된 node-id

ws.on('open', () => {
  console.log('Connected to server');
  
  // Join channel
  ws.send(JSON.stringify({
    type: 'join',
    channel: '7a2r7ahr'
  }));

  // Select specific node
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'message',
      channel: '7a2r7ahr',
      message: {
        command: 'select_node',
        params: {
          nodeId: NODE_ID
        }
      }
    }));
  }, 1000);
});

ws.on('message', (data) => {
  const response = JSON.parse(data.toString());
  console.log('Received:', response);

  if (response.type === 'broadcast' && response.message?.result) {
    console.log('Node data:', response.message.result);
    // 노드 선택 후 export 명령 시도
    if (response.message.result.success) {
      ws.send(JSON.stringify({
        type: 'message',
        channel: '7a2r7ahr',
        message: {
          command: 'export_node',
          params: {
            nodeId: NODE_ID,
            format: 'HTML'
          }
        }
      }));
    }
  }
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('close', () => {
  console.log('Disconnected from server');
}); 