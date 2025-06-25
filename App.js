import { NavigationContainer } from '@react-navigation/native'
import RootStack from './navigation/RootStack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import "./global.css"

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <RootStack />
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
