import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const App: React.FC = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('tab1'); // For tab navigation
  const [searchQuery, setSearchQuery] = useState<string>(''); // For search component
  const [storeImages, setStoreImages] = useState<{ name: string; data: string }[]>([]);
  const [storeLoading, setStoreLoading] = useState<boolean>(false);

  // Function to fetch image from API
  const fetchImageFromAPI = async (): Promise<void> => {
    setLoading(true);
    setError('');
    
    try {
      // Example API call - replace with your actual API endpoint
      const response = await fetch('http://192.168.1.18:8080/api/images/homeImage');
      
      if (response.ok) {
        setImageUrl(response.url);
        setShowPopup(true);
      } else {
        throw new Error('Failed to fetch image');
      }
    } catch (err: unknown) {
      setError('Failed to load image');
      Alert.alert('Error', 'Failed to load image from API');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all images
  const fetchAllImages = async (): Promise<void> => {
    setStoreLoading(true);
    try {
      const response = await fetch('http://192.168.1.18:8080/api/images/mobile');
      if (response.ok) {
        const data = await response.json();
        setStoreImages(data); // data is an array of { name, data }
      } else {
        throw new Error('Failed to fetch images');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load store images');
    } finally {
      setStoreLoading(false);
    }
  };

  // Auto-trigger popup when app opens
  useEffect(() => {
    // Small delay to show the white screen briefly
    const timer = setTimeout(fetchImageFromAPI, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide popup after 10 seconds
  useEffect(() => {
    let hideTimer: NodeJS.Timeout;

    if (showPopup) {
      hideTimer = setTimeout(() => {
        setShowPopup(false);
      }, 10000); // Hide after 10 seconds
    }

    return () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, [showPopup]);

  // Load store images when tab changes
  useEffect(() => {
    if (activeTab === 'tab2' || activeTab === 'tab1') {
      fetchAllImages();
    }
  }, [activeTab]);

  const closePopup = (): void => {
    setShowPopup(false);
  };

  const handleLogin = async (): Promise<void> => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoginLoading(true);
    
    try {
      // Simulate login API call - replace with your actual login endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Success', 'Login successful!');
      setIsLoggedIn(true);
    } catch (err) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSkipLogin = (): void => {
    setIsLoggedIn(true);
  };

  const renderLoginScreen = () => (
    <KeyboardAvoidingView 
      style={styles.loginContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Skip Login Link */}
      <TouchableOpacity style={styles.skipLink} onPress={handleSkipLogin}>
        <Text style={styles.skipLinkText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.loginScrollView}>
        <View style={styles.loginContent}>
          {/* Logo or Title */}
          <View style={styles.loginHeader}>
            <Text style={styles.loginTitle}>Modhesh</Text>
            <Text style={styles.loginSubtitle}>Welcome Back</Text>
          </View>

          {/* Login Form */}
          <View style={styles.loginForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.textInput}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, loginLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderStoreImage = ({ item }: { item: { name: string; data: string } }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.data }}
        style={styles.storeImage}
        resizeMode="cover"
      />
      {/* Optionally show the image name below */}
      {/* <Text style={{textAlign: 'center', marginTop: 4}}>{item.name}</Text> */}
    </View>
  );

  const renderMainApp = () => (
    <View style={styles.mainAppContainer}>
      {/* Search Component with Back Arrow and Clear Icon */}
      <View style={styles.searchRow}>
        <TouchableOpacity style={styles.backArrowContainer} onPress={() => setIsLoggedIn(false)}>
          <Text style={styles.backArrow}>&larr;</Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearIconContainer} onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'tab1' && styles.activeTab]}
          onPress={() => setActiveTab('tab1')}
        >
          <Text style={[styles.tabText, activeTab === 'tab1' && styles.activeTabText]}>Categories</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'tab2' && styles.activeTab]}
          onPress={() => setActiveTab('tab2')}
        >
          <Text style={[styles.tabText, activeTab === 'tab2' && styles.activeTabText]}>Stores</Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      <View style={styles.tabContent}>
        {
          <View style={styles.tab2Content}>
            {storeLoading ? (
              <ActivityIndicator size="large" color="#8d130c" />
            ) : (
              <FlatList
                data={storeImages}
                renderItem={renderStoreImage}
                keyExtractor={(item, index) => item.name || index.toString()}
                numColumns={2}
                contentContainerStyle={styles.imageGrid}
              />
            )}
          </View>
        }
      </View>
    </View>
  );

  return (
    <>
      {!isLoggedIn ? renderLoginScreen() : renderMainApp()}

      {/* Popup Modal - only show on login screen */}
      {!isLoggedIn && (
        <Modal
          visible={showPopup}
          transparent={true}
          animationType="fade"
          onRequestClose={closePopup}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={closePopup}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              {/* Image */}
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.popupImage}
                  resizeMode="cover"
                />
              ) : (
                <ActivityIndicator size="large" color="#8d130c" />
              )}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // Skip Link Styles
  skipLink: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  skipLinkText: {
    color: '#fdba0f',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.85,
    height: height * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(141, 19, 12, 0.8)',
    borderRadius: 15,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  popupImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  // Login Screen Styles
  loginContainer: {
    flex: 1,
    backgroundColor: '#8d130c',
  },
  loginScrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loginContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 50,
  },
  loginTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fdba0f',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  loginForm: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#fdba0f',
    marginBottom: 8,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  loginButton: {
    backgroundColor: '#fdba0f',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#8d130c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'underline',
    opacity: 0.8,
  },
  // Main App Styles (after login/skip)
  mainAppContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 5,
  },
  // Search Component Styles
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 1,
  },
  backArrowContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#8d130c',
    fontWeight: 'bold',
  },
  searchContainer: {
    flex: 1,
    paddingHorizontal: 2,
    paddingVertical: 1,
    backgroundColor: '#f5f5f5',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 2,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
    borderRadius: 5,
  },
  clearIconContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    fontSize: 18,
    color: '#8d130c',
    fontWeight: 'bold',
  },
  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#8d130c',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  // Tab Content Styles
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  tabContentText: {
    fontSize: 18,
    color: '#333',
  },
  tab1Content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdba0f',
  },
  tab2Content: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fdba0f',
  },
  imageGrid: {
    padding: 5,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
    maxWidth: '50%',
  },
  storeImage: {
    flex: 1,
    borderRadius: 10,
  },
});

export default App;