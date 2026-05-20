import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function Home({navigation}) {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={{fontSize: 25, fontWeight: 'bold'}}>My Weather App</Text>
                <Image source={require('../assets/weather.png')} style={styles.png}/>            
            </View>
            <Text>Choose a unit to display your data.</Text>
            <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Celsius')} style={styles.options}>
                    <Text style={styles.optionsText}>Celsius</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Fahrenheit')} style={styles.options}>
                    <Text style={styles.optionsText}>Fahrenheit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(240, 238, 233)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        gap: 16
    },
    options: {
        backgroundColor: 'rgb(112, 128, 144)',
        color: 'white',
        borderRadius: 10,
        padding: 10,
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',  
    },
    optionsContainer: {
        flexDirection: 'row',
        gap: 16
    },
    optionsText: {
        color: 'white',
        fontWeight: 'bold',
    },
    png: {
        width: 80,
        height: 80
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }
})