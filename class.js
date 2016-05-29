
var object = require("./object");

function Class() {}

(function() {
    this.inherit = function(subClass, superClass) {
        var cleanSuperClassPrototype;
        if (Object.create) {
            cleanSuperClassPrototype = Object.create(superClass.prototype);
        } else {
            var F = new Function();
            F.prototype = superClass.prototype;
            cleanSuperClassPrototype = new F();
        }
        subClass.superClass = superClass;
        //缓存原来的原型函数,后面再恢复
        var originalSubClassProto = subClass.prototype;
        /**
   * 这里为什么不直接new superClass而是要引入中介函数F呢? 
   * 是为了减少不必要的内存消耗,因为不确定superClass的构造函数做了多少操作,
   * 也许某个操作是相当耗时耗内存的
   */
        subClass.prototype = cleanSuperClassPrototype;
        cleanSuperClassPrototype = null;
        //恢复原来的原型函数
        object.forEach(originalSubClassProto, function(fn, property) {
            if (subClass.prototype[property]) {
                fn["__propertyname__"] = property;
                fn["__superclass__"] = superClass;
            }
            subClass.prototype[property] = fn;
        }, true);
        if (!superClass.prototype.$superMethod) {
            superClass.prototype.$superMethod = function(args) {
                var method = this.$superMethod.caller;
                var methodName = method["__propertyname__"];
                var _superClass = method["__superclass__"];
                _superClass.prototype[methodName].apply(this, args);
            };
        }
        if (!superClass.prototype.$superConstructor) {
            superClass.prototype.$superConstructor = function(args) {
                var method = this.$superConstructor.caller;
                method.superClass.apply(this, args);
            };
        }
        subClass.prototype.constructor = subClass;
        return subClass;
    };
}).call(Class.prototype);

module.exports = new Class();