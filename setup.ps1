function DrawMenu {
    param ($menuItems, $menuPosition, $Multiselect, $selection)
    $l = $menuItems.length
    for ($i = 0; $i -le $l;$i++) {
        if ($null -ne $menuItems[$i]){
            $item = $menuItems[$i]
            if ($Multiselect)
            {
                if ($selection -contains $i){
                    $item = '[x] ' + $item
                }
                else {
                    $item = '[ ] ' + $item
                }
            }
            if ($i -eq $menuPosition) {
                Write-Host "> $($item)" -ForegroundColor Green
            } else {
                Write-Host "  $($item)"
            }
        }
    }
}

function Enable-Selection {
    param ($pos, [array]$selection)
    if ($selection -contains $pos){ 
        $result = $selection | Where-Object {$_ -ne $pos}
    }
    else {
        $selection += $pos
        $result = $selection
    }
    $result
}

function Menu {
    param ([array]$menuItems, [switch]$ReturnIndex=$false, [switch]$Multiselect)
    $vkeycode = 0
    $pos = 0
    $selection = @()
    if ($menuItems.Length -gt 0)
    {
        try {
            [console]::CursorVisible=$false #prevents cursor flickering
            DrawMenu $menuItems $pos $Multiselect $selection
            While ($vkeycode -ne 13 -and $vkeycode -ne 27) {
                $press = $host.ui.rawui.readkey("NoEcho,IncludeKeyDown")
                $vkeycode = $press.virtualkeycode
                If ($vkeycode -eq 38 -or $press.Character -eq 'k') {$pos--}
                If ($vkeycode -eq 40 -or $press.Character -eq 'j') {$pos++}
                If ($vkeycode -eq 36) { $pos = 0 }
                If ($vkeycode -eq 35) { $pos = $menuItems.length - 1 }
                If ($press.Character -eq ' ') { $selection = Enable-Selection $pos $selection }
                if ($pos -lt 0) {$pos = 0}
                If ($vkeycode -eq 27) {$pos = $null }
                if ($pos -ge $menuItems.length) {$pos = $menuItems.length -1}
                if ($vkeycode -ne 27)
                {
                    $startPos = [System.Console]::CursorTop - $menuItems.Length
                    [System.Console]::SetCursorPosition(0, $startPos)
                    DrawMenu $menuItems $pos $Multiselect $selection
                }
            }
        }
        finally {
            [System.Console]::SetCursorPosition(0, $startPos + $menuItems.Length)
            [console]::CursorVisible = $true
        }
    }
    else {
        $pos = $null
    }

    if ($ReturnIndex -eq $false -and $null -ne $pos)
    {
        if ($Multiselect){
            return $menuItems[$selection]
        }
        else {
            return $menuItems[$pos]
        }
    }
    else 
    {
        if ($Multiselect){
            return $selection
        }
        else {
            return $pos
        }
    }
}
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

$check_node = check_if_command_exists node

if ($check_node -eq $false) {
    Write-Host "Node.js is not installed on this machine. Please install Node.js before proceeding."
    exit 1
}
$check_npm = check_if_command_exists npm
if ($check_npm -eq $false) {
    Write-Host "npm is not installed on this machine. Please install npm before proceeding."
    exit 1
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
    $options= Menu ("Install pnpm", "Use npm", "Exit")
    
    if($options -eq "Install pnpm") {
        Write-Output 'Installing pnpm'
        Start-Sleep 3
        npm i -g pnpm
        Write-Output 'pnpm install complete'
        pnpm i
        Write-Output 'All packages have been installed sucessfully'
        Start-Sleep 3
        Write-Output 'Starting compilation of TypeScript'
        pnpm build
        Write-Output 'Compilation of TypeScript complete'
        Exit-PSSession
    } elseif ($options -eq "Use npm") {
        Write-Output 'Starting compilation of TypeScript'
        npm run build
        Write-Output 'Compilation of TypeScript complete'
        Exit-PSSession
    } elseif ($options -eq "Exit") {
        Write-Output 'Exiting...'
        Start-Sleep 1
        Exit-PSSession
    } else {
        Write-Output 'Something went wrong'
        Exit-PSSession
    }
}

