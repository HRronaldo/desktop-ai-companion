# 基线跑通脚本（AILIS v1.4.8）
# 用法：powershell -NoProfile -ExecutionPolicy Bypass -File scripts/fork/run-baseline.ps1
$ErrorActionPreference = 'Stop'

# 切到仓库根（本脚本位于 scripts/fork/）
Set-Location (Resolve-Path (Join-Path $PSScriptRoot '..\..'))

Write-Output '=== 工具版本检查 ==='
Write-Output ("node: " + (node --version))
Write-Output ("corepack: " + (corepack --version))

# 项目 packageManager 固定 pnpm@10.33.0，用 corepack 自动对齐
try { corepack enable | Out-Null } catch { Write-Output '[warn] corepack enable 失败，可忽略' }
Write-Output ("pnpm: " + (pnpm --version))

Write-Output ''
Write-Output '=== 安装依赖（frozen lockfile）==='
pnpm install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { throw 'pnpm install 失败' }

Write-Output ''
Write-Output '=== 下一步：启动开发模式 ==='
Write-Output '  pnpm desktop:dev'
Write-Output ''
Write-Output '启动后在【控制面板 → 模型 API】配置模型：'
Write-Output '  - 本地 Ollama: http://127.0.0.1:11434'
Write-Output '  - 或云 API（按你的服务商填写）'
Write-Output '然后到【聊天窗口】发一条消息，验证基线对话可用。'
