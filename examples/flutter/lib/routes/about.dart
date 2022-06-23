import 'package:flutter/material.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({
    Key? key,
    this.child,
  }) : super(key: key);

  final Widget? child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('About'),
      ),
      body: child,
    );
  }
}
