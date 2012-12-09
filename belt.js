/* Belt
 * A no-dependency toolbelt.
 * Heavily influenced by and borrowed from Underscore.js and Backbone.js */
(function () {
    "use strict";

    // Belt's two global vars, to be bound to window
    var belt = {},
        // beltup expects an optional array of arguments
        // ex: beltup(o, belt.cache); or... beltup(o, [belt.cache, belt.events]);
        beltup = function (obj) {
            if (!exists(obj)) return;
            var prop, source = Array.prototype.slice.call(arguments, 1)[[0]];
            if (exists(source)) {
                belt.each(source, function (el, index) {
                    if (Object.prototype.toString.call(source) !== "[object Array]") {
                        el = source; 
                    }
                    for (prop in el) {
                        // Avoid overwriting existing properties
                        if (Object.prototype.hasOwnProperty.call(obj, prop)) continue;
                        obj[prop] = el[prop];
                    }
                });
            }
            return obj;
        };

    belt.each = function (obj, iterator, context) {
        if (!exists(obj)) return; 

        // Native Array.forEach
        if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
            obj.forEach(iterator, context);

        // Fallback when native Array.forEach is not available
        } else if (exists(obj.length)) {
            var i, len = obj.length;
            for (i = 0; i < len; i += 1) {
                if (iterator.call(context, obj[i], i, obj) === {}) return;
            }

        // When working with an Object
        } else {
            var key;
            for (key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === {}) return;
                }
            }
        }
    };

    /*
     * Belt objects to be used with beltup() */
    belt.cache = {
        cache: {},
        data: function (key, val) {
            if (typeof key !== "string") return this;
            if (key.match(/\s+/)) {
                throw new Error("Data Key must not contain whitespace");
            }
            if (!exists(val) && this.cache[key] !== "undefined") {
                return this.cache[key];
            }
            if (exists(val)) {
                this.cache[key] = val;
            }
            return this;
        },
        removeData: function (key) {
            if (!exists(key)) {
                this.cache = {};
            } else {
                delete this.cache[key];
            }
            return this;
        }
    };

    belt.dom = {
        addClass: function (str) {
            
        },
        removeClass: function (str) {

        }
    };

    belt.events = {
        on: function (events, callback, context) {
            var calls, event, list, node, tail;
            if (!callback) return this;
            events = events.split(/\s+/);
            calls = this._callbacks || (this._callbacks = {});
            while (event = events.shift()) {
                list = calls[event];
                node = list ? list.tail : {};
                node.next = tail = {};
                node.context = context;
                node.callback = callback;
                calls[event] = {
                    tail: tail,
                    next: list ? list.next : node
                };
            }
            return this;
        },
        off: function (events, callback, context) {
            var calls, cb, ctx, events, node, tail;
            if (!(calls = this._callbacks)) return;
            if (!(events || callback || context)) {
                delete this._callbacks;
                return this;
            }
            events = events ? events.split(/\s+/) : _.keys(calls);
            while (event = events.shift()) {
                node = calls[event];
                delete calls[event];
                if (!node || !(callback || context)) continue;
                tail = node.tail;
                while ((node = node.next) !== tail) {
                    cb = node.callback;
                    ctx = node.context;
                    if ((callback && cb !== callback) || context && ctx !== context) {
                        this.on(event, cb, ctx);
                    }
                }
            }
            return this;
        },
        trigger: function (events) {
            var all, args, calls, event, node, rest, tail;
            if (!(calls = this._callbacks)) return this;
            all = calls.all;
            events = events.split(/\s+/);
            rest = Array.prototype.slice.call(arguments, 1);
            while (event = events.shift()) {
                if (node = calls[event]) {
                    tail = node.tail;
                    while ((node = node.next) !== tail) {
                        node.callback.apply(node.context || this, rest);
                    }
                }
                if (node = all) {
                    tail = node.tail;
                    args = [event].concat(rest);
                    while ((node = node.next) !== tail) {
                        node.callback.apply(node.context || this, args);
                    }
                }
            }
            return this;
        }
    };

    belt.css = {
        // assign style properties to an element, or, fetch the value
        css: function (prop, val) {
            if (!exists(prop)) return this;
    
            // el.css({marginLeft: "500px"})
            if (typeof prop === "object") {
                for (var key in prop) {
                    var propVal = prop[key];
                    key = convertProp(key);
                    if (typeof propVal !== "string") {
                        propVal = propVal.toString(); 
                    } 
                    this.style[key] = propVal;
                }

            // el.css("margin-left", "500px"); or el.css("margin-left");
            } else {
                prop = convertProp(prop);
                if (!exists(val)) {
                    return window.getComputedStyle(this, null)[prop];
                }
                this.style[prop] = val;
            }

            return this;
        }
    };

    /*
     * Begin internal utilities */
    function convertProp(str) {
        var i, 
            matches = str.match(/\b-\w/g), 
            len = exists(matches) ? matches.length : false;
        if (!len) return str;
        for (i = 0; i < len; i += 1) {
            str = str.replace(matches[i], matches[i][1].toUpperCase());
        }
        return str;
    }

    function exists(obj) {
        return typeof obj !== "undefined" && obj;
    }

    // Bind our vars to the global namespace
    window.belt = belt;
    window.beltup = beltup;

}());
