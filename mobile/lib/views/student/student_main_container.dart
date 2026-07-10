import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'student_dashboard_view.dart';
import 'search_internships_view.dart';
import 'saved_internships_view.dart';
import 'applied_internships_view.dart';
import 'student_profile_view.dart';

class StudentMainContainer extends StatefulWidget {
  const StudentMainContainer({super.key});

  @override
  State<StudentMainContainer> createState() => _StudentMainContainerState();
}

class _StudentMainContainerState extends State<StudentMainContainer> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final List<Widget> views = [
      const StudentDashboardView(),
      const SearchInternshipsView(),
      const AppliedInternshipsView(),
      const SavedInternshipsView(),
      StudentProfileView(onProfileSaved: () => setState(() => _currentIndex = 0)),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: views,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) => setState(() => _currentIndex = index),
        destinations: const [
          NavigationDestination(icon: Icon(LucideIcons.layoutDashboard), label: 'Overview'),
          NavigationDestination(icon: Icon(LucideIcons.search), label: 'Search'),
          NavigationDestination(icon: Icon(LucideIcons.fileSpreadsheet), label: 'Applied'),
          NavigationDestination(icon: Icon(LucideIcons.bookmark), label: 'Saved'),
          NavigationDestination(icon: Icon(LucideIcons.user), label: 'Profile'),
        ],
      ),
    );
  }
}
