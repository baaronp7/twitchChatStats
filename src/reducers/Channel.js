import { Get_CHANNEL } from '../actions';

export default function (state = {}, action) {
    switch (action.type) {
        case Get_CHANNEL:               
            const channel = action.payload.data;    
            return channel;
        default:
            return state;
    }
}