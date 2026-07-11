import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../services/api_service.dart';

class ManageCompaniesView extends StatefulWidget {
  const ManageCompaniesView({super.key});

  @override
  State<ManageCompaniesView> createState() => _ManageCompaniesViewState();
}

class _ManageCompaniesViewState extends State<ManageCompaniesView> {
  List<dynamic> _companies = [];
  bool _loading = true;
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchCompanies();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchCompanies() async {
    try {
      final response = await apiService.get('/admin/companies');
      if (response.data['success'] == true) {
        setState(() {
          _companies = response.data['data'] ?? [];
        });
      }
    } catch (e) {
      print('Fetch Companies Error: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _toggleApproval(String id, bool currentStatus) async {
    final action = currentStatus ? 'suspend' : 'approve';
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('${action.toUpperCase()} Organization', style: const TextStyle(fontWeight: FontWeight.bold)),
          content: Text('Are you sure you want to $action this company profile?'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              style: ElevatedButton.styleFrom(
                backgroundColor: currentStatus ? Colors.redAccent : Colors.green,
                foregroundColor: Colors.white,
              ),
              child: Text(action.toUpperCase()),
            )
          ],
        );
      },
    );

    if (confirm == true) {
      try {
        final response = await apiService.put('/admin/companies/$id/approve', data: {
          'approve': !currentStatus,
        });

        if (response.data['success'] == true) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Company updated successfully')));
          _fetchCompanies();
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to update company')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredCompanies = _companies.where((c) {
      final name = c['companyName'].toString().toLowerCase();
      final location = c['location'].toString().toLowerCase();
      final q = _searchController.text.toLowerCase();
      return name.contains(q) || location.contains(q);
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Partner Registries', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // Search box
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              onChanged: (val) => setState(() {}),
              decoration: InputDecoration(
                hintText: 'Search companies...',
                prefixIcon: const Icon(LucideIcons.search, size: 18),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),

          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : filteredCompanies.isEmpty
                    ? const Center(child: Text('No companies registered.'))
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        itemCount: filteredCompanies.length,
                        itemBuilder: (context, index) {
                          final company = filteredCompanies[index];
                          final isApproved = company['isApproved'] ?? false;

                          return Card(
                            color: Colors.white,
                            margin: const EdgeInsets.only(bottom: 10),
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                            child: ListTile(
                              title: Text(company['companyName'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                              subtitle: Text('${company['location'] ?? ''} • ${company['website'] ?? ''}'),
                              trailing: TextButton(
                                onPressed: () => _toggleApproval(company['_id'], isApproved),
                                style: TextButton.styleFrom(
                                  foregroundColor: isApproved ? Colors.redAccent : Colors.green,
                                ),
                                child: Text(isApproved ? 'Suspend' : 'Approve', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                              ),
                            ),
                          );
                        },
                      ),
          )
        ],
      ),
    );
  }
}
