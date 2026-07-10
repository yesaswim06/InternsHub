import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'company_dashboard_view.dart';
import 'post_internship_view.dart';
import 'internship_applicants_view.dart';
import 'company_profile_view.dart';

class CompanyMainContainer extends StatefulWidget {
  const CompanyMainContainer({super.key});

  @override
  State<CompanyMainContainer> createState() => _CompanyMainContainerState();
}

class _CompanyMainContainerState extends State<CompanyMainContainer> {
  int _currentIndex = 0;

  final List<Widget> _views = [
    const CompanyDashboardView(),
    const PostInternshipView(),
    const InternshipApplicantsView(),
    const CompanyProfileView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _views,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) => setState(() => _currentIndex = index),
        destinations: const [
          NavigationDestination(icon: Icon(LucideIcons.layoutDashboard), label: 'Overview'),
          NavigationDestination(icon: Icon(LucideIcons.plusCircle), label: 'Post Job'),
          NavigationDestination(icon: Icon(LucideIcons.users), label: 'Applicants'),
          NavigationDestination(icon: Icon(LucideIcons.building), label: 'Company'),
        ],
      ),
    );
  }
}
