import React, {Component} from 'react';

import { Provider }from 'react-redux';

import configureStore from './scripts/store/ConfigureStore';
const store = configureStore();

import StackRoutes from './scripts/navigators/Navigator';

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <StackRoutes />
            </Provider>
        );
    }
}

// 关闭全部的警告
console.disableYellowBox = true;

