# 本机环境（Environment）

> 快照时间：2026-10-04 ｜ 机器：hrron 的 Win11 开发机

## 硬件
| 项 | 值 |
|---|---|
| OS | Windows 11 专业版 **26H2**（build 26300），AMD64 |
| CPU | AMD Ryzen 5 5600X（6C/12T） |
| RAM | 31.9 GB |
| GPU | **NVIDIA RTX 3070 Ti · 8192 MiB · 驱动 591.86** |
| 其他显示适配器 | `GameViewer Virtual Display Adapter`（远程串流虚拟屏，可能影响 M2 全屏/多屏检测） |
| 磁盘 | C: 98.6 GB 空闲 ／ D: 278.7 GB 空闲 |

> 8GB 显存是本地 AI 的瓶颈：建议 7B Q4；LLM 与 TTS 之间注意显存调度。

## 工具链（实测）
| 工具 | 状态 | 位置 |
|---|---|---|
| Node | ✅ **v24.13.0** | `C:\Program Files\nodejs` |
| pnpm | ✅ **10.33.0**（corepack 用户级 shim） | `%LOCALAPPDATA%\corepack`（已加入用户 PATH） |
| bun | ✅ 1.4.2 | `D:\Tools\bun-windows-x64`（仅独立工具用） |
| npm | 11.6.2（**不使用**） | — |
| uv / uvx | ✅ 0.9.26 | `D:\Tools\anaconda3\Scripts` |
| Python（系统） | 3.12.7（Anaconda，**不用于本项目**） | `D:\Tools\anaconda3` |
| git | ⚠️ **2.39.1（旧）** | `D:\Tools\Git` |
| VS Build Tools | ✅ VS 2022 BuildTools | `D:\Tools\Microsoft Visual Studio\2022\BuildTools` |
| Ollama | ✅ 0.35.1（已安装并运行） | `D:\Apps\Ollama`（模型：`D:\Apps\Ollama\models`） |
| Docker | ❌ 未安装 | — |
| cmake | ❌ 未安装 | — |

## 关键命令
```powershell
# pnpm（corepack 用户级，无需 admin/npm）
corepack enable --install-directory "$env:LOCALAPPDATA\corepack"   # 已执行
pnpm --version                                                      # -> 10.33.0

# 依赖安装（在仓库根，develop 分支）
pnpm install --frozen-lockfile

# 开发模式
pnpm desktop:dev
```

## Python（仅后端/本地语音需要）
```powershell
# 用 uv 建 3.11 独立环境（不碰 Anaconda）
uv venv --python 3.11 .venv
uv pip install -r requirements.txt   # 迁移后将改为 pyproject.toml
```

## 本地 LLM（Ollama）
- 程序：`D:\Apps\Ollama`（`ollama.exe` / `ollama app.exe`）；API `http://127.0.0.1:11434`
- 模型目录（`OLLAMA_MODELS`，用户级环境变量）：`D:\Apps\Ollama\models`
- 已装模型：**`qwen2.5-7b-q4km:latest`**（Qwen2.5-7B-Instruct **Q4_K_M**，4.7GB，ctx 32768）
  - 来源：ModelScope `bartowski/Qwen2.5-7B-Instruct-GGUF` 的单文件 `Qwen2.5-7B-Instruct-Q4_K_M.gguf`
  - 导入：`ollama create qwen2.5-7b-q4km -f Modelfile`（Modelfile: `FROM <该 gguf 路径>`）
  - 注：`ollama pull modelscope.cn/Qwen/Qwen2.5-7B-Instruct-GGUF` 会拿到 **Q2_K**（质量偏低），故改用单文件 Q4_K_M。
- AILIS 指向 Ollama 的配置：`%APPDATA%\AILIS\desktop-state.json`（`llmProvider=ollama`，`llmBaseUrl=http://127.0.0.1:11434`，`llmModel=qwen2.5-7b-q4km:latest`）

## 已知问题
- `corepack enable`（默认）需管理员权限 → 用 `--install-directory` 解决。
- git 2.39.1 对上游 `fetch --tags` 触发 HTTP/2 bug（`remote-curl.c:1494`）→ 升级 Git for Windows。
- vLLM 不原生支持 Windows。

### 排障：Ollama 默认上下文 4096 导致聊天 400
- 现象：AILIS 聊天最终回复「模型接口调用失败」；`task-interaction` 日志里报
  `request (5848 tokens) exceeds the available context size (4096 tokens)`。
- 原因：`ollama create` 没设 `num_ctx`，Ollama 默认上下文 **4096**；而 AILIS 的系统提示本身就约 5848 token。
- 修复：重建模型，加 `PARAMETER num_ctx 16384`：
  ```
  FROM qwen2.5-7b-q4km
  PARAMETER num_ctx 16384
  ```
  然后 `ollama create qwen2.5-7b-q4km -f Modelfile`。
- 现状：ctx **16384**，100% GPU，显存约 **7.4 / 8 GB（偏紧）**。若后续长对话再超，可考虑降回 8192 或换更小量化。

### 排障：git 2.39.1 的 HTTP/2 ref-listing bug（影响 clone/fetch）
- 现象：经代理 `git clone/fetch` 报 `BUG: remote-curl.c:1494 ... fatal: expected flush after ref listing`（HTTP/1.1 无效）。
- 修复：`git config --global protocol.version 1`（强制协议 v1，已验证可克隆 CosyVoice；同时修复上游 fetch）。

### 语音模式
- `off` / `hosted`（普通，远程，长文本易丢）/ `server`（ElevenLabs 云端）/ `cosyvoice3`（本地，需运行时）/ **`native`（本地系统语音，即时、零下载，已启用）**。
- 装本地 CosyVoice3 运行时：`VoiceRuntimeBootstrap.bootstrap({allowNetwork:true, includeOptional:true})`（非 `prepare-ailis-voice-runtime.mjs`，那个只校验）。

## 网络（重要）
- GitHub 直连被墙；`gh-proxy.com` 镜像可用但慢（~0.1–0.3 MB/s）。
- 本机系统代理 `127.0.0.1:7890`（`ProxyEnable=1`），当前节点很慢（~0.01 MB/s）。
- 国内快源：`registry.npmmirror.com`（Electron 二进制已用）、`modelscope.cn`（模型）。
- Ollama 安装包 ~1.47GB 必须走镜像；模型优先 `ollama pull modelscope.cn/<owner>/<model>-GGUF`。
