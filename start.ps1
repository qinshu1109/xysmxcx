$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$MysqlUser = 'root'
$MysqlPassword = ''
$ResetDb = $args -contains '--reset'

function Write-Step($Text) {
  Write-Host ''
  Write-Host "== $Text =="
}

function Quote-PsLiteral($Path) {
  return "'" + ($Path -replace "'", "''") + "'"
}

function Resolve-Executable($Name, $Fallbacks) {
  $cmd = Get-Command $Name -ErrorAction SilentlyContinue
  if ($cmd) {
    return $cmd.Source
  }

  foreach ($path in $Fallbacks) {
    if ($path -and (Test-Path -LiteralPath $path)) {
      return $path
    }
  }

  return $null
}

function Test-TcpPort($Port) {
  return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

function Invoke-MysqlOutput($MysqlArgs) {
  $previousPreference = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    $output = & $script:MysqlExe @MysqlArgs 2>$null
    $code = $LASTEXITCODE
    return [PSCustomObject]@{
      Code = $code
      Output = $output
    }
  } finally {
    $ErrorActionPreference = $previousPreference
  }
}

function Run-MysqlQuery($Query, $Password) {
  $mysqlArgs = @('--default-character-set=utf8mb4', "-u$MysqlUser")
  if ($Password) {
    $mysqlArgs += "-p$Password"
  }
  $mysqlArgs += @('-N', '-B', '-e', $Query)
  return (Invoke-MysqlOutput $mysqlArgs).Code
}

