Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'Load-McpEnv.ps1')

if (-not $env:SUPABASE_ACCESS_TOKEN) {
  throw 'SUPABASE_ACCESS_TOKEN nao encontrado em .env.mcp.local'
}

$projectRef = if ($env:SUPABASE_PROJECT_REF) { $env:SUPABASE_PROJECT_REF } else { 'vkbibdmlwbjfurkigsou' }

& npx -y "@supabase/mcp-server-supabase@latest" "--project-ref=$projectRef" --access-token $env:SUPABASE_ACCESS_TOKEN
