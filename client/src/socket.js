import { io } from "socket.io-client";

const socket = io("https://engiverse-vtpa.onrender.com", {
  transports: ["websocket"],
});

export default socket;