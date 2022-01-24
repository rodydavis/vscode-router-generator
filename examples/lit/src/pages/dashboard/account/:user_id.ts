import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { User } from "../../../classes/user";

export async function loader(
  route: string,
  args: { [key: string]: any }
): Promise<User> {
  const id = Object(args)["user_id"];
  const data = await fetch(
    "https://jsonplaceholder.typicode.com/users/" + id
  ).then((res) => res.json());
  return data;
}

@customElement("account-details")
export class AccountDetails extends LitElement {
  static override styles = css`
    section{
      padding: 0px 16px;
    }
  `;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  @property() user_id = "";
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
