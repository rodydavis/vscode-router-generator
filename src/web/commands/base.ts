import * as vscode from "vscode";
import { readDir, readFile, showErrorMessage, showMessage } from "./utils";

export async function generateBase(callback: (root: string, pages: PageRoute[]) => Promise<{ success: boolean, message: string }>) {
    // List files in current folder using vscode.workspace.fs
    const folder = vscode.workspace.workspaceFolders;
    if (!folder || folder.length === 0) {
        showErrorMessage("No workspace folder found");
    } else {
        const root = folder[0].uri.fsPath;
        // Check for pages folder
        let pagesDir: vscode.Uri | undefined;
        for (const folderPath of [
            `${root}/lib/pages`,
            `${root}/src/pages`,
            `${root}/pages`,
        ]) {
            const uri = vscode.Uri.parse(folderPath);
            try {
                await vscode.workspace.fs.stat(uri);
                pagesDir = uri;
                break;
            } catch (error) { }
        }
        if (pagesDir) {
            const files: string[] = [];
            await readDir(pagesDir, files);
            const pages = await analyzePages(files);
            const { success, message } = await callback(root, pages);
            if (success) {
                showMessage(message);
            } else {
                showErrorMessage(message);
            }
        } else {
            showErrorMessage("No pages folder found");
        }
    }
}

async function analyzePages(files: string[]) {
    const pages: PageRoute[] = [];
    for (const file of files) {
        const contents = await readFile(file);
        const fileType = `${file}`.split(".").pop();
        let route = `${file}`.split("pages")[1].split(".")[0];
        if (route) {
            route = route.toLowerCase().trim();
            route = route.replace('/index', '/').replace('/root', '');
            if (fileType === "dart") {
                pages.push({ path: file, contents, route, type: "flutter" });
            } else if (fileType === "tsx" || fileType === "jsx") {
                pages.push({ path: file, contents, route, type: "react" });
            } else if (fileType === "ts" || fileType === "js") {
                pages.push({ path: file, contents, route, type: "lit" });
            }
        }
    }
    return pages;
}

type ProjectType = "lit" | "flutter"  | 'react';


export interface PageRoute {
    path: string;
    route: string;
    contents: string;
    type: ProjectType;
}
