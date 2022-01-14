import { PageRoute } from "../base";
import { addHeader } from "../utils/comments";
import { StringBuilder } from "../utils/string-builder";
import { pagesToComponents, WebComponent } from "./analyze";

export async function exportLitComponent(root: string, pages: PageRoute[]) {
    const sb = new StringBuilder();
    const components: WebComponent[] = pagesToComponents(pages);
    addHeader(sb, components);
    sb.writeAll([
        `import { customElement } from "lit/decorators.js";`,
        `import { html, LitElement, TemplateResult } from "lit";`,
        `import { renderRoute } from "./router";`,
        ``,
        `@customElement("generated-app")`,
        `export class GeneratedApp extends LitElement {`,
        `  template: TemplateResult | null = null;`,
        ``,
        `  override render() {`,
        '    if (!this.template) return html`Loading...`;',
        `    return this.template;`,
        `  }`,
        ``,
        `  override async firstUpdated() {`,
        `    window.addEventListener("hashchange", () => this.updateRoute());`,
        `    this.updateRoute();`,
        `    if (window.location.hash === "") window.location.hash = "/";`,
        `  }`,
        ``,
        `  async updateRoute() {`,
        `    const route = window.location.hash.slice(1);`,
        `    this.template = await renderRoute(route);`,
        `    this.requestUpdate();`,
        `  }`,
        `}`,
    ]);
    return sb.toString();
}