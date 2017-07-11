import { Get_VIEWERS } from '../actions';

export default function (state = {}, action) {
    switch (action.type) {
        case Get_VIEWERS:               
            const viewers = action.payload.data;    
            return viewers;
        default:
            return state;
    }
}