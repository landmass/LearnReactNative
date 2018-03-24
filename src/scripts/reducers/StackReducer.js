/**
 * Created by Rabbit on 2017/12/25.
 */

import { StackRoutes } from '../navigators/Navigator';

export default function StackReducer(state , action) {
    let nextState;
    switch (action.type) {
        default:
            nextState = StackRoutes.router.getStateForAction(action, state);
            break;
    }
    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
}