import io from "socket.io-client";

const SOCKET_URL = 'https://movieplatform.herokuapp.com/'

export const socket = io(SOCKET_URL, {transports: ['websocket']});
