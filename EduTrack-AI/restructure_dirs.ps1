$target = "c:\Users\DILLI RAJ\Desktop\PDD APP\APP\EduTrack-AI"
cd $target

# Ensure Vite is killed before moving folders
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

$dirs = @(
    "apps\web", "apps\mobile", "apps\admin-dashboard", 
    "backend\supabase", "backend\scripts",
    "packages\ui", "packages\hooks", "packages\utils", "packages\types", "packages\constants",
    "packages\services", "packages\api", "packages\theme", "packages\shared",
    "docs\architecture", "docs\database", "docs\api", "docs\deployment", "docs\screenshots", "docs\diagrams",
    "assets\logo", "assets\icons", "assets\wallpapers", "assets\fonts", "assets\animations", "assets\images",
    "deployment\render", "deployment\vercel", "deployment\docker", "deployment\nginx", "deployment\github-actions",
    "scripts",
    ".github\workflows"
)

foreach ($d in $dirs) {
    New-Item -Path "$target\$d" -ItemType Directory -Force | Out-Null
}

Write-Output "Directories created."

# Function to safely move contents
function Move-Contents($sourcePath, $destinationPath) {
    if (Test-Path $sourcePath) {
        # Move everything including hidden files
        Get-ChildItem -Path $sourcePath -Force | Move-Item -Destination $destinationPath -Force
        Remove-Item -Path $sourcePath -Force -Recurse
        Write-Output "Moved $sourcePath to $destinationPath"
    } else {
        Write-Output "$sourcePath not found, skipping."
    }
}

Move-Contents "$target\web" "$target\apps\web"
Move-Contents "$target\mobile" "$target\apps\mobile"
Move-Contents "$target\supabase" "$target\backend\supabase"
Move-Contents "$target\shared" "$target\packages\shared"

Write-Output "Initial moves completed."
