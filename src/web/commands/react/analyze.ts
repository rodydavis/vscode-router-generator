import { PageRoute } from "../base";
import { Component, convertComponents } from "../utils/meta-data";

export function analyzeReactComponent(
    page: PageRoute
): ReactComponent | null {
    const components: ReactComponent[] = [];

    const raw = page.contents;

    // Check for React default function export
    const defaultExport = raw.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(/) || raw.match(/export\s+function\s+([A-Za-z0-9_]+)\s*\(/);

    // Check for export loader function
    const loader = raw.match(/export\s+function\s+loader\s*\(/) || raw.match(/export\s+async\s+function\s+loader\s*\(/);

    if (defaultExport) {
        let exportName;
        const hasLoader = loader !== null;
        for (const item of defaultExport!) {
            if (item !== 'loader') {
                exportName = item;
            }
        }
        if (exportName) {
            return {
                hasLoader,
                name: exportName,
                path: page.path,
                route: page.route,
                args: [],
            };
        }
    }

    return null;
}


export function pagesToComponents(pages: PageRoute[]) {
    const components: ReactComponent[] = [];

    for (const page of pages) {
        const result = analyzeReactComponent(page);
        if (result) { components.push(result); }
    }

    return convertComponents(components);
}

export interface ReactComponent extends Component {
    name: string;
    hasLoader: boolean;
}
