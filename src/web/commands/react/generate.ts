import { PageRoute } from "../base";
import { addHeader } from "../utils/comments";
import { getComponentTree } from "../utils/meta-data";
import { StringBuilder } from "../utils/string-builder";
import { pagesToComponents, ReactComponent } from "./analyze";

export function generateReact(root: string, pages: PageRoute[]) {
    // const dynamicImports = getSetting("dynamicImports") || false;
    const components: ReactComponent[] = pagesToComponents(pages);
    const sb = new StringBuilder();
    addHeader(sb, components);
    sb.writeln('import * as React from "react";');
    sb.writeln();
    for (const c of components) {
        // Upper case the first letter of the component name
        c.alias = c.alias!.charAt(0).toUpperCase() + c.alias!.slice(1);
        if (c.hasLoader) {
            sb.writeln(
                `import { default as ${c.alias}, loader as ${c.alias}Loader } from './${c.relativePath}';`
            );
        } else {
            sb.writeln(
                `import { default as ${c.alias} } from './${c.relativePath}';`
            );
        }
    }
    sb.writeln();
    sb.writeAll([
        "async function App() : Promise<React.ReactElement> {",
        "    const route = window.location.hash.slice(1);",
        "    const routes: {",
        "        [key: string]: (route:string, args: { [key: string]: any }) => Promise<React.ReactElement>;",
        "       } = {",
    ]);
    for (const c of components) {
        sb.writeln(`        '${c.route}': async (route, args) => {`);
        if (c.hasLoader) {
            sb.writeln(`              const data = await ${c.alias}Loader(route, args);`);
        }
        sb.write("              return ");
        const tree = getComponentTree(c, components);
        for (let i = 0; i < tree.length - 1; i++) {
            const item = tree[i];
            sb.write(`<${item.alias}>`);
        }
        sb.write(`<${c.alias}`);
        for (const arg of c.args) {
            sb.write(` ${arg}={Object(args)["${arg}"]}`);
        }
        if (c.hasLoader) {
            sb.write(` data={data}`);
        }
        sb.write("/>");
        for (let i = tree.length - 2; i >= 0; i--) {
            const item = tree[i];
            sb.write(`</${item.alias}>`);
        }
        sb.writeln(";");
        sb.writeln("        },");
        // sb.writeln(`        '${c.route}': (args) => <${c.alias} />,`);
    }
    sb.writeAll([
        "    };",
        "    // Match route with exact path",
        "    const match = Object.entries(routes).find(([key]) => key === route);",
        "    if (match) {",
        "        const Component = await match[1](route, {});",
        "        return Component;",
        "    }",
        "    // Match route with regex",
        "    for (const [key, value] of Object.entries(routes)) {",
        "        const routeMatch = route.match(fixRegex(key));",
        "        if (routeMatch) {",
        "            const args = Object(routeMatch)['groups'] || {};",
        "            const Component = await value(route, args);",
        "            return Component;",
        "        }",
        "    }",
        "    const unknownRoute = Object.entries(routes).find(([key]) => key === '/404');",
        "    if (unknownRoute) {",
        "        const Component = await unknownRoute[1](route, {});",
        "        return Component;",
        "    }",
        "    // If no match, return 404",
        "    return <div>404</div>;",
        "}",
    ]);
    sb.writeln();
    sb.writeAll([
        "function fixRegex(route: string): RegExp {",
        '    const variableRegex = "[a-zA-Z0-9_-]+";',
        "    const nameWithParameters = route.replace(",
        "        new RegExp(`:(${variableRegex})`),",
        "        (match) => {",
        "            const groupName = match.slice(1);",
        "            return `(?<${groupName}>[a-zA-Z0-9_\\\\-.,:;+*^%$@!]+)`;",
        "        }",
        "    );",
        "    return new RegExp(`^${nameWithParameters}$`);",
        "}",
    ]);
    sb.writeln();
    sb.writeln("export default App;");
    return sb.toString();
}
