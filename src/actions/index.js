import axios from 'axios';

export const Get_VIEWERS = 'getViewers';

export function getViewers() {      
    const request = axios.get("/viewers");

    return {
        type: Get_VIEWERS,
        payload: request
    }
}