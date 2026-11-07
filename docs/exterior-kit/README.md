# Foster Street Coffee — 中景（外景）插画素材规格

## 你要交付的文件（只有这一个）

```
public/assets/foster/exterior-base.png
```

放进去、刷新页面，地图放大到街区（Neighborhood / Café exterior）时就**自动**用它替换现在的手搭 SVG 咖啡馆街区；删掉它就自动退回 SVG。不需要改代码。

## 1. 画布

| 项目 | 值 |
|---|---|
| 尺寸 | **2400 × 1425 px** |
| 宽高比 | 约 1.684（≈ 12 : 7.1） |
| 格式 | PNG，**带透明通道（RGBA）** |
| 视角 | 2:1 等距，和室内、地图完全同一视角（镜头从右下方看过去） |

## 2. 给你的对位文件（`docs/exterior-kit/`）

| 文件 | 用途 |
|---|---|
| `massing-reference.png` | **体块参考图**（同一尺寸）：真实街道 + 建筑应有的体块：2 层砖红裙楼（咖啡馆是底层，屋顶有露台）、后面和左端更高的住宅体量。**用这张当构图参考** |
| `reference-layout.png` | 现有 SVG 占位画面（同尺寸）。⚠ 它是旧的"独立小盒子 + 停车场"，**不要照它的建筑体量画**，只看风格和街道位置 |
| `alignment-template.png` | **透明**对位模板：街区边界（橙色虚线）、裙楼/咖啡馆橱窗段/高体量轮廓、道路中心线、锚点 |
| `alignment-preview.png` | 模板叠在参考图上的预览 |
| `anchors.json` | 锚点（像素 + 归一化） |

## 3. 建筑体量（和模板一致）

- **裙楼：** 沿 W Corporation St 的长条 2 层红砖基座，咖啡馆是它的底层（橙/红框处是咖啡馆橱窗段），屋顶是**种了植物的露台**。
- **高体量：** 后面一栋 4 层住宅楼，左端也有一段更高的住宅体量。**咖啡馆正上方只有露台，不要盖高楼**（否则放大进室内时会被挡住）。
- **车库入口：** 在建筑左端（官网写 "Liberty Warehouse Garage — enter on Corporation Street"）。
- **停车：** 只有路边停车，**不要画地面停车场**（之前的版本里那块停车场是我编的，已去掉）。
- **没有公交站：** 咖啡馆旁边没有公交站，**不要画**（也不要画公交站牌、候车亭）。街角只是普通的转角人行道。

## 3b. 画什么、不画什么

**只画橙色虚线框里面（咖啡馆所在的街区）**，框外必须是**透明**：
- 道路、街名、周围的建筑和树都由地图本身提供（真实的 Durham 街道数据），**不要画**。
- 街区边缘要自然收口（人行道缘石），不要画成一张方形卡片、不要白边、不要阴影框。

**必须有：**
- **一栋多层红砖混合用途建筑，咖啡馆在它的底层**（不是独立的小盒子）：长长的临街立面，底层是黑色窗框的大玻璃、黑色金属百叶雨篷、玻璃门、黑色椭圆吊牌（FOSTER STREET COFFEE）、露天座椅位置、人行道扶手；上面几层是住宅（阳台、白色和红砖相间的体块），屋顶有空调设备。
- 人行道铺装、街树、自行车架、街边计费桩、少量路灯和花盆。
- 少量街树，笔触和室内插画一致。

**绝对不要：** 人物、动物、车辆（车和人以后单独做）、文字水印、UI 标记、道路和斑马线。

## 4. 风格
暖色水彩 + 彩铅的故事书风格，和 `interior-base.png` 保持一致：轻微不规则的轮廓、柔和投影、纸张颗粒、克制的奶油/赤陶/鼠尾草绿配色。不要光滑 3D，不要扁平矢量。

