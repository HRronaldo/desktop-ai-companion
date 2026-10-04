# 第三方素材许可审计（分发 / 收费前必读）

> 生成：2026-10-04 ｜ 依据：仓库内许可/README 文件 + 官方来源检索 ｜ 性质：**非法律意见**，高风险项请咨询律师。
> 触发原因：计划"分享给朋友、未来可能收费"。AILIS **代码**是 MIT（可闭源、可收费，只需保留版权与许可声明），但**素材**各自可能另有许可。

---

## 0. 结论速览

- ✅ **代码**：可闭源、可商用、可收费（保留 AILIS `LICENSE` 与版权声明）。
- ⛔ **存在 4 类硬阻塞**，分发/收费前必须处理：
  1. **15 个来源不明的 VRMA 动作**（代码里已明确标注"不得再分发"）。
  2. **AILIS 自带的 VRM / 表情 / 图标 / 场景图**：**没有本地许可文件**，来源未证实。
  3. **Stockfish（国际象棋引擎）**：GPL-3.0，随二进制分发会触发 copyleft。
  4. **pixiv VRMA 动作包（VRMA_01–07）**：可商用但**须署名**，且**禁止以可抽取形式再分发**。

---

## 1. 硬阻塞项（分发/收费前必须处理）

| 项 | 位置 / 证据 | 风险 | 处置建议 |
|---|---|---|---|
| **15 个 legacy 具名 VRMA 动作**（Idle、Idle1、Idle2、Thinking、LookAround、Blush、Goodbye、Clapping、Jump、Angry、Sad、Sleepy、Surprised、VRMA_17、VRMA_25） | `src/character/motion-intake-catalog.js` 标注 `"unknown-local-file; do not redistribute until source is verified"` | 来源不明，**代码自己就禁止再分发** | 删除，或查明来源后再用 |
| **VRMA_08–31 等未登记动作** | 仅 VRMA_01–07 追到 pixiv 条款；其余未逐条登记来源 | 来源未证实 | 分发前逐条核实，或只保留已证实来源的动作 |
| **AILIS.vrm / AILIS.web.vrm / model.vroid** | 仓库根 & `Resources/`；无许可文件；README 明确警告第三方资源可能另有许可 | 若含第三方 VRoid 素材/发型/服装，**不能商用分发** | 确认 AILIS.vrm 的作者与素材来源；`model.vroid` 若为你自制则可控；否则替换成自制 VRM |
| **Emotes（62 PNG + 6 SVG）** | `Resources/Emotes/ailis{, -small}/`；无许可文件 | 无声明，默认不可再分发 | 确认是原 AILIS 原创（则随 MIT），否则替换 |
| **App 图标 / 场景图 / 社交卡** | `build/icon.*`、`electron/assets/*`、`public/**`、`Test/scenes/*`；无许可文件 | 同上 | 替换成自有素材（最省事） |
| **Stockfish（`stockfish` npm，`electron-builder.yml` 打包）** | `package.json` 依赖 `stockfish`；`electron-builder.yml` | **GPL-3.0 copyleft**：随二进制分发需公开相应源码/许可 | 从商业包**移除**，或改为"用户自行下载的独立可选组件"，或咨询律师 |
| **pixiv VRMA_MotionPack（VRMA_01–07）** | `Resources/VRMA_MotionPack/Readme_*_EN/JP.txt` | 商用**须署名**；**禁止以可抽取/可绑定的形式再分发** | 内嵌用于播放 + 加署名；**不要把 .vrma 作为独立文件随包分发** |
| **CosyVoice3 运行时 + `Resources/tts/*.wav` 样本** | `installer/ailis-runtime-components.json`（安装时下载）；wav 无许可 | 外部确认 CosyVoice **代码+权重为 Apache-2.0**；本地无声明；wav 参考音频来源不明 | 打包附 Apache-2.0 NOTICE；确认 wav 生成来源 |
| **sherpa-onnx wake 模型**（构建时下载） | `scripts/prepare-wake-model.mjs` → k2-fsa release | 项目 Apache-2.0，但**具体模型**需逐个核对 | 附 NOTICE；核对模型 LICENSE |

---

## 2. 安全项（保留许可/署名即可）

