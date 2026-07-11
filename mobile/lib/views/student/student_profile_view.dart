import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter/foundation.dart' show kIsWeb, kReleaseMode;
import '../../providers/auth_provider.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/premium_toast.dart';
import '../../main.dart'; // import ThemeProvider & ThemeNotifier

class StudentProfileView extends StatefulWidget {
  final VoidCallback? onProfileSaved;

  const StudentProfileView({super.key, this.onProfileSaved});

  @override
  State<StudentProfileView> createState() => _StudentProfileViewState();
}

class _StudentProfileViewState extends State<StudentProfileView> {
  bool _saving = false;



  Future<void> _launchWebProfile() async {
    final String url = kReleaseMode
        ? 'https://internshub-06.vercel.app/dashboard/student/profile'
        : (kIsWeb 
            ? 'http://localhost:5173/dashboard/student/profile'
            : 'http://10.0.2.2:5173/dashboard/student/profile');

    final uri = Uri.parse(url);
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        if (mounted) {
          showPremiumToast(context, 'Could not open web profile page', isError: true);
        }
      }
    } catch (e) {
      if (mounted) {
        showPremiumToast(context, 'Error launching web browser: $e', isError: true);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    final user = authProvider.user;
    final profile = user?['profile'] ?? {};
    final resume = profile['resume'];
    final bio = profile['bio'] ?? 'No bio description added yet.';
    final List<String> skills = List<String>.from(profile['skills'] ?? []);
    final List<dynamic> education = List<dynamic>.from(profile['education'] ?? []);
    
    final isDark = themeProvider.isDarkMode;

    final titleColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final subColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: _saving
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF8B5CF6)))
                : const Icon(LucideIcons.refreshCw),
            onPressed: _saving ? null : () async {
              setState(() => _saving = true);
              await authProvider.loadProfile();
              setState(() => _saving = false);
              if (mounted) {
                showPremiumToast(context, 'Profile synced successfully!', isError: false);
              }
            },
            tooltip: 'Sync Changes from Server',
          )
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isDark 
                ? [const Color(0xFF0B0F19), const Color(0xFF1E1B4B), const Color(0xFF2E1065)]
                : [const Color(0xFFF8FAFC), const Color(0xFFE0E7FF), const Color(0xFFF3E8FF)],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // User summary header card
                GlassCard(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 40,
                        backgroundColor: const Color(0xFF8B5CF6).withOpacity(0.15),
                        child: Text(
                          user?['name'] != null ? user!['name'][0].toUpperCase() : 'U',
                          style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Color(0xFF8B5CF6)),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        user?['name'] ?? '',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: titleColor),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        user?['email'] ?? '',
                        style: TextStyle(fontSize: 13, color: subColor),
                      ),
                      const SizedBox(height: 20),
                      const Divider(color: Colors.white24, height: 1),
                      const SizedBox(height: 16),
                      
                      // Redirection Call-To-Action Button
                      ElevatedButton.icon(
                        onPressed: _launchWebProfile,
                        icon: const Icon(LucideIcons.externalLink, size: 16),
                        label: const Text('Edit Profile on Web', style: TextStyle(fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF8B5CF6),
                          foregroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 48),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          elevation: 0,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Resume details card
                Text(
                  'Resume Details',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: titleColor, fontFamily: 'Outfit'),
                ),
                const SizedBox(height: 10),
                GlassCard(
                  padding: const EdgeInsets.all(20.0),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.fileText, size: 28, color: Color(0xFF8B5CF6)),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'PDF CV Document',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: titleColor),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              resume != null && resume.toString().isNotEmpty
                                  ? '✓ Available on server'
                                  : 'No resume document uploaded.',
                              style: TextStyle(
                                fontSize: 12,
                                color: resume != null && resume.toString().isNotEmpty 
                                    ? Colors.green 
                                    : Colors.redAccent,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Professional Bio (Read-Only Summary Display)
                Text(
                  'Professional Biography',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: titleColor, fontFamily: 'Outfit'),
                ),
                const SizedBox(height: 10),
                GlassCard(
                  padding: const EdgeInsets.all(20.0),
                  child: SizedBox(
                    width: double.infinity,
                    child: Text(
                      bio,
                      style: TextStyle(color: titleColor, fontSize: 13.5, height: 1.5),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Technical Skills tags (Read-Only Chips display)
                Text(
                  'Technical Skills',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: titleColor, fontFamily: 'Outfit'),
                ),
                const SizedBox(height: 10),
                GlassCard(
                  padding: const EdgeInsets.all(20.0),
                  child: SizedBox(
                    width: double.infinity,
                    child: skills.isEmpty
                        ? Text('No skills listed yet.', style: TextStyle(color: subColor, fontSize: 13))
                        : Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: skills.map((skill) {
                              return Chip(
                                label: Text(skill, style: TextStyle(fontSize: 11, color: isDark ? Colors.white : const Color(0xFF1E293B))),
                                backgroundColor: isDark ? Colors.white.withOpacity(0.05) : Colors.white,
                                side: BorderSide(color: isDark ? Colors.white12 : const Color(0xFFE2E8F0)),
                              );
                            }).toList(),
                          ),
                  ),
                ),
                const SizedBox(height: 24),

                // Education History (Read-Only items display)
                Text(
                  'Education History',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: titleColor, fontFamily: 'Outfit'),
                ),
                const SizedBox(height: 10),
                if (education.isEmpty)
                  GlassCard(
                    padding: const EdgeInsets.symmetric(vertical: 24),
                    child: Center(
                      child: Text(
                        'No education details added yet.',
                        style: TextStyle(fontSize: 12, color: subColor),
                      ),
                    ),
                  )
                else
                  Column(
                    children: List.generate(education.length, (index) {
                      final edu = education[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: GlassCard(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            children: [
                              const Icon(LucideIcons.graduationCap, color: Color(0xFF8B5CF6), size: 20),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      edu['institution'] ?? '',
                                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: titleColor),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '${edu['degree'] ?? ''} • Class of ${edu['year'] ?? ''}',
                                      style: TextStyle(fontSize: 12, color: subColor),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                  ),
                const SizedBox(height: 48),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
