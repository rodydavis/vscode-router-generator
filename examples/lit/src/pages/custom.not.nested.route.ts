import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("custom-route")
export class CustomRoute extends LitElement {
  static override styles = css``;

  override render() {
    return html` <main>
      <header>Custom</header>
    </main>`;
  }
}
