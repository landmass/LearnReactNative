import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { connect } from 'react-redux';

class Goods extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>goods----</Text>
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
})(Goods);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gold'
    },


});
