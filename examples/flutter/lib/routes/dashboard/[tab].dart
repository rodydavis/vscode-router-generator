import 'package:flutter/material.dart';

class DashboardTab extends StatelessWidget {
  const DashboardTab({
    Key? key,
    required this.tab,
  }) : super(key: key);

  final String tab;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('Dashboard: $tab'),
    );
  }
}
