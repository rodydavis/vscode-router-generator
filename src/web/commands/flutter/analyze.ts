import { PageRoute } from "../base";
import { Component } from "../utils/meta-data";

export function analyzeWidget(page: PageRoute): FlutterWidget | null {
    const path = page.path;
    const relativePath = "pages" + path.split("pages")[1];
    const route = page.route.replace("/root", "").replace("/index", "/");
    const raw = page.contents;

    // Use regex to find "class MyWidget extends UiRoute" 
    const className = raw.match(/class ([^ ]+) extends UiRoute/g);

    if (className !== null) {
        const name = className[0].split(" ")[1].trim();
        return {
            name,
            relativePath,
            route,
            path, 
            args: [],
        };
    }

    return null;
}

export function pagesToWidgets(pages: PageRoute[]): FlutterWidget[] {
    const widgets: FlutterWidget[] = [];
    for (const page of pages) {
        console.debug('router-generator', `Analyzing ${page.path}`);
        const widget = analyzeWidget(page);
        if (widget) { widgets.push(widget); }
    }
    return widgets
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
}

interface FlutterWidget extends Component {
}
