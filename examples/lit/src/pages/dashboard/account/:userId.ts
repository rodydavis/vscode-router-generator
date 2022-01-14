import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { User } from "../../../classes/user";

export async function loader(
  route: string,
  args: { [key: string]: any }
): Promise<User> {
  const data = await fetch('https://jsonplaceholder.typicode.com/users/' + args.userId).then((res) => res.json());
  return data;
}

@customElement("account-details")
export class AccountDetails extends LitElement {
  static override styles = css`
    section{
      padding: 0px 16px;
    }
  `;

  @property() userId = "";
  @property({ type: Object }) data!: User;

  override render() {
    return html`<section>
  <h2>${this.data.name}</h2>
  <p>Email: ${this.data.email}</p>
  <p>Phone: ${this.data.phone}</p>
  <p>Website: ${this.data.website}</p>
  <p>Company: ${this.data.company.name}</p>
</section>`;
  }
}
