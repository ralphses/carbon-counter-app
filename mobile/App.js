import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './screens/Login';
import Home from './screens/Home';
import SignUp from './screens/SignUp';
import Dashboard from './screens/Dashboard';
import Profile from './screens/Profile';
import CarbonCalculator from './screens/CarbonCalculator';
import News from './screens/News';
import NewsDetail from './screens/NewsDetail';
import db from './database';


const Stack = createNativeStackNavigator();

const App = () => {
//   useEffect(() => {
//     db.createTables();
// }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='home' component={Home} options={{headerShown:false}} />
        <Stack.Screen name='login' component={Login} options={{headerShown:false}} />
        <Stack.Screen name='signup' component={SignUp} options={{headerShown:false}} />
        <Stack.Screen name='dashboard' component={Dashboard} options={{headerShown:false}} />
        <Stack.Screen name='profile' component={Profile} options={{title:"Profile"}} />
        <Stack.Screen name='calculator' component={CarbonCalculator} options={{title:"Daily Check Up"}} />
        <Stack.Screen name='news' component={News} options={{title:"Latest News"}} />
        <Stack.Screen name='newsDetail' component={NewsDetail} options={{title:"News Page"}} />

      </Stack.Navigator>
      {/* Rest of your app code */}
    </NavigationContainer>
  );
};

export default App;