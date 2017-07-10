import axios from 'axios';

export const Get_USERS = 'getUsers';

export function getUsers() {      
    const request = axios.get("/users");
    console.log(request);
    return {
        type: Get_USERS,
        payload: request
    }
}