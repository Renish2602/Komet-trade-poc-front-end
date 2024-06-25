import { io } from "socket.io-client";

export const tradeSocket = io('https://komet-trade-poc-backend.onrender.com/');