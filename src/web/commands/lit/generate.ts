import { pagesToComponents, WebComponent } from "./analyze";
import { PageRoute } from "../base";
import { StringBuilder } from "../utils/string-builder";
import { getSetting } from "../utils";
import { addHeader } from "../utils/comments";
import { getComponentTree } from "../utils/meta-data";
import { renderTemplate } from "../utils/template";

const TEMPLATE_SOURCE = `{{{header}}}
import "urlpattern-polyfill";

import {Routes} from '@lit-labs/router';
import {html, LitElement, ReactiveControllerHost} from 'lit';
import {customElement} from "lit/decorators.js";

{{#imports}}
import * as {{{alias}}} from '{{{path}}}';
{{/imports}}

export function createRouter(element: ReactiveControllerHost & HTMLElement) {
  return new Routes(element, [
    {{#routes}}
    { 
      path: '{{{path}}}',
      render: {{{async}}} (params) => {
        return html\`{{{template}}}\`;
      },
      {{#dynamicImport}}
      enter: async () => {
        await import('{{{path}}}');
        return true;
      },
      {{/dynamicImport}}
    },
    {{/routes}}
  ]);
}

@customElement("router-outlet")
export class RouterOutlet extends LitElement {
  router = createRouter(this);

  override render() {
    return this.router.outlet();
  }
}
`;

export function exportLit(pages: PageRoute[]) {
  const dynamicImports = getSetting("dynamicImports") || false;
  const includeExt = getSetting("includeExt") || false;
  const components: WebComponent[] = pagesToComponents(pages);
  const h = new StringBuilder();
  addHeader(h, components);
  const template = renderTemplate(TEMPLATE_SOURCE, {
    header: h.toString(),
    imports: dynamicImports
      ? []
      : components.map((c) => ({
          path: `./${c.relativePath}${includeExt ? ".js" : ""}`,
          alias: c.alias,
        })),
    routes: components.map((c) => {
      const tree = getComponentTree(c, components);
      const sb = new StringBuilder();
      for (let i = 0; i < tree.length - 1; i++) {
        const element = tree[i];
        sb.write(`<${element.name}`);
        for (const arg of element.args) {
          sb.write(` ${arg}=\${params['${arg}']!}`);
        }
        sb.write(`>`);
      }
      sb.write(`<${c.name}`);
      for (const arg of c.args) {
        sb.write(` ${arg}=\${params['${arg}']!}`);
      }
      sb.write(`>`);
      sb.write(`</${c.name}>`);
      for (let i = tree.length - 2; i > -1; i--) {
        const element = tree[i];
        sb.write(`</${element.name}>`);
      }
      const imports = [
        { path: `./${c.relativePath}${includeExt ? ".js" : ""}` },
      ];
      return {
        path: `${c.route}`,
        template: `${sb.toString()}`,
        dynamicImport: dynamicImports ? imports : undefined,
      };
    }),
  });
  return template;
}
