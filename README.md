# vscode-router-generator

VSCode Extension to generate a router based on a file structure and returning the correct nested layouts.

There can be optional loader function to return data to the component before the build is done.

You can check out the examples for more details.

Inspired by https://remix.run

## Features

- File based routing (with regex)
- Nested layouts
- Works on https://vscode.dev

## Platforms

- Flutter (.dart)
- Lit (.js, .ts)
- React (.tsx, .jsx)
- JSON (.json)

## JSON

`Generate JSON for Routes`

This will generate a json file at the route containing all the metadata found after crawling the `routes` directory.

```json
{
  "routes": {
    "/projects/:id": {
      "hasLoader": true,
      "name": "ProjectDetails",
      "route": "/projects/:id",
      "args": ["id"],
      "ext": "tsx",
      "alias": "route1",
      "relativePath": "routes/projects/:id",
      "implicitIndex": false,
      "parentRoute": "/projects"
    },
    "/projects/": {
      "hasLoader": true,
      "name": "ProjectList",
      "route": "/projects/",
      "args": [],
      "ext": "tsx",
      "alias": "route2",
      "relativePath": "routes/projects/index",
      "parentRoute": "/projects"
    },
    "/projects": {
      "hasLoader": false,
      "name": "ProjectBase",
      "route": "/projects",
      "args": [],
      "ext": "tsx",
      "alias": "route3",
      "relativePath": "routes/projects",
      "implicitIndex": true,
      "parentRoute": ""
    },
    "/": {
      "hasLoader": false,
      "name": "Home",
      "route": "/",
      "args": [],
      "ext": "tsx",
      "alias": "route0",
      "relativePath": "routes/index",
      "parentRoute": ""
    },
    "": {
      "hasLoader": false,
      "name": "Root",
      "route": "",
      "args": [],
      "ext": "tsx",
      "alias": "route4",
      "relativePath": "routes/root"
    }
  }
}
```

## Lit

`Generate Lit Router`

Generates a [router](https://www.npmjs.com/package/@lit-labs/router) that can be used both server side and browser side.

```js
@customElement("router-outlet")
export class RouterOutlet extends LitElement {
  router = createRouter(this);

  override render() {
    return this.router.outlet();
  }
}

```

Also generates a Lit web component that can consume the generated router and listen for hash changes.

```html
<body>
  <router-outlet> </router-outlet>
  <script type="module" src="/src/router.ts"></script>
</body>
```

## Flutter

`Generate Flutter Router`

Generates a Flutter MaterialApp with a [router](https://pub.dev/packages/go_router) using Navigator 2.0 and will listen for hash changes and return the correct layout for the route.

```dart
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

```

Create a widget with the exact properties in the url params and a child if you nest the content in a route:

```dart
import 'package:flutter/material.dart';

class AccountPage extends StatelessWidget {
  const AccountPage({
    Key? key,
    required this.id,
  }) : super(key: key);

  final String id;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('ID: $id'),
    );
  }
}

```

To update the route in a widget just dispatch the following:

```dart
RoutingRequest('ROUTE_HERE').dispatch(context)
```

## React

`Generate React Router`

Generates a async React component that can be used to render a layout based on the url.

You can import the generated router and run it at the top level index.js:

```jsx
import * as ReactDOM from "react-dom";
import App from "./router";

const root = document.getElementById("root");

async function loadApp() {
  const AppRoot = await App();
  ReactDOM.render(AppRoot, root);
}

window.addEventListener("hashchange", () => {
  loadApp();
});

loadApp();
```

You can define a layout and an optional loader for a given page:

```jsx
import * as React from "react";

export function loader(route: string, args: { [key: string]: any }) {
  const id = args["id"];
  return {
    id: `${id}`,
    name: `Project ${id}`,
  };
}

export default function ProjectDetails({
  data,
  children,
}: {
  id: string,
  data: Project,
  children?: React.ReactNode,
}) {
  const project = data;
  return (
    <div>
      <h3>{project.name}</h3>

      {children}
    </div>
  );
}

interface Project {
  id: string;
  name: string;
}
```

To build with nested layouts you can use the children from the props to pass down the tree:

```jsx
import * as React from "react";
import Header from "../components/Header";

export default function ProjectBase({
  children,
}: {
  children?: React.ReactNode,
}) {
  return (
    <div>
      <Header title="Projects" />
      <section
        style={{
          padding: "1rem",
        }}
      >
        {children}
      </section>
    </div>
  );
}
```
