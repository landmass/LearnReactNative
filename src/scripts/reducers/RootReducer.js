/**
 * Created by Rabbit on 2017/12/25.
 */
import { combineReducers } from 'redux';

import nav from './StackReducer';


//取决于这里你加入了多少 reducer
const RootReducer = combineReducers({
    nav,
});

export default RootReducer;