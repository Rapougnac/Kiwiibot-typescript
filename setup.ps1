Function check_if_command_exists {
    param ($command)
    $oldPreferences = $ErrorActionPreference
    $ErrorActionPreference = "stop"
    try {
        if(Get-Command $command) {
            $ErrorActionPreference = $oldPreferences
            return $true
        }
    }
    catch {
        return $false
    }
    Finally {
        $ErrorActionPreference = $oldPreferences
    }
}

$potential_cmd = check_if_command_exists pnpm
if($potential_cmd -eq $true) {
    Write-Output 'Pnpm was found, Gotta use this instead of npm'
    Start-Sleep 3
    pnpm i
    Write-Output 'Pnpm install complete'
    Write-Output 'Starting compilation of TypeScript'
    pnpm build
    Write-Output 'Compilation of TypeScript complete'
    Exit-PSSession
} else {
    Write-Output 'Pnpm was not found, Gotta use npm'
    Remove-Item .\pnpm-lock.yaml
    Start-Sleep 3
    npm i
    Write-Output 'Npm install complete'
    Write-Output 'Starting compilation of TypeScript'
    npm run build
    Write-Output 'Compilation of TypeScript complete'
    Exit-PSSession
}