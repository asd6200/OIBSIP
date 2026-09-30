$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPath = Join-Path $repoRoot 'frontend'
$distPath = Join-Path $frontendPath 'dist'
$docsPath = Join-Path $repoRoot 'docs'

Push-Location $frontendPath
try {
    npm run build
} finally {
    Pop-Location
}

if (-not (Test-Path $distPath -PathType Container)) {
    throw "Build output was not found at $distPath"
}

if (Test-Path $docsPath) {
    Remove-Item $docsPath -Recurse -Force
}
New-Item $docsPath -ItemType Directory -Force | Out-Null

Get-ChildItem $distPath -Force | Move-Item -Destination $docsPath -Force

$indexPath = Join-Path $docsPath 'index.html'
if (-not (Test-Path $indexPath -PathType Leaf)) {
    throw "GitHub Pages entry point was not found at $indexPath"
}

git add docs
git commit -m "Deploy frontend build to GitHub Pages"
git push origin main