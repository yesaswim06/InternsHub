import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/premium_toast.dart';

class RegisterView extends StatefulWidget {
  const RegisterView({super.key});

  @override
  State<RegisterView> createState() => _RegisterViewState();
}

class _RegisterViewState extends State<RegisterView> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  String _role = 'student'; // 'student' or 'company'

  // Company profile controllers
  final _companyNameController = TextEditingController();
  final _locationController = TextEditingController();
  final _websiteController = TextEditingController();
  final _descriptionController = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _companyNameController.dispose();
    _locationController.dispose();
    _websiteController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final payload = {
      'name': _nameController.text.trim(),
      'email': _emailController.text.trim(),
      'password': _passwordController.text.trim(),
      'role': _role,
    };

    if (_role == 'company') {
      payload['companyName'] = _companyNameController.text.trim();
      payload['location'] = _locationController.text.trim();
      payload['website'] = _websiteController.text.trim();
      payload['description'] = _descriptionController.text.trim();
    }

    final result = await authProvider.registerUser(payload);

    if (mounted) {
      if (result['success'] == true) {
        showPremiumToast(context, 'Registered successfully!', isError: false);
        Navigator.popUntil(context, (route) => route.isFirst);
      } else {
        showPremiumToast(context, result['error'] ?? 'Registration failed', isError: true);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF0B0F19), // Midnight Black
              Color(0xFF1E1B4B), // Deep Indigo
              Color(0xFF2E1065), // Dark Violet
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Back Action
                    Align(
                      alignment: Alignment.topLeft,
                      child: IconButton(
                        icon: const Icon(LucideIcons.arrowLeft, color: Colors.white70),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Center(
                      child: Text(
                        'Create Account',
                        style: TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          letterSpacing: -0.5,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Glassmorphic Card Container
                    GlassCard(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Role Choice Toggle Chips
                          Row(
                            children: [
                              Expanded(
                                child: ChoiceChip(
                                  label: const Center(child: Text('Student', style: TextStyle(fontWeight: FontWeight.bold))),
                                  selected: _role == 'student',
                                  onSelected: (val) => setState(() => _role = 'student'),
                                  selectedColor: const Color(0xFF8B5CF6).withOpacity(0.3),
                                  backgroundColor: Colors.white.withOpacity(0.05),
                                  labelStyle: TextStyle(
                                    color: _role == 'student' ? const Color(0xFFA78BFA) : Colors.white60,
                                    fontSize: 13,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                    side: BorderSide(
                                      color: _role == 'student' ? const Color(0xFF8B5CF6).withOpacity(0.5) : Colors.transparent,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: ChoiceChip(
                                  label: const Center(child: Text('Company', style: TextStyle(fontWeight: FontWeight.bold))),
                                  selected: _role == 'company',
                                  onSelected: (val) => setState(() => _role = 'company'),
                                  selectedColor: const Color(0xFF8B5CF6).withOpacity(0.3),
                                  backgroundColor: Colors.white.withOpacity(0.05),
                                  labelStyle: TextStyle(
                                    color: _role == 'company' ? const Color(0xFFA78BFA) : Colors.white60,
                                    fontSize: 13,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                    side: BorderSide(
                                      color: _role == 'company' ? const Color(0xFF8B5CF6).withOpacity(0.5) : Colors.transparent,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),

                          // Full Name
                          const Text('Full Name', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE2E8F0))),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _nameController,
                            style: const TextStyle(color: Colors.white, fontSize: 14),
                            validator: (value) => value == null || value.trim().isEmpty ? 'Please add your name' : null,
                            decoration: _inputDecoration(LucideIcons.user, 'John Doe'),
                          ),
                          const SizedBox(height: 16),

                          // Email
                          const Text('Email Address', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE2E8F0))),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            style: const TextStyle(color: Colors.white, fontSize: 14),
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) return 'Please add your email';
                              if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value.trim())) {
                                    return 'Please add a valid email';
                              }
                              return null;
                            },
                            decoration: _inputDecoration(LucideIcons.mail, 'name@example.com'),
                          ),
                          const SizedBox(height: 16),

                          // Password
                          const Text('Password', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE2E8F0))),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _passwordController,
                            obscureText: _obscurePassword,
                            style: const TextStyle(color: Colors.white, fontSize: 14),
                            validator: (value) => value == null || value.length < 6 ? 'Password must be at least 6 characters' : null,
                            decoration: _inputDecoration(
                              LucideIcons.lock,
                              '••••••••',
                              suffix: IconButton(
                                icon: Icon(
                                  _obscurePassword ? LucideIcons.eyeOff : LucideIcons.eye,
                                  size: 18,
                                  color: Colors.white70,
                                ),
                                onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Confirm Password
                          const Text('Confirm Password', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE2E8F0))),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _confirmPasswordController,
                            obscureText: _obscureConfirmPassword,
                            style: const TextStyle(color: Colors.white, fontSize: 14),
                            validator: (value) {
                              if (value == null || value.isEmpty) return 'Please confirm your password';
                              if (value != _passwordController.text) return 'Passwords do not match';
                              return null;
                            },
                            decoration: _inputDecoration(
                              LucideIcons.lock,
                              '••••••••',
                              suffix: IconButton(
                                icon: Icon(
                                  _obscureConfirmPassword ? LucideIcons.eyeOff : LucideIcons.eye,
                                  size: 18,
                                  color: Colors.white70,
                                ),
                                onPressed: () => setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
                              ),
                            ),
                          ),

                          // Dynamic Company Profile Fields
                          if (_role == 'company') ...[
                            const SizedBox(height: 24),
                            const Divider(color: Colors.white24, height: 1),
                            const SizedBox(height: 20),

                            const Text('Company Name', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE2E8F0))),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: _companyNameController,
                              style: const TextStyle(color: Colors.white, fontSize: 14),
                              validator: (val) => _role == 'company' && (val == null || val.trim().isEmpty) ? 'Please enter company name' : null,
                              decoration: _inputDecoration(LucideIcons.building, 'Acme Software Corp'),
                            ),
                            const SizedBox(height: 16),

                            const Text('Headquarters Location', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE2E8F0))),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: _locationController,
                              style: const TextStyle(color: Colors.white, fontSize: 14),
                              validator: (val) => _role == 'company' && (val == null || val.trim().isEmpty) ? 'Please enter location' : null,
                              decoration: _inputDecoration(LucideIcons.mapPin, 'San Francisco, CA'),
                            ),
                            const SizedBox(height: 16),

                            const Text('Company Website', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE2E8F0))),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: _websiteController,
                              style: const TextStyle(color: Colors.white, fontSize: 14),
                              decoration: _inputDecoration(LucideIcons.globe, 'https://example.com'),
                            ),
                            const SizedBox(height: 16),

                            const Text('Company Description', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE2E8F0))),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: _descriptionController,
                              maxLines: 3,
                              style: const TextStyle(color: Colors.white, fontSize: 14),
                              validator: (val) => _role == 'company' && (val == null || val.trim().isEmpty) ? 'Please enter description' : null,
                              decoration: InputDecoration(
                                hintText: 'Tell us about your organization...',
                                hintStyle: const TextStyle(color: Colors.white38),
                                filled: true,
                                fillColor: Colors.white.withOpacity(0.05),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: const BorderSide(color: Color(0xFFA78BFA), width: 1.5),
                                ),
                              ),
                            ),
                          ],
                          const SizedBox(height: 32),

                          // Submit Button
                          ElevatedButton(
                            onPressed: authProvider.loading ? null : _handleRegister,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF8B5CF6),
                              foregroundColor: Colors.white,
                              minimumSize: const Size(double.infinity, 52),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              elevation: 0,
                            ),
                            child: authProvider.loading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                                  )
                                : const Text('Sign Up', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Link to Login
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Already have an account? ",
                          style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                        ),
                        GestureDetector(
                          onTap: () => Navigator.pushReplacementNamed(context, '/login'),
                          child: const Text(
                            'Sign In',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFFA78BFA),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(IconData prefix, String hint, {Widget? suffix}) {
    return InputDecoration(
      prefixIcon: Icon(prefix, size: 18, color: Colors.white70),
      suffixIcon: suffix,
      hintText: hint,
      hintStyle: const TextStyle(color: Colors.white38),
      filled: true,
      fillColor: Colors.white.withOpacity(0.05),
      contentPadding: const EdgeInsets.symmetric(vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFA78BFA), width: 1.5),
      ),
    );
  }
}
