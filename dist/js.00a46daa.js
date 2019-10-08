// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/scroll-out/lib/index.js":[function(require,module,exports) {
'use strict';

function clamp(v, min, max) {
    return min > v ? min : max < v ? max : v;
}
function sign(x) {
    return +(x > 0) - +(x < 0);
}
function round(n) {
    return Math.round(n * 10000) / 10000;
}

var cache = {};
function hyphenate(value) {
    return cache[value] || (cache[value] = value.replace(/([A-Z])/g, replacer));
}
function replacer(match) {
    return '-' + match[0].toLowerCase();
}

var win = window;
var root = document.documentElement;
/** find elements */
function $(e, parent) {
    return !e || e.length === 0
        ? // null or empty string returns empty array
            []
        : e.nodeName
            ? // a single element is wrapped in an array
                [e]
            : // selector and NodeList are converted to Element[]
                [].slice.call(e[0].nodeName ? e : (parent || root).querySelectorAll(e));
}
var setAttrs = function (el, attrs) {
    // tslint:disable-next-line:forin
    for (var key in attrs) {
        el.setAttribute("data-" + hyphenate(key), attrs[key]);
    }
};
var setProps = function (cssProps) {
    return function (el, props) {
        for (var key in props) {
            if (cssProps === true || cssProps[key]) {
                el.style.setProperty("--" + hyphenate(key), round(props[key]));
            }
        }
    };
};

var clearTask;
var subscribers = [];
function subscribe(fn) {
    subscribers.push(fn);
    if (!clearTask) {
        loop();
    }
    return function () {
        subscribers = subscribers.filter(function (s) { return s !== fn; });
        if (!subscribers.length && clearTask) {
            clearTask = 0;
            cancelAnimationFrame(clearTask);
        }
    };
}
function loop() {
    // process subscribers
    var s = subscribers.slice();
    s.forEach(function (s2) { return s2(); });
    // schedule next loop if the queue needs it
    clearTask = subscribers.length ? requestAnimationFrame(loop) : 0;
}

function noop() { }

var SCROLL = 'scroll';
var RESIZE = 'resize';
var ON = 'addEventListener';
var OFF = 'removeEventListener';
var lastId = 0;
/**
 * Creates a new instance of ScrollOut that marks elements in the viewport with
 * an "in" class and marks elements outside of the viewport with an "out"
 */
