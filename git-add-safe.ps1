# PowerShell script to add files excluding package-lock.json
Write-Host "Adding files to git (excluding package-lock.json)..."

# Add all files except package-lock.json
git add --all
git reset package-lock.json 2>$null

Write-Host "Files added successfully (package-lock.json excluded)"
git status --short
