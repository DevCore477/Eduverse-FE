import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useTranslation } from '@/hooks/use-translation';
import { useDeviceSession } from '@/hooks/useDeviceSession';
import { DeviceSession } from '@/types/device';
import { useTheme } from '@/hooks/use-theme';

interface DeviceManagerProps {
    onClose?: () => void;
}

export const DeviceManager: React.FC<DeviceManagerProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const {
        devices,
        maxDevices,
        currentDevices,
        loading,
        error,
        logoutDevice,
        logoutOthers,
        refresh,
    } = useDeviceSession();

    const handleLogoutDevice = (device: DeviceSession) => {
        Alert.alert(
            t('deviceManager.logoutTitle') || 'Logout Device',
            t('deviceManager.logoutConfirm') || `Are you sure you want to logout ${device.deviceInfo.name}?`,
            [
                { text: t('common.cancel') || 'Cancel', style: 'cancel' },
                {
                    text: t('common.logout') || 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logoutDevice(device.deviceToken);
                        } catch (err) {
                            Alert.alert(
                                t('common.error') || 'Error',
                                t('deviceManager.logoutFailed') || 'Failed to logout device'
                            );
                        }
                    },
                },
            ]
        );
    };

    const handleLogoutOthers = () => {
        Alert.alert(
            t('deviceManager.logoutAllTitle') || 'Logout All Other Devices',
            t('deviceManager.logoutAllConfirm') || 'Are you sure you want to logout all other devices?',
            [
                { text: t('common.cancel') || 'Cancel', style: 'cancel' },
                {
                    text: t('common.logout') || 'Logout All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logoutOthers();
                        } catch (err) {
                            Alert.alert(
                                t('common.error') || 'Error',
                                t('deviceManager.logoutAllFailed') || 'Failed to logout other devices'
                            );
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const isWarningVisible = currentDevices >= maxDevices;

    if (loading && devices.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {t('deviceManager.activeDevices') || 'Active Devices'}
                </Text>
                <Text style={styles.headerSubtitle}>
                    {currentDevices}/{maxDevices}
                </Text>
            </View>

            {isWarningVisible && (
                <View style={styles.warningBanner}>
                    <Text style={styles.warningText}>
                        {t('deviceManager.deviceLimitReached') || 'Device limit reached. Upgrade your plan to add more devices.'}
                    </Text>
                </View>
            )}

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={refresh}>
                        <Text style={styles.retryText}>{t('common.retry') || 'Retry'}</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView style={styles.deviceList} showsVerticalScrollIndicator={false}>
                {devices.map((device, index) => (
                    <View key={device.deviceToken || index} style={styles.deviceCard}>
                        <View style={styles.deviceInfo}>
                            <View style={styles.deviceIconContainer}>
                                <Text style={styles.deviceIcon}>
                                    {device.deviceInfo.type === 'ios' ? '📱' : '📱'}
                                </Text>
                            </View>
                            <View style={styles.deviceDetails}>
                                <Text style={styles.deviceName}>
                                    {device.deviceInfo.name}
                                </Text>
                                <Text style={styles.deviceType}>
                                    {device.deviceInfo.model} • {device.deviceInfo.brand}
                                </Text>
                                <Text style={styles.deviceLastActive}>
                                    {t('deviceManager.lastActive') || 'Last active'}: {formatDate(device.lastActiveAt)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.deviceActions}>
                            {device.isCurrentDevice ? (
                                <View style={styles.currentDeviceBadge}>
                                    <Text style={styles.currentDeviceText}>
                                        {t('deviceManager.current') || 'Current'}
                                    </Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.logoutButton}
                                    onPress={() => handleLogoutDevice(device)}
                                >
                                    <Text style={styles.logoutButtonText}>
                                        {t('common.logout') || 'Logout'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>

            {devices.length > 1 && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.logoutAllButton}
                        onPress={handleLogoutOthers}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={styles.logoutAllButtonText}>
                                {t('deviceManager.logoutOthers') || 'Logout All Other Devices'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        flex: 1,
        minWidth: 0,
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
    },
    headerSubtitle: {
        flexShrink: 0,
        fontSize: 16,
        fontWeight: '500',
        color: '#666666',
    },
    warningBanner: {
        backgroundColor: '#FFF3CD',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    warningText: {
        color: '#856404',
        fontSize: 14,
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: '#F8D7DA',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    errorText: {
        color: '#721C24',
        fontSize: 14,
        flex: 1,
        minWidth: 0,
    },
    retryText: {
        color: '#721C24',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    deviceList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    deviceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deviceIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    deviceIcon: {
        fontSize: 24,
    },
    deviceDetails: {
        flex: 1,
        minWidth: 0,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    deviceType: {
        fontSize: 14,
        color: '#666666',
        marginTop: 2,
    },
    deviceLastActive: {
        fontSize: 12,
        color: '#999999',
        marginTop: 4,
    },
    deviceActions: {
        marginTop: 12,
        alignItems: 'flex-end',
    },
    currentDeviceBadge: {
        backgroundColor: '#D4EDDA',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    currentDeviceText: {
        color: '#155724',
        fontSize: 12,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#F8D7DA',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F5C6CB',
    },
    logoutButtonText: {
        color: '#721C24',
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    logoutAllButton: {
        backgroundColor: '#DC3545',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutAllButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default DeviceManager;
