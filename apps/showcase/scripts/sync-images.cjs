#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("node:fs");
const path = require("node:path");

const SCRIPT_DIR = __dirname;
const WORKSPACE_ROOT = path.resolve(SCRIPT_DIR, "../../../");
const SOURCE_DIR = path.resolve(WORKSPACE_ROOT, "packages/data/src/projects");
const DEST_BASE = path.resolve(
  WORKSPACE_ROOT,
  "apps/showcase/public/images/projects",
);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function hasMetaYaml(dir) {
  return (
    fs.existsSync(path.join(dir, "meta.yml")) ||
    fs.existsSync(path.join(dir, "meta.yaml"))
  );
}

function syncOnce() {
  if (!fs.existsSync(SOURCE_DIR)) return;
  ensureDir(DEST_BASE);
  const categories = fs
    .readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const category of categories) {
    const catDir = path.join(SOURCE_DIR, category);
    const entries = fs.readdirSync(catDir, { withFileTypes: true });

    // Case A: legacy layout (YAML file at category root)
    for (const entry of entries) {
      if (entry.isFile() && /\.(ya?ml)$/i.test(entry.name)) {
        const base = path.basename(entry.name, path.extname(entry.name));
        const projectDir = path.join(catDir, base);
        const imagesDir = path.join(projectDir, "images");
        // Copy images subdir
        if (fs.existsSync(imagesDir) && fs.statSync(imagesDir).isDirectory()) {
          const destDir = path.join(DEST_BASE, category, base);
          copyDir(imagesDir, destDir);
        }
        // Copy cover.* directly under project dir
        if (
          fs.existsSync(projectDir) &&
          fs.statSync(projectDir).isDirectory()
        ) {
          const files = fs.readdirSync(projectDir);
          const cover = files.find((f) =>
            /^cover\.(png|jpe?g|webp|avif)$/i.test(f),
          );
          if (cover) {
            const destDir = path.join(DEST_BASE, category, base);
            ensureDir(destDir);
            fs.copyFileSync(
              path.join(projectDir, cover),
              path.join(destDir, cover),
            );
          }
        }
      }
    }

    // Case B: strict layout (<project-id>/meta.yml next to images/)
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const projectId = entry.name;
      const projectDir = path.join(catDir, projectId);
      if (!hasMetaYaml(projectDir)) continue;
      const imagesDir = path.join(projectDir, "images");
      if (fs.existsSync(imagesDir) && fs.statSync(imagesDir).isDirectory()) {
        const destDir = path.join(DEST_BASE, category, projectId);
        copyDir(imagesDir, destDir);
      }
      const files = fs.readdirSync(projectDir);
      const cover = files.find((f) =>
        /^cover\.(png|jpe?g|webp|avif)$/i.test(f),
      );
      if (cover) {
        const destDir = path.join(DEST_BASE, category, projectId);
        ensureDir(destDir);
        fs.copyFileSync(
          path.join(projectDir, cover),
          path.join(destDir, cover),
        );
      }
    }
  }
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
