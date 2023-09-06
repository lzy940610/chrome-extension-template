import { IMessage } from '@/types';

let port: chrome.runtime.Port | null = null;

export const connectPanel = () => {
  if (!port) {
    port = chrome.runtime.connect({ name: "panel" });
    port.onDisconnect.addListener(() => {
      port = null;
    });
  }
};

export const sendMessage = (message: IMessage) => {
  if (port) {
    port.postMessage(message);
  } else {
    console.warn('Port is not connected.');
  }
};

export const disconnectPanel = () => {
  if (port) {
    port.disconnect();
    port = null;
  }
};
