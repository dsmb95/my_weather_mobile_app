import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from './screens/Home.js';
import Celsius from './screens/Celsius.js';
import Fahrenheit from './screens/Fahrenheit.js'

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
      <NavigationContainer style={styles.container}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Celsius" component={Celsius} />
          <Stack.Screen name="Fahrenheit" component={Fahrenheit} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
