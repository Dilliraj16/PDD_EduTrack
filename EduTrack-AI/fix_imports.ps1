$webSrc = "c:\Users\DILLI RAJ\Desktop\PDD APP\APP\EduTrack-AI\apps\web\src"

# Function to search and replace imports
Get-ChildItem -Path $webSrc -Recurse -Include *.ts, *.tsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $modified = $false
    
    if ($content -match "\.\./\.\./shared/") {
        $content = $content -replace "\.\./\.\./shared/", "@shared/"
        $modified = $true
    }
    if ($content -match "\.\./shared/") {
        $content = $content -replace "\.\./shared/", "@shared/"
        $modified = $true
    }
    
    if ($modified) {
        Set-Content -Path $_.FullName -Value $content -NoNewline
        Write-Output "Updated imports in: $($_.Name)"
    }
}
Write-Output "Import replacement complete."
