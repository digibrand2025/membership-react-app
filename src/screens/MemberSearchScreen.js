// src/screens/MemberSearchScreen.js
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, STATUS_COLORS } from '../constants/config';
import { memberService } from '../services/api';

const MemberSearchScreen = ({ navigation }) => {
  const [membershipId, setMembershipId] = useState('');
  const [loading, setLoading] = useState(false);
  const [memberData, setMemberData] = useState(null);

  const handleSearch = async () => {
    if (!membershipId.trim()) {
      Alert.alert('Error', 'Please enter a membership ID');
      return;
    }

    setLoading(true);
    try {
      const response = await memberService.searchMember(membershipId.trim());
      if (response.success) {
        setMemberData(response);
      }
    } catch (error) {
      Alert.alert('Error', error.error || 'Failed to search member');
      setMemberData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMembershipId('');
    setMemberData(null);
  };

  const getStatusColor = (color) => {
    return STATUS_COLORS[color] || COLORS.gray;
  };

  return (
    <View style={styles.container}>
      {/* Header with curved background */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.openDrawer()}
            >
              <Ionicons name="menu" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.headerTitle}>Member Search</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Name or Member ID"
            value={membershipId}
            onChangeText={setMembershipId}
            autoCapitalize="characters"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {membershipId.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Ionicons name="close" size={18} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>

        {/* Member Card */}
        {memberData ? (
          <View style={styles.memberCard}>
            {/* Member Header */}
            <View style={styles.memberHeader}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRt1mdqvmC6uYA4T_IRy4Mhb_4rXM-w2D37gXdvhS2DMi_bJVsxIqtxm-Dt0V1qkZoqa_KaXJbuMowXDdmrMY_GkkVzPfvQpx2CgUOzuB_RaB7EsvJ8_fvrH7ztNhxiAanCDCQSqiig-997qBFH7K0isHMhSjk9fAr0FqX8sqtS09mq0PthmDewW3KRyU1q5gSymkuyQ5jSOKO8KAXkgMBNrNXaHKO3B5OxVf1qDiH5U3DfN4rYSIQ0jxmRNYKmeQH6D-JMIzmpH-W' }}
                style={styles.avatar}
              />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{memberData.member.full_name}</Text>
                <Text style={styles.memberId}>ID: {memberData.member.membership_id}</Text>
              </View>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              {/* Personal Info */}
              <DetailRow
                icon="person-outline"
                label="Personal Info"
                value={memberData.member.email || 'N/A'}
              />
              
              {/* Division */}
              <DetailRow
                icon="business-outline"
                label="Division"
                value={memberData.member.division || 'N/A'}
              />
              
              {/* Payment Info */}
              {memberData.member.last_payment_date && (
                <DetailRow
                  icon="card-outline"
                  label="Payment"
                  value={`Last: ${memberData.member.last_payment_date}`}
                />
              )}
              
              {/* Status */}
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(memberData.status.status_color) + '20' }
                  ]}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(memberData.status.status_color) }
                    ]} />
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(memberData.status.status_color) }
                    ]}>
                      {memberData.status.membership_status}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Mobile */}
              <DetailRow
                icon="call-outline"
                label="Mobile"
                value={memberData.member.mobile_number || 'N/A'}
              />

              {/* Dependents */}
              <DetailRow
                icon="people-outline"
                label="Dependents"
                value={memberData.member.dependent_count.toString()}
              />

              {/* Valid Until */}
              {memberData.status.grace_period_end && (
                <DetailRow
                  icon="calendar-outline"
                  label="Valid Until"
                  value={memberData.status.grace_period_end}
                />
              )}
            </View>
          </View>
        ) : (
          /* Empty State */
          !loading && (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={COLORS.lightGray} />
              <Text style={styles.emptyStateTitle}>No Search Results</Text>
              <Text style={styles.emptyStateText}>
                Enter a membership ID above to find member information
              </Text>
            </View>
          )
        )}

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Searching for member...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Helper Component for Detail Rows
const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIcon}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  header: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 60,
  },
  headerContent: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginBottom: 10,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: COLORS.dark,
  },
  clearButton: {
    padding: 4,
  },
  memberCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  memberId: {
    fontSize: 14,
    color: COLORS.gray,
  },
  detailsGrid: {
    gap: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: '500',
  },
});

export default MemberSearchScreen;