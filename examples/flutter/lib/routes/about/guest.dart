import 'package:flutter/material.dart';

class GuestPage extends StatelessWidget {
  const GuestPage({
    Key? key,
    this.id,
  }) : super(key: key);

  final String? id;

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Guest'),
    );
  }
}
