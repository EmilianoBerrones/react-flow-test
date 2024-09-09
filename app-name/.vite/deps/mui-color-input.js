import {
  Box_default,
  InputAdornment_default,
  Slider_default
} from "./chunk-XD44UEFG.js";
import {
  Button_default
} from "./chunk-MHTPUENJ.js";
import {
  Popover_default,
  TextField_default
} from "./chunk-ZDNSALER.js";
import "./chunk-ZI52GF4J.js";
import "./chunk-R5JAC35V.js";
import "./chunk-UYG5USFZ.js";
import "./chunk-NG5TYB52.js";
import "./chunk-4C6XUUCV.js";
import "./chunk-STSKKGUF.js";
import "./chunk-GSXCP2JX.js";
import "./chunk-6C2FNHDJ.js";
import "./chunk-MH7K36WG.js";
import "./chunk-DKOYYANP.js";
import "./chunk-T4VMIGJ6.js";
import "./chunk-Z6HUVRV3.js";
import "./chunk-VIFEPOMO.js";
import "./chunk-D26TSY76.js";
import "./chunk-S3LKCIYK.js";
import "./chunk-PHDUSAPY.js";
import {
  require_jsx_runtime,
  styled_default
} from "./chunk-SUOPKVHQ.js";
import "./chunk-KOABQC56.js";
import {
  require_react
} from "./chunk-XRMR5KPY.js";
import {
  __toESM
} from "./chunk-WGAPYIUP.js";

