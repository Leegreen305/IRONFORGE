# IRONFORGE Launcher — PowerShell
# Usage: Right-click → "Run with PowerShell"
# Or: powershell -ExecutionPolicy Bypass -File launch.ps1

$PROJECT  = $PSScriptRoot
$PYTHON   = "$PROJECT\.venv\Scripts\python.exe"
$NODE     = "C:\Program Files\nodejs\node.exe"
$NPM      = "C:\Program Files\nodejs\npm.cmd"
$FRONTEND = "$PROJECT\webapp\frontend"
$ENV_FILE = "$PROJECT\.env"

# ── Banner ──────────────────────────────────────────────────────────────────
Clear-Host
Write-Host ""
Write-Host "  ◈  IRONFORGE  —  AI-Powered MDMP Engine" -ForegroundColor Yellow
Write-Host "  ─────────────────────────────────────────" -ForegroundColor DarkYellow
Write-Host "  FM 6-0 · FM 2-01.3 · FM 3-60 · JP 3-0" -ForegroundColor DarkGray
Write-Host "  UNCLASSIFIED // TRAINING AID ONLY" -ForegroundColor Green
Write-Host ""

# ── Load .env ───────────────────────────────────────────────────────────────
if (Test-Path $ENV_FILE) {
    Get-Content $ENV_FILE | Where-Object { $_ -match "^\s*[^#]" -and $_ -match "=" } | ForEach-Object {
        $parts = $_ -split "=", 2
        if ($parts.Count -eq 2) {
            $key = $parts[0].Trim()
            $val = $parts[1].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $val, "Process")
        }
    }
    Write-Host "  [OK] .env loaded" -ForegroundColor Green
} else {
    Write-Host "  [WARN] No .env file found — copy .env.example to .env and add ANTHROPIC_API_KEY" -ForegroundColor Yellow
}

# ── API key check ────────────────────────────────────────────────────────────
$apiKey = $env:ANTHROPIC_API_KEY
if (-not $apiKey -or $apiKey -eq "your_anthropic_api_key_here") {
    Write-Host ""
    Write-Host "  ─────────────────────────────────────────" -ForegroundColor DarkYellow
    Write-Host "  ANTHROPIC_API_KEY not configured." -ForegroundColor Yellow
    Write-Host "  The MDMP doctrinal pipeline runs without it." -ForegroundColor Gray
    Write-Host "  AI narrative generation (COA text, OPORD prose) requires a key." -ForegroundColor Gray
    Write-Host "  Get one at: https://console.anthropic.com" -ForegroundColor DarkGray
    Write-Host ""
    $input_key = Read-Host "  Paste your API key now (or press Enter to skip)"
    if ($input_key.Trim() -ne "") {
        $env:ANTHROPIC_API_KEY = $input_key.Trim()
        # Save to .env
        (Get-Content $ENV_FILE) -replace "ANTHROPIC_API_KEY=.*", "ANTHROPIC_API_KEY=$($input_key.Trim())" | Set-Content $ENV_FILE
        Write-Host "  [OK] API key saved to .env" -ForegroundColor Green
    } else {
        Write-Host "  [OK] Continuing without API key — doctrinal pipeline only" -ForegroundColor DarkGray
    }
}

Write-Host ""

# ── Start FastAPI backend ────────────────────────────────────────────────────
Write-Host "  [1/2] Starting FastAPI backend on http://localhost:8000 ..." -ForegroundColor Cyan
$backendArgs = @(
    "-m", "uvicorn",
    "webapp.backend.main:app",
    "--host", "0.0.0.0",
    "--port", "8000",
    "--reload"
)
$backend = Start-Process -FilePath $PYTHON `
    -ArgumentList $backendArgs `
    -WorkingDirectory $PROJECT `
    -PassThru `
    -NoNewWindow
Start-Sleep -Seconds 3

if ($backend.HasExited) {
    Write-Host "  [ERR] Backend failed to start. Check error above." -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] Backend PID $($backend.Id) running" -ForegroundColor Green

# ── Start Next.js frontend ──────────────────────────────────────────────────
Write-Host "  [2/2] Starting Next.js frontend on http://localhost:3000 ..." -ForegroundColor Cyan
$env:NEXT_PUBLIC_API_URL = "http://localhost:8000"
$frontend = Start-Process -FilePath $NPM `
    -ArgumentList "run", "dev" `
    -WorkingDirectory $FRONTEND `
    -PassThru `
    -NoNewWindow
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "  ─────────────────────────────────────────" -ForegroundColor DarkYellow
Write-Host "  IRONFORGE OPERATIONAL" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "  API docs: http://localhost:8000/docs" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Press Ctrl+C to shut down all services." -ForegroundColor DarkGray
Write-Host "  ─────────────────────────────────────────" -ForegroundColor DarkYellow
Write-Host ""

# ── Open browser ─────────────────────────────────────────────────────────────
Start-Sleep -Seconds 4
Start-Process "http://localhost:3000"

# ── Wait and clean up ────────────────────────────────────────────────────────
try {
    Wait-Process -Id $backend.Id -ErrorAction SilentlyContinue
} finally {
    Write-Host "`n  [IRONFORGE] Shutting down..." -ForegroundColor Yellow
    if (-not $backend.HasExited)  { Stop-Process -Id $backend.Id  -Force -ErrorAction SilentlyContinue }
    if (-not $frontend.HasExited) { Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue }
    Write-Host "  [OK] Shutdown complete." -ForegroundColor Green
}