// tslint:disable-next-line:no-default-export
function main (opts) {
    // Apply default options.
    opts = opts || {};
    // Debounce onChange/onHidden/onShown.
    var onChange = opts.onChange || noop;
    var onHidden = opts.onHidden || noop;
    var onShown = opts.onShown || noop;
    var props = opts.cssProps ? setProps(opts.cssProps) : noop;
    var se = opts.scrollingElement;
    var container = se ? $(se)[0] : win;
    var doc = se ? $(se)[0] : root;
    var id = ++lastId;
    var changeAndDetect = function (obj, key, value) {
        return obj[key + id] !== (obj[key + id] = JSON.stringify(value));
    };
    var rootCtx;
    // tslint:disable-next-line:no-any
    var elements;
    var shouldIndex;
    var index = function () {
        shouldIndex = true;
    };
    var cx, cy;
    var update = function () {
        if (shouldIndex) {
            shouldIndex = false;
            elements = $(opts.targets || '[data-scroll]', $(opts.scope || doc)[0])
                .map(function (el) { return ({ $: el, ctx: {} }); });
        }
        // Calculate position, direction and ratio.
        var cw = doc.clientWidth;
        var ch = doc.clientHeight;
        var dirX = sign(-cx + (cx = doc.scrollLeft || win.pageXOffset));
        var dirY = sign(-cy + (cy = doc.scrollTop || win.pageYOffset));
        var scrollPercentX = doc.scrollLeft / (doc.scrollWidth - cw || 1);
        var scrollPercentY = doc.scrollTop / (doc.scrollHeight - ch || 1);
        // Call update to dom.
        rootCtx =
            { scrollDirX: dirX, scrollDirY: dirY, scrollPercentX: scrollPercentX, scrollPercentY: scrollPercentY };
        elements.forEach(function (obj) {
            var el = obj.$;
            // find the distance from the element to the scrolling container
            var target = el;
            var x = 0;
            var y = 0;
            do {
                x += target.offsetLeft;
                y += target.offsetTop;
                target = target.offsetParent;
            } while (target && target !== container);
            // Get element dimensions.
            var w = el.clientWidth || el.offsetWidth || 0;
            var h = el.clientHeight || el.offsetHeight || 0;
            // Find visible ratios for each element.
            var visibleX = (clamp(x + w, cx, cx + cw) - clamp(x, cx, cx + cw)) / w;
            var visibleY = (clamp(y + h, cy, cy + ch) - clamp(y, cy, cy + ch)) / h;
            var viewportX = clamp((cx - (w / 2 + x - cw / 2)) / (cw / 2), -1, 1);
            var viewportY = clamp((cy - (h / 2 + y - ch / 2)) / (ch / 2), -1, 1);
            var visible = +(opts.offset ? opts.offset <= cy :
                (opts.threshold || 0) < visibleX * visibleY);
            obj.ctx = {
                elementHeight: h,
                elementWidth: w,
                intersectX: visibleX === 1 ? 0 : sign(x - cx),
                intersectY: visibleY === 1 ? 0 : sign(y - cy),
                offsetX: x,
                offsetY: y,
                viewportX: viewportX,
                viewportY: viewportY,
                visible: visible,
                visibleX: visibleX,
                visibleY: visibleY
            };
        });
    };
    var render = function () {
        if (!elements) {
            return;
        }
        // Update root attributes if they have changed.
        var rootAttributes = {
            scrollDirX: rootCtx.scrollDirX,
            scrollDirY: rootCtx.scrollDirY
        };
        if (changeAndDetect(doc, '_SA', rootAttributes)) {
            setAttrs(doc, rootAttributes);
        }
        // Update props if the root context has changed.
        if (changeAndDetect(doc, '_S', rootCtx)) {
            props(doc, rootCtx);
        }
        var len = elements.length;
        for (var x = len - 1; x > -1; x--) {
            var obj = elements[x];
            var el = obj.$;
            var ctx = obj.ctx;
            var visible = ctx.visible;
            if (changeAndDetect(el, '_SO', ctx)) {
                // If percentage visibility has changed, update.
                props(el, ctx);
            }
            // Handle JavaScript callbacks.
            if (changeAndDetect(el, '_SV', visible)) {
                setAttrs(el, { scroll: visible ? 'in' : 'out' });
                ctx.index = x;
                onChange(el, ctx, doc);
                (visible ? onShown : onHidden)(el, ctx, doc);
            }
            // if this is shown multiple times, keep it in the list
            if (visible && opts.once) {
                elements.splice(x, 1);
            }
        }
    };
    var sub = subscribe(render);
    // Run initialize index.
    index();
    update();
    // Hook up document listeners to automatically detect changes.
    win[ON](RESIZE, update);
    container[ON](SCROLL, update);
    return {
        index: index,
        teardown: function () {
            sub();
            win[OFF](RESIZE, update);
            container[OFF](SCROLL, update);
        },
        update: update
    };
}

module.exports = main;

},{}],"js/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggle = exports.topFunction = exports.scrollFunction = exports.smoothScroll = void 0;

