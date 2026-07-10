import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../services/api_service.dart';
import 'internship_detail_view.dart';

class SavedInternshipsView extends StatefulWidget {
  const SavedInternshipsView({super.key});

  @override
  State<SavedInternshipsView> createState() => _SavedInternshipsViewState();
}

class _SavedInternshipsViewState extends State<SavedInternshipsView> {
  List<dynamic> _bookmarks = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchBookmarks();
  }

  Future<void> _fetchBookmarks() async {
    try {
      final response = await apiService.get('/internships/student/bookmarks');
      if (response.data['success'] == true) {
        setState(() {
          _bookmarks = response.data['data'];
        });
      }
    } catch (e) {
      print('Bookmarks Fetch Error: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Saved Bookmarks', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchBookmarks,
              child: _bookmarks.isEmpty
                  ? const Center(child: Text('No bookmarked internships.'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16.0),
                      itemCount: _bookmarks.length,
                      itemBuilder: (context, index) {
                        final job = _bookmarks[index];
                        final company = job['company'] ?? {};
                        return Card(
                          color: Colors.white,
                          margin: const EdgeInsets.only(bottom: 12),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                            side: const BorderSide(color: Color(0xFFE2E8F0)),
                          ),
                          child: InkWell(
                            borderRadius: BorderRadius.circular(16),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => InternshipDetailView(id: job['_id']),
                                ),
                              ).then((_) => _fetchBookmarks());
                            },
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          company['companyName'] ?? '',
                                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF8B5CF6)),
                                        ),
                                        Text(
                                          job['title'] ?? '',
                                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                                        ),
                                        const SizedBox(height: 6),
                                        Text('${job['location']} • \$${job['stipend']}/mo', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                                      ],
                                    ),
                                  ),
                                  const Icon(LucideIcons.chevronRight, size: 18, color: Colors.grey),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
