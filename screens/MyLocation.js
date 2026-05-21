import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';

import * as Location from 'expo-location';

export default function MyLocation({route}) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [city, setCity] = useState(null);
   
    const { unit } = route.params;
    const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
    const displayUnit = unit === 'metric' ? 'metric' : 'imperial'

    useEffect(() => {
        async function getCurrentLocation() {
        
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLat(currentLocation.coords.latitude);
            setLon(currentLocation.coords.longitude);
        
        }
        getCurrentLocation();
    }, []);

    useEffect(() => {
        if (lat === null || lon === null) return;
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${displayUnit}&appid=${API_KEY}`)
        .then(response => {
            if (!response.ok){
                throw new Error("Weather data is unavailable right now.")
            }
            return response.json();
        })
        .then(data => {
            if (!data.main) {
                throw new Error("Weather data is unavailable right now.")
            }

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
    
    }, [API_KEY, lat, lon])

    useEffect(() => {
        if (lat === null || lon === null || !API_KEY) return;
        
        fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${API_KEY}`)
        .then(response => {
            if (!response.ok) throw new Error ("Failed to fetch location.")
            return response.json();
        })
        .then(data => {
            if (!data.length) throw new Error ("City not available.");
            setCity(data[0].name);
        })
        .catch(err => {
            setError(err.message);
        })
    }, [lat, lon, API_KEY])

    if (loading) return <ActivityIndicator size='large' color='blue'/>
    if (error) return <Text>{error}</Text>

  return (
    <View style={styles.container}>
        {weather && (
            <View style={styles.weatherContainer}>
                <Text style={styles.locationName}>{ city ? city.charAt(0).toLocaleUpperCase() + city.slice(1) : 'My Location'}</Text>
                <Text>You will experience {weather.description}</Text>
                <Image source={{uri: weather.weather_icon}} style={{width: 50, height: 50}}/>
                <Text>Feels Like: {weather.feels_like} {displayUnit === 'metric' ? '°C' : '°F'}</Text>
                <Text>Temperature: {weather.temp} {displayUnit === 'metric' ? '°C' : '°F'}</Text>
                <Text>Humidity: {weather.humidity}%</Text>
            </View>
        )}
    </View>
  );
};

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


