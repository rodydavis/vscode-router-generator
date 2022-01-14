// This file is auto-generated by vscode-router-generator
// Do not edit this file directly

// Page Routes
// "/test": root-module > test-module
// "/settings/admin": root-module > settings-module > admin-settings
// "/settings/": root-module > settings-module > settings-default
// "/settings": root-module > settings-module
// "/dashboard/overview": root-module > dashboard-module > overview-module
// "/dashboard/account/:userid": root-module > dashboard-module > account-module > account-details
// "/dashboard/account/": root-module > dashboard-module > account-module > account-info
// "/dashboard/account": root-module > dashboard-module > account-module
// "/dashboard/": root-module > dashboard-module > dashboard-default
// "/dashboard": root-module > dashboard-module
// "/custom": root-module > custom-route
// "/404": root-module > unknown-route
// "/": root-module > app-module
// "": root-module

import "@lit-labs/ssr/lib/install-global-dom-shim.js";
import "@lit-labs/ssr/lib/render-lit-html.js";
import { render } from '@lit-labs/ssr/lib/render-with-global-dom-shim.js';

import express from "express";
import { dirname } from "path";
import { renderRoute } from "./router.js";
import { html } from "lit";

const app = express();
const port = 3000;
const appTitle = "lit-file-based-router";

app.use(express.static(dirname(import.meta.url)));

app.use(async function (req, res, next) {
    const route = req.url;
    if (route.endsWith(".js")) {
        res.setHeader("Content-Type", "text/javascript");
        const module = await import(`.${req.url}`);
        res.send(module);
    }
    next();
});

export function addRoutes(app: express.Express) {
   app.get("/test", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/test.multiple.:args.ts");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("/settings/admin", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/settings");
     imports.push("pages/settings/admin");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("/settings/", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/settings");
     imports.push("pages/settings/index");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("/settings", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/settings");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("/dashboard/overview", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/dashboard");
     imports.push("pages/dashboard/overview");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("/dashboard/account/:userid", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/dashboard");
     imports.push("pages/dashboard/account");
     imports.push("pages/dashboard/account/:userId");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("/dashboard/account/", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/dashboard");
     imports.push("pages/dashboard/account");
     imports.push("pages/dashboard/account/index");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("/dashboard/account", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/dashboard");
     imports.push("pages/dashboard/account");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("/dashboard/", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/dashboard");
     imports.push("pages/dashboard/index");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("/dashboard", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/dashboard");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("/custom", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/custom.nested.route.ts");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("/404", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/404");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("/", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     imports.push("pages/index");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

   app.get("", async (req, res) => {
     res.setHeader("Content-Type", "text/html");
     const route = req.url;
     const imports: string[] = [];
     imports.push("pages/root");
     const content = await renderComponent(route, imports);
     res.send(content);
   });

}

addRoutes(app);

async function renderComponent(route: string, imports: string[]) {
  const template = await renderRoute(route);
  const ssrResult = render(template || html``);
  const htmlResult = Array.from(ssrResult).join("");
  const content = renderHtml(htmlResult, { title: appTitle, imports });
  return content;
}

function renderHtml(content: string, options?: { title?: string, imports?: string[] }) {
  const { title = "", imports = [] } = options || {};
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      ${content}
      <script type="module">
        ${imports.map(i => `import "${i}";`).join('\n')}
      </script>
    </body>
  </html>
`;
}

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
