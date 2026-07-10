import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../services/api_service.dart';
import 'internship_detail_view.dart';

class SearchInternshipsView extends StatefulWidget {
  const SearchInternshipsView({super.key});

  @override
  State<SearchInternshipsView> createState() => _SearchInternshipsViewState();
}

class _SearchInternshipsViewState extends State<SearchInternshipsView> {
  List<dynamic> _internships = [];
  bool _loading = true;
  int _page = 1;
  int _totalPages = 1;

  // Search parameters
  final _searchController = TextEditingController();
  String _workMode = '';
  String _location = '';

  @override
  void initState() {
    super.initState();
    _fetchInternships(1);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchInternships(int page) async {
    setState(() => _loading = true);
    try {
      final queryParams = {
        'page': page,
        'limit': 10,
        if (_searchController.text.isNotEmpty) 'search': _searchController.text.trim(),
        if (_workMode.isNotEmpty) 'workMode': _workMode,
        if (_location.isNotEmpty) 'location': _location,
      };

      final response = await apiService.get('/internships', queryParameters: queryParams);
      if (response.data['success'] == true) {
        setState(() {
          _internships = response.data['data'];
          _page = response.data['pagination']['page'];
          _totalPages = response.data['pagination']['pages'] ?? 1;
        });
      }
    } catch (e) {
      print('Search Fetch Error: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  void _openFilterDialog() {
    String localMode = _workMode;
    final localLocationController = TextEditingController(text: _location);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
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
                  const Text('Filters', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  
                  // Location field
                  const Text('Location', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: localLocationController,
                    decoration: InputDecoration(
                      hintText: 'e.g. San Francisco',
                      prefixIcon: const Icon(LucideIcons.mapPin, size: 16),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Mode Chips
                  const Text('Work Mode', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 8),
                  Row(
                    children: ['Remote', 'Hybrid', 'Onsite'].map((mode) {
                      final isSelected = localMode == mode;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text(mode),
                          selected: isSelected,
                          onSelected: (selected) {
                            setModalState(() => localMode = selected ? mode : '');
                          },
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 24),

                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _workMode = localMode;
                        _location = localLocationController.text;
                      });
                      Navigator.pop(context);
                      _fetchInternships(1);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF8B5CF6),
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 46),
                    ),
                    child: const Text('Apply Filters', style: TextStyle(fontWeight: FontWeight.bold)),
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
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Find Internships', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // Search & Filter headers
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    onSubmitted: (val) => _fetchInternships(1),
                    decoration: InputDecoration(
                      hintText: 'e.g. Web Developer',
                      prefixIcon: const Icon(LucideIcons.search, size: 18),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, size: 16),
                              onPressed: () {
                                _searchController.clear();
                                _fetchInternships(1);
                              },
                            )
                          : null,
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                      ),
                      contentPadding: const EdgeInsets.symmetric(vertical: 0),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                IconButton(
                  icon: const Icon(LucideIcons.slidersHorizontal, color: Color(0xFF8B5CF6)),
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: Color(0xFFE2E8F0)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.all(12),
                  ),
                  onPressed: _openFilterDialog,
                ),
              ],
            ),
          ),

          // Active Filter Indicators
          if (_workMode.isNotEmpty || _location.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
              child: Row(
                children: [
                  const Text('Active:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                  const SizedBox(width: 8),
                  if (_workMode.isNotEmpty)
                    Chip(
                      label: Text(_workMode, style: const TextStyle(fontSize: 10)),
                      onDeleted: () {
                        setState(() => _workMode = '');
                        _fetchInternships(1);
                      },
                    ),
                  if (_location.isNotEmpty) ...[
                    const SizedBox(width: 6),
                    Chip(
                      label: Text(_location, style: const TextStyle(fontSize: 10)),
                      onDeleted: () {
                        setState(() => _location = '');
                        _fetchInternships(1);
                      },
                    ),
                  ]
                ],
              ),
            ),

          // Listing Results
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _internships.isEmpty
                    ? const Center(child: Text('No internships match your query.'))
                    : ListView.builder(
                        padding: const EdgeInsets.all(16.0),
                        itemCount: _internships.length,
                        itemBuilder: (context, index) {
                          final job = _internships[index];
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
                                ).then((_) => _fetchInternships(_page));
                              },
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      company['companyName'] ?? '',
                                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF8B5CF6)),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      job['title'] ?? '',
                                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                    ),
                                    const SizedBox(height: 12),
                                    Row(
                                      children: [
                                        _buildInfoTag(LucideIcons.mapPin, job['location'] ?? ''),
                                        const SizedBox(width: 12),
                                        _buildInfoTag(LucideIcons.dollarSign, '${job['stipend']}/mo'),
                                        const SizedBox(width: 12),
                                        _buildInfoTag(LucideIcons.briefcase, job['workMode'] ?? ''),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
          ),

          // Pagination
          if (_totalPages > 1 && !_loading)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    icon: const Icon(LucideIcons.chevronLeft),
                    onPressed: _page == 1 ? null : () => _fetchInternships(_page - 1),
                  ),
                  Text('Page $_page of $_totalPages', style: const TextStyle(fontSize: 13)),
                  IconButton(
                    icon: const Icon(LucideIcons.chevronRight),
                    onPressed: _page == _totalPages ? null : () => _fetchInternships(_page + 1),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildInfoTag(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 14, color: Colors.grey),
        const SizedBox(width: 4),
        Text(text, style: const TextStyle(fontSize: 11, color: Colors.grey)),
      ],
    );
  }
}