//smooth scroll
var smoothScroll = function smoothScroll(target, duration, navHeight) {
  var target = document.querySelector(target);
  var targetPosition = target.getBoundingClientRect().top;
  var startPosition = window.pageYOffset;
  var distance = targetPosition - startPosition - navHeight;
  var startTime = null;

  function animation(currentTime) {
    if (startTime === null) {
      startTime = currentTime;
    }

    var timeElapsed = currentTime - startTime;
    var run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}; //back to top


exports.smoothScroll = smoothScroll;

var scrollFunction = function scrollFunction(el) {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
};

exports.scrollFunction = scrollFunction;

var topFunction = function topFunction() {
  document.body.scrollTop = 0; // For Safari

  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}; //toggle content


exports.topFunction = topFunction;

var show = function show(el) {
  var getHeight = function getHeight() {
    el.style.display = 'block';
    var height = el.scrollHeight + 'px';
    el.style.display = '';
    return height;
  };

  var height = getHeight();
  el.classList.add('is-visible');
  el.style.height = height; //   window.setTimeout(function() {
  //     el.style.height = '';
  //   }, 350);
};

var hide = function hide(el) {
  el.style.height = el.scrollHeight + 'px'; //   window.setTimeout(function() {

  el.style.height = '0'; //   }, 1);
  //   window.setTimeout(function() {

  el.classList.remove('is-visible'); //   }, 350);
};

var toggle = function toggle(el, timing) {
  if (el.classList.contains('is-visible')) {
    hide(el);
    return;
  }

  show(el);
};

exports.toggle = toggle;
},{}],"js/functions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleContent = toggleContent;
exports.scrollToPosition = scrollToPosition;
exports.scrollToTop = exports.toggleNav = void 0;

var _utils = require("./utils.js");

var mainNav = document.querySelector('.main-nav');
var navBarToggle = document.querySelector('.navbar-toggle');
var toTopButton = document.querySelector('.button--top');

function toggleContent(headings, paras, length) {
  var _loop = function _loop(i) {
    headings[i].addEventListener('click', function () {
      return (0, _utils.toggle)(paras[i]);
    });
  };

  for (var i = 0; i < length; i++) {
    _loop(i);
  }
}

function scrollToPosition() {
  var about = document.querySelector('.nav--about');
  var service = document.querySelector('.nav--service');
  var contact = document.querySelector('.nav--contact');
  var navHeight = document.querySelector('.navbar').scrollHeight;
  console.log(navHeight);
  about.addEventListener('click', function () {
    (0, _utils.smoothScroll)('#about-us', 1000, navHeight);
  });
  service.addEventListener('click', function () {
    (0, _utils.smoothScroll)('.service', 1000, navHeight);
  });
  contact.addEventListener('click', function () {
    (0, _utils.smoothScroll)('.contact', 1000, navHeight);
  });
}

var toggleNav = function toggleNav() {
  navBarToggle.addEventListener('click', function () {
    mainNav.classList.toggle('active');
  });
};

exports.toggleNav = toggleNav;

var scrollToTop = function scrollToTop() {
  window.onscroll = function () {
    (0, _utils.scrollFunction)(toTopButton);
  };

  if (toTopButton) {
    toTopButton.addEventListener('click', function () {
      return (0, _utils.smoothScroll)('.navbar', 1000, 0);
    });
  }
};

exports.scrollToTop = scrollToTop;
},{"./utils.js":"js/utils.js"}],"js/index.js":[function(require,module,exports) {
"use strict";

var _scrollOut = _interopRequireDefault(require("scroll-out"));

var _functions = require("./functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var headings = document.querySelectorAll('.content--sub-heading');
var paras = document.querySelectorAll('.content--paragraph');
var h1 = document.getElementsByTagName('h1'); // ScrollOut({
//   onShown: () => {
//     // use the web animation API
//     Array.prototype.forEach.call(h1, el =>
//       el.animate([{ opacity: 0 }, { opacity: 1 }], 1000)
//     );
//   },
//   onHidden: () => {
//     // hide the element initially
//     Array.prototype.forEach.call(h1, el => (el.style.opacity = 0));
//   }
// });

document.addEventListener('DOMContentLoaded', function () {
  (0, _functions.scrollToPosition)();
  (0, _functions.toggleNav)();
  (0, _functions.scrollToTop)();
  (0, _functions.toggleContent)(headings, paras, headings.length);
});
},{"scroll-out":"node_modules/scroll-out/lib/index.js","./functions":"js/functions.js"}],"../../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50178" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map