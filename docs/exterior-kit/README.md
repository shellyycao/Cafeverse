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
| `reference-layout.png` | 现有 SVG 中景，**同一尺寸**，含周围真实街道。当作构图/视角参考图 |
| `alignment-template.png` | **透明**对位模板：街区边界（橙色虚线）、咖啡馆/后楼/停车场/公交站轮廓、道路中心线、锚点 |
| `alignment-preview.png` | 模板叠在参考图上的预览 |
| `anchors.json` | 锚点（像素 + 归一化） |

## 3. 画什么、不画什么

**只画橙色虚线框里面（咖啡馆所在的街区）**，框外必须是**透明**：
- 道路、街名、周围的建筑和树都由地图本身提供（真实的 Durham 街道数据），**不要画**。
- 街区边缘要自然收口（人行道缘石），不要画成一张方形卡片、不要白边、不要阴影框。

**必须有：**
- **一栋多层红砖混合用途建筑，咖啡馆在它的底层**（不是独立的小盒子）：长长的临街立面，底层是黑色窗框的大玻璃、黑色金属百叶雨篷、玻璃门、黑色椭圆吊牌（FOSTER STREET COFFEE）、露天座椅位置、人行道扶手；上面几层是住宅（阳台、白色和红砖相间的体块），屋顶有空调设备。
- 街角（Foster St × W Corporation St）一侧是一个小公交站亭。
- 一小块**空**的地面停车场（只有划线）、人行道铺装、少量路灯、花盆、街边计费桩、小公交站亭。
- 少量街树，笔触和室内插画一致。

**绝对不要：** 人物、动物、车辆（车和人以后单独做）、文字水印、UI 标记、道路和斑马线。

## 4. 风格
暖色水彩 + 彩铅的故事书风格，和 `interior-base.png` 保持一致：轻微不规则的轮廓、柔和投影、纸张颗粒、克制的奶油/赤陶/鼠尾草绿配色。不要光滑 3D，不要扁平矢量。

> **参考图：** 你发来的两张图都很合适——**正对街面的红砖立面图**，以及**斜俯视的"周围景物"图**（多层红砖混合建筑、底层咖啡馆、街树、公交站）。它们可以当"建筑长相和风格"的参考，**但不能直接用**：斜俯视那张是透视图、不透明、画了道路和车，和我们的**严格 2:1 等距 + 透明背景 + 只画街区**不一样。生成时请把它们作为风格参考，再附上 `reference-layout.png`（构图）和 `alignment-template.png`（位置）。

## 5. 推荐提示词（英文）

```
Isometric miniature of a street-corner café block, 2:1 isometric view from the lower right, hand-painted
watercolor and colored pencil storybook illustration, soft paper grain, slightly imperfect organic outlines,
warm afternoon light, gentle shadows, muted palette of cream, terracotta brick, sage green.
A multi-storey red-brick mixed-use building on the street corner whose GROUND FLOOR is the café: large
black-framed glass windows glowing warm inside, black metal slatted canopies, a black oval hanging sign reading
"FOSTER STREET COFFEE", glass double doors, black metal railings and small outdoor tables on the sidewalk;
four storeys of apartments above with balconies, white and brick volumes, rooftop air-conditioning units.
Paved sidewalk with street trees, bike racks, a pay-by-space kiosk, a small bus shelter at the corner,
a small EMPTY surface parking lot with painted bays beside the building. Only the block itself: no roads, no cars, no people, no animals, no text other than the sign,
no UI. Transparent background outside the block, the block edge ending in a neat curb.
```

建议把 `reference-layout.png` 当构图参考图喂给生成工具，再用 `alignment-template.png` 叠在结果上检查。生成后如果有背景，需要抠成透明，最后保存为 **2400 × 1425** 的带透明通道 PNG。

## 6. 放大进室内时怎么处理
放大到室内时，代码会在**咖啡馆建筑范围内**用一个渐隐的遮罩把外景图"挖空"，让室内插画显现，所以你**不需要**另外出一张"去掉屋顶的版本"。

## 7. 锚点（归一化 0–1，原点左上角）

| 锚点 | x | y | 像素 (x, y) | 说明 |
|---|---|---|---|---|
| cafe-door | 0.4437 | 0.8028 | 1065, 1144 | glass entrance under the black canopy (Corporation St side, left facade) |
| oval-sign | 0.4233 | 0.7095 | 1016, 1011 | black oval hanging sign beside the door |
| cafe-corner | 0.5563 | 0.8975 | 1335, 1279 | street corner of the café (Foster × Corporation) |
| bus-stop | 0.8471 | 0.6947 | 2033, 990 | illustrative bus shelter on the Foster St sidewalk |
| parking-kiosk-1 | 0.1858 | 0.6196 | 446, 883 | pay-by-space kiosk on the Corporation St sidewalk |
| parking-kiosk-2 | 0.3517 | 0.7593 | 844, 1082 | pay-by-space kiosk |
| parking-kiosk-3 | 0.7642 | 0.7881 | 1834, 1123 | pay-by-space kiosk on Foster St |
| lamp-corner | 0.5846 | 0.9319 | 1403, 1328 | street lamp at the café corner |
| lot-entrance | 0.2313 | 0.5551 | 555, 791 | small surface lot beside the café |

## 8. 验收
- 打开 http://localhost:3000 ，放大到咖啡馆街区：应看到你的插画长在真实街道上，没有方形边界。
- 继续放大：咖啡馆建筑处渐渐"打开"，露出室内。
