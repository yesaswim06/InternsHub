import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dio/dio.dart' as dio;
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';

class InternshipDetailView extends StatefulWidget {
  final String id;
  const InternshipDetailView({super.key, required this.id});

  @override
  State<InternshipDetailView> createState() => _InternshipDetailViewState();
}

class _InternshipDetailViewState extends State<InternshipDetailView> {
  Map<String, dynamic>? _job;
  bool _loading = true;
  bool _applied = false;
  bool _isBookmarked = false;

  // Apply dialog fields
  final _coverLetterController = TextEditingController();
  bool _submittingApplication = false;

  @override
  void initState() {
    super.initState();
    _fetchJobDetails();
  }

  @override
  void dispose() {
    _coverLetterController.dispose();
    super.dispose();
  }

  Future<void> _fetchJobDetails() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final responses = await Future.wait([
        apiService.get('/internships/${widget.id}'),
        apiService.get('/internships/student/applied'),
      ]);
      final jobRes = responses[0];
      final appliedRes = responses[1];

      if (jobRes.data['success'] == true) {
        setState(() {
          _job = jobRes.data['data'];
          if (authProvider.user?['profile']?['savedInternships'] != null) {
            _isBookmarked = (authProvider.user!['profile']['savedInternships'] as List)
                .contains(widget.id);
          }
        });
      }

      if (appliedRes.data['success'] == true) {
        final List<dynamic> appliedList = appliedRes.data['data'];
        setState(() {
          _applied = appliedList.any((app) => app['internship']?['_id'] == widget.id);
        });
      }
    } catch (e) {
      print('Job Details Fetch Error: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _toggleBookmark() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      if (_isBookmarked) {
        final res = await apiService.delete('/internships/${widget.id}/bookmark');
        if (res.data['success'] == true) {
          setState(() => _isBookmarked = false);
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Removed bookmark')));
        }
      } else {
        final res = await apiService.post('/internships/${widget.id}/bookmark');
        if (res.data['success'] == true) {
          setState(() => _isBookmarked = true);
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Saved to bookmarks')));
        }
      }
      await authProvider.loadProfile(); // Sync token state
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to update bookmark')));
    }
  }

  Future<void> _submitApplication() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    setState(() => _submittingApplication = true);

    try {
      if (authProvider.user?['profile']?['resume'] == null ||
          authProvider.user!['profile']['resume'].toString().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('No resume in profile. Please upload one first.')));
        setState(() => _submittingApplication = false);
        return;
      }

      final mapData = <String, dynamic>{
        'coverLetter': _coverLetterController.text.trim(),
        'useProfileResume': 'true',
      };

      final formData = dio.FormData.fromMap(mapData);
      final response = await apiService.postMultipart('/internships/${widget.id}/apply', formData);

      if (response.data['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Application sent successfully!'), backgroundColor: Colors.green),
        );
        setState(() => _applied = true);
        Navigator.pop(context);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to apply')));
    } finally {
      setState(() => _submittingApplication = false);
    }
  }

  void _openApplyBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final authProvider = Provider.of<AuthProvider>(context);
            final hasProfileResume = authProvider.user?['profile']?['resume'] != null &&
                authProvider.user!['profile']['resume'].toString().isNotEmpty;

            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                left: 20,
                right: 20,
                top: 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text('Apply for Role', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),

                  // Resume Reference indicator
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(10)),
                    child: Text(
                      hasProfileResume ? '✓ profile_resume.pdf selected' : '❌ No profile resume uploaded yet.',
                      style: TextStyle(fontSize: 12, color: hasProfileResume ? Colors.green : Colors.red),
                    ),
                  ),
                  if (!hasProfileResume)
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text(
                        'Please upload your resume on the Web Portal first to apply.',
                        style: TextStyle(fontSize: 11, color: Colors.redAccent.shade700, fontWeight: FontWeight.w500),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  const SizedBox(height: 16),

                  // Cover letter
                  const Text('Cover Letter (Optional)', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _coverLetterController,
                    maxLines: 4,
                    decoration: InputDecoration(
                      hintText: 'Introduce yourself to the recruiter...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 24),

                  ElevatedButton(
                    onPressed: !hasProfileResume || _submittingApplication
                        ? null
                        : _submitApplication,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF8B5CF6),
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 46),
                    ),
                    child: _submittingApplication
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text('Submit Application', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_job == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Internship vacancy not found.')),
      );
    }

    final company = _job!['company'] ?? {};

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(company['companyName'] ?? 'Details', style: const TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: Icon(
              _isBookmarked ? Icons.bookmark : Icons.bookmark_border,
              color: _isBookmarked ? const Color(0xFF8B5CF6) : Colors.black,
            ),
            onPressed: _toggleBookmark,
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Job Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFE2E8F0))),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_job!['title'] ?? '', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(company['companyName'] ?? '', style: const TextStyle(fontSize: 14, color: Color(0xFF8B5CF6), fontWeight: FontWeight.w600)),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildInfoColumn('Location', _job!['location'] ?? ''),
                      _buildInfoColumn('Stipend', '\$${_job!['stipend']}/mo'),
                      _buildInfoColumn('Duration', _job!['duration'] ?? ''),
                    ],
                  )
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Description
            const Text('Job Description', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(
              _job!['description'] ?? '',
              style: const TextStyle(fontSize: 14, color: Color(0xFF475569), height: 1.6),
            ),
            const SizedBox(height: 20),

            // Skills
            const Text('Skills Required', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: (_job!['skills'] as List).map((skill) {
                return Chip(
                  label: Text(skill.toString(), style: const TextStyle(fontSize: 11)),
                  backgroundColor: Colors.white,
                  side: const BorderSide(color: Color(0xFFE2E8F0)),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            // Eligibility
            const Text('Eligibility Criteria', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(_job!['eligibility'] ?? '', style: const TextStyle(fontSize: 14, color: Color(0xFF475569))),
            const SizedBox(height: 20),

            // Deadline
            const Text('Deadline to Apply', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(
              _job!['deadline'] != null
                  ? DateTime.parse(_job!['deadline']).toLocal().toString().substring(0, 10)
                  : 'N/A',
              style: const TextStyle(fontSize: 14, color: Colors.redAccent, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 40),

            // Submit Application button
            ElevatedButton(
              onPressed: _applied ? null : _openApplyBottomSheet,
              style: ElevatedButton.styleFrom(
                backgroundColor: _applied ? Colors.grey : const Color(0xFF8B5CF6),
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(
                _applied ? 'Applied' : 'Apply Now',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoColumn(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: Colors.grey)),
        const SizedBox(height: 2),
        Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
      ],
    );
  }
}

// Custom Promise Helper mapping to JS Promise.all in Dart
class Promise {
  static Future<List<T>> all<T>(Iterable<Future<T>> futures) => Future.wait(futures);
}
