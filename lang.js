
function Lang() {}

(function() {
/*********************************************************************
 *                             类型判断
 ********************************************************************/
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
/**
 * {*}
 * return {String}
 */
    this.getType = function(p) {
        if (typeof p === "undefined") {
            return "Undefined";
        }
        if (p === null) {
            return "Null";
        }
        return Object.prototype.toString.call(p).slice(8, -1);
    };
    this.isUndefined = function(p) {
        return typeof p === "undefined";
    };
/**
 * 严格等于null
 * {*}
 * return {Boolean}
 */
    this.isNull = function(p) {
        return p === null;
    };
    this.isUndefinedOrNull = function(p) {
        return p == null;
    };
    //同isUndefinedOrNull;之所以再定义一个相同功能的函数,只是为了避免记不清而不能确定函数名
    this.isNullOrUndefined = function(p) {
        return p == null;
    };
    this.isString = function(p) {
        return this.getType(p) === "String";
    };
    this.isNumber = function(p) {
        return this.getType(p) === "Number";
    };
    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    this.isNaN = function(obj) {
        return this.isNumber(obj) && obj !== +obj;
    };
    this.isInteger = function(p) {
        return this.isNumber(p) && /^-?\d+$/.test(p);
    };
    this.isFloat = function(p) {
        return this.isNumber(p) && /^-?\d*\.\d+$/.test(p);
    };
    this.isBoolean = function(p) {
        return this.getType(p) === "Boolean";
    };
    this.isRegExp = function(p) {
        return this.getType(p) === "RegExp";
    };
    this.isArray = function(p) {
        return Array.isArray ? Array.isArray(p) : this.getType(p) === "Array";
    };
    this.isDate = function(p) {
        return this.getType(p) === "Date";
    };
    /**
 * typeof Object|Array|Date|Arguments|HtmlElement 都为 object
 * return {Boolean}
 */
    this.isObject = function(p) {
        return typeof p === "object" && p !== null;
    };
    this.isPlainObject = function(p) {
        return this.getType(p) === "Object";
    };
    var i;
    for (i in new noop()) {
        break;
    }
    var ownLast = i !== undefined;
    var hasOwn = Object.prototype.hasOwnProperty;
    /**
 * 通过 new Object() 或者 字面量 定义的对象
 * {Object}
 * return {Boolean}
 */
    this.isRawObject = function(obj) {
        var key;
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || this.getType(obj) !== "Object" || obj.nodeType || this.isWindow(obj)) {
            return false;
        }
        try {
            // Not own constructor property must be Object
            if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }
        // Support: IE<9
        // Handle iteration over inherited properties before own properties.
        if (ownLast) {
            for (key in obj) {
                return hasOwn.call(obj, key);
            }
        }
        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        for (key in obj) {}
        return key === undefined || hasOwn.call(obj, key);
    };
    
    this.isFunction = function(p) {
        return typeof p === "function";
    };

    /*this.isArrayLike = function(p) {
      return (this.isObject(p) || this.isFunction(p)) && !this.isNullOrUndefined(p.length);
    };*/
    this.isArrayLike = function(collection) {
        var length = collection && collection.length;
        return typeof length == "number" && length >= 0 && length <= MAX_ARRAY_INDEX;
    };
    /**
 * @param {String|Array|PlainObject} p
 * @return {Boolean}
 */
    this.isNotEmpty = function(p) {
        if (this.isNullOrUndefined(p) || p === "") {
            return false;
        }
        if (this.isArray(p) && p.length === 0) {
            return false;
        }
        if (this.isPlainObject(p)) {
            for (var i in p) {
                if (p.hasOwnProperty(i)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    };
    
    this.now = function() {
        return Date.now ? Date.now() : new Date().getTime();
    };

    this.debounce = function(func, wait, immediate) {
        // immediate默认为false
        var timeout, args, context, timestamp, result;
        var me = this;
        var later = function() {
            // 当wait指定的时间间隔期间多次调用_.debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
            var last = me.now() - timestamp;
            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };
        return function() {
            context = this;
            args = arguments;
            timestamp = me.now();
            // 第一次调用该方法时，且immediate为true，则调用func函数
            var callNow = immediate && !timeout;
            // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }
            return result;
        };
    };

    this.noop = noop;

    function noop() {}

}).call(Lang.prototype);

module.exports = new Lang();