| 组件 | 许可 | 商用 | 可随付费包分发 | 署名 |
|---|---|---|---|---|
| three.js | MIT | ✅ | ✅ | 保留声明 |
| @pixiv/three-vrm(+animation) | MIT | ✅ | ✅ | 保留声明 |
| Electron | MIT | ✅ | ✅ | 保留声明 |
| node-pty | MIT | ✅ | ✅ | 保留声明 |
| exceljs | MIT | ✅ | ✅ | 保留声明 |
| chess.js | BSD-2-Clause | ✅ | ✅ | 保留声明 |
| pdfjs-dist | Apache-2.0 | ✅ | ✅ | 保留 + NOTICE |
| sherpa-onnx-node（代码） | Apache-2.0 | ✅ | ✅ | 保留 + NOTICE |
| OpenAI Whisper Small（ASR） | Apache-2.0（权重）+ MIT（代码） | ✅ | ✅ | 保留两份许可（`installer/whisper-*.txt`） |
| CosyVoice（代码 + 权重，外部确认） | Apache-2.0 | ✅ | ✅ | 保留 + NOTICE |
| fumi2kick VRMA 动作包（8 个） | **CC0** | ✅ | ✅ | 无需 |
| vendor/ragflow-lite | Apache-2.0 | ✅ | ✅ | 保留 `LICENSE.ragflow` + 上游声明 |
| VRoid Studio 导出的 VRM | VRoid 使用条款 + **每个 VRM 内嵌的许可元数据** | 视 VRM 而定 | 视 VRM 而定 | 遵循每个 VRM 元数据 |

---

## 3. 归属文件模板（`THIRD_PARTY_NOTICES`）

分发前创建，至少包含：

```
Meta / 代码
- three.js ........................ MIT  (c) 2010-2026 three.js authors
- @pixiv/three-vrm ................ MIT  (c) pixiv Inc.
- Electron ........................ MIT  (c) Electron contributors / GitHub Inc.
- node-pty ........................ MIT  (c) Christopher Jeffrey / Microsoft
- exceljs ......................... MIT  (c) Guyon Roche
- chess.js ........................ BSD-2-Clause  (c) Jeff Hlywa
- pdfjs-dist ...................... Apache-2.0  (c) Mozilla Foundation
- sherpa-onnx ..................... Apache-2.0  (c) Xiaomi Corp.
- CosyVoice ....................... Apache-2.0  (c) Alibaba Group
- ragflow-lite .................... Apache-2.0  (c) InfiniFlow

素材
- VRMA_MotionPack (VRMA_01-07) .... (c) pixiv Inc. / VRoid Project
  必需署名：Animation credits to pixiv Inc.'s VRoid Project
            キャラクターアニメーション: ピクシブ株式会社 VRoidプロジェクト
- fumi2kick VRMA .................. CC0（无需署名）
- Whisper Small ................... Apache-2.0 + MIT（见 installer/whisper-*.txt）

若打包 Stockfish（不推荐）：
- Stockfish ....................... GPL-3.0（须公开相应源码/许可）
```

---

## 4. 行动清单（按优先级）

1. **决定 Stockfish**：从商业包移除 / 改为可选独立下载 / 咨询律师。
2. **清理 15 个来源不明 VRMA**：删除或查明来源（`Resources/VRMA_MotionPack/vrma/`）。
3. **核实 AILIS.vrm / 表情 / 图标 / 场景图**：确认原创 → 随 MIT；否则替换成自有素材。
4. **VRM 策略**：用你自制/委托的 VRM（`model.vroid` 导出的王梦诗），并遵循 VRoid 条款与内嵌元数据。
5. **加 VRMA 署名**到应用"关于/致谢"页。
6. **建立 `THIRD_PARTY_NOTICES`**（模板见上）。
7. **核对 sherpa-onnx wake 模型与 CosyVoice 打包附带的许可文件**。

---

## 5. 主要来源

- VRMA MotionPack 条款：`Resources/VRMA_MotionPack/Readme_VRMA_MotionPack_EN.txt` / `_JP.txt`
- fumi2kick CC0：`Resources/MotionIntake/candidates/fumi2kick-vrma-motion-pack/.../README.txt`
- 动作来源登记：`src/character/motion-intake-catalog.js`
- Whisper 声明：`installer/asr-third-party-notices.md`、`installer/whisper-MIT-LICENSE.txt`、`installer/whisper-Apache-2.0-LICENSE.txt`
- RAGFlow：`vendor/ragflow-lite/LICENSE.ragflow`
- 外部：three.js / three-vrm / Electron / node-pty / exceljs / chess.js / pdfjs-dist 各自 LICENSE；sherpa-onnx & CosyVoice 项目 LICENSE；VRoid Studio 使用条款 / VRM Public License 1.0。
