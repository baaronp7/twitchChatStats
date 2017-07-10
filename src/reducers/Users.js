import { Get_USERS } from '../actions';

export default function (state = {}, action) {
    switch (action.type) {
        case Get_USERS:
        console.log(action.payload.data);                
            const users = action.payload.data;    
            return users;
        default:
            return state;
    }
}