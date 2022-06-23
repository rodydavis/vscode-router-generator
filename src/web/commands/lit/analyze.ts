import { PageRoute } from "../base";
import { Component, convertComponents } from "../utils/meta-data";

export function analyzeWebComponent(
    path: string,
    route: string,
    content: string
): WebComponent[] {
    const components: WebComponent[] = [];
    // Check for export function loader( or export async function loader(
    let hasLoader = false;
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
            line.includes("export function loader(") ||
            line.includes("export async function loader(")
        ) {
            hasLoader = true;
            break;
        }
    }

    // Look for @customElement decorator and get the value
    const regex = /@customElement\("([^"]+)"\)/g;
    const matches = content.match(regex);
    if (matches) {
        for (const match of matches) {
            const result = match.match(/@customElement\("([^"]+)"\)/);
            if (result) {
                const name = result[1];
                components.push({
                    name,
                    path,
                    hasLoader,
                    route,
                    args: [],
                });
            }
        }
    }
    // Look for customElements.define() and get the value
    const regex2 = /customElements\.define\("([^"]+)"/g;
    const matches2 = content.match(regex2);
    if (matches2) {
        for (const match of matches2) {
            const result = match.match(/customElements\.define\("([^"]+)"/);
            if (result) {
                const name = result[1];
                components.push({
                    name,
                    path,
                    hasLoader,
                    route,
                    args: [],
                });
            }
        }
    }

    // Get class exports
    // const regex3 = /export class ([^ ]+)/g;
    // const matches3 = content.match(regex3);
    // if (matches3) {
    //     for (const match of matches3) {
    //         const result = match.match(/export class ([^ ]+)/);
    //         if (result) {
    //             const name = result[1];
    //             console.log(`Found class ${name}`);
    //         }
    //     }
    // }

    return components;
}


export function pagesToComponents(pages: PageRoute[]) {
    const components: WebComponent[] = [];
    let i = 0;
    for (const { path, route, contents } of pages) {
        const relativePath = path.split("routes")[1];
        const filePath = `./routes${relativePath}`;
        const fileRoute = route.replace("/root", "").replace("/index", "/");
        const results = analyzeWebComponent(filePath, fileRoute, contents);
        if (results.length > 0) {
            const c = results[0];
            c.path = path;
            components.push(c);
        }
        i++;
    }
    return convertComponents(components);
}

export interface WebComponent extends Component {
    hasLoader: boolean;
}
