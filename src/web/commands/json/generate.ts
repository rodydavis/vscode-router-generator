import { PageRoute } from "../base";
import { pagesToComponents as lit } from "../lit/analyze";
import { pagesToComponents as react } from "../react/analyze";
import { pagesToWidgets as flutter } from "../flutter/analyze";
import { Component } from "../utils/meta-data";

export function generateJson(pages: PageRoute[]) {
    const json: { [key: string]: any } = {};
    const routes: string[] = [];
    const routePages: { [key: string]: any } = {};
    const ext = pages.map((p) => p.path.split(".")[1]);
    const isTs = ext.some((e) => e === "ts");
    const isJs = ext.some((e) => e === "js");
    const isJsx = ext.some((e) => e === "jsx");
    const isTsx = ext.some((e) => e === "tsx");
    const isDart = ext.some((e) => e === "dart");
    if (isDart) {
        const components: Component[] = flutter(pages);
        for (const c of components) {
            routePages[c.route] = c;
            routes.push(c.route);
        }
    } else if (isJsx || isTsx) {
        const components: Component[] = react(pages);
        for (const c of components) {
            routePages[c.route] = c;
            routes.push(c.route);
        }
    } else if (isTs || isJs) {
        const components: Component[] = lit(pages);
        for (const c of components) {
            routePages[c.route] = c;
            routes.push(c.route);
        }
    } else {
        for (const c of pages) {
            routePages[c.route] = c.path;
            routes.push(c.route);
        }
    }
    json["pages"] = routePages;
    json["routes"] = routes;
    return JSON.stringify(json, null, 2);
}
