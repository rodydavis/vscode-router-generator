import { PageRoute } from "../base";
import { Component, convertComponents } from "../utils/meta-data";

export function analyzeWidget(page: PageRoute): FlutterWidget | null {
  const path = page.path;
  const relativePath = "routes" + path.split("routes")[1];
  const route = page.route.replace("/root", "").replace("/index", "/");
  const raw = page.contents;

  // Use regex to find "class MyWidget extends UiRoute"
  const className =
    raw.match(/class ([^ ]+) extends StatelessWidget/g) ||
    raw.match(/class ([^ ]+) extends StatefulWidget/g);

  if (className !== null) {
    const name = className[0].split(" ")[1].trim();
    const obj = {
      name,
      relativePath,
      route,
      path,
      args: [] as string[],
    };
    // Route /info/:id/:name => [id, name]
    obj.args = route
      .split("/")
      .filter((x) => x.startsWith(":"))
      .map((x) => x.substring(1));
    return obj;
  }

  return null;
}

export function pagesToWidgets(pages: PageRoute[]): FlutterWidget[] {
  const components: FlutterWidget[] = [];
  let i = 0;
  for (const page of pages) {
    const { path, route, contents } = page;
    const relativePath = path.split("routes")[1];
    const filePath = `./routes${relativePath}`;
    const fileRoute = route.replace("/root", "").replace("/index", "/");
    const results = analyzeWidget(page);
    if (results) {
      const c = results;
      c.path = path;
      components.push(c);
    }
    i++;
  }
  const sorted = components
    .sort((a, b) => {
      if (a.route < b.route) {
        return -1;
      }
      if (a.route > b.route) {
        return 1;
      }
      return 0;
    })
    .reverse();
  return convertComponents(sorted);
}

export interface FlutterWidget extends Component {}
