"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startFtpServer = void 0;
const ftpServer = require('ftp-srv');
const bunyan = require('bunyan');
const startFtpServer = (host, port, user, pass) => __awaiter(void 0, void 0, void 0, function* () {
    const quietLog = bunyan.createLogger({
        name: 'quiet-logger',
        level: 60,
    });
    const server = new ftpServer({
        url: 'ftp://0.0.0.0:8001',
        pasv_url: 'ftp://0.0.0.0:8001',
        pasv_range: '8000-8500', // change this to an open port range for your app
    });
    /*  const server = new ftpServer(`ftp://${host}:${port}`, {
        log: quietLog,
        pasv_range: '8400-8500', // change this to an open port range for your app
      });
      */
    //@ts-ignore
    server.on('login', ({ connection, username, password }, resolve, reject) => {
        if (username === user && password === pass) {
            // If connected, add a handler to confirm file uploads 
            //@ts-ignore
            connection.on('STOR', (error, fileName) => {
                if (error) {
                    console.error(`FTP server error: could not receive file ${fileName} for upload ${error}`);
                }
                console.info(`FTP server: upload successfully received - ${fileName}`);
            });
            resolve();
        }
        else {
            reject(new Error('Unable to authenticate with FTP server: bad username or password'));
        }
    });
    //@ts-ignore
    server.on('client-error', ({ context, error }) => {
        console.error(`FTP server error: error interfacing with client ${context} ${error} on ftp://${host}:${port} ${JSON.stringify(error)}`);
    });
    const closeFtpServer = () => __awaiter(void 0, void 0, void 0, function* () {
        yield server.close();
    });
    // The types are incorrect here - listen returns a promise 
    yield server.listen();
    return {
        shutdownFunc: () => __awaiter(void 0, void 0, void 0, function* () {
            // server.close() returns a promise - another incorrect type 
            yield closeFtpServer();
        }),
    };
});
exports.startFtpServer = startFtpServer;
(0, exports.startFtpServer)('127.0.0.1', 22, 'admin', 'admin');
//# sourceMappingURL=server.js.map