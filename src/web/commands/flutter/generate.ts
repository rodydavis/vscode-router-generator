import { PageRoute } from "../base";
import { addHeader } from "../utils/comments";
import { getComponentTree } from "../utils/meta-data";
import { StringBuilder } from "../utils/string-builder";
import { renderTemplate } from "../utils/template";
import { Trie, TrieNode } from "../utils/trie";
import { FlutterWidget, pagesToWidgets } from "./analyze";

const TEMPLATE_SOURCE = `{{{header}}}
// ignore_for_file: prefer_const_constructors

import 'package:go_router/go_router.dart';

{{#components}}
import '{{{relativePath}}}.dart' as {{{alias}}};
{{/components}}

final routes = <GoRoute>[
  {{{routes}}}
];

final router = GoRouter(
  routes: routes,
);
`;

export function generateFlutter(root: string, pages: PageRoute[]) {
  const components = pagesToWidgets(pages);

  const h = new StringBuilder();
  addHeader(h, components);
  let i = 0;

  for (const p of components) {
    p.alias = `route${i}`;
    i++;
  }

  const trie = new Trie<FlutterWidget>();
  for (const comp of components.reverse()) {
    if (comp.route === "") {
      continue;
    }
    trie.add(comp.route, comp);
  }

  const trieJson = JSON.stringify(trie, replacer, 2);
  console.log(trieJson);

  const routes = exportTrie("", trie.root, components);

  const template = renderTemplate(TEMPLATE_SOURCE, {
    header: h.toString(),
    components,
    routes,
  });
  return template;
}

function renderComponent(comp: FlutterWidget, slot?: string) {
  const sb = new StringBuilder();
  sb.write(`${comp.alias}.${comp.name}(`);
  for (const arg of comp.args) {
    sb.write(` ${arg}: state.params['${arg}']!,`);
  }
  if (slot) {
    sb.write(` child: ${slot},`);
  }
  sb.write(`)`);
  return sb.toString();
}

function exportTrie(
  part: string,
  node: TrieNode<FlutterWidget>,
  components: FlutterWidget[]
) {
  const sb = new StringBuilder();
  let comp = node.value;

  if (!comp && part !== "") {
    // Check for index route
    if (node.children.has("index")) {
      const child = node.children.get("index")!.value;
      if (child) {
        comp = child;
      }
    }
  }

  if (comp) {
    // Check if has implicit index
    if (node.children.has("index")) {
      comp = node.children.get("index")!.value!;
    }
    const tree = getComponentTree(comp, components);
    let template: string | undefined;
    for (const c of tree.reverse()) {
      template = renderComponent(c, template);
    }
    let compRoute = comp.route;
    if (compRoute.endsWith("/") && compRoute !== "/") {
      compRoute = compRoute.substring(0, compRoute.length - 1);
    }
    compRoute = compRoute.substring(
      compRoute.lastIndexOf("/") + 1,
      compRoute.length
    );
    sb.writeln("GoRoute(");
    sb.writeln(` path: '${compRoute || "/"}',`);
    sb.writeln(` builder: (context, state) => ${template},`);
    sb.writeln(" routes: <GoRoute>[");
  }

  let childrenKeys = Array.from(node.children.keys());
  if (childrenKeys.length > 0) {
    childrenKeys = childrenKeys.sort();
    childrenKeys = childrenKeys.reverse();
    for (const key of childrenKeys) {
      const child = node.children.get(key)!;
      if (comp === child.value) {
        continue;
      }
      sb.writeln(exportTrie(`${key}`, child, components));
    }
  }

  if (comp) {
    sb.writeln("  ],");
    sb.writeln("),");
  }

  return sb.toString();
}

function replacer(key: string, value: any) {
  if (key === "value") {
    if (value?.route) {
      return value.route;
    }
  }
  return value;
}
