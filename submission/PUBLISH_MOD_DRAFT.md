# 新模组提交草稿

准备日期：2026-10-15。**尚未提交。** 这是独立玩法模组的 Publish New Mod 材料，不自动重开旧地图申请。

官方表单：[Publish New Mod](https://github.com/Subway-Builder-Modded/registry/issues/new?template=publish-mod.yml)  
表单字段依据：[publish-mod.yml](https://github.com/Subway-Builder-Modded/registry/blob/main/.github/ISSUE_TEMPLATE/publish-mod.yml)

## 提交前尚需落实

- 可供 Railyard 使用的独立更新源。选择 GitHub Releases 时，目标仓库必须有 Release，最新 Release 必须带 ZIP；仓库内的审核 ZIP 不能冒充 Release 附件。
- 对普通玩家已开放功能、PVG 地图依赖、支持的游戏版本和未完成功能进行最终核对。
- 由作者确认表单要求的作者身份与平台条款。下面保留未勾选状态。
- 社区仍需决定是否接收 PVG-only 伴随模组；新项目不保证批准。

## Title

[Publish Mod]: Shanghai Operations / 上海多制式运营

## Mod ID

leovan-shanghai-operations

## Display Name

Shanghai Operations / 上海多制式运营

## Description

Shanghai Operations adds an integrated route → stops → station roles → fleet → native service workflow for the Shanghai PVG map.

Choose local, fast or express stopping patterns and combine compatible through-services. Inspect real-track map previews, infrastructure-aware station recommendations and fleet guidance before applying a separate native service. Ownership records support scoped undo and protect later manual changes.

The five PVG track/vehicle tiers are 80 / 120 / 160 / 200 / 300 km/h. Fleet guidance uses native round-trip time, the shortest platform, inventory and other-service allocation; planned fleet is shown separately from actual deployment.

**Development preview 0.8.1-dev.2.** The advanced 2/4/6/8-track construction, automatic bypass and dynamic passing interfaces do not yet have a completed ordinary-player activation workflow. Long-duration/full-passenger-cycle and comprehensive throat/layout acceptance remain incomplete. publishReady=false.

The exact runtime had a targeted Subway Builder 1.7.2 test over 7,368 simulated seconds with 43 original routes / 228 original trains and 8 new native trains. Three of five holds independently verified actual passing; the other two are not counted. This is limited evidence, not full operational certification.

**Requires the separate PVG map. Existing community SHA-map compatibility is not implemented.** The project contains operations code and no new geographic map data or prebuilt network save. Please review its gameplay workflow separately and state whether this dependency is acceptable.

中文：先选线路，再预览停站、站型与配车，最后应用为可撤销的新服务。普通/快车/急行可组合兼容直通，采用五档轨道车辆。目前为仅支持 PVG 的开发预览，高级自动接轨和动态越行启用流程及长周期验收仍待完成。

## Tags

- [x] gameplay
- [x] qol
- [x] stations
- [x] tracks
- [x] trains
- [x] ui

## Source URL

https://github.com/LeoVan1412/shanghai-operations

## Update Type

GitHub Releases

## GitHub Repository

LeoVan1412/shanghai-operations

## Custom Update URL

留空。尚未提供或配置自定义更新源。

## Gallery Images

待补真实游戏截图。现有地图封面不能作为新增运营界面的证明。

## Collaborators

留空。

## Caretaker (GitHub user ID)

留空。

## Terms

- [ ] I confirm I am the author or have permission to publish this mod.
- [ ] I attest that I have reviewed the Subway Builder Modded platform Terms of Service.

## 审阅附件

- [具体功能差异](../docs/COMPARISON.md)
- [验收状态及限制](../docs/ACCEPTANCE_STATUS.md)
- [开发审核包](../review-package/README.md)
- [固定候选原生证据](../evidence/r16-summary.json)