function Import-MysqlFile($SqlFile) {
  if (!(Test-Path -LiteralPath $SqlFile)) {
    throw "SQL file not found: $SqlFile"
  }

  if ($script:MysqlPassword) {
    $command = "`"$script:MysqlExe`" --default-character-set=utf8mb4 -u$MysqlUser -p$script:MysqlPassword < `"$SqlFile`""
  } else {
    $command = "`"$script:MysqlExe`" --default-character-set=utf8mb4 -u$MysqlUser < `"$SqlFile`""
  }

  $errFile = Join-Path $env:TEMP ("campus_cat_mysql_import_" + [guid]::NewGuid().ToString('N') + ".err")
  $previousPreference = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    & cmd.exe /d /c "$command 2> `"$errFile`""
    $code = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $previousPreference
  }

  if ($code -ne 0) {
    $errorText = ''
    if (Test-Path -LiteralPath $errFile) {
      $errorText = (Get-Content -LiteralPath $errFile -Raw -ErrorAction SilentlyContinue).Trim()
    }
    throw "MySQL import failed: $SqlFile $errorText"
  }

  Remove-Item -LiteralPath $errFile -Force -ErrorAction SilentlyContinue
}

function Ensure-Node {
  $nodeFallbacks = @(
    (Join-Path $env:ProgramFiles 'nodejs\node.exe'),
    (Join-Path ${env:ProgramFiles(x86)} 'nodejs\node.exe')
  )
  $npmFallbacks = @(
    (Join-Path $env:ProgramFiles 'nodejs\npm.cmd'),
    (Join-Path ${env:ProgramFiles(x86)} 'nodejs\npm.cmd')
  )

  $script:NodeExe = Resolve-Executable 'node.exe' $nodeFallbacks
  $script:NpmExe = Resolve-Executable 'npm.cmd' $npmFallbacks

  if ($script:NodeExe -and $script:NpmExe) {
    $nodeDir = Split-Path -Parent $script:NodeExe
    if ($env:Path -notlike "*$nodeDir*") {
      $env:Path = "$nodeDir;$env:Path"
    }
    Write-Host "Node.js detected: $(& $script:NodeExe -v)"
    return
  }

  Write-Host 'Node.js was not found.'
  Write-Host 'Node.js is a Windows runtime. It is NOT Docker.'
  Write-Host 'The bundled installer will be opened now.'

  $installer = Get-ChildItem -LiteralPath (Join-Path $Root 'runtime\nodejs') -Filter 'node-v*-x64.msi' -File -ErrorAction SilentlyContinue |
    Sort-Object Name -Descending |
    Select-Object -First 1

  if (!$installer) {
    throw 'Bundled Node.js installer was not found under runtime\nodejs.'
  }

  Write-Host "Installer: $($installer.FullName)"
  Write-Host 'Please keep the default options and finish the installer.'
  Read-Host 'Press Enter to open Node.js installer'

  $process = Start-Process -FilePath 'msiexec.exe' -ArgumentList @('/i', $installer.FullName) -Wait -PassThru
  if ($process.ExitCode -ne 0) {
    throw "Node.js installer failed or was canceled. Exit code: $($process.ExitCode)"
  }

  $script:NodeExe = Resolve-Executable 'node.exe' $nodeFallbacks
  $script:NpmExe = Resolve-Executable 'npm.cmd' $npmFallbacks
  if (!$script:NodeExe -or !$script:NpmExe) {
    throw 'Node.js installed, but node/npm cannot be found yet. Close this window and run again, or restart Windows once.'
  }

  $nodeDir = Split-Path -Parent $script:NodeExe
  if ($env:Path -notlike "*$nodeDir*") {
    $env:Path = "$nodeDir;$env:Path"
  }

  Write-Host "Node.js detected: $(& $script:NodeExe -v)"
}

function Ensure-Mysql {
  $fallbacks = @(
    (Join-Path $env:ProgramFiles 'MySQL\MySQL Server 8.4\bin\mysql.exe'),
    (Join-Path $env:ProgramFiles 'MySQL\MySQL Server 8.0\bin\mysql.exe'),
    (Join-Path $env:ProgramFiles 'MySQL\MySQL Server 9.4\bin\mysql.exe'),
    (Join-Path $env:ProgramFiles 'MariaDB 12.3\bin\mysql.exe'),
    (Join-Path $env:ProgramFiles 'MariaDB 11.4\bin\mysql.exe')
  )

  $script:MysqlExe = Resolve-Executable 'mysql.exe' $fallbacks
  if (!$script:MysqlExe) {
    throw 'MySQL client was not found. Install MySQL Server for Windows first. Navicat is not MySQL Server.'
  }

  Write-Host "MySQL client detected: $script:MysqlExe"

  foreach ($serviceName in @('MySQL84', 'MySQL80', 'MySQL', 'mysql80', 'MySQL57', 'MariaDB')) {
    $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    if ($service -and $service.Status -ne 'Running') {
      Write-Host "Trying to start MySQL service: $serviceName"
      Start-Service -Name $serviceName -ErrorAction SilentlyContinue
    }
  }

  if ((Run-MysqlQuery 'SELECT 1' '') -eq 0) {
    $script:MysqlPassword = ''
    Write-Host 'MySQL login detected: root with empty password.'
    return
  }

  if ((Run-MysqlQuery 'SELECT 1' '123456') -eq 0) {
    $script:MysqlPassword = '123456'
    Write-Host 'MySQL login detected: root / 123456.'
    return
  }

  Write-Host 'Default MySQL passwords failed.'
  $script:MysqlPassword = Read-Host 'Please input MySQL root password'
  if ((Run-MysqlQuery 'SELECT 1' $script:MysqlPassword) -ne 0) {
    throw 'MySQL login failed. Please check MySQL service and root password.'
  }
}

function Ensure-Database {
  $initSql = Join-Path $Root 'database\init.sql'
  $seedSql = Join-Path $Root 'database\seed.sql'

  $readyArgs = @('--default-character-set=utf8mb4', "-u$MysqlUser")
  if ($script:MysqlPassword) {
    $readyArgs += "-p$script:MysqlPassword"
  }
  $readyArgs += @('-N', '-B', '-e', "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='campus_cat_station' AND table_name='users';")
  $readyResult = Invoke-MysqlOutput $readyArgs
  $dbReady = ($readyResult.Code -eq 0 -and "$($readyResult.Output)".Trim() -eq '1')

  Write-Host 'Creating or updating database schema...'
  Import-MysqlFile $initSql

  if ($ResetDb -or !$dbReady) {
    if ($ResetDb) {
      Write-Host 'Reset mode enabled. Importing demo data...'
    } else {
      Write-Host 'First run detected. Importing demo data...'
    }
    Import-MysqlFile $seedSql
  } else {
    Write-Host 'Existing database detected. Demo seed data will not be re-imported.'
    Write-Host 'To reset demo data, run: one-click script with --reset'
  }
}

function Ensure-Env {
  $envPath = Join-Path $Root 'server\.env'
  if (Test-Path -LiteralPath $envPath) {
    Write-Host 'Using existing server\.env.'
    return
  }

  Write-Host 'Creating server\.env...'
  $content = @"
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=$MysqlUser
DB_PASSWORD=$script:MysqlPassword
DB_DATABASE=campus_cat_station
JWT_SECRET=local-user-secret-for-homework
ADMIN_JWT_SECRET=local-admin-secret-for-homework
JWT_EXPIRES_IN=7d
ADMIN_JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
UPLOAD_DIR=uploads
"@
  Set-Content -LiteralPath $envPath -Value $content -Encoding ASCII
}

function Ensure-Dependencies($Dir, $Name) {
  $nodeModules = Join-Path $Dir 'node_modules'
  if (Test-Path -LiteralPath $nodeModules) {
    Write-Host "$Name dependencies already installed."
    return
  }

  Write-Host "Installing $Name dependencies. First run may take several minutes..."
  Push-Location $Dir
  try {
    & $script:NpmExe install
    if ($LASTEXITCODE -ne 0) {
      throw "npm install failed in $Name."
    }
  } finally {
    Pop-Location
  }
}

function Start-AppWindow($Title, $WorkingDir, $NpmArgs) {
  $command = "title $Title && `"$script:NpmExe`" $NpmArgs"
  Start-Process -FilePath 'cmd.exe' -ArgumentList @('/k', $command) -WorkingDirectory $WorkingDir
}

