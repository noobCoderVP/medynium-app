<#
.SYNOPSIS
  Builds the Medynium Android app with EAS, after checking types and lint.

.EXAMPLE
  .\scripts\build-eas.ps1                      # preview APK (installable, internal distribution)
  .\scripts\build-eas.ps1 -Profile development # dev-client APK
  .\scripts\build-eas.ps1 -Profile release     # standalone signed APK for your phone (no Expo server)
  .\scripts\build-eas.ps1 -Profile production  # Play Store app bundle (.aab)
  .\scripts\build-eas.ps1 -Local               # build on this machine instead of EAS servers (needs Android SDK; not supported on Windows)
  .\scripts\build-eas.ps1 -SkipChecks -NoWait  # skip tsc/eslint, queue the build and return immediately
#>
[CmdletBinding()]
param(
  [ValidateSet('development', 'preview', 'release', 'production')]
  [string]$Profile = 'preview',
  [ValidateSet('android', 'ios', 'all')]
  [string]$Platform = 'android',
  [switch]$Local,
  [switch]$SkipChecks,
  [switch]$NoWait,
  [switch]$ClearCache
)

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)   # project root, wherever the script is called from

function Invoke-Step([string]$Label, [scriptblock]$Command) {
  Write-Host "`n==> $Label" -ForegroundColor Cyan
  # Windows PowerShell 5.1 turns any stderr line from a native command into a terminating error under
  # 'Stop'; judge success by the exit code only.
  $prev = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try { & $Command } finally { $ErrorActionPreference = $prev }
  if ($LASTEXITCODE -ne 0) { throw "$Label failed (exit code $LASTEXITCODE)" }
}

# Run project-local tools directly (no npx lookup); installs dependencies once if they're missing.
function Get-LocalBin([string]$Name) {
  $bin = Join-Path (Get-Location) "node_modules\.bin\$Name.cmd"
  if (-not (Test-Path $bin)) { Invoke-Step 'Installing dependencies' { npm install } }
  if (-not (Test-Path $bin)) { throw "Missing $Name after npm install. Try: Remove-Item node_modules -Recurse -Force; npm install" }
  return $bin
}


# EAS builds read EXPO_PUBLIC_* from the EAS environment, not the local .env — warn so a build isn't silently pointed at the wrong API.
if (Test-Path '.env') {
  $api = (Select-String -Path '.env' -Pattern '^EXPO_PUBLIC_API_URL=(.*)$').Matches.Groups[1].Value
  Write-Host "Local .env API URL: $api (EAS uses variables set in the EAS project / eas.json env, not this file)" -ForegroundColor DarkGray
}

if (-not $SkipChecks) {
  $tsc = Get-LocalBin 'tsc'
  $eslint = Get-LocalBin 'eslint'
  Invoke-Step 'Type check' { & $tsc --noEmit }
  Invoke-Step 'Lint' { & $eslint src --quiet }
}

# Requires `npx eas-cli login` once; fail early with a clear message if not signed in.
$prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
npx eas-cli whoami 2>&1 | Out-Null
$signedIn = ($LASTEXITCODE -eq 0)
$ErrorActionPreference = $prev
if (-not $signedIn) { throw 'Not signed in to EAS. Run: npx eas-cli login' }

$args_ = @('build', '--platform', $Platform, '--profile', $Profile)
if ($Local)      { $args_ += '--local' }
if ($NoWait)     { $args_ += '--no-wait' }
if ($ClearCache) { $args_ += '--clear-cache' }

Invoke-Step "EAS build ($Platform / $Profile)" { npx eas-cli @args_ }

Write-Host "`nDone. Build details and the download link: https://expo.dev (or run: npx eas-cli build:list)" -ForegroundColor Green
