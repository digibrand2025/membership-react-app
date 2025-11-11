// src/screens/AdminDashboardScreen.js
import { Ionicons } from '@expo/vector-icons';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '../constants/config';
import { useAuth } from '../context/AuthContext';

const AdminDashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.replace('MemberSearch');
  };

  const menuItems = [
    { icon: 'search', title: 'Search Members', screen: 'MemberSearch', color: COLORS.primary },
    { icon: 'people', title: 'Manage Members', screen: null, color: COLORS.success },
    { icon: 'cash', title: 'Payments', screen: null, color: COLORS.warning },
    { icon: 'stats-chart', title: 'Reports', screen: null, color: COLORS.danger },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome, {user?.username}</Text>
          <Text style={styles.welcomeSubtitle}>Admin Panel</Text>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={32} color={COLORS.white} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              {!item.screen && (
                <Text style={styles.comingSoon}>Coming Soon</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    textAlign: 'center',
  },
  comingSoon: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
});

export default AdminDashboardScreen;