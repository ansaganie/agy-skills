#Requires -Version 5.1
<#
.SYNOPSIS
  Human-in-the-loop reproduction loop (Windows PowerShell).
  Copy this file, edit the steps below, and run it:
    powershell -ExecutionPolicy Bypass -File hitl-loop.ps1

  Two helpers:
    Invoke-Step "<instruction>"     -> show instruction, wait for Enter
    Read-Capture "<question>"       -> show question, return response

  At the end, captured values are printed as KEY=VALUE for the agent to parse.
  Leave signing in to the user as an Invoke-Step; capture observations only.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Invoke-Step {
  param([Parameter(Mandatory)][string]$Instruction)
  Write-Host ""
  Write-Host ">>> $Instruction" -ForegroundColor Cyan
  $null = Read-Host "    [Enter when done]"
}

function Read-Capture {
  param([Parameter(Mandatory)][string]$Question)
  Write-Host ""
  Write-Host ">>> $Question" -ForegroundColor Yellow
  return (Read-Host "    >")
}

# --- edit below ---------------------------------------------------------

Invoke-Step "Open the app at http://localhost:3000 and sign in."

$Errored = Read-Capture "Click the 'Export' button. Did it throw an error? (y/n)"

$ErrorMsg = Read-Capture "Paste the error message (or 'none'):"

# --- edit above ---------------------------------------------------------

Write-Host ""
Write-Host "--- Captured ---"
Write-Output "ERRORED=$Errored"
Write-Output "ERROR_MSG=$ErrorMsg"
