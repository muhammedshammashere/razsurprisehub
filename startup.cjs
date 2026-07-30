/**
 * Raz Surprise Hub - Multi-Process Development Startup Script
 * Starts both client (Vite) and server (Express) concurrently with clean logging and automatic lifecycle management.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CLIENT_DIR = path.join(__dirname, 'client');
const SERVER_DIR = path.join(__dirname, 'server');

// Premium console styling colors using ANSI escape codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underline: '\x1b[4m',
  
  // App components
  system: '\x1b[38;5;208m', // Orange
  client: '\x1b[38;5;39m',  // Cyan/Light Blue
  server: '\x1b[38;5;76m',  // Green
  
  // Log levels
  info: '\x1b[38;5;141m',   // Purple
  error: '\x1b[31m',        // Red
  success: '\x1b[32m',      // Green
  warn: '\x1b[33m'          // Yellow
};

let serverProcess = null;
let clientProcess = null;
let isCleaningUp = false;

// Display premium startup banner
function printBanner() {
  console.log(`\n${colors.bright}${colors.system}  ┌────────────────────────────────────────────────────────┐${colors.reset}`);
  console.log(`${colors.bright}${colors.system}  │                                                        │${colors.reset}`);
  console.log(`${colors.bright}${colors.system}  │   🎁  S U P R I S E   V E N T U R E                    │${colors.reset}`);
  console.log(`${colors.bright}${colors.system}  │   Premium Development Ecosystem Startup                │${colors.reset}`);
  console.log(`${colors.bright}${colors.system}  │                                                        │${colors.reset}`);
  console.log(`${colors.bright}${colors.system}  └────────────────────────────────────────────────────────┘${colors.reset}\n`);
}

// Prefixed logger to neatly separate server and client stdout
function logMessage(prefix, color, data) {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    // Avoid printing empty lines
    if (line.trim()) {
      console.log(`${color}${prefix}${colors.reset} ${line}`);
    }
  });
}

// Ensure .env exists in directories; copy from .env.example if missing
function ensureEnvFile(dir, name) {
  const envPath = path.join(dir, '.env');
  const envExamplePath = path.join(dir, '.env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      console.log(`${colors.warn}[System]${colors.reset} .env not found in ${colors.bright}${name}${colors.reset}. Copying from .env.example...`);
      try {
        fs.copyFileSync(envExamplePath, envPath);
        console.log(`${colors.success}[System]${colors.reset} Successfully created .env file for ${colors.bright}${name}${colors.reset}.`);
      } catch (err) {
        console.error(`${colors.error}[System] Error copying .env in ${name}: ${err.message}${colors.reset}`);
      }
    } else {
      console.log(`${colors.warn}[System] Warning:${colors.reset} No .env or .env.example found in ${name}`);
    }
  }
}

// Ensure dependencies are installed; run npm install if node_modules is missing
function ensureDependencies(dir, name) {
  return new Promise((resolve, reject) => {
    const nodeModulesPath = path.join(dir, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      resolve();
      return;
    }

    console.log(`${colors.system}[System]${colors.reset} node_modules missing in ${colors.bright}${name}${colors.reset}. Installing dependencies (this may take a minute)...`);
    
    const npmInstall = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install'], {
      cwd: dir,
      stdio: 'inherit',
      shell: true
    });

    npmInstall.on('close', (code) => {
      if (code === 0) {
        console.log(`${colors.success}[System]${colors.reset} Dependencies successfully installed for ${colors.bright}${name}${colors.reset}.\n`);
        resolve();
      } else {
        reject(new Error(`Failed to install dependencies for ${name} (exit code ${code})`));
      }
    });
  });
}

// Graceful cleanup of child processes to avoid zombie processes (especially on Windows)
function cleanup() {
  if (isCleaningUp) return;
  isCleaningUp = true;
  console.log(`\n${colors.system}[System]${colors.reset} Gracefully shutting down active servers...`);
  
  const killProc = (proc, name) => {
    if (proc) {
      try {
        if (process.platform === 'win32') {
          // On Windows, taskkill is used with tree flag (/t) to terminate spawned shell wrappers and their child processes
          spawn('taskkill', ['/pid', proc.pid, '/f', '/t'], { stdio: 'ignore' });
        } else {
          proc.kill('SIGTERM');
        }
        console.log(`${colors.system}[System]${colors.reset} Stopped ${name} process tree.`);
      } catch (e) {
        // Process might have already terminated
      }
    }
  };

  killProc(serverProcess, 'Server');
  killProc(clientProcess, 'Client');
  
  console.log(`${colors.success}[System] Done. Goodbye!${colors.reset}\n`);
}

// Set up clean shutdown listeners
process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});
process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});
process.on('uncaughtException', (err) => {
  console.error(`${colors.error}[System] Uncaught Exception: ${err.message}${colors.reset}`);
  cleanup();
  process.exit(1);
});

// Main startup runner
async function start() {
  printBanner();
  
  try {
    // 1. Check & Setup Environment Files
    ensureEnvFile(SERVER_DIR, 'Server');
    ensureEnvFile(CLIENT_DIR, 'Client');

    // 2. Check & Install Dependencies
    await ensureDependencies(SERVER_DIR, 'Server');
    await ensureDependencies(CLIENT_DIR, 'Client');

    console.log(`${colors.system}[System]${colors.reset} Booting up development servers...\n`);

    // 3. Start Backend Server
    serverProcess = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev'], {
      cwd: SERVER_DIR,
      shell: true
    });

    serverProcess.stdout.on('data', (data) => logMessage('[Server]', colors.server, data));
    serverProcess.stderr.on('data', (data) => logMessage('[Server Error]', colors.error, data));

    serverProcess.on('close', (code) => {
      if (!isCleaningUp) {
        console.log(`${colors.error}[Server]${colors.reset} Process terminated unexpectedly (exit code ${code}).`);
        cleanup();
        process.exit(code);
      }
    });

    // 4. Start Frontend Client
    clientProcess = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev'], {
      cwd: CLIENT_DIR,
      shell: true
    });

    clientProcess.stdout.on('data', (data) => logMessage('[Client]', colors.client, data));
    clientProcess.stderr.on('data', (data) => logMessage('[Client Error]', colors.error, data));

    clientProcess.on('close', (code) => {
      if (!isCleaningUp) {
        console.log(`${colors.error}[Client]${colors.reset} Process terminated unexpectedly (exit code ${code}).`);
        cleanup();
        process.exit(code);
      }
    });

    console.log(`${colors.success}[System]${colors.reset} Startup sequence complete! Monitors active.`);
    console.log(`${colors.dim}Press Ctrl+C to terminate both servers concurrently.${colors.reset}\n`);

  } catch (err) {
    console.error(`${colors.error}[System] Initialization failed: ${err.message}${colors.reset}`);
    cleanup();
    process.exit(1);
  }
}

start();
