import { SendListener, EditListener, ReceiveListener, Message, APIMessage } from '@common';

const sendListeners = new Set<SendListener>();
const editListeners = new Set<EditListener>();
const receiveListeners = new Set<ReceiveListener>();

// Used by plugins/messageApi.ts
export const $handleSendMessage = (channelId: string, message: Message, extra: any) => {
    for (const listener of sendListeners) {
        listener(channelId, message, extra);
    }
};

export const $handleEditMessage = (channelId: string, messageId: string, message: Message) => {
    for (const listener of editListeners) {
        listener(channelId, messageId, message);
    }
};

export const $handleReceiveMessage = (channelId: string,  message: APIMessage) => {
    for (const listener of receiveListeners) {
        listener(channelId, message);
    }
};

export const addPreSendListener = (listener: SendListener) => {
    sendListeners.add(listener);
    return listener;
};

export const removePreSendListener = (listener: SendListener) => {
    sendListeners.delete(listener);
};

export const addPreEditListener = (listener: EditListener) => {
    editListeners.add(listener);
    return listener;
};

export const removePreEditListener = (listener: EditListener) => {
    editListeners.delete(listener);
};

export const addPreReceiveListener = (listener: ReceiveListener) => {
    receiveListeners.add(listener);
    return listener;
};

export const removePreReceiveListener = (listener: ReceiveListener) => {
    receiveListeners.delete(listener);
};