try {
  Write-Host '============================================================'
  Write-Host 'Campus Cat Station - Windows One Click Starter'
  Write-Host '============================================================'
  Write-Host "Project root: $Root"
  Write-Host ''
  Write-Host 'Notes:'
  Write-Host '- This project does NOT need Docker or Linux.'
  Write-Host '- Node.js is a Windows runtime, like Java JDK.'
  Write-Host '- Express API and Vue admin need Node.js.'
  Write-Host '- MySQL only stores data. MySQL cannot replace Node.js.'

  Write-Step 'Runtime check'
  Ensure-Node
  Ensure-Mysql

  Write-Step 'Database'
  Ensure-Database
  Ensure-Env

  Write-Step 'Dependencies'
  Ensure-Dependencies (Join-Path $Root 'server') 'server api'
  Ensure-Dependencies (Join-Path $Root 'admin') 'admin web'

  Write-Step 'Startup'
  if (Test-TcpPort 3000) {
    Write-Host 'Port 3000 is already in use. API may already be running.'
  } else {
    Start-AppWindow 'Campus Cat API' (Join-Path $Root 'server') 'run start'
  }

  Start-Sleep -Seconds 3

  if (Test-TcpPort 5173) {
    Write-Host 'Port 5173 is already in use. Admin web may already be running.'
  } else {
    Start-AppWindow 'Campus Cat Admin' (Join-Path $Root 'admin') 'run dev -- --host 127.0.0.1'
  }

  Start-Sleep -Seconds 4
  Start-Process 'http://localhost:5173'

  Write-Host ''
  Write-Host '============================================================'
  Write-Host 'Startup commands have been launched.'
  Write-Host 'API health: http://localhost:3000/api/health'
  Write-Host 'Admin web:  http://localhost:5173'
  Write-Host 'Admin user: admin'
  Write-Host 'Admin pass: 123456'
  Write-Host 'Do not close API/Admin command windows while testing.'
  Write-Host '============================================================'
  Read-Host 'Press Enter to exit this starter window'
  exit 0
} catch {
  Write-Host ''
  Write-Host 'ERROR:'
  Write-Host $_.Exception.Message
  Write-Host ''
  Write-Host 'Please keep this window open and send the error text to the developer.'
  Read-Host 'Press Enter to exit'
  exit 1
}
