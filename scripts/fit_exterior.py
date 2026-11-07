"""
Fit a transparent isometric-ish block render onto the 2400x1425 exterior canvas.
  python3 scripts/fit_exterior.py "<input.png>" [--a 0.79] [--cx 895] [--out public/assets/foster/exterior-base.png]

The input's street edge (lower-left) has a different slope than our 2:1 map. We apply a shear that keeps VERTICAL
lines vertical (so buildings do not lean), rotates the street edge to slope 0.5 and the right edge to -0.5, scales
by `a`, and slides it so the café storefront centre (`--cx`, in input px) lands on the template's café storefront.
"""
import argparse
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("--a", type=float, default=0.79)
ap.add_argument("--cx", type=float, default=895.0)
ap.add_argument("--dy", type=float, default=0.0)
ap.add_argument("--dx", type=float, default=0.0)
ap.add_argument("--out", default="public/assets/foster/exterior-base.png")
o = ap.parse_args()

im = Image.open(o.src).convert("RGBA")
alpha = np.asarray(im)[..., 3]
H, W = alpha.shape
low = np.full(W, -1)
for x in range(W):
    c = np.where(alpha[:, x] > 40)[0]
    if len(c):
        low[x] = c.max()
xs = np.arange(int(W * 0.12), int(W * 0.5))
m = low[xs] > 0
s_street, c_street = np.polyfit(xs[m], low[xs][m], 1)  # lower-left street edge: y = s x + c

# direction constraints with vertical preserved: street slope s -> 0.5, right edge slope -0.9 -> -0.5
s_right = -0.9
d = (0.5 + 0.5) / ((s_street - s_right) * 1.0) if False else None
# solve b + s d = .5 a ; b + s_right d = -.5 a   (a = 1)
dd = 1.0 / (s_street - s_right)
bb = 0.5 - s_street * dd
a = o.a
T_STOREFRONT_CENTER_X = 1035.0   # template café storefront centre (canvas px)
T_CURB_C = 663.75                # template curb line: y = 0.5 x + 663.75
tx = T_STOREFRONT_CENTER_X - a * o.cx + o.dx
# y' = a(bb x + dd y) + ty ; curb: y=s x + c  ->  y' = a(bb + dd s) x + a dd c + ty  (slope .5)
ty = T_CURB_C + 0.5 * tx - a * dd * c_street + o.dy
M = np.array([[a, 0, tx], [a * bb, a * dd, ty], [0, 0, 1]])
Mi = np.linalg.inv(M)
out = im.transform((2400, 1425), Image.AFFINE, (Mi[0, 0], Mi[0, 1], Mi[0, 2], Mi[1, 0], Mi[1, 1], Mi[1, 2]), resample=Image.BICUBIC)
out.save(o.out, optimize=True)
print("street edge slope %.3f -> 0.5 | shear b=%.3f d=%.3f | scale %.2f | tx %.0f ty %.0f -> %s" % (s_street, bb, dd, a, tx, ty, o.out))
