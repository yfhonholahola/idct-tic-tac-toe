export default function socketMiddleware(socket) {
    // console.log('socketMiddleware socket'+JSON.stringify(socket))
    return ({dispatch, getState}) => next => action => {
        //console.log('socketMiddleware Here')
        //console.log('socketMiddleware action' + JSON.stringify(action))
        if (typeof action === 'function') {
            return action(dispatch, getState);            
        }

        // console.log('socketMiddleware NOT FUNCTION : '+ JSON.stringify(action))

        const { promise, type, types, ...rest } = action;
    
        if (type !== 'socket' || !promise) {
            // console.log('socketMiddleware NOT SOCKET : '+ JSON.stringify(action))
            return next(action);        
        }
    
        const [REQUEST, SUCCESS, FAILURE] = types;
        //console.log('socketMiddleware SOCKET REQUEST: '+REQUEST+', SUCCESS: '+SUCCESS+', FAILURE: '+FAILURE);
        next({...rest, type:REQUEST});
    
        return promise(socket)
            .then((result) => {
                if (typeof SUCCESS === 'function') {
                    // console.log('socket response: '+ JSON.stringify(result));
                    return dispatch(SUCCESS({...rest, ...result}))
                } else {
                    return next({...rest, result, type:SUCCESS});
                }
            })
            .catch((error) => {
                console.log('failed:'+error);
                if (typeof FAILURE === 'function') {
                    return dispatch(FAILURE({...rest, error}));
                } else {
                    return next({...rest, error, type:FAILURE});
                }                
            })    
    }
}