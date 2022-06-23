import * as vscode from "vscode";
import {
  getSetting,
  readDir,
  readFile,
  showErrorMessage,
  showMessage,
} from "./utils";

export async function generateBase(
  callback: (
    root: string,
    routes: PageRoute[]
  ) => Promise<{ success: boolean; message: string }>
) {
  // List files in current folder using vscode.workspace.fs
  const folder = vscode.workspace.workspaceFolders;
  if (!folder || folder.length === 0) {
    showErrorMessage("No workspace folder found");
  } else {
    const root = folder[0].uri.fsPath;
    // Check for routes folder
    let routesDir: vscode.Uri | undefined;
    const routesDirPath = getSetting("routesDir") || "routes";
    for (const folderPath of [
      `${root}/lib/routes`,
      `${root}/src/routes`,
      `${root}/${routesDirPath}`,
    ]) {
      const uri = vscode.Uri.parse(folderPath);
      try {
        await vscode.workspace.fs.stat(uri);
        routesDir = uri;
        break;
      } catch (error) {}
    }
    if (routesDir) {
      const files: string[] = [];
      await readDir(routesDir, files);
      const routes = await analyzeroutes(files);
      const { success, message } = await callback(root, routes);
      if (success) {
        showMessage(message);
      } else {
        showErrorMessage(message);
      }
    } else {
      showErrorMessage("No routes folder found");
    }
  }
}

async function analyzeroutes(files: string[]) {
  const routes: PageRoute[] = [];
  for (const file of files) {
    const contents = await readFile(file);
    // Remove extension
    let idx = file.length - 1;
    while (file[idx] !== ".") {
      idx--;
    }
    const fileType = file.slice(idx + 1, file.length);
    const includeTestFiles = getSetting("includeTestFiles") === "true";
    if (
      !includeTestFiles &&
      (file.includes("_test") ||
        file.includes("_spec") ||
        file.includes("_e2e") ||
        file.includes(".test.") ||
        file.includes(".spec.") ||
        file.includes(".e2e.") ||
        file.includes("-test") ||
        file.includes("-spec") ||
        file.includes("-e2e"))
    ) {
      continue;
    }
    let route = `${file}`.split("routes")[1];
    route = route.replace(`.${fileType}`, "");
    if (route) {
      route = route.trim();
      route = route.replace("/index", "/").replace("/root", "");
      route = route.split(".").join("/");
      if (fileType === "dart") {
        routes.push({
          path: file,
          contents,
          route,
          type: "flutter",
          ext: fileType,
        });
      } else if (fileType === "tsx" || fileType === "jsx") {
        routes.push({
          path: file,
          contents,
          route,
          type: "react",
          ext: fileType,
        });
      } else if (fileType === "ts" || fileType === "js") {
        routes.push({
          path: file,
          contents,
          route,
          type: "lit",
          ext: fileType,
        });
      }
    }
  }
  return routes;
}

type ProjectType = "lit" | "flutter" | "react";

export interface PageRoute {
  path: string;
  route: string;
  contents: string;
  type: ProjectType;
  ext: string;
}
