import * as vscode from "vscode";
import { generateBase } from "./commands/base";
import { generateFlutter } from "./commands/flutter/generate";
import { generateJson } from "./commands/json/generate";
import { exportLit } from "./commands/lit/generate";
import { generateReact } from "./commands/react/generate";
import { addCommand, getSetting, writeFile } from "./commands/utils";

export function activate(context: vscode.ExtensionContext) {
  addCommand(context, "generate-lit", () => generateBase(async (root, pages) => {
    const outFile = getSetting<string>('lit-router-out-file') || `${root}/src/router.ts`;
    const contents = exportLit(pages);
    await writeFile(outFile, contents);
    return { success: true, message: "Lit router generated!" };
  }));
  addCommand(context, "generate-json", () => generateBase(async (root, pages) => {
    const outFile = getSetting<string>('json-out-file') || `${root}/routes.json`;
    const contents = generateJson(pages);
    await writeFile(outFile, contents);
    return { success: true, message: "routes.json generated!" };
  })); 
  addCommand(context, "generate-flutter", () => generateBase(async (root, pages) => {
    const outFile = getSetting<string>('flutter-out-file') || `${root}/lib/router.dart`;
    const contents = await generateFlutter(root, pages);
    await writeFile(outFile, contents);
    return { success: true, message: "Flutter router generated!" };
  }));
  addCommand(context, "generate-react", () => generateBase(async (root, pages) => {
    const outFile = getSetting<string>('react-out-file') || `${root}/src/router.tsx`;
    const contents = await generateReact(root, pages);
    await writeFile(outFile, contents);
    return { success: true, message: "React router generated!" };
  }));
}

export function deactivate() { }
