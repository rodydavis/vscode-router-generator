import { PageRoute } from "../base";
import { pagesToComponents, WebComponent } from "./analyze";
import { getSetting, readFile } from "../utils";
import { addHeader } from "../utils/comments";
import { getComponentTree } from "../utils/meta-data";
import { StringBuilder } from "../utils/string-builder";

export async function exportLitSSr(root: string, pages: PageRoute[]) {
    const components: WebComponent[] = pagesToComponents(pages);
    const sb = new StringBuilder();
    const packageJson = await readFile(`${root}/package.json`);
    const packageName = getSetting('title') || JSON.parse(packageJson).name || '';
    addHeader(sb, components);
    sb.writeAll([
        'import "@lit-labs/ssr/lib/install-global-dom-shim.js";',
        'import "@lit-labs/ssr/lib/render-lit-html.js";',
        "import { render } from '@lit-labs/ssr/lib/render-with-global-dom-shim.js';",
        '',
        'import express from "express";',
        'import { dirname } from "path";',
        'import { renderRoute } from "./router.js";',
        'import { html } from "lit";',
    ]);
    sb.writeln();
    sb.writeAll([
        'const app = express();',
        'const port = 3000;',
        `const appTitle = "${packageName}";`,
        '',
        'app.use(express.static(dirname(import.meta.url)));',
        "",
        'app.use(async function (req, res, next) {',
        '    const route = req.url;',
        '    if (route.endsWith(".js")) {',
        '        res.setHeader("Content-Type", "text/javascript");',
        '        const module = await import(`.${req.url}`);',
        '        res.send(module);',
        '    }',
        '    next();',
        '});',
    ]);
    sb.writeln();
    sb.writeln("export function addRoutes(app: express.Express) {");
    for (const c of components) {
        const tree = getComponentTree(c, components);
        sb.writeAll([
            `   app.get("${c.route}", async (req, res) => {`,
            '     res.setHeader("Content-Type", "text/html");',
            '     const route = req.url;',
            '     const imports: string[] = [];',
        ]);
        for (const item of tree) {
            sb.writeln(`     imports.push("${item.relativePath}");`);
        }
        sb.writeAll([
            '     const content = await renderComponent(route, imports);',
            '     res.send(content);',
            '   });',
        ]);
        sb.writeln();
    }
    sb.writeln('}');
    sb.writeln('');
    sb.writeln('addRoutes(app);');
    sb.writeln('');
    sb.writeAll([
        'async function renderComponent(route: string, imports: string[]) {',
        '  const template = await renderRoute(route);',
        '  const ssrResult = render(template || html``);',
        '  const htmlResult = Array.from(ssrResult).join("");',
        '  const content = renderHtml(htmlResult, { title: appTitle, imports });',
        '  return content;',
        '}',
    ]);
    sb.writeln();
    sb.writeAll([
        'function renderHtml(content: string, options?: { title?: string, imports?: string[] }) {',
        '  const { title = "", imports = [] } = options || {};',
        '  return \`<!DOCTYPE html>',
        '  <html lang="en">',
        '    <head>',
        '      <meta charset="UTF-8">',
        '      <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '      <title>${title}</title>',
        '      <style>',
        '        body {',
        '          margin: 0;',
        '          padding: 0;',
        '        }',
        '      </style>',
        '    </head>',
        '    <body>',
        '      ${content}',
        '      <script type="module">',
        '        ${imports.map(i => `import "${i}";`).join(\'\\n\')}',
        '      </script>',
        '    </body>',
        '  </html>',
        '\`;',
        '}',
        '',
        'app.listen(port, () => {',
        '  console.log(`Server started on port http://localhost:${port}`);',
        '});',
    ]);
    return sb.toString();
}
