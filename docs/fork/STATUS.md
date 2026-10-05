# 项目状态（唯一进度入口）

> 更新：2026-10-04 ｜ 维护者：本仓库 fork 团队
> 说明：项目进展、决策、环境一律在 `docs/fork/` 更新；`D:\program\aaaaa\ideas\desktop-ai-companion.md` 仅作讨论稿，不再作为进度源。

## 一句话
Fork AILIS 打造**多角色桌面 AI 伴侣平台**；**王梦诗 = 第 1 个角色包**。

## 基线与仓库
- 上游：`haowenGuo/AILIS`（MIT，权威主线，**无 Gitee 镜像**）
- 基线：**v1.4.8 / commit `33306d1`**，标签 **`v1.4.8-base`**
- 分支模型：`main`（上游镜像）／**`develop`（产品主线，默认）**／`feat/*`
- 当前分支：`develop`

## 已完成
- [x] fork + 固化基线；加 `upstream`；打 `v1.4.8-base`
- [x] 架构决策 **A + 纪律**（允许改 core，改动集中可追踪，上游 cherry-pick）
- [x] 角色包脚手架 `characters/mengshi/`（Asset Pack 机制）
- [x] 第三方素材许可审计 `docs/fork/asset-licenses.md`
- [x] pnpm 用户级启用（corepack，无需 admin，不碰 npm）

## 已完成（环境准备）
- [x] pnpm 用户级启用（corepack，无 admin，不碰 npm）
- [x] `pnpm install --frozen-lockfile`（675 包；Electron 41.2.0 就位）
- [x] `pnpm build:desktop` 通过（exit 0，生成 `dist/`）
- [x] `docs/fork/` 四份文档

## 已完成（本地 LLM）
- [x] Ollama **0.35.1** 安装到 `D:\Apps\Ollama`，运行中（API `http://127.0.0.1:11434`）
- [x] 模型：**`qwen2.5-7b-q4km:latest`**（Qwen2.5-7B-Instruct，**Q4_K_M**，4.7GB，ctx 32768）；来源 ModelScope `bartowski/Qwen2.5-7B-Instruct-GGUF`，用 `ollama create` 导入；API 冒烟测试 `OK`
- [x] AILIS 已配置指向 Ollama：`%APPDATA%\AILIS\desktop-state.json`（provider `ollama`，base `http://127.0.0.1:11434`，model `qwen2.5-7b-q4km:latest`）

## 已完成（M0）
- [x] 应用跑通：文字对话正常（修复 Ollama 上下文 4096 → 16384）
- [x] 角色包 `mengshi.character.v1` **安装 + 激活**；`effective.modelUrl = ailis-asset:///mengshi.character.v1/assets/model.vrm`
- [!] **注意**：`Resources/AILIS.vrm` 与导出的 `model.vrm` **是同一角色**（VRM 元数据均为 `AiGril` / `HaowenGuo`）→ 换脸后视觉无变化属**预期**；真正外观变化需设计**王梦诗**专属形象
- [ ] 王梦诗形象设计（改 VRoid：脸型/发型/服装/配色/身材）→ 重新导出并替换 `model.vrm` → 重装/激活

## 待办（近期）
- [ ] **M0 收尾**：启动 `pnpm desktop:dev` 验证 王梦诗形象（待专属形象完成后）+ 与 Ollama 对话
- [ ] 许可阻塞项处置（Stockfish / 不明 VRMA / AILIS.vrm 来源）
- [ ] Python 迁移：`requirements*.txt` → `pyproject.toml`（uv）——**方案已就绪**，见 [PYTHON-MIGRATION.md](PYTHON-MIGRATION.md)

## 文档索引
- [ROADMAP.md](ROADMAP.md) — 里程碑计划
- [DECISIONS.md](DECISIONS.md) — 决策记录（ADR）
- [ENVIRONMENT.md](ENVIRONMENT.md) — 本机环境与准备步骤
- [PYTHON-MIGRATION.md](PYTHON-MIGRATION.md) — Python 依赖迁移方案
- [asset-licenses.md](asset-licenses.md) — 素材许可审计
