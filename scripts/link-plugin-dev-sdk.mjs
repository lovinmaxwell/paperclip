#!/usr/bin/env node

import { existsSync, mkdirSync, lstatSync, rmSync, symlinkSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const packageDir = process.cwd();
const sdkDir = join(repoRoot, "packages", "plugins", "sdk");
const scopeDir = join(packageDir, "node_modules", "@paperclipai");
const linkTarget = join(scopeDir, "plugin-sdk");

if (!existsSync(join(packageDir, "package.json"))) {
  throw new Error(`No package.json found in plugin directory: ${packageDir}`);
}

mkdirSync(scopeDir, { recursive: true });

try {
  const stat = lstatSync(linkTarget);
  if (stat.isSymbolicLink()) {
    rmSync(linkTarget, { force: true });
  } else {
    console.log("  i Keeping existing installed @paperclipai/plugin-sdk directory in place");
    process.exit(0);
  }
} catch {
  // target does not exist yet
}

const relativeSdkDir = relative(scopeDir, sdkDir);
try {
  symlinkSync(relativeSdkDir, linkTarget, "dir");
} catch (error) {
  // Node 25 can surface EEXIST here even when linkTarget is already the
  // desired symlink; treat this as success to keep postinstall idempotent.
  if (error && typeof error === "object" && "code" in error && error.code === "EEXIST") {
    console.log(`  i @paperclipai/plugin-sdk link already exists for ${packageDir}`);
    process.exit(0);
  }
  throw error;
}

console.log(`  ✓ Linked local @paperclipai/plugin-sdk for ${packageDir}`);
