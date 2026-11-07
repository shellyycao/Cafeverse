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
| barista | 0.7059 | 0.4889 | 1440, 792 | behind the service counter, between the two coffee machines |
| counter-front | 0.6765 | 0.5802 | 1380, 940 | where a customer stands at the counter |
| pastry-case | 0.6078 | 0.5123 | 1240, 830 | centre of the curved glass pastry display |
| lounge-sofa-1 | 0.3137 | 0.463 | 640, 750 | sofa, left seat |
| lounge-sofa-2 | 0.3578 | 0.4444 | 730, 720 | sofa, right seat |
| lounge-armchair | 0.4314 | 0.4877 | 880, 790 | cream armchair |
| window-seat-1 | 0.1794 | 0.6296 | 366, 1020 | window-bar stool 1 (far end) |
| window-seat-2 | 0.2216 | 0.6506 | 452, 1054 | window-bar stool 2 |
| window-seat-3 | 0.2618 | 0.6765 | 534, 1096 | window-bar stool 3 |
| window-seat-4 | 0.302 | 0.7037 | 616, 1140 | window-bar stool 4 |
| window-seat-5 | 0.3451 | 0.7346 | 704, 1190 | window-bar stool 5 (door end) |
| tableA-left | 0.4569 | 0.4259 | 932, 690 | back table, left chair |
| tableA-right | 0.5275 | 0.479 | 1076, 776 | back table, right chair |
| tableB-left | 0.4088 | 0.6358 | 834, 1030 | front table, left chair |
| tableB-back | 0.502 | 0.5556 | 1024, 900 | front table, back chair |
| door | 0.5882 | 0.7901 | 1200, 1280 | glass entrance |

（锚点是在**当前采用的插画 `interior-base.png`（第三版：沙发 + 5 张窗边凳 + 弧形糕点柜）** 上量出来的，约略值；Gate 2 放人物时再微调。人物脚底 / 臀部为锚点。）

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

## 夜晚（打烊后）

不需要单独的夜晚图：代码把**同一张** `interior-base.png` 压暗、调冷，并在灯笼处保留暖光，约 0.5 秒淡入淡出。这样位置不会有任何偏移。
（单独重新画的夜晚备选图和白天图不是同一幅画，位置有偏差，所以没有直接切换。）
