import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';

class AdminDashboardView extends StatefulWidget {
  const AdminDashboardView({super.key});

  @override
  State<AdminDashboardView> createState() => _AdminDashboardViewState();
}

class _AdminDashboardViewState extends State<AdminDashboardView> {
  int _studentsCount = 0;
  int _companiesCount = 0;
  int _jobsCount = 0;
  int _appsCount = 0;
  List<dynamic> _pendingCompanies = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchAdminStats();
  }

  Future<void> _fetchAdminStats() async {
    try {
      final statsRes = await apiService.get('/admin/stats');
      final companiesRes = await apiService.get('/admin/companies');

      if (statsRes.data['success'] == true && companiesRes.data['success'] == true) {
        final stats = statsRes.data['data'] ?? {};
        final List<dynamic> companies = companiesRes.data['data'] ?? [];

        setState(() {
          _studentsCount = stats['students'] ?? 0;
          _companiesCount = stats['companies'] ?? 0;
          _jobsCount = stats['internships'] ?? 0;
          _appsCount = stats['applications'] ?? 0;
          _pendingCompanies = companies.where((c) => c['isApproved'] == false).toList();
        });
      }
    } catch (e) {
      print('Admin Stats Error: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _approveCompany(String id, bool approve) async {
    try {
      final response = await apiService.put('/admin/companies/$id/approve', data: {
        'approve': approve,
      });

      if (response.data['success'] == true) {
        final action = approve ? 'approved' : 'rejected';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Company $action successfully!'), backgroundColor: Colors.green),
        );
        _fetchAdminStats();
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to update company approval')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Admin Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.logOut),
            onPressed: () async {
              await authProvider.logout();
              if (mounted) Navigator.pushReplacementNamed(context, '/login');
            },
          )
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchAdminStats,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Stats grid layout
                    GridView.count(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      childAspectRatio: 1.5,
                      children: [
                        _buildStatCard('Students', _studentsCount.toString(), LucideIcons.graduationCap, Colors.blue),
                        _buildStatCard('Companies', _companiesCount.toString(), LucideIcons.building, Colors.orange),
                        _buildStatCard('Internships', _jobsCount.toString(), LucideIcons.briefcase, Colors.deepPurple),
                        _buildStatCard('Applications', _appsCount.toString(), LucideIcons.fileText, Colors.green),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Pending approvals
                    const Text('Pending Partner Approvals', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                    const SizedBox(height: 10),
                    if (_pendingCompanies.isEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(vertical: 40),
                        width: double.infinity,
                        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFE2E8F0))),
                        child: const Center(child: Text('No pending company approvals.', style: TextStyle(color: Colors.grey))),
                      )
                    else
                      Column(
                        children: _pendingCompanies.map((company) {
                          return Card(
                            color: Colors.white,
                            margin: const EdgeInsets.only(bottom: 12),
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                              side: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    company['companyName'] ?? '',
                                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                  ),
                                  Text(
                                    '${company['location'] ?? ''} • ${company['website'] ?? ''}',
                                    style: const TextStyle(fontSize: 11, color: Colors.grey),
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    children: [
                                      OutlinedButton(
                                        onPressed: () => _approveCompany(company['_id'], false),
                                        style: OutlinedButton.styleFrom(
                                          foregroundColor: Colors.redAccent,
                                          side: const BorderSide(color: Colors.redAccent),
                                        ),
                                        child: const Text('Reject', style: TextStyle(fontSize: 12)),
                                      ),
                                      const SizedBox(width: 8),
                                      ElevatedButton(
                                        onPressed: () => _approveCompany(company['_id'], true),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.green,
                                          foregroundColor: Colors.white,
                                        ),
                                        child: const Text('Approve', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                      ),
                                    ],
                                  )
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
    );
  }

  Widget _buildStatCard(String title, String val, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: color),
              const SizedBox(width: 6),
              Text(title, style: const TextStyle(fontSize: 11, color: Colors.grey)),
            ],
          ),
          const SizedBox(height: 6),
          Text(val, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
