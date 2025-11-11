// src/screens/MemberSearchScreen.js
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Membership Search</Text>
        <View style={styles.menuButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Card */}
        <View style={styles.searchCard}>
          <Text style={styles.searchLabel}>Enter Membership ID</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="e.g., M001"
              value={membershipId}
              onChangeText={setMembershipId}
              autoCapitalize="characters"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {membershipId.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={COLORS.gray} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Member Details Card */}
        {memberData && (
          <View style={styles.resultCard}>
            {/* Status Badge */}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(memberData.status.status_color) },
              ]}
            >
              <Text style={styles.statusText}>
                {memberData.status.membership_status}
              </Text>
            </View>

            {/* Member Info */}
            <View style={styles.infoSection}>
              <Text style={styles.memberName}>{memberData.member.full_name}</Text>
              <Text style={styles.membershipIdText}>
                ID: {memberData.member.membership_id}
              </Text>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <InfoRow
                icon="location"
                label="Division"
                value={memberData.member.division || 'N/A'}
              />
              <InfoRow
                icon="call"
                label="Mobile"
                value={memberData.member.mobile_number || 'N/A'}
              />
              <InfoRow
                icon="calendar"
                label="Date of Birth"
                value={memberData.member.date_of_birth || 'N/A'}
              />
              <InfoRow
                icon="people"
                label="Dependents"
                value={memberData.member.dependent_count.toString()}
              />
            </View>

            {/* Payment Info */}
            {memberData.member.last_payment_date && (
              <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Payment Information</Text>
                <InfoRow
                  icon="calendar-outline"
                  label="Last Payment"
                  value={memberData.member.last_payment_date}
                />
                <InfoRow
                  icon="cash"
                  label="Amount Paid"
                  value={`Rs. ${memberData.member.amount_paid || '0.00'}`}
                />
                <InfoRow
                  icon="time"
                  label="Valid Until"
                  value={memberData.status.grace_period_end || 'N/A'}
                />
                {memberData.status.days_remaining !== 0 && (
                  <InfoRow
                    icon="hourglass"
                    label="Days Remaining"
                    value={
                      memberData.status.days_remaining > 0
                        ? `${memberData.status.days_remaining} days`
                        : `Expired ${Math.abs(memberData.status.days_remaining)} days ago`
                    }
                  />
                )}
              </View>
            )}

            {/* Status Details */}
            <View style={styles.statusDetails}>
              <Ionicons name="information-circle" size={20} color={COLORS.primary} />
              <Text style={styles.statusDetailsText}>
                {memberData.status.status_details}
              </Text>
            </View>
          </View>
        )}

        {/* Empty State */}
        {!memberData && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={80} color={COLORS.gray} />
            <Text style={styles.emptyStateText}>
              Enter a membership ID to search
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Helper Component
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <Ionicons name={icon} size={18} color={COLORS.gray} />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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
    width: 44,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: COLORS.dark,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  memberName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  membershipIdText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  detailsGrid: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
  paymentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  statusDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    padding: 12,
    borderRadius: 8,
  },
  statusDetailsText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.dark,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 16,
  },
});

export default MemberSearchScreen;