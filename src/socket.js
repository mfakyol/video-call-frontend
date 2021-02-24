import io from "socket.io-client";
export default () => {
  const SERVER = "http://localhost:3001";
  // const SERVER = "http://192.168.1.5:3001";
  let socket = io(SERVER, { query: { id: 1 } });
  return socket;
};
