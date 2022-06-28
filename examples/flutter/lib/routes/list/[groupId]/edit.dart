import 'package:flutter/material.dart';

class EditGroup extends StatelessWidget {
  const EditGroup({Key? key, required this.groupId}) : super(key: key);

  final String groupId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Edit: $groupId'),
      ),
    );
  }
}
