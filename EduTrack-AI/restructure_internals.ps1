$target = "c:\Users\DILLI RAJ\Desktop\PDD APP\APP\EduTrack-AI"

$webSrc = "$target\apps\web\src"
$mobileLib = "$target\apps\mobile\lib"
$supabase = "$target\backend\supabase"

# Web internal dirs
$webDirs = @(
    "components", "layouts", "pages\student", "pages\faculty", "pages\admin", 
    "pages\parent", "pages\shared", "hooks", "contexts", "services", "store", 
    "theme", "types", "utils", "config", "lib"
)

foreach ($d in $webDirs) {
    New-Item -Path "$webSrc\$d" -ItemType Directory -Force | Out-Null
}

# Mobile internal dirs
$mobileDirs = @(
    "core", "theme", "widgets", "screens\student", "screens\faculty", 
    "screens\admin", "screens\parent", "providers", "models", "services", 
    "utils", "assets", "navigation", "supabase"
)

foreach ($d in $mobileDirs) {
    New-Item -Path "$mobileLib\$d" -ItemType Directory -Force | Out-Null
}

# Supabase internal dirs
$supaDirs = @(
    "migrations", "sql", "policies", "storage", "functions", "triggers", 
    "edge-functions", "realtime", "auth"
)

foreach ($d in $supaDirs) {
    New-Item -Path "$supabase\$d" -ItemType Directory -Force | Out-Null
}

# Services dirs (assuming these go into packages/services as per the monorepo logic)
$serviceDirs = @(
    "Authentication", "Attendance", "Assignment", "Subject", "Enrollment", "Chat", 
    "Notification", "Profile", "Theme", "Analytics", "CGPA", "Results", "Admin", 
    "Parent", "Faculty"
)

foreach ($d in $serviceDirs) {
    New-Item -Path "$target\packages\services\$d" -ItemType Directory -Force | Out-Null
}

Write-Output "Internal sub-directories created successfully."
