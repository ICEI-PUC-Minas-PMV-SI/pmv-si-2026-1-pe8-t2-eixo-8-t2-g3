const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");
const fs = require("fs");

const PORT = 8080;
const JAR_NAME = "desejonatural-1.0.0-runner.jar";

let mainWindow;
let javaProcess;

function getJarPath() {
  const paths = [
    path.join(__dirname, "resources", JAR_NAME),
    path.join(process.resourcesPath || "", JAR_NAME),
    path.join(__dirname, "..", "quarkus", "target", JAR_NAME),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return paths[0];
}

function getJavaPath() {
  const jrePath = path.join(
    process.resourcesPath || __dirname,
    "resources",
    "jre",
    "bin",
    "java"
  );
  const devJrePath = path.join(__dirname, "resources", "jre", "bin", "java");
  if (fs.existsSync(devJrePath)) return devJrePath;
  if (fs.existsSync(jrePath)) return jrePath;
  return "java";
}

function startQuarkus() {
  return new Promise((resolve, reject) => {
    const jarPath = getJarPath();
    const javaPath = getJavaPath();
    console.log(`Starting: ${javaPath} -jar ${jarPath}`);
    javaProcess = spawn(javaPath, ["-jar", jarPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });
    javaProcess.stdout.on("data", (data) =>
      process.stdout.write(`[quarkus] ${data}`)
    );
    javaProcess.stderr.on("data", (data) =>
      process.stderr.write(`[quarkus] ${data}`)
    );
    javaProcess.on("error", (err) => {
      console.error("Failed to start Quarkus:", err);
      reject(err);
    });
    javaProcess.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        console.warn(`Quarkus exited with code ${code}`);
      }
    });
    pollServer(`http://localhost:${PORT}/`, 30_000)
      .then(() => {
        console.log("Quarkus is ready");
        resolve();
      })
      .catch(reject);
  });
}

function pollServer(url, timeoutMs) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      if (Date.now() - start > timeoutMs) {
        return reject(new Error("Timed out waiting for Quarkus"));
      }
      http
        .get(url, (res) => {
          res.resume();
          resolve();
        })
        .on("error", () => setTimeout(check, 300));
    };
    check();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "Desejo Natural",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWindow.loadURL(`http://localhost:${PORT}/`);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    await startQuarkus();
    createWindow();
  } catch (err) {
    console.error("Failed to start application:", err);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("will-quit", () => {
  if (javaProcess) {
    javaProcess.kill();
  }
});
