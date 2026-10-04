# 王梦诗 角色包 · 资产目录

这里是 `character_pack` 的资源目录。

## 必做：放入 VRM

1. 用 **VRoid Studio** 打开仓库根目录的 `model.vroid`。
2. 导出为 **VRM 0.x / 1.0**，命名为 `model.vrm`，放到本目录（即 `characters/mengshi/assets/model.vrm`）。
3. `manifest.json` 已声明 `assets.vrm = "assets/model.vrm"`。

> ⚠️ AILIS 资产包在“安装”时会校验：**凡是 manifest 里声明了的资源，文件必须真实存在**，否则安装报错（`VRM 资源不存在`）。所以请先放好 `model.vrm` 再安装。

## 许可提醒（分发/收费前必读）

- 用 VRoid Studio 自制并导出的 VRM，其**商用与再分发**条款取决于 VRoid 的使用条款与你使用的素材；分发前请确认。
- 详见根目录素材许可审计文档 `docs/fork/asset-licenses.md`（由审计任务产出）。

## 其他资源（可选）

- `persona-style.json`：人设元数据（当前 AILIS 主要当作标签/元数据使用，不保证完全驱动人设 prompt）。
- `voice-profile.json`：音色元数据（当前不覆盖用户语音设置）。
- 未来可扩展：`renderProfile`、`expressions` 等（需与 `electron/asset-pack-runtime.cjs` 的 schema 对齐）。
