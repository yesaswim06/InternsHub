import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import 'package:http_parser/http_parser.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  Map<String, dynamic>? _user;
  bool _loading = false;
  bool _initialized = false;

  Map<String, dynamic>? get user => _user;
  bool get loading => _loading;
  bool get initialized => _initialized;
  bool get isAuthenticated => _user != null;

  AuthProvider() {
    _initSession();
  }

  // Initialize and check persistent token session on app startup
  Future<void> _initSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    
    if (token != null && token.isNotEmpty) {
      await loadProfile();
    }
    
    _initialized = true;
    notifyListeners();
  }

  // Fetch full user profile details from backend
  Future<bool> loadProfile() async {
    _loading = true;
    notifyListeners();

    try {
      final response = await apiService.get('/auth/profile');
      if (response.data['success'] == true) {
        _user = response.data['user'];
        notifyListeners();
        return true;
      }
    } catch (e) {
      print('Load Profile Error: $e');
      await logout();
    } finally {
      _loading = false;
      notifyListeners();
    }
    return false;
  }

  // Log in user with email & password
  Future<Map<String, dynamic>> login(String email, String password) async {
    _loading = true;
    notifyListeners();

    try {
      final response = await apiService.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.data['success'] == true) {
        final token = response.data['token'];
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', token);
        
        // Load the full profile
        await loadProfile();
        
        return {'success': true};
      }
      return {'success': false, 'error': 'Failed to authenticate'};
    } on DioException catch (e) {
      String errorMsg = 'Login failed. Please check your credentials.';
      if (e.response != null && e.response!.data != null && e.response!.data is Map && e.response!.data['error'] != null) {
        errorMsg = e.response!.data['error'].toString();
      } else if (e.type == DioExceptionType.connectionError || e.type == DioExceptionType.connectionTimeout) {
        errorMsg = 'Cannot reach backend server. Please make sure the server is running on port 5000.';
      }
      return {'success': false, 'error': errorMsg};
    } catch (e) {
      return {'success': false, 'error': 'Network connection error'};
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  // Register a new user (Student or Company)
  Future<Map<String, dynamic>> registerUser(Map<String, dynamic> registrationData) async {
    _loading = true;
    notifyListeners();

    try {
      final response = await apiService.post('/auth/register', data: registrationData);

      if (response.data['success'] == true) {
        final token = response.data['token'];
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', token);
        
        await loadProfile();
        
        return {'success': true};
      }
      return {'success': false, 'error': 'Registration failed'};
    } on DioException catch (e) {
      String errorMsg = 'Signup failed. Please try again.';
      if (e.response != null && e.response!.data != null && e.response!.data is Map && e.response!.data['error'] != null) {
        errorMsg = e.response!.data['error'].toString();
      } else if (e.type == DioExceptionType.connectionError || e.type == DioExceptionType.connectionTimeout) {
        errorMsg = 'Cannot reach backend server. Please make sure the server is running on port 5000.';
      }
      return {'success': false, 'error': errorMsg};
    } catch (e) {
      return {'success': false, 'error': 'Network connection error'};
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  // Upload/Update Student Resume PDF document
  Future<bool> uploadStudentResume({
    List<int>? bytes,
    required String fileName,
    String? filePath,
  }) async {
    _loading = true;
    notifyListeners();

    try {
      MultipartFile file;
      if (bytes != null) {
        file = MultipartFile.fromBytes(
          bytes,
          filename: fileName,
          contentType: MediaType('application', 'pdf'),
        );
      } else if (filePath != null) {
        file = await MultipartFile.fromFile(
          filePath,
          filename: fileName,
          contentType: MediaType('application', 'pdf'),
        );
      } else {
        return false;
      }

      final formData = FormData.fromMap({
        'resume': file,
      });

      final response = await apiService.postMultipart('/students/resume', formData);
      if (response.data['success'] == true) {
        await loadProfile();
        return true;
      }
    } catch (e) {
      print('Upload Resume Error: $e');
    } finally {
      _loading = false;
      notifyListeners();
    }
    return false;
  }

  // Update Company Logo image
  Future<bool> uploadCompanyLogo({
    List<int>? bytes,
    required String fileName,
    String? filePath,
  }) async {
    _loading = true;
    notifyListeners();

    try {
      String mimeType = 'image/jpeg';
      if (fileName.endsWith('.png')) mimeType = 'image/png';
      if (fileName.endsWith('.webp')) mimeType = 'image/webp';

      MultipartFile file;
      if (bytes != null) {
        file = MultipartFile.fromBytes(
          bytes,
          filename: fileName,
          contentType: MediaType.parse(mimeType),
        );
      } else if (filePath != null) {
        file = await MultipartFile.fromFile(
          filePath,
          filename: fileName,
          contentType: MediaType.parse(mimeType),
        );
      } else {
        return false;
      }

      final formData = FormData.fromMap({
        'logo': file,
      });

      final response = await apiService.postMultipart('/company/logo', formData);
      if (response.data['success'] == true) {
        await loadProfile(); // refresh company details
        return true;
      }
    } catch (e) {
      print('Upload Logo Error: $e');
    } finally {
      _loading = false;
      notifyListeners();
    }
    return false;
  }

  // Clear session data and logout
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    _user = null;
    notifyListeners();
  }
}
