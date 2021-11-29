# This script is used to be able to run loader.ps1.

#Requires -RunAsAdministrator

$execution_policy = Get-ExecutionPolicy;
if ($execution_policy -eq 'Unrestricted') {
    . .\loader.ps1
} else {
    Set-ExecutionPolicy 'Unrestricted';
    . .\loader.ps1
    Set-ExecutionPolicy -ExecutionPolicy $execution_policy;
}
