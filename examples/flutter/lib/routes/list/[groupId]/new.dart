import 'package:flutter/material.dart';

class NewListItem extends StatelessWidget {
  const NewListItem({Key? key, this.groupId}) : super(key: key);

  final String? groupId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
      title: const Text('New Item'),
    ));
  }
}
