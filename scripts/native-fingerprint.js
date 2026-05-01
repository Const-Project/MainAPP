const fs = require("node:fs/promises");
const path = require("node:path");
const Fingerprint = require("expo/fingerprint");

const projectRoot = path.resolve(__dirname, "..");
const fingerprintPath = path.join(projectRoot, ".expo", "native-fingerprint.json");
const action = process.argv[2] ?? "print";

async function createFingerprint() {
  return Fingerprint.createFingerprintAsync(projectRoot, {
    platforms: ["android"],
    silent: true,
  });
}

async function readSavedFingerprint() {
  try {
    const raw = await fs.readFile(fingerprintPath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function saveFingerprint(fingerprint) {
  await fs.mkdir(path.dirname(fingerprintPath), { recursive: true });
  await fs.writeFile(
    fingerprintPath,
    `${JSON.stringify(
      {
        hash: fingerprint.hash,
        savedAt: new Date().toISOString(),
        sources: fingerprint.sources,
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

async function main() {
  const fingerprint = await createFingerprint();

  if (action === "print") {
    console.log(fingerprint.hash);
    return;
  }

  if (action === "save") {
    await saveFingerprint(fingerprint);
    console.log(`Saved native fingerprint: ${fingerprint.hash}`);
    console.log(path.relative(projectRoot, fingerprintPath));
    return;
  }

  if (action === "check") {
    const saved = await readSavedFingerprint();

    if (!saved) {
      console.error("No saved native fingerprint found.");
      console.error("Run `npm run native:fingerprint:save` right after installing a fresh dev build.");
      process.exit(1);
    }

    if (saved.hash !== fingerprint.hash) {
      console.error("Native fingerprint changed. Rebuild and reinstall the dev build.");
      console.error(`Saved:   ${saved.hash}`);
      console.error(`Current: ${fingerprint.hash}`);
      process.exit(1);
    }

    console.log(`Native fingerprint unchanged: ${fingerprint.hash}`);
    return;
  }

  console.error(`Unknown action: ${action}`);
  process.exit(1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
