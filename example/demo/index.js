/**
 * Created by june on 2017/1/16.
 */
define([
    'base/element'
    , 'pro/widget/BaseComponent'
    , 'text!./index.html'
    , 'pro/components/toast/toast'
    , '../Label/index.js'
], function (_e, BaseComponent, tpl, Toast, Label) {
    return BaseComponent.extend({
        template: tpl,
        config: function () {
        },
        init: function () {
            this.supr();
        },
        _tap: function () {
            this.$emit('tap');
        }
    }).component('Label', Label);
});