> **参考图：** 你发来的两张图都很合适——**正对街面的红砖立面图**，以及**斜俯视的"周围景物"图**（多层红砖混合建筑、底层咖啡馆、街树）。它们可以当"建筑长相和风格"的参考，**但不能直接用**。⚠ 注意：斜俯视那张图里画了**公交站、车和道路**，这些**都不要**（咖啡馆旁边没有公交站，不能编）。另外它还有这些不同：斜俯视那张是透视图、不透明、画了道路和车，和我们的**严格 2:1 等距 + 透明背景 + 只画街区**不一样。生成时请把它们作为风格参考，再附上 `reference-layout.png`（构图）和 `alignment-template.png`（位置）。

## 5. 推荐提示词（英文）

```
Isometric miniature of a street-corner café block, 2:1 isometric view from the lower right, hand-painted
watercolor and colored pencil storybook illustration, soft paper grain, slightly imperfect organic outlines,
warm afternoon light, gentle shadows, muted palette of cream, terracotta brick, sage green.
A multi-storey red-brick mixed-use building on the street corner whose GROUND FLOOR is the café: large
black-framed glass windows glowing warm inside, black metal slatted canopies, a black oval hanging sign reading
"FOSTER STREET COFFEE", glass double doors, black metal railings and small outdoor tables on the sidewalk;
four storeys of apartments above with balconies, white and brick volumes, rooftop air-conditioning units.
Paved sidewalk with street trees, bike racks, a pay-by-space kiosk, no bus stop or bus shelter anywhere,
a garage entrance at the left end of the building. No surface parking lot. Only the block itself: no roads, no cars, no people, no animals, no text other than the sign,
no UI. Transparent background outside the block, the block edge ending in a neat curb.
```

建议把 `reference-layout.png` 当构图参考图喂给生成工具，再用 `alignment-template.png` 叠在结果上检查。生成后如果有背景，需要抠成透明，最后保存为 **2400 × 1425** 的带透明通道 PNG。

## 6. 放大进室内时怎么处理
放大到室内时，代码会在**咖啡馆建筑范围内**用一个渐隐的遮罩把外景图"挖空"，让室内插画显现，所以你**不需要**另外出一张"去掉屋顶的版本"。

## 7. 锚点（归一化 0–1，原点左上角）

| 锚点 | x | y | 像素 (x, y) | 说明 |
|---|---|---|---|---|
| cafe-door | 0.4313 | 0.7923 | 1035, 1129 | glass double door in the café storefront, under the black canopy |
| oval-sign | 0.4 | 0.666 | 960, 949 | black oval hanging sign beside the door |
| cafe-corner | 0.5563 | 0.8975 | 1335, 1279 | east end of the café storefront, toward the Foster St corner |
| roof-terrace | 0.5533 | 0.5053 | 1328, 720 | planted roof terrace on top of the podium above the café |
| garage-entrance | 0.15 | 0.5551 | 360, 791 | Liberty Warehouse Garage entrance (Corporation St side, left end of the building) |
| pay-kiosk-1 | 0.4721 | 0.8526 | 1133, 1215 | pay-by-space kiosk on the Corporation St sidewalk |
| pay-kiosk-2 | 0.2375 | 0.6554 | 570, 934 | pay-by-space kiosk (left) |
| bike-rack | 0.3375 | 0.7396 | 810, 1054 | bike rack in front of the café windows |
| street-tree-1 | 0.15 | 0.5867 | 360, 836 | street tree slot (left) |
| street-tree-2 | 0.3608 | 0.767 | 866, 1093 | street tree slot (in front of the café, between windows) |
| street-tree-3 | 0.5096 | 0.8898 | 1223, 1268 | street tree slot (near the corner) |

## 8. 验收
- 打开 http://localhost:3000 ，放大到咖啡馆街区：应看到你的插画长在真实街道上，没有方形边界。
- 继续放大：咖啡馆建筑处渐渐"打开"，露出室内。
