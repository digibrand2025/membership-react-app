// App.js (ROOT FILE - Replace everything)
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from './src/constants/config';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Import Screens
import LoadingSpinner from './src/components/LoadingSpinner';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import CollectorDashboardScreen from './src/screens/CollectorDashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import MemberSearchScreen from './src/screens/MemberSearchScreen';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content
function CustomDrawerContent({ navigation }) {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.navigate('MemberSearch');
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerLogo}>RDW</Text>
        <Text style={styles.drawerSubtitle}>Membership System</Text>
      </View>

      <View style={styles.drawerContent}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate('MemberSearch')}
        >
          <Ionicons name="search" size={24} color={COLORS.dark} />
          <Text style={styles.drawerItemText}>Search Members</Text>
        </TouchableOpacity>

        {isAuthenticated ? (
          <>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                if (user?.role === 'admin') {
                  navigation.navigate('AdminDashboard');
                } else if (user?.role === 'collector') {
                  navigation.navigate('CollectorDashboard');
                }
              }}
            >
              <Ionicons name="grid" size={24} color={COLORS.dark} />
              <Text style={styles.drawerItemText}>Dashboard</Text>
            </TouchableOpacity>

            <View style={styles.drawerDivider} />

            <View style={styles.drawerUserInfo}>
              <Text style={styles.drawerUserName}>{user?.username}</Text>
              <Text style={styles.drawerUserRole}>
                {user?.role === 'admin' ? 'Administrator' : 'Collector'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.drawerItem, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={24} color={COLORS.danger} />
              <Text style={[styles.drawerItemText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="log-in" size={24} color={COLORS.primary} />
            <Text style={styles.drawerItemText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.drawerFooter}>
        <Text style={styles.drawerFooterText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

// Drawer Navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="MemberSearch" component={MemberSearchScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Drawer.Screen name="CollectorDashboard" component={CollectorDashboardScreen} />
    </Drawer.Navigator>
  );
}

// Main Stack Navigator
function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Main" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}

// App Component with Auth Provider
function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  drawerHeader: {
    backgroundColor: COLORS.primary,
    padding: 30,
    paddingTop: 60,
  },
  drawerLogo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 3,
  },
  drawerSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  drawerContent: {
    flex: 1,
    paddingVertical: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  drawerItemText: {
    fontSize: 16,
    color: COLORS.dark,
    marginLeft: 16,
    fontWeight: '500',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: COLORS.light,
    marginVertical: 16,
    marginHorizontal: 24,
  },
  drawerUserInfo: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.light,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  drawerUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  drawerUserRole: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 8,
  },
  logoutText: {
    color: COLORS.danger,
  },
  drawerFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  drawerFooterText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
});