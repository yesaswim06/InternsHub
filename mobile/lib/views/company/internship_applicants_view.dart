import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../services/api_service.dart';

class InternshipApplicantsView extends StatefulWidget {
  const InternshipApplicantsView({super.key});

  @override
  State<InternshipApplicantsView> createState() => _InternshipApplicantsViewState();
}

class _InternshipApplicantsViewState extends State<InternshipApplicantsView> {
  List<dynamic> _applicants = [];
  bool _loading = true;

  // Interview forms controllers
  final _meetingLinkController = TextEditingController();
  final _coordinatorController = TextEditingController();
  DateTime? _interviewDateTime;

  @override
  void initState() {
    super.initState();
    _fetchApplicants();
  }

  @override
  void dispose() {
    _meetingLinkController.dispose();
    _coordinatorController.dispose();
    super.dispose();
  }

  Future<void> _fetchApplicants() async {
    try {
      final response = await apiService.get('/company/applicants');
      if (response.data['success'] == true) {
        setState(() {
          _applicants = response.data['data'];
        });
      }
    } catch (e) {
      print('Fetch Applicants Error: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'applied':
        return Colors.blue;
      case 'shortlisted':
        return Colors.orange;
      case 'interview_scheduled':
        return Colors.purple;
      case 'offered':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  Future<void> _updateStatus(String appId, String status) async {
    try {
      final data = <String, dynamic>{'status': status};

      if (status == 'interview_scheduled') {
        if (_interviewDateTime == null || _meetingLinkController.text.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter interview date/time and meeting link.')));
          return;
        }
        data['interview'] = {
          'date': _interviewDateTime!.toIso8601String(),
          'link': _meetingLinkController.text.trim(),
          'notes': 'Coordinator: ${_coordinatorController.text.trim()}',
        };
      }

      final response = await apiService.put('/company/applications/$appId/status', data: data);

      if (response.data['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: const Text('Applicant status updated!'), backgroundColor: Colors.green),
        );
        _meetingLinkController.clear();
        _coordinatorController.clear();
        _interviewDateTime = null;
        _fetchApplicants();
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to update status')));
    }
  }

  Future<void> _pickInterviewDateTime(StateSetter setModalState) async {
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
    );
    if (date != null && mounted) {
      final time = await showTimePicker(
        context: context,
        initialTime: const TimeOfDay(hour: 10, minute: 0),
      );
      if (time != null) {
        setModalState(() {
          _interviewDateTime = DateTime(date.year, date.month, date.day, time.hour, time.minute);
        });
      }
    }
  }

  void _openDetailsSheet(dynamic applicant) {
    final student = applicant['student'] ?? {};
    final internship = applicant['internship'] ?? {};
    final appId = applicant['_id'];
    String currentStatus = applicant['status'] ?? 'applied';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return SingleChildScrollView(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                left: 20,
                right: 20,
                top: 20,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(student['name'] ?? '', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  Text(student['email'] ?? '', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  const SizedBox(height: 10),
                  Text('Applied for: ${internship['title'] ?? ''}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF8B5CF6))),
                  const Divider(height: 24),

                  // Cover letter
                  const Text('Cover Letter', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 4),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(10)),
                    child: Text(
                      applicant['coverLetter'] != null && applicant['coverLetter'].toString().trim().isNotEmpty
                          ? applicant['coverLetter']
                          : 'No cover letter provided.',
                      style: const TextStyle(fontSize: 12),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Student Resume
                  ElevatedButton.icon(
                    onPressed: () {}, // External url launcher to open resume
                    icon: const Icon(LucideIcons.fileText, size: 16),
                    label: const Text('Open Resume PDF'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF8B5CF6),
                      side: const BorderSide(color: Color(0xFF8B5CF6)),
                    ),
                  ),
                  const Divider(height: 32),

                  // Status update controls
                  const Text('Manage Status', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: ['applied', 'shortlisted', 'interview_scheduled', 'offered', 'rejected'].map((st) {
                      final isSel = currentStatus == st;
                      return ChoiceChip(
                        label: Text(st.replaceAll('_', ' ').toUpperCase(), style: const TextStyle(fontSize: 9)),
                        selected: isSel,
                        onSelected: (val) {
                          setModalState(() => currentStatus = st);
                          if (st != 'interview_scheduled') {
                            _updateStatus(appId, st);
                            Navigator.pop(context);
                          }
                        },
                      );
                    }).toList(),
                  ),

                  // Interview parameters form
                  if (currentStatus == 'interview_scheduled') ...[
                    const SizedBox(height: 20),
                    const Text('Schedule Interview Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF8B5CF6))),
                    const SizedBox(height: 12),
                    
                    OutlinedButton.icon(
                      onPressed: () => _pickInterviewDateTime(setModalState),
                      icon: const Icon(LucideIcons.calendar),
                      label: Text(
                        _interviewDateTime == null
                            ? 'Choose Date & Time'
                            : _interviewDateTime!.toLocal().toString().substring(0, 16),
                      ),
                      style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 44)),
                    ),
                    const SizedBox(height: 10),

                    TextField(
                      controller: _meetingLinkController,
                      decoration: const InputDecoration(
                        labelText: 'Meeting Link URL',
                        hintText: 'https://meet.google.com/abc',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      ),
                    ),
                    const SizedBox(height: 10),

                    TextField(
                      controller: _coordinatorController,
                      decoration: const InputDecoration(
                        labelText: 'Coordinator Name',
                        hintText: 'HR Coordinator',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      ),
                    ),
                    const SizedBox(height: 20),

                    ElevatedButton(
                      onPressed: () {
                        _updateStatus(appId, 'interview_scheduled');
                        Navigator.pop(context);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF8B5CF6),
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 46),
                      ),
                      child: const Text('Confirm Schedule', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                  const SizedBox(height: 30),
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
        title: const Text('Applications Received', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchApplicants,
              child: _applicants.isEmpty
                  ? const Center(child: Text('No applications received yet.'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16.0),
                      itemCount: _applicants.length,
                      itemBuilder: (context, index) {
                        final applicant = _applicants[index];
                        final student = applicant['student'] ?? {};
                        final job = applicant['internship'] ?? {};
                        final status = applicant['status'] ?? 'applied';

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
                            onTap: () => _openDetailsSheet(applicant),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          student['name'] ?? '',
                                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                                        ),
                                        Text(
                                          'Role: ${job['title'] ?? ''}',
                                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                                        ),
                                        const SizedBox(height: 8),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: _getStatusColor(status).withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(20),
                                          ),
                                          child: Text(
                                            status.toString().replaceAll('_', ' ').toUpperCase(),
                                            style: TextStyle(
                                              fontSize: 9,
                                              fontWeight: FontWeight.bold,
                                              color: _getStatusColor(status),
                                            ),
                                          ),
                                        ),
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
