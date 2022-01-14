import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { User } from "../../../classes/user";

export async function loader() {
  const data = await fetch("https://jsonplaceholder.typicode.com/users").then((res) => res.json());
  return data;
}

@customElement("account-info")
export class AccountInfo extends LitElement {
  static override styles = css`
    article {
      padding: 16px;
    }
  `;

  @property({ type: Array }) data!: User[];

  override render() {
    return html`<article>
  <h3>Accounts</h3>
  <ul>
    ${this.data.map(
    (user) => html`<li><a href="#/dashboard/account/${user.id}">${user.name}</a></li>`
    )}
  </ul>
</article>`;
  }
}
