import {  pagesToComponents, WebComponent } from "./analyze";
import { PageRoute } from "../base";
import { StringBuilder } from "../utils/string-builder";
import { getSetting } from "../utils";
import { addHeader } from "../utils/comments";
import { getComponentTree } from "../utils/meta-data";

export function exportLit(pages: PageRoute[]) {
    const dynamicImports = getSetting('dynamicImports') || false;
    const sb = new StringBuilder();
    const components: WebComponent[] = pagesToComponents(pages);
    addHeader(sb, components);
    sb.writeln(`import { html, TemplateResult } from "lit";`);
    sb.writeln();
    if (!dynamicImports) {
        for (const c of components) {
            sb.writeln(`import * as ${c.alias} from './${c.relativePath}';`);
        }
        sb.writeln();
    }
    sb.writeAll([
        "interface LitOptions {",
        "  route: string,",
        "  args: { [key: string]: string },",
        "  data: any",
        "}",
    ]);
    sb.writeln();
    sb.writeAll([
        "interface PageRoute {",
        "  render: (options: LitOptions) => TemplateResult,",
        "  lazyImport: () => Promise<any>,",
        "  hasIndex: boolean",
        "  dataLoader: (alias:any, route:string, args: { [key: string]: string }) => Promise<any>",
        "}",
    ]);
    sb.writeln();
    sb.writeln(
        "export const routes = new Map<string, PageRoute>(["
    );
    for (const c of components) {
        sb.writeln(`  ['${c.route}', {`);
        sb.write(`        render: (`);
        const args: string[] = [];
        if (c.args.length > 0) {
            args.push(`args`);
        }
        if (c.hasLoader) {
            args.push(`data`);
        }
        if (args.length > 0) {
            sb.write(`{ ${args.join(", ")} }`);
        }
        sb.write(`) => html\``);
        const tree = getComponentTree(c, components);
        for (let i = 0; i < tree.length - 1; i++) {
            const element = tree[i];
            sb.write(`<${element.name}>`);
        }
        sb.write(`<${c.name} `);
        for (const arg of c.args) {
            sb.write(`${arg}=\${args['${arg}']} `);
        }
        if (c.hasLoader) {
            sb.write(` .data=\${data} `);
        }
        sb.write(`>`);
        sb.write(`</${c.name}>`);
        for (let i = tree.length - 2; i > -1; i--) {
            const element = tree[i];
            sb.write(`</${element.name}>`);
        }
        sb.writeln('`,');
        if (dynamicImports) {
            sb.writeln(`        lazyImport: async () => {`);
            for (let i = 0; i < tree.length - 1; i++) {
                if (i === tree.length - 1) { continue; }
                const item = tree[i];
                sb.writeln(`            await import('./${item.relativePath}');`);
            }
            sb.writeln(`            return import('./${c.relativePath}');`);
            sb.writeln(`        },`);
        } else {
            sb.writeln(`        lazyImport: async () => ${c.alias},`);
        }

        if (c.hasLoader) {
            sb.writeln(`        dataLoader: (alias, route, args) => alias.loader(route, args),`);
        } else {
            sb.writeln(`        dataLoader: () => Promise.resolve(null),`);
        }
        sb.writeln(`        hasIndex: ${c.implicitIndex || false}`);
        sb.writeln(`    }],`);
    }
    sb.writeln("]);");
    sb.writeln();
    sb.writeAll([
        'export async function renderRoute(route: string) : Promise<TemplateResult | null> {',
        '    const match = getRoute(route);',
        '    if (match) {',
        '        const args = getArgsForRoute(route);',
        '        const attrs: { [key: string]: string } = {};',
        '        if (args?.groups) {',
        '            for (const [key, value] of Object.entries(args.groups)) {',
        '                if (key && value) attrs[key] = value;',
        '            }',
        '        }',
        '        const alias = await match.lazyImport();',
        '        const data = await match.dataLoader(alias, route, attrs);',
        '        return match.render({ route, args: attrs, data });',
        '    }',
        "    return null;",
        '}',
    ]);
    sb.writeln();
    sb.writeAll([
        'function getRoute(route: string) {',
        '    const match = routes.get(route);',
        '    if (match) {',
        '        if (match.hasIndex) {',
        '            const indexMatch = routes.get(`${route}/`);',
        '            if (indexMatch) {',
        '                return indexMatch;',
        '            }',
        '        }',
        '        return match;',
        '    }',
        '    for (const [key, value] of routes.entries()) {',
        '        const regMatch = route.match(fixRegex(key));',
        '        if (regMatch !== null) return value;',
        '    }',
        "    return routes.get('/404')",
        '}',
    ]);
    sb.writeln();
    sb.writeAll([
        'function fixRegex(route: string): RegExp {',
        '    const variableRegex = "[a-zA-Z0-9_-]+";',
        '    const nameWithParameters = route.replace(',
        '        new RegExp(`:(${variableRegex})`),',
        '        (match) => {',
        '            const groupName = match.slice(1);',
        '            return `(?<${groupName}>[a-zA-Z0-9_\\\\-.,:;+*^%$@!]+)`;',
        '        }',
        '    );',
        '    return new RegExp(`^${nameWithParameters}$`);',
        '}',
    ]);
    sb.writeln();
    sb.writeAll([
        'function getArgsForRoute(route: string): RegExpMatchArray | null {',
        '     for(const key of Array.from(routes.keys())) {',
        '        const regMatch = route.match(fixRegex(key));',
        '        if (regMatch !== null) return regMatch;',
        '    }',
        '    return null;',
        '}',
    ]);
    return sb.toString();
}
