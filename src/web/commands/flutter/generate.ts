import { render } from "mustache";
import { PageRoute } from "../base";
import { addHeader } from "../utils/comments";
import { getComponentTree } from "../utils/meta-data";
import { StringBuilder } from "../utils/string-builder";
import { renderTemplate } from "../utils/template";
import { FlutterWidget, pagesToWidgets } from "./analyze";

const TEMPLATE_SOURCE = `{{{header}}}
// ignore_for_file: prefer_const_constructors

import 'package:go_router/go_router.dart';

{{#components}}
import '{{{relativePath}}}.dart' as {{{alias}}};
{{/components}}

final router = GoRouter(
  routes: <GoRoute>[
    {{#components}}
    {{#template}}
    GoRoute(
        path: '{{{route}}}',
        builder: (context, state) => {{{template}}},
    ),
    {{/template}}
    {{/components}}
  ],
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
  const ignore: string[] = [];
  const skip: string[] = [""];
  for (const component of components) {
    const comp = component;
    if (comp.route === "") {
      continue;
    }
    if (ignore.includes(comp.route)) {
      continue;
    }
    let route = comp.route;
    // Check for ending with /
    if (comp.route.endsWith("/") && comp.route !== "/") {
      // Check if has parent route
      const parentRoute = comp.route.substring(0, comp.route.length - 1);
      const parent = components.find((c) => c.route === parentRoute);
      if (parent) {
        skip.push(comp.route);
        route = parentRoute;
        comp.overrideRoute = parentRoute;
        ignore.push(parentRoute);
      } else {
        route = parentRoute;
        comp.overrideRoute = parentRoute;
      }
    }
    const tree = getComponentTree(comp, components);
    let slot: string | undefined;
    for (const c of tree.reverse()) {
      slot = renderComponent(c, slot);
    }
    Object(comp)["template"] = slot;
    comp.route = route;
  }
  const template = renderTemplate(TEMPLATE_SOURCE, {
    header: h.toString(),
    components,
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
