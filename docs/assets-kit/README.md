# Foster Street Coffee — 室内插画素材规格（第一版：只要 1 张图）

## 你要交付的文件（只有这一个）

```
public/assets/foster/interior-base.png
```

放进去、刷新页面，网站**自动**用它替换 SVG 室内；删掉它就自动退回 SVG。不需要改代码，也不需要跑脚本。

## 1. 画布尺寸

| 项目 | 值 |
|---|---|
| 尺寸 | **2040 × 1620 px**（宽 × 高） |
| 宽高比 | 17 : 13.5（约 1.259，接近 5:4） |
| 格式 | PNG，**带透明通道（RGBA）** |
| 视角 | 2:1 等距（isometric）剖面微缩景，镜头从右下方看进房间 |

画布之外和房间轮廓之外必须是**透明**的（这样它才能和地图的地面自然融合，不是一个方形卡片）。

## 2. 给你的对位文件（`docs/assets-kit/`）

| 文件 | 用途 |
|---|---|
| `reference-layout.png` | 现有 SVG 空室内，**同一尺寸**。当作构图/视角参考图喂给绘图工具 |
| `alignment-template.png` | **透明**背景的对位模板：地板边界、两面墙、临街玻璃和门、主要家具占位、锚点 |
| `alignment-preview.png` | 模板叠在参考图上的预览，方便理解各个标注 |
| `alignment-template.svg` | 模板的矢量源文件 |
| `anchors.json` | 锚点坐标（像素和归一化 0–1，原点在左上角） |

把 `alignment-template.png` 叠在你生成的图上，就能检查家具位置有没有对上。

## 3. 关键锚点（归一化坐标，x、y 为 0–1）

| 锚点 | x | y | 像素 (x, y) | 说明 |
|---|---|---|---|---|
| barista | 0.6868 | 0.5136 | 1401, 832 | behind the service counter, near the espresso machine |
| counter-front | 0.6598 | 0.579 | 1346, 938 | where a customer stands at the counter |
| pastry-case | 0.6034 | 0.516 | 1231, 836 | centre of the glass pastry display |
| lounge-1 | 0.3466 | 0.4364 | 707, 707 | leather armchair (right) |
| lounge-2 | 0.2784 | 0.4599 | 568, 745 | leather armchair (left) |
| window-seat-1 | 0.1534 | 0.6481 | 313, 1050 | window-bar stool 1 (left end) |
| window-seat-2 | 0.2069 | 0.6784 | 422, 1099 | window-bar stool 2 |
| window-seat-3 | 0.2632 | 0.7093 | 537, 1149 | window-bar stool 3 |
| window-seat-4 | 0.3118 | 0.7389 | 636, 1197 | window-bar stool 4 |
| window-seat-5 | 0.3701 | 0.7765 | 755, 1258 | window-bar stool 5 (door end) |
| tableA-back | 0.2034 | 0.5975 | 415, 968 | left table, back chair |
| tableA-front | 0.2632 | 0.6111 | 537, 990 | left table, front chair |
| tableB-back | 0.3868 | 0.6062 | 789, 982 | middle table, back chair |
| tableB-front | 0.4368 | 0.621 | 891, 1006 | middle table, front chair |
| tableC-back | 0.3833 | 0.7179 | 782, 1163 | front table, back chair |
| tableC-front | 0.4333 | 0.7302 | 884, 1183 | front table, front chair |
| door | 0.5735 | 0.7889 | 1170, 1278 | glass entrance |

（锚点是在**已采用的插画 `interior-base.png`** 上量出来的，约略值；Gate 2 放人物时再微调。人物脚底 / 臀部为锚点。）

## 4. 画面内容（只画这些，保持"空"）

**必须有：**
- 左墙：深蓝色照片墙，满墙大小不一的黑白小相框，装在小木搁板上
- 右墙（服务墙）：白色墙面、三块菜单板（EAT / SPECIALS 黑板 / SIP）、木质推拉谷仓门、不锈钢冰箱、右端一幅蓝色肖像画
- 木纹竖条纹的灰褐色柜台，原木台面，黑色咖啡机；柜台前一个白底、薄荷绿框的玻璃糕点展示柜；一张黑色金属零售桌
- 沿临街玻璃的浅色木质吧台，4 张米色高脚凳
- 3 张橡木方桌，配黑色竖条靠背椅
- 休闲区：两张棕色皮沙发、黑色圆茶几、落地灯；木纹竖条纹矮墙隔断，上面一排白色浅盆植物
- 条纹叶观叶植物（白色圆形花盆），白色圆球纸灯笼，黑色轨道灯
- 临街一侧是**开放的剖面**：红砖窗台、黑色窗框细线、玻璃门，不画实心墙

**绝对不要：** 人物、动物、文字水印、UI 图标、标签、混凝土柱、洗手间门。

## 5. 画风

暖色水彩 + 彩铅的故事书风格：轻微不规则的手绘轮廓、柔和投影、纸张颗粒、克制的奶油/木色/赤陶/鼠尾草绿配色，保留 Foster Street Coffee 真实的深蓝墙和原木家具。不要光滑 3D、不要扁平矢量、不要霓虹。

## 6. 推荐的生成提示词（英文，直接用）

```
Empty cozy coffee shop interior, miniature cutaway diorama, 2:1 isometric view from the lower right,
hand-painted watercolor and colored pencil storybook illustration, soft paper grain, slightly imperfect
organic outlines, warm ambient window light, gentle shadows, muted harmonious palette.
Left wall: deep navy blue wall covered in many small black-and-white framed photographs on tiny wooden shelves.
Right wall: cream service wall with three wooden-framed menu boards (the middle one a black chalkboard),
a sliding wooden barn door on a black rail, a stainless fridge, a blue painted portrait at the far right.
Small wood-fronted service counter with butcher-block top and black espresso machine, in front of it a
glass pastry display with mint-green frame, a black metal table with coffee bags.
Light wooden window bar with four beige stools along the street-side glass, three square oak tables with
black spindle-back chairs, a lounge corner with two brown leather armchairs, a round black coffee table
and a floor lamp, light wood beadboard half-wall with white bowls of plants, a large striped-leaf plant
in a round white pot, round white paper lanterns hanging, black track lighting.
Street-facing side is an open cutaway with a low red-brick base, thin black window frames and a glass door.
No people, no animals, no text, no logos, no concrete column. Transparent background outside the room.
```

建议：先把 `reference-layout.png` 作为构图参考（image reference）生成，再对照 `alignment-template.png` 检查位置。如果工具不能直接输出透明背景，先生成纯色背景再抠图，最后保存为 2040 × 1620 的带透明通道 PNG。

## 7. 验收

- 打开 http://localhost:3000/gate1 ：应该直接显示你的图。
- 打开 http://localhost:3000/gate1/assets ：你的图上叠着红色锚点，检查凳子/沙发/柜台位置是否对上。
- 进入地图放大到室内（Inside）：同一张图会出现在咖啡馆里。

人物、糕点、宠物等单独图层放到下一版，现在**不需要**。
