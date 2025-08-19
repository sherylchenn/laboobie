#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("node:fs");
const path = require("node:path");

const SCRIPT_DIR = __dirname;
const WORKSPACE_ROOT = path.resolve(SCRIPT_DIR, "../../../");
const SOURCE_DIR = path.resolve(WORKSPACE_ROOT, "projects/images");
const DEST_BASE = path.resolve(WORKSPACE_ROOT, "apps/showcase/public/images");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function syncDir(src, dest) {
  ensureDir(dest);

  // Copy and update from src -> dest
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      syncDir(srcPath, destPath);
      continue;
    }

    if (entry.isFile()) {
      // Ensure parent exists and copy (overwrite)
      ensureDir(path.dirname(destPath));
      fs.copyFileSync(srcPath, destPath);
    }
  }

  // Remove files/dirs in dest that no longer exist in src
  const destEntries = fs.readdirSync(dest, { withFileTypes: true });
  for (const dEntry of destEntries) {
    const srcPath = path.join(src, dEntry.name);
    const destPath = path.join(dest, dEntry.name);

    if (!fs.existsSync(srcPath)) {
      // Remove stale
      if (dEntry.isDirectory()) {
        fs.rmSync(destPath, { recursive: true, force: true });
      } else {
        fs.rmSync(destPath, { force: true });
      }
    }
  }
}

function syncOnce() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.warn(`[images] source directory not found: ${SOURCE_DIR}`);
    return;
  }
  ensureDir(DEST_BASE);
  syncDir(SOURCE_DIR, DEST_BASE);
}

function debounce(fn, delay) {
  let t = null;
  return () => {
    if (t) clearTimeout(t);
    t = setTimeout(fn, delay);
  };
}

function watch() {
  if (!fs.existsSync(SOURCE_DIR)) return;
  const trigger = debounce(() => {
    try {
      syncOnce();
      console.log("[images] synced");
    } catch (e) {
      console.error("[images] sync error", e);
    }
  }, 200);

  console.log(`[images] watching ${SOURCE_DIR}`);
  syncOnce();
  console.log("[images] initial sync complete");
  try {
    fs.watch(SOURCE_DIR, { recursive: true }, () => trigger());
  } catch (e) {
    console.warn(
      "[images] recursive watch not supported, falling back to polling every 2s",
    );
    setInterval(trigger, 2000);
  }
}

if (process.argv.includes("--watch")) {
  watch();
} else {
  syncOnce();
  console.log("[images] sync complete");
}
