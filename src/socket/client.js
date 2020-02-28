import io from 'socket.io-client'
import { SERVERURL } from '../configuration'

export default class socketAPI {
    socket;

    connect() {
        //console.log('connecting....');
        if (!this.socket) {
            //console.log('websocket open');
            this.socket = io(SERVERURL);
        }
        return new Promise((resolve, reject) => {
            this.socket.on('connected', (res) => {
                //console.log('connected: '+JSON.stringify(res));
                resolve(res)
            });
            this.socket.on('connect_error', (error) => reject(error));
        })
    }

    disconnect() {
        return new Promise((resolve) => {
            this.socket.disconnect(() => {
                this.socket = null;
                resolve();
            })
        })
    }

    emit(event, data) {
        return new Promise((resolve, reject) => {
            if (!this.socket) return reject('No socket connect!');
            
            return this.socket.emit(event, data, (response) => {
                if (response.error) {
                    console.error(response.error);
                    return reject(response.error);
                }

                return resolve();
            });
        })
    }

    on(event, fun) {
        return new Promise((resolve, reject) => {
            if (!this.socket) return reject('No socket connect!');
            
            this.socket.on(event, fun);
            resolve();
        })
    }
}