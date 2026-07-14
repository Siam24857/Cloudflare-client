const puppeteer = require("puppeteer-core");
const { spawn } = require("child_process");
const path = require("path");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = "C:\\Users\\Lenovo\\OneDrive\\Documents\\GSDF NGO\\Clodfare\\client";

function startPreview() {
  const p = spawn("npx", ["vite", "preview", "--port", "4173", "--strictPort"], {
    cwd: ROOT,
    shell: true,
  });
  p.stdout.on("data", (d) => process.stdout.write("[preview] " + d));
  p.stderr.on("data", (d) => process.stdout.write("[preview] " + d));
  return p;
}

(async () => {
  const preview = startPreview();
  await new Promise((r) => setTimeout(r, 3000));

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const logs = [];
  page.on("console", (msg) => {
    logs.push("CONSOLE " + msg.type() + ": " + msg.text());
  });
  page.on("pageerror", (err) => {
    logs.push("PAGEERROR: " + err.message);
    logs.push("STACK:\n" + err.stack);
  });
  page.on("requestfailed", (req) => {
    // ignore api/network failures
  });

  try {
    await page.goto("http://localhost:4173/", { waitUntil: "networkidle2", timeout: 20000 });
  } catch (e) {
    logs.push("GOTO ERROR: " + e.message);
  }
  await new Promise((r) => setTimeout(r, 2000));

  console.log("===== HOME PAGE LOGS =====");
  console.log(logs.join("\n"));

  await browser.close();
  preview.kill();
})();
