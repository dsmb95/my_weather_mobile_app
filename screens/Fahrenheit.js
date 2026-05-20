import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';

export default function Fahrenheit({navigation}) {
    const [weather, setWeather] = useState(null);
    const [inputLoc, setInputLoc] = useState("");
    const [location, setLocation] = useState("");
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(true);
    const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
    
    useEffect(() => {
        if (!location || !API_KEY) {
            return;
        }

        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to look up that location right now.")
            }
            return response.json();
        })
        .then(data => {
            if (!data.length) throw new Error ("Location not found.")
            setLat(data[0].lat);
            setLon(data[0].lon);
        })
        .catch(err => {
            setError(err.message);
            setWeather(null);
            setLoading(false);
        })
    },[location, API_KEY]);

    useEffect(() => {
        if (!lat || !lon || !API_KEY) {
            return;
        }

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`)
        .then(response => {
            if (!response.ok) throw new Error ("Weather data is unavailable right now.");
            return response.json();
        })
        .then(data => {
            if (!data.main) throw new Error ("Weather data is unavailable right now.")
            
                setWeather({
                    temp: data.main.temp,
                    humidity: data.main.humidity,
                    feels_like: data.main.feels_like,
                    description: data.weather[0].description,
                    weather_icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                })
            setLoading(false);  
        })
        .catch(err => {
            setError(err.message);
            setWeather(null);
            setLoading(false);
        })
    }, [lat, lon, API_KEY])

    const handleSubmit = () => {
        setLoading(true);
        setError(null);
        setWeather(null);
        setLat(null);
        setLon(null);
        setLocation(inputLoc);
        setInputLoc('');
        setShow(false);
    }

    if (loading) return <ActivityIndicator size='large' color='blue'/>
    if (error) return <Text>{error}</Text>

    return (
        <View style={styles.container}>
            {show && (
                <View style={styles.introContainer}>
                    <Text style={{fontSize: 35, fontWeight: 'bold'}}>°F</Text>
                    <Text>Type a city to see weather details.</Text>
                    <TextInput value={inputLoc} placeholder="City" onChangeText={setInputLoc} style={styles.input}/>
                    <TouchableOpacity onPress={handleSubmit} style={styles.submit}>
                        <Text style={styles.submitText}>Search</Text>
                    </TouchableOpacity>
                </View>
            )}
            
            {weather && (
                <View style={styles.weatherContainer}>
                    <Text style={styles.locationName}>{location.charAt(0).toLocaleUpperCase() + location.slice(1)}</Text>
                    <Text>You will experience {weather.description}</Text>
                    <Image source={{uri: weather.weather_icon}} style={{width: 50, height: 50}}/>
                    <Text>Feels Like: {weather.feels_like} °F</Text>
                    <Text>Temperature: {weather.temp} °F</Text>
                    <Text>Humidity: {weather.humidity}%</Text>
                    <TouchableOpacity onPress={() => setShow(true)} style={styles.searchAgain}>
                        <Text>Search Again</Text>
                    </TouchableOpacity>
                </View>
            )}
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        backgroundColor: 'rgb(240, 238, 233)'
    },
    introContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    submit: {
        backgroundColor: 'rgb(112, 128, 144)',
        borderRadius: 10,
        padding: 10
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
    },
    weatherContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12, 
        padding: 50,
        backgroundColor: 'rgb(112, 128, 144)',
        borderRadius: 10,
    },
    locationName: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    searchAgain: {
        backgroundColor: 'rgb(240, 238, 233)',
        borderRadius: 10,
        padding: 10,
    },
    input: {
        height: 50,
        borderColor: '#3498db',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
        color: '#333',
    },
})