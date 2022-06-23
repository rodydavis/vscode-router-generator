import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class RootPage extends StatelessWidget {
  const RootPage({
    Key? key,
    this.child,
  }) : super(key: key);

  final Widget? child;

  @override
  Widget build(BuildContext context) {
    const destinations = <Destination>[
      Destination('Home', Icons.home, '/'),
      Destination('Guest', Icons.person, '/about/guest'),
      Destination('Account', Icons.person, '/about/2'),
      Destination('About', Icons.info, '/about'),
      Destination('Settings', Icons.settings, '/settings'),
    ];
    return Scaffold(
      body: Row(
        children: [
          NavigationRail(
            labelType: NavigationRailLabelType.all,
            destinations:
                destinations.map((e) => e.toRailDestination()).toList(),
            selectedIndex: 0,
            onDestinationSelected: (int index) {
              final route = destinations[index].route;
              context.go(route);
            },
          ),
          Expanded(
            child: child ?? Container(),
          ),
        ],
      ),
    );
  }
}

class Destination {
  const Destination(this.label, this.icon, this.route);

  final String label;
  final IconData icon;
  final String route;

  NavigationRailDestination toRailDestination() {
    return NavigationRailDestination(
      icon: Icon(icon),
      label: Text(label),
    );
  }
}
