import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'providers/auth_provider.dart';
import 'views/landing_view.dart';
import 'views/login_view.dart';
import 'views/register_view.dart';

// Role Main navigation Containers
import 'views/student/student_main_container.dart';
import 'views/company/company_main_container.dart';
import 'views/admin/admin_main_container.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: const InternsHubApp(),
    ),
  );
}

class ThemeProvider extends ChangeNotifier {
  ThemeMode get themeMode => ThemeMode.light;
  bool get isDarkMode => false;

  Future<void> toggleTheme() async {
    // Keep Light mode only as requested
  }
}

class InternsHubApp extends StatelessWidget {
  const InternsHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return MaterialApp(
      title: 'InternsHub',
      debugShowCheckedModeBanner: false,
      themeMode: themeProvider.themeMode,
      
      // Premium iOS light theme
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorScheme: ColorScheme.fromSeed(
          brightness: Brightness.light,
          seedColor: const Color(0xFF8B5CF6),
          primary: const Color(0xFF8B5CF6),
          secondary: const Color(0xFF6D28D9),
          surface: Colors.white,
          background: const Color(0xFFF8FAFC),
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.light().textTheme),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          elevation: 0,
          scrolledUnderElevation: 0,
          iconTheme: IconThemeData(color: Color(0xFF1E293B)),
          centerTitle: true,
          titleTextStyle: TextStyle(color: Color(0xFF1E293B), fontSize: 18, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
        ),
      ),
      
      // Premium iOS dark theme (Midnight + Aubergine)
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
          brightness: Brightness.dark,
          seedColor: const Color(0xFF8B5CF6),
          primary: const Color(0xFF8B5CF6),
          secondary: const Color(0xFFA78BFA),
          surface: const Color(0xFF0F172A),
          background: const Color(0xFF030712),
        ),
        scaffoldBackgroundColor: const Color(0xFF030712),
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
          scrolledUnderElevation: 0,
          iconTheme: IconThemeData(color: Colors.white),
          centerTitle: true,
          titleTextStyle: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
        ),
      ),
      
      home: const AuthWrapper(),
      routes: {
        '/login': (_) => const LoginView(),
        '/register': (_) => const RegisterView(),
      },
    );
  }
}

// Reactively handles routing based on authentication states and roles
class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;

    // Premium iOS Splash Loading Screen
    if (!authProvider.initialized) {
      return Scaffold(
        body: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: isDark 
                  ? [const Color(0xFF0B0F19), const Color(0xFF1E1B4B), const Color(0xFF2E1065)]
                  : [const Color(0xFFF1F5F9), const Color(0xFFE0E7FF), const Color(0xFFF3E8FF)],
            ),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Pulsing Logo Icon
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: const Color(0xFF8B5CF6).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: const Color(0xFF8B5CF6).withOpacity(0.4),
                      width: 1.5,
                    ),
                  ),
                  child: const Icon(
                    LucideIcons.graduationCap,
                    color: Color(0xFF8B5CF6),
                    size: 40,
                  ),
                ),
                const SizedBox(height: 24),
                
                // Brand Text
                Text(
                  'InternsHub',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Connecting Future Leaders',
                  style: TextStyle(
                    fontSize: 14,
                    color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                  ),
                ),
                const SizedBox(height: 48),
                
                // Clean loading spinner
                const SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.5,
                    valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF8B5CF6)),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (!authProvider.isAuthenticated) {
      return const LandingView();
    }

    final role = authProvider.user?['role'];
    
    if (role == 'student') {
      return const StudentMainContainer();
    } else if (role == 'company') {
      return const CompanyMainContainer();
    } else if (role == 'admin') {
      return const AdminMainContainer();
    }

    // Default fallback to Landing if role mismatch
    return const LandingView();
  }
}
