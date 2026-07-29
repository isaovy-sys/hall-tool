import { chromium } from "playwright";

const targetUrl = process.env.DMM_URL ?? "https://p-town.dmm.com/shops/fukui/8999";
const pworldUrl = process.env.PWORLD_URL ?? "https://www.p-world.co.jp/fukui/jiyujikan.htm";
const headers = {
  "Accept-Language": "ja-JP,ja;q=0.9",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
};

function countMachines(html) {
  return [...html.matchAll(/<li\b[^>]*\bclass="[^"]*\bitem\b[^"]*"/g)].length;
}

let rawStatus = 0;
let rawCount = 0;
try {
  const response = await fetch(targetUrl, { headers, redirect: "follow" });
  rawStatus = response.status;
  rawCount = countMachines(await response.text());
} catch (error) {
  console.log(`Raw request failed: ${error instanceof Error ? error.message : String(error)}`);
}

console.log(`Raw request: HTTP ${rawStatus}, machine rows ${rawCount}`);
if (rawCount > 0) {
  console.log(`PROBE_SUCCESS raw ${rawCount}`);
  process.exit(0);
}

let browserSucceeded = false;
const browser = await chromium.launch({ headless: true, args: ["--disable-blink-features=AutomationControlled"] });

try {
  const context = await browser.newContext({
    locale: "ja-JP",
    userAgent: headers["User-Agent"],
  });
  const page = await context.newPage();
  const response = await page.goto(targetUrl, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  await page.waitForTimeout(3_000);
  const html = await page.content();
  const browserCount = countMachines(html);
  console.log(`Browser request: HTTP ${response?.status() ?? 0}, machine rows ${browserCount}`);
  if (browserCount > 0) {
    browserSucceeded = true;
    console.log(`PROBE_SUCCESS browser ${browserCount}`);
  }
} finally {
  await browser.close();
}

if (browserSucceeded) process.exit(0);

const pworldResponse = await fetch(pworldUrl, { headers, redirect: "follow" });
const pworldBytes = await pworldResponse.arrayBuffer();
const charset = pworldResponse.headers.get("content-type")?.match(/charset=([^;\s]+)/i)?.[1]?.toLowerCase() ?? "shift_jis";
const encoding = charset.includes("euc") ? "euc-jp" : charset.includes("utf") ? "utf-8" : "shift_jis";
const pworldHtml = new TextDecoder(encoding).decode(pworldBytes);
const machineWords = (pworldHtml.match(/設置|機種|台数|machine/gi) ?? []).length;
console.log(`P-WORLD request: HTTP ${pworldResponse.status}, bytes ${pworldBytes.byteLength}, machine markers ${machineWords}`);
if (!pworldResponse.ok || pworldBytes.byteLength < 5_000) throw new Error("P-WORLD page was not available.");
console.log(`PROBE_SUCCESS pworld ${pworldBytes.byteLength}`);
