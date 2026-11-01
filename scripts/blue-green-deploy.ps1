# ==============================================================================
# Roots Tunisia - Zero-Downtime Blue-Green Deployment Script (PowerShell)
# ==============================================================================

$ErrorActionPreference = "Stop"
$ComposeFile = "docker-compose.blue-green.yml"
$NginxConf = "nginx/blue-green.conf"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Starting Roots Tunisia Blue-Green Deployment" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$confContent = Get-Content $NginxConf -Raw
if ($confContent -match "backend_blue:5000") {
    $Current = "blue"
    $Target = "green"
    $TargetPort = 5002
} else {
    $Current = "green"
    $Target = "blue"
    $TargetPort = 5001
}

Write-Host "📍 Current Active Environment : $Current" -ForegroundColor Yellow
Write-Host "📍 Target Deployment Target   : $Target (port $TargetPort)" -ForegroundColor Green

Write-Host "🔨 Building and starting backend_$Target container..."
docker compose -f $ComposeFile up -d --build "backend_$Target"

Write-Host "🩺 Performing health check on $Target environment (http://localhost:$TargetPort/api/health)..."
$MaxAttempts = 20
$Attempt = 1
$Healthy = $false

while ($Attempt -le $MaxAttempts) {
    try {
        $res = Invoke-WebRequest -Uri "http://localhost:$TargetPort/api/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($res.StatusCode -eq 200) {
            Write-Host "✅ Health check passed on attempt $Attempt! Container is healthy." -ForegroundColor Green
            $Healthy = $true
            break
        }
    } catch {
        # ignore and retry
    }
    Write-Host "⏳ Attempt $Attempt/$MaxAttempts: Waiting for backend to be ready..." -ForegroundColor Gray
    Start-Sleep -Seconds 3
    $Attempt++
}

if (-not $Healthy) {
    Write-Host "❌ Health check failed on $Target environment! Aborting cutover." -ForegroundColor Red
    Write-Host "🛑 Rolling back: Stopping $Target container..." -ForegroundColor Red
    docker compose -f $ComposeFile stop "backend_$Target"
    exit 1
}

Write-Host "🔄 Switching active upstream to backend_$Target:5000..." -ForegroundColor Cyan
$updatedConf = $confContent -replace "backend_$Current:5000", "backend_$Target:5000"
Set-Content -Path $NginxConf -Value $updatedConf

Write-Host "🔁 Reloading Nginx configuration..."
docker exec rootstunisia_proxy nginx -s reload

Write-Host "🎉 Traffic seamlessly routed to $Target environment!" -ForegroundColor Green
Write-Host "⏸️ Waiting 10 seconds grace period for existing in-flight connections..."
Start-Sleep -Seconds 10

Write-Host "⏹️ Stopping previous ($Current) container..."
docker compose -f $ComposeFile stop "backend_$Current"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "✅ Blue-Green Deployment Completed Successfully! Active: $Target" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
