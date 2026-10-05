# 决策记录（ADR）

> 格式：日期 · 决策 · 理由 · 状态。新增决策请追加。

## ADR-001 · 底座：fork AILIS 为主线
- 日期：2026-10-03 / 更新 2026-10-04
- 决策：fork `haowenGuo/AILIS`（MIT）作为项目底座，锁定 v1.4.8。
- 理由：AILIS 已具备 VRM 桌面角色、Windows 透明常驻、语音、长期记忆、computer use（带审批/审计/恢复）、Agent Runtime——最难的两块已现成。备选自建 Tauri 薄壳放弃。
- 状态：已定。

## ADR-002 · 架构：A + 纪律
- 日期：2026-10-04
- 决策：**允许改 core**（A），但改动集中、命名空间清晰、可追踪；上游更新走 **cherry-pick**（非整体 merge）。
- 理由：目标是可分享/可收费的产品；R7/M2/M4 必然改 core，纯"薄扩展"会拖慢产品；上游是单人项目（5★），整体 merge 收益低。纪律保证可维护性与"选择性吸收上游"能力。
- 状态：已定。

## ADR-003 · 分支模型
- 日期：2026-10-04
- 决策：`main` = 上游镜像（不写产品代码）；`develop` = 产品主线（默认分支）；`feat/*` = 功能分支。基点标签 `v1.4.8-base`。
- 状态：已落地。

## ADR-004 · 包管理：pnpm（不用 npm，不用 bun 装本仓库）
- 日期：2026-10-04
- 决策：本仓库使用 **pnpm**（corepack 用户级启用）；npm 不使用。bun 仅用于我们自己的独立工具/脚本。
- 理由：仓库原生 pnpm 工程（`pnpm-lock.yaml`、`pnpm-workspace.yaml.allowBuilds`、脚本内 `pnpm` 调用）。bun 不兼容该工作区与原生模块构建白名单，风险高。
- 备注：`corepack enable` 需管理员（写 `C:\Program Files\nodejs`）→ 改用 `corepack enable --install-directory %LOCALAPPDATA%\corepack` + 用户 PATH。
- 状态：已落地。

## ADR-005 · Python：uv + pyproject.toml
- 日期：2026-10-04
- 决策：Python 环境与依赖用 **uv** 管理；**弃用 `requirements*.txt`，改用 `pyproject.toml`**；Python 版本用 **3.11**（项目 `.python-version`=3.11.11），不碰 Anaconda base。
- 理由：用户偏好；uv 可精准管理解释器+依赖。
- 备注：迁移前需核查是否有脚本/安装器（runtime packs、backend）读取 `requirements*.txt`。
- 状态：已定，待执行。

## ADR-006 · 模型：本地 Ollama 优先，云后续
- 日期：2026-10-04
- 决策：先用本地 **Ollama**（AILIS 原生支持 `http://127.0.0.1:11434`）；云 API（如 OpenCode Zen `big-pickle`）后续再接。
- 理由：用户明确；对接云容易，先本地。
- 备注：8GB 显存 → 7B Q4 解码；vLLM 不原生支持 Windows（需 WSL2/Linux/Docker），暂不采用。
- 状态：已落地（Ollama 0.35.1 @ `D:\Apps\Ollama`，模型 `Qwen2.5-7B-Instruct-GGUF`，API `127.0.0.1:11434`）。

## ADR-007 · 文档约定
- 日期：2026-10-04
- 决策：项目进展/决策/环境一律写在仓库 `docs/fork/`；`aaaaa/ideas` 仅作讨论稿。
- 状态：已定。