// node_modules/mui-color-input/dist/mui-color-input.es.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var import_react = __toESM(require_react());
var Ht = "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%) /*! @noflip */";
var $t = "linear-gradient(to top, #000000, transparent), linear-gradient(to right, #ffffff, transparent) /*! @noflip */";
var It = {
  Button: styled_default(Button_default)(() => ({
    backgroundSize: "8px 8px",
    backgroundPosition: "0 0, 4px 0, 4px -4px, 0px 4px",
    transition: "none",
    boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
    border: 0,
    borderRadius: 4,
    width: "24px",
    aspectRatio: "1 / 1",
    height: "24px",
    minWidth: 0
  }))
};
var Pt = (r) => {
  const {
    bgColor: e,
    className: t,
    disablePopover: n,
    isBgColorValid: a,
    ...s
  } = r;
  return (0, import_jsx_runtime.jsx)(
    It.Button,
    {
      disableTouchRipple: true,
      style: {
        backgroundColor: a ? e : void 0,
        backgroundImage: a ? void 0 : Ht,
        cursor: n ? "default" : void 0
      },
      className: `MuiColorInput-Button ${t || ""}`,
      variant: "text",
      disableElevation: false,
      ...s
    }
  );
};
var Ft = {
  Container: styled_default("div")(() => ({
    width: 300,
    padding: 8
  }))
};
var Bt = ({
  children: r,
  className: e,
  position: t = "start",
  ...n
}) => (0, import_jsx_runtime.jsx)(
  Popover_default,
  {
    className: `MuiColorInput-Popover ${e || ""}`,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: t === "start" ? "left" : "right"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: t === "start" ? "left" : "right"
    },
    ...n,
    children: (0, import_jsx_runtime.jsx)(Ft.Container, { children: r })
  }
);
var Et = {
  Slider: styled_default(Slider_default, {
    shouldForwardProp: (r) => r !== "$rgbaFrom" && r !== "$rgbaTo"
  })(() => ({
    height: 8,
    "& .MuiSlider-rail": {
      opacity: 1,
      // TODO: find better way for perf
      background: "linear-gradient(to right, rgba(var(--rgb-r), var(--rgb-g), var(--rgb-b), 0) 0%, rgba(var(--rgb-r), var(--rgb-g), var(--rgb-b), 1) 100%)"
    },
    "& .MuiSlider-track": {
      color: "transparent",
      border: 0
    },
    "& .MuiSlider-thumb": {
      backgroundColor: "#ffffff",
      border: "3px solid currentColor"
    }
  }))
};
var Nt = (r) => {
  const { rgbColor: e, style: t, className: n, ...a } = r, s = {
    "--rgb-r": e.r,
    "--rgb-g": e.g,
    "--rgb-b": e.b,
    ...t
  };
  return (0, import_jsx_runtime.jsx)(
    Et.Slider,
    {
      className: `MuiColorInput-AlphaSlider ${n || ""}`,
      style: s,
      ...a
    }
  );
};
var L = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight"
};
var Vt = {
  ArrowUp: {
    type: "hsvV",
    value: 1
  },
  ArrowDown: {
    type: "hsvV",
    value: -1
  },
  ArrowLeft: {
    type: "hsvS",
    value: -1
  },
  ArrowRight: {
    type: "hsvS",
    value: 1
  }
};
function Tt(r) {
  return r === L.up || r === L.down || r === L.left || r === L.right;
}
function W(r, e, t) {
  return Math.max(e, Math.min(r, t));
}
function rt(r) {
  return typeof r == "number";
}
function nt(r, e, t) {
  const n = r.toLocaleString("en", {
    useGrouping: false,
    minimumFractionDigits: e,
    maximumFractionDigits: t
  });
  return Number(n);
}
function Ot(r, e, t) {
  const n = r.getBoundingClientRect(), a = e - n.left, s = t - n.top;
  return {
    x: W(a / n.width, 0, 1),
    y: W(1 - s / n.height, 0, 1)
  };
}
function Dt(r) {
  const e = import_react.default.useRef();
  return e.current = r, import_react.default.useCallback((...t) => {
    var _a;
    return (_a = e.current) == null ? void 0 : _a.call(e, ...t);
  }, []);
}
var st = {
  Space: styled_default("div")(() => ({
    width: "100%",
    height: "180px",
    boxSizing: "border-box",
    outline: 0,
    position: "relative",
    backgroundImage: $t
  })),
  Thumb: styled_default("div")(() => ({
    position: "absolute",
    border: "3px solid #ffffff",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    marginLeft: "-10px /*! @noflip */",
    marginBottom: "-10px /*! @noflip */",
    outline: 0,
    boxSizing: "border-box",
    willChange: "left, bottom",
    transition: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      boxShadow: "0px 0px 0px 4px rgba(255 255 255 / 0.16)"
    },
    "&.MuiColorInput-Thumb-active": {
      boxShadow: "0px 0px 0px 8px rgba(255 255 255 / 0.16)"
    },
    "@media (hover: none)": {
      boxShadow: "none"
    }
  }))
};
var Lt = (r) => {
  const { hsv: e, onChange: t, currentHue: n } = r, a = import_react.default.useRef(false), s = import_react.default.useRef(null), [i, o] = import_react.default.useState(false), l = Dt((p, C) => {
    if (!s.current)
      return;
    const { x: R, y: $ } = Ot(s.current, p, C);
    t({
      s: R,
      v: $
    }), s.current && document.activeElement !== s.current && s.current.focus();
  }), w = import_react.default.useCallback(() => {
    a.current && (a.current = false, o(false));
  }, []), c = import_react.default.useCallback((p) => {
    a.current && l(p.clientX, p.clientY);
  }, []);
  import_react.default.useEffect(() => (document.addEventListener("pointermove", c, false), document.addEventListener("pointerup", w, false), () => {
    document.removeEventListener("pointermove", c, false), document.removeEventListener("pointerup", w, false);
  }), [w, c]);
  const m = (p) => {
    p.preventDefault(), a.current = true, l(p.clientX, p.clientY), o(true);
  }, y = (p) => {
    if (Tt(p.key)) {
      p.preventDefault();
      const { type: C, value: R } = Vt[p.key], $ = p.shiftKey ? 10 : 1, I = C === "hsvS" ? e.s : e.v, N = W(
        I + R * $ * 0.01,
        0,
        1
      );
      o(true), t({
        s: C === "hsvS" ? N : e.s,
        v: C === "hsvV" ? N : e.v
      });
    }
  }, M = e.s * 100, A = e.v * 100;
  return (0, import_jsx_runtime.jsx)(
    st.Space,
    {
      onPointerDown: m,
      ref: s,
      className: "MuiColorInput-ColorSpace",
      style: {
        backgroundColor: `hsl(${n} 100% 50%)`,
        touchAction: "none"
      },
      role: "slider",
      "aria-valuetext": `Saturation ${nt(
        M,
        0,
        0
      )}%, Brightness ${nt(A, 0, 0)}%`,
      onKeyDown: y,
      tabIndex: 0,
      children: (0, import_jsx_runtime.jsx)(
        st.Thumb,
        {
          "aria-label": "Color space thumb",
          className: i ? "MuiColorInput-Thumb-active" : "",
          style: {
            left: `${M}%`,
            bottom: `${A}%`
          }
        }
      )
    }
  );
};
var jt = {
  Slider: styled_default(Slider_default)(() => ({
    height: 8,
    "& .MuiSlider-rail": {
      opacity: 1,
      background: "linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%) /*! @noflip */"
    },
    "& .MuiSlider-track": {
      color: "transparent",
      border: 0
    },
    "& .MuiSlider-thumb": {
      backgroundColor: "#ffffff",
      border: "3px solid currentColor"
    }
  }))
};
var Gt = (r) => {
  const { className: e, ...t } = r;
  return (0, import_jsx_runtime.jsx)(
    jt.Slider,
    {
      className: `MuiColorInput-HueSlider ${e || ""}`,
      ...t
    }
  );
};
function qt(r) {
  return typeof r == "string";
}
function b(r, e) {
  Wt(r) && (r = "100%");
  const t = Kt(r);
  return r = e === 360 ? r : Math.min(e, Math.max(0, parseFloat(r))), t && (r = parseInt(String(r * e), 10) / 100), Math.abs(r - e) < 1e-6 ? 1 : (e === 360 ? r = (r < 0 ? r % e + e : r % e) / parseFloat(String(e)) : r = r % e / parseFloat(String(e)), r);
}
function j(r) {
  return Math.min(1, Math.max(0, r));
}
function Wt(r) {
  return typeof r == "string" && r.indexOf(".") !== -1 && parseFloat(r) === 1;
}
function Kt(r) {
  return typeof r == "string" && r.indexOf("%") !== -1;
}
function gt(r) {
  return r = parseFloat(r), (isNaN(r) || r < 0 || r > 1) && (r = 1), r;
}
function G(r) {
  return Number(r) <= 1 ? `${Number(r) * 100}%` : r;
}
function H(r) {
  return r.length === 1 ? "0" + r : String(r);
}
function Ut(r, e, t) {
  return {
    r: b(r, 255) * 255,
    g: b(e, 255) * 255,
    b: b(t, 255) * 255
  };
}
function at(r, e, t) {
  r = b(r, 255), e = b(e, 255), t = b(t, 255);
  const n = Math.max(r, e, t), a = Math.min(r, e, t);
  let s = 0, i = 0;
  const o = (n + a) / 2;
  if (n === a)
    i = 0, s = 0;
  else {
    const l = n - a;
    switch (i = o > 0.5 ? l / (2 - n - a) : l / (n + a), n) {
      case r:
        s = (e - t) / l + (e < t ? 6 : 0);
        break;
      case e:
        s = (t - r) / l + 2;
        break;
      case t:
        s = (r - e) / l + 4;
        break;
    }
    s /= 6;
  }
  return { h: s, s: i, l: o };
}
function Y(r, e, t) {
  return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? r + (e - r) * (6 * t) : t < 1 / 2 ? e : t < 2 / 3 ? r + (e - r) * (2 / 3 - t) * 6 : r;
}
function zt(r, e, t) {
  let n, a, s;
  if (r = b(r, 360), e = b(e, 100), t = b(t, 100), e === 0)
    a = t, s = t, n = t;
  else {
    const i = t < 0.5 ? t * (1 + e) : t + e - t * e, o = 2 * t - i;
    n = Y(o, i, r + 1 / 3), a = Y(o, i, r), s = Y(o, i, r - 1 / 3);
  }
  return { r: n * 255, g: a * 255, b: s * 255 };
}
function it(r, e, t) {
  r = b(r, 255), e = b(e, 255), t = b(t, 255);
  const n = Math.max(r, e, t), a = Math.min(r, e, t);
  let s = 0;
  const i = n, o = n - a, l = n === 0 ? 0 : o / n;
  if (n === a)
    s = 0;
  else {
    switch (n) {
      case r:
        s = (e - t) / o + (e < t ? 6 : 0);
        break;
      case e:
        s = (t - r) / o + 2;
        break;
      case t:
        s = (r - e) / o + 4;
        break;
    }
    s /= 6;
  }
  return { h: s, s: l, v: i };
}
function Yt(r, e, t) {
  r = b(r, 360) * 6, e = b(e, 100), t = b(t, 100);
  const n = Math.floor(r), a = r - n, s = t * (1 - e), i = t * (1 - a * e), o = t * (1 - (1 - a) * e), l = n % 6, w = [t, i, s, s, o, t][l], c = [o, t, t, i, s, s][l], m = [s, s, o, t, t, i][l];
  return { r: w * 255, g: c * 255, b: m * 255 };
}
function ot(r, e, t, n) {
  const a = [
    H(Math.round(r).toString(16)),
    H(Math.round(e).toString(16)),
    H(Math.round(t).toString(16))
  ];
  return n && a[0].startsWith(a[0].charAt(1)) && a[1].startsWith(a[1].charAt(1)) && a[2].startsWith(a[2].charAt(1)) ? a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0) : a.join("");
}
function Xt(r, e, t, n, a) {
  const s = [
    H(Math.round(r).toString(16)),
    H(Math.round(e).toString(16)),
    H(Math.round(t).toString(16)),
    H(Jt(n))
  ];
  return a && s[0].startsWith(s[0].charAt(1)) && s[1].startsWith(s[1].charAt(1)) && s[2].startsWith(s[2].charAt(1)) && s[3].startsWith(s[3].charAt(1)) ? s[0].charAt(0) + s[1].charAt(0) + s[2].charAt(0) + s[3].charAt(0) : s.join("");
}
function Zt(r, e, t, n) {
  const a = r / 100, s = e / 100, i = t / 100, o = n / 100, l = 255 * (1 - a) * (1 - o), w = 255 * (1 - s) * (1 - o), c = 255 * (1 - i) * (1 - o);
  return { r: l, g: w, b: c };
}
function ht(r, e, t) {
  let n = 1 - r / 255, a = 1 - e / 255, s = 1 - t / 255, i = Math.min(n, a, s);
  return i === 1 ? (n = 0, a = 0, s = 0) : (n = (n - i) / (1 - i) * 100, a = (a - i) / (1 - i) * 100, s = (s - i) / (1 - i) * 100), i *= 100, {
    c: Math.round(n),
    m: Math.round(a),
    y: Math.round(s),
    k: Math.round(i)
  };
}
function Jt(r) {
  return Math.round(parseFloat(r) * 255).toString(16);
}
function ut(r) {
  return v(r) / 255;
}
function v(r) {
  return parseInt(r, 16);
}
function Qt(r) {
  return {
    r: r >> 16,
    g: (r & 65280) >> 8,
    b: r & 255
  };
}
var Z = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
function _t(r) {
  let e = { r: 0, g: 0, b: 0 }, t = 1, n = null, a = null, s = null, i = false, o = false;
  return typeof r == "string" && (r = re(r)), typeof r == "object" && (x(r.r) && x(r.g) && x(r.b) ? (e = Ut(r.r, r.g, r.b), i = true, o = String(r.r).substr(-1) === "%" ? "prgb" : "rgb") : x(r.h) && x(r.s) && x(r.v) ? (n = G(r.s), a = G(r.v), e = Yt(r.h, n, a), i = true, o = "hsv") : x(r.h) && x(r.s) && x(r.l) ? (n = G(r.s), s = G(r.l), e = zt(r.h, n, s), i = true, o = "hsl") : x(r.c) && x(r.m) && x(r.y) && x(r.k) && (e = Zt(r.c, r.m, r.y, r.k), i = true, o = "cmyk"), Object.prototype.hasOwnProperty.call(r, "a") && (t = r.a)), t = gt(t), {
    ok: i,
    format: r.format || o,
    r: Math.min(255, Math.max(e.r, 0)),
    g: Math.min(255, Math.max(e.g, 0)),
    b: Math.min(255, Math.max(e.b, 0)),
    a: t
  };
}
var te = "[-\\+]?\\d+%?";
var ee = "[-\\+]?\\d*\\.\\d+%?";
var k = "(?:" + ee + ")|(?:" + te + ")";
var X = "[\\s|\\(]+(" + k + ")[,|\\s]+(" + k + ")[,|\\s]+(" + k + ")\\s*\\)?";
var q = (
  // eslint-disable-next-line prettier/prettier
  "[\\s|\\(]+(" + k + ")[,|\\s]+(" + k + ")[,|\\s]+(" + k + ")[,|\\s]+(" + k + ")\\s*\\)?"
);
var S = {
  CSS_UNIT: new RegExp(k),
  rgb: new RegExp("rgb" + X),
  rgba: new RegExp("rgba" + q),
  hsl: new RegExp("hsl" + X),
  hsla: new RegExp("hsla" + q),
  hsv: new RegExp("hsv" + X),
  hsva: new RegExp("hsva" + q),
  cmyk: new RegExp("cmyk" + q),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
function re(r) {
  if (r = r.trim().toLowerCase(), r.length === 0)
    return false;
  let e = false;
  if (Z[r])
    r = Z[r], e = true;
  else if (r === "transparent")
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  let t = S.rgb.exec(r);
  return t ? { r: t[1], g: t[2], b: t[3] } : (t = S.rgba.exec(r), t ? { r: t[1], g: t[2], b: t[3], a: t[4] } : (t = S.hsl.exec(r), t ? { h: t[1], s: t[2], l: t[3] } : (t = S.hsla.exec(r), t ? { h: t[1], s: t[2], l: t[3], a: t[4] } : (t = S.hsv.exec(r), t ? { h: t[1], s: t[2], v: t[3] } : (t = S.hsva.exec(r), t ? { h: t[1], s: t[2], v: t[3], a: t[4] } : (t = S.cmyk.exec(r), t ? {
    c: t[1],
    m: t[2],
    y: t[3],
    k: t[4]
  } : (t = S.hex8.exec(r), t ? {
    r: v(t[1]),
    g: v(t[2]),
    b: v(t[3]),
    a: ut(t[4]),
    format: e ? "name" : "hex8"
  } : (t = S.hex6.exec(r), t ? {
    r: v(t[1]),
    g: v(t[2]),
    b: v(t[3]),
    format: e ? "name" : "hex"
  } : (t = S.hex4.exec(r), t ? {
    r: v(t[1] + t[1]),
    g: v(t[2] + t[2]),
    b: v(t[3] + t[3]),
    a: ut(t[4] + t[4]),
    format: e ? "name" : "hex8"
  } : (t = S.hex3.exec(r), t ? {
    r: v(t[1] + t[1]),
    g: v(t[2] + t[2]),
    b: v(t[3] + t[3]),
    format: e ? "name" : "hex"
  } : false))))))))));
}
function x(r) {
  return typeof r == "number" ? !Number.isNaN(r) : S.CSS_UNIT.test(r);
}
var h = class _h {
  constructor(e = "", t = {}) {
    if (e instanceof _h)
      return e;
    typeof e == "number" && (e = Qt(e)), this.originalInput = e;
    const n = _t(e);
    this.originalInput = e, this.r = n.r, this.g = n.g, this.b = n.b, this.a = n.a, this.roundA = Math.round(100 * this.a) / 100, this.format = t.format ?? n.format, this.gradientType = t.gradientType, this.r < 1 && (this.r = Math.round(this.r)), this.g < 1 && (this.g = Math.round(this.g)), this.b < 1 && (this.b = Math.round(this.b)), this.isValid = n.ok;
  }
  isDark() {
    return this.getBrightness() < 128;
  }
  isLight() {
    return !this.isDark();
  }
  /**
   * Returns the perceived brightness of the color, from 0-255.
   */
  getBrightness() {
    const e = this.toRgb();
    return (e.r * 299 + e.g * 587 + e.b * 114) / 1e3;
  }
  /**
   * Returns the perceived luminance of a color, from 0-1.
   */
  getLuminance() {
    const e = this.toRgb();
    let t, n, a;
    const s = e.r / 255, i = e.g / 255, o = e.b / 255;
    return s <= 0.03928 ? t = s / 12.92 : t = Math.pow((s + 0.055) / 1.055, 2.4), i <= 0.03928 ? n = i / 12.92 : n = Math.pow((i + 0.055) / 1.055, 2.4), o <= 0.03928 ? a = o / 12.92 : a = Math.pow((o + 0.055) / 1.055, 2.4), 0.2126 * t + 0.7152 * n + 0.0722 * a;
  }
  /**
   * Returns the alpha value of a color, from 0-1.
   */
  getAlpha() {
    return this.a;
  }
  /**
   * Sets the alpha value on the current color.
   *
   * @param alpha - The new alpha value. The accepted range is 0-1.
   */
  setAlpha(e) {
    return this.a = gt(e), this.roundA = Math.round(100 * this.a) / 100, this;
  }
  /**
   * Returns whether the color is monochrome.
   */
  isMonochrome() {
    const { s: e } = this.toHsl();
    return e === 0;
  }
  /**
   * Returns the object as a HSVA object.
   */
  toHsv() {
    const e = it(this.r, this.g, this.b);
    return { h: e.h * 360, s: e.s, v: e.v, a: this.a };
  }
  /**
   * Returns the hsva values interpolated into a string with the following format:
   * "hsva(xxx, xxx, xxx, xx)".
   */
  toHsvString() {
    const e = it(this.r, this.g, this.b), t = Math.round(e.h * 360), n = Math.round(e.s * 100), a = Math.round(e.v * 100);
    return this.a === 1 ? `hsv(${t}, ${n}%, ${a}%)` : `hsva(${t}, ${n}%, ${a}%, ${this.roundA})`;
  }
  /**
   * Returns the object as a HSLA object.
   */
  toHsl() {
    const e = at(this.r, this.g, this.b);
    return { h: e.h * 360, s: e.s, l: e.l, a: this.a };
  }
  /**
   * Returns the hsla values interpolated into a string with the following format:
   * "hsla(xxx, xxx, xxx, xx)".
   */
  toHslString() {
    const e = at(this.r, this.g, this.b), t = Math.round(e.h * 360), n = Math.round(e.s * 100), a = Math.round(e.l * 100);
    return this.a === 1 ? `hsl(${t}, ${n}%, ${a}%)` : `hsla(${t}, ${n}%, ${a}%, ${this.roundA})`;
  }
  /**
   * Returns the hex value of the color.
   * @param allow3Char will shorten hex value to 3 char if possible
   */
  toHex(e = false) {
    return ot(this.r, this.g, this.b, e);
  }
  /**
   * Returns the hex value of the color -with a # prefixed.
   * @param allow3Char will shorten hex value to 3 char if possible
   */
  toHexString(e = false) {
    return "#" + this.toHex(e);
  }
  /**
   * Returns the hex 8 value of the color.
   * @param allow4Char will shorten hex value to 4 char if possible
   */
  toHex8(e = false) {
    return Xt(this.r, this.g, this.b, this.a, e);
  }
  /**
   * Returns the hex 8 value of the color -with a # prefixed.
   * @param allow4Char will shorten hex value to 4 char if possible
   */
  toHex8String(e = false) {
    return "#" + this.toHex8(e);
  }
  /**
   * Returns the shorter hex value of the color depends on its alpha -with a # prefixed.
   * @param allowShortChar will shorten hex value to 3 or 4 char if possible
   */
  toHexShortString(e = false) {
    return this.a === 1 ? this.toHexString(e) : this.toHex8String(e);
  }
  /**
   * Returns the object as a RGBA object.
   */
  toRgb() {
    return {
      r: Math.round(this.r),
      g: Math.round(this.g),
      b: Math.round(this.b),
      a: this.a
    };
  }
  /**
   * Returns the RGBA values interpolated into a string with the following format:
   * "RGBA(xxx, xxx, xxx, xx)".
   */
  toRgbString() {
    const e = Math.round(this.r), t = Math.round(this.g), n = Math.round(this.b);
    return this.a === 1 ? `rgb(${e}, ${t}, ${n})` : `rgba(${e}, ${t}, ${n}, ${this.roundA})`;
  }
  /**
   * Returns the object as a RGBA object.
   */
  toPercentageRgb() {
    const e = (t) => `${Math.round(b(t, 255) * 100)}%`;
    return {
      r: e(this.r),
      g: e(this.g),
      b: e(this.b),
      a: this.a
    };
  }
  /**
   * Returns the RGBA relative values interpolated into a string
   */
  toPercentageRgbString() {
    const e = (t) => Math.round(b(t, 255) * 100);
    return this.a === 1 ? `rgb(${e(this.r)}%, ${e(this.g)}%, ${e(this.b)}%)` : `rgba(${e(this.r)}%, ${e(this.g)}%, ${e(this.b)}%, ${this.roundA})`;
  }
  toCmyk() {
    return {
      ...ht(this.r, this.g, this.b)
    };
  }
  toCmykString() {
    const { c: e, m: t, y: n, k: a } = ht(this.r, this.g, this.b);
    return `cmyk(${e}, ${t}, ${n}, ${a})`;
  }
  /**
   * The 'real' name of the color -if there is one.
   */
  toName() {
    if (this.a === 0)
      return "transparent";
    if (this.a < 1)
      return false;
    const e = "#" + ot(this.r, this.g, this.b, false);
    for (const [t, n] of Object.entries(Z))
      if (e === n)
        return t;
    return false;
  }
  toString(e) {
    const t = !!e;
    e = e ?? this.format;
    let n = false;
    const a = this.a < 1 && this.a >= 0;
    return !t && a && (e.startsWith("hex") || e === "name") ? e === "name" && this.a === 0 ? this.toName() : this.toRgbString() : (e === "rgb" && (n = this.toRgbString()), e === "prgb" && (n = this.toPercentageRgbString()), (e === "hex" || e === "hex6") && (n = this.toHexString()), e === "hex3" && (n = this.toHexString(true)), e === "hex4" && (n = this.toHex8String(true)), e === "hex8" && (n = this.toHex8String()), e === "name" && (n = this.toName()), e === "hsl" && (n = this.toHslString()), e === "hsv" && (n = this.toHsvString()), e === "cmyk" && (n = this.toCmykString()), n || this.toHexString());
  }
  toNumber() {
    return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
  }
  clone() {
    return new _h(this.toString());
  }
  /**
   * Lighten the color a given amount. Providing 100 will always return white.
   * @param amount - valid between 1-100
   */
  lighten(e = 10) {
    const t = this.toHsl();
    return t.l += e / 100, t.l = j(t.l), new _h(t);
  }
  /**
   * Brighten the color a given amount, from 0 to 100.
   * @param amount - valid between 1-100
   */
  brighten(e = 10) {
    const t = this.toRgb();
    return t.r = Math.max(0, Math.min(255, t.r - Math.round(255 * -(e / 100)))), t.g = Math.max(0, Math.min(255, t.g - Math.round(255 * -(e / 100)))), t.b = Math.max(0, Math.min(255, t.b - Math.round(255 * -(e / 100)))), new _h(t);
  }
  /**
   * Darken the color a given amount, from 0 to 100.
   * Providing 100 will always return black.
   * @param amount - valid between 1-100
   */
  darken(e = 10) {
    const t = this.toHsl();
    return t.l -= e / 100, t.l = j(t.l), new _h(t);
  }
  /**
   * Mix the color with pure white, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return white.
   * @param amount - valid between 1-100
   */
  tint(e = 10) {
    return this.mix("white", e);
  }
  /**
   * Mix the color with pure black, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return black.
   * @param amount - valid between 1-100
   */
  shade(e = 10) {
    return this.mix("black", e);
  }
  /**
   * Desaturate the color a given amount, from 0 to 100.
   * Providing 100 will is the same as calling greyscale
   * @param amount - valid between 1-100
   */
  desaturate(e = 10) {
    const t = this.toHsl();
    return t.s -= e / 100, t.s = j(t.s), new _h(t);
  }
  /**
   * Saturate the color a given amount, from 0 to 100.
   * @param amount - valid between 1-100
   */
  saturate(e = 10) {
    const t = this.toHsl();
    return t.s += e / 100, t.s = j(t.s), new _h(t);
  }
  /**
   * Completely desaturates a color into greyscale.
   * Same as calling `desaturate(100)`
   */
  greyscale() {
    return this.desaturate(100);
  }
  /**
   * Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
   * Values outside of this range will be wrapped into this range.
   */
  spin(e) {
    const t = this.toHsl(), n = (t.h + e) % 360;
    return t.h = n < 0 ? 360 + n : n, new _h(t);
  }
  /**
   * Mix the current color a given amount with another color, from 0 to 100.
   * 0 means no mixing (return current color).
   */
  mix(e, t = 50) {
    const n = this.toRgb(), a = new _h(e).toRgb(), s = t / 100, i = {
      r: (a.r - n.r) * s + n.r,
      g: (a.g - n.g) * s + n.g,
      b: (a.b - n.b) * s + n.b,
      a: (a.a - n.a) * s + n.a
    };
    return new _h(i);
  }
  analogous(e = 6, t = 30) {
    const n = this.toHsl(), a = 360 / t, s = [this];
    for (n.h = (n.h - (a * e >> 1) + 720) % 360; --e; )
      n.h = (n.h + a) % 360, s.push(new _h(n));
    return s;
  }
  /**
   * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
   */
  complement() {
    const e = this.toHsl();
    return e.h = (e.h + 180) % 360, new _h(e);
  }
  monochromatic(e = 6) {
    const t = this.toHsv(), { h: n } = t, { s: a } = t;
    let { v: s } = t;
    const i = [], o = 1 / e;
    for (; e--; )
      i.push(new _h({ h: n, s: a, v: s })), s = (s + o) % 1;
    return i;
  }
  splitcomplement() {
    const e = this.toHsl(), { h: t } = e;
    return [
      this,
      new _h({ h: (t + 72) % 360, s: e.s, l: e.l }),
      new _h({ h: (t + 216) % 360, s: e.s, l: e.l })
    ];
  }
  /**
   * Compute how the color would appear on a background
   */
  onBackground(e) {
    const t = this.toRgb(), n = new _h(e).toRgb(), a = t.a + n.a * (1 - t.a);
    return new _h({
      r: (t.r * t.a + n.r * n.a * (1 - t.a)) / a,
      g: (t.g * t.a + n.g * n.a * (1 - t.a)) / a,
      b: (t.b * t.a + n.b * n.a * (1 - t.a)) / a,
      a
    });
  }
  /**
   * Alias for `polyad(3)`
   */
  triad() {
    return this.polyad(3);
  }
  /**
   * Alias for `polyad(4)`
   */
  tetrad() {
    return this.polyad(4);
  }
  /**
   * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
   * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
   */
  polyad(e) {
    const t = this.toHsl(), { h: n } = t, a = [this], s = 360 / e;
    for (let i = 1; i < e; i++)
      a.push(new _h({ h: (n + i * s) % 360, s: t.s, l: t.l }));
    return a;
  }
  /**
   * compare color vs current color
   */
  equals(e) {
    const t = new _h(e);
    return this.format === "cmyk" || t.format === "cmyk" ? this.toCmykString() === t.toCmykString() : this.toRgbString() === t.toRgbString();
  }
};
function B(r, e) {
  return r.isValid ? r.toString(e) : r.originalInput.toString();
}
function lt(r, e) {
  return new h(r, e);
}
function ne(r) {
  return qt(r) ? r : new h(r).toString();
}
var se = (r) => {
  const { currentColor: e, format: t, onChange: n, isAlphaHidden: a } = r, [s, i] = import_react.default.useState(
    e.toHsv()
  ), o = (c, m) => {
    if (!rt(m))
      return;
    const y = W(360 * m / 100, 0, 359);
    i((A) => ({
      ...A,
      h: y
    }));
    const M = new h({
      ...s,
      a: e.toHsv().a,
      h: y
    });
    n == null ? void 0 : n(B(M, t));
  }, l = (c, m) => {
    if (!rt(m))
      return;
    const y = e.clone().setAlpha(m);
    n == null ? void 0 : n(B(y, t));
  }, w = ({ s: c, v: m }) => {
    const y = new h({
      h: s.h,
      a: e.toHsv().a,
      s: c,
      v: m
    });
    i((M) => ({
      ...M,
      s: c,
      v: m
    })), n == null ? void 0 : n(B(y, t));
  };
  return (0, import_jsx_runtime.jsxs)(Box_default, { className: "MuiColorInput-PopoverBody", children: [
    (0, import_jsx_runtime.jsx)(
      Lt,
      {
        currentHue: s.h,
        hsv: s,
        onChange: w
      }
    ),
    (0, import_jsx_runtime.jsx)(Box_default, { mt: "10px", px: "3px", children: (0, import_jsx_runtime.jsx)(
      Gt,
      {
        min: 0,
        max: 100,
        step: 1,
        onChange: o,
        "aria-label": "hue",
        value: s.h * 100 / 360
      }
    ) }),
    a ? null : (0, import_jsx_runtime.jsx)(Box_default, { mt: "10px", px: "3px", children: (0, import_jsx_runtime.jsx)(
      Nt,
      {
        min: 0,
        max: 1,
        step: 0.01,
        "aria-label": "alpha",
        rgbColor: e.toRgb(),
        onChange: l,
        value: e.getAlpha()
      }
    ) })
  ] });
};
var ae = import_react.default.forwardRef(
  (r, e) => {
    const { className: t, ...n } = r;
    return (0, import_jsx_runtime.jsx)(
      TextField_default,
      {
        className: `MuiColorInput-TextField ${t || ""}`,
        ref: e,
        ...n
      }
    );
  }
);
var ie = "rgb";
function oe(r) {
  return typeof r == "object" && !Array.isArray(r) && r !== null;
}
function ft(r, e) {
  typeof e == "function" ? e(r) : e && oe(e) && "current" in e && (e.current = r);
}
function me(r) {
  return new h(r).isValid;
}
var xe = import_react.default.forwardRef(
  (r, e) => {
    const {
      value: t,
      format: n,
      onChange: a,
      adornmentPosition: s = "start",
      PopoverProps: i,
      Adornment: o = Pt,
      fallbackValue: l,
      isAlphaHidden: w,
      disablePopover: c,
      ...m
    } = r, { onBlur: y, InputProps: M, ...A } = m, { onClose: p, ...C } = i || {}, R = A.disabled || (M == null ? void 0 : M.disabled) || false, $ = import_react.default.useRef(null), I = import_react.default.useRef(null), [N, J] = import_react.default.useState(null), P = n || ie, K = lt(t, {
      format: P
    }), [O, V] = import_react.default.useState(t), [Q, T] = import_react.default.useState(t), bt = (u) => {
      u.preventDefault(), u.stopPropagation(), !R && !c && J($.current);
    }, D = (u) => {
      const f = new h(u);
      a == null ? void 0 : a(u, {
        hex: f.isValid ? f.toHexString() : "",
        hsv: f.isValid ? f.toHsvString() : "",
        hsl: f.isValid ? f.toHslString() : "",
        rgb: f.isValid ? f.toRgbString() : "",
        hex8: f.isValid ? f.toHex8String() : ""
      });
    }, pt = (u) => {
      const f = u.target.value;
      if (V(f), f === "")
        T(""), D("");
      else {
        const U = new h(f), F = B(U, P);
        T(F), D(F);
      }
    }, mt = (...u) => {
      p == null ? void 0 : p(...u), J(null), queueMicrotask(() => {
        var _a;
        (_a = I.current) == null ? void 0 : _a.focus();
      });
    }, xt = (u) => {
      y == null ? void 0 : y(u);
      const f = new h(O);
      if (f.isValid)
        f.format !== P && V(
          B(f, P)
        );
      else {
        if (O === "")
          return;
        if (l) {
          const U = new h(l), F = B(U, P);
          V(F), T(F), D(F);
        }
      }
    };
    import_react.default.useEffect(() => {
      if (t !== Q) {
        const f = lt(t).originalInput;
        T(f), V(f);
      }
    }, [t, Q]);
    const vt = (u) => {
      V(u), T(u), D(u);
    }, St = (u) => {
      $.current = u, e && ft(u, e);
    }, wt = (u) => {
      I.current = u, I && ft(u, I);
    }, _ = !!N, tt = _ ? "color-popover" : void 0, et = (0, import_jsx_runtime.jsx)(InputAdornment_default, { position: s, children: (0, import_jsx_runtime.jsx)(
      o,
      {
        disabled: R,
        "aria-describedby": tt,
        disablePopover: c || false,
        component: c ? "span" : void 0,
        bgColor: K.toString(),
        isBgColorValid: !!(O !== "" && K.isValid),
        onClick: c ? void 0 : bt
      }
    ) }), yt = s === "start" ? {
      startAdornment: et
    } : {
      endAdornment: et
    };
    return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      (0, import_jsx_runtime.jsx)(
        ae,
        {
          ref: St,
          spellCheck: "false",
          type: "text",
          autoComplete: "off",
          onChange: pt,
          value: ne(O),
          onBlur: xt,
          inputRef: wt,
          disabled: R,
          InputProps: {
            ...yt,
            ...M
          },
          ...A
        }
      ),
      c ? null : (0, import_jsx_runtime.jsx)(
        Bt,
        {
          id: tt,
          open: _,
          position: s,
          anchorEl: N,
          onClose: mt,
          ...C,
          children: (0, import_jsx_runtime.jsx)(
            se,
            {
              onChange: vt,
              currentColor: K,
              format: P,
              isAlphaHidden: w
            }
          )
        }
      )
    ] });
  }
);
export {
  xe as MuiColorInput,
  me as matchIsValidColor
};
//# sourceMappingURL=mui-color-input.js.map
