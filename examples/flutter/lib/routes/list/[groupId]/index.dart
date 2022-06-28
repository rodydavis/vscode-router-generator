import 'package:flutter/material.dart';

class ExampleDetails extends StatelessWidget {
  const ExampleDetails({Key? key, required this.groupId}) : super(key: key);

  final String groupId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Example: $groupId'),
      ),
    );
  }
}
