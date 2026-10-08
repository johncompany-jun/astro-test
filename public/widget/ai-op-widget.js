/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis, nt = J.ShadowRoot && (J.ShadyCSS === void 0 || J.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ot = Symbol(), ht = /* @__PURE__ */ new WeakMap();
let Pt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== ot) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (nt && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = ht.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && ht.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Bt = (s) => new Pt(typeof s == "string" ? s : s + "", void 0, ot), B = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, r, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[n + 1], s[0]);
  return new Pt(e, s, ot);
}, Ft = (s, t) => {
  if (nt) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = J.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, dt = nt ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Bt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Wt, defineProperty: qt, getOwnPropertyDescriptor: Jt, getOwnPropertyNames: Kt, getOwnPropertySymbols: Gt, getPrototypeOf: Yt } = Object, k = globalThis, ut = k.trustedTypes, Zt = ut ? ut.emptyScript : "", tt = k.reactiveElementPolyfillSupport, D = (s, t) => s, K = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Zt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, at = (s, t) => !Wt(s, t), pt = { attribute: !0, type: String, converter: K, reflect: !1, useDefault: !1, hasChanged: at };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), k.litPropertyMetadata ?? (k.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let R = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = pt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && qt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: n } = Jt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const l = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? pt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(D("elementProperties"))) return;
    const t = Yt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(D("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(D("properties"))) {
      const e = this.properties, i = [...Kt(e), ...Gt(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(dt(r));
    } else t !== void 0 && e.push(dt(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ft(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var n;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : K).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = i.getPropertyOptions(r), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : K;
      this._$Em = r;
      const c = a.fromAttribute(e, l.type);
      this[r] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, n) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (n = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? at)(n, e) || i.useDefault && i.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: n }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) {
        const { wrapped: l } = o, a = this[n];
        l !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
R.elementStyles = [], R.shadowRootOptions = { mode: "open" }, R[D("elementProperties")] = /* @__PURE__ */ new Map(), R[D("finalized")] = /* @__PURE__ */ new Map(), tt == null || tt({ ReactiveElement: R }), (k.reactiveElementVersions ?? (k.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, ft = (s) => s, G = L.trustedTypes, mt = G ? G.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, It = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, Mt = "?" + x, Xt = `<${Mt}>`, O = document, z = () => O.createComment(""), V = (s) => s === null || typeof s != "object" && typeof s != "function", lt = Array.isArray, Qt = (s) => lt(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", et = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, gt = /-->/g, yt = />/g, P = RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), bt = /'/g, vt = /"/g, Ot = /^(?:script|style|textarea|title)$/i, Rt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), u = Rt(1), C = Rt(2), H = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), $t = /* @__PURE__ */ new WeakMap(), I = O.createTreeWalker(O, 129);
function Ht(s, t) {
  if (!lt(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return mt !== void 0 ? mt.createHTML(t) : t;
}
const te = (s, t) => {
  const e = s.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = N;
  for (let l = 0; l < e; l++) {
    const a = s[l];
    let c, p, h = -1, b = 0;
    for (; b < a.length && (o.lastIndex = b, p = o.exec(a), p !== null); ) b = o.lastIndex, o === N ? p[1] === "!--" ? o = gt : p[1] !== void 0 ? o = yt : p[2] !== void 0 ? (Ot.test(p[2]) && (r = RegExp("</" + p[2], "g")), o = P) : p[3] !== void 0 && (o = P) : o === P ? p[0] === ">" ? (o = r ?? N, h = -1) : p[1] === void 0 ? h = -2 : (h = o.lastIndex - p[2].length, c = p[1], o = p[3] === void 0 ? P : p[3] === '"' ? vt : bt) : o === vt || o === bt ? o = P : o === gt || o === yt ? o = N : (o = P, r = void 0);
    const S = o === P && s[l + 1].startsWith("/>") ? " " : "";
    n += o === N ? a + Xt : h >= 0 ? (i.push(c), a.slice(0, h) + It + a.slice(h) + x + S) : a + x + (h === -2 ? l : S);
  }
  return [Ht(s, n + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class j {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [c, p] = te(t, e);
    if (this.el = j.createElement(c, i), I.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = I.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(It)) {
          const b = p[o++], S = r.getAttribute(h).split(x), E = /([.?@])?(.*)/.exec(b);
          a.push({ type: 1, index: n, name: E[2], strings: S, ctor: E[1] === "." ? se : E[1] === "?" ? ie : E[1] === "@" ? re : X }), r.removeAttribute(h);
        } else h.startsWith(x) && (a.push({ type: 6, index: n }), r.removeAttribute(h));
        if (Ot.test(r.tagName)) {
          const h = r.textContent.split(x), b = h.length - 1;
          if (b > 0) {
            r.textContent = G ? G.emptyScript : "";
            for (let S = 0; S < b; S++) r.append(h[S], z()), I.nextNode(), a.push({ type: 2, index: ++n });
            r.append(h[b], z());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Mt) a.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(x, h + 1)) !== -1; ) a.push({ type: 7, index: n }), h += x.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = O.createElement("template");
    return i.innerHTML = t, i;
  }
}
function U(s, t, e = s, i) {
  var o, l;
  if (t === H) return t;
  let r = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const n = V(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), n === void 0 ? r = void 0 : (r = new n(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = U(s, r._$AS(s, t.values), r, i)), t;
}
class ee {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? O).importNode(e, !0);
    I.currentNode = r;
    let n = I.nextNode(), o = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new F(n, n.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (c = new ne(n, this, t)), this._$AV.push(c), a = i[++l];
      }
      o !== (a == null ? void 0 : a.index) && (n = I.nextNode(), o++);
    }
    return I.currentNode = O, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class F {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = U(this, t, e), V(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== H && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Qt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && V(this._$AH) ? this._$AA.nextSibling.data = t : this.T(O.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = j.createElement(Ht(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(e);
    else {
      const o = new ee(r, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = $t.get(t.strings);
    return e === void 0 && $t.set(t.strings, e = new j(t)), e;
  }
  k(t) {
    lt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const n of t) r === e.length ? e.push(i = new F(this.O(z()), this.O(z()), this, this.options)) : i = e[r], i._$AI(n), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = ft(t).nextSibling;
      ft(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class X {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(t, e = this, i, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = U(this, t, e, 0), o = !V(t) || t !== this._$AH && t !== H, o && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = n[0], a = 0; a < n.length - 1; a++) c = U(this, l[i + a], e, a), c === H && (c = this._$AH[a]), o || (o = !V(c) || c !== this._$AH[a]), c === d ? t = d : t !== d && (t += (c ?? "") + n[a + 1]), this._$AH[a] = c;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class se extends X {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class ie extends X {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class re extends X {
  constructor(t, e, i, r, n) {
    super(t, e, i, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = U(this, t, e, 0) ?? d) === H) return;
    const i = this._$AH, r = t === d && i !== d || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== d && (i === d || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ne {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    U(this, t);
  }
}
const st = L.litHtmlPolyfillSupport;
st == null || st(j, F), (L.litHtmlVersions ?? (L.litHtmlVersions = [])).push("3.3.3");
const oe = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new F(t.insertBefore(z(), n), n, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis;
class A extends R {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = oe(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return H;
  }
}
var Ct;
A._$litElement$ = !0, A.finalized = !0, (Ct = M.litElementHydrateSupport) == null || Ct.call(M, { LitElement: A });
const it = M.litElementPolyfillSupport;
it == null || it({ LitElement: A });
(M.litElementVersions ?? (M.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ae = { attribute: !0, type: String, converter: K, reflect: !1, hasChanged: at }, le = (s = ae, t, e) => {
  const { kind: i, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), n.set(e.name, s), i === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function m(s) {
  return (t, e) => typeof e == "object" ? le(s, t, e) : ((i, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(s) {
  return m({ ...s, state: !0, attribute: !1 });
}
const Ut = C`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true">
    <path fill="currentColor" d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/>
  </svg>
`, ce = C`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
    <path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM152 96h16c13.3 0 24 10.7 24 24v16c0 13.3-10.7 24-24 24H152c-13.3 0-24-10.7-24-24V120c0-13.3 10.7-24 24-24zm88 24c0-13.3 10.7-24 24-24h16c13.3 0 24 10.7 24 24v16c0 13.3-10.7 24-24 24H264c-13.3 0-24-10.7-24-24V120zM376 96h16c13.3 0 24 10.7 24 24v16c0 13.3-10.7 24-24 24H376c-13.3 0-24-10.7-24-24V120c0-13.3 10.7-24 24-24zm-256 88h16c13.3 0 24 10.7 24 24v16c0 13.3-10.7 24-24 24H120c-13.3 0-24-10.7-24-24V208c0-13.3 10.7-24 24-24zm88 24c0-13.3 10.7-24 24-24h16c13.3 0 24 10.7 24 24v16c0 13.3-10.7 24-24 24H232c-13.3 0-24-10.7-24-24V208zM344 184h16c13.3 0 24 10.7 24 24v16c0 13.3-10.7 24-24 24H344c-13.3 0-24-10.7-24-24V208c0-13.3 10.7-24 24-24zm112 24c0-13.3 10.7-24 24-24h16c13.3 0 24 10.7 24 24v16c0 13.3-10.7 24-24 24H480c-13.3 0-24-10.7-24-24V208zM160 336c0-8.8 7.2-16 16-16H400c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V336z"/>
  </svg>
`, he = C`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true">
    <path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM192 160H320c17.7 0 32 14.3 32 32V320c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V192c0-17.7 14.3-32 32-32z"/>
  </svg>
`, de = C`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" aria-hidden="true">
    <path fill="currentColor" d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-6.9-10.7-15.2-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"/>
  </svg>
`, ue = C`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true">
    <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
  </svg>
`, pe = C`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true">
    <path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
  </svg>
`, fe = C`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true">
    <path fill="currentColor" d="M228.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C76.1 30.2 64 46 64 64C64 311.4 264.6 512 512 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L368.7 368C298.3 334.7 241.3 277.7 208 207.3L257.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96zM48 448c-8.8 0-16-7.2-16-16s7.2-16 16-16H144c8.8 0 16 7.2 16 16s-7.2 16-16 16H48z" transform="rotate(135, 256, 256)"/>
  </svg>
`;
C`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true">
    <path fill="currentColor" d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96z"/>
  </svg>
`;
const me = 500, ge = 2e3;
class ye {
  constructor(t) {
    this.deps = t, this.state = {
      phase: "idle",
      callId: null,
      error: null,
      muted: !1,
      durationSeconds: 0
    }, this.listeners = /* @__PURE__ */ new Set(), this.pc = null, this.localStream = null, this.remoteAudio = null, this.signalPollTimer = null, this.statusPollTimer = null, this.durationTimer = null, this.offerSent = !1, this.connectedAt = null;
  }
  get snapshot() {
    return this.state;
  }
  subscribe(t) {
    return this.listeners.add(t), t(this.state), () => this.listeners.delete(t);
  }
  attachAudioSink(t) {
    this.remoteAudio = t;
  }
  async start() {
    if (!(this.state.phase !== "idle" && this.state.phase !== "ended" && this.state.phase !== "failed")) {
      this.reset(), this.update({ phase: "requesting", error: null });
      try {
        const t = await this.deps.api.requestCall(
          this.deps.anonymousId,
          this.deps.threadId,
          this.deps.targetStaffId ?? null
        );
        this.update({ callId: t.id, phase: "ringing" }), this.startStatusPolling(t.id);
      } catch (t) {
        this.fail(this.messageOf(t, "通話リクエストに失敗しました"));
      }
    }
  }
  toggleMute() {
    if (!this.localStream) return;
    const t = !this.state.muted;
    for (const e of this.localStream.getAudioTracks())
      e.enabled = !t;
    this.update({ muted: t });
  }
  async hangup() {
    const t = this.state.callId;
    if (this.stopTimers(), this.teardownPeer(), t)
      try {
        await this.deps.api.endCall(t, this.deps.anonymousId);
      } catch {
      }
    this.update({ phase: "ended" });
  }
  destroy() {
    this.stopTimers(), this.teardownPeer(), this.listeners.clear();
  }
  // ─────────────────────────────────────────────────────────
  // Internal
  // ─────────────────────────────────────────────────────────
  startStatusPolling(t) {
    this.statusPollTimer = setInterval(async () => {
      try {
        const e = await this.deps.api.callStatus(this.deps.anonymousId, t);
        e.status === "accepted" ? (this.stopStatusPolling(), this.beginPeerConnection(t)) : e.status === "rejected" || e.status === "timeout" ? (this.stopStatusPolling(), this.fail(e.status === "timeout" ? "応答がありませんでした" : "通話が拒否されました")) : e.status === "ended" && (this.stopStatusPolling(), this.update({ phase: "ended" }));
      } catch (e) {
        this.stopStatusPolling(), this.fail(this.messageOf(e, "通話状態の取得に失敗しました"));
      }
    }, ge);
  }
  stopStatusPolling() {
    this.statusPollTimer !== null && (clearInterval(this.statusPollTimer), this.statusPollTimer = null);
  }
  async beginPeerConnection(t) {
    this.update({ phase: "connecting" });
    try {
      const e = await this.deps.api.callTurnConfig(this.deps.anonymousId, t), i = be(e.iceServers);
      this.pc = new RTCPeerConnection({ iceServers: i }), this.pc.onicecandidate = (r) => {
        r.candidate && this.deps.api.publishCallSignal(t, this.deps.anonymousId, "ice", {
          candidate: r.candidate.toJSON()
        });
      }, this.pc.ontrack = (r) => {
        const [n] = r.streams;
        this.remoteAudio && n && (this.remoteAudio.srcObject = n, this.remoteAudio.play().catch(() => {
        }));
      }, this.pc.oniceconnectionstatechange = () => {
        var n;
        const r = (n = this.pc) == null ? void 0 : n.iceConnectionState;
        r === "connected" || r === "completed" ? (this.connectedAt === null && (this.connectedAt = Date.now(), this.startDurationTimer()), this.update({ phase: "connected" })) : (r === "failed" || r === "disconnected" || r === "closed") && r === "failed" && this.fail("接続が失敗しました");
      }, this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: !0, noiseSuppression: !0 },
        video: !1
      });
      for (const r of this.localStream.getTracks())
        this.pc.addTrack(r, this.localStream);
      this.startSignalPolling(t);
    } catch (e) {
      this.fail(this.messageOf(e, "通話の初期化に失敗しました"));
    }
  }
  startSignalPolling(t) {
    this.signalPollTimer = setInterval(async () => {
      try {
        const e = await this.deps.api.pollCallSignals(t, this.deps.anonymousId);
        for (const i of e.signals)
          await this.handleIncomingSignal(t, i);
      } catch {
      }
    }, me);
  }
  async handleIncomingSignal(t, e) {
    if (this.pc)
      if (e.kind === "ready" && !this.offerSent) {
        this.offerSent = !0;
        const i = await this.pc.createOffer();
        await this.pc.setLocalDescription(i), await this.deps.api.publishCallSignal(t, this.deps.anonymousId, "offer", {
          type: i.type,
          sdp: i.sdp
        });
      } else if (e.kind === "answer") {
        const i = e.payload ?? {}, r = i.type ?? "answer", n = i.sdp;
        n && await this.pc.setRemoteDescription({ type: r, sdp: n });
      } else if (e.kind === "ice") {
        const r = (e.payload ?? {}).candidate;
        if (r)
          try {
            await this.pc.addIceCandidate(r);
          } catch {
          }
      } else e.kind === "end" && (this.stopSignalPolling(), this.teardownPeer(), this.update({ phase: "ended" }));
  }
  stopSignalPolling() {
    this.signalPollTimer !== null && (clearInterval(this.signalPollTimer), this.signalPollTimer = null);
  }
  startDurationTimer() {
    this.durationTimer = setInterval(() => {
      if (this.connectedAt === null) return;
      const t = Math.floor((Date.now() - this.connectedAt) / 1e3);
      this.update({ durationSeconds: t });
    }, 1e3);
  }
  stopDurationTimer() {
    this.durationTimer !== null && (clearInterval(this.durationTimer), this.durationTimer = null);
  }
  stopTimers() {
    this.stopStatusPolling(), this.stopSignalPolling(), this.stopDurationTimer();
  }
  teardownPeer() {
    if (this.pc) {
      this.pc.onicecandidate = null, this.pc.ontrack = null, this.pc.oniceconnectionstatechange = null;
      try {
        this.pc.close();
      } catch {
      }
      this.pc = null;
    }
    if (this.localStream) {
      for (const t of this.localStream.getTracks())
        try {
          t.stop();
        } catch {
        }
      this.localStream = null;
    }
    this.remoteAudio && (this.remoteAudio.srcObject = null), this.connectedAt = null, this.offerSent = !1;
  }
  reset() {
    this.stopTimers(), this.teardownPeer(), this.state = {
      phase: "idle",
      callId: null,
      error: null,
      muted: !1,
      durationSeconds: 0
    };
  }
  fail(t) {
    this.stopTimers(), this.teardownPeer(), this.update({ phase: "failed", error: t });
  }
  update(t) {
    this.state = { ...this.state, ...t };
    for (const e of this.listeners) e(this.state);
  }
  messageOf(t, e) {
    return t instanceof Error && t.message ? t.message : e;
  }
}
function be(s) {
  if (!Array.isArray(s)) return [];
  const t = [];
  for (const e of s) {
    if (!e || !Array.isArray(e.urls) || e.urls.length === 0) continue;
    const i = { urls: e.urls };
    typeof e.username == "string" && e.username !== "" && (i.username = e.username), typeof e.credential == "string" && e.credential !== "" && (i.credential = e.credential), t.push(i);
  }
  return t;
}
var ve = Object.defineProperty, $e = Object.getOwnPropertyDescriptor, w = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? $e(t, e) : t, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && ve(t, e, r), r;
};
let v = class extends A {
  constructor() {
    super(...arguments), this.api = null, this.anonymousId = "", this.threadId = "", this.offered = !1, this.available = !1, this.checking = !1, this.pickerOpen = !1, this.pickerTargets = [], this.session = {
      phase: "idle",
      callId: null,
      error: null,
      muted: !1,
      durationSeconds: 0
    }, this.webrtc = null, this.unsubscribe = null, this.audioEl = null, this.onStart = async () => {
      if (!this.api || !this.anonymousId || !this.threadId) return;
      let s = [];
      try {
        s = (await this.api.callTargets(this.threadId)).targets;
      } catch {
        s = [];
      }
      if (s.length === 0) {
        await this.startWithTarget(null);
        return;
      }
      const t = s[0];
      if (s.length === 1 && t) {
        await this.startWithTarget(t.id);
        return;
      }
      this.pickerTargets = s, this.pickerOpen = !0;
    }, this.onHangup = async () => {
      var s;
      await ((s = this.webrtc) == null ? void 0 : s.hangup());
    };
  }
  updated(s) {
    (s.has("offered") || s.has("threadId") || s.has("api")) && (this.available = !1, this.maybeCheckAvailability());
  }
  disconnectedCallback() {
    var s, t;
    super.disconnectedCallback(), (s = this.unsubscribe) == null || s.call(this), (t = this.webrtc) == null || t.destroy(), this.webrtc = null;
  }
  render() {
    const s = this.session.phase;
    return s !== "idle" && s !== "ended" && s !== "failed" ? u`
        <div class="call-active">
          <div class="status">${this.statusLabel(s)}</div>
          ${s === "connected" ? u`<div class="timer">${Se(this.session.durationSeconds)}</div>` : d}
          <div class="controls">
            <button
              type="button"
              class="btn btn-mute ${this.session.muted ? "on" : ""}"
              @click=${() => {
      var t;
      return (t = this.webrtc) == null ? void 0 : t.toggleMute();
    }}
              ?disabled=${s !== "connected"}
            >
              ${this.session.muted ? "ミュート解除" : "ミュート"}
            </button>
            <button type="button" class="btn btn-hangup" @click=${this.onHangup}>
              ${fe}
              <span>切断</span>
            </button>
          </div>
          <audio autoplay playsinline></audio>
        </div>
      ` : s === "failed" && this.session.error ? u`<p class="error">${this.session.error}</p>` : !this.offered || !this.available ? d : u`
      <button type="button" class="call-btn" @click=${this.onStart} ?disabled=${this.checking}>
        ${pe}
        <span>担当者と通話する</span>
      </button>
      ${this.pickerOpen ? this.renderPicker() : d}
    `;
  }
  renderPicker() {
    return u`
      <div class="picker" role="menu">
        <div class="picker-title">担当者を選択</div>
        ${this.pickerTargets.map(
      (s) => u`
            <button
              type="button"
              class="picker-item"
              role="menuitem"
              @click=${() => void this.startWithTarget(s.id)}
            >
              ${s.display_name}
            </button>
          `
    )}
        <button type="button" class="picker-cancel" @click=${() => this.pickerOpen = !1}>
          キャンセル
        </button>
      </div>
    `;
  }
  statusLabel(s) {
    switch (s) {
      case "requesting":
        return "通話をリクエストしています…";
      case "ringing":
        return "担当者の応答を待っています…";
      case "connecting":
        return "接続しています…";
      case "connected":
        return "通話中";
      default:
        return "";
    }
  }
  async maybeCheckAvailability() {
    if (!this.offered || !this.api || !this.threadId) {
      this.available = !1;
      return;
    }
    this.checking = !0;
    try {
      const s = await this.api.callAvailability(this.threadId);
      this.available = s.available;
    } catch {
      this.available = !1;
    } finally {
      this.checking = !1;
    }
  }
  async startWithTarget(s) {
    var e;
    if (!this.api || !this.anonymousId || !this.threadId) return;
    this.pickerOpen = !1, (e = this.webrtc) == null || e.destroy();
    const t = new ye({
      api: this.api,
      anonymousId: this.anonymousId,
      threadId: this.threadId,
      targetStaffId: s
    });
    this.webrtc = t, this.unsubscribe = t.subscribe((i) => {
      this.session = i;
    }), await this.updateComplete, this.audioEl = this.renderRoot.querySelector("audio"), this.audioEl && t.attachAudioSink(this.audioEl), await t.start();
  }
};
v.styles = B`
    :host {
      display: block;
    }
    .call-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #16a34a;
      color: #fff;
      border: 0;
      border-radius: 999px;
      padding: 0.6rem 1.25rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(22, 163, 74, 0.35);
    }
    .call-btn:hover {
      background: #15803d;
    }
    .call-btn svg {
      width: 14px;
      height: 14px;
    }
    .call-active {
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 8px;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .call-active .status {
      font-size: 0.875rem;
      color: #166534;
    }
    .call-active .timer {
      font-variant-numeric: tabular-nums;
      font-size: 1rem;
      color: #052e16;
    }
    .call-active .controls {
      display: flex;
      gap: 0.5rem;
    }
    .btn {
      border: 0;
      border-radius: 6px;
      padding: 0.4rem 0.75rem;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .btn-mute {
      background: #e5e7eb;
      color: #111;
    }
    .btn-mute.on {
      background: #f59e0b;
      color: #fff;
    }
    .btn-hangup {
      background: #dc2626;
      color: #fff;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }
    .btn-hangup svg {
      width: 12px;
      height: 12px;
    }
    .error {
      color: #b91c1c;
      font-size: 0.8rem;
    }
    audio {
      display: none;
    }
    .picker {
      margin-top: 0.5rem;
      border: 1px solid #d4d4d8;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      max-width: 20rem;
    }
    .picker .picker-title {
      font-size: 0.8rem;
      color: #52525b;
      padding: 0.25rem 0.5rem 0.5rem;
      border-bottom: 1px solid #f4f4f5;
    }
    .picker .picker-item {
      background: transparent;
      border: 0;
      text-align: left;
      padding: 0.55rem 0.5rem;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      color: #18181b;
    }
    .picker .picker-item:hover {
      background: #f4f4f5;
    }
    .picker .picker-cancel {
      margin-top: 0.25rem;
      background: transparent;
      border: 0;
      color: #71717a;
      font-size: 0.8rem;
      padding: 0.4rem;
      cursor: pointer;
    }
  `;
w([
  m({ attribute: !1 })
], v.prototype, "api", 2);
w([
  m({ attribute: !1 })
], v.prototype, "anonymousId", 2);
w([
  m({ attribute: !1 })
], v.prototype, "threadId", 2);
w([
  m({ type: Boolean, attribute: !1 })
], v.prototype, "offered", 2);
w([
  f()
], v.prototype, "available", 2);
w([
  f()
], v.prototype, "checking", 2);
w([
  f()
], v.prototype, "pickerOpen", 2);
w([
  f()
], v.prototype, "pickerTargets", 2);
w([
  f()
], v.prototype, "session", 2);
v = w([
  W("ai-op-call-button")
], v);
function Se(s) {
  const t = Math.floor(s / 60).toString().padStart(2, "0"), e = (s % 60).toString().padStart(2, "0");
  return `${t}:${e}`;
}
function Nt() {
  const s = globalThis;
  return s.SpeechRecognition ?? s.webkitSpeechRecognition ?? null;
}
function Dt() {
  return Nt() !== null;
}
class St {
  constructor(t = {}) {
    this.opts = t, this.recognition = null, this.listening = !1;
  }
  start() {
    var i, r, n, o;
    if (this.listening) return !0;
    const t = Nt();
    if (t === null)
      return (r = (i = this.opts).onError) == null || r.call(i, "この端末は音声入力に対応していません"), !1;
    const e = new t();
    e.lang = this.opts.lang ?? "ja-JP", e.interimResults = !0, e.continuous = this.opts.continuous ?? !1, e.onresult = (l) => {
      var p, h, b, S;
      let a = "", c = "";
      for (let E = l.resultIndex; E < l.results.length; E++) {
        const Q = l.results[E];
        if (!Q) continue;
        const ct = Q[0].transcript;
        Q.isFinal ? c += ct : a += ct;
      }
      c && ((h = (p = this.opts).onFinal) == null || h.call(p, c)), a && ((S = (b = this.opts).onInterim) == null || S.call(b, a));
    }, e.onerror = (l) => {
      var a, c;
      (c = (a = this.opts).onError) == null || c.call(a, this.mapError(l.error));
    }, e.onend = () => {
      var l, a;
      this.listening = !1, this.recognition = null, (a = (l = this.opts).onEnd) == null || a.call(l);
    };
    try {
      e.start();
    } catch (l) {
      return (o = (n = this.opts).onError) == null || o.call(n, l instanceof Error ? l.message : "音声入力を開始できませんでした"), !1;
    }
    return this.recognition = e, this.listening = !0, !0;
  }
  stop() {
    var t;
    (t = this.recognition) == null || t.stop();
  }
  isListening() {
    return this.listening;
  }
  mapError(t) {
    switch (t) {
      case "not-allowed":
      case "service-not-allowed":
        return "マイクの使用が許可されていません";
      case "no-speech":
        return "音声を検出できませんでした";
      case "audio-capture":
        return "マイクが利用できません";
      case "network":
        return "音声認識サーバに接続できませんでした";
      default:
        return "音声入力でエラーが発生しました";
    }
  }
}
var we = Object.defineProperty, _e = Object.getOwnPropertyDescriptor, T = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? _e(t, e) : t, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && we(t, e, r), r;
};
let g = class extends A {
  constructor() {
    super(...arguments), this.sending = !1, this.error = null, this.voiceEnabled = !1, this.listenActive = !1, this.draft = "", this.listening = !1, this.voiceError = null, this.voiceSupported = Dt(), this.speech = null, this.draftBeforeVoice = "", this.accumulatedFinal = "", this.silenceTimer = null;
  }
  disconnectedCallback() {
    var s;
    super.disconnectedCallback(), this.clearSilenceTimer(), (s = this.speech) == null || s.stop();
  }
  updated(s) {
    var t, e;
    s.has("voiceEnabled") && !this.voiceEnabled && this.listening && ((t = this.speech) == null || t.stop()), s.has("listenActive") && (this.listenActive ? this.startListenLoop() : this.listening && (this.clearSilenceTimer(), (e = this.speech) == null || e.stop()));
  }
  render() {
    const s = this.voiceEnabled && this.voiceSupported && !this.listenActive;
    return u`
      <form @submit=${this.onSubmit}>
        <textarea
          .value=${this.draft}
          @input=${(t) => this.draft = t.target.value}
          placeholder=${this.listenActive ? "お話しください…" : "ご質問を入力してください"}
          ?disabled=${this.sending}
        ></textarea>
        ${s ? u`<button
              type="button"
              class="mic ${this.listening ? "listening" : ""}"
              aria-label=${this.listening ? "音声入力を止める" : "音声で入力"}
              ?disabled=${this.sending}
              @click=${this.toggleListening}
            >
              ${this.listening ? he : Ut}
            </button>` : d}
        <button type="submit" ?disabled=${this.sending || this.draft.trim() === ""}>
          ${this.sending ? "送信中…" : "送信"}
        </button>
      </form>
      ${this.error ? u`<div class="error">${this.error}</div>` : d}
      ${this.voiceError ? u`<div class="voice-error">${this.voiceError}</div>` : d}
    `;
  }
  toggleListening() {
    var s;
    if (this.listening) {
      (s = this.speech) == null || s.stop();
      return;
    }
    this.voiceError = null, this.draftBeforeVoice = this.draft, this.speech = new St({
      lang: "ja-JP",
      onInterim: (t) => {
        this.draft = this.combine(this.draftBeforeVoice, t);
      },
      onFinal: (t) => {
        this.draftBeforeVoice = this.combine(this.draftBeforeVoice, t), this.draft = this.draftBeforeVoice;
      },
      onError: (t) => {
        this.voiceError = t;
      },
      onEnd: () => {
        this.listening = !1, this.speech = null;
      }
    }), this.speech.start() ? this.listening = !0 : this.speech = null;
  }
  startListenLoop() {
    this.listening || this.voiceSupported && (this.voiceError = null, this.draftBeforeVoice = "", this.draft = "", this.accumulatedFinal = "", this.speech = new St({
      lang: "ja-JP",
      continuous: !0,
      onInterim: (s) => {
        this.draft = (this.accumulatedFinal + " " + s).trim(), this.armSilenceTimer();
      },
      onFinal: (s) => {
        this.accumulatedFinal = (this.accumulatedFinal + " " + s).trim(), this.draft = this.accumulatedFinal, this.armSilenceTimer();
      },
      onError: () => {
      },
      onEnd: () => {
        this.listening = !1, this.speech = null, this.clearSilenceTimer(), this.listenActive && !this.sending && window.setTimeout(() => {
          this.listenActive && !this.listening && !this.sending && this.startListenLoop();
        }, 300);
      }
    }), this.speech.start() ? this.listening = !0 : this.speech = null);
  }
  armSilenceTimer() {
    this.clearSilenceTimer(), this.silenceTimer = window.setTimeout(() => {
      this.silenceTimer = null, this.autoSubmitDraft();
    }, g.SILENCE_MS);
  }
  clearSilenceTimer() {
    this.silenceTimer !== null && (window.clearTimeout(this.silenceTimer), this.silenceTimer = null);
  }
  autoSubmitDraft() {
    var t;
    if (this.sending) return;
    const s = (this.accumulatedFinal || this.draft).trim();
    if (s !== "") {
      if (!g.isMeaningfulUtterance(s)) {
        this.accumulatedFinal = "", this.draft = "";
        return;
      }
      (t = this.speech) == null || t.stop(), this.dispatchEvent(
        new CustomEvent("inquire", {
          detail: { body: s },
          bubbles: !0,
          composed: !0
        })
      ), this.draft = "", this.draftBeforeVoice = "", this.accumulatedFinal = "";
    }
  }
  static isMeaningfulUtterance(s) {
    const t = s.trim();
    if (t.length < 3) return !1;
    const e = /(えっと|えーと|えと|えー|えっ|あー|あーと|あの|そのー|その|うーん|うん|まあ|なんか|ま、|ね、|、|。|・|\s)/g;
    return t.replace(e, "").length >= 2;
  }
  combine(s, t) {
    return s === "" ? t : s.endsWith(" ") || t.startsWith(" ") ? s + t : `${s} ${t}`;
  }
  onSubmit(s) {
    var e;
    s.preventDefault();
    const t = this.draft.trim();
    t === "" || this.sending || ((e = this.speech) == null || e.stop(), this.dispatchEvent(
      new CustomEvent("inquire", {
        detail: { body: t },
        bubbles: !0,
        composed: !0
      })
    ), this.draft = "", this.draftBeforeVoice = "");
  }
};
g.styles = B`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
    }
    form {
      display: flex;
      gap: 0.5rem;
      align-items: flex-end;
    }
    textarea {
      flex: 1;
      min-height: 4rem;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.95rem;
      resize: vertical;
    }
    button {
      background: #111;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0.6rem 1rem;
      cursor: pointer;
    }
    button.mic {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #f4f4f4;
      color: #333;
      border: 1px solid #ccc;
      padding: 0.5rem 0.65rem;
    }
    button.mic svg {
      width: 16px;
      height: 16px;
    }
    button.mic.listening {
      background: #b00020;
      color: #fff;
      border-color: #b00020;
    }
    button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .error {
      color: #b00020;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
    .voice-error {
      color: #b00020;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
  `;
g.SILENCE_MS = 1500;
T([
  m({ type: Boolean })
], g.prototype, "sending", 2);
T([
  m({ type: String })
], g.prototype, "error", 2);
T([
  m({ type: Boolean })
], g.prototype, "voiceEnabled", 2);
T([
  m({ type: Boolean })
], g.prototype, "listenActive", 2);
T([
  f()
], g.prototype, "draft", 2);
T([
  f()
], g.prototype, "listening", 2);
T([
  f()
], g.prototype, "voiceError", 2);
T([
  f()
], g.prototype, "voiceSupported", 2);
g = T([
  W("ai-op-inquiry")
], g);
var Ae = Object.defineProperty, Te = Object.getOwnPropertyDescriptor, Lt = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Te(t, e) : t, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && Ae(t, e, r), r;
};
const Ee = new Intl.DateTimeFormat(void 0, {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23"
}), xe = new Intl.DateTimeFormat(void 0, {
  month: "numeric",
  day: "numeric"
});
function wt(s) {
  const t = new Date(s);
  return t.setHours(0, 0, 0, 0), t.getTime();
}
function ke(s, t = /* @__PURE__ */ new Date()) {
  const e = new Date(s);
  if (Number.isNaN(e.getTime())) return s;
  const i = Ee.format(e), r = Math.round((wt(t) - wt(e)) / 864e5);
  return r <= 0 ? i : r === 1 ? `昨日 ${i}` : `${xe.format(e)} ${i}`;
}
let Y = class extends A {
  constructor() {
    super(...arguments), this.messages = [];
  }
  render() {
    return u`
      <ol>
        ${this.messages.map(
      (s) => u`
            <li class=${s.role}>
              ${s.body}
              <time datetime=${s.at}>${ke(s.at)}</time>
            </li>
          `
    )}
      </ol>
    `;
  }
};
Y.styles = B`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
    }
    ol {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    li {
      max-width: 90%;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.9rem;
      line-height: 1.4;
      white-space: pre-wrap;
    }
    li.visitor {
      background: #d6ebff;
      align-self: flex-end;
    }
    li.ai {
      background: #f0f0f0;
    }
    li.staff {
      background: #ffe9a8;
    }
    li.system {
      background: transparent;
      color: #666;
      font-style: italic;
      font-size: 0.8rem;
    }
    time {
      display: block;
      font-size: 0.7rem;
      color: #888;
      margin-top: 0.25rem;
    }
  `;
Lt([
  m({ type: Array })
], Y.prototype, "messages", 2);
Y = Lt([
  W("ai-op-message-list")
], Y);
var Ce = Object.defineProperty, Pe = Object.getOwnPropertyDescriptor, zt = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Pe(t, e) : t, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && Ce(t, e, r), r;
};
let Z = class extends A {
  constructor() {
    super(...arguments), this.threads = [];
  }
  render() {
    return u`
      <p>続きから話しますか?新しく質問しますか?</p>
      <div class="list">
        ${this.threads.map(
      (s) => u`
            <button class="option" @click=${() => this.emitResume(s)}>
              続き: ${s.summary ?? "(件名なし)"}
              <span class="status">${s.status}</span>
            </button>
          `
    )}
        <button class="option new" @click=${() => this.emitNew()}>新しく質問する</button>
      </div>
    `;
  }
  emitResume(s) {
    this.dispatchEvent(
      new CustomEvent("resume", {
        detail: s,
        bubbles: !0,
        composed: !0
      })
    );
  }
  emitNew() {
    this.dispatchEvent(new CustomEvent("newthread", { bubbles: !0, composed: !0 }));
  }
};
Z.styles = B`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    button.option {
      text-align: left;
      background: #f4f4f4;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 0.6rem 0.8rem;
      cursor: pointer;
    }
    button.option:hover {
      background: #eee;
    }
    button.new {
      background: #111;
      color: #fff;
      border: 1px solid #111;
    }
    .status {
      font-size: 0.75rem;
      color: #666;
      margin-left: 0.5rem;
    }
  `;
zt([
  m({ type: Array })
], Z.prototype, "threads", 2);
Z = zt([
  W("ai-op-thread-picker")
], Z);
const Ie = "X-AiOp-Visitor-Token";
class Vt extends Error {
  constructor(t, e, i) {
    super(t), this.status = e, this.code = i, this.name = "ApiError";
  }
}
class jt extends Error {
  constructor(t, e) {
    super(t), this.cause = e, this.name = "NetworkError";
  }
}
const q = [1e3, 2e3], Me = 60, Oe = 3e4;
class Re {
  constructor(t) {
    this.endpoint = He(t.endpoint), this.doFetch = t.fetch ?? globalThis.fetch.bind(globalThis), this.timeoutMs = t.timeoutMs ?? Oe, this.sleep = t.sleep ?? ((e) => new Promise((i) => setTimeout(i, e))), this.visitorToken = t.visitorToken ?? null;
  }
  setVisitorToken(t) {
    this.visitorToken = t;
  }
  getVisitorToken() {
    return this.visitorToken;
  }
  async submitInquiry(t) {
    const e = await this.fetchWithRetry(`${this.endpoint}/inquiries`, {
      method: "POST",
      headers: this.buildHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(t)
    }), i = await this.parseJson(e);
    return typeof i.visitor_token == "string" && i.visitor_token !== "" && (this.visitorToken = i.visitor_token), i;
  }
  async listActiveThreads(t) {
    const e = `${this.endpoint}/threads?anonymous_id=${encodeURIComponent(t)}`, i = await this.fetchWithRetry(e, {
      method: "GET",
      headers: this.buildHeaders()
    });
    return this.parseJson(i);
  }
  async callAvailability(t) {
    const e = `${this.endpoint}/calls/availability?thread_id=${encodeURIComponent(t)}`, i = await this.fetchWithRetry(e, {
      method: "GET",
      headers: this.buildHeaders()
    });
    return this.parseJson(i);
  }
  /** risme bridge picker 用: 今すぐ CallKit を鳴らせる staff を返す。 */
  async callTargets(t) {
    const e = `${this.endpoint}/calls/targets?thread_id=${encodeURIComponent(t)}`, i = await this.fetchWithRetry(e, {
      method: "GET",
      headers: this.buildHeaders()
    });
    return this.parseJson(i);
  }
  async requestCall(t, e, i) {
    const r = { anonymous_id: t, thread_id: e };
    i && (r.target_staff_id = i);
    const n = await this.fetchWithRetry(`${this.endpoint}/calls/request`, {
      method: "POST",
      headers: this.buildHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(r)
    });
    return this.parseJson(n);
  }
  async callStatus(t, e) {
    const i = `${this.endpoint}/calls/status?anonymous_id=${encodeURIComponent(t)}&call_id=${encodeURIComponent(e)}`, r = await this.fetchWithRetry(i, {
      method: "GET",
      headers: this.buildHeaders()
    });
    return this.parseJson(r);
  }
  async callTurnConfig(t, e) {
    const i = `${this.endpoint}/calls/turn-config?anonymous_id=${encodeURIComponent(t)}&call_id=${encodeURIComponent(e)}`, r = await this.fetchWithRetry(i, {
      method: "GET",
      headers: this.buildHeaders()
    });
    return this.parseJson(r);
  }
  async publishCallSignal(t, e, i, r) {
    const n = await this.fetchWithRetry(`${this.endpoint}/calls/signal`, {
      method: "POST",
      headers: this.buildHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        call_id: t,
        anonymous_id: e,
        kind: i,
        payload: r
      })
    });
    await this.parseJson(n);
  }
  async pollCallSignals(t, e) {
    const i = `${this.endpoint}/calls/signal?call_id=${encodeURIComponent(t)}&anonymous_id=${encodeURIComponent(e)}`, r = await this.fetchWithRetry(i, {
      method: "GET",
      headers: this.buildHeaders()
    });
    return this.parseJson(r);
  }
  async endCall(t, e) {
    const i = await this.fetchWithRetry(`${this.endpoint}/calls/end`, {
      method: "POST",
      headers: this.buildHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ call_id: t, anonymous_id: e })
    });
    await this.parseJson(i);
  }
  buildHeaders(t = {}) {
    const e = { ...t };
    return this.visitorToken !== null && this.visitorToken !== "" && (e[Ie] = this.visitorToken), e;
  }
  async fetchWithRetry(t, e) {
    let i = 0, r = 0;
    for (; ; ) {
      const n = new AbortController(), o = this.timeoutMs > 0 ? setTimeout(() => n.abort(), this.timeoutMs) : null;
      let l;
      try {
        l = await this.doFetch(t, { ...e, signal: n.signal });
      } catch (a) {
        if (o !== null && clearTimeout(o), i < q.length) {
          await this.sleep(q[i]), i++;
          continue;
        }
        throw new jt("Network request failed", a);
      }
      if (o !== null && clearTimeout(o), l.status === 429 && r < 1) {
        const a = De(l.headers.get("Retry-After"));
        await this.sleep((a ?? Me) * 1e3), r++;
        continue;
      }
      if (l.status >= 500 && l.status < 600 && i < q.length) {
        await this.sleep(q[i]), i++;
        continue;
      }
      return l;
    }
  }
  async parseJson(t) {
    const e = await t.text();
    let i = null;
    if (e)
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
    if (!t.ok) {
      const r = Ue(i) ?? `HTTP ${t.status}`, n = Ne(i);
      throw new Vt(r, t.status, n);
    }
    return i;
  }
}
function He(s) {
  return s.replace(/\/$/, "");
}
function Ue(s) {
  if (s && typeof s == "object") {
    const t = s;
    if (typeof t.message == "string") return t.message;
  }
}
function Ne(s) {
  if (s && typeof s == "object") {
    const t = s;
    if (typeof t.code == "string") return t.code;
  }
}
function De(s) {
  if (s === null) return null;
  const t = s.trim();
  if (t === "") return null;
  const e = Number.parseInt(t, 10);
  if (Number.isFinite(e) && e >= 0 && String(e) === t)
    return e;
  const i = Date.parse(t);
  if (Number.isFinite(i)) {
    const r = Math.ceil((i - Date.now()) / 1e3);
    return r > 0 ? r : 0;
  }
  return null;
}
const Le = "しばらく時間を置いてお試しください", _t = "接続に失敗しました", ze = "送信に失敗しました";
function Ve(s) {
  return s instanceof jt ? _t : s instanceof Vt ? s.status === 429 ? Le : s.status >= 500 && s.status < 600 ? _t : s.message : s instanceof Error && s.message !== "" ? s.message : ze;
}
let _ = null;
function je() {
  const s = globalThis;
  return typeof s.speechSynthesis < "u" && typeof s.SpeechSynthesisUtterance < "u";
}
function At(s, t = {}) {
  const e = globalThis;
  if (!e.speechSynthesis || !e.SpeechSynthesisUtterance || s.trim() === "") return !1;
  try {
    _ && (_.onend = null, _ = null), e.speechSynthesis.cancel();
    const i = new e.SpeechSynthesisUtterance(s);
    return i.lang = t.lang ?? "ja-JP", i.onend = () => {
      var r;
      i === _ && (_ = null, (r = t.onEnd) == null || r.call(t));
    }, _ = i, e.speechSynthesis.speak(i), !0;
  } catch {
    return !1;
  }
}
function Tt() {
  var t;
  const s = globalThis;
  _ && (_.onend = null, _ = null), (t = s.speechSynthesis) == null || t.cancel();
}
const rt = "ai-op.visitor", Be = 90, Et = Be * 24 * 60 * 60 * 1e3;
class Fe {
  constructor(t = {}) {
    this.storage = t.storage ?? globalThis.localStorage, this.now = t.now ?? (() => Date.now()), this.generateId = t.generateId ?? We;
  }
  ensure() {
    const t = this.now(), e = this.readValid(t);
    if (e) {
      const r = {
        ...e,
        lastSeenAt: t,
        expiresAt: t + Et
      };
      return this.write(r), r;
    }
    const i = {
      anonymousId: this.generateId(),
      createdAt: t,
      lastSeenAt: t,
      expiresAt: t + Et
    };
    return this.write(i), i;
  }
  updateContact(t, e) {
    const r = { ...this.ensure() };
    return t !== void 0 && (r.email = t || void 0), e !== void 0 && (r.phone = e || void 0), this.write(r), r;
  }
  setToken(t) {
    const i = { ...this.ensure() };
    return t === null || t === "" ? delete i.token : i.token = t, this.write(i), i;
  }
  reset() {
    try {
      this.storage.removeItem(rt);
    } catch {
    }
  }
  readValid(t) {
    let e;
    try {
      e = this.storage.getItem(rt);
    } catch {
      return null;
    }
    if (!e) return null;
    try {
      const i = JSON.parse(e);
      return typeof i.anonymousId != "string" || typeof i.expiresAt != "number" || i.expiresAt < t ? null : {
        anonymousId: i.anonymousId,
        createdAt: typeof i.createdAt == "number" ? i.createdAt : t,
        lastSeenAt: typeof i.lastSeenAt == "number" ? i.lastSeenAt : t,
        expiresAt: i.expiresAt,
        email: typeof i.email == "string" ? i.email : void 0,
        phone: typeof i.phone == "string" ? i.phone : void 0,
        token: typeof i.token == "string" && i.token !== "" ? i.token : void 0
      };
    } catch {
      return null;
    }
  }
  write(t) {
    try {
      this.storage.setItem(rt, JSON.stringify(t));
    } catch {
    }
  }
}
function We() {
  const s = globalThis.crypto;
  if (s != null && s.randomUUID)
    return s.randomUUID();
  const t = new Uint8Array(16);
  if (s != null && s.getRandomValues)
    s.getRandomValues(t);
  else
    for (let i = 0; i < t.length; i += 1)
      t[i] = Math.floor(Math.random() * 256);
  t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
  const e = Array.from(t, (i) => i.toString(16).padStart(2, "0")).join("");
  return `${e.slice(0, 8)}-${e.slice(8, 12)}-${e.slice(12, 16)}-${e.slice(16, 20)}-${e.slice(20)}`;
}
class qe {
  constructor() {
    this.snapshot = {
      phase: "picker",
      threadId: null,
      threadStatus: null,
      messages: [],
      sending: !1,
      error: null,
      lastAction: null
    }, this.listeners = /* @__PURE__ */ new Set();
  }
  get state() {
    return this.snapshot;
  }
  subscribe(t) {
    return this.listeners.add(t), () => this.listeners.delete(t);
  }
  setPhase(t) {
    this.update({ phase: t, error: null });
  }
  startNewThread() {
    this.update({
      phase: "chat",
      threadId: null,
      threadStatus: null,
      messages: [],
      error: null,
      lastAction: null
    });
  }
  resumeThread(t, e) {
    this.update({
      phase: "chat",
      threadId: t,
      threadStatus: e,
      messages: [],
      error: null,
      lastAction: null
    });
  }
  markSending() {
    this.update({ sending: !0, error: null });
  }
  appendMessage(t) {
    this.update({ messages: [...this.snapshot.messages, t] });
  }
  applyReply(t, e, i, r, n = null) {
    this.update({
      threadId: t,
      threadStatus: e,
      messages: [...this.snapshot.messages, { role: "ai", body: i, at: r }],
      sending: !1,
      error: null,
      lastAction: n
    });
  }
  failWith(t) {
    this.update({ sending: !1, error: t });
  }
  update(t) {
    this.snapshot = { ...this.snapshot, ...t };
    for (const e of this.listeners)
      e(this.snapshot);
  }
}
var Je = Object.defineProperty, Ke = Object.getOwnPropertyDescriptor, $ = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Ke(t, e) : t, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && Je(t, e, r), r;
};
const xt = "ai-op-widget-collapsed", kt = "ai-op-widget-voice";
let y = class extends A {
  constructor() {
    super(...arguments), this.endpoint = "", this.title = "AI オペレーター", this.mode = "inline", this.collapsed = !1, this.voiceMode = !1, this.isTtsSpeaking = !1, this.ttsSupported = je(), this.sttSupported = Dt(), this.visitor = null, this.threads = [], this.snapshot = {
      phase: "picker",
      threadId: null,
      threadStatus: null,
      messages: [],
      sending: !1,
      error: null,
      lastAction: null
    }, this.identity = null, this.api = null, this.store = new qe(), this.unsubscribe = null, this.lastSpokenKey = null, this.lastScrolledMessageCount = 0;
  }
  connectedCallback() {
    super.connectedCallback(), this.mode === "floating" && (this.collapsed = this.readCollapsed()), this.voiceMode = this.readVoiceMode(), this.identity = new Fe(), this.visitor = this.identity.ensure(), this.endpoint && (this.api = new Re({
      endpoint: this.endpoint,
      visitorToken: this.visitor.token ?? null
    })), this.unsubscribe = this.store.subscribe((s) => {
      this.snapshot = s, this.maybeSpeakLatestAi(s);
    }), this.snapshot = this.store.state, this.primeLastSpokenKey(this.snapshot), this.refreshThreads();
  }
  disconnectedCallback() {
    var s;
    super.disconnectedCallback(), (s = this.unsubscribe) == null || s.call(this), Tt();
  }
  updated() {
    if (this.snapshot.messages.length !== this.lastScrolledMessageCount) {
      this.lastScrolledMessageCount = this.snapshot.messages.length;
      const s = this.renderRoot.querySelector(".chat-body");
      s instanceof HTMLElement && (s.scrollTop = s.scrollHeight);
    }
  }
  render() {
    if (this.mode === "floating" && this.collapsed)
      return u`
        <button
          type="button"
          class="bubble"
          aria-label=${this.title}
          @click=${() => this.setCollapsed(!1)}
        >
          ${de}
        </button>
      `;
    const s = this.ttsSupported || this.sttSupported;
    return u`
      <header>
        <h3>${this.title}</h3>
        ${s ? u`<button
              type="button"
              class="voice-toggle ${this.voiceMode ? "on" : ""}"
              aria-pressed=${this.voiceMode ? "true" : "false"}
              @click=${this.toggleVoiceMode}
            >
              ${this.voiceMode ? ce : Ut}
              <span>${this.voiceMode ? "テキストに戻す" : "音声で対応"}</span>
            </button>` : d}
        ${this.mode === "floating" ? u`<button
              type="button"
              class="close-btn"
              aria-label="閉じる"
              @click=${() => this.setCollapsed(!0)}
            >
              ${ue}
            </button>` : d}
      </header>
      ${this.snapshot.phase === "picker" ? this.renderPicker() : this.renderChat()}
    `;
  }
  renderPicker() {
    return this.threads.length === 0 ? u`
        <p>どんなご用件ですか？</p>
        <ai-op-inquiry
          .sending=${this.snapshot.sending}
          .error=${this.snapshot.error}
          .voiceEnabled=${this.voiceMode}
          .listenActive=${this.listenActive}
          @inquire=${(s) => this.submitNew(s.detail.body)}
        ></ai-op-inquiry>
      ` : u`
      <ai-op-thread-picker
        .threads=${this.threads}
        @resume=${(s) => this.onResume(s.detail)}
        @newthread=${() => this.store.startNewThread()}
      ></ai-op-thread-picker>
    `;
  }
  renderChat() {
    const s = this.snapshot.lastAction === "sync_call" && this.snapshot.threadId !== null;
    return u`
      <div class="chat-body">
        <div class="thread-info">
          ${this.snapshot.threadId ? `Thread: ${this.snapshot.threadId.slice(0, 8)}… / ${this.snapshot.threadStatus ?? "-"}` : "新規スレッド"}
        </div>
        <ai-op-message-list .messages=${this.snapshot.messages}></ai-op-message-list>
      </div>
      <div class="chat-footer">
        ${s && this.api && this.visitor ? u`<div class="call-cta">
              <ai-op-call-button
                .api=${this.api}
                .anonymousId=${this.visitor.anonymousId}
                .threadId=${this.snapshot.threadId ?? ""}
                .offered=${!0}
              ></ai-op-call-button>
            </div>` : d}
        <ai-op-inquiry
          .sending=${this.snapshot.sending}
          .error=${this.snapshot.error}
          .voiceEnabled=${this.voiceMode}
          .listenActive=${this.listenActive}
          @inquire=${(t) => this.submitFollowup(t.detail.body)}
        ></ai-op-inquiry>
      </div>
    `;
  }
  get listenActive() {
    return this.voiceMode && this.sttSupported && !this.isTtsSpeaking && !this.snapshot.sending;
  }
  async refreshThreads() {
    if (!(!this.api || !this.visitor)) {
      if (!this.api.getVisitorToken()) {
        this.threads = [];
        return;
      }
      try {
        const s = await this.api.listActiveThreads(this.visitor.anonymousId);
        this.threads = s.threads;
      } catch {
        this.threads = [];
      }
    }
  }
  onResume(s) {
    this.store.resumeThread(s.id, s.status);
  }
  submitNew(s) {
    this.store.startNewThread(), this.send(s, null);
  }
  submitFollowup(s) {
    this.send(s, this.snapshot.threadId);
  }
  async send(s, t) {
    if (!this.api || !this.visitor) {
      this.store.failWith("endpoint が設定されていません");
      return;
    }
    const e = (/* @__PURE__ */ new Date()).toISOString();
    this.store.appendMessage({ role: "visitor", body: s, at: e }), this.store.markSending();
    try {
      const i = await this.api.submitInquiry({
        anonymous_id: this.visitor.anonymousId,
        message: s,
        ...t ? { resume_thread_id: t } : {},
        ...this.visitor.email ? { email: this.visitor.email } : {},
        ...this.visitor.phone ? { phone: this.visitor.phone } : {}
      });
      this.identity && i.visitor_token && (this.visitor = this.identity.setToken(i.visitor_token)), this.store.applyReply(
        i.thread_id,
        i.thread_status,
        i.reply,
        (/* @__PURE__ */ new Date()).toISOString(),
        i.action
      ), this.refreshThreads();
    } catch (i) {
      this.store.failWith(Ve(i));
    }
  }
  setCollapsed(s) {
    this.collapsed = s;
    try {
      window.sessionStorage.setItem(xt, s ? "1" : "0");
    } catch {
    }
  }
  readCollapsed() {
    try {
      return window.sessionStorage.getItem(xt) === "1";
    } catch {
      return !1;
    }
  }
  toggleVoiceMode() {
    const s = !this.voiceMode;
    this.voiceMode = s;
    try {
      window.sessionStorage.setItem(kt, s ? "1" : "0");
    } catch {
    }
    s ? this.ttsSupported && (this.isTtsSpeaking = !0, At("どんなご用件ですか？", {
      onEnd: () => {
        this.isTtsSpeaking = !1;
      }
    }) || (this.isTtsSpeaking = !1)) : (Tt(), this.isTtsSpeaking = !1);
  }
  readVoiceMode() {
    try {
      return window.sessionStorage.getItem(kt) === "1";
    } catch {
      return !1;
    }
  }
  primeLastSpokenKey(s) {
    const t = s.messages[s.messages.length - 1];
    this.lastSpokenKey = (t == null ? void 0 : t.role) === "ai" ? t.at : null;
  }
  maybeSpeakLatestAi(s) {
    if (!this.voiceMode || !this.ttsSupported) return;
    const t = s.messages[s.messages.length - 1];
    if (!t || t.role !== "ai" || t.at === this.lastSpokenKey) return;
    this.lastSpokenKey = t.at, this.isTtsSpeaking = !0, At(t.body, {
      onEnd: () => {
        this.isTtsSpeaking = !1;
      }
    }) || (this.isTtsSpeaking = !1);
  }
};
y.styles = B`
    :host {
      display: flex;
      flex-direction: column;
      font-family: system-ui, sans-serif;
      max-width: 480px;
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 1rem;
      background: #fff;
      box-sizing: border-box;
      min-height: 0;
    }
    :host([mode='floating']) {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 999999;
      width: min(360px, calc(100vw - 40px));
      max-width: none;
      height: min(600px, calc(100vh - 40px));
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    }
    :host([mode='floating'][collapsed]) {
      width: 60px;
      height: 60px;
      padding: 0;
      border-radius: 50%;
      border: none;
      background: #2563eb;
      cursor: pointer;
      overflow: hidden;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      flex-shrink: 0;
    }
    .chat-body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .chat-footer {
      flex-shrink: 0;
      margin-top: 0.75rem;
    }
    .call-cta {
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 10px;
      display: flex;
      justify-content: center;
    }
    h3 {
      margin: 0;
      font-size: 1rem;
      flex: 1;
    }
    .close-btn {
      background: transparent;
      border: 0;
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
      color: #555;
      padding: 0.25rem 0.5rem;
    }
    .close-btn:hover {
      color: #000;
    }
    .voice-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: #f4f4f4;
      border: 1px solid #ccc;
      border-radius: 999px;
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
      cursor: pointer;
      color: #333;
    }
    .voice-toggle.on {
      background: #2563eb;
      color: #fff;
      border-color: #2563eb;
    }
    .voice-toggle svg {
      width: 12px;
      height: 12px;
    }
    .bubble {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 0;
      color: #fff;
      cursor: pointer;
    }
    .bubble svg {
      width: 26px;
      height: 26px;
    }
    .close-btn svg {
      width: 14px;
      height: 14px;
      display: block;
    }
    .thread-info {
      font-size: 0.75rem;
      color: #666;
      margin-bottom: 0.5rem;
    }
  `;
$([
  m({ type: String, reflect: !0 })
], y.prototype, "endpoint", 2);
$([
  m({ type: String })
], y.prototype, "title", 2);
$([
  m({ type: String, reflect: !0 })
], y.prototype, "mode", 2);
$([
  m({ type: Boolean, reflect: !0 })
], y.prototype, "collapsed", 2);
$([
  f()
], y.prototype, "voiceMode", 2);
$([
  f()
], y.prototype, "isTtsSpeaking", 2);
$([
  f()
], y.prototype, "ttsSupported", 2);
$([
  f()
], y.prototype, "sttSupported", 2);
$([
  f()
], y.prototype, "visitor", 2);
$([
  f()
], y.prototype, "threads", 2);
$([
  f()
], y.prototype, "snapshot", 2);
y = $([
  W("ai-op-widget")
], y);
export {
  g as AiOpInquiry,
  Y as AiOpMessageList,
  Z as AiOpThreadPicker,
  y as AiOpWidget,
  Re as ApiClient,
  Vt as ApiError,
  qe as ConversationStore,
  Fe as VisitorIdentity
};
//# sourceMappingURL=index.js.map
