# Python 依赖迁移方案：requirements*.txt → pyproject.toml（uv）

> 更新：2026-10-04 ｜ 决策依据：ADR-005（用 uv + pyproject.toml）
> 目标：以 `pyproject.toml`（uv）为唯一真源，同时**不破坏**现有引用 `requirements.txt` 的脚本与部署。

## 1. 现状盘点：仓库里有哪些 `requirements*.txt`，谁在用

| 文件 | 内容 | 消费方（实测） | 处置 |
|---|---|---|---|
| **根 `requirements.txt`** | 后端依赖（fastapi/uvicorn/sqlalchemy/aiosqlite/asyncpg/pydantic/langchain/chromadb/redis/boto3/cryptography/qrcode/edge-tts/stripe） | `render.yaml`（`pip install -r requirements.txt`）、`docs/engineering/services.md` | **迁移到根 `pyproject.toml`**，并保留导出兼容 |
| 根 `requirements-desktop-asr.txt` | 桌面 ASR 依赖 | **未发现任何引用**（桌面 ASR 实际用 `installer/asr-requirements-win-x64.lock` + `installer/asr-wheels.json`） | 疑似孤儿；先保留、标注，待确认后清理 |
| `vendor/ragflow-lite/requirements.txt` | RAGFlow 快照依赖 | `scripts/bootstrap-ragflow-lite-deps.ps1` | **保持不动**（vendor 快照，不属本项目源码） |
| `examples/python_safety_client/requirements.txt` | 示例 | 示例目录；同目录**已有** `pyproject.toml` | 保持不动 |

### 容易被误判为“根文件消费方”的地方（实为其他 requirements）
- `scripts/prepare-ailis-web-runtime.mjs:677`：`-r requirements.txt`，但 cwd 是**内置 SearXNG 源码目录**，非根。
- `scripts/swebench-pro-runtime.mjs:31`：`'requirements.txt'` 是 SWE-bench 仓库的**文件名模式**，非根。
- `scripts/setup-osworld-wsl.sh:35`：osWorld 环境内的依赖，非根。

## 2. 迁移方案（推荐：真源 pyproject + 导出的 requirements.txt）

> 为什么保留 `requirements.txt`：A+纪律下尽量减少对 core/部署的改动。`render.yaml`、docs、外部 CI 都读它。用 uv 从 pyproject **导出**它，既单一真源，又零破坏。

### 步骤
1. 用 uv 初始化并导入现有依赖（在仓库根）：
   ```powershell
   uv init --bare
   uv add -r requirements.txt          # 把现有 pin 导入 pyproject.toml
   ```
2. 设置 `requires-python`（对齐 `.python-version` = 3.11.11）：
   ```toml
   [project]
   name = "ailis-backend"
   version = "1.4.8"
   requires-python = ">=3.11,<3.12"
   dependencies = [ ... ]
   ```
3. 建独立环境（不碰 Anaconda）：
   ```powershell
   uv venv --python 3.11
   uv sync
   ```
4. **保留兼容**：让 `requirements.txt` 变为由 pyproject 导出（而非手改）：
   ```powershell
   uv export --format requirements-txt --no-hashes -o requirements.txt
   ```
   - 这样 `render.yaml` 的 `pip install -r requirements.txt` 无需改动。
   - 若要更彻底，可把 `render.yaml` 改为 `pip install .`（需要 `[build-system]`），但**非必要**，先不动。
5. `requirements-desktop-asr.txt`：确认无引用后删除；否则同样导出管理。
6. `.gitignore` 确认忽略 `.venv/`（迁移时补）。

### 验收
- `uv sync` 成功；`uv run python -c "import fastapi"` 可用。
- `pnpm` 侧不受影响（Python 仅后端/ASR 需要）。
- `render.yaml` 部署命令仍可用（因 requirements.txt 仍存在且等价）。

## 3. 影响面与风险
- **低风险**：根 requirements.txt 的消费者只有 `render.yaml` 与文档。
- **不影响**：vendor/example 的 requirements、桌面文本主链路（不需要 Python）。
- **注意**：`uv add -r requirements.txt` 会把 `>=` 范围写进 pyproject；如需严格复现，保留 uv.lock（提交 `uv.lock`）。

## 4. 执行时机
M0 文本链路**不需要** Python；本迁移可在 M0 之后、动到后端/本地语音前执行。
