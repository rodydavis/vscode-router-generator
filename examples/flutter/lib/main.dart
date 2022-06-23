import 'package:flutter/material.dart';

import 'router.dart';

void main() {
  runApp(MaterialApp.router(
    debugShowCheckedModeBanner: false,
    themeMode: ThemeMode.system,
    theme: ThemeData.light(),
    darkTheme: ThemeData.dark(),
    routerDelegate: router.routerDelegate,
    routeInformationParser: router.routeInformationParser,
  ));
}
