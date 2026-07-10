import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../../widgets/glass_card.dart';
import '../../main.dart'; // import ThemeProvider

class StudentDashboardView extends StatefulWidget {
  const StudentDashboardView({super.key});

  @override
  State<StudentDashboardView> createState() => _StudentDashboardViewState();
}

class _StudentDashboardViewState extends State<StudentDashboardView> {
  int _appliedCount = 0;
  int _savedCount = 0;
  int _interviewsCount = 0;
  List<dynamic> _recentApplied = [];
  List<dynamic> _upcomingInterviews = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchDashboardData();
  }

  Future<void> _fetchDashboardData() async {
    try {
      final appliedRes = await apiService.get('/internships/student/applied');
      final bookmarksRes = await apiService.get('/internships/student/bookmarks');

      if (appliedRes.data['success'] == true && bookmarksRes.data['success'] == true) {
        final List<dynamic> applied = appliedRes.data['data'];
        final List<dynamic> bookmarks = bookmarksRes.data['data'];

        final interviews = applied.where((app) => app['status'] == 'interview_scheduled').toList();

        setState(() {
          _appliedCount = applied.length;
          _savedCount = bookmarks.length;
          _interviewsCount = interviews.length;
          _recentApplied = applied.take(3).toList();
          _upcomingInterviews = interviews;
        });
      }
    } catch (e) {
      print('Dashboard Data Fetch Error: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  int _calculateProfileCompleteness(Map<String, dynamic>? profile) {
    if (profile == null) return 0;
    int score = 0;
    if (profile['bio'] != null && profile['bio'].toString().trim().isNotEmpty) score += 25;
    if (profile['skills'] != null && (profile['skills'] as List).isNotEmpty) score += 25;
    if (profile['resume'] != null && profile['resume'].toString().trim().isNotEmpty) score += 25;
    if (profile['education'] != null && (profile['education'] as List).isNotEmpty) score += 25;
    return score;
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    final user = authProvider.user;
    final completeness = _calculateProfileCompleteness(user?['profile']);

    final isDark = themeProvider.isDarkMode;

    final titleColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final subColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Overview', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.logOut),
            onPressed: () async {
              await authProvider.logout();
              if (mounted) Navigator.pushReplacementNamed(context, '/login');
            },
            tooltip: 'Sign Out',
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
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : RefreshIndicator(
                onRefresh: _fetchDashboardData,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Welcome Banner Card
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF8B5CF6).withOpacity(0.3),
                              blurRadius: 15,
                              offset: const Offset(0, 8),
                            )
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Welcome back, ${user?['name'] ?? 'Student'}!',
                              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white, fontFamily: 'Outfit'),
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              'Manage listings, track interview coordinates, and prepare your applications.',
                              style: TextStyle(fontSize: 13, color: Color(0xFFEDE9FE), height: 1.4),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Metrics Row (Dynamic Glass Cards)
                      Row(
                        children: [
                          Expanded(
                            child: _buildMetricCard('Applied', _appliedCount.toString(), LucideIcons.briefcase, Colors.blue, isDark, titleColor),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildMetricCard('Saved', _savedCount.toString(), LucideIcons.bookmark, Colors.indigo, isDark, titleColor),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildMetricCard('Interviews', _interviewsCount.toString(), LucideIcons.calendar, Colors.purple, isDark, titleColor),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Profile Completeness Glass Card
                      GlassCard(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Profile Completeness', style: TextStyle(fontWeight: FontWeight.bold, color: titleColor)),
                                Text('$completeness%', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF8B5CF6))),
                              ],
                            ),
                            const SizedBox(height: 10),
                            LinearProgressIndicator(
                              value: completeness / 100.0,
                              backgroundColor: isDark ? Colors.white12 : const Color(0xFFE2E8F0),
                              color: const Color(0xFF8B5CF6),
                              minHeight: 8,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Recent Submissions Section
                      _buildSectionHeader('Recent Submissions', titleColor),
                      const SizedBox(height: 12),
                      if (_recentApplied.isEmpty)
                        _buildEmptyState('No submissions yet.', subColor)
                      else
                        Column(
                          children: _recentApplied.map((app) {
                            final internship = app['internship'] ?? {};
                            final company = internship['company'] ?? {};
                            return Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              child: GlassCard(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                child: ListTile(
                                  contentPadding: EdgeInsets.zero,
                                  title: Text(internship['title'] ?? 'Internship', style: TextStyle(fontWeight: FontWeight.bold, color: titleColor)),
                                  subtitle: Text('${company['companyName'] ?? ''} • ${internship['location'] ?? ''}', style: TextStyle(color: subColor, fontSize: 12)),
                                  trailing: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: Colors.blue.withOpacity(0.15),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      app['status'].toString().replaceAll('_', ' ').toUpperCase(),
                                      style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.blue),
                                    ),
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      const SizedBox(height: 24),

                      // Upcoming Interviews Section
                      _buildSectionHeader('Upcoming Interviews', titleColor),
                      const SizedBox(height: 12),
                      if (_upcomingInterviews.isEmpty)
                        _buildEmptyState('No interviews scheduled.', subColor)
                      else
                        Column(
                          children: _upcomingInterviews.map((app) {
                            final internship = app['internship'] ?? {};
                            final company = internship['company'] ?? {};
                            final interview = app['interview'] ?? {};
                            final dateStr = interview['date'] != null
                                ? DateTime.parse(interview['date']).toLocal().toString().substring(0, 16)
                                : 'TBD';

                            return Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              child: GlassCard(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.stretch,
                                  children: [
                                    Text(
                                      company['companyName'] ?? '',
                                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFA78BFA)),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      internship['title'] ?? 'Role',
                                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: titleColor),
                                    ),
                                    const SizedBox(height: 10),
                                    Row(
                                      children: [
                                        Icon(LucideIcons.calendar, size: 14, color: subColor),
                                        const SizedBox(width: 6),
                                        Text(dateStr, style: TextStyle(fontSize: 12, color: subColor)),
                                      ],
                                    ),
                                    if (interview['link'] != null) ...[
                                      const SizedBox(height: 12),
                                      ElevatedButton(
                                        onPressed: () {}, // Trigger external url launcher
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: const Color(0xFF8B5CF6),
                                          foregroundColor: Colors.white,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                          padding: const EdgeInsets.symmetric(vertical: 10),
                                          elevation: 0,
                                        ),
                                        child: const Text('Join Meeting', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                    ],
                  ),
                ),
              ),
      ),
    );
  }

  Widget _buildMetricCard(String title, String val, IconData icon, Color color, bool isDark, Color titleColor) {
    return GlassCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            backgroundColor: color.withOpacity(0.12),
            radius: 18,
            child: Icon(icon, size: 18, color: color),
          ),
          const SizedBox(height: 12),
          Text(val, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: titleColor)),
          const SizedBox(height: 2),
          Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, Color titleColor) {
    return Text(
      title,
      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: titleColor, fontFamily: 'Outfit'),
    );
  }

  Widget _buildEmptyState(String msg, Color subColor) {
    return GlassCard(
      padding: const EdgeInsets.symmetric(vertical: 24),
      child: Center(
        child: Text(msg, style: TextStyle(fontSize: 13, color: subColor)),
      ),
    );
  }
}
