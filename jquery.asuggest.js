/*
 * jQuery textarea suggest plugin
 *
 * Copyright (c) 2009 Roman Imankulov
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Requires:
 *   - jQuery (tested with 1.3.2)
 *   - jquery.fieldselection >= 0.2 (http://labs.0xab.cd/jquery/fieldselection/0.2.3-test/)
 */

; (function($) {

    $.fn.asuggest = function(suggests, options) {
        return this.each(function(){
            $.makeSuggest(this, suggests, options);
        });
    };

    $.fn.asuggest.defaults = {
        'delimiters': '\n ',
        'minChunkSize': 1
    };

    /* Make suggest:
     *
     * create and return jQuery object on the top of DOM object
     * and store suggests as part of this object
     *
     * @param area: HTML DOM element to add suggests to
     * @param suggests: The array of suggest strings
     * @param options: The options object
     */
    $.makeSuggest = function(area, suggests, options){
        options = $.extend({}, $.fn.asuggest.defaults, options);

        var KEY = {
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40,
                DEL: 46,
                TAB: 9,
                RETURN: 13,
                ESC: 27,
                COMMA: 188,
                PAGEUP: 33,
                PAGEDOWN: 34,
                BACKSPACE: 8
        };

        var $area = $(area);
        $area.suggests = suggests;
        $area.options = options;
    
        /* Internal method: get the chunk */
        $area.getChunk = function() {
            var delimiters = this.options.delimiters.split(""); // array of chars
            var textBeforeCursor = this.val().substr(0, this.getSelection().start)
            var indexOfDelimiter = -1;
            for (var i in delimiters) {
                var d = delimiters[i];
                var idx = textBeforeCursor.lastIndexOf(d);
                if (idx > indexOfDelimiter) {
                    indexOfDelimiter = idx;
                }
            }
            if (indexOfDelimiter < 0){
                return textBeforeCursor;
            } else {
                return textBeforeCursor.substr(indexOfDelimiter+1);
            }
        }

        /* Internal method: get completion */
        $area.getCompletion = function() {
            var text = this.getChunk();
            var suggests = this.suggests;
            for (var i=0; i<suggests.length; i++){
                var suggest = suggests[i];
                if (suggest.indexOf(text) == 0){
                    return suggest.substr(text.length);
                }
            }
            return null;
        }
   
        $area.keyup(function(e){
            switch(e.keyCode){

            case KEY.ESC:
            case KEY.BACKSPACE:
            case KEY.DEL:
            case KEY.UP:
            case KEY.DOWN:
            case KEY.LEFT:
            case KEY.RIGHT:
               var _selectionStart = $area.getSelection().start;
               $area.replaceSelection("");
               this.selectionStart = _selectionStart;
               this.selectionEnd = _selectionStart;
               break;

            default:
                var chunk = $area.getChunk();
                if (chunk.length >= $area.options.minChunkSize) {
                    var completion = $area.getCompletion();
                    if (completion != null){
                        var _selectionStart = $area.getSelection().start;
                        $area.replaceSelection(completion);
                        this.selectionStart = _selectionStart;
                        this.selectionEnd = _selectionStart + completion.length;
                    }
                }
                break;
            }
        });

        return $area;
    };
})(jQuery);
