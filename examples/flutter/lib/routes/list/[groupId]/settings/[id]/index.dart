import 'package:flutter/material.dart';

class SettingInfo extends StatelessWidget {
  const SettingInfo({
    Key? key,
    required this.groupId,
    required this.id,
  }) : super(key: key);

  final String groupId;
  final String id;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Setting: $groupId ($id)'),
      ),
    );
  }
}
