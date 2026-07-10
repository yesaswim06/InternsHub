import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../services/api_service.dart';

class PostInternshipView extends StatefulWidget {
  const PostInternshipView({super.key});

  @override
  State<PostInternshipView> createState() => _PostInternshipViewState();
}

class _PostInternshipViewState extends State<PostInternshipView> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _locationController = TextEditingController();
  final _stipendController = TextEditingController();
  final _durationController = TextEditingController();
  final _eligibilityController = TextEditingController();
  
  // Skills
  final _skillInputController = TextEditingController();
  List<String> _skills = [];

  String _workMode = 'Remote';
  DateTime? _deadline;
  bool _submitting = false;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _locationController.dispose();
    _stipendController.dispose();
    _durationController.dispose();
    _eligibilityController.dispose();
    _skillInputController.dispose();
    super.dispose();
  }

  void _addSkill() {
    final txt = _skillInputController.text.trim();
    if (txt.isNotEmpty && !_skills.contains(txt)) {
      setState(() {
        _skills.add(txt);
        _skillInputController.clear();
      });
    }
  }

  void _removeSkill(String skill) {
    setState(() => _skills.remove(skill));
  }

  Future<void> _pickDeadline() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 7)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() => _deadline = picked);
    }
  }

  Future<void> _submitPost() async {
    if (!_formKey.currentState!.validate()) return;
    if (_skills.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please add at least one skill requirement.')));
      return;
    }
    if (_deadline == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please choose an application deadline.')));
      return;
    }

    setState(() => _submitting = true);

    try {
      final response = await apiService.post('/company/internships', data: {
        'title': _titleController.text.trim(),
        'description': _descriptionController.text.trim(),
        'location': _locationController.text.trim(),
        'stipend': int.parse(_stipendController.text.trim()),
        'duration': _durationController.text.trim(),
        'eligibility': _eligibilityController.text.trim(),
        'skills': _skills,
        'workMode': _workMode,
        'deadline': _deadline!.toIso8601String(),
      });

      if (response.data['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: const Text('Internship vacancy posted successfully!'), backgroundColor: Colors.green),
        );
        _clearForm();
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to publish vacancy')));
    } finally {
      setState(() => _submitting = false);
    }
  }

  void _clearForm() {
    _titleController.clear();
    _descriptionController.clear();
    _locationController.clear();
    _stipendController.clear();
    _durationController.clear();
    _eligibilityController.clear();
    setState(() {
      _skills = [];
      _workMode = 'Remote';
      _deadline = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Post Internship', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Job Title
              const Text('Job Title', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _titleController,
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter role title' : null,
                decoration: InputDecoration(
                  hintText: 'e.g. Node.js Developer Intern',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 16),

              // Description
              const Text('Role Description', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _descriptionController,
                maxLines: 4,
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter job description' : null,
                decoration: InputDecoration(
                  hintText: 'Discuss daily responsibilities, tasks, expectations...',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 16),

              // Mode Chip choices
              const Text('Work Mode', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              const SizedBox(height: 8),
              Row(
                children: ['Remote', 'Hybrid', 'Onsite'].map((mode) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ChoiceChip(
                      label: Text(mode),
                      selected: _workMode == mode,
                      onSelected: (val) => setState(() => _workMode = mode),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              // Location
              const Text('Location', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _locationController,
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter location parameters' : null,
                decoration: InputDecoration(
                  hintText: 'e.g. Remote / Chicago, IL',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 16),

              // Stipend and Duration
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Monthly Stipend (\$)', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                        const SizedBox(height: 6),
                        TextFormField(
                          controller: _stipendController,
                          keyboardType: TextInputType.number,
                          validator: (val) => val == null || val.trim().isEmpty ? 'Enter stipend' : null,
                          decoration: InputDecoration(
                            hintText: '1000',
                            filled: true,
                            fillColor: Colors.white,
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Duration', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                        const SizedBox(height: 6),
                        TextFormField(
                          controller: _durationController,
                          validator: (val) => val == null || val.trim().isEmpty ? 'e.g. 6 Months' : null,
                          decoration: InputDecoration(
                            hintText: '6 Months',
                            filled: true,
                            fillColor: Colors.white,
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Eligibility
              const Text('Eligibility', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _eligibilityController,
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter requirements' : null,
                decoration: InputDecoration(
                  hintText: 'e.g. Computer Science graduate students',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 16),

              // Skill Inputs
              const Text('Target Skills Required', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              const SizedBox(height: 6),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _skillInputController,
                      decoration: InputDecoration(
                        hintText: 'e.g. MongoDB',
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                      ),
                      onSubmitted: (val) => _addSkill(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(LucideIcons.plus, color: Colors.white),
                    style: IconButton.styleFrom(backgroundColor: const Color(0xFF8B5CF6)),
                    onPressed: _addSkill,
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _skills.map((skill) {
                  return Chip(
                    label: Text(skill, style: const TextStyle(fontSize: 11)),
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: Color(0xFFE2E8F0)),
                    onDeleted: () => _removeSkill(skill),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              // Deadline
              const Text('Application Deadline', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              const SizedBox(height: 6),
              OutlinedButton.icon(
                onPressed: _pickDeadline,
                icon: const Icon(LucideIcons.calendar),
                label: Text(
                  _deadline == null
                      ? 'Choose Date'
                      : _deadline!.toLocal().toString().substring(0, 10),
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 46),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 32),

              // Submit Button
              ElevatedButton(
                onPressed: _submitting ? null : _submitPost,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8B5CF6),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _submitting
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Post Job Vacancy', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }
}
