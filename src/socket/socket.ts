import { Socket, io } from 'socket.io-client';

 const socket: Socket = io('http://localhost:3000', {
  reconnection: false,
});
export default socket;