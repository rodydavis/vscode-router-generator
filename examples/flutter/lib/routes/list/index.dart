import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ExampleList extends StatelessWidget {
  const ExampleList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Example List'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.go('/list/new'),
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: 20,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text('Example $index'),
            onTap: () {
              context.go('/list/$index');
            },
          );
        },
      ),
    );
  }
}
