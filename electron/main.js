const { app, BrowserWindow, ipcMain, dialog } = require("electron");
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

async function createWindow() {
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
  // opcional: limpar cache/storage durante desenvolvimento para evitar assets antigos
  try {
    if (process.env.DEV_CLEAR_CACHE === '1') {
      const sess = mainWindow.webContents.session;
      await sess.clearCache();
      await sess.clearStorageData();
      console.log('Dev: cache and storage cleared before loading URL');
    }
  } catch (err) {
    console.warn('Failed clearing session cache:', err);
  }

  mainWindow.loadURL(`http://localhost:${PORT}/`);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.handle("dialog:saveDatabase", async () => {
  const dbPath = findDatabasePath();
  if (!dbPath) {
    return { success: false, error: "Arquivo do banco de dados nao encontrado" };
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: `desejonatural-backup-${dateStr}.db`,
    filters: [{ name: "Banco de Dados SQLite", extensions: ["db"] }],
  });

  if (result.canceled) {
    return { success: false, error: "Operacao cancelada" };
  }

  try {
    fs.copyFileSync(dbPath, result.filePath);
    return { success: true };
  } catch (err) {
    return { success: false, error: `Erro ao copiar arquivo: ${err.message}` };
  }
});

function findDatabasePath() {
  const candidates = [
    path.join(__dirname, "desejonatural.db"),
    path.join(process.resourcesPath || "", "desejonatural.db"),
    path.join(process.cwd(), "desejonatural.db"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
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
