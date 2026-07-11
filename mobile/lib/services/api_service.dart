import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static String get baseUrl {
<<<<<<< HEAD
    if (kReleaseMode) {
      return 'https://internshub-06.up.railway.app/api';
    }
    if (kIsWeb) {
      return 'http://localhost:5000/api';
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:5000/api';
    }
    return 'http://localhost:5000/api';
=======
    return 'https://internshub-06.up.railway.app/api/';
>>>>>>> 5ad54ac356437c46391d42f18547dd0a7250531b
  }

  late Dio _dio;

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Add interceptors for automatic JWT injection
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('token');
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) async {
        if (e.response?.statusCode == 401) {
          // Token expired or invalid
          final prefs = await SharedPreferences.getInstance();
          await prefs.remove('token');
        }
        return handler.next(e);
      },
    ));
  }

  Dio get client => _dio;

  // GET Request
  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) async {
    try {
      return await _dio.get(path, queryParameters: queryParameters);
    } catch (e) {
      rethrow;
    }
  }

  // POST Request
  Future<Response> post(String path, {dynamic data}) async {
    try {
      return await _dio.post(path, data: data);
    } catch (e) {
      rethrow;
    }
  }

  // PUT Request
  Future<Response> put(String path, {dynamic data}) async {
    try {
      return await _dio.put(path, data: data);
    } catch (e) {
      rethrow;
    }
  }

  // DELETE Request
  Future<Response> delete(String path, {dynamic data}) async {
    try {
      return await _dio.delete(path, data: data);
    } catch (e) {
      rethrow;
    }
  }

  Future<Response> postMultipart(String path, FormData formData) async {
    try {
      return await _dio.post(
        path,
        data: formData,
      );
    } catch (e) {
      rethrow;
    }
  }
}

// Global single instance of ApiService
final apiService = ApiService();
