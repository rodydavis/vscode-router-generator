export function getRouteArgs(route: string) {
  // Route /info/:id/:name => [id, name]
  const routeParts = route.split("/");
  const routeArgs: string[] = [];
  for (const p of routeParts) {
    const part = p.split(".")[0];
    if (part.startsWith(":")) {
      routeArgs.push(part.substring(1));
      continue;
    }
    if (part.startsWith("[") && part.endsWith("]")) {
      routeArgs.push(part.substring(1, part.length - 1));
      continue;
    }
  }
  return routeArgs;
}

export function convertRoute(route: string) {
  // Convert /info/[id]/test to /info/:id/test
  const routeParts = route.split("/");
  for (let i = 0; i < routeParts.length; i++) {
    const p = routeParts[i];
    const hasExt = p.split(".").length > 1;
    const part = hasExt ? p.split(".")[0] : p;

    if (part.startsWith("[") && part.endsWith("]")) {
      const inner = part.substring(1, part.length - 1);
      const converted = `:${inner}`;
      if (hasExt) {
        routeParts[i] = converted + "." + p.split(".")[1];
      } else {
        routeParts[i] = converted;
      }
    }
  }
  return routeParts.join("/");
}
