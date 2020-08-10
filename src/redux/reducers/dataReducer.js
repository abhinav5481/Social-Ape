import {SET_SCREAMS,LIKE_SCREAM,UNLIKE_SCREAM,LOADING_DATA,DELETE_SCREAM,POST_SCREAM,SET_SCREAM,SUBMIT_COMMENT} from '../types';


const initialState = {
    screams: [],
    scream: {},
    loading: false
}

export default function(state = initialState, action){
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }

        case SET_SCREAMS:
            return {
                ...state,
                screams: action.payload,
                loading: false
            }
        
        case LIKE_SCREAM: 
            let index = state.screams.findIndex((scream) => scream.screamId === action.payload.screamId);
            state.screams[index] = action.payload
            return {
                ...state

            }
        case UNLIKE_SCREAM: 
            let ind = state.screams.findIndex((scream) => scream.screamId === action.payload.screamId);
            state.screams[ind] = action.payload
            return {
                ...state

            }

        case DELETE_SCREAM:
            let indexToBeDeleted = state.screams.findIndex((scream) => scream.screamId === action.payload);
            state.screams.splice(indexToBeDeleted,1);
            return {
                ...state
            }
        
        case POST_SCREAM:
            return {
                ...state,
                screams: [
                    action.payload,
                    ...state.screams
                ] 
            }

        case SET_SCREAM:
            return {
                ...state,
                scream: action.payload
            }

        case SUBMIT_COMMENT: 
            return{
                ...state,
                scream: {
                    ...state.scream,
                    comments: [
                        action.payload,
                        ...state.scream.comments
                    ]
                }
            }
        default: 
            return state;
            
    }
}