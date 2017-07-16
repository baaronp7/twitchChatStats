import axios from 'axios';

export const Get_VIEWERS = 'getViewers';
export const Get_CHANNEL = 'getChannel';

export function getViewers() {      
    const request = axios.get("/get/viewers");

    return {
        type: Get_VIEWERS,
        payload: request
    }
}

export function getChannel() {      
    const request = axios.get("/get/channel");

    return {
        type: Get_CHANNEL,
        payload: request
    }
}