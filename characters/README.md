# characters/ — 角色包（角色源代码目录）

本目录是**角色包（character pack）的源真目录**，一个角色一个子目录。它复用 AILIS 内置的 **Asset Pack** 机制来加载，**换形象/人设/语音无需改代码**。

## 命名与结构

```
characters/
└── mengshi/                 # 王梦诗 = 第 1 个角色包
    ├── manifest.json        # 必需：AILIS asset-pack 清单
    └── assets/
        ├── model.vrm        # 形象（由 model.vroid 导出；安装前必须存在）
        ├── persona-style.json
        ├── voice-profile.json
        └── README.md
```

## 如何使用（在应用内）

1. 打开控制面板 → 人物/资产包管理。
2. “安装” → 选择 `characters/mengshi/` 目录。
3. “激活” → 桌宠窗口自动重载，换成王梦诗形象。

> 安装时 AILIS 会把包复制到 `userData/asset-packs/installed/<id>/`，并通过 `ailis-asset://` 协议加载。本目录只作为**源**。

## schema 参考

以 `electron/asset-pack-runtime.cjs` 为准：
- `type` 仅支持 `character_pack` / `skin_pack`。
- `id` 会被规范化为 `[a-zA-Z0-9._-]`，最长 96。
- `assets.vrm` / `renderProfile` / `personaStyle` / `voiceProfile` / `expressions` 若声明则**文件必须存在**。
- 示例包：`sample-asset-packs/ailis-cinematic-skin/`。
