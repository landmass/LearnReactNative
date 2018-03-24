import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { connect } from 'react-redux';

import SplashScreen from 'react-native-splash-screen'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        SplashScreen.hide();
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>home----</Text>
            </View>
        );
    }
}

export default connect((state) => {
    const { nav } = state;
    const routes = nav.routes;
    return {
        routes
    };
})(Home);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
    },


});
