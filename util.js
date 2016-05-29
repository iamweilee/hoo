
var object = require("./object");
var array = require("./array");
var lang = require("./lang");
var uuid = require("./uuid");

function Util() {}

(function() {
    /**
 * array和object里都有了各自的each和forEach,这里为何还要再弄个呢?
 * 很多场景,我们并不想或并不能完全确定传入的实参的各层属性到底是Array还是PlainObject,
 * 这种情况下就用这里的each和forEach,免得在业务逻辑里再去判断类型并选择导入array模块还是object模块
 */
    //each可从内部中断,当findSuper为true时把继承而来的property也一起遍历
    this.each = function(p, callback, findSuper) {
        return lang.isArray(p) ? array.each(p, callback, findSuper) : object.each(p, callback, findSuper);
    };
    //each不可从内部中断,当findSuper为true时把继承而来的property也一起遍历
    this.forEach = function(p, callback, findSuper) {
        lang.isArray(p) ? array.forEach(p, callback, findSuper) : object.forEach(p, callback, findSuper);
    };
    this.uuid = function(prefix) {
        var uid = uuid.uuid(8);
        return prefix ? prefix + uid : uid;
    };
}).call(Util.prototype);

module.exports = new Util();