# vscode-router-generator

VSCode Extension to generate a router based on a file structure and returning the correct nested layouts.

There can be optional loader function to return data to the component before the build is done.

You can check out the examples for more details.

Inspired by https://remix.run

## Features

- File based routing (with regex)
- Nested layouts
- Optional loader function (to pass data to a component)
- Works on https://vscode.dev

## Platforms

- Flutter
- Lit
- React
- JSON

## JSON

`Generate JSON for Routes`

This will generate a json file at the route containing all the metadata found after crawling the pages directory.

```json
{
  "pages": {
    "/projects/:id": {
      "hasLoader": true,
      "name": "ProjectDetails",
      "route": "/projects/:id",
      "args": [
        "id"
      ],
      "ext": "tsx",
      "alias": "route1",
      "relativePath": "pages/projects/:id",
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
      "relativePath": "pages/projects/index",
      "parentRoute": "/projects"
    },
    "/projects": {
      "hasLoader": false,
      "name": "ProjectBase",
      "route": "/projects",
      "args": [],
      "ext": "tsx",
      "alias": "route3",
      "relativePath": "pages/projects",
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
      "relativePath": "pages/index",
      "parentRoute": ""
    },
    "": {
      "hasLoader": false,
      "name": "Root",
      "route": "",
      "args": [],
      "ext": "tsx",
      "alias": "route4",
      "relativePath": "pages/root"
    }
  },
  "routes": [
    "/projects/:id",
    "/projects/",
    "/projects",
    "/",
    ""
  ]
}
```

## Lit

`Generate Lit Router`

Generates a router that can be used both server side and browser side.

`Generate Lit Component`

Generates a Lit web component that can consume the generated router and listen for hash changes.

```html
<body>
    <generated-app> </generated-app>
    <script type="module" src="/src/generated-app.ts"></script>
</body>
```

`Generate Lit SSR Server`

Generates a express.js application that consumes the router and returns html rendered on the server.

To generate a route just define a web component and an optional loader method:


```js
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export async function loader(
  route: string,
  args: { [key: string]: any }
): Promise<AccountData> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const id = args["id"]!;
  return {
    id,
    name: "Name: " + id,
    email: route,
  };
}

@customElement("account-details")
export class AccountDetails extends LitElement {
  static styles = css``;

  @property({ type: String }) id = "";
  @property({ type: Object }) data!: AccountData;

  render() {
    return html`<section>User ID: ${this.data.id}</section>`;
  }
}

interface AccountData {
  id: string;
  name: string;
  email: string;
}

```

## Flutter

`Generate Flutter Router`

Generates a Flutter MaterialApp with a generated router using Navigator 2.0 and will listen for hash changes and return the correct layout for the route.

```dart
import 'package:flutter/material.dart';

import 'router.dart';

void main() {
  runApp(GeneratedApp(
    themeMode: ThemeMode.system,
    theme: ThemeData.light(),
    darkTheme: ThemeData.dark(),
  ));
}

```

To build a class extend UiRoute and override the methods (including an optional loader):

```dart
import 'package:flutter/material.dart';

import '../../router.dart';

class AccountPage extends UiRoute<Map<String, String>> {
  @override
  loader(route, args) => args;

  @override
  Widget builder(
      BuildContext context, Map<String, String> data, Widget? child) {
    return Center(
      child: Text('ID: ${data['id']}'),
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
import * as ReactDOM from 'react-dom';
import App from './router';

const root = document.getElementById('root');

async function loadApp() {
  const AppRoot = await App();
  ReactDOM.render(AppRoot, root
  );
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
    const id = args['id'];
    return {
        id: `${id}`,
        name: `Project ${id}`,
    };
}

export default function ProjectDetails({
    data,
    children,
}: {
    id: string;
    data: Project;
    children?: React.ReactNode;
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

export default function ProjectBase({ children }: { children?: React.ReactNode }) {
    return (
        <div>
            <Header title="Projects" />
            <section style={{
                padding: '1rem',
            }}>
                {children}
            </section>
        </div>
    );
}

```
