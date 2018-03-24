/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Image,
    DeviceEventEmitter,
    BackHandler,
    ToastAndroid,
} from 'react-native';

/***************************** 工具 **********************************/

/***************************** 引入插件 *******************************/
import { StackNavigator, TabNavigator, addNavigationHelpers, NavigationActions } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import {connect} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
/***************************** 其它页面 *******************************/
import Home from '../pages/home/Home';
import Goods from '../pages/goods/Goods';
import Mine from '../pages/mine/Mine';
import Login from '../pages/login/Login';


class TabBarItem extends PureComponent {
    render() {
        return(
            <Image
                source={ this.props.focused ? this.props.selectedImage : this.props.normalImage }
                style={[{tintColor: this.props.tintColor}, styles.icon, this.props.iconSelf]}
                resizeMode = {'contain'}
            />
        )
    }
}


const tabScreens = {
    首页: {
        screen: Home,
        navigationOptions: {
            tabBarLabel: '首页',
            tabBarIcon: ({ focused, tintColor }) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    normalImage={require('../img/icon/tab_home_d.png')}
                    selectedImage={require('../img/icon/tab_home_s.png')}
                />
            ),
            header: null,
            tabBarOnPress: (scene) => {
                DeviceEventEmitter.emit('Home', 'Home');
                scene.jumpToIndex(scene.scene.index);
            },
        }
    },
    好物: {
        screen: Goods,
        tabBarLabel: '好物',
        navigationOptions: {
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    normalImage={require('../img/icon/tab_things_d.png')}
                    selectedImage={require('../img/icon/tab_things_s.png')}
                />
            ),
            header: null,
            tabBarOnPress: (scene) => {
                DeviceEventEmitter.emit('Goods', 'Goods');
                scene.jumpToIndex(scene.scene.index);
            },
        }
    },
    我的: {
        screen: Mine,
        tabBarLabel: '我的',
        navigationOptions: {
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    normalImage={require('../img/icon/tab_my_d.png')}
                    selectedImage={require('../img/icon/tab_my_s.png')}
                />
            ),
            header: null,
            tabBarOnPress: (scene) => {
                // 监听事件
                DeviceEventEmitter.emit('Mine', 'Mine');
                scene.jumpToIndex(scene.scene.index);
            },
        },
    }
};

const tabConfig = {
    initialRouteName: '首页',
    animationEnabled: false, // 切换页面时是否有动画效果
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 是否可以左右滑动切换tab
    backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    lazy: true, // 懒加载
    tabBarOptions: {
        tabBarIcon: {focused: true},
        activeTintColor: '#000', // 文字和图片选中颜色
        inactiveTintColor: '#999', // 文字和图片未选中颜色
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        indicatorStyle: {
            height: 0,  // 如TabBar下面显示有一条线，可以设高度为0后隐藏
        },
        style: {
            height: 48,
            backgroundColor: 'rgb(79,145,237)', // TabBar 背景色
        },
        activeBackgroundColor:'rgb(110,202,255)',
        tabStyle: {
            margin: 0,
            marginTop: -5,
            padding: 0,
        },
        labelStyle: {
            fontSize: 13, // 文字大小
            margin: 0,
            padding: 0,
        },
        scrollEnabled: false,
    },
};

const Main = TabNavigator(tabScreens, tabConfig);

export const StackRoutes = StackNavigator({
    Main: {screen: Main},
    Login: {screen: Login},

},{
    mode: 'none',
    headerMode: 'none',
    transitionConfig:()=>({
        // 只要修改最后的forVertical就可以实现不同的动画了。
        screenInterpolator: CardStackStyleInterpolator.forHorizontal,
    }),
    navigationOptions: {
        header: null,
    },
    initialRouteName: 'Main'
});

// 阻止多次跳转的拦截器
let debounce = true; // 防止连续点击的控制变量
let timer = null;
const navigateOnce = (getStateForAction) => (action, state) => {
    const {type, routeName} = action;
    if ([].indexOf(routeName) !== -1) { // 同名文件页面跳转，通过定时器拦截
        if (debounce) {
            debounce = false;
            timer = setTimeout(
                () => {
                    // timer && clearTimeout(timer);
                    debounce = true;
                },
                2000,
            );
            return getStateForAction(action, state);
        }
    } else { // 非同名文件用路由名称，判断拦截
        return (
            state &&
            type === NavigationActions.NAVIGATE &&
            routeName === state.routes[state.routes.length - 1].routeName
        ) ? null : getStateForAction(action, state);
    }
};
StackRoutes.router.getStateForAction = navigateOnce(StackRoutes.router.getStateForAction);

// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);
const addListener = createReduxBoundAddListener("root");
const createStoreWithMiddleware = applyMiddleware(middleware)(createStore);

class App extends Component {
    constructor(props){
        super(props);
        this.lastBackPressed = null;
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', ()=> this._onBackPress());
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', ()=> this._onBackPress());
    }

    _onBackPress() {
        let now = new Date().getTime();
        if (this.props.nav.index === 0) {
            if (now - this.lastBackPressed < 2500) {
                BackHandler.exitApp();
                return false;
            }
            this.lastBackPressed = now;
            ToastAndroid.show('再点击一次退出应用', ToastAndroid.SHORT);
            return true;
        }
        // 返回时，若有 callback 函数，先执行 callback 函数然后返回
        let routes = this.props.nav.routes;
        let previousNavigate = routes[routes.length - 1];
        if (previousNavigate.params && previousNavigate.params.callback) {
            previousNavigate.params.callback();
        }
        this.props.dispatch(NavigationActions.back());
        return true;
    }

    render() {
        return (
            <StackRoutes navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav,
                addListener
            })}/>
        )
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
});


const styles = StyleSheet.create({
    icon: {
        width: 23,
        height: 23,
    },
});


export default connect(mapStateToProps)(App);

