/**
 * ------------------------------------------
 * ���ı��༭���ӿ�ʵ���ļ�
 * @version  1.0
 * @author   genify(caijf)
 * ------------------------------------------
 */
NEJ.define([
    'base/util'
],function(u,p){
    /**
     * ����ͼƬ�б�
     * @param datatrans
     * @private
     */
    p.__dumpImages = function(board){
        var ret = [];
        u._$forEach(board.items,function(it){
            if (it.kind==='file'&&
                it.type.indexOf('image')>-1){
                ret.push(it.getAsFile());
            }
        });
        return ret;
    };


});


