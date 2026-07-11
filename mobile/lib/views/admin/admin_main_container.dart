import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'admin_dashboard_view.dart';
import 'manage_users_view.dart';
import 'manage_companies_view.dart';

class AdminMainContainer extends StatefulWidget {
  const AdminMainContainer({super.key});

  @override
  State<AdminMainContainer> createState() => _AdminMainContainerState();
}

class _AdminMainContainerState extends State<AdminMainContainer> {
  int _currentIndex = 0;

  final List<Widget> _views = [
    const AdminDashboardView(),
    const ManageUsersView(),
    const ManageCompaniesView(),
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
          NavigationDestination(icon: Icon(LucideIcons.users), label: 'Users'),
          NavigationDestination(icon: Icon(LucideIcons.shieldAlert), label: 'Approvals'),
        ],
      ),
    );
  }
}
