var initMirrorCustomExtensions = function() {
              CodeMirror.extendMode("css", {
                commentStart: "/*",
                commentEnd: "*/",
                newlineAfterToken: function(type, content) {
                  return /^[;{}]$/.test(content);
                }
              });
              CodeMirror.extendMode("javascript", {
                commentStart: "/*",
                commentEnd: "*/",
                // FIXME semicolons inside of for
                newlineAfterToken: function(type, content, textAfter, state) {
                  if (this.jsonMode) {
                    return /^[\[,{]$/.test(content) || /^}/.test(textAfter);
                  } else {
                    if (content == ";" && state.lexical && state.lexical.type == ")") return false;
                    return /^[;{}]$/.test(content) && !/^;/.test(textAfter);
                  }
                }
              });
              CodeMirror.extendMode("xml", {
                commentStart: "<!--",
                commentEnd: "-->",
                newlineAfterToken: function(type, content, textAfter) {
                  return type == "tag" && />$/.test(content) || /^</.test(textAfter);
                }
              });
              // Comment/uncomment the specified range
              CodeMirror.defineExtension("commentRange", function (isComment, from, to) {
                var cm = this, curMode = CodeMirror.innerMode(cm.getMode(), cm.getTokenAt(from).state).mode;
                cm.operation(function() {
                  if (isComment) { // Comment range
                    cm.replaceRange(curMode.commentEnd, to);
                    cm.replaceRange(curMode.commentStart, from);
                    if (from.line == to.line && from.ch == to.ch) // An empty comment inserted - put cursor inside
                      cm.setCursor(from.line, from.ch + curMode.commentStart.length);
                  } else { // Uncomment range
                    var selText = cm.getRange(from, to);
                    var startIndex = selText.indexOf(curMode.commentStart);
                    var endIndex = selText.lastIndexOf(curMode.commentEnd);
                    if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
                      // Take string till comment start
                      selText = selText.substr(0, startIndex)
                      // From comment start till comment end
                        + selText.substring(startIndex + curMode.commentStart.length, endIndex)
                      // From comment end till string end
                        + selText.substr(endIndex + curMode.commentEnd.length);
                    }
                    cm.replaceRange(selText, from, to);
                  }
                });
              });
              // Applies automatic mode-aware indentation to the specified range
              CodeMirror.defineExtension("autoIndentRange", function (from, to) {
                var cmInstance = this;
                this.operation(function () {
                  for (var i = from.line; i <= to.line; i++) {
                    cmInstance.indentLine(i, "smart");
                  }
                });
              });
              // Applies automatic formatting to the specified range
              CodeMirror.defineExtension("autoFormatRange", function (from, to) {
                var cm = this;
                var outer = cm.getMode(), text = cm.getRange(from, to).split("\n");
                var state = CodeMirror.copyState(outer, cm.getTokenAt(from).state);
                var tabSize = cm.getOption("tabSize");
                var out = "", lines = 0, atSol = from.ch == 0;
                function newline() {
                  out += "\n";
                  atSol = true;
                  ++lines;
                }
                for (var i = 0; i < text.length; ++i) {
                  var stream = new CodeMirror.StringStream(text[i], tabSize);
                  while (!stream.eol()) {
                    var inner = CodeMirror.innerMode(outer, state);
                    var style = outer.token(stream, state), cur = stream.current();
                    stream.start = stream.pos;
                    if (!atSol || /\S/.test(cur)) {
                      out += cur;
                      atSol = false;
                    }
                    if (!atSol && inner.mode.newlineAfterToken &&
                        inner.mode.newlineAfterToken(style, cur, stream.string.slice(stream.pos) || text[i+1] || "", inner.state))
                      newline();
                  }
                  if (!stream.pos && outer.blankLine) outer.blankLine(state);
                  if (!atSol) newline();
                }
                cm.operation(function () {
                  cm.replaceRange(out, from, to);
                  for (var cur = from.line + 1, end = from.line + lines; cur <= end; ++cur)
                    cm.indentLine(cur, "smart");
                  cm.setSelection(from, cm.getCursor(false));
                });
              });
            };
if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

(function(n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else{if("function"==typeof define&&define.amd)return define([],n);(this||window).CodeMirror=n()}})(function(){function n(a,b){if(!(this instanceof n))return new n(a,b);this.options=b=b?X(b):{};X(wf,b,!1);wc(b);var c=b.value;"string"==typeof c&&(c=new P(c,b.mode,null,b.lineSeparator));this.doc=c;var d=new n.inputStyles[b.inputStyle](this),d=this.display=new xf(a,c,d);d.wrapper.CodeMirror=this;zd(this);Ad(this);b.lineWrapping&&
(this.display.wrapper.className+=" CodeMirror-wrap");b.autofocus&&!bb&&d.input.focus();Bd(this);this.state={keyMaps:[],overlays:[],modeGen:0,overwrite:!1,delayingBlurEvent:!1,focused:!1,suppressEdits:!1,pasteIncoming:!1,cutIncoming:!1,selectingText:!1,draggingText:!1,highlight:new ua,keySeq:null,specialChars:null};var e=this;A&&11>C&&setTimeout(function(){e.display.input.reset(!0)},20);yf(this);Cd||(zf(),Cd=!0);Ka(this);this.curOp.forceUpdate=!0;Dd(this,c);b.autofocus&&!bb||e.hasFocus()?setTimeout(cb(xc,
this),20):db(this);for(var f in La)if(La.hasOwnProperty(f))La[f](this,b[f],Ed);Fd(this);b.finishInit&&b.finishInit(this);for(c=0;c<yc.length;++c)yc[c](this);Ma(this);K&&b.lineWrapping&&"optimizelegibility"==getComputedStyle(d.lineDiv).textRendering&&(d.lineDiv.style.textRendering="auto")}function xf(a,b,c){this.input=c;this.scrollbarFiller=r("div",null,"CodeMirror-scrollbar-filler");this.scrollbarFiller.setAttribute("cm-not-content","true");this.gutterFiller=r("div",null,"CodeMirror-gutter-filler");
this.gutterFiller.setAttribute("cm-not-content","true");this.lineDiv=r("div",null,"CodeMirror-code");this.selectionDiv=r("div",null,null,"position: relative; z-index: 1");this.cursorDiv=r("div",null,"CodeMirror-cursors");this.measure=r("div",null,"CodeMirror-measure");this.lineMeasure=r("div",null,"CodeMirror-measure");this.lineSpace=r("div",[this.measure,this.lineMeasure,this.selectionDiv,this.cursorDiv,this.lineDiv],null,"position: relative; outline: none");this.mover=r("div",[r("div",[this.lineSpace],
"CodeMirror-lines")],null,"position: relative");this.sizer=r("div",[this.mover],"CodeMirror-sizer");this.sizerWidth=null;this.heightForcer=r("div",null,null,"position: absolute; height: "+Gd+"px; width: 1px;");this.gutters=r("div",null,"CodeMirror-gutters");this.lineGutter=null;this.scroller=r("div",[this.sizer,this.heightForcer,this.gutters],"CodeMirror-scroll");this.scroller.setAttribute("tabIndex","-1");this.wrapper=r("div",[this.scrollbarFiller,this.gutterFiller,this.scroller],"CodeMirror");A&&
8>C&&(this.gutters.style.zIndex=-1,this.scroller.style.paddingRight=0);K||oa&&bb||(this.scroller.draggable=!0);a&&(a.appendChild?a.appendChild(this.wrapper):a(this.wrapper));this.reportedViewFrom=this.reportedViewTo=this.viewFrom=this.viewTo=b.first;this.view=[];this.externalMeasured=this.renderedView=null;this.lastWrapHeight=this.lastWrapWidth=this.viewOffset=0;this.updateLineNumbers=null;this.nativeBarWidth=this.barHeight=this.barWidth=0;this.scrollbarsClipped=!1;this.lineNumWidth=this.lineNumInnerWidth=
this.lineNumChars=null;this.alignWidgets=!1;this.maxLine=this.cachedCharWidth=this.cachedTextHeight=this.cachedPaddingH=null;this.maxLineLength=0;this.maxLineChanged=!1;this.wheelDX=this.wheelDY=this.wheelStartX=this.wheelStartY=null;this.shift=!1;this.activeTouch=this.selForContextMenu=null;c.init(this)}function zc(a){a.doc.mode=n.getMode(a.options,a.doc.modeOption);eb(a)}function eb(a){a.doc.iter(function(a){a.stateAfter&&(a.stateAfter=null);a.styles&&(a.styles=null)});a.doc.frontier=a.doc.first;
fb(a,100);a.state.modeGen++;a.curOp&&O(a)}function Hd(a){var b=va(a.display),c=a.options.lineWrapping,d=c&&Math.max(5,a.display.scroller.clientWidth/gb(a.display)-3);return function(e){if(wa(a.doc,e))return 0;var f=0;if(e.widgets)for(var g=0;g<e.widgets.length;g++)e.widgets[g].height&&(f+=e.widgets[g].height);return c?f+(Math.ceil(e.text.length/d)||1)*b:f+b}}function Ac(a){var b=a.doc,c=Hd(a);b.iter(function(a){var b=c(a);b!=a.height&&ca(a,b)})}function Ad(a){a.display.wrapper.className=a.display.wrapper.className.replace(/\s*cm-s-\S+/g,
"")+a.options.theme.replace(/(^|\s)\s*/g," cm-s-");hb(a)}function ib(a){zd(a);O(a);setTimeout(function(){Bc(a)},20)}function zd(a){var b=a.display.gutters,c=a.options.gutters;xa(b);for(var d=0;d<c.length;++d){var e=c[d],f=b.appendChild(r("div",null,"CodeMirror-gutter "+e));"CodeMirror-linenumbers"==e&&(a.display.lineGutter=f,f.style.width=(a.display.lineNumWidth||1)+"px")}b.style.display=d?"":"none";Cc(a)}function Cc(a){a.display.sizer.style.marginLeft=a.display.gutters.offsetWidth+"px"}function Jb(a){if(0==
a.height)return 0;for(var b=a.text.length,c,d=a;c=ya(d,!0);)c=c.find(0,!0),d=c.from.line,b+=c.from.ch-c.to.ch;for(d=a;c=ya(d,!1);)c=c.find(0,!0),b-=d.text.length-c.from.ch,d=c.to.line,b+=d.text.length-c.to.ch;return b}function Dc(a){var b=a.display;a=a.doc;b.maxLine=t(a,a.first);b.maxLineLength=Jb(b.maxLine);b.maxLineChanged=!0;a.iter(function(a){var d=Jb(a);d>b.maxLineLength&&(b.maxLineLength=d,b.maxLine=a)})}function wc(a){var b=D(a.gutters,"CodeMirror-linenumbers");-1==b&&a.lineNumbers?a.gutters=
a.gutters.concat(["CodeMirror-linenumbers"]):-1<b&&!a.lineNumbers&&(a.gutters=a.gutters.slice(0),a.gutters.splice(b,1))}function jb(a){var b=a.display,c=b.gutters.offsetWidth,d=Math.round(a.doc.height+Ec(a.display));return{clientHeight:b.scroller.clientHeight,viewHeight:b.wrapper.clientHeight,scrollWidth:b.scroller.scrollWidth,clientWidth:b.scroller.clientWidth,viewWidth:b.wrapper.clientWidth,barLeft:a.options.fixedGutter?c:0,docHeight:d,scrollHeight:d+da(a)+b.barHeight,nativeBarWidth:b.nativeBarWidth,
gutterWidth:c}}function Fc(a,b,c){this.cm=c;var d=this.vert=r("div",[r("div",null,null,"min-width: 1px")],"CodeMirror-vscrollbar"),e=this.horiz=r("div",[r("div",null,null,"height: 100%; min-height: 1px")],"CodeMirror-hscrollbar");a(d);a(e);u(d,"scroll",function(){d.clientHeight&&b(d.scrollTop,"vertical")});u(e,"scroll",function(){e.clientWidth&&b(e.scrollLeft,"horizontal")});this.checkedZeroWidth=!1;A&&8>C&&(this.horiz.style.minHeight=this.vert.style.minWidth="18px")}function Gc(){}function Bd(a){a.display.scrollbars&&
(a.display.scrollbars.clear(),a.display.scrollbars.addClass&&kb(a.display.wrapper,a.display.scrollbars.addClass));a.display.scrollbars=new n.scrollbarModel[a.options.scrollbarStyle](function(b){a.display.wrapper.insertBefore(b,a.display.scrollbarFiller);u(b,"mousedown",function(){a.state.focused&&setTimeout(function(){a.display.input.focus()},0)});b.setAttribute("cm-not-content","true")},function(b,c){"horizontal"==c?Na(a,b):lb(a,b)},a);a.display.scrollbars.addClass&&mb(a.display.wrapper,a.display.scrollbars.addClass)}
function Oa(a,b){b||(b=jb(a));var c=a.display.barWidth,d=a.display.barHeight;Id(a,b);for(var e=0;4>e&&c!=a.display.barWidth||d!=a.display.barHeight;e++)c!=a.display.barWidth&&a.options.lineWrapping&&Kb(a),Id(a,jb(a)),c=a.display.barWidth,d=a.display.barHeight}function Id(a,b){var c=a.display,d=c.scrollbars.update(b);c.sizer.style.paddingRight=(c.barWidth=d.right)+"px";c.sizer.style.paddingBottom=(c.barHeight=d.bottom)+"px";d.right&&d.bottom?(c.scrollbarFiller.style.display="block",c.scrollbarFiller.style.height=
d.bottom+"px",c.scrollbarFiller.style.width=d.right+"px"):c.scrollbarFiller.style.display="";d.bottom&&a.options.coverGutterNextToScrollbar&&a.options.fixedGutter?(c.gutterFiller.style.display="block",c.gutterFiller.style.height=d.bottom+"px",c.gutterFiller.style.width=b.gutterWidth+"px"):c.gutterFiller.style.display=""}function Hc(a,b,c){var d=c&&null!=c.top?Math.max(0,c.top):a.scroller.scrollTop,d=Math.floor(d-a.lineSpace.offsetTop),e=c&&null!=c.bottom?c.bottom:d+a.wrapper.clientHeight,d=za(b,d),
e=za(b,e);if(c&&c.ensure){var f=c.ensure.from.line;c=c.ensure.to.line;f<d?(d=f,e=za(b,ea(t(b,f))+a.wrapper.clientHeight)):Math.min(c,b.lastLine())>=e&&(d=za(b,ea(t(b,c))-a.wrapper.clientHeight),e=c)}return{from:d,to:Math.max(e,d+1)}}function Bc(a){var b=a.display,c=b.view;if(b.alignWidgets||b.gutters.firstChild&&a.options.fixedGutter){for(var d=Ic(b)-b.scroller.scrollLeft+a.doc.scrollLeft,e=b.gutters.offsetWidth,f=d+"px",g=0;g<c.length;g++)if(!c[g].hidden){a.options.fixedGutter&&c[g].gutter&&(c[g].gutter.style.left=
f);var h=c[g].alignable;if(h)for(var k=0;k<h.length;k++)h[k].style.left=f}a.options.fixedGutter&&(b.gutters.style.left=d+e+"px")}}function Fd(a){if(!a.options.lineNumbers)return!1;var b=a.doc,b=Jc(a.options,b.first+b.size-1),c=a.display;if(b.length!=c.lineNumChars){var d=c.measure.appendChild(r("div",[r("div",b)],"CodeMirror-linenumber CodeMirror-gutter-elt")),e=d.firstChild.offsetWidth,d=d.offsetWidth-e;c.lineGutter.style.width="";c.lineNumInnerWidth=Math.max(e,c.lineGutter.offsetWidth-d)+1;c.lineNumWidth=
c.lineNumInnerWidth+d;c.lineNumChars=c.lineNumInnerWidth?b.length:-1;c.lineGutter.style.width=c.lineNumWidth+"px";Cc(a);return!0}return!1}function Jc(a,b){return String(a.lineNumberFormatter(b+a.firstLineNumber))}function Ic(a){return a.scroller.getBoundingClientRect().left-a.sizer.getBoundingClientRect().left}function Lb(a,b,c){var d=a.display;this.viewport=b;this.visible=Hc(d,a.doc,b);this.editorIsHidden=!d.wrapper.offsetWidth;this.wrapperHeight=d.wrapper.clientHeight;this.wrapperWidth=d.wrapper.clientWidth;
this.oldDisplayWidth=pa(a);this.force=c;this.dims=Kc(a);this.events=[]}function Lc(a,b){var c=a.display,d=a.doc;if(b.editorIsHidden)return qa(a),!1;if(!b.force&&b.visible.from>=c.viewFrom&&b.visible.to<=c.viewTo&&(null==c.updateLineNumbers||c.updateLineNumbers>=c.viewTo)&&c.renderedView==c.view&&0==Jd(a))return!1;Fd(a)&&(qa(a),b.dims=Kc(a));var e=d.first+d.size,f=Math.max(b.visible.from-a.options.viewportMargin,d.first),g=Math.min(e,b.visible.to+a.options.viewportMargin);c.viewFrom<f&&20>f-c.viewFrom&&
(f=Math.max(d.first,c.viewFrom));c.viewTo>g&&20>c.viewTo-g&&(g=Math.min(e,c.viewTo));ra&&(f=Mc(a.doc,f),g=Kd(a.doc,g));d=f!=c.viewFrom||g!=c.viewTo||c.lastWrapHeight!=b.wrapperHeight||c.lastWrapWidth!=b.wrapperWidth;e=a.display;0==e.view.length||f>=e.viewTo||g<=e.viewFrom?(e.view=Mb(a,f,g),e.viewFrom=f):(e.viewFrom>f?e.view=Mb(a,f,e.viewFrom).concat(e.view):e.viewFrom<f&&(e.view=e.view.slice(Aa(a,f))),e.viewFrom=f,e.viewTo<g?e.view=e.view.concat(Mb(a,e.viewTo,g)):e.viewTo>g&&(e.view=e.view.slice(0,
Aa(a,g))));e.viewTo=g;c.viewOffset=ea(t(a.doc,c.viewFrom));a.display.mover.style.top=c.viewOffset+"px";g=Jd(a);if(!d&&0==g&&!b.force&&c.renderedView==c.view&&(null==c.updateLineNumbers||c.updateLineNumbers>=c.viewTo))return!1;f=fa();4<g&&(c.lineDiv.style.display="none");Af(a,c.updateLineNumbers,b.dims);4<g&&(c.lineDiv.style.display="");c.renderedView=c.view;f&&fa()!=f&&f.offsetHeight&&f.focus();xa(c.cursorDiv);xa(c.selectionDiv);c.gutters.style.height=c.sizer.style.minHeight=0;d&&(c.lastWrapHeight=
b.wrapperHeight,c.lastWrapWidth=b.wrapperWidth,fb(a,400));c.updateLineNumbers=null;return!0}function Ld(a,b){for(var c=b.viewport,d=!0;;d=!1){if(!d||!a.options.lineWrapping||b.oldDisplayWidth==pa(a))if(c&&null!=c.top&&(c={top:Math.min(a.doc.height+Ec(a.display)-Nc(a),c.top)}),b.visible=Hc(a.display,a.doc,c),b.visible.from>=a.display.viewFrom&&b.visible.to<=a.display.viewTo)break;if(!Lc(a,b))break;Kb(a);d=jb(a);nb(a);Oc(a,d);Oa(a,d)}b.signal(a,"update",a);if(a.display.viewFrom!=a.display.reportedViewFrom||
a.display.viewTo!=a.display.reportedViewTo)b.signal(a,"viewportChange",a,a.display.viewFrom,a.display.viewTo),a.display.reportedViewFrom=a.display.viewFrom,a.display.reportedViewTo=a.display.viewTo}function Pc(a,b){var c=new Lb(a,b);if(Lc(a,c)){Kb(a);Ld(a,c);var d=jb(a);nb(a);Oc(a,d);Oa(a,d);c.finish()}}function Oc(a,b){a.display.sizer.style.minHeight=b.docHeight+"px";var c=b.docHeight+a.display.barHeight;a.display.heightForcer.style.top=c+"px";a.display.gutters.style.height=Math.max(c+da(a),b.clientHeight)+
"px"}function Kb(a){a=a.display;for(var b=a.lineDiv.offsetTop,c=0;c<a.view.length;c++){var d=a.view[c],e;if(!d.hidden){if(A&&8>C){var f=d.node.offsetTop+d.node.offsetHeight;e=f-b;b=f}else e=d.node.getBoundingClientRect(),e=e.bottom-e.top;f=d.line.height-e;2>e&&(e=va(a));if(.001<f||-.001>f)if(ca(d.line,e),Md(d.line),d.rest)for(e=0;e<d.rest.length;e++)Md(d.rest[e])}}}function Md(a){if(a.widgets)for(var b=0;b<a.widgets.length;++b)a.widgets[b].height=a.widgets[b].node.parentNode.offsetHeight}function Kc(a){for(var b=
a.display,c={},d={},e=b.gutters.clientLeft,f=b.gutters.firstChild,g=0;f;f=f.nextSibling,++g)c[a.options.gutters[g]]=f.offsetLeft+f.clientLeft+e,d[a.options.gutters[g]]=f.clientWidth;return{fixedPos:Ic(b),gutterTotalWidth:b.gutters.offsetWidth,gutterLeft:c,gutterWidth:d,wrapperWidth:b.wrapper.clientWidth}}function Af(a,b,c){function d(b){var c=b.nextSibling;K&&Y&&a.display.currentWheelTarget==b?b.style.display="none":b.parentNode.removeChild(b);return c}for(var e=a.display,f=a.options.lineNumbers,
g=e.lineDiv,h=g.firstChild,k=e.view,e=e.viewFrom,l=0;l<k.length;l++){var m=k[l];if(!m.hidden)if(m.node&&m.node.parentNode==g){for(;h!=m.node;)h=d(h);h=f&&null!=b&&b<=e&&m.lineNumber;m.changes&&(-1<D(m.changes,"gutter")&&(h=!1),Nd(a,m,e,c));h&&(xa(m.lineNumber),m.lineNumber.appendChild(document.createTextNode(Jc(a.options,e))));h=m.node.nextSibling}else{var s=Bf(a,m,e,c);g.insertBefore(s,h)}e+=m.size}for(;h;)h=d(h)}function Nd(a,b,c,d){for(var e=0;e<b.changes.length;e++){var f=b.changes[e];if("text"==
f){var f=b,g=f.text.className,h=Od(a,f);f.text==f.node&&(f.node=h.pre);f.text.parentNode.replaceChild(h.pre,f.text);f.text=h.pre;h.bgClass!=f.bgClass||h.textClass!=f.textClass?(f.bgClass=h.bgClass,f.textClass=h.textClass,Qc(f)):g&&(f.text.className=g)}else if("gutter"==f)Pd(a,b,c,d);else if("class"==f)Qc(b);else if("widget"==f){f=a;g=b;h=d;g.alignable&&(g.alignable=null);for(var k=g.node.firstChild,l=void 0;k;k=l)l=k.nextSibling,"CodeMirror-linewidget"==k.className&&g.node.removeChild(k);Qd(f,g,h)}}b.changes=
null}function ob(a){a.node==a.text&&(a.node=r("div",null,null,"position: relative"),a.text.parentNode&&a.text.parentNode.replaceChild(a.node,a.text),a.node.appendChild(a.text),A&&8>C&&(a.node.style.zIndex=2));return a.node}function Od(a,b){var c=a.display.externalMeasured;return c&&c.line==b.line?(a.display.externalMeasured=null,b.measure=c.measure,c.built):Rd(a,b)}function Qc(a){var b=a.bgClass?a.bgClass+" "+(a.line.bgClass||""):a.line.bgClass;b&&(b+=" CodeMirror-linebackground");if(a.background)b?
a.background.className=b:(a.background.parentNode.removeChild(a.background),a.background=null);else if(b){var c=ob(a);a.background=c.insertBefore(r("div",null,b),c.firstChild)}a.line.wrapClass?ob(a).className=a.line.wrapClass:a.node!=a.text&&(a.node.className="");a.text.className=(a.textClass?a.textClass+" "+(a.line.textClass||""):a.line.textClass)||""}function Pd(a,b,c,d){b.gutter&&(b.node.removeChild(b.gutter),b.gutter=null);b.gutterBackground&&(b.node.removeChild(b.gutterBackground),b.gutterBackground=
null);if(b.line.gutterClass){var e=ob(b);b.gutterBackground=r("div",null,"CodeMirror-gutter-background "+b.line.gutterClass,"left: "+(a.options.fixedGutter?d.fixedPos:-d.gutterTotalWidth)+"px; width: "+d.gutterTotalWidth+"px");e.insertBefore(b.gutterBackground,b.text)}var f=b.line.gutterMarkers;if(a.options.lineNumbers||f){var e=ob(b),g=b.gutter=r("div",null,"CodeMirror-gutter-wrapper","left: "+(a.options.fixedGutter?d.fixedPos:-d.gutterTotalWidth)+"px");a.display.input.setUneditable(g);e.insertBefore(g,
b.text);b.line.gutterClass&&(g.className+=" "+b.line.gutterClass);!a.options.lineNumbers||f&&f["CodeMirror-linenumbers"]||(b.lineNumber=g.appendChild(r("div",Jc(a.options,c),"CodeMirror-linenumber CodeMirror-gutter-elt","left: "+d.gutterLeft["CodeMirror-linenumbers"]+"px; width: "+a.display.lineNumInnerWidth+"px")));if(f)for(b=0;b<a.options.gutters.length;++b)c=a.options.gutters[b],(e=f.hasOwnProperty(c)&&f[c])&&g.appendChild(r("div",[e],"CodeMirror-gutter-elt","left: "+d.gutterLeft[c]+"px; width: "+
d.gutterWidth[c]+"px"))}}function Bf(a,b,c,d){var e=Od(a,b);b.text=b.node=e.pre;e.bgClass&&(b.bgClass=e.bgClass);e.textClass&&(b.textClass=e.textClass);Qc(b);Pd(a,b,c,d);Qd(a,b,d);return b.node}function Qd(a,b,c){Sd(a,b.line,b,c,!0);if(b.rest)for(var d=0;d<b.rest.length;d++)Sd(a,b.rest[d],b,c,!1)}function Sd(a,b,c,d,e){if(b.widgets){var f=ob(c),g=0;for(b=b.widgets;g<b.length;++g){var h=b[g],k=r("div",[h.node],"CodeMirror-linewidget");h.handleMouseEvents||k.setAttribute("cm-ignore-events","true");
var l=h,m=k,s=d;if(l.noHScroll){(c.alignable||(c.alignable=[])).push(m);var p=s.wrapperWidth;m.style.left=s.fixedPos+"px";l.coverGutter||(p-=s.gutterTotalWidth,m.style.paddingLeft=s.gutterTotalWidth+"px");m.style.width=p+"px"}l.coverGutter&&(m.style.zIndex=5,m.style.position="relative",l.noHScroll||(m.style.marginLeft=-s.gutterTotalWidth+"px"));a.display.input.setUneditable(k);e&&h.above?f.insertBefore(k,c.gutter||c.text):f.appendChild(k);Q(h,"redraw")}}}function Rc(a){return q(a.line,a.ch)}function Nb(a,
b){return 0>w(a,b)?b:a}function Ob(a,b){return 0>w(a,b)?a:b}function Td(a){a.state.focused||(a.display.input.focus(),xc(a))}function Pb(a,b,c,d,e){var f=a.doc;a.display.shift=!1;d||(d=f.sel);var g=a.state.pasteIncoming||"paste"==e,h=f.splitLines(b),k=null;if(g&&1<d.ranges.length)if(V&&V.join("\n")==b){if(0==d.ranges.length%V.length)for(var k=[],l=0;l<V.length;l++)k.push(f.splitLines(V[l]))}else h.length==d.ranges.length&&(k=Qb(h,function(a){return[a]}));for(l=d.ranges.length-1;0<=l;l--){var m=d.ranges[l],
s=m.from(),p=m.to();m.empty()&&(c&&0<c?s=q(s.line,s.ch-c):a.state.overwrite&&!g&&(p=q(p.line,Math.min(t(f,p.line).text.length,p.ch+z(h).length))));m=a.curOp.updateInput;s={from:s,to:p,text:k?k[l%k.length]:h,origin:e||(g?"paste":a.state.cutIncoming?"cut":"+input")};Pa(a.doc,s);Q(a,"inputRead",a,s)}b&&!g&&Ud(a,b);Qa(a);a.curOp.updateInput=m;a.curOp.typing=!0;a.state.pasteIncoming=a.state.cutIncoming=!1}function Vd(a,b){var c=a.clipboardData&&a.clipboardData.getData("text/plain");if(c)return a.preventDefault(),
b.isReadOnly()||b.options.disableInput||R(b,function(){Pb(b,c,0,null,"paste")}),!0}function Ud(a,b){if(a.options.electricChars&&a.options.smartIndent)for(var c=a.doc.sel,d=c.ranges.length-1;0<=d;d--){var e=c.ranges[d];if(!(100<e.head.ch||d&&c.ranges[d-1].head.line==e.head.line)){var f=a.getModeAt(e.head),g=!1;if(f.electricChars)for(var h=0;h<f.electricChars.length;h++){if(-1<b.indexOf(f.electricChars.charAt(h))){g=pb(a,e.head.line,"smart");break}}else f.electricInput&&f.electricInput.test(t(a.doc,
e.head.line).text.slice(0,e.head.ch))&&(g=pb(a,e.head.line,"smart"));g&&Q(a,"electricInput",a,e.head.line)}}}function Wd(a){for(var b=[],c=[],d=0;d<a.doc.sel.ranges.length;d++){var e=a.doc.sel.ranges[d].head.line,e={anchor:q(e,0),head:q(e+1,0)};c.push(e);b.push(a.getRange(e.anchor,e.head))}return{text:b,ranges:c}}function Xd(a){a.setAttribute("autocorrect","off");a.setAttribute("autocapitalize","off");a.setAttribute("spellcheck","false")}function Sc(a){this.cm=a;this.prevInput="";this.pollingFast=
!1;this.polling=new ua;this.hasSelection=this.inaccurateSelection=!1;this.composing=null}function Yd(){var a=r("textarea",null,null,"position: absolute; padding: 0; width: 1px; height: 1em; outline: none"),b=r("div",[a],null,"overflow: hidden; position: relative; width: 3px; height: 0px;");K?a.style.width="1000px":a.setAttribute("wrap","off");Ra&&(a.style.border="1px solid black");Xd(a);return b}function Tc(a){this.cm=a;this.lastAnchorNode=this.lastAnchorOffset=this.lastFocusNode=this.lastFocusOffset=
null;this.polling=new ua;this.gracePeriod=!1}function Zd(a,b){var c=Uc(a,b.line);if(!c||c.hidden)return null;var d=t(a.doc,b.line),c=$d(c,d,b.line),d=Z(d),e="left";d&&(e=Rb(d,b.ch)%2?"right":"left");c=ae(c.map,b.ch,e);c.offset="right"==c.collapse?c.end:c.start;return c}function Sa(a,b){b&&(a.bad=!0);return a}function Sb(a,b,c){var d;if(b==a.display.lineDiv){d=a.display.lineDiv.childNodes[c];if(!d)return Sa(a.clipPos(q(a.display.viewTo-1)),!0);b=null;c=0}else for(d=b;;d=d.parentNode){if(!d||d==a.display.lineDiv)return null;
if(d.parentNode&&d.parentNode==a.display.lineDiv)break}for(var e=0;e<a.display.view.length;e++){var f=a.display.view[e];if(f.node==d)return Cf(f,b,c)}}function Cf(a,b,c){function d(b,c,d){for(var e=-1;e<(l?l.length:0);e++)for(var f=0>e?k.map:l[e],g=0;g<f.length;g+=3){var h=f[g+2];if(h==b||h==c){c=E(0>e?a.line:a.rest[e]);e=f[g]+d;if(0>d||h!=b)e=f[g+(d?1:0)];return q(c,e)}}}var e=a.text.firstChild,f=!1;if(!b||!Vc(e,b))return Sa(q(E(a.line),0),!0);if(b==e&&(f=!0,b=e.childNodes[c],c=0,!b))return c=a.rest?
z(a.rest):a.line,Sa(q(E(c),c.text.length),f);var g=3==b.nodeType?b:null,h=b;g||1!=b.childNodes.length||3!=b.firstChild.nodeType||(g=b.firstChild,c&&(c=g.nodeValue.length));for(;h.parentNode!=e;)h=h.parentNode;var k=a.measure,l=k.maps;if(b=d(g,h,c))return Sa(b,f);e=h.nextSibling;for(g=g?g.nodeValue.length-c:0;e;e=e.nextSibling){if(b=d(e,e.firstChild,0))return Sa(q(b.line,b.ch-g),f);g+=e.textContent.length}h=h.previousSibling;for(g=c;h;h=h.previousSibling){if(b=d(h,h.firstChild,-1))return Sa(q(b.line,
b.ch+g),f);g+=e.textContent.length}}function Df(a,b,c,d,e){function f(a){return function(b){return b.id==a}}function g(b){if(1==b.nodeType){var c=b.getAttribute("cm-text");if(null!=c)""==c&&(c=b.textContent.replace(/\u200b/g,"")),h+=c;else{var c=b.getAttribute("cm-marker"),p;if(c)b=a.findMarks(q(d,0),q(e+1,0),f(+c)),b.length&&(p=b[0].find())&&(h+=Ba(a.doc,p.from,p.to).join(l));else if("false"!=b.getAttribute("contenteditable")){for(p=0;p<b.childNodes.length;p++)g(b.childNodes[p]);/^(pre|div|p)$/i.test(b.nodeName)&&
(k=!0)}}}else 3==b.nodeType&&(b=b.nodeValue)&&(k&&(h+=l,k=!1),h+=b)}for(var h="",k=!1,l=a.doc.lineSeparator();;){g(b);if(b==c)break;b=b.nextSibling}return h}function ka(a,b){this.ranges=a;this.primIndex=b}function y(a,b){this.anchor=a;this.head=b}function $(a,b){var c=a[b];a.sort(function(a,b){return w(a.from(),b.from())});b=D(a,c);for(c=1;c<a.length;c++){var d=a[c],e=a[c-1];if(0<=w(e.to(),d.from())){var f=Ob(e.from(),d.from()),g=Nb(e.to(),d.to()),d=e.empty()?d.from()==d.head:e.from()==e.head;c<=
b&&--b;a.splice(--c,2,new y(d?g:f,d?f:g))}}return new ka(a,b)}function ga(a,b){return new ka([new y(a,b||a)],0)}function x(a,b){if(b.line<a.first)return q(a.first,0);var c=a.first+a.size-1;if(b.line>c)return q(c,t(a,c).text.length);var c=t(a,b.line).text.length,d=b.ch,c=null==d||d>c?q(b.line,c):0>d?q(b.line,0):b;return c}function qb(a,b){return b>=a.first&&b<a.first+a.size}function be(a,b){for(var c=[],d=0;d<b.length;d++)c[d]=x(a,b[d]);return c}function rb(a,b,c,d){return a.cm&&a.cm.display.shift||
a.extend?(a=b.anchor,d&&(b=0>w(c,a),b!=0>w(d,a)?(a=c,c=d):b!=0>w(c,d)&&(c=d)),new y(a,c)):new y(d||c,c)}function Tb(a,b,c,d){H(a,new ka([rb(a,a.sel.primary(),b,c)],0),d)}function ce(a,b,c){for(var d=[],e=0;e<a.sel.ranges.length;e++)d[e]=rb(a,a.sel.ranges[e],b[e],null);b=$(d,a.sel.primIndex);H(a,b,c)}function Wc(a,b,c,d){var e=a.sel.ranges.slice(0);e[b]=c;H(a,$(e,a.sel.primIndex),d)}function Ef(a,b,c){c={ranges:b.ranges,update:function(b){this.ranges=[];for(var c=0;c<b.length;c++)this.ranges[c]=new y(x(a,
b[c].anchor),x(a,b[c].head))},origin:c&&c.origin};J(a,"beforeSelectionChange",a,c);a.cm&&J(a.cm,"beforeSelectionChange",a.cm,c);return c.ranges!=b.ranges?$(c.ranges,c.ranges.length-1):b}function de(a,b,c){var d=a.history.done,e=z(d);e&&e.ranges?(d[d.length-1]=b,Ub(a,b,c)):H(a,b,c)}function H(a,b,c){Ub(a,b,c);b=a.sel;var d=a.cm?a.cm.curOp.id:NaN,e=a.history,f=c&&c.origin,g;if(!(g=d==e.lastSelOp)&&(g=f&&e.lastSelOrigin==f)&&!(g=e.lastModTime==e.lastSelTime&&e.lastOrigin==f)){g=z(e.done);var h=f.charAt(0);
g="*"==h||"+"==h&&g.ranges.length==b.ranges.length&&g.somethingSelected()==b.somethingSelected()&&new Date-a.history.lastSelTime<=(a.cm?a.cm.options.historyEventDelay:500)}g?e.done[e.done.length-1]=b:Vb(b,e.done);e.lastSelTime=+new Date;e.lastSelOrigin=f;e.lastSelOp=d;c&&!1!==c.clearRedo&&ee(e.undone)}function Ub(a,b,c){if(W(a,"beforeSelectionChange")||a.cm&&W(a.cm,"beforeSelectionChange"))b=Ef(a,b,c);var d=c&&c.bias||(0>w(b.primary().head,a.sel.primary().head)?-1:1);fe(a,ge(a,b,d,!0));c&&!1===c.scroll||
!a.cm||Qa(a.cm)}function fe(a,b){b.equals(a.sel)||(a.sel=b,a.cm&&(a.cm.curOp.updateInput=a.cm.curOp.selectionChanged=!0,he(a.cm)),Q(a,"cursorActivity",a))}function ie(a){fe(a,ge(a,a.sel,null,!1),ha)}function ge(a,b,c,d){for(var e,f=0;f<b.ranges.length;f++){var g=b.ranges[f],h=b.ranges.length==a.sel.ranges.length&&a.sel.ranges[f],k=Xc(a,g.anchor,h&&h.anchor,c,d),h=Xc(a,g.head,h&&h.head,c,d);if(e||k!=g.anchor||h!=g.head)e||(e=b.ranges.slice(0,f)),e[f]=new y(k,h)}return e?$(e,b.primIndex):b}function Ta(a,
b,c,d,e){var f=t(a,b.line);if(f.markedSpans)for(var g=0;g<f.markedSpans.length;++g){var h=f.markedSpans[g],k=h.marker;if((null==h.from||(k.inclusiveLeft?h.from<=b.ch:h.from<b.ch))&&(null==h.to||(k.inclusiveRight?h.to>=b.ch:h.to>b.ch))){if(e&&(J(k,"beforeCursorEnter"),k.explicitlyCleared))if(f.markedSpans){--g;continue}else break;if(k.atomic){if(c){var g=k.find(0>d?1:-1),l;if(0>d?k.inclusiveRight:k.inclusiveLeft)g=je(a,g,-d,f);if(g&&g.line==b.line&&(l=w(g,c))&&(0>d?0>l:0<l))return Ta(a,g,b,d,e)}c=
k.find(0>d?-1:1);if(0>d?k.inclusiveLeft:k.inclusiveRight)c=je(a,c,d,f);return c?Ta(a,c,b,d,e):null}}}return b}function Xc(a,b,c,d,e){d=d||1;b=Ta(a,b,c,d,e)||!e&&Ta(a,b,c,d,!0)||Ta(a,b,c,-d,e)||!e&&Ta(a,b,c,-d,!0);return b?b:(a.cantEdit=!0,q(a.first,0))}function je(a,b,c,d){return 0>c&&0==b.ch?b.line>a.first?x(a,q(b.line-1)):null:0<c&&b.ch==(d||t(a,b.line)).text.length?b.line<a.first+a.size-1?q(b.line+1,0):null:new q(b.line,b.ch+c)}function nb(a){a.display.input.showSelection(a.display.input.prepareSelection())}
function ke(a,b){for(var c=a.doc,d={},e=d.cursors=document.createDocumentFragment(),f=d.selection=document.createDocumentFragment(),g=0;g<c.sel.ranges.length;g++)if(!1!==b||g!=c.sel.primIndex){var h=c.sel.ranges[g],k=h.empty();(k||a.options.showCursorWhenSelecting)&&le(a,h.head,e);k||Ff(a,h,f)}return d}function le(a,b,c){b=la(a,b,"div",null,null,!a.options.singleCursorHeightPerLine);var d=c.appendChild(r("div"," ","CodeMirror-cursor"));d.style.left=b.left+"px";d.style.top=b.top+"px";d.style.height=
Math.max(0,b.bottom-b.top)*a.options.cursorHeight+"px";b.other&&(a=c.appendChild(r("div"," ","CodeMirror-cursor CodeMirror-secondarycursor")),a.style.display="",a.style.left=b.other.left+"px",a.style.top=b.other.top+"px",a.style.height=.85*(b.other.bottom-b.other.top)+"px")}function Ff(a,b,c){function d(a,b,c,d){0>b&&(b=0);b=Math.round(b);d=Math.round(d);h.appendChild(r("div",null,"CodeMirror-selected","position: absolute; left: "+a+"px; top: "+b+"px; width: "+(null==c?m-a:c)+"px; height: "+(d-b)+
"px"))}function e(b,c,e){var f=t(g,b),h=f.text.length,k,s;Gf(Z(f),c||0,null==e?h:e,function(g,n,r){var t=Wb(a,q(b,g),"div",f,"left"),u,v;g==n?(u=t,r=v=t.left):(u=Wb(a,q(b,n-1),"div",f,"right"),"rtl"==r&&(r=t,t=u,u=r),r=t.left,v=u.right);null==c&&0==g&&(r=l);3<u.top-t.top&&(d(r,t.top,null,t.bottom),r=l,t.bottom<u.top&&d(r,t.bottom,null,u.top));null==e&&n==h&&(v=m);if(!k||t.top<k.top||t.top==k.top&&t.left<k.left)k=t;if(!s||u.bottom>s.bottom||u.bottom==s.bottom&&u.right>s.right)s=u;r<l+1&&(r=l);d(r,
u.top,v-r,u.bottom)});return{start:k,end:s}}var f=a.display,g=a.doc,h=document.createDocumentFragment(),k=me(a.display),l=k.left,m=Math.max(f.sizerWidth,pa(a)-f.sizer.offsetLeft)-k.right,f=b.from();b=b.to();if(f.line==b.line)e(f.line,f.ch,b.ch);else{var s=t(g,f.line),k=t(g,b.line),k=ia(s)==ia(k),f=e(f.line,f.ch,k?s.text.length+1:null).end;b=e(b.line,k?0:null,b.ch).start;k&&(f.top<b.top-2?(d(f.right,f.top,null,f.bottom),d(l,b.top,b.left,b.bottom)):d(f.right,f.top,b.left-f.right,f.bottom));f.bottom<
b.top&&d(l,f.bottom,null,b.top)}c.appendChild(h)}function Yc(a){if(a.state.focused){var b=a.display;clearInterval(b.blinker);var c=!0;b.cursorDiv.style.visibility="";0<a.options.cursorBlinkRate?b.blinker=setInterval(function(){b.cursorDiv.style.visibility=(c=!c)?"":"hidden"},a.options.cursorBlinkRate):0>a.options.cursorBlinkRate&&(b.cursorDiv.style.visibility="hidden")}}function fb(a,b){a.doc.mode.startState&&a.doc.frontier<a.display.viewTo&&a.state.highlight.set(b,cb(Hf,a))}function Hf(a){var b=
a.doc;b.frontier<b.first&&(b.frontier=b.first);if(!(b.frontier>=a.display.viewTo)){var c=+new Date+a.options.workTime,d=sa(b.mode,sb(a,b.frontier)),e=[];b.iter(b.frontier,Math.min(b.first+b.size,a.display.viewTo+500),function(f){if(b.frontier>=a.display.viewFrom){var g=f.styles,h=f.text.length>a.options.maxHighlightLength,k=ne(a,f,h?sa(b.mode,d):d,!0);f.styles=k.styles;var l=f.styleClasses;(k=k.classes)?f.styleClasses=k:l&&(f.styleClasses=null);l=!g||g.length!=f.styles.length||l!=k&&(!l||!k||l.bgClass!=
k.bgClass||l.textClass!=k.textClass);for(k=0;!l&&k<g.length;++k)l=g[k]!=f.styles[k];l&&e.push(b.frontier);f.stateAfter=h?d:sa(b.mode,d)}else f.text.length<=a.options.maxHighlightLength&&Zc(a,f.text,d),f.stateAfter=0==b.frontier%5?sa(b.mode,d):null;++b.frontier;if(+new Date>c)return fb(a,a.options.workDelay),!0});e.length&&R(a,function(){for(var b=0;b<e.length;b++)ma(a,e[b],"text")})}}function If(a,b,c){for(var d,e,f=a.doc,g=c?-1:b-(a.doc.mode.innerMode?1E3:100);b>g;--b){if(b<=f.first)return f.first;
var h=t(f,b-1);if(h.stateAfter&&(!c||b<=f.frontier))return b;h=aa(h.text,null,a.options.tabSize);if(null==e||d>h)e=b-1,d=h}return e}function sb(a,b,c){var d=a.doc,e=a.display;if(!d.mode.startState)return!0;var f=If(a,b,c),g=f>d.first&&t(d,f-1).stateAfter,g=g?sa(d.mode,g):Jf(d.mode);d.iter(f,b,function(c){Zc(a,c.text,g);c.stateAfter=f==b-1||0==f%5||f>=e.viewFrom&&f<e.viewTo?sa(d.mode,g):null;++f});c&&(d.frontier=f);return g}function Ec(a){return a.mover.offsetHeight-a.lineSpace.offsetHeight}function me(a){if(a.cachedPaddingH)return a.cachedPaddingH;
var b=S(a.measure,r("pre","x")),b=window.getComputedStyle?window.getComputedStyle(b):b.currentStyle,b={left:parseInt(b.paddingLeft),right:parseInt(b.paddingRight)};isNaN(b.left)||isNaN(b.right)||(a.cachedPaddingH=b);return b}function da(a){return Gd-a.display.nativeBarWidth}function pa(a){return a.display.scroller.clientWidth-da(a)-a.display.barWidth}function Nc(a){return a.display.scroller.clientHeight-da(a)-a.display.barHeight}function $d(a,b,c){if(a.line==b)return{map:a.measure.map,cache:a.measure.cache};
for(var d=0;d<a.rest.length;d++)if(a.rest[d]==b)return{map:a.measure.maps[d],cache:a.measure.caches[d]};for(d=0;d<a.rest.length;d++)if(E(a.rest[d])>c)return{map:a.measure.maps[d],cache:a.measure.caches[d],before:!0}}function Uc(a,b){if(b>=a.display.viewFrom&&b<a.display.viewTo)return a.display.view[Aa(a,b)];var c=a.display.externalMeasured;if(c&&b>=c.lineN&&b<c.lineN+c.size)return c}function Xb(a,b){var c=E(b),d=Uc(a,c);d&&!d.text?d=null:d&&d.changes&&(Nd(a,d,c,Kc(a)),a.curOp.forceUpdate=!0);if(!d){var e;
e=ia(b);d=E(e);e=a.display.externalMeasured=new oe(a.doc,e,d);e.lineN=d;d=e.built=Rd(a,e);e.text=d.pre;S(a.display.lineMeasure,d.pre);d=e}c=$d(d,b,c);return{line:b,view:d,rect:null,map:c.map,cache:c.cache,before:c.before,hasHeights:!1}}function $c(a,b,c,d,e){b.before&&(c=-1);var f=c+(d||"");if(b.cache.hasOwnProperty(f))a=b.cache[f];else{b.rect||(b.rect=b.view.text.getBoundingClientRect());if(!b.hasHeights){var g=b.view,h=b.rect,k=a.options.lineWrapping,l=k&&pa(a);if(!g.measure.heights||k&&g.measure.width!=
l){var m=g.measure.heights=[];if(k)for(g.measure.width=l,g=g.text.firstChild.getClientRects(),k=0;k<g.length-1;k++){var l=g[k],s=g[k+1];2<Math.abs(l.bottom-s.bottom)&&m.push((l.bottom+s.top)/2-h.top)}m.push(h.bottom-h.top)}b.hasHeights=!0}g=d;k=ae(b.map,c,g);d=k.node;h=k.start;l=k.end;c=k.collapse;var p;if(3==d.nodeType){for(m=0;4>m;m++){for(;h&&tb(b.line.text.charAt(k.coverStart+h));)--h;for(;k.coverStart+l<k.coverEnd&&tb(b.line.text.charAt(k.coverStart+l));)++l;if(A&&9>C&&0==h&&l==k.coverEnd-k.coverStart)p=
d.parentNode.getBoundingClientRect();else if(A&&a.options.lineWrapping){var F=Ca(d,h,l).getClientRects();p=F.length?F["right"==g?F.length-1:0]:ad}else p=Ca(d,h,l).getBoundingClientRect()||ad;if(p.left||p.right||0==h)break;l=h;--h;c="right"}A&&11>C&&((F=!window.screen||null==screen.logicalXDPI||screen.logicalXDPI==screen.deviceXDPI)||(null!=bd?F=bd:(m=S(a.display.measure,r("span","x")),F=m.getBoundingClientRect(),m=Ca(m,0,1).getBoundingClientRect(),F=bd=1<Math.abs(F.left-m.left)),F=!F),F||(F=screen.logicalXDPI/
screen.deviceXDPI,m=screen.logicalYDPI/screen.deviceYDPI,p={left:p.left*F,right:p.right*F,top:p.top*m,bottom:p.bottom*m}))}else 0<h&&(c=g="right"),p=a.options.lineWrapping&&1<(F=d.getClientRects()).length?F["right"==g?F.length-1:0]:d.getBoundingClientRect();!(A&&9>C)||h||p&&(p.left||p.right)||(p=(p=d.parentNode.getClientRects()[0])?{left:p.left,right:p.left+gb(a.display),top:p.top,bottom:p.bottom}:ad);F=p.top-b.rect.top;d=p.bottom-b.rect.top;h=(F+d)/2;g=b.view.measure.heights;for(m=0;m<g.length-1&&
!(h<g[m]);m++);c={left:("right"==c?p.right:p.left)-b.rect.left,right:("left"==c?p.left:p.right)-b.rect.left,top:m?g[m-1]:0,bottom:g[m]};p.left||p.right||(c.bogus=!0);a.options.singleCursorHeightPerLine||(c.rtop=F,c.rbottom=d);a=c;a.bogus||(b.cache[f]=a)}return{left:a.left,right:a.right,top:e?a.rtop:a.top,bottom:e?a.rbottom:a.bottom}}function ae(a,b,c){for(var d,e,f,g,h=0;h<a.length;h+=3){var k=a[h],l=a[h+1];if(b<k)e=0,f=1,g="left";else if(b<l)e=b-k,f=e+1;else if(h==a.length-3||b==l&&a[h+3]>b)f=l-
k,e=f-1,b>=l&&(g="right");if(null!=e){d=a[h+2];k==l&&c==(d.insertLeft?"left":"right")&&(g=c);if("left"==c&&0==e)for(;h&&a[h-2]==a[h-3]&&a[h-1].insertLeft;)d=a[(h-=3)+2],g="left";if("right"==c&&e==l-k)for(;h<a.length-3&&a[h+3]==a[h+4]&&!a[h+5].insertLeft;)d=a[(h+=3)+2],g="right";break}}return{node:d,start:e,end:f,collapse:g,coverStart:k,coverEnd:l}}function pe(a){if(a.measure&&(a.measure.cache={},a.measure.heights=null,a.rest))for(var b=0;b<a.rest.length;b++)a.measure.caches[b]={}}function qe(a){a.display.externalMeasure=
null;xa(a.display.lineMeasure);for(var b=0;b<a.display.view.length;b++)pe(a.display.view[b])}function hb(a){qe(a);a.display.cachedCharWidth=a.display.cachedTextHeight=a.display.cachedPaddingH=null;a.options.lineWrapping||(a.display.maxLineChanged=!0);a.display.lineNumChars=null}function cd(a,b,c,d){if(b.widgets)for(var e=0;e<b.widgets.length;++e)if(b.widgets[e].above){var f=ub(b.widgets[e]);c.top+=f;c.bottom+=f}if("line"==d)return c;d||(d="local");b=ea(b);b="local"==d?b+a.display.lineSpace.offsetTop:
b-a.display.viewOffset;if("page"==d||"window"==d)a=a.display.lineSpace.getBoundingClientRect(),b+=a.top+("window"==d?0:window.pageYOffset||(document.documentElement||document.body).scrollTop),d=a.left+("window"==d?0:window.pageXOffset||(document.documentElement||document.body).scrollLeft),c.left+=d,c.right+=d;c.top+=b;c.bottom+=b;return c}function re(a,b,c){if("div"==c)return b;var d=b.left;b=b.top;"page"==c?(d-=window.pageXOffset||(document.documentElement||document.body).scrollLeft,b-=window.pageYOffset||
(document.documentElement||document.body).scrollTop):"local"!=c&&c||(c=a.display.sizer.getBoundingClientRect(),d+=c.left,b+=c.top);a=a.display.lineSpace.getBoundingClientRect();return{left:d-a.left,top:b-a.top}}function Wb(a,b,c,d,e){d||(d=t(a.doc,b.line));var f=d;b=b.ch;d=$c(a,Xb(a,d),b,e);return cd(a,f,d,c)}function la(a,b,c,d,e,f){function g(b,g){var h=$c(a,e,b,g?"right":"left",f);g?h.left=h.right:h.right=h.left;return cd(a,d,h,c)}function h(a,b){var c=k[b],d=c.level%2;a==dd(c)&&b&&c.level<k[b-
1].level?(c=k[--b],a=ed(c)-(c.level%2?0:1),d=!0):a==ed(c)&&b<k.length-1&&c.level<k[b+1].level&&(c=k[++b],a=dd(c)-c.level%2,d=!1);return d&&a==c.to&&a>c.from?g(a-1):g(a,d)}d=d||t(a.doc,b.line);e||(e=Xb(a,d));var k=Z(d);b=b.ch;if(!k)return g(b);var l=Rb(k,b),l=h(b,l);null!=vb&&(l.other=h(b,vb));return l}function se(a,b){var c=0;b=x(a.doc,b);a.options.lineWrapping||(c=gb(a.display)*b.ch);var d=t(a.doc,b.line),e=ea(d)+a.display.lineSpace.offsetTop;return{left:c,right:c,top:e,bottom:e+d.height}}function Yb(a,
b,c,d){a=q(a,b);a.xRel=d;c&&(a.outside=!0);return a}function fd(a,b,c){var d=a.doc;c+=a.display.viewOffset;if(0>c)return Yb(d.first,0,!0,-1);var e=za(d,c),f=d.first+d.size-1;if(e>f)return Yb(d.first+d.size-1,t(d,f).text.length,!0,1);0>b&&(b=0);for(d=t(d,e);;)if(e=Kf(a,d,e,b,c),f=(d=ya(d,!1))&&d.find(0,!0),d&&(e.ch>f.from.ch||e.ch==f.from.ch&&0<e.xRel))e=E(d=f.to.line);else return e}function Kf(a,b,c,d,e){function f(d){d=la(a,q(c,d),"line",b,l);h=!0;if(g>d.bottom)return d.left-k;if(g<d.top)return d.left+
k;h=!1;return d.left}var g=e-ea(b),h=!1,k=2*a.display.wrapper.clientWidth,l=Xb(a,b),m=Z(b),s=b.text.length;e=Zb(b);var p=$b(b),F=f(e),n=h,r=f(p),t=h;if(d>r)return Yb(c,p,t,1);for(;;){if(m?p==e||p==gd(b,e,1):1>=p-e){m=d<F||d-F<=r-d?e:p;for(d-=m==e?F:r;tb(b.text.charAt(m));)++m;return Yb(c,m,m==e?n:t,-1>d?-1:1<d?1:0)}var u=Math.ceil(s/2),v=e+u;if(m)for(var v=e,w=0;w<u;++w)v=gd(b,v,1);w=f(v);if(w>d){p=v;r=w;if(t=h)r+=1E3;s=u}else e=v,F=w,n=h,s-=u}}function va(a){if(null!=a.cachedTextHeight)return a.cachedTextHeight;
if(null==Da){Da=r("pre");for(var b=0;49>b;++b)Da.appendChild(document.createTextNode("x")),Da.appendChild(r("br"));Da.appendChild(document.createTextNode("x"))}S(a.measure,Da);b=Da.offsetHeight/50;3<b&&(a.cachedTextHeight=b);xa(a.measure);return b||1}function gb(a){if(null!=a.cachedCharWidth)return a.cachedCharWidth;var b=r("span","xxxxxxxxxx"),c=r("pre",[b]);S(a.measure,c);b=b.getBoundingClientRect();b=(b.right-b.left)/10;2<b&&(a.cachedCharWidth=b);return b||10}function Ka(a){a.curOp={cm:a,viewChanged:!1,
startHeight:a.doc.height,forceUpdate:!1,updateInput:null,typing:!1,changeObjs:null,cursorActivityHandlers:null,cursorActivityCalled:0,selectionChanged:!1,updateMaxLine:!1,scrollLeft:null,scrollTop:null,scrollToPos:null,focus:!1,id:++Lf};Ua?Ua.ops.push(a.curOp):a.curOp.ownsGroup=Ua={ops:[a.curOp],delayedCallbacks:[]}}function Ma(a){if(a=a.curOp.ownsGroup)try{var b=a.delayedCallbacks,c=0;do{for(;c<b.length;c++)b[c].call(null);for(var d=0;d<a.ops.length;d++){var e=a.ops[d];if(e.cursorActivityHandlers)for(;e.cursorActivityCalled<
e.cursorActivityHandlers.length;)e.cursorActivityHandlers[e.cursorActivityCalled++].call(null,e.cm)}}while(c<b.length)}finally{Ua=null;for(b=0;b<a.ops.length;b++)a.ops[b].cm.curOp=null;a=a.ops;for(b=0;b<a.length;b++){var e=a[b],c=e.cm,f=d=c.display;!f.scrollbarsClipped&&f.scroller.offsetWidth&&(f.nativeBarWidth=f.scroller.offsetWidth-f.scroller.clientWidth,f.heightForcer.style.height=da(c)+"px",f.sizer.style.marginBottom=-f.nativeBarWidth+"px",f.sizer.style.borderRightWidth=da(c)+"px",f.scrollbarsClipped=
!0);e.updateMaxLine&&Dc(c);e.mustUpdate=e.viewChanged||e.forceUpdate||null!=e.scrollTop||e.scrollToPos&&(e.scrollToPos.from.line<d.viewFrom||e.scrollToPos.to.line>=d.viewTo)||d.maxLineChanged&&c.options.lineWrapping;e.update=e.mustUpdate&&new Lb(c,e.mustUpdate&&{top:e.scrollTop,ensure:e.scrollToPos},e.forceUpdate)}for(b=0;b<a.length;b++)e=a[b],e.updatedDisplay=e.mustUpdate&&Lc(e.cm,e.update);for(b=0;b<a.length;b++)if(e=a[b],c=e.cm,d=c.display,e.updatedDisplay&&Kb(c),e.barMeasure=jb(c),d.maxLineChanged&&
!c.options.lineWrapping&&(f=void 0,f=d.maxLine.text.length,f=$c(c,Xb(c,d.maxLine),f,void 0),e.adjustWidthTo=f.left+3,c.display.sizerWidth=e.adjustWidthTo,e.barMeasure.scrollWidth=Math.max(d.scroller.clientWidth,d.sizer.offsetLeft+e.adjustWidthTo+da(c)+c.display.barWidth),e.maxScrollLeft=Math.max(0,d.sizer.offsetLeft+e.adjustWidthTo-pa(c))),e.updatedDisplay||e.selectionChanged)e.preparedSelection=d.input.prepareSelection();for(b=0;b<a.length;b++)e=a[b],c=e.cm,null!=e.adjustWidthTo&&(c.display.sizer.style.minWidth=
e.adjustWidthTo+"px",e.maxScrollLeft<c.doc.scrollLeft&&Na(c,Math.min(c.display.scroller.scrollLeft,e.maxScrollLeft),!0),c.display.maxLineChanged=!1),e.preparedSelection&&c.display.input.showSelection(e.preparedSelection),e.updatedDisplay&&Oc(c,e.barMeasure),(e.updatedDisplay||e.startHeight!=c.doc.height)&&Oa(c,e.barMeasure),e.selectionChanged&&Yc(c),c.state.focused&&e.updateInput&&c.display.input.reset(e.typing),!e.focus||e.focus!=fa()||document.hasFocus&&!document.hasFocus()||Td(e.cm);for(b=0;b<
a.length;b++){e=a[b];c=e.cm;d=c.display;f=c.doc;e.updatedDisplay&&Ld(c,e.update);null==d.wheelStartX||null==e.scrollTop&&null==e.scrollLeft&&!e.scrollToPos||(d.wheelStartX=d.wheelStartY=null);null==e.scrollTop||d.scroller.scrollTop==e.scrollTop&&!e.forceScroll||(f.scrollTop=Math.max(0,Math.min(d.scroller.scrollHeight-d.scroller.clientHeight,e.scrollTop)),d.scrollbars.setScrollTop(f.scrollTop),d.scroller.scrollTop=f.scrollTop);null==e.scrollLeft||d.scroller.scrollLeft==e.scrollLeft&&!e.forceScroll||
(f.scrollLeft=Math.max(0,Math.min(d.scroller.scrollWidth-pa(c),e.scrollLeft)),d.scrollbars.setScrollLeft(f.scrollLeft),d.scroller.scrollLeft=f.scrollLeft,Bc(c));if(e.scrollToPos){var g=void 0,h=x(f,e.scrollToPos.from),g=x(f,e.scrollToPos.to),k=e.scrollToPos.margin;null==k&&(k=0);for(var l=0;5>l;l++){var m=!1,s=la(c,h),p=g&&g!=h?la(c,g):s,p=ac(c,Math.min(s.left,p.left),Math.min(s.top,p.top)-k,Math.max(s.left,p.left),Math.max(s.bottom,p.bottom)+k),n=c.doc.scrollTop,q=c.doc.scrollLeft;null!=p.scrollTop&&
(lb(c,p.scrollTop),1<Math.abs(c.doc.scrollTop-n)&&(m=!0));null!=p.scrollLeft&&(Na(c,p.scrollLeft),1<Math.abs(c.doc.scrollLeft-q)&&(m=!0));if(!m)break}g=s;e.scrollToPos.isCursor&&c.state.focused&&(B(c,"scrollCursorIntoView")||(k=c.display,l=k.sizer.getBoundingClientRect(),h=null,0>g.top+l.top?h=!0:g.bottom+l.top>(window.innerHeight||document.documentElement.clientHeight)&&(h=!1),null==h||Mf||(g=r("div","€‹",null,"position: absolute; top: "+(g.top-k.viewOffset-c.display.lineSpace.offsetTop)+"px; height: "+
(g.bottom-g.top+da(c)+k.barHeight)+"px; left: "+g.left+"px; width: 2px;"),c.display.lineSpace.appendChild(g),g.scrollIntoView(h),c.display.lineSpace.removeChild(g))))}h=e.maybeHiddenMarkers;g=e.maybeUnhiddenMarkers;if(h)for(k=0;k<h.length;++k)h[k].lines.length||J(h[k],"hide");if(g)for(k=0;k<g.length;++k)g[k].lines.length&&J(g[k],"unhide");d.wrapper.offsetHeight&&(f.scrollTop=c.display.scroller.scrollTop);e.changeObjs&&J(c,"changes",c,e.changeObjs);e.update&&e.update.finish()}}}function R(a,b){if(a.curOp)return b();
Ka(a);try{return b()}finally{Ma(a)}}function G(a,b){return function(){if(a.curOp)return b.apply(a,arguments);Ka(a);try{return b.apply(a,arguments)}finally{Ma(a)}}}function L(a){return function(){if(this.curOp)return a.apply(this,arguments);Ka(this);try{return a.apply(this,arguments)}finally{Ma(this)}}}function M(a){return function(){var b=this.cm;if(!b||b.curOp)return a.apply(this,arguments);Ka(b);try{return a.apply(this,arguments)}finally{Ma(b)}}}function oe(a,b,c){for(var d=this.line=b,e;d=ya(d,
!1);)d=d.find(1,!0).line,(e||(e=[])).push(d);this.size=(this.rest=e)?E(z(this.rest))-c+1:1;this.node=this.text=null;this.hidden=wa(a,b)}function Mb(a,b,c){var d=[],e;for(e=b;e<c;)b=new oe(a.doc,t(a.doc,e),e),e+=b.size,d.push(b);return d}function O(a,b,c,d){null==b&&(b=a.doc.first);null==c&&(c=a.doc.first+a.doc.size);d||(d=0);var e=a.display;d&&c<e.viewTo&&(null==e.updateLineNumbers||e.updateLineNumbers>b)&&(e.updateLineNumbers=b);a.curOp.viewChanged=!0;if(b>=e.viewTo)ra&&Mc(a.doc,b)<e.viewTo&&qa(a);
else if(c<=e.viewFrom)ra&&Kd(a.doc,c+d)>e.viewFrom?qa(a):(e.viewFrom+=d,e.viewTo+=d);else if(b<=e.viewFrom&&c>=e.viewTo)qa(a);else if(b<=e.viewFrom){var f=bc(a,c,c+d,1);f?(e.view=e.view.slice(f.index),e.viewFrom=f.lineN,e.viewTo+=d):qa(a)}else if(c>=e.viewTo)(f=bc(a,b,b,-1))?(e.view=e.view.slice(0,f.index),e.viewTo=f.lineN):qa(a);else{var f=bc(a,b,b,-1),g=bc(a,c,c+d,1);f&&g?(e.view=e.view.slice(0,f.index).concat(Mb(a,f.lineN,g.lineN)).concat(e.view.slice(g.index)),e.viewTo+=d):qa(a)}if(a=e.externalMeasured)c<
a.lineN?a.lineN+=d:b<a.lineN+a.size&&(e.externalMeasured=null)}function ma(a,b,c){a.curOp.viewChanged=!0;var d=a.display,e=a.display.externalMeasured;e&&b>=e.lineN&&b<e.lineN+e.size&&(d.externalMeasured=null);b<d.viewFrom||b>=d.viewTo||(a=d.view[Aa(a,b)],null!=a.node&&(a=a.changes||(a.changes=[]),-1==D(a,c)&&a.push(c)))}function qa(a){a.display.viewFrom=a.display.viewTo=a.doc.first;a.display.view=[];a.display.viewOffset=0}function Aa(a,b){if(b>=a.display.viewTo)return null;b-=a.display.viewFrom;if(0>
b)return null;for(var c=a.display.view,d=0;d<c.length;d++)if(b-=c[d].size,0>b)return d}function bc(a,b,c,d){var e=Aa(a,b),f=a.display.view;if(!ra||c==a.doc.first+a.doc.size)return{index:e,lineN:c};for(var g=0,h=a.display.viewFrom;g<e;g++)h+=f[g].size;if(h!=b){if(0<d){if(e==f.length-1)return null;b=h+f[e].size-b;e++}else b=h-b;c+=b}for(;Mc(a.doc,c)!=c;){if(e==(0>d?0:f.length-1))return null;c+=d*f[e-(0>d?1:0)].size;e+=d}return{index:e,lineN:c}}function Jd(a){a=a.display.view;for(var b=0,c=0;c<a.length;c++){var d=
a[c];d.hidden||d.node&&!d.changes||++b}return b}function yf(a){function b(){d.activeTouch&&(e=setTimeout(function(){d.activeTouch=null},1E3),f=d.activeTouch,f.end=+new Date)}function c(a,b){if(null==b.left)return!0;var c=b.left-a.left,d=b.top-a.top;return 400<c*c+d*d}var d=a.display;u(d.scroller,"mousedown",G(a,Nf));A&&11>C?u(d.scroller,"dblclick",G(a,function(b){if(!B(a,b)){var c=Ea(a,b);!c||hd(a,b,"gutterClick",!0)||na(a.display,b)||(N(b),b=a.findWordAt(c),Tb(a.doc,b.anchor,b.head))}})):u(d.scroller,
"dblclick",function(b){B(a,b)||N(b)});id||u(d.scroller,"contextmenu",function(b){te(a,b)});var e,f={end:0};u(d.scroller,"touchstart",function(b){var c;if(c=!B(a,b))1!=b.touches.length?c=!1:(c=b.touches[0],c=1>=c.radiusX&&1>=c.radiusY),c=!c;c&&(clearTimeout(e),c=+new Date,d.activeTouch={start:c,moved:!1,prev:300>=c-f.end?f:null},1==b.touches.length&&(d.activeTouch.left=b.touches[0].pageX,d.activeTouch.top=b.touches[0].pageY))});u(d.scroller,"touchmove",function(){d.activeTouch&&(d.activeTouch.moved=
!0)});u(d.scroller,"touchend",function(e){var f=d.activeTouch;if(f&&!na(d,e)&&null!=f.left&&!f.moved&&300>new Date-f.start){var g=a.coordsChar(d.activeTouch,"page"),f=!f.prev||c(f,f.prev)?new y(g,g):!f.prev.prev||c(f,f.prev.prev)?a.findWordAt(g):new y(q(g.line,0),x(a.doc,q(g.line+1,0)));a.setSelection(f.anchor,f.head);a.focus();N(e)}b()});u(d.scroller,"touchcancel",b);u(d.scroller,"scroll",function(){d.scroller.clientHeight&&(lb(a,d.scroller.scrollTop),Na(a,d.scroller.scrollLeft,!0),J(a,"scroll",
a))});u(d.scroller,"mousewheel",function(b){ue(a,b)});u(d.scroller,"DOMMouseScroll",function(b){ue(a,b)});u(d.wrapper,"scroll",function(){d.wrapper.scrollTop=d.wrapper.scrollLeft=0});d.dragFunctions={enter:function(b){B(a,b)||cc(b)},over:function(b){if(!B(a,b)){var c=Ea(a,b);if(c){var d=document.createDocumentFragment();le(a,c,d);a.display.dragCursor||(a.display.dragCursor=r("div",null,"CodeMirror-cursors CodeMirror-dragcursors"),a.display.lineSpace.insertBefore(a.display.dragCursor,a.display.cursorDiv));
S(a.display.dragCursor,d)}cc(b)}},start:function(b){if(A&&(!a.state.draggingText||100>+new Date-ve))cc(b);else if(!B(a,b)&&!na(a.display,b)&&(b.dataTransfer.setData("Text",a.getSelection()),b.dataTransfer.setDragImage&&!we)){var c=r("img",null,null,"position: fixed; left: 0; top: 0;");c.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw\x3d\x3d";ba&&(c.width=c.height=1,a.display.wrapper.appendChild(c),c._top=c.offsetTop);b.dataTransfer.setDragImage(c,0,0);ba&&c.parentNode.removeChild(c)}},
drop:G(a,Of),leave:function(){xe(a)}};var g=d.input.getField();u(g,"keyup",function(b){ye.call(a,b)});u(g,"keydown",G(a,ze));u(g,"keypress",G(a,Ae));u(g,"focus",cb(xc,a));u(g,"blur",cb(db,a))}function Pf(a){var b=a.display;if(b.lastWrapHeight!=b.wrapper.clientHeight||b.lastWrapWidth!=b.wrapper.clientWidth)b.cachedCharWidth=b.cachedTextHeight=b.cachedPaddingH=null,b.scrollbarsClipped=!1,a.setSize()}function na(a,b){for(var c=b.target||b.srcElement;c!=a.wrapper;c=c.parentNode)if(!c||1==c.nodeType&&
"true"==c.getAttribute("cm-ignore-events")||c.parentNode==a.sizer&&c!=a.mover)return!0}function Ea(a,b,c,d){var e=a.display;if(!c&&"true"==(b.target||b.srcElement).getAttribute("cm-not-content"))return null;var f,g;c=e.lineSpace.getBoundingClientRect();try{f=b.clientX-c.left,g=b.clientY-c.top}catch(h){return null}b=fd(a,f,g);var k;d&&1==b.xRel&&(k=t(a.doc,b.line).text).length==b.ch&&(d=aa(k,k.length,a.options.tabSize)-k.length,b=q(b.line,Math.max(0,Math.round((f-me(a.display).left)/gb(a.display))-
d)));return b}function Nf(a){var b=this.display;if(!(B(this,a)||b.activeTouch&&b.input.supportsTouch()))if(b.shift=a.shiftKey,na(b,a))K||(b.scroller.draggable=!1,setTimeout(function(){b.scroller.draggable=!0},100));else if(!hd(this,a,"gutterClick",!0)){var c=Ea(this,a);window.focus();switch(Be(a)){case 1:this.state.selectingText?this.state.selectingText(a):c?Qf(this,a,c):(a.target||a.srcElement)==b.scroller&&N(a);break;case 2:K&&(this.state.lastMiddleDown=+new Date);c&&Tb(this.doc,c);setTimeout(function(){b.input.focus()},
20);N(a);break;case 3:id?te(this,a):Rf(this)}}}function Qf(a,b,c){A?setTimeout(cb(Td,a),0):a.curOp.focus=fa();var d=+new Date,e;dc&&dc.time>d-400&&0==w(dc.pos,c)?e="triple":ec&&ec.time>d-400&&0==w(ec.pos,c)?(e="double",dc={time:d,pos:c}):(e="single",ec={time:d,pos:c});var d=a.doc.sel,f=Y?b.metaKey:b.ctrlKey,g;a.options.dragDrop&&Sf&&!a.isReadOnly()&&"single"==e&&-1<(g=d.contains(c))&&(0>w((g=d.ranges[g]).from(),c)||0<c.xRel)&&(0<w(g.to(),c)||0>c.xRel)?Tf(a,b,c,f):Uf(a,b,c,e,f)}function Tf(a,b,c,d){var e=
a.display,f=+new Date,g=G(a,function(h){K&&(e.scroller.draggable=!1);a.state.draggingText=!1;ja(document,"mouseup",g);ja(e.scroller,"drop",g);10>Math.abs(b.clientX-h.clientX)+Math.abs(b.clientY-h.clientY)&&(N(h),!d&&+new Date-200<f&&Tb(a.doc,c),K||A&&9==C?setTimeout(function(){document.body.focus();e.input.focus()},20):e.input.focus())});K&&(e.scroller.draggable=!0);a.state.draggingText=g;e.scroller.dragDrop&&e.scroller.dragDrop();u(document,"mouseup",g);u(e.scroller,"drop",g)}function Uf(a,b,c,d,
e){function f(b){if(0!=w(v,b))if(v=b,"rect"==d){for(var e=[],f=a.options.tabSize,g=aa(t(l,c.line).text,c.ch,f),h=aa(t(l,b.line).text,b.ch,f),k=Math.min(g,h),g=Math.max(g,h),h=Math.min(c.line,b.line),n=Math.min(a.lastLine(),Math.max(c.line,b.line));h<=n;h++){var r=t(l,h).text,F=Ce(r,k,f);k==g?e.push(new y(q(h,F),q(h,F))):r.length>F&&e.push(new y(q(h,F),q(h,Ce(r,g,f))))}e.length||e.push(new y(c,c));H(l,$(p.ranges.slice(0,s).concat(e),s),{origin:"*mouse",scroll:!1});a.scrollIntoView(b)}else e=m,f=e.anchor,
k=b,"single"!=d&&(b="double"==d?a.findWordAt(b):new y(q(b.line,0),x(l,q(b.line+1,0))),0<w(b.anchor,f)?(k=b.head,f=Ob(e.from(),b.anchor)):(k=b.anchor,f=Nb(e.to(),b.head))),e=p.ranges.slice(0),e[s]=new y(x(l,f),k),H(l,$(e,s),jd)}function g(b){var c=++z,e=Ea(a,b,!0,"rect"==d);if(e)if(0!=w(e,v)){a.curOp.focus=fa();f(e);var h=Hc(k,l);(e.line>=h.to||e.line<h.from)&&setTimeout(G(a,function(){z==c&&g(b)}),150)}else{var m=b.clientY<A.top?-20:b.clientY>A.bottom?20:0;m&&setTimeout(G(a,function(){z==c&&(k.scroller.scrollTop+=
m,g(b))}),50)}}function h(b){a.state.selectingText=!1;z=Infinity;N(b);k.input.focus();ja(document,"mousemove",E);ja(document,"mouseup",C);l.history.lastSelOrigin=null}var k=a.display,l=a.doc;N(b);var m,s,p=l.sel,n=p.ranges;e&&!b.shiftKey?(s=l.sel.contains(c),m=-1<s?n[s]:new y(c,c)):(m=l.sel.primary(),s=l.sel.primIndex);if(b.altKey)d="rect",e||(m=new y(c,c)),c=Ea(a,b,!0,!0),s=-1;else if("double"==d){var r=a.findWordAt(c);m=a.display.shift||l.extend?rb(l,m,r.anchor,r.head):r}else"triple"==d?(r=new y(q(c.line,
0),x(l,q(c.line+1,0))),m=a.display.shift||l.extend?rb(l,m,r.anchor,r.head):r):m=rb(l,m,c);e?-1==s?(s=n.length,H(l,$(n.concat([m]),s),{scroll:!1,origin:"*mouse"})):1<n.length&&n[s].empty()&&"single"==d&&!b.shiftKey?(H(l,$(n.slice(0,s).concat(n.slice(s+1)),0),{scroll:!1,origin:"*mouse"}),p=l.sel):Wc(l,s,m,jd):(s=0,H(l,new ka([m],0),jd),p=l.sel);var v=c,A=k.wrapper.getBoundingClientRect(),z=0,E=G(a,function(a){Be(a)?g(a):h(a)}),C=G(a,h);a.state.selectingText=C;u(document,"mousemove",E);u(document,"mouseup",
C)}function hd(a,b,c,d){try{var e=b.clientX,f=b.clientY}catch(g){return!1}if(e>=Math.floor(a.display.gutters.getBoundingClientRect().right))return!1;d&&N(b);d=a.display;var h=d.lineDiv.getBoundingClientRect();if(f>h.bottom||!W(a,c))return kd(b);f-=h.top-d.viewOffset;for(h=0;h<a.options.gutters.length;++h){var k=d.gutters.childNodes[h];if(k&&k.getBoundingClientRect().right>=e)return e=za(a.doc,f),J(a,c,a,e,a.options.gutters[h],b),kd(b)}}function Of(a){var b=this;xe(b);if(!B(b,a)&&!na(b.display,a)){N(a);
A&&(ve=+new Date);var c=Ea(b,a,!0),d=a.dataTransfer.files;if(c&&!b.isReadOnly())if(d&&d.length&&window.FileReader&&window.File){var e=d.length,f=Array(e),g=0;a=function(a,d){if(!b.options.allowDropFileTypes||-1!=D(b.options.allowDropFileTypes,a.type)){var h=new FileReader;h.onload=G(b,function(){var a=h.result;/[\x00-\x08\x0e-\x1f]{2}/.test(a)&&(a="");f[d]=a;++g==e&&(c=x(b.doc,c),a={from:c,to:c,text:b.doc.splitLines(f.join(b.doc.lineSeparator())),origin:"paste"},Pa(b.doc,a),de(b.doc,ga(c,Fa(a))))});
h.readAsText(a)}};for(var h=0;h<e;++h)a(d[h],h)}else if(b.state.draggingText&&-1<b.doc.sel.contains(c))b.state.draggingText(a),setTimeout(function(){b.display.input.focus()},20);else try{if(f=a.dataTransfer.getData("Text")){if(b.state.draggingText&&(Y?!a.altKey:!a.ctrlKey))var k=b.listSelections();Ub(b.doc,ga(c,c));if(k)for(h=0;h<k.length;++h)Va(b.doc,"",k[h].anchor,k[h].head,"drag");b.replaceSelection(f,"around","paste");b.display.input.focus()}}catch(l){}}}function xe(a){a.display.dragCursor&&(a.display.lineSpace.removeChild(a.display.dragCursor),
a.display.dragCursor=null)}function lb(a,b){2>Math.abs(a.doc.scrollTop-b)||(a.doc.scrollTop=b,oa||Pc(a,{top:b}),a.display.scroller.scrollTop!=b&&(a.display.scroller.scrollTop=b),a.display.scrollbars.setScrollTop(b),oa&&Pc(a),fb(a,100))}function Na(a,b,c){(c?b==a.doc.scrollLeft:2>Math.abs(a.doc.scrollLeft-b))||(b=Math.min(b,a.display.scroller.scrollWidth-a.display.scroller.clientWidth),a.doc.scrollLeft=b,Bc(a),a.display.scroller.scrollLeft!=b&&(a.display.scroller.scrollLeft=b),a.display.scrollbars.setScrollLeft(b))}
function ue(a,b){var c=De(b),d=c.x,c=c.y,e=a.display,f=e.scroller,g=f.scrollWidth>f.clientWidth,h=f.scrollHeight>f.clientHeight;if(d&&g||c&&h){if(c&&Y&&K){var g=b.target,k=e.view;a:for(;g!=f;g=g.parentNode)for(var l=0;l<k.length;l++)if(k[l].node==g){a.display.currentWheelTarget=g;break a}}!d||oa||ba||null==T?(c&&null!=T&&(h=c*T,g=a.doc.scrollTop,k=g+e.wrapper.clientHeight,0>h?g=Math.max(0,g+h-50):k=Math.min(a.doc.height,k+h+50),Pc(a,{top:g,bottom:k})),20>fc&&(null==e.wheelStartX?(e.wheelStartX=f.scrollLeft,
e.wheelStartY=f.scrollTop,e.wheelDX=d,e.wheelDY=c,setTimeout(function(){if(null!=e.wheelStartX){var a=f.scrollLeft-e.wheelStartX,b=f.scrollTop-e.wheelStartY,a=b&&e.wheelDY&&b/e.wheelDY||a&&e.wheelDX&&a/e.wheelDX;e.wheelStartX=e.wheelStartY=null;a&&(T=(T*fc+a)/(fc+1),++fc)}},200)):(e.wheelDX+=d,e.wheelDY+=c))):(c&&h&&lb(a,Math.max(0,Math.min(f.scrollTop+c*T,f.scrollHeight-f.clientHeight))),Na(a,Math.max(0,Math.min(f.scrollLeft+d*T,f.scrollWidth-f.clientWidth))),(!c||c&&h)&&N(b),e.wheelStartX=null)}}
function gc(a,b,c){if("string"==typeof b&&(b=hc[b],!b))return!1;a.display.input.ensurePolled();var d=a.display.shift,e=!1;try{a.isReadOnly()&&(a.state.suppressEdits=!0),c&&(a.display.shift=!1),e=b(a)!=Ee}finally{a.display.shift=d,a.state.suppressEdits=!1}return e}function Vf(a,b,c){for(var d=0;d<a.state.keyMaps.length;d++){var e=wb(b,a.state.keyMaps[d],c,a);if(e)return e}return a.options.extraKeys&&wb(b,a.options.extraKeys,c,a)||wb(b,a.options.keyMap,c,a)}function ic(a,b,c,d){var e=a.state.keySeq;
if(e){if(Wf(b))return"handled";Xf.set(50,function(){a.state.keySeq==e&&(a.state.keySeq=null,a.display.input.reset())});b=e+" "+b}d=Vf(a,b,d);"multi"==d&&(a.state.keySeq=b);"handled"==d&&Q(a,"keyHandled",a,b,c);if("handled"==d||"multi"==d)N(c),Yc(a);return e&&!d&&/\'$/.test(b)?(N(c),!0):!!d}function Fe(a,b){var c=Yf(b,!0);return c?b.shiftKey&&!a.state.keySeq?ic(a,"Shift-"+c,b,function(b){return gc(a,b,!0)})||ic(a,c,b,function(b){if("string"==typeof b?/^go[A-Z]/.test(b):b.motion)return gc(a,b)}):ic(a,
c,b,function(b){return gc(a,b)}):!1}function Zf(a,b,c){return ic(a,"'"+c+"'",b,function(b){return gc(a,b,!0)})}function ze(a){this.curOp.focus=fa();if(!B(this,a)){A&&11>C&&27==a.keyCode&&(a.returnValue=!1);var b=a.keyCode;this.display.shift=16==b||a.shiftKey;var c=Fe(this,a);ba&&(ld=c?b:null,!c&&88==b&&!Ge&&(Y?a.metaKey:a.ctrlKey)&&this.replaceSelection("",null,"cut"));18!=b||/\bCodeMirror-crosshair\b/.test(this.display.lineDiv.className)||$f(this)}}function $f(a){function b(a){18!=a.keyCode&&a.altKey||
(kb(c,"CodeMirror-crosshair"),ja(document,"keyup",b),ja(document,"mouseover",b))}var c=a.display.lineDiv;mb(c,"CodeMirror-crosshair");u(document,"keyup",b);u(document,"mouseover",b)}function ye(a){16==a.keyCode&&(this.doc.sel.shift=!1);B(this,a)}function Ae(a){if(!(na(this.display,a)||B(this,a)||a.ctrlKey&&!a.altKey||Y&&a.metaKey)){var b=a.keyCode,c=a.charCode;if(ba&&b==ld)ld=null,N(a);else if(!ba||a.which&&!(10>a.which)||!Fe(this,a))if(b=String.fromCharCode(null==c?b:c),!Zf(this,a,b))this.display.input.onKeyPress(a)}}
function Rf(a){a.state.delayingBlurEvent=!0;setTimeout(function(){a.state.delayingBlurEvent&&(a.state.delayingBlurEvent=!1,db(a))},100)}function xc(a){a.state.delayingBlurEvent&&(a.state.delayingBlurEvent=!1);"nocursor"!=a.options.readOnly&&(a.state.focused||(J(a,"focus",a),a.state.focused=!0,mb(a.display.wrapper,"CodeMirror-focused"),a.curOp||a.display.selForContextMenu==a.doc.sel||(a.display.input.reset(),K&&setTimeout(function(){a.display.input.reset(!0)},20)),a.display.input.receivedFocus()),
Yc(a))}function db(a){a.state.delayingBlurEvent||(a.state.focused&&(J(a,"blur",a),a.state.focused=!1,kb(a.display.wrapper,"CodeMirror-focused")),clearInterval(a.display.blinker),setTimeout(function(){a.state.focused||(a.display.shift=!1)},150))}function te(a,b){var c;(c=na(a.display,b))||(c=W(a,"gutterContextMenu")?hd(a,b,"gutterContextMenu",!1):!1);if(!c&&!B(a,b,"contextmenu"))a.display.input.onContextMenu(b)}function He(a,b){if(0>w(a,b.from))return a;if(0>=w(a,b.to))return Fa(b);var c=a.line+b.text.length-
(b.to.line-b.from.line)-1,d=a.ch;a.line==b.to.line&&(d+=Fa(b).ch-b.to.ch);return q(c,d)}function md(a,b){for(var c=[],d=0;d<a.sel.ranges.length;d++){var e=a.sel.ranges[d];c.push(new y(He(e.anchor,b),He(e.head,b)))}return $(c,a.sel.primIndex)}function Ie(a,b,c){return a.line==b.line?q(c.line,a.ch-b.ch+c.ch):q(c.line+(a.line-b.line),a.ch)}function Je(a,b,c){b={canceled:!1,from:b.from,to:b.to,text:b.text,origin:b.origin,cancel:function(){this.canceled=!0}};c&&(b.update=function(b,c,f,g){b&&(this.from=
x(a,b));c&&(this.to=x(a,c));f&&(this.text=f);void 0!==g&&(this.origin=g)});J(a,"beforeChange",a,b);a.cm&&J(a.cm,"beforeChange",a.cm,b);return b.canceled?null:{from:b.from,to:b.to,text:b.text,origin:b.origin}}function Pa(a,b,c){if(a.cm){if(!a.cm.curOp)return G(a.cm,Pa)(a,b,c);if(a.cm.state.suppressEdits)return}if(W(a,"beforeChange")||a.cm&&W(a.cm,"beforeChange"))if(b=Je(a,b,!0),!b)return;if(c=Ke&&!c&&ag(a,b.from,b.to))for(var d=c.length-1;0<=d;--d)Le(a,{from:c[d].from,to:c[d].to,text:d?[""]:b.text});
else Le(a,b)}function Le(a,b){if(1!=b.text.length||""!=b.text[0]||0!=w(b.from,b.to)){var c=md(a,b);Me(a,b,c,a.cm?a.cm.curOp.id:NaN);xb(a,b,c,nd(a,b));var d=[];Ga(a,function(a,c){c||-1!=D(d,a.history)||(Ne(a.history,b),d.push(a.history));xb(a,b,null,nd(a,b))})}}function jc(a,b,c){if(!a.cm||!a.cm.state.suppressEdits){for(var d=a.history,e,f=a.sel,g="undo"==b?d.done:d.undone,h="undo"==b?d.undone:d.done,k=0;k<g.length&&(e=g[k],c?!e.ranges||e.equals(a.sel):e.ranges);k++);if(k!=g.length){for(d.lastOrigin=
d.lastSelOrigin=null;;)if(e=g.pop(),e.ranges){Vb(e,h);if(c&&!e.equals(a.sel)){H(a,e,{clearRedo:!1});return}f=e}else break;c=[];Vb(f,h);h.push({changes:c,generation:d.generation});d.generation=e.generation||++d.maxGeneration;d=W(a,"beforeChange")||a.cm&&W(a.cm,"beforeChange");for(k=e.changes.length-1;0<=k;--k){var l=e.changes[k];l.origin=b;if(d&&!Je(a,l,!1)){g.length=0;break}c.push(od(a,l));f=k?md(a,l):z(g);xb(a,l,f,Oe(a,l));!k&&a.cm&&a.cm.scrollIntoView({from:l.from,to:Fa(l)});var m=[];Ga(a,function(a,
b){b||-1!=D(m,a.history)||(Ne(a.history,l),m.push(a.history));xb(a,l,null,Oe(a,l))})}}}}function Pe(a,b){if(0!=b&&(a.first+=b,a.sel=new ka(Qb(a.sel.ranges,function(a){return new y(q(a.anchor.line+b,a.anchor.ch),q(a.head.line+b,a.head.ch))}),a.sel.primIndex),a.cm)){O(a.cm,a.first,a.first-b,b);for(var c=a.cm.display,d=c.viewFrom;d<c.viewTo;d++)ma(a.cm,d,"gutter")}}function xb(a,b,c,d){if(a.cm&&!a.cm.curOp)return G(a.cm,xb)(a,b,c,d);if(b.to.line<a.first)Pe(a,b.text.length-1-(b.to.line-b.from.line));
else if(!(b.from.line>a.lastLine())){if(b.from.line<a.first){var e=b.text.length-1-(a.first-b.from.line);Pe(a,e);b={from:q(a.first,0),to:q(b.to.line+e,b.to.ch),text:[z(b.text)],origin:b.origin}}e=a.lastLine();b.to.line>e&&(b={from:b.from,to:q(e,t(a,e).text.length),text:[b.text[0]],origin:b.origin});b.removed=Ba(a,b.from,b.to);c||(c=md(a,b));a.cm?bg(a.cm,b,d):pd(a,b,d);Ub(a,c,ha)}}function bg(a,b,c){var d=a.doc,e=a.display,f=b.from,g=b.to,h=!1,k=f.line;a.options.lineWrapping||(k=E(ia(t(d,f.line))),
d.iter(k,g.line+1,function(a){if(a==e.maxLine)return h=!0}));-1<d.sel.contains(b.from,b.to)&&he(a);pd(d,b,c,Hd(a));a.options.lineWrapping||(d.iter(k,f.line+b.text.length,function(a){var b=Jb(a);b>e.maxLineLength&&(e.maxLine=a,e.maxLineLength=b,e.maxLineChanged=!0,h=!1)}),h&&(a.curOp.updateMaxLine=!0));d.frontier=Math.min(d.frontier,f.line);fb(a,400);c=b.text.length-(g.line-f.line)-1;b.full?O(a):f.line!=g.line||1!=b.text.length||Qe(a.doc,b)?O(a,f.line,g.line+1,c):ma(a,f.line,"text");c=W(a,"changes");
if((d=W(a,"change"))||c)b={from:f,to:g,text:b.text,removed:b.removed,origin:b.origin},d&&Q(a,"change",a,b),c&&(a.curOp.changeObjs||(a.curOp.changeObjs=[])).push(b);a.display.selForContextMenu=null}function Va(a,b,c,d,e){d||(d=c);if(0>w(d,c)){var f=d;d=c;c=f}"string"==typeof b&&(b=a.splitLines(b));Pa(a,{from:c,to:d,text:b,origin:e})}function ac(a,b,c,d,e){var f=a.display,g=va(a.display);0>c&&(c=0);var h=a.curOp&&null!=a.curOp.scrollTop?a.curOp.scrollTop:f.scroller.scrollTop,k=Nc(a),l={};e-c>k&&(e=
c+k);var m=a.doc.height+Ec(f),s=c<g,g=e>m-g;c<h?l.scrollTop=s?0:c:e>h+k&&(c=Math.min(c,(g?m:e)-k),c!=h&&(l.scrollTop=c));h=a.curOp&&null!=a.curOp.scrollLeft?a.curOp.scrollLeft:f.scroller.scrollLeft;a=pa(a)-(a.options.fixedGutter?f.gutters.offsetWidth:0);(f=d-b>a)&&(d=b+a);10>b?l.scrollLeft=0:b<h?l.scrollLeft=Math.max(0,b-(f?0:10)):d>a+h-3&&(l.scrollLeft=d+(f?0:10)-a);return l}function kc(a,b,c){null==b&&null==c||lc(a);null!=b&&(a.curOp.scrollLeft=(null==a.curOp.scrollLeft?a.doc.scrollLeft:a.curOp.scrollLeft)+
b);null!=c&&(a.curOp.scrollTop=(null==a.curOp.scrollTop?a.doc.scrollTop:a.curOp.scrollTop)+c)}function Qa(a){lc(a);var b=a.getCursor(),c=b,d=b;a.options.lineWrapping||(c=b.ch?q(b.line,b.ch-1):b,d=q(b.line,b.ch+1));a.curOp.scrollToPos={from:c,to:d,margin:a.options.cursorScrollMargin,isCursor:!0}}function lc(a){var b=a.curOp.scrollToPos;if(b){a.curOp.scrollToPos=null;var c=se(a,b.from),d=se(a,b.to),b=ac(a,Math.min(c.left,d.left),Math.min(c.top,d.top)-b.margin,Math.max(c.right,d.right),Math.max(c.bottom,
d.bottom)+b.margin);a.scrollTo(b.scrollLeft,b.scrollTop)}}function pb(a,b,c,d){var e=a.doc,f;null==c&&(c="add");"smart"==c&&(e.mode.indent?f=sb(a,b):c="prev");var g=a.options.tabSize,h=t(e,b),k=aa(h.text,null,g);h.stateAfter&&(h.stateAfter=null);var l=h.text.match(/^\s*/)[0],m;if(!d&&!/\S/.test(h.text))m=0,c="not";else if("smart"==c&&(m=e.mode.indent(f,h.text.slice(l.length),h.text),m==Ee||150<m)){if(!d)return;c="prev"}"prev"==c?m=b>e.first?aa(t(e,b-1).text,null,g):0:"add"==c?m=k+a.options.indentUnit:
"subtract"==c?m=k-a.options.indentUnit:"number"==typeof c&&(m=k+c);m=Math.max(0,m);c="";d=0;if(a.options.indentWithTabs)for(a=Math.floor(m/g);a;--a)d+=g,c+="\t";d<m&&(c+=Re(m-d));if(c!=l)return Va(e,c,q(b,0),q(b,l.length),"+input"),h.stateAfter=null,!0;for(a=0;a<e.sel.ranges.length;a++)if(g=e.sel.ranges[a],g.head.line==b&&g.head.ch<l.length){d=q(b,l.length);Wc(e,a,new y(d,d));break}}function mc(a,b,c,d){var e=b,f=b;"number"==typeof b?f=t(a,Math.max(a.first,Math.min(b,a.first+a.size-1))):e=E(b);if(null==
e)return null;d(f,e)&&a.cm&&ma(a.cm,e,c);return f}function Wa(a,b){for(var c=a.doc.sel.ranges,d=[],e=0;e<c.length;e++){for(var f=b(c[e]);d.length&&0>=w(f.from,z(d).to);){var g=d.pop();if(0>w(g.from,f.from)){f.from=g.from;break}}d.push(f)}R(a,function(){for(var b=d.length-1;0<=b;b--)Va(a.doc,"",d[b].from,d[b].to,"+delete");Qa(a)})}function qd(a,b,c,d,e){function f(b){var d=(e?gd:Se)(l,h,c,!0);if(null==d){if(b=!b)b=g+c,b<a.first||b>=a.first+a.size?b=!1:(g=b,b=l=t(a,b));if(b)h=e?(0>c?$b:Zb)(l):0>c?l.text.length:
0;else return!1}else h=d;return!0}var g=b.line,h=b.ch,k=c,l=t(a,g);if("char"==d)f();else if("column"==d)f(!0);else if("word"==d||"group"==d){var m=null;d="group"==d;for(var s=a.cm&&a.cm.getHelper(b,"wordChars"),p=!0;!(0>c)||f(!p);p=!1){var n=l.text.charAt(h)||"\n",n=nc(n,s)?"w":d&&"\n"==n?"n":!d||/\s/.test(n)?null:"p";!d||p||n||(n="s");if(m&&m!=n){0>c&&(c=1,f());break}n&&(m=n);if(0<c&&!f(!p))break}}k=Xc(a,q(g,h),b,k,!0);w(b,k)||(k.hitSide=!0);return k}function Te(a,b,c,d){var e=a.doc,f=b.left,g;"page"==
d?(g=Math.min(a.display.wrapper.clientHeight,window.innerHeight||document.documentElement.clientHeight),g=b.top+c*(g-(0>c?1.5:.5)*va(a.display))):"line"==d&&(g=0<c?b.bottom+3:b.top-3);for(;;){b=fd(a,f,g);if(!b.outside)break;if(0>c?0>=g:g>=e.height){b.hitSide=!0;break}g+=5*c}return b}function v(a,b,c,d){n.defaults[a]=b;c&&(La[a]=d?function(a,b,d){d!=Ed&&c(a,b,d)}:c)}function cg(a){var b=a.split(/-(?!$)/);a=b[b.length-1];for(var c,d,e,f,g=0;g<b.length-1;g++){var h=b[g];if(/^(cmd|meta|m)$/i.test(h))f=
!0;else if(/^a(lt)?$/i.test(h))c=!0;else if(/^(c|ctrl|control)$/i.test(h))d=!0;else if(/^s(hift)$/i.test(h))e=!0;else throw Error("Unrecognized modifier name: "+h);}c&&(a="Alt-"+a);d&&(a="Ctrl-"+a);f&&(a="Cmd-"+a);e&&(a="Shift-"+a);return a}function oc(a){return"string"==typeof a?ta[a]:a}function Xa(a,b,c,d,e){if(d&&d.shared)return dg(a,b,c,d,e);if(a.cm&&!a.cm.curOp)return G(a.cm,Xa)(a,b,c,d,e);var f=new Ha(a,e);e=w(b,c);d&&X(d,f,!1);if(0<e||0==e&&!1!==f.clearWhenEmpty)return f;f.replacedWith&&(f.collapsed=
!0,f.widgetNode=r("span",[f.replacedWith],"CodeMirror-widget"),d.handleMouseEvents||f.widgetNode.setAttribute("cm-ignore-events","true"),d.insertLeft&&(f.widgetNode.insertLeft=!0));if(f.collapsed){if(Ue(a,b.line,b,c,f)||b.line!=c.line&&Ue(a,c.line,b,c,f))throw Error("Inserting collapsed marker partially overlapping an existing one");ra=!0}f.addToHistory&&Me(a,{from:b,to:c,origin:"markText"},a.sel,NaN);var g=b.line,h=a.cm,k;a.iter(g,c.line+1,function(a){h&&f.collapsed&&!h.options.lineWrapping&&ia(a)==
h.display.maxLine&&(k=!0);f.collapsed&&g!=b.line&&ca(a,0);var d=new pc(f,g==b.line?b.ch:null,g==c.line?c.ch:null);a.markedSpans=a.markedSpans?a.markedSpans.concat([d]):[d];d.marker.attachLine(a);++g});f.collapsed&&a.iter(b.line,c.line+1,function(b){wa(a,b)&&ca(b,0)});f.clearOnEnter&&u(f,"beforeCursorEnter",function(){f.clear()});f.readOnly&&(Ke=!0,(a.history.done.length||a.history.undone.length)&&a.clearHistory());f.collapsed&&(f.id=++rd,f.atomic=!0);if(h){k&&(h.curOp.updateMaxLine=!0);if(f.collapsed)O(h,
b.line,c.line+1);else if(f.className||f.title||f.startStyle||f.endStyle||f.css)for(d=b.line;d<=c.line;d++)ma(h,d,"text");f.atomic&&ie(h.doc);Q(h,"markerAdded",h,f)}return f}function dg(a,b,c,d,e){d=X(d);d.shared=!1;var f=[Xa(a,b,c,d,e)],g=f[0],h=d.widgetNode;Ga(a,function(a){h&&(d.widgetNode=h.cloneNode(!0));f.push(Xa(a,x(a,b),x(a,c),d,e));for(var l=0;l<a.linked.length;++l)if(a.linked[l].isParent)return;g=z(f)});return new qc(f,g)}function Ve(a){return a.findMarks(q(a.first,0),a.clipPos(q(a.lastLine())),
function(a){return a.parent})}function eg(a){for(var b=0;b<a.length;b++){var c=a[b],d=[c.primary.doc];Ga(c.primary.doc,function(a){d.push(a)});for(var e=0;e<c.markers.length;e++){var f=c.markers[e];-1==D(d,f.doc)&&(f.parent=null,c.markers.splice(e--,1))}}}function pc(a,b,c){this.marker=a;this.from=b;this.to=c}function yb(a,b){if(a)for(var c=0;c<a.length;++c){var d=a[c];if(d.marker==b)return d}}function nd(a,b){if(b.full)return null;var c=qb(a,b.from.line)&&t(a,b.from.line).markedSpans,d=qb(a,b.to.line)&&
t(a,b.to.line).markedSpans;if(!c&&!d)return null;var e=b.from.ch,f=b.to.ch,g=0==w(b.from,b.to);if(c)for(var h=0,k;h<c.length;++h){var l=c[h],m=l.marker;if(null==l.from||(m.inclusiveLeft?l.from<=e:l.from<e)||!(l.from!=e||"bookmark"!=m.type||g&&l.marker.insertLeft)){var s=null==l.to||(m.inclusiveRight?l.to>=e:l.to>e);(k||(k=[])).push(new pc(m,l.from,s?null:l.to))}}c=k;if(d)for(var h=0,p;h<d.length;++h)if(k=d[h],l=k.marker,null==k.to||(l.inclusiveRight?k.to>=f:k.to>f)||k.from==f&&"bookmark"==l.type&&
(!g||k.marker.insertLeft))m=null==k.from||(l.inclusiveLeft?k.from<=f:k.from<f),(p||(p=[])).push(new pc(l,m?null:k.from-f,null==k.to?null:k.to-f));d=p;g=1==b.text.length;p=z(b.text).length+(g?e:0);if(c)for(f=0;f<c.length;++f)if(h=c[f],null==h.to)(k=yb(d,h.marker),k)?g&&(h.to=null==k.to?null:k.to+p):h.to=e;if(d)for(f=0;f<d.length;++f)h=d[f],null!=h.to&&(h.to+=p),null==h.from?(k=yb(c,h.marker),k||(h.from=p,g&&(c||(c=[])).push(h))):(h.from+=p,g&&(c||(c=[])).push(h));c&&(c=We(c));d&&d!=c&&(d=We(d));e=
[c];if(!g){var g=b.text.length-2,n;if(0<g&&c)for(f=0;f<c.length;++f)null==c[f].to&&(n||(n=[])).push(new pc(c[f].marker,null,null));for(f=0;f<g;++f)e.push(n);e.push(d)}return e}function We(a){for(var b=0;b<a.length;++b){var c=a[b];null!=c.from&&c.from==c.to&&!1!==c.marker.clearWhenEmpty&&a.splice(b--,1)}return a.length?a:null}function Oe(a,b){var c;if(c=b["spans_"+a.id]){for(var d=0,e=[];d<b.text.length;++d)e.push(fg(c[d]));c=e}else c=null;d=nd(a,b);if(!c)return d;if(!d)return c;for(e=0;e<c.length;++e){var f=
c[e],g=d[e];if(f&&g){var h=0;a:for(;h<g.length;++h){for(var k=g[h],l=0;l<f.length;++l)if(f[l].marker==k.marker)continue a;f.push(k)}}else g&&(c[e]=g)}return c}function ag(a,b,c){var d=null;a.iter(b.line,c.line+1,function(a){if(a.markedSpans)for(var b=0;b<a.markedSpans.length;++b){var c=a.markedSpans[b].marker;!c.readOnly||d&&-1!=D(d,c)||(d||(d=[])).push(c)}});if(!d)return null;a=[{from:b,to:c}];for(b=0;b<d.length;++b){c=d[b];for(var e=c.find(0),f=0;f<a.length;++f){var g=a[f];if(!(0>w(g.to,e.from)||
0<w(g.from,e.to))){var h=[f,1],k=w(g.from,e.from),l=w(g.to,e.to);(0>k||!c.inclusiveLeft&&!k)&&h.push({from:g.from,to:e.from});(0<l||!c.inclusiveRight&&!l)&&h.push({from:e.to,to:g.to});a.splice.apply(a,h);f+=h.length-1}}}return a}function Xe(a){var b=a.markedSpans;if(b){for(var c=0;c<b.length;++c)b[c].marker.detachLine(a);a.markedSpans=null}}function Ye(a,b){if(b){for(var c=0;c<b.length;++c)b[c].marker.attachLine(a);a.markedSpans=b}}function Ze(a,b){var c=a.lines.length-b.lines.length;if(0!=c)return c;
var c=a.find(),d=b.find(),e=w(c.from,d.from)||(a.inclusiveLeft?-1:0)-(b.inclusiveLeft?-1:0);return e?-e:(c=w(c.to,d.to)||(a.inclusiveRight?1:0)-(b.inclusiveRight?1:0))?c:b.id-a.id}function ya(a,b){var c=ra&&a.markedSpans,d;if(c)for(var e,f=0;f<c.length;++f)e=c[f],e.marker.collapsed&&null==(b?e.from:e.to)&&(!d||0>Ze(d,e.marker))&&(d=e.marker);return d}function Ue(a,b,c,d,e){a=t(a,b);if(a=ra&&a.markedSpans)for(b=0;b<a.length;++b){var f=a[b];if(f.marker.collapsed){var g=f.marker.find(0),h=w(g.from,c)||
(f.marker.inclusiveLeft?-1:0)-(e.inclusiveLeft?-1:0),k=w(g.to,d)||(f.marker.inclusiveRight?1:0)-(e.inclusiveRight?1:0);if(!(0<=h&&0>=k||0>=h&&0<=k)&&(0>=h&&(0<w(g.to,c)||f.marker.inclusiveRight&&e.inclusiveLeft)||0<=h&&(0>w(g.from,d)||f.marker.inclusiveLeft&&e.inclusiveRight)))return!0}}}function ia(a){for(var b;b=ya(a,!0);)a=b.find(-1,!0).line;return a}function Mc(a,b){var c=t(a,b),d=ia(c);return c==d?b:E(d)}function Kd(a,b){if(b>a.lastLine())return b;var c=t(a,b),d;if(!wa(a,c))return b;for(;d=ya(c,
!1);)c=d.find(1,!0).line;return E(c)+1}function wa(a,b){var c=ra&&b.markedSpans;if(c)for(var d,e=0;e<c.length;++e)if(d=c[e],d.marker.collapsed&&(null==d.from||!d.marker.widgetNode&&0==d.from&&d.marker.inclusiveLeft&&sd(a,b,d)))return!0}function sd(a,b,c){if(null==c.to)return b=c.marker.find(1,!0),sd(a,b.line,yb(b.line.markedSpans,c.marker));if(c.marker.inclusiveRight&&c.to==b.text.length)return!0;for(var d,e=0;e<b.markedSpans.length;++e)if(d=b.markedSpans[e],d.marker.collapsed&&!d.marker.widgetNode&&
d.from==c.to&&(null==d.to||d.to!=c.from)&&(d.marker.inclusiveLeft||c.marker.inclusiveRight)&&sd(a,b,d))return!0}function ub(a){if(null!=a.height)return a.height;var b=a.doc.cm;if(!b)return 0;if(!Vc(document.body,a.node)){var c="position: relative;";a.coverGutter&&(c+="margin-left: -"+b.display.gutters.offsetWidth+"px;");a.noHScroll&&(c+="width: "+b.display.wrapper.clientWidth+"px;");S(b.display.measure,r("div",[a.node],null,c))}return a.height=a.node.parentNode.offsetHeight}function gg(a,b,c,d){var e=
new rc(a,c,d),f=a.cm;f&&e.noHScroll&&(f.display.alignWidgets=!0);mc(a,b,"widget",function(b){var c=b.widgets||(b.widgets=[]);null==e.insertAt?c.push(e):c.splice(Math.min(c.length-1,Math.max(0,e.insertAt)),0,e);e.line=b;f&&!wa(a,b)&&(c=ea(b)<a.scrollTop,ca(b,b.height+ub(e)),c&&kc(f,null,e.height),f.curOp.forceUpdate=!0);return!0});return e}function $e(a,b){if(a)for(;;){var c=a.match(/(?:^|\s+)line-(background-)?(\S+)/);if(!c)break;a=a.slice(0,c.index)+a.slice(c.index+c[0].length);var d=c[1]?"bgClass":
"textClass";null==b[d]?b[d]=c[2]:(new RegExp("(?:^|s)"+c[2]+"(?:$|s)")).test(b[d])||(b[d]+=" "+c[2])}return a}function af(a,b){if(a.blankLine)return a.blankLine(b);if(a.innerMode){var c=n.innerMode(a,b);if(c.mode.blankLine)return c.mode.blankLine(c.state)}}function td(a,b,c,d){for(var e=0;10>e;e++){d&&(d[0]=n.innerMode(a,c).mode);var f=a.token(b,c);if(b.pos>b.start)return f}throw Error("Mode "+a.name+" failed to advance stream.");}function bf(a,b,c,d){function e(a){return{start:m.start,end:m.pos,
string:m.current(),type:h||null,state:a?sa(f.mode,l):l}}var f=a.doc,g=f.mode,h;b=x(f,b);var k=t(f,b.line),l=sb(a,b.line,c),m=new sc(k.text,a.options.tabSize),s;for(d&&(s=[]);(d||m.pos<b.ch)&&!m.eol();)m.start=m.pos,h=td(g,m,l),d&&s.push(e(!0));return d?s:e()}function cf(a,b,c,d,e,f,g){var h=c.flattenSpans;null==h&&(h=a.options.flattenSpans);var k=0,l=null,m=new sc(b,a.options.tabSize),s,p=a.options.addModeClass&&[null];for(""==b&&$e(af(c,d),f);!m.eol();){m.pos>a.options.maxHighlightLength?(h=!1,g&&
Zc(a,b,d,m.pos),m.pos=b.length,s=null):s=$e(td(c,m,d,p),f);if(p){var n=p[0].name;n&&(s="m-"+(s?n+" "+s:n))}if(!h||l!=s){for(;k<m.start;)k=Math.min(m.start,k+5E4),e(k,l);l=s}m.start=m.pos}for(;k<m.pos;)a=Math.min(m.pos,k+5E4),e(a,l),k=a}function ne(a,b,c,d){var e=[a.state.modeGen],f={};cf(a,b.text,a.doc.mode,c,function(a,b){e.push(a,b)},f,d);for(c=0;c<a.state.overlays.length;++c){var g=a.state.overlays[c],h=1,k=0;cf(a,b.text,g.mode,!0,function(a,b){for(var c=h;k<a;){var d=e[h];d>a&&e.splice(h,1,a,
e[h+1],d);h+=2;k=Math.min(a,d)}if(b)if(g.opaque)e.splice(c,h-c,a,"cm-overlay "+b),h=c+2;else for(;c<h;c+=2)d=e[c+1],e[c+1]=(d?d+" ":"")+"cm-overlay "+b},f)}return{styles:e,classes:f.bgClass||f.textClass?f:null}}function df(a,b,c){if(!b.styles||b.styles[0]!=a.state.modeGen){var d=sb(a,E(b)),e=ne(a,b,b.text.length>a.options.maxHighlightLength?sa(a.doc.mode,d):d);b.stateAfter=d;b.styles=e.styles;e.classes?b.styleClasses=e.classes:b.styleClasses&&(b.styleClasses=null);c===a.doc.frontier&&a.doc.frontier++}return b.styles}
function Zc(a,b,c,d){var e=a.doc.mode;a=new sc(b,a.options.tabSize);a.start=a.pos=d||0;for(""==b&&af(e,c);!a.eol();)td(e,a,c),a.start=a.pos}function ef(a,b){if(!a||/^\s*$/.test(a))return null;var c=b.addModeClass?hg:ig;return c[a]||(c[a]=a.replace(/\S+/g,"cm-$\x26"))}function Rd(a,b){var c=r("span",null,null,K?"padding-right: .1px":null),c={pre:r("pre",[c],"CodeMirror-line"),content:c,col:0,pos:0,cm:a,splitSpaces:(A||K)&&a.getOption("lineWrapping")};b.measure={};for(var d=0;d<=(b.rest?b.rest.length:
0);d++){var e=d?b.rest[d-1]:b.line,f;c.pos=0;c.addToken=jg;var g;if(null!=ud)g=ud;else{g=S(a.display.measure,document.createTextNode("AØ®A"));var h=Ca(g,0,1).getBoundingClientRect();g=h&&h.left!=h.right?ud=3>Ca(g,1,2).getBoundingClientRect().right-h.right:!1}g&&(f=Z(e))&&(c.addToken=kg(c.addToken,f));c.map=[];h=b!=a.display.externalMeasured&&E(e);a:{g=c;var h=df(a,e,h),k=e.markedSpans,l=e.text,m=0;if(k)for(var s=l.length,p=0,n=1,q="",t=void 0,u=void 0,v=0,w=void 0,x=void 0,z=void 0,C=void 0,y=void 0;;){if(v==
p){for(var w=x=z=C=u="",y=null,v=Infinity,G=[],H,B=0;B<k.length;++B){var I=k[B],D=I.marker;"bookmark"==D.type&&I.from==p&&D.widgetNode?G.push(D):I.from<=p&&(null==I.to||I.to>p||D.collapsed&&I.to==p&&I.from==p)?(null!=I.to&&I.to!=p&&v>I.to&&(v=I.to,x=""),D.className&&(w+=" "+D.className),D.css&&(u=(u?u+";":"")+D.css),D.startStyle&&I.from==p&&(z+=" "+D.startStyle),D.endStyle&&I.to==v&&(H||(H=[])).push(D.endStyle,I.to),D.title&&!C&&(C=D.title),D.collapsed&&(!y||0>Ze(y.marker,D))&&(y=I)):I.from>p&&v>
I.from&&(v=I.from)}if(H)for(B=0;B<H.length;B+=2)H[B+1]==v&&(x+=" "+H[B]);if(!y||y.from==p)for(B=0;B<G.length;++B)ff(g,0,G[B]);if(y&&(y.from||0)==p){ff(g,(null==y.to?s+1:y.to)-p,y.marker,null==y.from);if(null==y.to)break a;y.to==p&&(y=!1)}}if(p>=s)break;for(G=Math.min(s,v);;){if(q){B=p+q.length;y||(I=B>G?q.slice(0,G-p):q,g.addToken(g,I,t?t+w:w,z,p+I.length==v?x:"",C,u));if(B>=G){q=q.slice(G-p);p=G;break}p=B;z=""}q=l.slice(m,m=h[n++]);t=ef(h[n++],g.cm.options)}}else for(var n=1;n<h.length;n+=2)g.addToken(g,
l.slice(m,m=h[n]),ef(h[n+1],g.cm.options))}e.styleClasses&&(e.styleClasses.bgClass&&(c.bgClass=vd(e.styleClasses.bgClass,c.bgClass||"")),e.styleClasses.textClass&&(c.textClass=vd(e.styleClasses.textClass,c.textClass||"")));0==c.map.length&&c.map.push(0,0,c.content.appendChild(lg(a.display.measure)));0==d?(b.measure.map=c.map,b.measure.cache={}):((b.measure.maps||(b.measure.maps=[])).push(c.map),(b.measure.caches||(b.measure.caches=[])).push({}))}K&&/\bcm-tab\b/.test(c.content.lastChild.className)&&
(c.content.className="cm-tab-wrap-hack");J(a,"renderLine",a,b.line,c.pre);c.pre.className&&(c.textClass=vd(c.pre.className,c.textClass||""));return c}function jg(a,b,c,d,e,f,g){if(b){var h=a.splitSpaces?b.replace(/ {3,}/g,mg):b,k=a.cm.state.specialChars,l=!1;if(k.test(b))for(var m=document.createDocumentFragment(),s=0;;){k.lastIndex=s;var p=k.exec(b),n=p?p.index-s:b.length-s;if(n){var q=document.createTextNode(h.slice(s,s+n));A&&9>C?m.appendChild(r("span",[q])):m.appendChild(q);a.map.push(a.pos,a.pos+
n,q);a.col+=n;a.pos+=n}if(!p)break;s+=n+1;"\t"==p[0]?(q=a.cm.options.tabSize,p=q-a.col%q,q=m.appendChild(r("span",Re(p),"cm-tab")),q.setAttribute("role","presentation"),q.setAttribute("cm-text","\t"),a.col+=p):("\r"==p[0]||"\n"==p[0]?(q=m.appendChild(r("span","\r"==p[0]?"":"¤","cm-invalidchar")),q.setAttribute("cm-text",p[0])):(q=a.cm.options.specialCharPlaceholder(p[0]),q.setAttribute("cm-text",p[0]),A&&9>C?m.appendChild(r("span",[q])):m.appendChild(q)),a.col+=1);a.map.push(a.pos,a.pos+1,q);a.pos++}else{a.col+=
b.length;var m=document.createTextNode(h);a.map.push(a.pos,a.pos+b.length,m);A&&9>C&&(l=!0);a.pos+=b.length}if(c||d||e||l||g)return b=c||"",d&&(b+=d),e&&(b+=e),d=r("span",[m],b,g),f&&(d.title=f),a.content.appendChild(d);a.content.appendChild(m)}}function mg(a){for(var b=" ",c=0;c<a.length-2;++c)b+=c%2?" ":" ";return b+" "}function kg(a,b){return function(c,d,e,f,g,h,k){e=e?e+" cm-force-border":"cm-force-border";for(var l=c.pos,m=l+d.length;;){for(var s=0;s<b.length;s++){var p=b[s];if(p.to>l&&p.from<=
l)break}if(p.to>=m)return a(c,d,e,f,g,h,k);a(c,d.slice(0,p.to-l),e,f,null,h,k);f=null;d=d.slice(p.to-l);l=p.to}}}function ff(a,b,c,d){var e=!d&&c.widgetNode;e&&a.map.push(a.pos,a.pos+b,e);!d&&a.cm.display.input.needsContentAttribute&&(e||(e=a.content.appendChild(document.createElement("span"))),e.setAttribute("cm-marker",c.id));e&&(a.cm.display.input.setUneditable(e),a.content.appendChild(e));a.pos+=b}function Qe(a,b){return 0==b.from.ch&&0==b.to.ch&&""==z(b.text)&&(!a.cm||a.cm.options.wholeLineUpdateBefore)}
function pd(a,b,c,d){function e(a,c,e){a.text=c;a.stateAfter&&(a.stateAfter=null);a.styles&&(a.styles=null);null!=a.order&&(a.order=null);Xe(a);Ye(a,e);c=d?d(a):1;c!=a.height&&ca(a,c);Q(a,"change",a,b)}function f(a,b){for(var e=a,f=[];e<b;++e)f.push(new zb(k[e],c?c[e]:null,d));return f}var g=b.from,h=b.to,k=b.text,l=t(a,g.line),m=t(a,h.line),s=z(k),p=c?c[k.length-1]:null,n=h.line-g.line;if(b.full)a.insert(0,f(0,k.length)),a.remove(k.length,a.size-k.length);else if(Qe(a,b)){var q=f(0,k.length-1);e(m,
m.text,p);n&&a.remove(g.line,n);q.length&&a.insert(g.line,q)}else l==m?1==k.length?e(l,l.text.slice(0,g.ch)+s+l.text.slice(h.ch),p):(q=f(1,k.length-1),q.push(new zb(s+l.text.slice(h.ch),p,d)),e(l,l.text.slice(0,g.ch)+k[0],c?c[0]:null),a.insert(g.line+1,q)):1==k.length?(e(l,l.text.slice(0,g.ch)+k[0]+m.text.slice(h.ch),c?c[0]:null),a.remove(g.line+1,n)):(e(l,l.text.slice(0,g.ch)+k[0],c?c[0]:null),e(m,s+m.text.slice(h.ch),p),q=f(1,k.length-1),1<n&&a.remove(g.line+1,n-1),a.insert(g.line+1,q));Q(a,"change",
a,b)}function Ab(a){this.lines=a;this.parent=null;for(var b=0,c=0;b<a.length;++b)a[b].parent=this,c+=a[b].height;this.height=c}function Bb(a){this.children=a;for(var b=0,c=0,d=0;d<a.length;++d){var e=a[d],b=b+e.chunkSize(),c=c+e.height;e.parent=this}this.size=b;this.height=c;this.parent=null}function Ga(a,b,c){function d(a,f,g){if(a.linked)for(var h=0;h<a.linked.length;++h){var k=a.linked[h];if(k.doc!=f){var l=g&&k.sharedHist;if(!c||l)b(k.doc,l),d(k.doc,a,l)}}}d(a,null,!0)}function Dd(a,b){if(b.cm)throw Error("This document is already in use.");
a.doc=b;b.cm=a;Ac(a);zc(a);a.options.lineWrapping||Dc(a);a.options.mode=b.modeOption;O(a)}function t(a,b){b-=a.first;if(0>b||b>=a.size)throw Error("There is no line "+(b+a.first)+" in the document.");for(var c=a;!c.lines;)for(var d=0;;++d){var e=c.children[d],f=e.chunkSize();if(b<f){c=e;break}b-=f}return c.lines[b]}function Ba(a,b,c){var d=[],e=b.line;a.iter(b.line,c.line+1,function(a){a=a.text;e==c.line&&(a=a.slice(0,c.ch));e==b.line&&(a=a.slice(b.ch));d.push(a);++e});return d}function wd(a,b,c){var d=
[];a.iter(b,c,function(a){d.push(a.text)});return d}function ca(a,b){var c=b-a.height;if(c)for(var d=a;d;d=d.parent)d.height+=c}function E(a){if(null==a.parent)return null;var b=a.parent;a=D(b.lines,a);for(var c=b.parent;c;b=c,c=c.parent)for(var d=0;c.children[d]!=b;++d)a+=c.children[d].chunkSize();return a+b.first}function za(a,b){var c=a.first;a:do{for(var d=0;d<a.children.length;++d){var e=a.children[d],f=e.height;if(b<f){a=e;continue a}b-=f;c+=e.chunkSize()}return c}while(!a.lines);for(d=0;d<
a.lines.length;++d){e=a.lines[d].height;if(b<e)break;b-=e}return c+d}function ea(a){a=ia(a);for(var b=0,c=a.parent,d=0;d<c.lines.length;++d){var e=c.lines[d];if(e==a)break;else b+=e.height}for(a=c.parent;a;c=a,a=c.parent)for(d=0;d<a.children.length&&(e=a.children[d],e!=c);++d)b+=e.height;return b}function Z(a){var b=a.order;null==b&&(b=a.order=ng(a.text));return b}function tc(a){this.done=[];this.undone=[];this.undoDepth=Infinity;this.lastModTime=this.lastSelTime=0;this.lastOrigin=this.lastSelOrigin=
this.lastOp=this.lastSelOp=null;this.generation=this.maxGeneration=a||1}function od(a,b){var c={from:Rc(b.from),to:Fa(b),text:Ba(a,b.from,b.to)};gf(a,c,b.from.line,b.to.line+1);Ga(a,function(a){gf(a,c,b.from.line,b.to.line+1)},!0);return c}function ee(a){for(;a.length;)if(z(a).ranges)a.pop();else break}function Me(a,b,c,d){var e=a.history;e.undone.length=0;var f=+new Date,g,h;if(h=e.lastOp==d||e.lastOrigin==b.origin&&b.origin&&("+"==b.origin.charAt(0)&&a.cm&&e.lastModTime>f-a.cm.options.historyEventDelay||
"*"==b.origin.charAt(0)))e.lastOp==d?(ee(e.done),g=z(e.done)):e.done.length&&!z(e.done).ranges?g=z(e.done):1<e.done.length&&!e.done[e.done.length-2].ranges?(e.done.pop(),g=z(e.done)):g=void 0,h=g;if(h){var k=z(g.changes);0==w(b.from,b.to)&&0==w(b.from,k.to)?k.to=Fa(b):g.changes.push(od(a,b))}else for((g=z(e.done))&&g.ranges||Vb(a.sel,e.done),g={changes:[od(a,b)],generation:e.generation},e.done.push(g);e.done.length>e.undoDepth;)e.done.shift(),e.done[0].ranges||e.done.shift();e.done.push(c);e.generation=
++e.maxGeneration;e.lastModTime=e.lastSelTime=f;e.lastOp=e.lastSelOp=d;e.lastOrigin=e.lastSelOrigin=b.origin;k||J(a,"historyAdded")}function Vb(a,b){var c=z(b);c&&c.ranges&&c.equals(a)||b.push(a)}function gf(a,b,c,d){var e=b["spans_"+a.id],f=0;a.iter(Math.max(a.first,c),Math.min(a.first+a.size,d),function(c){c.markedSpans&&((e||(e=b["spans_"+a.id]={}))[f]=c.markedSpans);++f})}function fg(a){if(!a)return null;for(var b=0,c;b<a.length;++b)a[b].marker.explicitlyCleared?c||(c=a.slice(0,b)):c&&c.push(a[b]);
return c?c.length?c:null:a}function Ya(a,b,c){for(var d=0,e=[];d<a.length;++d){var f=a[d];if(f.ranges)e.push(c?ka.prototype.deepCopy.call(f):f);else{var f=f.changes,g=[];e.push({changes:g});for(var h=0;h<f.length;++h){var k=f[h],l;g.push({from:k.from,to:k.to,text:k.text});if(b)for(var m in k)(l=m.match(/^spans_(\d+)$/))&&-1<D(b,Number(l[1]))&&(z(g)[m]=k[m],delete k[m])}}}return e}function hf(a,b,c,d){c<a.line?a.line+=d:b<a.line&&(a.line=b,a.ch=0)}function jf(a,b,c,d){for(var e=0;e<a.length;++e){var f=
a[e],g=!0;if(f.ranges){f.copied||(f=a[e]=f.deepCopy(),f.copied=!0);for(var h=0;h<f.ranges.length;h++)hf(f.ranges[h].anchor,b,c,d),hf(f.ranges[h].head,b,c,d)}else{for(h=0;h<f.changes.length;++h){var k=f.changes[h];if(c<k.from.line)k.from=q(k.from.line+d,k.from.ch),k.to=q(k.to.line+d,k.to.ch);else if(b<=k.to.line){g=!1;break}}g||(a.splice(0,e+1),e=0)}}}function Ne(a,b){var c=b.from.line,d=b.to.line,e=b.text.length-(d-c)-1;jf(a.done,c,d,e);jf(a.undone,c,d,e)}function kd(a){return null!=a.defaultPrevented?
a.defaultPrevented:0==a.returnValue}function Be(a){var b=a.which;null==b&&(a.button&1?b=1:a.button&2?b=3:a.button&4&&(b=2));Y&&a.ctrlKey&&1==b&&(b=3);return b}function uc(a,b,c){a=a._handlers&&a._handlers[b];return c?a&&0<a.length?a.slice():kf:a||kf}function Q(a,b){function c(a){return function(){a.apply(null,e)}}var d=uc(a,b,!1);if(d.length){var e=Array.prototype.slice.call(arguments,2),f;Ua?f=Ua.delayedCallbacks:Cb?f=Cb:(f=Cb=[],setTimeout(og,0));for(var g=0;g<d.length;++g)f.push(c(d[g]))}}function og(){var a=
Cb;Cb=null;for(var b=0;b<a.length;++b)a[b]()}function B(a,b,c){"string"==typeof b&&(b={type:b,preventDefault:function(){this.defaultPrevented=!0}});J(a,c||b.type,a,b);return kd(b)||b.codemirrorIgnore}function he(a){var b=a._handlers&&a._handlers.cursorActivity;if(b){a=a.curOp.cursorActivityHandlers||(a.curOp.cursorActivityHandlers=[]);for(var c=0;c<b.length;++c)-1==D(a,b[c])&&a.push(b[c])}}function W(a,b){return 0<uc(a,b).length}function Za(a){a.prototype.on=function(a,c){u(this,a,c)};a.prototype.off=
function(a,c){ja(this,a,c)}}function ua(){this.id=null}function Re(a){for(;vc.length<=a;)vc.push(z(vc)+" ");return vc[a]}function z(a){return a[a.length-1]}function D(a,b){for(var c=0;c<a.length;++c)if(a[c]==b)return c;return-1}function Qb(a,b){for(var c=[],d=0;d<a.length;d++)c[d]=b(a[d],d);return c}function Db(){}function lf(a,b){var c;Object.create?c=Object.create(a):(Db.prototype=a,c=new Db);b&&X(b,c);return c}function X(a,b,c){b||(b={});for(var d in a)!a.hasOwnProperty(d)||!1===c&&b.hasOwnProperty(d)||
(b[d]=a[d]);return b}function cb(a){var b=Array.prototype.slice.call(arguments,1);return function(){return a.apply(null,b)}}function nc(a,b){return b?-1<b.source.indexOf("\\w")&&mf(a)?!0:b.test(a):mf(a)}function nf(a){for(var b in a)if(a.hasOwnProperty(b)&&a[b])return!1;return!0}function tb(a){return 768<=a.charCodeAt(0)&&pg.test(a)}function r(a,b,c,d){a=document.createElement(a);c&&(a.className=c);d&&(a.style.cssText=d);if("string"==typeof b)a.appendChild(document.createTextNode(b));else if(b)for(c=
0;c<b.length;++c)a.appendChild(b[c]);return a}function xa(a){for(var b=a.childNodes.length;0<b;--b)a.removeChild(a.firstChild);return a}function S(a,b){return xa(a).appendChild(b)}function fa(){for(var a=document.activeElement;a&&a.root&&a.root.activeElement;)a=a.root.activeElement;return a}function Eb(a){return new RegExp("(^|\\s)"+a+"(?:$|\\s)\\s*")}function vd(a,b){for(var c=a.split(" "),d=0;d<c.length;d++)c[d]&&!Eb(c[d]).test(b)&&(b+=" "+c[d]);return b}function of(a){if(document.body.getElementsByClassName)for(var b=
document.body.getElementsByClassName("CodeMirror"),c=0;c<b.length;c++){var d=b[c].CodeMirror;d&&a(d)}}function zf(){var a;u(window,"resize",function(){null==a&&(a=setTimeout(function(){a=null;of(Pf)},100))});u(window,"blur",function(){of(db)})}function lg(a){if(null==xd){var b=r("span","€‹");S(a,r("span",[b,document.createTextNode("x")]));0!=a.firstChild.offsetHeight&&(xd=1>=b.offsetWidth&&2<b.offsetHeight&&!(A&&8>C))}a=xd?r("span","€‹"):r("span"," ",null,"display: inline-block; width: 1px; margin-right: -1px; color: white;");
a.setAttribute("cm-text","");return a}function Gf(a,b,c,d){if(!a)return d(b,c,"ltr");for(var e=!1,f=0;f<a.length;++f){var g=a[f];if(g.from<c&&g.to>b||b==c&&g.to==b)d(Math.max(g.from,b),Math.min(g.to,c),1==g.level?"rtl":"ltr"),e=!0}e||d(b,c,"ltr")}function dd(a){return a.level%2?a.to:a.from}function ed(a){return a.level%2?a.from:a.to}function Zb(a){return(a=Z(a))?dd(a[0]):0}function $b(a){var b=Z(a);return b?ed(z(b)):a.text.length}function pf(a,b){var c=t(a.doc,b),d=ia(c);d!=c&&(b=E(d));d=(c=Z(d))?
c[0].level%2?$b(d):Zb(d):0;return q(b,d)}function qf(a,b){var c=pf(a,b.line),d=t(a.doc,c.line),e=Z(d);return e&&0!=e[0].level?c:(d=Math.max(0,d.text.search(/\S/)),q(c.line,b.line==c.line&&b.ch<=d&&b.ch?0:d))}function Rb(a,b){vb=null;for(var c=0,d;c<a.length;++c){var e=a[c];if(e.from<b&&e.to>b)return c;if(e.from==b||e.to==b)if(null==d)d=c;else{var f;f=e.level;var g=a[d].level,h=a[0].level;f=f==h?!0:g==h?!1:f<g;if(f)return e.from!=e.to&&(vb=d),c;e.from!=e.to&&(vb=c);break}}return d}function yd(a,b,
c,d){if(!d)return b+c;do b+=c;while(0<b&&tb(a.text.charAt(b)));return b}function gd(a,b,c,d){var e=Z(a);if(!e)return Se(a,b,c,d);var f=Rb(e,b),g=e[f];for(b=yd(a,b,g.level%2?-c:c,d);;){if(b>g.from&&b<g.to)return b;if(b==g.from||b==g.to){if(Rb(e,b)==f)return b;g=e[f+c];return 0<c==g.level%2?g.to:g.from}g=e[f+=c];if(!g)return null;b=0<c==g.level%2?yd(a,g.to,-1,d):yd(a,g.from,1,d)}}function Se(a,b,c,d){b+=c;if(d)for(;0<b&&tb(a.text.charAt(b));)b+=c;return 0>b||b>a.text.length?null:b}var U=navigator.userAgent,
rf=navigator.platform,oa=/gecko\/\d/i.test(U),sf=/MSIE \d/.test(U),tf=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(U),A=sf||tf,C=A&&(sf?document.documentMode||6:tf[1]),K=/WebKit\//.test(U),qg=K&&/Qt\/\d+\.\d+/.test(U),rg=/Chrome\//.test(U),ba=/Opera\//.test(U),we=/Apple Computer/.test(navigator.vendor),sg=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(U),Mf=/PhantomJS/.test(U),Ra=/AppleWebKit/.test(U)&&/Mobile\/\w+/.test(U),bb=Ra||/Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(U),Y=Ra||/Mac/.test(rf),
tg=/win/i.test(rf),Ia=ba&&U.match(/Version\/(\d*\.\d*)/);Ia&&(Ia=Number(Ia[1]));Ia&&15<=Ia&&(ba=!1,K=!0);var uf=Y&&(qg||ba&&(null==Ia||12.11>Ia)),id=oa||A&&9<=C,Ke=!1,ra=!1;Fc.prototype=X({update:function(a){var b=a.scrollWidth>a.clientWidth+1,c=a.scrollHeight>a.clientHeight+1,d=a.nativeBarWidth;c?(this.vert.style.display="block",this.vert.style.bottom=b?d+"px":"0",this.vert.firstChild.style.height=Math.max(0,a.scrollHeight-a.clientHeight+(a.viewHeight-(b?d:0)))+"px"):(this.vert.style.display="",
this.vert.firstChild.style.height="0");b?(this.horiz.style.display="block",this.horiz.style.right=c?d+"px":"0",this.horiz.style.left=a.barLeft+"px",this.horiz.firstChild.style.width=a.scrollWidth-a.clientWidth+(a.viewWidth-a.barLeft-(c?d:0))+"px"):(this.horiz.style.display="",this.horiz.firstChild.style.width="0");!this.checkedZeroWidth&&0<a.clientHeight&&(0==d&&this.zeroWidthHack(),this.checkedZeroWidth=!0);return{right:c?d:0,bottom:b?d:0}},setScrollLeft:function(a){this.horiz.scrollLeft!=a&&(this.horiz.scrollLeft=
a);this.disableHoriz&&this.enableZeroWidthBar(this.horiz,this.disableHoriz)},setScrollTop:function(a){this.vert.scrollTop!=a&&(this.vert.scrollTop=a);this.disableVert&&this.enableZeroWidthBar(this.vert,this.disableVert)},zeroWidthHack:function(){this.horiz.style.height=this.vert.style.width=Y&&!sg?"12px":"18px";this.horiz.style.pointerEvents=this.vert.style.pointerEvents="none";this.disableHoriz=new ua;this.disableVert=new ua},enableZeroWidthBar:function(a,b){function c(){var d=a.getBoundingClientRect();
document.elementFromPoint(d.left+1,d.bottom-1)!=a?a.style.pointerEvents="none":b.set(1E3,c)}a.style.pointerEvents="auto";b.set(1E3,c)},clear:function(){var a=this.horiz.parentNode;a.removeChild(this.horiz);a.removeChild(this.vert)}},Fc.prototype);Gc.prototype=X({update:function(){return{bottom:0,right:0}},setScrollLeft:function(){},setScrollTop:function(){},clear:function(){}},Gc.prototype);n.scrollbarModel={"native":Fc,"null":Gc};Lb.prototype.signal=function(a,b){W(a,b)&&this.events.push(arguments)};
Lb.prototype.finish=function(){for(var a=0;a<this.events.length;a++)J.apply(null,this.events[a])};var q=n.Pos=function(a,b){if(!(this instanceof q))return new q(a,b);this.line=a;this.ch=b},w=n.cmpPos=function(a,b){return a.line-b.line||a.ch-b.ch},V=null;Sc.prototype=X({init:function(a){function b(a){if(!B(d,a)){if(d.somethingSelected())V=d.getSelections(),c.inaccurateSelection&&(c.prevInput="",c.inaccurateSelection=!1,f.value=V.join("\n"),$a(f));else if(d.options.lineWiseCopyCut){var b=Wd(d);V=b.text;
"cut"==a.type?d.setSelections(b.ranges,null,ha):(c.prevInput="",f.value=b.text.join("\n"),$a(f))}else return;"cut"==a.type&&(d.state.cutIncoming=!0)}}var c=this,d=this.cm,e=this.wrapper=Yd(),f=this.textarea=e.firstChild;a.wrapper.insertBefore(e,a.wrapper.firstChild);Ra&&(f.style.width="0px");u(f,"input",function(){A&&9<=C&&c.hasSelection&&(c.hasSelection=null);c.poll()});u(f,"paste",function(a){B(d,a)||Vd(a,d)||(d.state.pasteIncoming=!0,c.fastPoll())});u(f,"cut",b);u(f,"copy",b);u(a.scroller,"paste",
function(b){na(a,b)||B(d,b)||(d.state.pasteIncoming=!0,c.focus())});u(a.lineSpace,"selectstart",function(b){na(a,b)||N(b)});u(f,"compositionstart",function(){var a=d.getCursor("from");c.composing&&c.composing.range.clear();c.composing={start:a,range:d.markText(a,d.getCursor("to"),{className:"CodeMirror-composing"})}});u(f,"compositionend",function(){c.composing&&(c.poll(),c.composing.range.clear(),c.composing=null)})},prepareSelection:function(){var a=this.cm,b=a.display,c=a.doc,d=ke(a);if(a.options.moveInputWithCursor){var a=
la(a,c.sel.primary().head,"div"),c=b.wrapper.getBoundingClientRect(),e=b.lineDiv.getBoundingClientRect();d.teTop=Math.max(0,Math.min(b.wrapper.clientHeight-10,a.top+e.top-c.top));d.teLeft=Math.max(0,Math.min(b.wrapper.clientWidth-10,a.left+e.left-c.left))}return d},showSelection:function(a){var b=this.cm.display;S(b.cursorDiv,a.cursors);S(b.selectionDiv,a.selection);null!=a.teTop&&(this.wrapper.style.top=a.teTop+"px",this.wrapper.style.left=a.teLeft+"px")},reset:function(a){if(!this.contextMenuPending){var b,
c,d=this.cm,e=d.doc;d.somethingSelected()?(this.prevInput="",b=e.sel.primary(),c=(b=Ge&&(100<b.to().line-b.from().line||1E3<(c=d.getSelection()).length))?"-":c||d.getSelection(),this.textarea.value=c,d.state.focused&&$a(this.textarea),A&&9<=C&&(this.hasSelection=c)):a||(this.prevInput=this.textarea.value="",A&&9<=C&&(this.hasSelection=null));this.inaccurateSelection=b}},getField:function(){return this.textarea},supportsTouch:function(){return!1},focus:function(){if("nocursor"!=this.cm.options.readOnly&&
(!bb||fa()!=this.textarea))try{this.textarea.focus()}catch(a){}},blur:function(){this.textarea.blur()},resetPosition:function(){this.wrapper.style.top=this.wrapper.style.left=0},receivedFocus:function(){this.slowPoll()},slowPoll:function(){var a=this;a.pollingFast||a.polling.set(this.cm.options.pollInterval,function(){a.poll();a.cm.state.focused&&a.slowPoll()})},fastPoll:function(){function a(){c.poll()||b?(c.pollingFast=!1,c.slowPoll()):(b=!0,c.polling.set(60,a))}var b=!1,c=this;c.pollingFast=!0;
c.polling.set(20,a)},poll:function(){var a=this.cm,b=this.textarea,c=this.prevInput;if(this.contextMenuPending||!a.state.focused||ug(b)&&!c&&!this.composing||a.isReadOnly()||a.options.disableInput||a.state.keySeq)return!1;var d=b.value;if(d==c&&!a.somethingSelected())return!1;if(A&&9<=C&&this.hasSelection===d||Y&&/[\uf700-\uf7ff]/.test(d))return a.display.input.reset(),!1;if(a.doc.sel==a.display.selForContextMenu){var e=d.charCodeAt(0);8203!=e||c||(c="€‹");if(8666==e)return this.reset(),this.cm.execCommand("undo")}for(var f=
0,e=Math.min(c.length,d.length);f<e&&c.charCodeAt(f)==d.charCodeAt(f);)++f;var g=this;R(a,function(){Pb(a,d.slice(f),c.length-f,null,g.composing?"*compose":null);1E3<d.length||-1<d.indexOf("\n")?b.value=g.prevInput="":g.prevInput=d;g.composing&&(g.composing.range.clear(),g.composing.range=a.markText(g.composing.start,a.getCursor("to"),{className:"CodeMirror-composing"}))});return!0},ensurePolled:function(){this.pollingFast&&this.poll()&&(this.pollingFast=!1)},onKeyPress:function(){A&&9<=C&&(this.hasSelection=
null);this.fastPoll()},onContextMenu:function(a){function b(){if(null!=g.selectionStart){var a=e.somethingSelected(),b="€‹"+(a?g.value:"");g.value="‡š";g.value=b;d.prevInput=a?"":"€‹";g.selectionStart=1;g.selectionEnd=b.length;f.selForContextMenu=e.doc.sel}}function c(){d.contextMenuPending=!1;d.wrapper.style.position="relative";g.style.cssText=l;A&&9>C&&f.scrollbars.setScrollTop(f.scroller.scrollTop=k);if(null!=g.selectionStart){(!A||A&&9>C)&&b();var a=0,c=function(){f.selForContextMenu==e.doc.sel&&
0==g.selectionStart&&0<g.selectionEnd&&"€‹"==d.prevInput?G(e,hc.selectAll)(e):10>a++?f.detectingSelectAll=setTimeout(c,500):f.input.reset()};f.detectingSelectAll=setTimeout(c,200)}}var d=this,e=d.cm,f=e.display,g=d.textarea,h=Ea(e,a),k=f.scroller.scrollTop;if(h&&!ba){e.options.resetSelectionOnContextMenu&&-1==e.doc.sel.contains(h)&&G(e,H)(e.doc,ga(h),ha);var l=g.style.cssText;d.wrapper.style.position="absolute";g.style.cssText="position: fixed; width: 30px; height: 30px; top: "+(a.clientY-5)+"px; left: "+
(a.clientX-5)+"px; z-index: 1000; background: "+(A?"rgba(255, 255, 255, .05)":"transparent")+"; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity\x3d5);";if(K)var m=window.scrollY;f.input.focus();K&&window.scrollTo(null,m);f.input.reset();e.somethingSelected()||(g.value=d.prevInput=" ");d.contextMenuPending=!0;f.selForContextMenu=e.doc.sel;clearTimeout(f.detectingSelectAll);A&&9<=C&&b();if(id){cc(a);var n=function(){ja(window,"mouseup",n);setTimeout(c,
20)};u(window,"mouseup",n)}else setTimeout(c,50)}},readOnlyChanged:function(a){a||this.reset()},setUneditable:Db,needsContentAttribute:!1},Sc.prototype);Tc.prototype=X({init:function(a){function b(a){if(!B(d,a)){if(d.somethingSelected())V=d.getSelections(),"cut"==a.type&&d.replaceSelection("",null,"cut");else if(d.options.lineWiseCopyCut){var b=Wd(d);V=b.text;"cut"==a.type&&d.operation(function(){d.setSelections(b.ranges,0,ha);d.replaceSelection("",null,"cut")})}else return;if(a.clipboardData&&!Ra)a.preventDefault(),
a.clipboardData.clearData(),a.clipboardData.setData("text/plain",V.join("\n"));else{var c=Yd();a=c.firstChild;d.display.lineSpace.insertBefore(c,d.display.lineSpace.firstChild);a.value=V.join("\n");var h=document.activeElement;$a(a);setTimeout(function(){d.display.lineSpace.removeChild(c);h.focus()},50)}}}var c=this,d=c.cm;a=c.div=a.lineDiv;Xd(a);u(a,"paste",function(a){B(d,a)||Vd(a,d)});u(a,"compositionstart",function(a){a=a.data;c.composing={sel:d.doc.sel,data:a,startData:a};if(a){var b=d.doc.sel.primary(),
g=d.getLine(b.head.line).indexOf(a,Math.max(0,b.head.ch-a.length));-1<g&&g<=b.head.ch&&(c.composing.sel=ga(q(b.head.line,g),q(b.head.line,g+a.length)))}});u(a,"compositionupdate",function(a){c.composing.data=a.data});u(a,"compositionend",function(a){var b=c.composing;b&&(a.data==b.startData||/\u200b/.test(a.data)||(b.data=a.data),setTimeout(function(){b.handled||c.applyComposition(b);c.composing==b&&(c.composing=null)},50))});u(a,"touchstart",function(){c.forceCompositionEnd()});u(a,"input",function(){c.composing||
!d.isReadOnly()&&c.pollContent()||R(c.cm,function(){O(d)})});u(a,"copy",b);u(a,"cut",b)},prepareSelection:function(){var a=ke(this.cm,!1);a.focus=this.cm.state.focused;return a},showSelection:function(a){a&&this.cm.display.view.length&&(a.focus&&this.showPrimarySelection(),this.showMultipleSelections(a))},showPrimarySelection:function(){var a=window.getSelection(),b=this.cm.doc.sel.primary(),c=Sb(this.cm,a.anchorNode,a.anchorOffset),d=Sb(this.cm,a.focusNode,a.focusOffset);if(!c||c.bad||!d||d.bad||
0!=w(Ob(c,d),b.from())||0!=w(Nb(c,d),b.to()))if(c=Zd(this.cm,b.from()),d=Zd(this.cm,b.to()),c||d){var e=this.cm.display.view,b=a.rangeCount&&a.getRangeAt(0);c?d||(d=e[e.length-1].measure,d=d.maps?d.maps[d.maps.length-1]:d.map,d={node:d[d.length-1],offset:d[d.length-2]-d[d.length-3]}):c={node:e[0].measure.map[2],offset:0};try{var f=Ca(c.node,c.offset,d.offset,d.node)}catch(g){}f&&(!oa&&this.cm.state.focused?(a.collapse(c.node,c.offset),f.collapsed||a.addRange(f)):(a.removeAllRanges(),a.addRange(f)),
b&&null==a.anchorNode?a.addRange(b):oa&&this.startGracePeriod());this.rememberSelection()}},startGracePeriod:function(){var a=this;clearTimeout(this.gracePeriod);this.gracePeriod=setTimeout(function(){a.gracePeriod=!1;a.selectionChanged()&&a.cm.operation(function(){a.cm.curOp.selectionChanged=!0})},20)},showMultipleSelections:function(a){S(this.cm.display.cursorDiv,a.cursors);S(this.cm.display.selectionDiv,a.selection)},rememberSelection:function(){var a=window.getSelection();this.lastAnchorNode=
a.anchorNode;this.lastAnchorOffset=a.anchorOffset;this.lastFocusNode=a.focusNode;this.lastFocusOffset=a.focusOffset},selectionInEditor:function(){var a=window.getSelection();if(!a.rangeCount)return!1;a=a.getRangeAt(0).commonAncestorContainer;return Vc(this.div,a)},focus:function(){"nocursor"!=this.cm.options.readOnly&&this.div.focus()},blur:function(){this.div.blur()},getField:function(){return this.div},supportsTouch:function(){return!0},receivedFocus:function(){function a(){b.cm.state.focused&&
(b.pollSelection(),b.polling.set(b.cm.options.pollInterval,a))}var b=this;this.selectionInEditor()?this.pollSelection():R(this.cm,function(){b.cm.curOp.selectionChanged=!0});this.polling.set(this.cm.options.pollInterval,a)},selectionChanged:function(){var a=window.getSelection();return a.anchorNode!=this.lastAnchorNode||a.anchorOffset!=this.lastAnchorOffset||a.focusNode!=this.lastFocusNode||a.focusOffset!=this.lastFocusOffset},pollSelection:function(){if(!this.composing&&!this.gracePeriod&&this.selectionChanged()){var a=
window.getSelection(),b=this.cm;this.rememberSelection();var c=Sb(b,a.anchorNode,a.anchorOffset),d=Sb(b,a.focusNode,a.focusOffset);c&&d&&R(b,function(){H(b.doc,ga(c,d),ha);if(c.bad||d.bad)b.curOp.selectionChanged=!0})}},pollContent:function(){var a=this.cm,b=a.display,c=a.doc.sel.primary(),d=c.from(),c=c.to();if(d.line<b.viewFrom||c.line>b.viewTo-1)return!1;var e;d.line==b.viewFrom||0==(e=Aa(a,d.line))?(d=E(b.view[0].line),e=b.view[0].node):(d=E(b.view[e].line),e=b.view[e-1].node.nextSibling);var f=
Aa(a,c.line);f==b.view.length-1?(c=b.viewTo-1,b=b.lineDiv.lastChild):(c=E(b.view[f+1].line)-1,b=b.view[f+1].node.previousSibling);b=a.doc.splitLines(Df(a,e,b,d,c));for(e=Ba(a.doc,q(d,0),q(c,t(a.doc,c).text.length));1<b.length&&1<e.length;)if(z(b)==z(e))b.pop(),e.pop(),c--;else if(b[0]==e[0])b.shift(),e.shift(),d++;else break;for(var g=0,f=0,h=b[0],k=e[0],l=Math.min(h.length,k.length);g<l&&h.charCodeAt(g)==k.charCodeAt(g);)++g;h=z(b);k=z(e);for(l=Math.min(h.length-(1==b.length?g:0),k.length-(1==e.length?
g:0));f<l&&h.charCodeAt(h.length-f-1)==k.charCodeAt(k.length-f-1);)++f;b[b.length-1]=h.slice(0,h.length-f);b[0]=b[0].slice(g);d=q(d,g);c=q(c,e.length?z(e).length-f:0);if(1<b.length||b[0]||w(d,c))return Va(a.doc,b,d,c,"+input"),!0},ensurePolled:function(){this.forceCompositionEnd()},reset:function(){this.forceCompositionEnd()},forceCompositionEnd:function(){this.composing&&!this.composing.handled&&(this.applyComposition(this.composing),this.composing.handled=!0,this.div.blur(),this.div.focus())},applyComposition:function(a){this.cm.isReadOnly()?
G(this.cm,O)(this.cm):a.data&&a.data!=a.startData&&G(this.cm,Pb)(this.cm,a.data,0,a.sel)},setUneditable:function(a){a.contentEditable="false"},onKeyPress:function(a){a.preventDefault();this.cm.isReadOnly()||G(this.cm,Pb)(this.cm,String.fromCharCode(null==a.charCode?a.keyCode:a.charCode),0)},readOnlyChanged:function(a){this.div.contentEditable=String("nocursor"!=a)},onContextMenu:Db,resetPosition:Db,needsContentAttribute:!0},Tc.prototype);n.inputStyles={textarea:Sc,contenteditable:Tc};ka.prototype=
{primary:function(){return this.ranges[this.primIndex]},equals:function(a){if(a==this)return!0;if(a.primIndex!=this.primIndex||a.ranges.length!=this.ranges.length)return!1;for(var b=0;b<this.ranges.length;b++){var c=this.ranges[b],d=a.ranges[b];if(0!=w(c.anchor,d.anchor)||0!=w(c.head,d.head))return!1}return!0},deepCopy:function(){for(var a=[],b=0;b<this.ranges.length;b++)a[b]=new y(Rc(this.ranges[b].anchor),Rc(this.ranges[b].head));return new ka(a,this.primIndex)},somethingSelected:function(){for(var a=
0;a<this.ranges.length;a++)if(!this.ranges[a].empty())return!0;return!1},contains:function(a,b){b||(b=a);for(var c=0;c<this.ranges.length;c++){var d=this.ranges[c];if(0<=w(b,d.from())&&0>=w(a,d.to()))return c}return-1}};y.prototype={from:function(){return Ob(this.anchor,this.head)},to:function(){return Nb(this.anchor,this.head)},empty:function(){return this.head.line==this.anchor.line&&this.head.ch==this.anchor.ch}};var ad={left:0,right:0,top:0,bottom:0},Da,Ua=null,Lf=0,ec,dc,ve=0,fc=0,T=null;A?T=
-.53:oa?T=15:rg?T=-.7:we&&(T=-1/3);var De=function(a){var b=a.wheelDeltaX,c=a.wheelDeltaY;null==b&&a.detail&&a.axis==a.HORIZONTAL_AXIS&&(b=a.detail);null==c&&a.detail&&a.axis==a.VERTICAL_AXIS?c=a.detail:null==c&&(c=a.wheelDelta);return{x:b,y:c}};n.wheelEventPixels=function(a){a=De(a);a.x*=T;a.y*=T;return a};var Xf=new ua,ld=null,Fa=n.changeEnd=function(a){return a.text?q(a.from.line+a.text.length-1,z(a.text).length+(1==a.text.length?a.from.ch:0)):a.to};n.prototype={constructor:n,focus:function(){window.focus();
this.display.input.focus()},setOption:function(a,b){var c=this.options,d=c[a];if(c[a]!=b||"mode"==a)c[a]=b,La.hasOwnProperty(a)&&G(this,La[a])(this,b,d)},getOption:function(a){return this.options[a]},getDoc:function(){return this.doc},addKeyMap:function(a,b){this.state.keyMaps[b?"push":"unshift"](oc(a))},removeKeyMap:function(a){for(var b=this.state.keyMaps,c=0;c<b.length;++c)if(b[c]==a||b[c].name==a)return b.splice(c,1),!0},addOverlay:L(function(a,b){var c=a.token?a:n.getMode(this.options,a);if(c.startState)throw Error("Overlays may not be stateful.");
this.state.overlays.push({mode:c,modeSpec:a,opaque:b&&b.opaque});this.state.modeGen++;O(this)}),removeOverlay:L(function(a){for(var b=this.state.overlays,c=0;c<b.length;++c){var d=b[c].modeSpec;if(d==a||"string"==typeof a&&d.name==a){b.splice(c,1);this.state.modeGen++;O(this);break}}}),indentLine:L(function(a,b,c){"string"!=typeof b&&"number"!=typeof b&&(b=null==b?this.options.smartIndent?"smart":"prev":b?"add":"subtract");qb(this.doc,a)&&pb(this,a,b,c)}),indentSelection:L(function(a){for(var b=this.doc.sel.ranges,
c=-1,d=0;d<b.length;d++){var e=b[d];if(e.empty())e.head.line>c&&(pb(this,e.head.line,a,!0),c=e.head.line,d==this.doc.sel.primIndex&&Qa(this));else{for(var f=e.from(),e=e.to(),g=Math.max(c,f.line),c=Math.min(this.lastLine(),e.line-(e.ch?0:1))+1,e=g;e<c;++e)pb(this,e,a);e=this.doc.sel.ranges;0==f.ch&&b.length==e.length&&0<e[d].from().ch&&Wc(this.doc,d,new y(f,e[d].to()),ha)}}}),getTokenAt:function(a,b){return bf(this,a,b)},getLineTokens:function(a,b){return bf(this,q(a),b,!0)},getTokenTypeAt:function(a){a=
x(this.doc,a);var b=df(this,t(this.doc,a.line)),c=0,d=(b.length-1)/2;a=a.ch;if(0==a)b=b[2];else for(;;){var e=c+d>>1;if((e?b[2*e-1]:0)>=a)d=e;else if(b[2*e+1]<a)c=e+1;else{b=b[2*e+2];break}}c=b?b.indexOf("cm-overlay "):-1;return 0>c?b:0==c?null:b.slice(0,c-1)},getModeAt:function(a){var b=this.doc.mode;return b.innerMode?n.innerMode(b,this.getTokenAt(a).state).mode:b},getHelper:function(a,b){return this.getHelpers(a,b)[0]},getHelpers:function(a,b){var c=[];if(!ab.hasOwnProperty(b))return c;var d=ab[b],
e=this.getModeAt(a);if("string"==typeof e[b])d[e[b]]&&c.push(d[e[b]]);else if(e[b])for(var f=0;f<e[b].length;f++){var g=d[e[b][f]];g&&c.push(g)}else e.helperType&&d[e.helperType]?c.push(d[e.helperType]):d[e.name]&&c.push(d[e.name]);for(f=0;f<d._global.length;f++)g=d._global[f],g.pred(e,this)&&-1==D(c,g.val)&&c.push(g.val);return c},getStateAfter:function(a,b){var c=this.doc;a=Math.max(c.first,Math.min(null==a?c.first+c.size-1:a,c.first+c.size-1));return sb(this,a+1,b)},cursorCoords:function(a,b){var c;
c=this.doc.sel.primary();c=null==a?c.head:"object"==typeof a?x(this.doc,a):a?c.from():c.to();return la(this,c,b||"page")},charCoords:function(a,b){return Wb(this,x(this.doc,a),b||"page")},coordsChar:function(a,b){a=re(this,a,b||"page");return fd(this,a.left,a.top)},lineAtHeight:function(a,b){a=re(this,{top:a,left:0},b||"page").top;return za(this.doc,a+this.display.viewOffset)},heightAtLine:function(a,b){var c=!1,d;"number"==typeof a?(d=this.doc.first+this.doc.size-1,a<this.doc.first?a=this.doc.first:
a>d&&(a=d,c=!0),d=t(this.doc,a)):d=a;return cd(this,d,{top:0,left:0},b||"page").top+(c?this.doc.height-ea(d):0)},defaultTextHeight:function(){return va(this.display)},defaultCharWidth:function(){return gb(this.display)},setGutterMarker:L(function(a,b,c){return mc(this.doc,a,"gutter",function(a){var e=a.gutterMarkers||(a.gutterMarkers={});e[b]=c;!c&&nf(e)&&(a.gutterMarkers=null);return!0})}),clearGutter:L(function(a){var b=this,c=b.doc,d=c.first;c.iter(function(c){c.gutterMarkers&&c.gutterMarkers[a]&&
(c.gutterMarkers[a]=null,ma(b,d,"gutter"),nf(c.gutterMarkers)&&(c.gutterMarkers=null));++d})}),lineInfo:function(a){if("number"==typeof a){if(!qb(this.doc,a))return null;var b=a;a=t(this.doc,a);if(!a)return null}else if(b=E(a),null==b)return null;return{line:b,handle:a,text:a.text,gutterMarkers:a.gutterMarkers,textClass:a.textClass,bgClass:a.bgClass,wrapClass:a.wrapClass,widgets:a.widgets}},getViewport:function(){return{from:this.display.viewFrom,to:this.display.viewTo}},addWidget:function(a,b,c,
d,e){var f=this.display;a=la(this,x(this.doc,a));var g=a.bottom,h=a.left;b.style.position="absolute";b.setAttribute("cm-ignore-events","true");this.display.input.setUneditable(b);f.sizer.appendChild(b);if("over"==d)g=a.top;else if("above"==d||"near"==d){var k=Math.max(f.wrapper.clientHeight,this.doc.height),l=Math.max(f.sizer.clientWidth,f.lineSpace.clientWidth);("above"==d||a.bottom+b.offsetHeight>k)&&a.top>b.offsetHeight?g=a.top-b.offsetHeight:a.bottom+b.offsetHeight<=k&&(g=a.bottom);h+b.offsetWidth>
l&&(h=l-b.offsetWidth)}b.style.top=g+"px";b.style.left=b.style.right="";"right"==e?(h=f.sizer.clientWidth-b.offsetWidth,b.style.right="0px"):("left"==e?h=0:"middle"==e&&(h=(f.sizer.clientWidth-b.offsetWidth)/2),b.style.left=h+"px");c&&(a=ac(this,h,g,h+b.offsetWidth,g+b.offsetHeight),null!=a.scrollTop&&lb(this,a.scrollTop),null!=a.scrollLeft&&Na(this,a.scrollLeft))},triggerOnKeyDown:L(ze),triggerOnKeyPress:L(Ae),triggerOnKeyUp:ye,execCommand:function(a){if(hc.hasOwnProperty(a))return hc[a].call(null,
this)},triggerElectric:L(function(a){Ud(this,a)}),findPosH:function(a,b,c,d){var e=1;0>b&&(e=-1,b=-b);var f=0;for(a=x(this.doc,a);f<b&&(a=qd(this.doc,a,e,c,d),!a.hitSide);++f);return a},moveH:L(function(a,b){var c=this;c.extendSelectionsBy(function(d){return c.display.shift||c.doc.extend||d.empty()?qd(c.doc,d.head,a,b,c.options.rtlMoveVisually):0>a?d.from():d.to()},Fb)}),deleteH:L(function(a,b){var c=this.doc;this.doc.sel.somethingSelected()?c.replaceSelection("",null,"+delete"):Wa(this,function(d){var e=
qd(c,d.head,a,b,!1);return 0>a?{from:e,to:d.head}:{from:d.head,to:e}})}),findPosV:function(a,b,c,d){var e=1;0>b&&(e=-1,b=-b);var f=0;for(a=x(this.doc,a);f<b&&(a=la(this,a,"div"),null==d?d=a.left:a.left=d,a=Te(this,a,e,c),!a.hitSide);++f);return a},moveV:L(function(a,b){var c=this,d=this.doc,e=[],f=!c.display.shift&&!d.extend&&d.sel.somethingSelected();d.extendSelectionsBy(function(g){if(f)return 0>a?g.from():g.to();var k=la(c,g.head,"div");null!=g.goalColumn&&(k.left=g.goalColumn);e.push(k.left);
var l=Te(c,k,a,b);"page"==b&&g==d.sel.primary()&&kc(c,null,Wb(c,l,"div").top-k.top);return l},Fb);if(e.length)for(var g=0;g<d.sel.ranges.length;g++)d.sel.ranges[g].goalColumn=e[g]}),findWordAt:function(a){var b=t(this.doc,a.line).text,c=a.ch,d=a.ch;if(b){var e=this.getHelper(a,"wordChars");(0>a.xRel||d==b.length)&&c?--c:++d;for(var f=b.charAt(c),f=nc(f,e)?function(a){return nc(a,e)}:/\s/.test(f)?function(a){return/\s/.test(a)}:function(a){return!/\s/.test(a)&&!nc(a)};0<c&&f(b.charAt(c-1));)--c;for(;d<
b.length&&f(b.charAt(d));)++d}return new y(q(a.line,c),q(a.line,d))},toggleOverwrite:function(a){if(null==a||a!=this.state.overwrite)(this.state.overwrite=!this.state.overwrite)?mb(this.display.cursorDiv,"CodeMirror-overwrite"):kb(this.display.cursorDiv,"CodeMirror-overwrite"),J(this,"overwriteToggle",this,this.state.overwrite)},hasFocus:function(){return this.display.input.getField()==fa()},isReadOnly:function(){return!(!this.options.readOnly&&!this.doc.cantEdit)},scrollTo:L(function(a,b){null==
a&&null==b||lc(this);null!=a&&(this.curOp.scrollLeft=a);null!=b&&(this.curOp.scrollTop=b)}),getScrollInfo:function(){var a=this.display.scroller;return{left:a.scrollLeft,top:a.scrollTop,height:a.scrollHeight-da(this)-this.display.barHeight,width:a.scrollWidth-da(this)-this.display.barWidth,clientHeight:Nc(this),clientWidth:pa(this)}},scrollIntoView:L(function(a,b){null==a?(a={from:this.doc.sel.primary().head,to:null},null==b&&(b=this.options.cursorScrollMargin)):"number"==typeof a?a={from:q(a,0),
to:null}:null==a.from&&(a={from:a,to:null});a.to||(a.to=a.from);a.margin=b||0;if(null!=a.from.line)lc(this),this.curOp.scrollToPos=a;else{var c=ac(this,Math.min(a.from.left,a.to.left),Math.min(a.from.top,a.to.top)-a.margin,Math.max(a.from.right,a.to.right),Math.max(a.from.bottom,a.to.bottom)+a.margin);this.scrollTo(c.scrollLeft,c.scrollTop)}}),setSize:L(function(a,b){function c(a){return"number"==typeof a||/^\d+$/.test(String(a))?a+"px":a}var d=this;null!=a&&(d.display.wrapper.style.width=c(a));null!=
b&&(d.display.wrapper.style.height=c(b));d.options.lineWrapping&&qe(this);var e=d.display.viewFrom;d.doc.iter(e,d.display.viewTo,function(a){if(a.widgets)for(var b=0;b<a.widgets.length;b++)if(a.widgets[b].noHScroll){ma(d,e,"widget");break}++e});d.curOp.forceUpdate=!0;J(d,"refresh",this)}),operation:function(a){return R(this,a)},refresh:L(function(){var a=this.display.cachedTextHeight;O(this);this.curOp.forceUpdate=!0;hb(this);this.scrollTo(this.doc.scrollLeft,this.doc.scrollTop);Cc(this);(null==a||
.5<Math.abs(a-va(this.display)))&&Ac(this);J(this,"refresh",this)}),swapDoc:L(function(a){var b=this.doc;b.cm=null;Dd(this,a);hb(this);this.display.input.reset();this.scrollTo(a.scrollLeft,a.scrollTop);this.curOp.forceScroll=!0;Q(this,"swapDoc",this,b);return b}),getInputField:function(){return this.display.input.getField()},getWrapperElement:function(){return this.display.wrapper},getScrollerElement:function(){return this.display.scroller},getGutterElement:function(){return this.display.gutters}};
Za(n);var wf=n.defaults={},La=n.optionHandlers={},Ed=n.Init={toString:function(){return"CodeMirror.Init"}};v("value","",function(a,b){a.setValue(b)},!0);v("mode",null,function(a,b){a.doc.modeOption=b;zc(a)},!0);v("indentUnit",2,zc,!0);v("indentWithTabs",!1);v("smartIndent",!0);v("tabSize",4,function(a){eb(a);hb(a);O(a)},!0);v("lineSeparator",null,function(a,b){if(a.doc.lineSep=b){var c=[],d=a.doc.first;a.doc.iter(function(a){for(var e=0;;){var h=a.text.indexOf(b,e);if(-1==h)break;e=h+b.length;c.push(q(d,
h))}d++});for(var e=c.length-1;0<=e;e--)Va(a.doc,b,c[e],q(c[e].line,c[e].ch+b.length))}});v("specialChars",/[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g,function(a,b,c){a.state.specialChars=new RegExp(b.source+(b.test("\t")?"":"|\t"),"g");c!=n.Init&&a.refresh()});v("specialCharPlaceholder",function(a){var b=r("span","€¢","cm-invalidchar");b.title="\\u"+a.charCodeAt(0).toString(16);b.setAttribute("aria-label",b.title);return b},function(a){a.refresh()},!0);v("electricChars",!0);v("inputStyle",
bb?"contenteditable":"textarea",function(){throw Error("inputStyle can not (yet) be changed in a running editor");},!0);v("rtlMoveVisually",!tg);v("wholeLineUpdateBefore",!0);v("theme","default",function(a){Ad(a);ib(a)},!0);v("keyMap","default",function(a,b,c){b=oc(b);(c=c!=n.Init&&oc(c))&&c.detach&&c.detach(a,b);b.attach&&b.attach(a,c||null)});v("extraKeys",null);v("lineWrapping",!1,function(a){a.options.lineWrapping?(mb(a.display.wrapper,"CodeMirror-wrap"),a.display.sizer.style.minWidth="",a.display.sizerWidth=
null):(kb(a.display.wrapper,"CodeMirror-wrap"),Dc(a));Ac(a);O(a);hb(a);setTimeout(function(){Oa(a)},100)},!0);v("gutters",[],function(a){wc(a.options);ib(a)},!0);v("fixedGutter",!0,function(a,b){a.display.gutters.style.left=b?Ic(a.display)+"px":"0";a.refresh()},!0);v("coverGutterNextToScrollbar",!1,function(a){Oa(a)},!0);v("scrollbarStyle","native",function(a){Bd(a);Oa(a);a.display.scrollbars.setScrollTop(a.doc.scrollTop);a.display.scrollbars.setScrollLeft(a.doc.scrollLeft)},!0);v("lineNumbers",!1,
function(a){wc(a.options);ib(a)},!0);v("firstLineNumber",1,ib,!0);v("lineNumberFormatter",function(a){return a},ib,!0);v("showCursorWhenSelecting",!1,nb,!0);v("resetSelectionOnContextMenu",!0);v("lineWiseCopyCut",!0);v("readOnly",!1,function(a,b){"nocursor"==b?(db(a),a.display.input.blur(),a.display.disabled=!0):a.display.disabled=!1;a.display.input.readOnlyChanged(b)});v("disableInput",!1,function(a,b){b||a.display.input.reset()},!0);v("dragDrop",!0,function(a,b,c){!b!=!(c&&c!=n.Init)&&(c=a.display.dragFunctions,
b=b?u:ja,b(a.display.scroller,"dragstart",c.start),b(a.display.scroller,"dragenter",c.enter),b(a.display.scroller,"dragover",c.over),b(a.display.scroller,"dragleave",c.leave),b(a.display.scroller,"drop",c.drop))});v("allowDropFileTypes",null);v("cursorBlinkRate",530);v("cursorScrollMargin",0);v("cursorHeight",1,nb,!0);v("singleCursorHeightPerLine",!0,nb,!0);v("workTime",100);v("workDelay",100);v("flattenSpans",!0,eb,!0);v("addModeClass",!1,eb,!0);v("pollInterval",100);v("undoDepth",200,function(a,
b){a.doc.history.undoDepth=b});v("historyEventDelay",1250);v("viewportMargin",10,function(a){a.refresh()},!0);v("maxHighlightLength",1E4,eb,!0);v("moveInputWithCursor",!0,function(a,b){b||a.display.input.resetPosition()});v("tabindex",null,function(a,b){a.display.input.getField().tabIndex=b||""});v("autofocus",null);var vf=n.modes={},Gb=n.mimeModes={};n.defineMode=function(a,b){n.defaults.mode||"null"==a||(n.defaults.mode=a);2<arguments.length&&(b.dependencies=Array.prototype.slice.call(arguments,
2));vf[a]=b};n.defineMIME=function(a,b){Gb[a]=b};n.resolveMode=function(a){if("string"==typeof a&&Gb.hasOwnProperty(a))a=Gb[a];else if(a&&"string"==typeof a.name&&Gb.hasOwnProperty(a.name)){var b=Gb[a.name];"string"==typeof b&&(b={name:b});a=lf(b,a);a.name=b.name}else if("string"==typeof a&&/^[\w\-]+\/[\w\-]+\+xml$/.test(a))return n.resolveMode("application/xml");return"string"==typeof a?{name:a}:a||{name:"null"}};n.getMode=function(a,b){b=n.resolveMode(b);var c=vf[b.name];if(!c)return n.getMode(a,
"text/plain");c=c(a,b);if(Hb.hasOwnProperty(b.name)){var d=Hb[b.name],e;for(e in d)d.hasOwnProperty(e)&&(c.hasOwnProperty(e)&&(c["_"+e]=c[e]),c[e]=d[e])}c.name=b.name;b.helperType&&(c.helperType=b.helperType);if(b.modeProps)for(e in b.modeProps)c[e]=b.modeProps[e];return c};n.defineMode("null",function(){return{token:function(a){a.skipToEnd()}}});n.defineMIME("text/plain","null");var Hb=n.modeExtensions={};n.extendMode=function(a,b){var c=Hb.hasOwnProperty(a)?Hb[a]:Hb[a]={};X(b,c)};n.defineExtension=
function(a,b){n.prototype[a]=b};n.defineDocExtension=function(a,b){P.prototype[a]=b};n.defineOption=v;var yc=[];n.defineInitHook=function(a){yc.push(a)};var ab=n.helpers={};n.registerHelper=function(a,b,c){ab.hasOwnProperty(a)||(ab[a]=n[a]={_global:[]});ab[a][b]=c};n.registerGlobalHelper=function(a,b,c,d){n.registerHelper(a,b,d);ab[a]._global.push({pred:c,val:d})};var sa=n.copyState=function(a,b){if(!0===b)return b;if(a.copyState)return a.copyState(b);var c={},d;for(d in b){var e=b[d];e instanceof
Array&&(e=e.concat([]));c[d]=e}return c},Jf=n.startState=function(a,b,c){return a.startState?a.startState(b,c):!0};n.innerMode=function(a,b){for(;a.innerMode;){var c=a.innerMode(b);if(!c||c.mode==a)break;b=c.state;a=c.mode}return c||{mode:a,state:b}};var hc=n.commands={selectAll:function(a){a.setSelection(q(a.firstLine(),0),q(a.lastLine()),ha)},singleSelection:function(a){a.setSelection(a.getCursor("anchor"),a.getCursor("head"),ha)},killLine:function(a){Wa(a,function(b){if(b.empty()){var c=t(a.doc,
b.head.line).text.length;return b.head.ch==c&&b.head.line<a.lastLine()?{from:b.head,to:q(b.head.line+1,0)}:{from:b.head,to:q(b.head.line,c)}}return{from:b.from(),to:b.to()}})},deleteLine:function(a){Wa(a,function(b){return{from:q(b.from().line,0),to:x(a.doc,q(b.to().line+1,0))}})},delLineLeft:function(a){Wa(a,function(a){return{from:q(a.from().line,0),to:a.from()}})},delWrappedLineLeft:function(a){Wa(a,function(b){var c=a.charCoords(b.head,"div").top+5;return{from:a.coordsChar({left:0,top:c},"div"),
to:b.from()}})},delWrappedLineRight:function(a){Wa(a,function(b){var c=a.charCoords(b.head,"div").top+5,c=a.coordsChar({left:a.display.lineDiv.offsetWidth+100,top:c},"div");return{from:b.from(),to:c}})},undo:function(a){a.undo()},redo:function(a){a.redo()},undoSelection:function(a){a.undoSelection()},redoSelection:function(a){a.redoSelection()},goDocStart:function(a){a.extendSelection(q(a.firstLine(),0))},goDocEnd:function(a){a.extendSelection(q(a.lastLine()))},goLineStart:function(a){a.extendSelectionsBy(function(b){return pf(a,
b.head.line)},{origin:"+move",bias:1})},goLineStartSmart:function(a){a.extendSelectionsBy(function(b){return qf(a,b.head)},{origin:"+move",bias:1})},goLineEnd:function(a){a.extendSelectionsBy(function(b){b=b.head.line;for(var c,d=t(a.doc,b);c=ya(d,!1);)d=c.find(1,!0).line,b=null;c=(c=Z(d))?c[0].level%2?Zb(d):$b(d):d.text.length;return q(null==b?E(d):b,c)},{origin:"+move",bias:-1})},goLineRight:function(a){a.extendSelectionsBy(function(b){b=a.charCoords(b.head,"div").top+5;return a.coordsChar({left:a.display.lineDiv.offsetWidth+
100,top:b},"div")},Fb)},goLineLeft:function(a){a.extendSelectionsBy(function(b){b=a.charCoords(b.head,"div").top+5;return a.coordsChar({left:0,top:b},"div")},Fb)},goLineLeftSmart:function(a){a.extendSelectionsBy(function(b){var c=a.charCoords(b.head,"div").top+5,c=a.coordsChar({left:0,top:c},"div");return c.ch<a.getLine(c.line).search(/\S/)?qf(a,b.head):c},Fb)},goLineUp:function(a){a.moveV(-1,"line")},goLineDown:function(a){a.moveV(1,"line")},goPageUp:function(a){a.moveV(-1,"page")},goPageDown:function(a){a.moveV(1,
"page")},goCharLeft:function(a){a.moveH(-1,"char")},goCharRight:function(a){a.moveH(1,"char")},goColumnLeft:function(a){a.moveH(-1,"column")},goColumnRight:function(a){a.moveH(1,"column")},goWordLeft:function(a){a.moveH(-1,"word")},goGroupRight:function(a){a.moveH(1,"group")},goGroupLeft:function(a){a.moveH(-1,"group")},goWordRight:function(a){a.moveH(1,"word")},delCharBefore:function(a){a.deleteH(-1,"char")},delCharAfter:function(a){a.deleteH(1,"char")},delWordBefore:function(a){a.deleteH(-1,"word")},
delWordAfter:function(a){a.deleteH(1,"word")},delGroupBefore:function(a){a.deleteH(-1,"group")},delGroupAfter:function(a){a.deleteH(1,"group")},indentAuto:function(a){a.indentSelection("smart")},indentMore:function(a){a.indentSelection("add")},indentLess:function(a){a.indentSelection("subtract")},insertTab:function(a){a.replaceSelection("\t")},insertSoftTab:function(a){for(var b=[],c=a.listSelections(),d=a.options.tabSize,e=0;e<c.length;e++){var f=c[e].from(),f=aa(a.getLine(f.line),f.ch,d);b.push(Array(d-
f%d+1).join(" "))}a.replaceSelections(b)},defaultTab:function(a){a.somethingSelected()?a.indentSelection("add"):a.execCommand("insertTab")},transposeChars:function(a){R(a,function(){for(var b=a.listSelections(),c=[],d=0;d<b.length;d++){var e=b[d].head,f=t(a.doc,e.line).text;if(f)if(e.ch==f.length&&(e=new q(e.line,e.ch-1)),0<e.ch)e=new q(e.line,e.ch+1),a.replaceRange(f.charAt(e.ch-1)+f.charAt(e.ch-2),q(e.line,e.ch-2),e,"+transpose");else if(e.line>a.doc.first){var g=t(a.doc,e.line-1).text;g&&a.replaceRange(f.charAt(0)+
a.doc.lineSeparator()+g.charAt(g.length-1),q(e.line-1,g.length-1),q(e.line,1),"+transpose")}c.push(new y(e,e))}a.setSelections(c)})},newlineAndIndent:function(a){R(a,function(){for(var b=a.listSelections().length,c=0;c<b;c++){var d=a.listSelections()[c];a.replaceRange(a.doc.lineSeparator(),d.anchor,d.head,"+input");a.indentLine(d.from().line+1,null,!0)}Qa(a)})},toggleOverwrite:function(a){a.toggleOverwrite()}},ta=n.keyMap={};ta.basic={Left:"goCharLeft",Right:"goCharRight",Up:"goLineUp",Down:"goLineDown",
End:"goLineEnd",Home:"goLineStartSmart",PageUp:"goPageUp",PageDown:"goPageDown",Delete:"delCharAfter",Backspace:"delCharBefore","Shift-Backspace":"delCharBefore",Tab:"defaultTab","Shift-Tab":"indentAuto",Enter:"newlineAndIndent",Insert:"toggleOverwrite",Esc:"singleSelection"};ta.pcDefault={"Ctrl-A":"selectAll","Ctrl-D":"deleteLine","Ctrl-Z":"undo","Shift-Ctrl-Z":"redo","Ctrl-Y":"redo","Ctrl-Home":"goDocStart","Ctrl-End":"goDocEnd","Ctrl-Up":"goLineUp","Ctrl-Down":"goLineDown","Ctrl-Left":"goGroupLeft",
"Ctrl-Right":"goGroupRight","Alt-Left":"goLineStart","Alt-Right":"goLineEnd","Ctrl-Backspace":"delGroupBefore","Ctrl-Delete":"delGroupAfter","Ctrl-S":"save","Ctrl-F":"find","Ctrl-G":"findNext","Shift-Ctrl-G":"findPrev","Shift-Ctrl-F":"replace","Shift-Ctrl-R":"replaceAll","Ctrl-[":"indentLess","Ctrl-]":"indentMore","Ctrl-U":"undoSelection","Shift-Ctrl-U":"redoSelection","Alt-U":"redoSelection",fallthrough:"basic"};ta.emacsy={"Ctrl-F":"goCharRight","Ctrl-B":"goCharLeft","Ctrl-P":"goLineUp","Ctrl-N":"goLineDown",
"Alt-F":"goWordRight","Alt-B":"goWordLeft","Ctrl-A":"goLineStart","Ctrl-E":"goLineEnd","Ctrl-V":"goPageDown","Shift-Ctrl-V":"goPageUp","Ctrl-D":"delCharAfter","Ctrl-H":"delCharBefore","Alt-D":"delWordAfter","Alt-Backspace":"delWordBefore","Ctrl-K":"killLine","Ctrl-T":"transposeChars"};ta.macDefault={"Cmd-A":"selectAll","Cmd-D":"deleteLine","Cmd-Z":"undo","Shift-Cmd-Z":"redo","Cmd-Y":"redo","Cmd-Home":"goDocStart","Cmd-Up":"goDocStart","Cmd-End":"goDocEnd","Cmd-Down":"goDocEnd","Alt-Left":"goGroupLeft",
"Alt-Right":"goGroupRight","Cmd-Left":"goLineLeft","Cmd-Right":"goLineRight","Alt-Backspace":"delGroupBefore","Ctrl-Alt-Backspace":"delGroupAfter","Alt-Delete":"delGroupAfter","Cmd-S":"save","Cmd-F":"find","Cmd-G":"findNext","Shift-Cmd-G":"findPrev","Cmd-Alt-F":"replace","Shift-Cmd-Alt-F":"replaceAll","Cmd-[":"indentLess","Cmd-]":"indentMore","Cmd-Backspace":"delWrappedLineLeft","Cmd-Delete":"delWrappedLineRight","Cmd-U":"undoSelection","Shift-Cmd-U":"redoSelection","Ctrl-Up":"goDocStart","Ctrl-Down":"goDocEnd",
fallthrough:["basic","emacsy"]};ta["default"]=Y?ta.macDefault:ta.pcDefault;n.normalizeKeyMap=function(a){var b={},c;for(c in a)if(a.hasOwnProperty(c)){var d=a[c];if(!/^(name|fallthrough|(de|at)tach)$/.test(c)){if("..."!=d)for(var e=Qb(c.split(" "),cg),f=0;f<e.length;f++){var g,h;f==e.length-1?(h=e.join(" "),g=d):(h=e.slice(0,f+1).join(" "),g="...");var k=b[h];if(!k)b[h]=g;else if(k!=g)throw Error("Inconsistent bindings for "+h);}delete a[c]}}for(var l in b)a[l]=b[l];return a};var wb=n.lookupKey=function(a,
b,c,d){b=oc(b);var e=b.call?b.call(a,d):b[a];if(!1===e)return"nothing";if("..."===e)return"multi";if(null!=e&&c(e))return"handled";if(b.fallthrough){if("[object Array]"!=Object.prototype.toString.call(b.fallthrough))return wb(a,b.fallthrough,c,d);for(e=0;e<b.fallthrough.length;e++){var f=wb(a,b.fallthrough[e],c,d);if(f)return f}}},Wf=n.isModifierKey=function(a){a="string"==typeof a?a:Ja[a.keyCode];return"Ctrl"==a||"Alt"==a||"Shift"==a||"Mod"==a},Yf=n.keyName=function(a,b){if(ba&&34==a.keyCode&&a["char"])return!1;
var c=Ja[a.keyCode],d=c;if(null==d||a.altGraphKey)return!1;a.altKey&&"Alt"!=c&&(d="Alt-"+d);(uf?a.metaKey:a.ctrlKey)&&"Ctrl"!=c&&(d="Ctrl-"+d);(uf?a.ctrlKey:a.metaKey)&&"Cmd"!=c&&(d="Cmd-"+d);!b&&a.shiftKey&&"Shift"!=c&&(d="Shift-"+d);return d};n.fromTextArea=function(a,b){function c(){a.value=k.getValue()}b=b?X(b):{};b.value=a.value;!b.tabindex&&a.tabIndex&&(b.tabindex=a.tabIndex);!b.placeholder&&a.placeholder&&(b.placeholder=a.placeholder);if(null==b.autofocus){var d=fa();b.autofocus=d==a||null!=
a.getAttribute("autofocus")&&d==document.body}if(a.form&&(u(a.form,"submit",c),!b.leaveSubmitMethodAlone)){var e=a.form,f=e.submit;try{var g=e.submit=function(){c();e.submit=f;e.submit();e.submit=g}}catch(h){}}b.finishInit=function(b){b.save=c;b.getTextArea=function(){return a};b.toTextArea=function(){b.toTextArea=isNaN;c();a.parentNode.removeChild(b.getWrapperElement());a.style.display="";a.form&&(ja(a.form,"submit",c),"function"==typeof a.form.submit&&(a.form.submit=f))}};a.style.display="none";
var k=n(function(b){a.parentNode.insertBefore(b,a.nextSibling)},b);return k};var sc=n.StringStream=function(a,b){this.pos=this.start=0;this.string=a;this.tabSize=b||8;this.lineStart=this.lastColumnPos=this.lastColumnValue=0};sc.prototype={eol:function(){return this.pos>=this.string.length},sol:function(){return this.pos==this.lineStart},peek:function(){return this.string.charAt(this.pos)||void 0},next:function(){if(this.pos<this.string.length)return this.string.charAt(this.pos++)},eat:function(a){var b=
this.string.charAt(this.pos);if("string"==typeof a?b==a:b&&(a.test?a.test(b):a(b)))return++this.pos,b},eatWhile:function(a){for(var b=this.pos;this.eat(a););return this.pos>b},eatSpace:function(){for(var a=this.pos;/[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;return this.pos>a},skipToEnd:function(){this.pos=this.string.length},skipTo:function(a){a=this.string.indexOf(a,this.pos);if(-1<a)return this.pos=a,!0},backUp:function(a){this.pos-=a},column:function(){this.lastColumnPos<this.start&&
(this.lastColumnValue=aa(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue),this.lastColumnPos=this.start);return this.lastColumnValue-(this.lineStart?aa(this.string,this.lineStart,this.tabSize):0)},indentation:function(){return aa(this.string,null,this.tabSize)-(this.lineStart?aa(this.string,this.lineStart,this.tabSize):0)},match:function(a,b,c){if("string"==typeof a){var d=function(a){return c?a.toLowerCase():a},e=this.string.substr(this.pos,a.length);if(d(e)==d(a))return!1!==
b&&(this.pos+=a.length),!0}else{if((a=this.string.slice(this.pos).match(a))&&0<a.index)return null;a&&!1!==b&&(this.pos+=a[0].length);return a}},current:function(){return this.string.slice(this.start,this.pos)},hideFirstChars:function(a,b){this.lineStart+=a;try{return b()}finally{this.lineStart-=a}}};var rd=0,Ha=n.TextMarker=function(a,b){this.lines=[];this.type=b;this.doc=a;this.id=++rd};Za(Ha);Ha.prototype.clear=function(){if(!this.explicitlyCleared){var a=this.doc.cm,b=a&&!a.curOp;b&&Ka(a);if(W(this,
"clear")){var c=this.find();c&&Q(this,"clear",c.from,c.to)}for(var d=c=null,e=0;e<this.lines.length;++e){var f=this.lines[e],g=yb(f.markedSpans,this);a&&!this.collapsed?ma(a,E(f),"text"):a&&(null!=g.to&&(d=E(f)),null!=g.from&&(c=E(f)));for(var h=f,k=f.markedSpans,l=g,m=void 0,n=0;n<k.length;++n)k[n]!=l&&(m||(m=[])).push(k[n]);h.markedSpans=m;null==g.from&&this.collapsed&&!wa(this.doc,f)&&a&&ca(f,va(a.display))}if(a&&this.collapsed&&!a.options.lineWrapping)for(e=0;e<this.lines.length;++e)f=ia(this.lines[e]),
g=Jb(f),g>a.display.maxLineLength&&(a.display.maxLine=f,a.display.maxLineLength=g,a.display.maxLineChanged=!0);null!=c&&a&&this.collapsed&&O(a,c,d+1);this.lines.length=0;this.explicitlyCleared=!0;this.atomic&&this.doc.cantEdit&&(this.doc.cantEdit=!1,a&&ie(a.doc));a&&Q(a,"markerCleared",a,this);b&&Ma(a);this.parent&&this.parent.clear()}};Ha.prototype.find=function(a,b){null==a&&"bookmark"==this.type&&(a=1);for(var c,d,e=0;e<this.lines.length;++e){var f=this.lines[e],g=yb(f.markedSpans,this);if(null!=
g.from&&(c=q(b?f:E(f),g.from),-1==a))return c;if(null!=g.to&&(d=q(b?f:E(f),g.to),1==a))return d}return c&&{from:c,to:d}};Ha.prototype.changed=function(){var a=this.find(-1,!0),b=this,c=this.doc.cm;a&&c&&R(c,function(){var d=a.line,e=E(a.line);if(e=Uc(c,e))pe(e),c.curOp.selectionChanged=c.curOp.forceUpdate=!0;c.curOp.updateMaxLine=!0;wa(b.doc,d)||null==b.height||(e=b.height,b.height=null,(e=ub(b)-e)&&ca(d,d.height+e))})};Ha.prototype.attachLine=function(a){if(!this.lines.length&&this.doc.cm){var b=
this.doc.cm.curOp;b.maybeHiddenMarkers&&-1!=D(b.maybeHiddenMarkers,this)||(b.maybeUnhiddenMarkers||(b.maybeUnhiddenMarkers=[])).push(this)}this.lines.push(a)};Ha.prototype.detachLine=function(a){this.lines.splice(D(this.lines,a),1);!this.lines.length&&this.doc.cm&&(a=this.doc.cm.curOp,(a.maybeHiddenMarkers||(a.maybeHiddenMarkers=[])).push(this))};var rd=0,qc=n.SharedTextMarker=function(a,b){this.markers=a;this.primary=b;for(var c=0;c<a.length;++c)a[c].parent=this};Za(qc);qc.prototype.clear=function(){if(!this.explicitlyCleared){this.explicitlyCleared=
!0;for(var a=0;a<this.markers.length;++a)this.markers[a].clear();Q(this,"clear")}};qc.prototype.find=function(a,b){return this.primary.find(a,b)};var rc=n.LineWidget=function(a,b,c){if(c)for(var d in c)c.hasOwnProperty(d)&&(this[d]=c[d]);this.doc=a;this.node=b};Za(rc);rc.prototype.clear=function(){var a=this.doc.cm,b=this.line.widgets,c=this.line,d=E(c);if(null!=d&&b){for(var e=0;e<b.length;++e)b[e]==this&&b.splice(e--,1);b.length||(c.widgets=null);var f=ub(this);ca(c,Math.max(0,c.height-f));a&&R(a,
function(){var b=-f;ea(c)<(a.curOp&&a.curOp.scrollTop||a.doc.scrollTop)&&kc(a,null,b);ma(a,d,"widget")})}};rc.prototype.changed=function(){var a=this.height,b=this.doc.cm,c=this.line;this.height=null;var d=ub(this)-a;d&&(ca(c,c.height+d),b&&R(b,function(){b.curOp.forceUpdate=!0;ea(c)<(b.curOp&&b.curOp.scrollTop||b.doc.scrollTop)&&kc(b,null,d)}))};var zb=n.Line=function(a,b,c){this.text=a;Ye(this,b);this.height=c?c(this):1};Za(zb);zb.prototype.lineNo=function(){return E(this)};var ig={},hg={};Ab.prototype=
{chunkSize:function(){return this.lines.length},removeInner:function(a,b){for(var c=a,d=a+b;c<d;++c){var e=this.lines[c];this.height-=e.height;var f=e;f.parent=null;Xe(f);Q(e,"delete")}this.lines.splice(a,b)},collapse:function(a){a.push.apply(a,this.lines)},insertInner:function(a,b,c){this.height+=c;this.lines=this.lines.slice(0,a).concat(b).concat(this.lines.slice(a));for(a=0;a<b.length;++a)b[a].parent=this},iterN:function(a,b,c){for(b=a+b;a<b;++a)if(c(this.lines[a]))return!0}};Bb.prototype={chunkSize:function(){return this.size},
removeInner:function(a,b){this.size-=b;for(var c=0;c<this.children.length;++c){var d=this.children[c],e=d.chunkSize();if(a<e){var f=Math.min(b,e-a),g=d.height;d.removeInner(a,f);this.height-=g-d.height;e==f&&(this.children.splice(c--,1),d.parent=null);if(0==(b-=f))break;a=0}else a-=e}25>this.size-b&&(1<this.children.length||!(this.children[0]instanceof Ab))&&(c=[],this.collapse(c),this.children=[new Ab(c)],this.children[0].parent=this)},collapse:function(a){for(var b=0;b<this.children.length;++b)this.children[b].collapse(a)},
insertInner:function(a,b,c){this.size+=b.length;this.height+=c;for(var d=0;d<this.children.length;++d){var e=this.children[d],f=e.chunkSize();if(a<=f){e.insertInner(a,b,c);if(e.lines&&50<e.lines.length){for(;50<e.lines.length;)a=e.lines.splice(e.lines.length-25,25),a=new Ab(a),e.height-=a.height,this.children.splice(d+1,0,a),a.parent=this;this.maybeSpill()}break}a-=f}},maybeSpill:function(){if(!(10>=this.children.length)){var a=this;do{var b=a.children.splice(a.children.length-5,5),b=new Bb(b);if(a.parent){a.size-=
b.size;a.height-=b.height;var c=D(a.parent.children,a);a.parent.children.splice(c+1,0,b)}else c=new Bb(a.children),c.parent=a,a.children=[c,b],a=c;b.parent=a.parent}while(10<a.children.length);a.parent.maybeSpill()}},iterN:function(a,b,c){for(var d=0;d<this.children.length;++d){var e=this.children[d],f=e.chunkSize();if(a<f){f=Math.min(b,f-a);if(e.iterN(a,f,c))return!0;if(0==(b-=f))break;a=0}else a-=f}}};var vg=0,P=n.Doc=function(a,b,c,d){if(!(this instanceof P))return new P(a,b,c,d);null==c&&(c=0);
Bb.call(this,[new Ab([new zb("",null)])]);this.first=c;this.scrollTop=this.scrollLeft=0;this.cantEdit=!1;this.cleanGeneration=1;this.frontier=c;c=q(c,0);this.sel=ga(c);this.history=new tc(null);this.id=++vg;this.modeOption=b;this.lineSep=d;this.extend=!1;"string"==typeof a&&(a=this.splitLines(a));pd(this,{from:c,to:c,text:a});H(this,ga(c),ha)};P.prototype=lf(Bb.prototype,{constructor:P,iter:function(a,b,c){c?this.iterN(a-this.first,b-a,c):this.iterN(this.first,this.first+this.size,a)},insert:function(a,
b){for(var c=0,d=0;d<b.length;++d)c+=b[d].height;this.insertInner(a-this.first,b,c)},remove:function(a,b){this.removeInner(a-this.first,b)},getValue:function(a){var b=wd(this,this.first,this.first+this.size);return!1===a?b:b.join(a||this.lineSeparator())},setValue:M(function(a){var b=q(this.first,0),c=this.first+this.size-1;Pa(this,{from:b,to:q(c,t(this,c).text.length),text:this.splitLines(a),origin:"setValue",full:!0},!0);H(this,ga(b))}),replaceRange:function(a,b,c,d){b=x(this,b);c=c?x(this,c):b;
Va(this,a,b,c,d)},getRange:function(a,b,c){a=Ba(this,x(this,a),x(this,b));return!1===c?a:a.join(c||this.lineSeparator())},getLine:function(a){return(a=this.getLineHandle(a))&&a.text},getLineHandle:function(a){if(qb(this,a))return t(this,a)},getLineNumber:function(a){return E(a)},getLineHandleVisualStart:function(a){"number"==typeof a&&(a=t(this,a));return ia(a)},lineCount:function(){return this.size},firstLine:function(){return this.first},lastLine:function(){return this.first+this.size-1},clipPos:function(a){return x(this,
a)},getCursor:function(a){var b=this.sel.primary();return null==a||"head"==a?b.head:"anchor"==a?b.anchor:"end"==a||"to"==a||!1===a?b.to():b.from()},listSelections:function(){return this.sel.ranges},somethingSelected:function(){return this.sel.somethingSelected()},setCursor:M(function(a,b,c){a=x(this,"number"==typeof a?q(a,b||0):a);H(this,ga(a,null),c)}),setSelection:M(function(a,b,c){var d=x(this,a);a=x(this,b||a);H(this,ga(d,a),c)}),extendSelection:M(function(a,b,c){Tb(this,x(this,a),b&&x(this,b),
c)}),extendSelections:M(function(a,b){ce(this,be(this,a),b)}),extendSelectionsBy:M(function(a,b){var c=Qb(this.sel.ranges,a);ce(this,be(this,c),b)}),setSelections:M(function(a,b,c){if(a.length){for(var d=0,e=[];d<a.length;d++)e[d]=new y(x(this,a[d].anchor),x(this,a[d].head));null==b&&(b=Math.min(a.length-1,this.sel.primIndex));H(this,$(e,b),c)}}),addSelection:M(function(a,b,c){var d=this.sel.ranges.slice(0);d.push(new y(x(this,a),x(this,b||a)));H(this,$(d,d.length-1),c)}),getSelection:function(a){for(var b=
this.sel.ranges,c,d=0;d<b.length;d++){var e=Ba(this,b[d].from(),b[d].to());c=c?c.concat(e):e}return!1===a?c:c.join(a||this.lineSeparator())},getSelections:function(a){for(var b=[],c=this.sel.ranges,d=0;d<c.length;d++){var e=Ba(this,c[d].from(),c[d].to());!1!==a&&(e=e.join(a||this.lineSeparator()));b[d]=e}return b},replaceSelection:function(a,b,c){for(var d=[],e=0;e<this.sel.ranges.length;e++)d[e]=a;this.replaceSelections(d,b,c||"+input")},replaceSelections:M(function(a,b,c){for(var d=[],e=this.sel,
f=0;f<e.ranges.length;f++){var g=e.ranges[f];d[f]={from:g.from(),to:g.to(),text:this.splitLines(a[f]),origin:c}}if(f=b&&"end"!=b){f=[];c=a=q(this.first,0);for(e=0;e<d.length;e++){var h=d[e],g=Ie(h.from,a,c),k=Ie(Fa(h),a,c);a=h.to;c=k;"around"==b?(h=this.sel.ranges[e],h=0>w(h.head,h.anchor),f[e]=new y(h?k:g,h?g:k)):f[e]=new y(g,g)}f=new ka(f,this.sel.primIndex)}b=f;for(f=d.length-1;0<=f;f--)Pa(this,d[f]);b?de(this,b):this.cm&&Qa(this.cm)}),undo:M(function(){jc(this,"undo")}),redo:M(function(){jc(this,
"redo")}),undoSelection:M(function(){jc(this,"undo",!0)}),redoSelection:M(function(){jc(this,"redo",!0)}),setExtending:function(a){this.extend=a},getExtending:function(){return this.extend},historySize:function(){for(var a=this.history,b=0,c=0,d=0;d<a.done.length;d++)a.done[d].ranges||++b;for(d=0;d<a.undone.length;d++)a.undone[d].ranges||++c;return{undo:b,redo:c}},clearHistory:function(){this.history=new tc(this.history.maxGeneration)},markClean:function(){this.cleanGeneration=this.changeGeneration(!0)},
changeGeneration:function(a){a&&(this.history.lastOp=this.history.lastSelOp=this.history.lastOrigin=null);return this.history.generation},isClean:function(a){return this.history.generation==(a||this.cleanGeneration)},getHistory:function(){return{done:Ya(this.history.done),undone:Ya(this.history.undone)}},setHistory:function(a){var b=this.history=new tc(this.history.maxGeneration);b.done=Ya(a.done.slice(0),null,!0);b.undone=Ya(a.undone.slice(0),null,!0)},addLineClass:M(function(a,b,c){return mc(this,
a,"gutter"==b?"gutter":"class",function(a){var e="text"==b?"textClass":"background"==b?"bgClass":"gutter"==b?"gutterClass":"wrapClass";if(a[e]){if(Eb(c).test(a[e]))return!1;a[e]+=" "+c}else a[e]=c;return!0})}),removeLineClass:M(function(a,b,c){return mc(this,a,"gutter"==b?"gutter":"class",function(a){var e="text"==b?"textClass":"background"==b?"bgClass":"gutter"==b?"gutterClass":"wrapClass",f=a[e];if(f)if(null==c)a[e]=null;else{var g=f.match(Eb(c));if(!g)return!1;var h=g.index+g[0].length;a[e]=f.slice(0,
g.index)+(g.index&&h!=f.length?" ":"")+f.slice(h)||null}else return!1;return!0})}),addLineWidget:M(function(a,b,c){return gg(this,a,b,c)}),removeLineWidget:function(a){a.clear()},markText:function(a,b,c){return Xa(this,x(this,a),x(this,b),c,c&&c.type||"range")},setBookmark:function(a,b){var c={replacedWith:b&&(null==b.nodeType?b.widget:b),insertLeft:b&&b.insertLeft,clearWhenEmpty:!1,shared:b&&b.shared,handleMouseEvents:b&&b.handleMouseEvents};a=x(this,a);return Xa(this,a,a,c,"bookmark")},findMarksAt:function(a){a=
x(this,a);var b=[],c=t(this,a.line).markedSpans;if(c)for(var d=0;d<c.length;++d){var e=c[d];(null==e.from||e.from<=a.ch)&&(null==e.to||e.to>=a.ch)&&b.push(e.marker.parent||e.marker)}return b},findMarks:function(a,b,c){a=x(this,a);b=x(this,b);var d=[],e=a.line;this.iter(a.line,b.line+1,function(f){if(f=f.markedSpans)for(var g=0;g<f.length;g++){var h=f[g];e==a.line&&a.ch>h.to||null==h.from&&e!=a.line||e==b.line&&h.from>b.ch||c&&!c(h.marker)||d.push(h.marker.parent||h.marker)}++e});return d},getAllMarks:function(){var a=
[];this.iter(function(b){if(b=b.markedSpans)for(var c=0;c<b.length;++c)null!=b[c].from&&a.push(b[c].marker)});return a},posFromIndex:function(a){var b,c=this.first;this.iter(function(d){d=d.text.length+1;if(d>a)return b=a,!0;a-=d;++c});return x(this,q(c,b))},indexFromPos:function(a){a=x(this,a);var b=a.ch;if(a.line<this.first||0>a.ch)return 0;this.iter(this.first,a.line,function(a){b+=a.text.length+1});return b},copy:function(a){var b=new P(wd(this,this.first,this.first+this.size),this.modeOption,
this.first,this.lineSep);b.scrollTop=this.scrollTop;b.scrollLeft=this.scrollLeft;b.sel=this.sel;b.extend=!1;a&&(b.history.undoDepth=this.history.undoDepth,b.setHistory(this.getHistory()));return b},linkedDoc:function(a){a||(a={});var b=this.first,c=this.first+this.size;null!=a.from&&a.from>b&&(b=a.from);null!=a.to&&a.to<c&&(c=a.to);b=new P(wd(this,b,c),a.mode||this.modeOption,b,this.lineSep);a.sharedHist&&(b.history=this.history);(this.linked||(this.linked=[])).push({doc:b,sharedHist:a.sharedHist});
b.linked=[{doc:this,isParent:!0,sharedHist:a.sharedHist}];a=Ve(this);for(c=0;c<a.length;c++){var d=a[c],e=d.find(),f=b.clipPos(e.from),e=b.clipPos(e.to);w(f,e)&&(f=Xa(b,f,e,d.primary,d.primary.type),d.markers.push(f),f.parent=d)}return b},unlinkDoc:function(a){a instanceof n&&(a=a.doc);if(this.linked)for(var b=0;b<this.linked.length;++b)if(this.linked[b].doc==a){this.linked.splice(b,1);a.unlinkDoc(this);eg(Ve(this));break}if(a.history==this.history){var c=[a.id];Ga(a,function(a){c.push(a.id)},!0);
a.history=new tc(null);a.history.done=Ya(this.history.done,c);a.history.undone=Ya(this.history.undone,c)}},iterLinkedDocs:function(a){Ga(this,a)},getMode:function(){return this.mode},getEditor:function(){return this.cm},splitLines:function(a){return this.lineSep?a.split(this.lineSep):wg(a)},lineSeparator:function(){return this.lineSep||"\n"}});P.prototype.eachLine=P.prototype.iter;var xg="iter insert remove copy getEditor constructor".split(" "),Ib;for(Ib in P.prototype)P.prototype.hasOwnProperty(Ib)&&
0>D(xg,Ib)&&(n.prototype[Ib]=function(a){return function(){return a.apply(this.doc,arguments)}}(P.prototype[Ib]));Za(P);var N=n.e_preventDefault=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1},yg=n.e_stopPropagation=function(a){a.stopPropagation?a.stopPropagation():a.cancelBubble=!0},cc=n.e_stop=function(a){N(a);yg(a)},u=n.on=function(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent?a.attachEvent("on"+b,c):(a=a._handlers||(a._handlers={}),(a[b]||(a[b]=[])).push(c))},
kf=[],ja=n.off=function(a,b,c){if(a.removeEventListener)a.removeEventListener(b,c,!1);else if(a.detachEvent)a.detachEvent("on"+b,c);else for(a=uc(a,b,!1),b=0;b<a.length;++b)if(a[b]==c){a.splice(b,1);break}},J=n.signal=function(a,b){var c=uc(a,b,!0);if(c.length)for(var d=Array.prototype.slice.call(arguments,2),e=0;e<c.length;++e)c[e].apply(null,d)},Cb=null,Gd=30,Ee=n.Pass={toString:function(){return"CodeMirror.Pass"}},ha={scroll:!1},jd={origin:"*mouse"},Fb={origin:"+move"};ua.prototype.set=function(a,
b){clearTimeout(this.id);this.id=setTimeout(b,a)};var aa=n.countColumn=function(a,b,c,d,e){null==b&&(b=a.search(/[^\s\u00a0]/),-1==b&&(b=a.length));d=d||0;for(e=e||0;;){var f=a.indexOf("\t",d);if(0>f||f>=b)return e+(b-d);e+=f-d;e+=c-e%c;d=f+1}},Ce=n.findColumn=function(a,b,c){for(var d=0,e=0;;){var f=a.indexOf("\t",d);-1==f&&(f=a.length);var g=f-d;if(f==a.length||e+g>=b)return d+Math.min(g,b-e);e+=f-d;e+=c-e%c;d=f+1;if(e>=b)return d}},vc=[""],$a=function(a){a.select()};Ra?$a=function(a){a.selectionStart=
0;a.selectionEnd=a.value.length}:A&&($a=function(a){try{a.select()}catch(b){}});var zg=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,mf=n.isWordChar=function(a){return/\w/.test(a)||"€"<a&&(a.toUpperCase()!=a.toLowerCase()||zg.test(a))},pg=/[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/,
Ca;Ca=document.createRange?function(a,b,c,d){var e=document.createRange();e.setEnd(d||a,c);e.setStart(a,b);return e}:function(a,b,c){var d=document.body.createTextRange();try{d.moveToElementText(a.parentNode)}catch(e){return d}d.collapse(!0);d.moveEnd("character",c);d.moveStart("character",b);return d};var Vc=n.contains=function(a,b){3==b.nodeType&&(b=b.parentNode);if(a.contains)return a.contains(b);do if(11==b.nodeType&&(b=b.host),b==a)return!0;while(b=b.parentNode)};A&&11>C&&(fa=function(){try{return document.activeElement}catch(a){return document.body}});
var kb=n.rmClass=function(a,b){var c=a.className,d=Eb(b).exec(c);if(d){var e=c.slice(d.index+d[0].length);a.className=c.slice(0,d.index)+(e?d[1]+e:"")}},mb=n.addClass=function(a,b){var c=a.className;Eb(b).test(c)||(a.className+=(c?" ":"")+b)},Cd=!1,Sf=function(){if(A&&9>C)return!1;var a=r("div");return"draggable"in a||"dragDrop"in a}(),xd,ud,wg=n.splitLines=3!="\n\nb".split(/\n/).length?function(a){for(var b=0,c=[],d=a.length;b<=d;){var e=a.indexOf("\n",b);-1==e&&(e=a.length);var f=a.slice(b,"\r"==
a.charAt(e-1)?e-1:e),g=f.indexOf("\r");-1!=g?(c.push(f.slice(0,g)),b+=g+1):(c.push(f),b=e+1)}return c}:function(a){return a.split(/\r\n?|\n/)},ug=window.getSelection?function(a){try{return a.selectionStart!=a.selectionEnd}catch(b){return!1}}:function(a){try{var b=a.ownerDocument.selection.createRange()}catch(c){}return b&&b.parentElement()==a?0!=b.compareEndPoints("StartToEnd",b):!1},Ge=function(){var a=r("div");if("oncopy"in a)return!0;a.setAttribute("oncopy","return;");return"function"==typeof a.oncopy}(),
bd=null,Ja=n.keyNames={3:"Enter",8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"PrintScrn",45:"Insert",46:"Delete",59:";",61:"\x3d",91:"Mod",92:"Mod",93:"Mod",106:"*",107:"\x3d",109:"-",110:".",111:"/",127:"Delete",173:"-",186:";",187:"\x3d",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",63232:"Up",63233:"Down",63234:"Left",
63235:"Right",63272:"Delete",63273:"Home",63275:"End",63276:"PageUp",63277:"PageDown",63302:"Insert"};(function(){for(var a=0;10>a;a++)Ja[a+48]=Ja[a+96]=String(a);for(a=65;90>=a;a++)Ja[a]=String.fromCharCode(a);for(a=1;12>=a;a++)Ja[a+111]=Ja[a+63235]="F"+a})();var vb,ng=function(){function a(a){return 247>=a?"bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN".charAt(a):
1424<=a&&1524>=a?"R":1536<=a&&1773>=a?"rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm".charAt(a-1536):1774<=a&&2220>=a?"r":8192<=a&&8203>=a?"w":8204==a?"b":"L"}function b(a,b,c){this.level=a;this.from=b;this.to=c}var c=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,d=/[stwN]/,e=/[LRr]/,f=/[Lb1n]/,g=/[1n]/;return function(h){if(!c.test(h))return!1;
for(var k=h.length,l=[],m=0,n;m<k;++m)l.push(a(h.charCodeAt(m)));for(var m=0,p="L";m<k;++m)n=l[m],"m"==n?l[m]=p:p=n;m=0;for(p="L";m<k;++m)n=l[m],"1"==n&&"r"==p?l[m]="n":e.test(n)&&(p=n,"r"==n&&(l[m]="R"));m=1;for(p=l[0];m<k-1;++m)n=l[m],"+"==n&&"1"==p&&"1"==l[m+1]?l[m]="1":","!=n||p!=l[m+1]||"1"!=p&&"n"!=p||(l[m]=p),p=n;for(m=0;m<k;++m)if(n=l[m],","==n)l[m]="N";else if("%"==n){for(p=m+1;p<k&&"%"==l[p];++p);var q=m&&"!"==l[m-1]||p<k&&"1"==l[p]?"1":"N";for(n=m;n<p;++n)l[n]=q;m=p-1}m=0;for(p="L";m<k;++m)n=
l[m],"L"==p&&"1"==n?l[m]="L":e.test(n)&&(p=n);for(m=0;m<k;++m)if(d.test(l[m])){for(p=m+1;p<k&&d.test(l[p]);++p);n="L"==(p<k?l[p]:"L");q="L"==(m?l[m-1]:"L")||n?"L":"R";for(n=m;n<p;++n)l[n]=q;m=p-1}for(var p=[],r,m=0;m<k;)if(f.test(l[m])){n=m;for(++m;m<k&&f.test(l[m]);++m);p.push(new b(0,n,m))}else{var t=m,q=p.length;for(++m;m<k&&"L"!=l[m];++m);for(n=t;n<m;)if(g.test(l[n])){t<n&&p.splice(q,0,new b(1,t,n));t=n;for(++n;n<m&&g.test(l[n]);++n);p.splice(q,0,new b(2,t,n));t=n}else++n;t<m&&p.splice(q,0,new b(1,
t,m))}1==p[0].level&&(r=h.match(/^\s+/))&&(p[0].from=r[0].length,p.unshift(new b(0,0,r[0].length)));1==z(p).level&&(r=h.match(/\s+$/))&&(z(p).to-=r[0].length,p.push(new b(0,k-r[0].length,k)));2==p[0].level&&p.unshift(new b(1,p[0].to,p[0].to));p[0].level!=z(p).level&&p.push(new b(p[0].level,k,k));return p}}();n.version="5.11.0";return n});
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  CodeMirror.defineOption("placeholder", "", function(cm, val, old) {
    var prev = old && old != CodeMirror.Init;
    if (val && !prev) {
      cm.on("blur", onBlur);
      cm.on("change", onChange);
      onChange(cm);
    } else if (!val && prev) {
      cm.off("blur", onBlur);
      cm.off("change", onChange);
      clearPlaceholder(cm);
      var wrapper = cm.getWrapperElement();
      wrapper.className = wrapper.className.replace(" CodeMirror-empty", "");
    }

    if (val && !cm.hasFocus()) onBlur(cm);
  });

  function clearPlaceholder(cm) {
    if (cm.state.placeholder) {
      cm.state.placeholder.parentNode.removeChild(cm.state.placeholder);
      cm.state.placeholder = null;
    }
  }
  function setPlaceholder(cm) {
    clearPlaceholder(cm);
    var elt = cm.state.placeholder = document.createElement("pre");
    elt.style.cssText = "height: 0; overflow: visible";
    elt.className = "CodeMirror-placeholder";
    var placeHolder = cm.getOption("placeholder")
    if (typeof placeHolder == "string") placeHolder = document.createTextNode(placeHolder)
    elt.appendChild(placeHolder)
    cm.display.lineSpace.insertBefore(elt, cm.display.lineSpace.firstChild);
  }

  function onBlur(cm) {
    if (isEmpty(cm)) setPlaceholder(cm);
  }
  function onChange(cm) {
    var wrapper = cm.getWrapperElement(), empty = isEmpty(cm);
    wrapper.className = wrapper.className.replace(" CodeMirror-empty", "") + (empty ? " CodeMirror-empty" : "");

    if (empty) setPlaceholder(cm);
    else clearPlaceholder(cm);
  }

  function isEmpty(cm) {
    return (cm.lineCount() === 1) && (cm.getLine(0) === "");
  }
});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

/**
 * Author: Hans Engel
 * Branched from CodeMirror's Scheme mode (by Koh Zi Han, based on implementation by Koh Zi Chun)
 */

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("clojure", function (options) {
    var BUILTIN = "builtin", COMMENT = "comment", STRING = "string", CHARACTER = "string-2",
        ATOM = "atom", NUMBER = "number", BRACKET = "bracket", KEYWORD = "keyword", VAR = "variable";
    var INDENT_WORD_SKIP = options.indentUnit || 2;
    var NORMAL_INDENT_UNIT = options.indentUnit || 2;

    function makeKeywords(str) {
        var obj = {}, words = str.split(" ");
        for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
        return obj;
    }

    var atoms = makeKeywords("true false nil");

    var keywords = makeKeywords(
      "defn defn- def def- defonce defmulti defmethod defmacro defstruct deftype defprotocol defrecord defproject deftest slice defalias defhinted defmacro- defn-memo defnk defnk defonce- defunbound defunbound- defvar defvar- let letfn do case cond condp for loop recur when when-not when-let when-first if if-let if-not . .. -> ->> doto and or dosync doseq dotimes dorun doall load import unimport ns in-ns refer try catch finally throw with-open with-local-vars binding gen-class gen-and-load-class gen-and-save-class handler-case handle");

    var builtins = makeKeywords(
        "* *' *1 *2 *3 *agent* *allow-unresolved-vars* *assert* *clojure-version* *command-line-args* *compile-files* *compile-path* *compiler-options* *data-readers* *e *err* *file* *flush-on-newline* *fn-loader* *in* *math-context* *ns* *out* *print-dup* *print-length* *print-level* *print-meta* *print-readably* *read-eval* *source-path* *unchecked-math* *use-context-classloader* *verbose-defrecords* *warn-on-reflection* + +' - -' -> ->> ->ArrayChunk ->Vec ->VecNode ->VecSeq -cache-protocol-fn -reset-methods .. / < <= = == > >= EMPTY-NODE accessor aclone add-classpath add-watch agent agent-error agent-errors aget alength alias all-ns alter alter-meta! alter-var-root amap ancestors and apply areduce array-map aset aset-boolean aset-byte aset-char aset-double aset-float aset-int aset-long aset-short assert assoc assoc! assoc-in associative? atom await await-for await1 bases bean bigdec bigint biginteger binding bit-and bit-and-not bit-clear bit-flip bit-not bit-or bit-set bit-shift-left bit-shift-right bit-test bit-xor boolean boolean-array booleans bound-fn bound-fn* bound? butlast byte byte-array bytes case cast char char-array char-escape-string char-name-string char? chars chunk chunk-append chunk-buffer chunk-cons chunk-first chunk-next chunk-rest chunked-seq? class class? clear-agent-errors clojure-version coll? comment commute comp comparator compare compare-and-set! compile complement concat cond condp conj conj! cons constantly construct-proxy contains? count counted? create-ns create-struct cycle dec dec' decimal? declare default-data-readers definline definterface defmacro defmethod defmulti defn defn- defonce defprotocol defrecord defstruct deftype delay delay? deliver denominator deref derive descendants destructure disj disj! dissoc dissoc! distinct distinct? doall dorun doseq dosync dotimes doto double double-array doubles drop drop-last drop-while empty empty? ensure enumeration-seq error-handler error-mode eval even? every-pred every? ex-data ex-info extend extend-protocol extend-type extenders extends? false? ffirst file-seq filter filterv find find-keyword find-ns find-protocol-impl find-protocol-method find-var first flatten float float-array float? floats flush fn fn? fnext fnil for force format frequencies future future-call future-cancel future-cancelled? future-done? future? gen-class gen-interface gensym get get-in get-method get-proxy-class get-thread-bindings get-validator group-by hash hash-combine hash-map hash-set identical? identity if-let if-not ifn? import in-ns inc inc' init-proxy instance? int int-array integer? interleave intern interpose into into-array ints io! isa? iterate iterator-seq juxt keep keep-indexed key keys keyword keyword? last lazy-cat lazy-seq let letfn line-seq list list* list? load load-file load-reader load-string loaded-libs locking long long-array longs loop macroexpand macroexpand-1 make-array make-hierarchy map map-indexed map? mapcat mapv max max-key memfn memoize merge merge-with meta method-sig methods min min-key mod munge name namespace namespace-munge neg? newline next nfirst nil? nnext not not-any? not-empty not-every? not= ns ns-aliases ns-imports ns-interns ns-map ns-name ns-publics ns-refers ns-resolve ns-unalias ns-unmap nth nthnext nthrest num number? numerator object-array odd? or parents partial partition partition-all partition-by pcalls peek persistent! pmap pop pop! pop-thread-bindings pos? pr pr-str prefer-method prefers primitives-classnames print print-ctor print-dup print-method print-simple print-str printf println println-str prn prn-str promise proxy proxy-call-with-super proxy-mappings proxy-name proxy-super push-thread-bindings pvalues quot rand rand-int rand-nth range ratio? rational? rationalize re-find re-groups re-matcher re-matches re-pattern re-seq read read-line read-string realized? reduce reduce-kv reductions ref ref-history-count ref-max-history ref-min-history ref-set refer refer-clojure reify release-pending-sends rem remove remove-all-methods remove-method remove-ns remove-watch repeat repeatedly replace replicate require reset! reset-meta! resolve rest restart-agent resultset-seq reverse reversible? rseq rsubseq satisfies? second select-keys send send-off seq seq? seque sequence sequential? set set-error-handler! set-error-mode! set-validator! set? short short-array shorts shuffle shutdown-agents slurp some some-fn sort sort-by sorted-map sorted-map-by sorted-set sorted-set-by sorted? special-symbol? spit split-at split-with str string? struct struct-map subs subseq subvec supers swap! symbol symbol? sync take take-last take-nth take-while test the-ns thread-bound? time to-array to-array-2d trampoline transient tree-seq true? type unchecked-add unchecked-add-int unchecked-byte unchecked-char unchecked-dec unchecked-dec-int unchecked-divide-int unchecked-double unchecked-float unchecked-inc unchecked-inc-int unchecked-int unchecked-long unchecked-multiply unchecked-multiply-int unchecked-negate unchecked-negate-int unchecked-remainder-int unchecked-short unchecked-subtract unchecked-subtract-int underive unquote unquote-splicing update-in update-proxy use val vals var-get var-set var? vary-meta vec vector vector-of vector? when when-first when-let when-not while with-bindings with-bindings* with-in-str with-loading-context with-local-vars with-meta with-open with-out-str with-precision with-redefs with-redefs-fn xml-seq zero? zipmap *default-data-reader-fn* as-> cond-> cond->> reduced reduced? send-via set-agent-send-executor! set-agent-send-off-executor! some-> some->>");

    var indentKeys = makeKeywords(
        // Built-ins
        "ns fn def defn defmethod bound-fn if if-not case condp when while when-not when-first do future comment doto locking proxy with-open with-precision reify deftype defrecord defprotocol extend extend-protocol extend-type try catch " +

        // Binding forms
        "let letfn binding loop for doseq dotimes when-let if-let " +

        // Data structures
        "defstruct struct-map assoc " +

        // clojure.test
        "testing deftest " +

        // contrib
        "handler-case handle dotrace deftrace");

    var tests = {
        digit: /\d/,
        digit_or_colon: /[\d:]/,
        hex: /[0-9a-f]/i,
        sign: /[+-]/,
        exponent: /e/i,
        keyword_char: /[^\s\(\[\;\)\]]/,
        symbol: /[\w*+!\-\._?:<>\/\xa1-\uffff]/,
        block_indent: /^(?:def|with)[^\/]+$|\/(?:def|with)/
    };

    function stateStack(indent, type, prev) { // represents a state stack object
        this.indent = indent;
        this.type = type;
        this.prev = prev;
    }

    function pushStack(state, indent, type) {
        state.indentStack = new stateStack(indent, type, state.indentStack);
    }

    function popStack(state) {
        state.indentStack = state.indentStack.prev;
    }

    function isNumber(ch, stream){
        // hex
        if ( ch === '0' && stream.eat(/x/i) ) {
            stream.eatWhile(tests.hex);
            return true;
        }

        // leading sign
        if ( ( ch == '+' || ch == '-' ) && ( tests.digit.test(stream.peek()) ) ) {
          stream.eat(tests.sign);
          ch = stream.next();
        }

        if ( tests.digit.test(ch) ) {
            stream.eat(ch);
            stream.eatWhile(tests.digit);

            if ( '.' == stream.peek() ) {
                stream.eat('.');
                stream.eatWhile(tests.digit);
            } else if ('/' == stream.peek() ) {
                stream.eat('/');
                stream.eatWhile(tests.digit);
            }

            if ( stream.eat(tests.exponent) ) {
                stream.eat(tests.sign);
                stream.eatWhile(tests.digit);
            }

            return true;
        }

        return false;
    }

    // Eat character that starts after backslash \
    function eatCharacter(stream) {
        var first = stream.next();
        // Read special literals: backspace, newline, space, return.
        // Just read all lowercase letters.
        if (first && first.match(/[a-z]/) && stream.match(/[a-z]+/, true)) {
            return;
        }
        // Read unicode character: \u1000 \uA0a1
        if (first === "u") {
            stream.match(/[0-9a-z]{4}/i, true);
        }
    }

    return {
        startState: function () {
            return {
                indentStack: null,
                indentation: 0,
                mode: false
            };
        },

        token: function (stream, state) {
            if (state.indentStack == null && stream.sol()) {
                // update indentation, but only if indentStack is empty
                state.indentation = stream.indentation();
            }

            // skip spaces
            if (state.mode != "string" && stream.eatSpace()) {
                return null;
            }
            var returnType = null;

            switch(state.mode){
                case "string": // multi-line string parsing mode
                    var next, escaped = false;
                    while ((next = stream.next()) != null) {
                        if (next == "\"" && !escaped) {

                            state.mode = false;
                            break;
                        }
                        escaped = !escaped && next == "\\";
                    }
                    returnType = STRING; // continue on in string mode
                    break;
                default: // default parsing mode
                    var ch = stream.next();

                    if (ch == "\"") {
                        state.mode = "string";
                        returnType = STRING;
                    } else if (ch == "\\") {
                        eatCharacter(stream);
                        returnType = CHARACTER;
                    } else if (ch == "'" && !( tests.digit_or_colon.test(stream.peek()) )) {
                        returnType = ATOM;
                    } else if (ch == ";") { // comment
                        stream.skipToEnd(); // rest of the line is a comment
                        returnType = COMMENT;
                    } else if (isNumber(ch,stream)){
                        returnType = NUMBER;
                    } else if (ch == "(" || ch == "[" || ch == "{" ) {
                        var keyWord = '', indentTemp = stream.column(), letter;
                        /**
                        Either
                        (indent-word ..
                        (non-indent-word ..
                        (;something else, bracket, etc.
                        */

                        if (ch == "(") while ((letter = stream.eat(tests.keyword_char)) != null) {
                            keyWord += letter;
                        }

                        if (keyWord.length > 0 && (indentKeys.propertyIsEnumerable(keyWord) ||
                                                   tests.block_indent.test(keyWord))) { // indent-word
                            pushStack(state, indentTemp + INDENT_WORD_SKIP, ch);
                        } else { // non-indent word
                            // we continue eating the spaces
                            stream.eatSpace();
                            if (stream.eol() || stream.peek() == ";") {
                                // nothing significant after
                                // we restart indentation the user defined spaces after
                                pushStack(state, indentTemp + NORMAL_INDENT_UNIT, ch);
                            } else {
                                pushStack(state, indentTemp + stream.current().length, ch); // else we match
                            }
                        }
                        stream.backUp(stream.current().length - 1); // undo all the eating

                        returnType = BRACKET;
                    } else if (ch == ")" || ch == "]" || ch == "}") {
                        returnType = BRACKET;
                        if (state.indentStack != null && state.indentStack.type == (ch == ")" ? "(" : (ch == "]" ? "[" :"{"))) {
                            popStack(state);
                        }
                    } else if ( ch == ":" ) {
                        stream.eatWhile(tests.symbol);
                        return ATOM;
                    } else {
                        stream.eatWhile(tests.symbol);

                        if (keywords && keywords.propertyIsEnumerable(stream.current())) {
                            returnType = KEYWORD;
                        } else if (builtins && builtins.propertyIsEnumerable(stream.current())) {
                            returnType = BUILTIN;
                        } else if (atoms && atoms.propertyIsEnumerable(stream.current())) {
                            returnType = ATOM;
                        } else {
                          returnType = VAR;
                        }
                    }
            }

            return returnType;
        },

        indent: function (state) {
            if (state.indentStack == null) return state.indentation;
            return state.indentStack.indent;
        },

        closeBrackets: {pairs: "()[]{}\"\""},
        lineComment: ";;"
    };
});

CodeMirror.defineMIME("text/x-clojure", "clojure");
CodeMirror.defineMIME("text/x-clojurescript", "clojure");

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// TODO actually recognize syntax of TypeScript constructs

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

function expressionAllowed(stream, state, backUp) {
  return /^(?:operator|sof|keyword c|case|new|[\[{}\(,;:]|=>)$/.test(state.lastType) ||
    (state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - (backUp || 0))))
}

CodeMirror.defineMode("javascript", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonldMode = parserConfig.jsonld;
  var jsonMode = parserConfig.json || jsonldMode;
  var isTS = parserConfig.typescript;
  var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

  // Tokenizer

  var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    var jsKeywords = {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": C, "break": C, "continue": C, "new": kw("new"), "delete": C, "throw": C, "debugger": C,
      "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C
    };

    // Extend the 'normal' keywords with the TypeScript language extensions
    if (isTS) {
      var type = {type: "variable", style: "variable-3"};
      var tsKeywords = {
        // object-like things
        "interface": kw("class"),
        "implements": C,
        "namespace": C,
        "module": kw("module"),
        "enum": kw("module"),

        // scope modifiers
        "public": kw("modifier"),
        "private": kw("modifier"),
        "protected": kw("modifier"),
        "abstract": kw("modifier"),

        // operators
        "as": operator,

        // types
        "string": type, "number": type, "boolean": type, "any": type
      };

      for (var attr in tsKeywords) {
        jsKeywords[attr] = tsKeywords[attr];
      }
    }

    return jsKeywords;
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^]/;
  var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

  function readRegexp(stream) {
    var escaped = false, next, inSet = false;
    while ((next = stream.next()) != null) {
      if (!escaped) {
        if (next == "/" && !inSet) return;
        if (next == "[") inSet = true;
        else if (inSet && next == "]") inSet = false;
      }
      escaped = !escaped && next == "\\";
    }
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
    return style;
  }
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
      return ret("number", "number");
    } else if (ch == "." && stream.match("..")) {
      return ret("spread", "meta");
    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      return ret(ch);
    } else if (ch == "=" && stream.eat(">")) {
      return ret("=>", "operator");
    } else if (ch == "0" && stream.eat(/x/i)) {
      stream.eatWhile(/[\da-f]/i);
      return ret("number", "number");
    } else if (ch == "0" && stream.eat(/o/i)) {
      stream.eatWhile(/[0-7]/i);
      return ret("number", "number");
    } else if (ch == "0" && stream.eat(/b/i)) {
      stream.eatWhile(/[01]/i);
      return ret("number", "number");
    } else if (/\d/.test(ch)) {
      stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
      return ret("number", "number");
    } else if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      } else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret("comment", "comment");
      } else if (expressionAllowed(stream, state, 1)) {
        readRegexp(stream);
        stream.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/);
        return ret("regexp", "string-2");
      } else {
        stream.eatWhile(isOperatorChar);
        return ret("operator", "operator", stream.current());
      }
    } else if (ch == "`") {
      state.tokenize = tokenQuasi;
      return tokenQuasi(stream, state);
    } else if (ch == "#") {
      stream.skipToEnd();
      return ret("error", "error");
    } else if (isOperatorChar.test(ch)) {
      stream.eatWhile(isOperatorChar);
      return ret("operator", "operator", stream.current());
    } else if (wordRE.test(ch)) {
      stream.eatWhile(wordRE);
      var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
      return (known && state.lastType != ".") ? ret(known.type, known.style, word) :
                     ret("variable", "variable", word);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next;
      if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)){
        state.tokenize = tokenBase;
        return ret("jsonld-keyword", "meta");
      }
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) break;
        escaped = !escaped && next == "\\";
      }
      if (!escaped) state.tokenize = tokenBase;
      return ret("string", "string");
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ret("comment", "comment");
  }

  function tokenQuasi(stream, state) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
        state.tokenize = tokenBase;
        break;
      }
      escaped = !escaped && next == "\\";
    }
    return ret("quasi", "string-2", stream.current());
  }

  var brackets = "([{}])";
  // This is a crude lookahead trick to try and notice that we're
  // parsing the argument patterns for a fat-arrow function before we
  // actually hit the arrow token. It only works if the arrow is on
  // the same line as the arguments and there's no strange noise
  // (comments) in between. Fallback is to only notice when we hit the
  // arrow, and not declare the arguments as locals for the arrow
  // body.
  function findFatArrow(stream, state) {
    if (state.fatArrowAt) state.fatArrowAt = null;
    var arrow = stream.string.indexOf("=>", stream.start);
    if (arrow < 0) return;

    var depth = 0, sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch = stream.string.charAt(pos);
      var bracket = brackets.indexOf(ch);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) { ++pos; break; }
        if (--depth == 0) break;
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (wordRE.test(ch)) {
        sawSomething = true;
      } else if (/["'\/]/.test(ch)) {
        return;
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }

  // Parser

  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true, "jsonld-keyword": true};

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    for (var v = state.localVars; v; v = v.next)
      if (v.name == varname) return true;
    for (var cx = state.context; cx; cx = cx.prev) {
      for (var v = cx.vars; v; v = v.next)
        if (v.name == varname) return true;
    }
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc; cx.style = style;

    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;

    while(true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while(cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        if (cx.marked) return cx.marked;
        if (type == "variable" && inScope(state, content)) return "variable-2";
        return style;
      }
    }
  }

  // Combinator utils

  var cx = {state: null, column: null, marked: null, cc: null};
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }
  function register(varname) {
    function inList(list) {
      for (var v = list; v; v = v.next)
        if (v.name == varname) return true;
      return false;
    }
    var state = cx.state;
    cx.marked = "def";
    if (state.context) {
      if (inList(state.localVars)) return;
      state.localVars = {name: varname, next: state.localVars};
    } else {
      if (inList(state.globalVars)) return;
      if (parserConfig.globalVars)
        state.globalVars = {name: varname, next: state.globalVars};
    }
  }

  // Combinators

  var defaultVars = {name: "this", next: {name: "arguments"}};
  function pushcontext() {
    cx.state.context = {prev: cx.state.context, vars: cx.state.localVars};
    cx.state.localVars = defaultVars;
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars;
    cx.state.context = cx.state.context.prev;
  }
  function pushlex(type, info) {
    var result = function() {
      var state = cx.state, indent = state.indented;
      if (state.lexical.type == "stat") indent = state.lexical.indented;
      else for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev)
        indent = outer.indented;
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    function exp(type) {
      if (type == wanted) return cont();
      else if (wanted == ";") return pass();
      else return cont(exp);
    };
    return exp;
  }

  function statement(type, value) {
    if (type == "var") return cont(pushlex("vardef", value.length), vardef, expect(";"), poplex);
    if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    if (type == "{") return cont(pushlex("}"), block, poplex);
    if (type == ";") return cont();
    if (type == "if") {
      if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
        cx.state.cc.pop()();
      return cont(pushlex("form"), expression, statement, poplex, maybeelse);
    }
    if (type == "function") return cont(functiondef);
    if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
    if (type == "variable") return cont(pushlex("stat"), maybelabel);
    if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),
                                      block, poplex, poplex);
    if (type == "case") return cont(expression, expect(":"));
    if (type == "default") return cont(expect(":"));
    if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
                                     statement, poplex, popcontext);
    if (type == "class") return cont(pushlex("form"), className, poplex);
    if (type == "export") return cont(pushlex("stat"), afterExport, poplex);
    if (type == "import") return cont(pushlex("stat"), afterImport, poplex);
    if (type == "module") return cont(pushlex("form"), pattern, pushlex("}"), expect("{"), block, poplex, poplex)
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function expression(type) {
    return expressionInner(type, false);
  }
  function expressionNoComma(type) {
    return expressionInner(type, true);
  }
  function expressionInner(type, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(pattern, ")"), poplex, expect("=>"), body, popcontext);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef, maybeop);
    if (type == "keyword c") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, comprehension, expect(")"), poplex, maybeop);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
    if (type == "quasi") return pass(quasi, maybeop);
    if (type == "new") return cont(maybeTarget(noComma));
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
  }
  function maybeexpressionNoComma(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expressionNoComma);
  }

  function maybeoperatorComma(type, value) {
    if (type == ",") return cont(expression);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == "operator") {
      if (/\+\+|--/.test(value)) return cont(me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == "quasi") { return pass(quasi, me); }
    if (type == ";") return;
    if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
    if (type == ".") return cont(property, me);
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
  }
  function quasi(type, value) {
    if (type != "quasi") return pass();
    if (value.slice(value.length - 2) != "${") return cont(quasi);
    return cont(expression, continueQuasi);
  }
  function continueQuasi(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      return cont(quasi);
    }
  }
  function arrowBody(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expressionNoComma);
  }
  function maybeTarget(noComma) {
    return function(type) {
      if (type == ".") return cont(noComma ? targetNoComma : target);
      else return pass(noComma ? expressionNoComma : expression);
    };
  }
  function target(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorComma); }
  }
  function targetNoComma(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorNoComma); }
  }
  function maybelabel(type) {
    if (type == ":") return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(getterSetter);
      return cont(afterprop);
    } else if (type == "number" || type == "string") {
      cx.marked = jsonldMode ? "property" : (cx.style + " property");
      return cont(afterprop);
    } else if (type == "jsonld-keyword") {
      return cont(afterprop);
    } else if (type == "modifier") {
      return cont(objprop)
    } else if (type == "[") {
      return cont(expression, expect("]"), afterprop);
    } else if (type == "spread") {
      return cont(expression);
    }
  }
  function getterSetter(type) {
    if (type != "variable") return pass(afterprop);
    cx.marked = "property";
    return cont(functiondef);
  }
  function afterprop(type) {
    if (type == ":") return cont(expressionNoComma);
    if (type == "(") return pass(functiondef);
  }
  function commasep(what, end) {
    function proceed(type) {
      if (type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont(what, proceed);
      }
      if (type == end) return cont();
      return cont(expect(end));
    }
    return function(type) {
      if (type == end) return cont();
      return pass(what, proceed);
    };
  }
  function contCommasep(what, end, info) {
    for (var i = 3; i < arguments.length; i++)
      cx.cc.push(arguments[i]);
    return cont(pushlex(end, info), commasep(what, end), poplex);
  }
  function block(type) {
    if (type == "}") return cont();
    return pass(statement, block);
  }
  function maybetype(type) {
    if (isTS && type == ":") return cont(typedef);
  }
  function maybedefault(_, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function typedef(type) {
    if (type == "variable") {cx.marked = "variable-3"; return cont();}
  }
  function vardef() {
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (type == "modifier") return cont(pattern)
    if (type == "variable") { register(value); return cont(); }
    if (type == "spread") return cont(pattern);
    if (type == "[") return contCommasep(pattern, "]");
    if (type == "{") return contCommasep(proppattern, "}");
  }
  function proppattern(type, value) {
    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      return cont(maybeAssign);
    }
    if (type == "variable") cx.marked = "property";
    if (type == "spread") return cont(pattern);
    if (type == "}") return pass();
    return cont(expect(":"), pattern, maybeAssign);
  }
  function maybeAssign(_type, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function vardefCont(type) {
    if (type == ",") return cont(vardef);
  }
  function maybeelse(type, value) {
    if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
  }
  function forspec(type) {
    if (type == "(") return cont(pushlex(")"), forspec1, expect(")"), poplex);
  }
  function forspec1(type) {
    if (type == "var") return cont(vardef, expect(";"), forspec2);
    if (type == ";") return cont(forspec2);
    if (type == "variable") return cont(formaybeinof);
    return pass(expression, expect(";"), forspec2);
  }
  function formaybeinof(_type, value) {
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return cont(maybeoperatorComma, forspec2);
  }
  function forspec2(type, value) {
    if (type == ";") return cont(forspec3);
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return pass(expression, expect(";"), forspec3);
  }
  function forspec3(type) {
    if (type != ")") cont(expression);
  }
  function functiondef(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
    if (type == "variable") {register(value); return cont(functiondef);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, statement, popcontext);
  }
  function funarg(type) {
    if (type == "spread") return cont(funarg);
    return pass(pattern, maybetype, maybedefault);
  }
  function className(type, value) {
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(type, value) {
    if (value == "extends") return cont(expression, classNameAfter);
    if (type == "{") return cont(pushlex("}"), classBody, poplex);
  }
  function classBody(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      if (value == "static") {
        cx.marked = "keyword";
        return cont(classBody);
      }
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(classGetterSetter, functiondef, classBody);
      return cont(functiondef, classBody);
    }
    if (value == "*") {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (type == ";") return cont(classBody);
    if (type == "}") return cont();
  }
  function classGetterSetter(type) {
    if (type != "variable") return pass();
    cx.marked = "property";
    return cont();
  }
  function afterExport(_type, value) {
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    return pass(statement);
  }
  function afterImport(type) {
    if (type == "string") return cont();
    return pass(importSpec, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == "{") return contCommasep(importSpec, "}");
    if (type == "variable") register(value);
    if (value == "*") cx.marked = "keyword";
    return cont(maybeAs);
  }
  function maybeAs(_type, value) {
    if (value == "as") { cx.marked = "keyword"; return cont(importSpec); }
  }
  function maybeFrom(_type, value) {
    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
  }
  function arrayLiteral(type) {
    if (type == "]") return cont();
    return pass(expressionNoComma, maybeArrayComprehension);
  }
  function maybeArrayComprehension(type) {
    if (type == "for") return pass(comprehension, expect("]"));
    if (type == ",") return cont(commasep(maybeexpressionNoComma, "]"));
    return pass(commasep(expressionNoComma, "]"));
  }
  function comprehension(type) {
    if (type == "for") return cont(forspec, comprehension);
    if (type == "if") return cont(expression, comprehension);
  }

  function isContinuedStatement(state, textAfter) {
    return state.lastType == "operator" || state.lastType == "," ||
      isOperatorChar.test(textAfter.charAt(0)) ||
      /[,.]/.test(textAfter.charAt(0));
  }

  // Interface

  return {
    startState: function(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && {vars: parserConfig.localVars},
        indented: basecolumn || 0
      };
      if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
        state.globalVars = parserConfig.globalVars;
      return state;
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      if (state.tokenize == tokenComment) return CodeMirror.Pass;
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse) break;
      }
      if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info + 1 : 0);
      else if (type == "form" && firstChar == "{") return lexical.indented;
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    lineComment: jsonMode ? null : "//",
    fold: "brace",
    closeBrackets: "()[]{}''\"\"``",

    helperType: jsonMode ? "json" : "javascript",
    jsonldMode: jsonldMode,
    jsonMode: jsonMode,

    expressionAllowed: expressionAllowed,
    skipExpression: function(state) {
      var top = state.cc[state.cc.length - 1]
      if (top == expression || top == expressionNoComma) state.cc.pop()
    }
  };
});

CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("text/ecmascript", "javascript");
CodeMirror.defineMIME("application/javascript", "javascript");
CodeMirror.defineMIME("application/x-javascript", "javascript");
CodeMirror.defineMIME("application/ecmascript", "javascript");
CodeMirror.defineMIME("application/json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/x-json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/ld+json", {name: "javascript", jsonld: true});
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  var ie_lt8 = /MSIE \d/.test(navigator.userAgent) &&
    (document.documentMode == null || document.documentMode < 8);

  var Pos = CodeMirror.Pos;

  var matching = {"(": ")>", ")": "(<", "[": "]>", "]": "[<", "{": "}>", "}": "{<"};

  function findMatchingBracket(cm, where, strict, config) {
    var line = cm.getLineHandle(where.line), pos = where.ch - 1;
    var match = (pos >= 0 && matching[line.text.charAt(pos)]) || matching[line.text.charAt(++pos)];
    if (!match) return null;
    var dir = match.charAt(1) == ">" ? 1 : -1;
    if (strict && (dir > 0) != (pos == where.ch)) return null;
    var style = cm.getTokenTypeAt(Pos(where.line, pos + 1));

    var found = scanForBracket(cm, Pos(where.line, pos + (dir > 0 ? 1 : 0)), dir, style || null, config);
    if (found == null) return null;
    return {from: Pos(where.line, pos), to: found && found.pos,
            match: found && found.ch == match.charAt(0), forward: dir > 0};
  }

  // bracketRegex is used to specify which type of bracket to scan
  // should be a regexp, e.g. /[[\]]/
  //
  // Note: If "where" is on an open bracket, then this bracket is ignored.
  //
  // Returns false when no bracket was found, null when it reached
  // maxScanLines and gave up
  function scanForBracket(cm, where, dir, style, config) {
    var maxScanLen = (config && config.maxScanLineLength) || 10000;
    var maxScanLines = (config && config.maxScanLines) || 1000;

    var stack = [];
    var re = config && config.bracketRegex ? config.bracketRegex : /[(){}[\]]/;
    var lineEnd = dir > 0 ? Math.min(where.line + maxScanLines, cm.lastLine() + 1)
                          : Math.max(cm.firstLine() - 1, where.line - maxScanLines);
    for (var lineNo = where.line; lineNo != lineEnd; lineNo += dir) {
      var line = cm.getLine(lineNo);
      if (!line) continue;
      var pos = dir > 0 ? 0 : line.length - 1, end = dir > 0 ? line.length : -1;
      if (line.length > maxScanLen) continue;
      if (lineNo == where.line) pos = where.ch - (dir < 0 ? 1 : 0);
      for (; pos != end; pos += dir) {
        var ch = line.charAt(pos);
        if (re.test(ch) && (style === undefined || cm.getTokenTypeAt(Pos(lineNo, pos + 1)) == style)) {
          var match = matching[ch];
          if ((match.charAt(1) == ">") == (dir > 0)) stack.push(ch);
          else if (!stack.length) return {pos: Pos(lineNo, pos), ch: ch};
          else stack.pop();
        }
      }
    }
    return lineNo - dir == (dir > 0 ? cm.lastLine() : cm.firstLine()) ? false : null;
  }

  function matchBrackets(cm, autoclear, config) {
    // Disable brace matching in long lines, since it'll cause hugely slow updates
    var maxHighlightLen = cm.state.matchBrackets.maxHighlightLineLength || 1000;
    var marks = [], ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++) {
      var match = ranges[i].empty() && findMatchingBracket(cm, ranges[i].head, false, config);
      if (match && cm.getLine(match.from.line).length <= maxHighlightLen) {
        var style = match.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket";
        marks.push(cm.markText(match.from, Pos(match.from.line, match.from.ch + 1), {className: style}));
        if (match.to && cm.getLine(match.to.line).length <= maxHighlightLen)
          marks.push(cm.markText(match.to, Pos(match.to.line, match.to.ch + 1), {className: style}));
      }
    }

    if (marks.length) {
      // Kludge to work around the IE bug from issue #1193, where text
      // input stops going to the textare whever this fires.
      if (ie_lt8 && cm.state.focused) cm.focus();

      var clear = function() {
        cm.operation(function() {
          for (var i = 0; i < marks.length; i++) marks[i].clear();
        });
      };
      if (autoclear) setTimeout(clear, 800);
      else return clear;
    }
  }

  var currentlyHighlighted = null;
  function doMatchBrackets(cm) {
    cm.operation(function() {
      if (currentlyHighlighted) {currentlyHighlighted(); currentlyHighlighted = null;}
      currentlyHighlighted = matchBrackets(cm, false, cm.state.matchBrackets);
    });
  }

  CodeMirror.defineOption("matchBrackets", false, function(cm, val, old) {
    if (old && old != CodeMirror.Init)
      cm.off("cursorActivity", doMatchBrackets);
    if (val) {
      cm.state.matchBrackets = typeof val == "object" ? val : {};
      cm.on("cursorActivity", doMatchBrackets);
    }
  });

  CodeMirror.defineExtension("matchBrackets", function() {matchBrackets(this, true);});
  CodeMirror.defineExtension("findMatchingBracket", function(pos, strict, config){
    return findMatchingBracket(this, pos, strict, config);
  });
  CodeMirror.defineExtension("scanForBracket", function(pos, dir, style, config){
    return scanForBracket(this, pos, dir, style, config);
  });
});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  function Bar(cls, orientation, scroll) {
    this.orientation = orientation;
    this.scroll = scroll;
    this.screen = this.total = this.size = 1;
    this.pos = 0;

    this.node = document.createElement("div");
    this.node.className = cls + "-" + orientation;
    this.inner = this.node.appendChild(document.createElement("div"));

    var self = this;
    CodeMirror.on(this.inner, "mousedown", function(e) {
      if (e.which != 1) return;
      CodeMirror.e_preventDefault(e);
      var axis = self.orientation == "horizontal" ? "pageX" : "pageY";
      var start = e[axis], startpos = self.pos;
      function done() {
        CodeMirror.off(document, "mousemove", move);
        CodeMirror.off(document, "mouseup", done);
      }
      function move(e) {
        if (e.which != 1) return done();
        self.moveTo(startpos + (e[axis] - start) * (self.total / self.size));
      }
      CodeMirror.on(document, "mousemove", move);
      CodeMirror.on(document, "mouseup", done);
    });

    CodeMirror.on(this.node, "click", function(e) {
      CodeMirror.e_preventDefault(e);
      var innerBox = self.inner.getBoundingClientRect(), where;
      if (self.orientation == "horizontal")
        where = e.clientX < innerBox.left ? -1 : e.clientX > innerBox.right ? 1 : 0;
      else
        where = e.clientY < innerBox.top ? -1 : e.clientY > innerBox.bottom ? 1 : 0;
      self.moveTo(self.pos + where * self.screen);
    });

    function onWheel(e) {
      var moved = CodeMirror.wheelEventPixels(e)[self.orientation == "horizontal" ? "x" : "y"];
      var oldPos = self.pos;
      self.moveTo(self.pos + moved);
      if (self.pos != oldPos) CodeMirror.e_preventDefault(e);
    }
    CodeMirror.on(this.node, "mousewheel", onWheel);
    CodeMirror.on(this.node, "DOMMouseScroll", onWheel);
  }

  Bar.prototype.moveTo = function(pos, update) {
    if (pos < 0) pos = 0;
    if (pos > this.total - this.screen) pos = this.total - this.screen;
    if (pos == this.pos) return;
    this.pos = pos;
    this.inner.style[this.orientation == "horizontal" ? "left" : "top"] =
      (pos * (this.size / this.total)) + "px";
    if (update !== false) this.scroll(pos, this.orientation);
  };

  var minButtonSize = 10;

  Bar.prototype.update = function(scrollSize, clientSize, barSize) {
    this.screen = clientSize;
    this.total = scrollSize;
    this.size = barSize;

    var buttonSize = this.screen * (this.size / this.total);
    if (buttonSize < minButtonSize) {
      this.size -= minButtonSize - buttonSize;
      buttonSize = minButtonSize;
    }
    this.inner.style[this.orientation == "horizontal" ? "width" : "height"] =
      buttonSize + "px";
    this.inner.style[this.orientation == "horizontal" ? "left" : "top"] =
      this.pos * (this.size / this.total) + "px";
  };

  function SimpleScrollbars(cls, place, scroll) {
    this.addClass = cls;
    this.horiz = new Bar(cls, "horizontal", scroll);
    place(this.horiz.node);
    this.vert = new Bar(cls, "vertical", scroll);
    place(this.vert.node);
    this.width = null;
  }

  SimpleScrollbars.prototype.update = function(measure) {
    if (this.width == null) {
      var style = window.getComputedStyle ? window.getComputedStyle(this.horiz.node) : this.horiz.node.currentStyle;
      if (style) this.width = parseInt(style.height);
    }
    var width = this.width || 0;

    var needsH = measure.scrollWidth > measure.clientWidth + 1;
    var needsV = measure.scrollHeight > measure.clientHeight + 1;
    this.vert.node.style.display = needsV ? "block" : "none";
    this.horiz.node.style.display = needsH ? "block" : "none";

    if (needsV) {
      this.vert.update(measure.scrollHeight, measure.clientHeight,
                       measure.viewHeight - (needsH ? width : 0));
      this.vert.node.style.display = "block";
      this.vert.node.style.bottom = needsH ? width + "px" : "0";
    }
    if (needsH) {
      this.horiz.update(measure.scrollWidth, measure.clientWidth,
                        measure.viewWidth - (needsV ? width : 0) - measure.barLeft);
      this.horiz.node.style.right = needsV ? width + "px" : "0";
      this.horiz.node.style.left = measure.barLeft + "px";
    }

    return {right: needsV ? width : 0, bottom: needsH ? width : 0};
  };

  SimpleScrollbars.prototype.setScrollTop = function(pos) {
    this.vert.moveTo(pos, false);
  };

  SimpleScrollbars.prototype.setScrollLeft = function(pos) {
    this.horiz.moveTo(pos, false);
  };

  SimpleScrollbars.prototype.clear = function() {
    var parent = this.horiz.node.parentNode;
    parent.removeChild(this.horiz.node);
    parent.removeChild(this.vert.node);
  };

  CodeMirror.scrollbarModel.simple = function(place, scroll) {
    return new SimpleScrollbars("CodeMirror-simplescroll", place, scroll);
  };
  CodeMirror.scrollbarModel.overlay = function(place, scroll) {
    return new SimpleScrollbars("CodeMirror-overlayscroll", place, scroll);
  };
});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  var defaults = {
    pairs: "()[]{}''\"\"",
    triples: "",
    explode: "[]{}"
  };

  var Pos = CodeMirror.Pos;

  CodeMirror.defineOption("autoCloseBrackets", false, function(cm, val, old) {
    if (old && old != CodeMirror.Init) {
      cm.removeKeyMap(keyMap);
      cm.state.closeBrackets = null;
    }
    if (val) {
      cm.state.closeBrackets = val;
      cm.addKeyMap(keyMap);
    }
  });

  function getOption(conf, name) {
    if (name == "pairs" && typeof conf == "string") return conf;
    if (typeof conf == "object" && conf[name] != null) return conf[name];
    return defaults[name];
  }

  var bind = defaults.pairs + "`";
  var keyMap = {Backspace: handleBackspace, Enter: handleEnter};
  for (var i = 0; i < bind.length; i++)
    keyMap["'" + bind.charAt(i) + "'"] = handler(bind.charAt(i));

  function handler(ch) {
    return function(cm) { return handleChar(cm, ch); };
  }

  function getConfig(cm) {
    var deflt = cm.state.closeBrackets;
    if (!deflt) return null;
    var mode = cm.getModeAt(cm.getCursor());
    return mode.closeBrackets || deflt;
  }

  function handleBackspace(cm) {
    var conf = getConfig(cm);
    if (!conf || cm.getOption("disableInput")) return CodeMirror.Pass;

    var pairs = getOption(conf, "pairs");
    var ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++) {
      if (!ranges[i].empty()) return CodeMirror.Pass;
      var around = charsAround(cm, ranges[i].head);
      if (!around || pairs.indexOf(around) % 2 != 0) return CodeMirror.Pass;
    }
    for (var i = ranges.length - 1; i >= 0; i--) {
      var cur = ranges[i].head;
      cm.replaceRange("", Pos(cur.line, cur.ch - 1), Pos(cur.line, cur.ch + 1), "+delete");
    }
  }

  function handleEnter(cm) {
    var conf = getConfig(cm);
    var explode = conf && getOption(conf, "explode");
    if (!explode || cm.getOption("disableInput")) return CodeMirror.Pass;

    var ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++) {
      if (!ranges[i].empty()) return CodeMirror.Pass;
      var around = charsAround(cm, ranges[i].head);
      if (!around || explode.indexOf(around) % 2 != 0) return CodeMirror.Pass;
    }
    cm.operation(function() {
      cm.replaceSelection("\n\n", null);
      cm.execCommand("goCharLeft");
      ranges = cm.listSelections();
      for (var i = 0; i < ranges.length; i++) {
        var line = ranges[i].head.line;
        cm.indentLine(line, null, true);
        cm.indentLine(line + 1, null, true);
      }
    });
  }

  function contractSelection(sel) {
    var inverted = CodeMirror.cmpPos(sel.anchor, sel.head) > 0;
    return {anchor: new Pos(sel.anchor.line, sel.anchor.ch + (inverted ? -1 : 1)),
            head: new Pos(sel.head.line, sel.head.ch + (inverted ? 1 : -1))};
  }

  function handleChar(cm, ch) {
    var conf = getConfig(cm);
    if (!conf || cm.getOption("disableInput")) return CodeMirror.Pass;

    var pairs = getOption(conf, "pairs");
    var pos = pairs.indexOf(ch);
    if (pos == -1) return CodeMirror.Pass;
    var triples = getOption(conf, "triples");

    var identical = pairs.charAt(pos + 1) == ch;
    var ranges = cm.listSelections();
    var opening = pos % 2 == 0;

    var type, next;
    for (var i = 0; i < ranges.length; i++) {
      var range = ranges[i], cur = range.head, curType;
      var next = cm.getRange(cur, Pos(cur.line, cur.ch + 1));
      if (opening && !range.empty()) {
        curType = "surround";
      } else if ((identical || !opening) && next == ch) {
        if (triples.indexOf(ch) >= 0 && cm.getRange(cur, Pos(cur.line, cur.ch + 3)) == ch + ch + ch)
          curType = "skipThree";
        else
          curType = "skip";
      } else if (identical && cur.ch > 1 && triples.indexOf(ch) >= 0 &&
                 cm.getRange(Pos(cur.line, cur.ch - 2), cur) == ch + ch &&
                 (cur.ch <= 2 || cm.getRange(Pos(cur.line, cur.ch - 3), Pos(cur.line, cur.ch - 2)) != ch)) {
        curType = "addFour";
      } else if (identical) {
        if (!CodeMirror.isWordChar(next) && enteringString(cm, cur, ch)) curType = "both";
        else return CodeMirror.Pass;
      } else if (opening && (cm.getLine(cur.line).length == cur.ch ||
                             isClosingBracket(next, pairs) ||
                             /\s/.test(next))) {
        curType = "both";
      } else {
        return CodeMirror.Pass;
      }
      if (!type) type = curType;
      else if (type != curType) return CodeMirror.Pass;
    }

    var left = pos % 2 ? pairs.charAt(pos - 1) : ch;
    var right = pos % 2 ? ch : pairs.charAt(pos + 1);
    cm.operation(function() {
      if (type == "skip") {
        cm.execCommand("goCharRight");
      } else if (type == "skipThree") {
        for (var i = 0; i < 3; i++)
          cm.execCommand("goCharRight");
      } else if (type == "surround") {
        var sels = cm.getSelections();
        for (var i = 0; i < sels.length; i++)
          sels[i] = left + sels[i] + right;
        cm.replaceSelections(sels, "around");
        sels = cm.listSelections().slice();
        for (var i = 0; i < sels.length; i++)
          sels[i] = contractSelection(sels[i]);
        cm.setSelections(sels);
      } else if (type == "both") {
        cm.replaceSelection(left + right, null);
        cm.triggerElectric(left + right);
        cm.execCommand("goCharLeft");
      } else if (type == "addFour") {
        cm.replaceSelection(left + left + left + left, "before");
        cm.execCommand("goCharRight");
      }
    });
  }

  function isClosingBracket(ch, pairs) {
    var pos = pairs.lastIndexOf(ch);
    return pos > -1 && pos % 2 == 1;
  }

  function charsAround(cm, pos) {
    var str = cm.getRange(Pos(pos.line, pos.ch - 1),
                          Pos(pos.line, pos.ch + 1));
    return str.length == 2 ? str : null;
  }

  // Project the token type that will exists after the given char is
  // typed, and use it to determine whether it would cause the start
  // of a string token.
  function enteringString(cm, pos, ch) {
    var line = cm.getLine(pos.line);
    var token = cm.getTokenAt(pos);
    if (/\bstring2?\b/.test(token.type)) return false;
    var stream = new CodeMirror.StringStream(line.slice(0, pos.ch) + ch + line.slice(pos.ch), 4);
    stream.pos = stream.start = token.start;
    for (;;) {
      var type1 = cm.getMode().token(stream, token.state);
      if (stream.pos >= pos.ch + 1) return /\bstring2?\b/.test(type1);
      stream.start = stream.pos;
    }
  }
});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  function wordRegexp(words) {
    return new RegExp("^((" + words.join(")|(") + "))\\b");
  }

  var wordOperators = wordRegexp(["and", "or", "not", "is"]);
  var commonKeywords = ["as", "assert", "break", "class", "continue",
                        "def", "del", "elif", "else", "except", "finally",
                        "for", "from", "global", "if", "import",
                        "lambda", "pass", "raise", "return",
                        "try", "while", "with", "yield", "in"];
  var commonBuiltins = ["abs", "all", "any", "bin", "bool", "bytearray", "callable", "chr",
                        "classmethod", "compile", "complex", "delattr", "dict", "dir", "divmod",
                        "enumerate", "eval", "filter", "float", "format", "frozenset",
                        "getattr", "globals", "hasattr", "hash", "help", "hex", "id",
                        "input", "int", "isinstance", "issubclass", "iter", "len",
                        "list", "locals", "map", "max", "memoryview", "min", "next",
                        "object", "oct", "open", "ord", "pow", "property", "range",
                        "repr", "reversed", "round", "set", "setattr", "slice",
                        "sorted", "staticmethod", "str", "sum", "super", "tuple",
                        "type", "vars", "zip", "__import__", "NotImplemented",
                        "Ellipsis", "__debug__"];
  var py2 = {builtins: ["apply", "basestring", "buffer", "cmp", "coerce", "execfile",
                        "file", "intern", "long", "raw_input", "reduce", "reload",
                        "unichr", "unicode", "xrange", "False", "True", "None"],
             keywords: ["exec", "print"]};
  var py3 = {builtins: ["ascii", "bytes", "exec", "print"],
             keywords: ["nonlocal", "False", "True", "None", "async", "await"]};

  CodeMirror.registerHelper("hintWords", "python", commonKeywords.concat(commonBuiltins));

  function top(state) {
    return state.scopes[state.scopes.length - 1];
  }

  CodeMirror.defineMode("python", function(conf, parserConf) {
    var ERRORCLASS = "error";

    var singleDelimiters = parserConf.singleDelimiters || /^[\(\)\[\]\{\}@,:`=;\.]/;
    var doubleOperators = parserConf.doubleOperators || /^([!<>]==|<>|<<|>>|\/\/|\*\*)/;
    var doubleDelimiters = parserConf.doubleDelimiters || /^(\+=|\-=|\*=|%=|\/=|&=|\|=|\^=)/;
    var tripleDelimiters = parserConf.tripleDelimiters || /^(\/\/=|>>=|<<=|\*\*=)/;

    if (parserConf.version && parseInt(parserConf.version, 10) == 3){
        // since http://legacy.python.org/dev/peps/pep-0465/ @ is also an operator
        var singleOperators = parserConf.singleOperators || /^[\+\-\*\/%&|\^~<>!@]/;
        var identifiers = parserConf.identifiers|| /^[_A-Za-z\u00A1-\uFFFF][_A-Za-z0-9\u00A1-\uFFFF]*/;
    } else {
        var singleOperators = parserConf.singleOperators || /^[\+\-\*\/%&|\^~<>!]/;
        var identifiers = parserConf.identifiers|| /^[_A-Za-z][_A-Za-z0-9]*/;
    }

    var hangingIndent = parserConf.hangingIndent || conf.indentUnit;

    var myKeywords = commonKeywords, myBuiltins = commonBuiltins;
    if(parserConf.extra_keywords != undefined){
      myKeywords = myKeywords.concat(parserConf.extra_keywords);
    }
    if(parserConf.extra_builtins != undefined){
      myBuiltins = myBuiltins.concat(parserConf.extra_builtins);
    }
    if (parserConf.version && parseInt(parserConf.version, 10) == 3) {
      myKeywords = myKeywords.concat(py3.keywords);
      myBuiltins = myBuiltins.concat(py3.builtins);
      var stringPrefixes = new RegExp("^(([rb]|(br))?('{3}|\"{3}|['\"]))", "i");
    } else {
      myKeywords = myKeywords.concat(py2.keywords);
      myBuiltins = myBuiltins.concat(py2.builtins);
      var stringPrefixes = new RegExp("^(([rub]|(ur)|(br))?('{3}|\"{3}|['\"]))", "i");
    }
    var keywords = wordRegexp(myKeywords);
    var builtins = wordRegexp(myBuiltins);

    // tokenizers
    function tokenBase(stream, state) {
      // Handle scope changes
      if (stream.sol() && top(state).type == "py") {
        var scopeOffset = top(state).offset;
        if (stream.eatSpace()) {
          var lineOffset = stream.indentation();
          if (lineOffset > scopeOffset)
            pushScope(stream, state, "py");
          else if (lineOffset < scopeOffset && dedent(stream, state))
            state.errorToken = true;
          return null;
        } else {
          var style = tokenBaseInner(stream, state);
          if (scopeOffset > 0 && dedent(stream, state))
            style += " " + ERRORCLASS;
          return style;
        }
      }
      return tokenBaseInner(stream, state);
    }

    function tokenBaseInner(stream, state) {
      if (stream.eatSpace()) return null;

      var ch = stream.peek();

      // Handle Comments
      if (ch == "#") {
        stream.skipToEnd();
        return "comment";
      }

      // Handle Number Literals
      if (stream.match(/^[0-9\.]/, false)) {
        var floatLiteral = false;
        // Floats
        if (stream.match(/^\d*\.\d+(e[\+\-]?\d+)?/i)) { floatLiteral = true; }
        if (stream.match(/^\d+\.\d*/)) { floatLiteral = true; }
        if (stream.match(/^\.\d+/)) { floatLiteral = true; }
        if (floatLiteral) {
          // Float literals may be "imaginary"
          stream.eat(/J/i);
          return "number";
        }
        // Integers
        var intLiteral = false;
        // Hex
        if (stream.match(/^0x[0-9a-f]+/i)) intLiteral = true;
        // Binary
        if (stream.match(/^0b[01]+/i)) intLiteral = true;
        // Octal
        if (stream.match(/^0o[0-7]+/i)) intLiteral = true;
        // Decimal
        if (stream.match(/^[1-9]\d*(e[\+\-]?\d+)?/)) {
          // Decimal literals may be "imaginary"
          stream.eat(/J/i);
          // TODO - Can you have imaginary longs?
          intLiteral = true;
        }
        // Zero by itself with no other piece of number.
        if (stream.match(/^0(?![\dx])/i)) intLiteral = true;
        if (intLiteral) {
          // Integer literals may be "long"
          stream.eat(/L/i);
          return "number";
        }
      }

      // Handle Strings
      if (stream.match(stringPrefixes)) {
        state.tokenize = tokenStringFactory(stream.current());
        return state.tokenize(stream, state);
      }

      // Handle operators and Delimiters
      if (stream.match(tripleDelimiters) || stream.match(doubleDelimiters))
        return "punctuation";

      if (stream.match(doubleOperators) || stream.match(singleOperators))
        return "operator";

      if (stream.match(singleDelimiters))
        return "punctuation";

      if (state.lastToken == "." && stream.match(identifiers))
        return "property";

      if (stream.match(keywords) || stream.match(wordOperators))
        return "keyword";

      if (stream.match(builtins))
        return "builtin";

      if (stream.match(/^(self|cls)\b/))
        return "variable-2";

      if (stream.match(identifiers)) {
        if (state.lastToken == "def" || state.lastToken == "class")
          return "def";
        return "variable";
      }

      // Handle non-detected items
      stream.next();
      return ERRORCLASS;
    }

    function tokenStringFactory(delimiter) {
      while ("rub".indexOf(delimiter.charAt(0).toLowerCase()) >= 0)
        delimiter = delimiter.substr(1);

      var singleline = delimiter.length == 1;
      var OUTCLASS = "string";

      function tokenString(stream, state) {
        while (!stream.eol()) {
          stream.eatWhile(/[^'"\\]/);
          if (stream.eat("\\")) {
            stream.next();
            if (singleline && stream.eol())
              return OUTCLASS;
          } else if (stream.match(delimiter)) {
            state.tokenize = tokenBase;
            return OUTCLASS;
          } else {
            stream.eat(/['"]/);
          }
        }
        if (singleline) {
          if (parserConf.singleLineStringErrors)
            return ERRORCLASS;
          else
            state.tokenize = tokenBase;
        }
        return OUTCLASS;
      }
      tokenString.isString = true;
      return tokenString;
    }

    function pushScope(stream, state, type) {
      var offset = 0, align = null;
      if (type == "py") {
        while (top(state).type != "py")
          state.scopes.pop();
      }
      offset = top(state).offset + (type == "py" ? conf.indentUnit : hangingIndent);
      if (type != "py" && !stream.match(/^(\s|#.*)*$/, false))
        align = stream.column() + 1;
      state.scopes.push({offset: offset, type: type, align: align});
    }

    function dedent(stream, state) {
      var indented = stream.indentation();
      while (top(state).offset > indented) {
        if (top(state).type != "py") return true;
        state.scopes.pop();
      }
      return top(state).offset != indented;
    }

    function tokenLexer(stream, state) {
      var style = state.tokenize(stream, state);
      var current = stream.current();

      // Handle decorators
      if (current == "@"){
        if(parserConf.version && parseInt(parserConf.version, 10) == 3){
            return stream.match(identifiers, false) ? "meta" : "operator";
        } else {
            return stream.match(identifiers, false) ? "meta" : ERRORCLASS;
        }
      }

      if ((style == "variable" || style == "builtin")
          && state.lastToken == "meta")
        style = "meta";

      // Handle scope changes.
      if (current == "pass" || current == "return")
        state.dedent += 1;

      if (current == "lambda") state.lambda = true;
      if (current == ":" && !state.lambda && top(state).type == "py")
        pushScope(stream, state, "py");

      var delimiter_index = current.length == 1 ? "[({".indexOf(current) : -1;
      if (delimiter_index != -1)
        pushScope(stream, state, "])}".slice(delimiter_index, delimiter_index+1));

      delimiter_index = "])}".indexOf(current);
      if (delimiter_index != -1) {
        if (top(state).type == current) state.scopes.pop();
        else return ERRORCLASS;
      }
      if (state.dedent > 0 && stream.eol() && top(state).type == "py") {
        if (state.scopes.length > 1) state.scopes.pop();
        state.dedent -= 1;
      }

      return style;
    }

    var external = {
      startState: function(basecolumn) {
        return {
          tokenize: tokenBase,
          scopes: [{offset: basecolumn || 0, type: "py", align: null}],
          lastToken: null,
          lambda: false,
          dedent: 0
        };
      },

      token: function(stream, state) {
        var addErr = state.errorToken;
        if (addErr) state.errorToken = false;
        var style = tokenLexer(stream, state);

        if (style && style != "comment")
          state.lastToken = (style == "keyword" || style == "punctuation") ? stream.current() : style;
        if (style == "punctuation") style = null;

        if (stream.eol() && state.lambda)
          state.lambda = false;
        return addErr ? style + " " + ERRORCLASS : style;
      },

      indent: function(state, textAfter) {
        if (state.tokenize != tokenBase)
          return state.tokenize.isString ? CodeMirror.Pass : 0;

        var scope = top(state);
        var closing = textAfter && textAfter.charAt(0) == scope.type;
        if (scope.align != null)
          return scope.align - (closing ? 1 : 0);
        else if (closing && state.scopes.length > 1)
          return state.scopes[state.scopes.length - 2].offset;
        else
          return scope.offset;
      },

      closeBrackets: {triples: "'\""},
      lineComment: "#",
      fold: "indent"
    };
    return external;
  });

  CodeMirror.defineMIME("text/x-python", "python");

  var words = function(str) { return str.split(" "); };

  CodeMirror.defineMIME("text/x-cython", {
    name: "python",
    extra_keywords: words("by cdef cimport cpdef ctypedef enum except"+
                          "extern gil include nogil property public"+
                          "readonly struct union DEF IF ELIF ELSE")
  });

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

/**
 * Author: Koh Zi Han, based on implementation by Koh Zi Chun
 */

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("scheme", function () {
    var BUILTIN = "builtin", COMMENT = "comment", STRING = "string",
        ATOM = "atom", NUMBER = "number", BRACKET = "bracket";
    var INDENT_WORD_SKIP = 2;

    function makeKeywords(str) {
        var obj = {}, words = str.split(" ");
        for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
        return obj;
    }

    var keywords = makeKeywords("Î» case-lambda call/cc class define-class exit-handler field import inherit init-field interface let*-values let-values let/ec mixin opt-lambda override protect provide public rename require require-for-syntax syntax syntax-case syntax-error unit/sig unless when with-syntax and begin call-with-current-continuation call-with-input-file call-with-output-file case cond define define-syntax delay do dynamic-wind else for-each if lambda let let* let-syntax letrec letrec-syntax map or syntax-rules abs acos angle append apply asin assoc assq assv atan boolean? caar cadr call-with-input-file call-with-output-file call-with-values car cdddar cddddr cdr ceiling char->integer char-alphabetic? char-ci<=? char-ci<? char-ci=? char-ci>=? char-ci>? char-downcase char-lower-case? char-numeric? char-ready? char-upcase char-upper-case? char-whitespace? char<=? char<? char=? char>=? char>? char? close-input-port close-output-port complex? cons cos current-input-port current-output-port denominator display eof-object? eq? equal? eqv? eval even? exact->inexact exact? exp expt #f floor force gcd imag-part inexact->exact inexact? input-port? integer->char integer? interaction-environment lcm length list list->string list->vector list-ref list-tail list? load log magnitude make-polar make-rectangular make-string make-vector max member memq memv min modulo negative? newline not null-environment null? number->string number? numerator odd? open-input-file open-output-file output-port? pair? peek-char port? positive? procedure? quasiquote quote quotient rational? rationalize read read-char real-part real? remainder reverse round scheme-report-environment set! set-car! set-cdr! sin sqrt string string->list string->number string->symbol string-append string-ci<=? string-ci<? string-ci=? string-ci>=? string-ci>? string-copy string-fill! string-length string-ref string-set! string<=? string<? string=? string>=? string>? string? substring symbol->string symbol? #t tan transcript-off transcript-on truncate values vector vector->list vector-fill! vector-length vector-ref vector-set! with-input-from-file with-output-to-file write write-char zero?");
    var indentKeys = makeKeywords("define let letrec let* lambda");

    function stateStack(indent, type, prev) { // represents a state stack object
        this.indent = indent;
        this.type = type;
        this.prev = prev;
    }

    function pushStack(state, indent, type) {
        state.indentStack = new stateStack(indent, type, state.indentStack);
    }

    function popStack(state) {
        state.indentStack = state.indentStack.prev;
    }

    var binaryMatcher = new RegExp(/^(?:[-+]i|[-+][01]+#*(?:\/[01]+#*)?i|[-+]?[01]+#*(?:\/[01]+#*)?@[-+]?[01]+#*(?:\/[01]+#*)?|[-+]?[01]+#*(?:\/[01]+#*)?[-+](?:[01]+#*(?:\/[01]+#*)?)?i|[-+]?[01]+#*(?:\/[01]+#*)?)(?=[()\s;"]|$)/i);
    var octalMatcher = new RegExp(/^(?:[-+]i|[-+][0-7]+#*(?:\/[0-7]+#*)?i|[-+]?[0-7]+#*(?:\/[0-7]+#*)?@[-+]?[0-7]+#*(?:\/[0-7]+#*)?|[-+]?[0-7]+#*(?:\/[0-7]+#*)?[-+](?:[0-7]+#*(?:\/[0-7]+#*)?)?i|[-+]?[0-7]+#*(?:\/[0-7]+#*)?)(?=[()\s;"]|$)/i);
    var hexMatcher = new RegExp(/^(?:[-+]i|[-+][\da-f]+#*(?:\/[\da-f]+#*)?i|[-+]?[\da-f]+#*(?:\/[\da-f]+#*)?@[-+]?[\da-f]+#*(?:\/[\da-f]+#*)?|[-+]?[\da-f]+#*(?:\/[\da-f]+#*)?[-+](?:[\da-f]+#*(?:\/[\da-f]+#*)?)?i|[-+]?[\da-f]+#*(?:\/[\da-f]+#*)?)(?=[()\s;"]|$)/i);
    var decimalMatcher = new RegExp(/^(?:[-+]i|[-+](?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)i|[-+]?(?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)@[-+]?(?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)|[-+]?(?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)[-+](?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)?i|(?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*))(?=[()\s;"]|$)/i);

    function isBinaryNumber (stream) {
        return stream.match(binaryMatcher);
    }

    function isOctalNumber (stream) {
        return stream.match(octalMatcher);
    }

    function isDecimalNumber (stream, backup) {
        if (backup === true) {
            stream.backUp(1);
        }
        return stream.match(decimalMatcher);
    }

    function isHexNumber (stream) {
        return stream.match(hexMatcher);
    }

    return {
        startState: function () {
            return {
                indentStack: null,
                indentation: 0,
                mode: false,
                sExprComment: false
            };
        },

        token: function (stream, state) {
            if (state.indentStack == null && stream.sol()) {
                // update indentation, but only if indentStack is empty
                state.indentation = stream.indentation();
            }

            // skip spaces
            if (stream.eatSpace()) {
                return null;
            }
            var returnType = null;

            switch(state.mode){
                case "string": // multi-line string parsing mode
                    var next, escaped = false;
                    while ((next = stream.next()) != null) {
                        if (next == "\"" && !escaped) {

                            state.mode = false;
                            break;
                        }
                        escaped = !escaped && next == "\\";
                    }
                    returnType = STRING; // continue on in scheme-string mode
                    break;
                case "comment": // comment parsing mode
                    var next, maybeEnd = false;
                    while ((next = stream.next()) != null) {
                        if (next == "#" && maybeEnd) {

                            state.mode = false;
                            break;
                        }
                        maybeEnd = (next == "|");
                    }
                    returnType = COMMENT;
                    break;
                case "s-expr-comment": // s-expr commenting mode
                    state.mode = false;
                    if(stream.peek() == "(" || stream.peek() == "["){
                        // actually start scheme s-expr commenting mode
                        state.sExprComment = 0;
                    }else{
                        // if not we just comment the entire of the next token
                        stream.eatWhile(/[^/s]/); // eat non spaces
                        returnType = COMMENT;
                        break;
                    }
                default: // default parsing mode
                    var ch = stream.next();

                    if (ch == "\"") {
                        state.mode = "string";
                        returnType = STRING;

                    } else if (ch == "'") {
                        returnType = ATOM;
                    } else if (ch == '#') {
                        if (stream.eat("|")) {                    // Multi-line comment
                            state.mode = "comment"; // toggle to comment mode
                            returnType = COMMENT;
                        } else if (stream.eat(/[tf]/i)) {            // #t/#f (atom)
                            returnType = ATOM;
                        } else if (stream.eat(';')) {                // S-Expr comment
                            state.mode = "s-expr-comment";
                            returnType = COMMENT;
                        } else {
                            var numTest = null, hasExactness = false, hasRadix = true;
                            if (stream.eat(/[ei]/i)) {
                                hasExactness = true;
                            } else {
                                stream.backUp(1);       // must be radix specifier
                            }
                            if (stream.match(/^#b/i)) {
                                numTest = isBinaryNumber;
                            } else if (stream.match(/^#o/i)) {
                                numTest = isOctalNumber;
                            } else if (stream.match(/^#x/i)) {
                                numTest = isHexNumber;
                            } else if (stream.match(/^#d/i)) {
                                numTest = isDecimalNumber;
                            } else if (stream.match(/^[-+0-9.]/, false)) {
                                hasRadix = false;
                                numTest = isDecimalNumber;
                            // re-consume the intial # if all matches failed
                            } else if (!hasExactness) {
                                stream.eat('#');
                            }
                            if (numTest != null) {
                                if (hasRadix && !hasExactness) {
                                    // consume optional exactness after radix
                                    stream.match(/^#[ei]/i);
                                }
                                if (numTest(stream))
                                    returnType = NUMBER;
                            }
                        }
                    } else if (/^[-+0-9.]/.test(ch) && isDecimalNumber(stream, true)) { // match non-prefixed number, must be decimal
                        returnType = NUMBER;
                    } else if (ch == ";") { // comment
                        stream.skipToEnd(); // rest of the line is a comment
                        returnType = COMMENT;
                    } else if (ch == "(" || ch == "[") {
                      var keyWord = ''; var indentTemp = stream.column(), letter;
                        /**
                        Either
                        (indent-word ..
                        (non-indent-word ..
                        (;something else, bracket, etc.
                        */

                        while ((letter = stream.eat(/[^\s\(\[\;\)\]]/)) != null) {
                            keyWord += letter;
                        }

                        if (keyWord.length > 0 && indentKeys.propertyIsEnumerable(keyWord)) { // indent-word

                            pushStack(state, indentTemp + INDENT_WORD_SKIP, ch);
                        } else { // non-indent word
                            // we continue eating the spaces
                            stream.eatSpace();
                            if (stream.eol() || stream.peek() == ";") {
                                // nothing significant after
                                // we restart indentation 1 space after
                                pushStack(state, indentTemp + 1, ch);
                            } else {
                                pushStack(state, indentTemp + stream.current().length, ch); // else we match
                            }
                        }
                        stream.backUp(stream.current().length - 1); // undo all the eating

                        if(typeof state.sExprComment == "number") state.sExprComment++;

                        returnType = BRACKET;
                    } else if (ch == ")" || ch == "]") {
                        returnType = BRACKET;
                        if (state.indentStack != null && state.indentStack.type == (ch == ")" ? "(" : "[")) {
                            popStack(state);

                            if(typeof state.sExprComment == "number"){
                                if(--state.sExprComment == 0){
                                    returnType = COMMENT; // final closing bracket
                                    state.sExprComment = false; // turn off s-expr commenting mode
                                }
                            }
                        }
                    } else {
                        stream.eatWhile(/[\w\$_\-!$%&*+\.\/:<=>?@\^~]/);

                        if (keywords && keywords.propertyIsEnumerable(stream.current())) {
                            returnType = BUILTIN;
                        } else returnType = "variable";
                    }
            }
            return (typeof state.sExprComment == "number") ? COMMENT : returnType;
        },

        indent: function (state) {
            if (state.indentStack == null) return state.indentation;
            return state.indentStack.indent;
        },

        closeBrackets: {pairs: "()[]{}\"\""},
        lineComment: ";;"
    };
});

CodeMirror.defineMIME("text/x-scheme", "scheme");

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

var htmlConfig = {
  autoSelfClosers: {'area': true, 'base': true, 'br': true, 'col': true, 'command': true,
                    'embed': true, 'frame': true, 'hr': true, 'img': true, 'input': true,
                    'keygen': true, 'link': true, 'meta': true, 'param': true, 'source': true,
                    'track': true, 'wbr': true, 'menuitem': true},
  implicitlyClosed: {'dd': true, 'li': true, 'optgroup': true, 'option': true, 'p': true,
                     'rp': true, 'rt': true, 'tbody': true, 'td': true, 'tfoot': true,
                     'th': true, 'tr': true},
  contextGrabbers: {
    'dd': {'dd': true, 'dt': true},
    'dt': {'dd': true, 'dt': true},
    'li': {'li': true},
    'option': {'option': true, 'optgroup': true},
    'optgroup': {'optgroup': true},
    'p': {'address': true, 'article': true, 'aside': true, 'blockquote': true, 'dir': true,
          'div': true, 'dl': true, 'fieldset': true, 'footer': true, 'form': true,
          'h1': true, 'h2': true, 'h3': true, 'h4': true, 'h5': true, 'h6': true,
          'header': true, 'hgroup': true, 'hr': true, 'menu': true, 'nav': true, 'ol': true,
          'p': true, 'pre': true, 'section': true, 'table': true, 'ul': true},
    'rp': {'rp': true, 'rt': true},
    'rt': {'rp': true, 'rt': true},
    'tbody': {'tbody': true, 'tfoot': true},
    'td': {'td': true, 'th': true},
    'tfoot': {'tbody': true},
    'th': {'td': true, 'th': true},
    'thead': {'tbody': true, 'tfoot': true},
    'tr': {'tr': true}
  },
  doNotIndent: {"pre": true},
  allowUnquoted: true,
  allowMissing: true,
  caseFold: true
}

var xmlConfig = {
  autoSelfClosers: {},
  implicitlyClosed: {},
  contextGrabbers: {},
  doNotIndent: {},
  allowUnquoted: false,
  allowMissing: false,
  caseFold: false
}

CodeMirror.defineMode("xml", function(editorConf, config_) {
  var indentUnit = editorConf.indentUnit
  var config = {}
  var defaults = config_.htmlMode ? htmlConfig : xmlConfig
  for (var prop in defaults) config[prop] = defaults[prop]
  for (var prop in config_) config[prop] = config_[prop]

  // Return variables for tokenizers
  var type, setStyle;

  function inText(stream, state) {
    function chain(parser) {
      state.tokenize = parser;
      return parser(stream, state);
    }

    var ch = stream.next();
    if (ch == "<") {
      if (stream.eat("!")) {
        if (stream.eat("[")) {
          if (stream.match("CDATA[")) return chain(inBlock("atom", "]]>"));
          else return null;
        } else if (stream.match("--")) {
          return chain(inBlock("comment", "-->"));
        } else if (stream.match("DOCTYPE", true, true)) {
          stream.eatWhile(/[\w\._\-]/);
          return chain(doctype(1));
        } else {
          return null;
        }
      } else if (stream.eat("?")) {
        stream.eatWhile(/[\w\._\-]/);
        state.tokenize = inBlock("meta", "?>");
        return "meta";
      } else {
        type = stream.eat("/") ? "closeTag" : "openTag";
        state.tokenize = inTag;
        return "tag bracket";
      }
    } else if (ch == "&") {
      var ok;
      if (stream.eat("#")) {
        if (stream.eat("x")) {
          ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
        } else {
          ok = stream.eatWhile(/[\d]/) && stream.eat(";");
        }
      } else {
        ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
      }
      return ok ? "atom" : "error";
    } else {
      stream.eatWhile(/[^&<]/);
      return null;
    }
  }
  inText.isInText = true;

  function inTag(stream, state) {
    var ch = stream.next();
    if (ch == ">" || (ch == "/" && stream.eat(">"))) {
      state.tokenize = inText;
      type = ch == ">" ? "endTag" : "selfcloseTag";
      return "tag bracket";
    } else if (ch == "=") {
      type = "equals";
      return null;
    } else if (ch == "<") {
      state.tokenize = inText;
      state.state = baseState;
      state.tagName = state.tagStart = null;
      var next = state.tokenize(stream, state);
      return next ? next + " tag error" : "tag error";
    } else if (/[\'\"]/.test(ch)) {
      state.tokenize = inAttribute(ch);
      state.stringStartCol = stream.column();
      return state.tokenize(stream, state);
    } else {
      stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);
      return "word";
    }
  }

  function inAttribute(quote) {
    var closure = function(stream, state) {
      while (!stream.eol()) {
        if (stream.next() == quote) {
          state.tokenize = inTag;
          break;
        }
      }
      return "string";
    };
    closure.isInAttribute = true;
    return closure;
  }

  function inBlock(style, terminator) {
    return function(stream, state) {
      while (!stream.eol()) {
        if (stream.match(terminator)) {
          state.tokenize = inText;
          break;
        }
        stream.next();
      }
      return style;
    };
  }
  function doctype(depth) {
    return function(stream, state) {
      var ch;
      while ((ch = stream.next()) != null) {
        if (ch == "<") {
          state.tokenize = doctype(depth + 1);
          return state.tokenize(stream, state);
        } else if (ch == ">") {
          if (depth == 1) {
            state.tokenize = inText;
            break;
          } else {
            state.tokenize = doctype(depth - 1);
            return state.tokenize(stream, state);
          }
        }
      }
      return "meta";
    };
  }

  function Context(state, tagName, startOfLine) {
    this.prev = state.context;
    this.tagName = tagName;
    this.indent = state.indented;
    this.startOfLine = startOfLine;
    if (config.doNotIndent.hasOwnProperty(tagName) || (state.context && state.context.noIndent))
      this.noIndent = true;
  }
  function popContext(state) {
    if (state.context) state.context = state.context.prev;
  }
  function maybePopContext(state, nextTagName) {
    var parentTagName;
    while (true) {
      if (!state.context) {
        return;
      }
      parentTagName = state.context.tagName;
      if (!config.contextGrabbers.hasOwnProperty(parentTagName) ||
          !config.contextGrabbers[parentTagName].hasOwnProperty(nextTagName)) {
        return;
      }
      popContext(state);
    }
  }

  function baseState(type, stream, state) {
    if (type == "openTag") {
      state.tagStart = stream.column();
      return tagNameState;
    } else if (type == "closeTag") {
      return closeTagNameState;
    } else {
      return baseState;
    }
  }
  function tagNameState(type, stream, state) {
    if (type == "word") {
      state.tagName = stream.current();
      setStyle = "tag";
      return attrState;
    } else {
      setStyle = "error";
      return tagNameState;
    }
  }
  function closeTagNameState(type, stream, state) {
    if (type == "word") {
      var tagName = stream.current();
      if (state.context && state.context.tagName != tagName &&
          config.implicitlyClosed.hasOwnProperty(state.context.tagName))
        popContext(state);
      if (state.context && state.context.tagName == tagName) {
        setStyle = "tag";
        return closeState;
      } else {
        setStyle = "tag error";
        return closeStateErr;
      }
    } else {
      setStyle = "error";
      return closeStateErr;
    }
  }

  function closeState(type, _stream, state) {
    if (type != "endTag") {
      setStyle = "error";
      return closeState;
    }
    popContext(state);
    return baseState;
  }
  function closeStateErr(type, stream, state) {
    setStyle = "error";
    return closeState(type, stream, state);
  }

  function attrState(type, _stream, state) {
    if (type == "word") {
      setStyle = "attribute";
      return attrEqState;
    } else if (type == "endTag" || type == "selfcloseTag") {
      var tagName = state.tagName, tagStart = state.tagStart;
      state.tagName = state.tagStart = null;
      if (type == "selfcloseTag" ||
          config.autoSelfClosers.hasOwnProperty(tagName)) {
        maybePopContext(state, tagName);
      } else {
        maybePopContext(state, tagName);
        state.context = new Context(state, tagName, tagStart == state.indented);
      }
      return baseState;
    }
    setStyle = "error";
    return attrState;
  }
  function attrEqState(type, stream, state) {
    if (type == "equals") return attrValueState;
    if (!config.allowMissing) setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrValueState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    if (type == "word" && config.allowUnquoted) {setStyle = "string"; return attrState;}
    setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrContinuedState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    return attrState(type, stream, state);
  }

  return {
    startState: function(baseIndent) {
      var state = {tokenize: inText,
                   state: baseState,
                   indented: baseIndent || 0,
                   tagName: null, tagStart: null,
                   context: null}
      if (baseIndent != null) state.baseIndent = baseIndent
      return state
    },

    token: function(stream, state) {
      if (!state.tagName && stream.sol())
        state.indented = stream.indentation();

      if (stream.eatSpace()) return null;
      type = null;
      var style = state.tokenize(stream, state);
      if ((style || type) && style != "comment") {
        setStyle = null;
        state.state = state.state(type || style, stream, state);
        if (setStyle)
          style = setStyle == "error" ? style + " error" : setStyle;
      }
      return style;
    },

    indent: function(state, textAfter, fullLine) {
      var context = state.context;
      // Indent multi-line strings (e.g. css).
      if (state.tokenize.isInAttribute) {
        if (state.tagStart == state.indented)
          return state.stringStartCol + 1;
        else
          return state.indented + indentUnit;
      }
      if (context && context.noIndent) return CodeMirror.Pass;
      if (state.tokenize != inTag && state.tokenize != inText)
        return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0;
      // Indent the starts of attribute names.
      if (state.tagName) {
        if (config.multilineTagIndentPastTag !== false)
          return state.tagStart + state.tagName.length + 2;
        else
          return state.tagStart + indentUnit * (config.multilineTagIndentFactor || 1);
      }
      if (config.alignCDATA && /<!\[CDATA\[/.test(textAfter)) return 0;
      var tagAfter = textAfter && /^<(\/)?([\w_:\.-]*)/.exec(textAfter);
      if (tagAfter && tagAfter[1]) { // Closing tag spotted
        while (context) {
          if (context.tagName == tagAfter[2]) {
            context = context.prev;
            break;
          } else if (config.implicitlyClosed.hasOwnProperty(context.tagName)) {
            context = context.prev;
          } else {
            break;
          }
        }
      } else if (tagAfter) { // Opening tag spotted
        while (context) {
          var grabbers = config.contextGrabbers[context.tagName];
          if (grabbers && grabbers.hasOwnProperty(tagAfter[2]))
            context = context.prev;
          else
            break;
        }
      }
      while (context && context.prev && !context.startOfLine)
        context = context.prev;
      if (context) return context.indent + indentUnit;
      else return state.baseIndent || 0;
    },

    electricInput: /<\/[\s\w:]+>$/,
    blockCommentStart: "<!--",
    blockCommentEnd: "-->",

    configuration: config.htmlMode ? "html" : "xml",
    helperType: config.htmlMode ? "html" : "xml",

    skipAttribute: function(state) {
      if (state.state == attrValueState)
        state.state = attrState
    }
  };
});

CodeMirror.defineMIME("text/xml", "xml");
CodeMirror.defineMIME("application/xml", "xml");
if (!CodeMirror.mimeModes.hasOwnProperty("text/html"))
  CodeMirror.defineMIME("text/html", {name: "xml", htmlMode: true});

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../xml/xml"), require("../javascript/javascript"), require("../css/css"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../xml/xml", "../javascript/javascript", "../css/css"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var defaultTags = {
    script: [
      ["lang", /(javascript|babel)/i, "javascript"],
      ["type", /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^$/i, "javascript"],
      ["type", /./, "text/plain"],
      [null, null, "javascript"]
    ],
    style:  [
      ["lang", /^css$/i, "css"],
      ["type", /^(text\/)?(x-)?(stylesheet|css)$/i, "css"],
      ["type", /./, "text/plain"],
      [null, null, "css"]
    ]
  };

  function maybeBackup(stream, pat, style) {
    var cur = stream.current(), close = cur.search(pat);
    if (close > -1) {
      stream.backUp(cur.length - close);
    } else if (cur.match(/<\/?$/)) {
      stream.backUp(cur.length);
      if (!stream.match(pat, false)) stream.match(cur);
    }
    return style;
  }

  var attrRegexpCache = {};
  function getAttrRegexp(attr) {
    var regexp = attrRegexpCache[attr];
    if (regexp) return regexp;
    return attrRegexpCache[attr] = new RegExp("\\s+" + attr + "\\s*=\\s*('|\")?([^'\"]+)('|\")?\\s*");
  }

  function getAttrValue(stream, attr) {
    var pos = stream.pos, match;
    while (pos >= 0 && stream.string.charAt(pos) !== "<") pos--;
    if (pos < 0) return pos;
    if (match = stream.string.slice(pos, stream.pos).match(getAttrRegexp(attr)))
      return match[2];
    return "";
  }

  function getTagRegexp(tagName, anchored) {
    return new RegExp((anchored ? "^" : "") + "<\/\s*" + tagName + "\s*>", "i");
  }

  function addTags(from, to) {
    for (var tag in from) {
      var dest = to[tag] || (to[tag] = []);
      var source = from[tag];
      for (var i = source.length - 1; i >= 0; i--)
        dest.unshift(source[i])
    }
  }

  function findMatchingMode(tagInfo, stream) {
    for (var i = 0; i < tagInfo.length; i++) {
      var spec = tagInfo[i];
      if (!spec[0] || spec[1].test(getAttrValue(stream, spec[0]))) return spec[2];
    }
  }

  CodeMirror.defineMode("htmlmixed", function (config, parserConfig) {
    var htmlMode = CodeMirror.getMode(config, {
      name: "xml",
      htmlMode: true,
      multilineTagIndentFactor: parserConfig.multilineTagIndentFactor,
      multilineTagIndentPastTag: parserConfig.multilineTagIndentPastTag
    });

    var tags = {};
    var configTags = parserConfig && parserConfig.tags, configScript = parserConfig && parserConfig.scriptTypes;
    addTags(defaultTags, tags);
    if (configTags) addTags(configTags, tags);
    if (configScript) for (var i = configScript.length - 1; i >= 0; i--)
      tags.script.unshift(["type", configScript[i].matches, configScript[i].mode])

    function html(stream, state) {
      var tagName = state.htmlState.tagName && state.htmlState.tagName.toLowerCase();
      var tagInfo = tagName && tags.hasOwnProperty(tagName) && tags[tagName];

      var style = htmlMode.token(stream, state.htmlState), modeSpec;

      if (tagInfo && /\btag\b/.test(style) && stream.current() === ">" &&
          (modeSpec = findMatchingMode(tagInfo, stream))) {
        var mode = CodeMirror.getMode(config, modeSpec);
        var endTagA = getTagRegexp(tagName, true), endTag = getTagRegexp(tagName, false);
        state.token = function (stream, state) {
          if (stream.match(endTagA, false)) {
            state.token = html;
            state.localState = state.localMode = null;
            return null;
          }
          return maybeBackup(stream, endTag, state.localMode.token(stream, state.localState));
        };
        state.localMode = mode;
        state.localState = CodeMirror.startState(mode, htmlMode.indent(state.htmlState, ""));
      }
      return style;
    };

    return {
      startState: function () {
        var state = htmlMode.startState();
        return {token: html, localMode: null, localState: null, htmlState: state};
      },

      copyState: function (state) {
        var local;
        if (state.localState) {
          local = CodeMirror.copyState(state.localMode, state.localState);
        }
        return {token: state.token, localMode: state.localMode, localState: local,
                htmlState: CodeMirror.copyState(htmlMode, state.htmlState)};
      },

      token: function (stream, state) {
        return state.token(stream, state);
      },

      indent: function (state, textAfter) {
        if (!state.localMode || /^\s*<\//.test(textAfter))
          return htmlMode.indent(state.htmlState, textAfter);
        else if (state.localMode.indent)
          return state.localMode.indent(state.localState, textAfter);
        else
          return CodeMirror.Pass;
      },

      innerMode: function (state) {
        return {state: state.localState || state.htmlState, mode: state.localMode || htmlMode};
      }
    };
  }, "xml", "javascript", "css");

  CodeMirror.defineMIME("text/html", "htmlmixed");
});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("ruby", function(config) {
  function wordObj(words) {
    var o = {};
    for (var i = 0, e = words.length; i < e; ++i) o[words[i]] = true;
    return o;
  }
  var keywords = wordObj([
    "alias", "and", "BEGIN", "begin", "break", "case", "class", "def", "defined?", "do", "else",
    "elsif", "END", "end", "ensure", "false", "for", "if", "in", "module", "next", "not", "or",
    "redo", "rescue", "retry", "return", "self", "super", "then", "true", "undef", "unless",
    "until", "when", "while", "yield", "nil", "raise", "throw", "catch", "fail", "loop", "callcc",
    "caller", "lambda", "proc", "public", "protected", "private", "require", "load",
    "require_relative", "extend", "autoload", "__END__", "__FILE__", "__LINE__", "__dir__"
  ]);
  var indentWords = wordObj(["def", "class", "case", "for", "while", "until", "module", "then",
                             "catch", "loop", "proc", "begin"]);
  var dedentWords = wordObj(["end", "until"]);
  var matching = {"[": "]", "{": "}", "(": ")"};
  var curPunc;

  function chain(newtok, stream, state) {
    state.tokenize.push(newtok);
    return newtok(stream, state);
  }

  function tokenBase(stream, state) {
    if (stream.sol() && stream.match("=begin") && stream.eol()) {
      state.tokenize.push(readBlockComment);
      return "comment";
    }
    if (stream.eatSpace()) return null;
    var ch = stream.next(), m;
    if (ch == "`" || ch == "'" || ch == '"') {
      return chain(readQuoted(ch, "string", ch == '"' || ch == "`"), stream, state);
    } else if (ch == "/") {
      var currentIndex = stream.current().length;
      if (stream.skipTo("/")) {
        var search_till = stream.current().length;
        stream.backUp(stream.current().length - currentIndex);
        var balance = 0;  // balance brackets
        while (stream.current().length < search_till) {
          var chchr = stream.next();
          if (chchr == "(") balance += 1;
          else if (chchr == ")") balance -= 1;
          if (balance < 0) break;
        }
        stream.backUp(stream.current().length - currentIndex);
        if (balance == 0)
          return chain(readQuoted(ch, "string-2", true), stream, state);
      }
      return "operator";
    } else if (ch == "%") {
      var style = "string", embed = true;
      if (stream.eat("s")) style = "atom";
      else if (stream.eat(/[WQ]/)) style = "string";
      else if (stream.eat(/[r]/)) style = "string-2";
      else if (stream.eat(/[wxq]/)) { style = "string"; embed = false; }
      var delim = stream.eat(/[^\w\s=]/);
      if (!delim) return "operator";
      if (matching.propertyIsEnumerable(delim)) delim = matching[delim];
      return chain(readQuoted(delim, style, embed, true), stream, state);
    } else if (ch == "#") {
      stream.skipToEnd();
      return "comment";
    } else if (ch == "<" && (m = stream.match(/^<-?[\`\"\']?([a-zA-Z_?]\w*)[\`\"\']?(?:;|$)/))) {
      return chain(readHereDoc(m[1]), stream, state);
    } else if (ch == "0") {
      if (stream.eat("x")) stream.eatWhile(/[\da-fA-F]/);
      else if (stream.eat("b")) stream.eatWhile(/[01]/);
      else stream.eatWhile(/[0-7]/);
      return "number";
    } else if (/\d/.test(ch)) {
      stream.match(/^[\d_]*(?:\.[\d_]+)?(?:[eE][+\-]?[\d_]+)?/);
      return "number";
    } else if (ch == "?") {
      while (stream.match(/^\\[CM]-/)) {}
      if (stream.eat("\\")) stream.eatWhile(/\w/);
      else stream.next();
      return "string";
    } else if (ch == ":") {
      if (stream.eat("'")) return chain(readQuoted("'", "atom", false), stream, state);
      if (stream.eat('"')) return chain(readQuoted('"', "atom", true), stream, state);

      // :> :>> :< :<< are valid symbols
      if (stream.eat(/[\<\>]/)) {
        stream.eat(/[\<\>]/);
        return "atom";
      }

      // :+ :- :/ :* :| :& :! are valid symbols
      if (stream.eat(/[\+\-\*\/\&\|\:\!]/)) {
        return "atom";
      }

      // Symbols can't start by a digit
      if (stream.eat(/[a-zA-Z$@_\xa1-\uffff]/)) {
        stream.eatWhile(/[\w$\xa1-\uffff]/);
        // Only one ? ! = is allowed and only as the last character
        stream.eat(/[\?\!\=]/);
        return "atom";
      }
      return "operator";
    } else if (ch == "@" && stream.match(/^@?[a-zA-Z_\xa1-\uffff]/)) {
      stream.eat("@");
      stream.eatWhile(/[\w\xa1-\uffff]/);
      return "variable-2";
    } else if (ch == "$") {
      if (stream.eat(/[a-zA-Z_]/)) {
        stream.eatWhile(/[\w]/);
      } else if (stream.eat(/\d/)) {
        stream.eat(/\d/);
      } else {
        stream.next(); // Must be a special global like $: or $!
      }
      return "variable-3";
    } else if (/[a-zA-Z_\xa1-\uffff]/.test(ch)) {
      stream.eatWhile(/[\w\xa1-\uffff]/);
      stream.eat(/[\?\!]/);
      if (stream.eat(":")) return "atom";
      return "ident";
    } else if (ch == "|" && (state.varList || state.lastTok == "{" || state.lastTok == "do")) {
      curPunc = "|";
      return null;
    } else if (/[\(\)\[\]{}\\;]/.test(ch)) {
      curPunc = ch;
      return null;
    } else if (ch == "-" && stream.eat(">")) {
      return "arrow";
    } else if (/[=+\-\/*:\.^%<>~|]/.test(ch)) {
      var more = stream.eatWhile(/[=+\-\/*:\.^%<>~|]/);
      if (ch == "." && !more) curPunc = ".";
      return "operator";
    } else {
      return null;
    }
  }

  function tokenBaseUntilBrace(depth) {
    if (!depth) depth = 1;
    return function(stream, state) {
      if (stream.peek() == "}") {
        if (depth == 1) {
          state.tokenize.pop();
          return state.tokenize[state.tokenize.length-1](stream, state);
        } else {
          state.tokenize[state.tokenize.length - 1] = tokenBaseUntilBrace(depth - 1);
        }
      } else if (stream.peek() == "{") {
        state.tokenize[state.tokenize.length - 1] = tokenBaseUntilBrace(depth + 1);
      }
      return tokenBase(stream, state);
    };
  }
  function tokenBaseOnce() {
    var alreadyCalled = false;
    return function(stream, state) {
      if (alreadyCalled) {
        state.tokenize.pop();
        return state.tokenize[state.tokenize.length-1](stream, state);
      }
      alreadyCalled = true;
      return tokenBase(stream, state);
    };
  }
  function readQuoted(quote, style, embed, unescaped) {
    return function(stream, state) {
      var escaped = false, ch;

      if (state.context.type === 'read-quoted-paused') {
        state.context = state.context.prev;
        stream.eat("}");
      }

      while ((ch = stream.next()) != null) {
        if (ch == quote && (unescaped || !escaped)) {
          state.tokenize.pop();
          break;
        }
        if (embed && ch == "#" && !escaped) {
          if (stream.eat("{")) {
            if (quote == "}") {
              state.context = {prev: state.context, type: 'read-quoted-paused'};
            }
            state.tokenize.push(tokenBaseUntilBrace());
            break;
          } else if (/[@\$]/.test(stream.peek())) {
            state.tokenize.push(tokenBaseOnce());
            break;
          }
        }
        escaped = !escaped && ch == "\\";
      }
      return style;
    };
  }
  function readHereDoc(phrase) {
    return function(stream, state) {
      if (stream.match(phrase)) state.tokenize.pop();
      else stream.skipToEnd();
      return "string";
    };
  }
  function readBlockComment(stream, state) {
    if (stream.sol() && stream.match("=end") && stream.eol())
      state.tokenize.pop();
    stream.skipToEnd();
    return "comment";
  }

  return {
    startState: function() {
      return {tokenize: [tokenBase],
              indented: 0,
              context: {type: "top", indented: -config.indentUnit},
              continuedLine: false,
              lastTok: null,
              varList: false};
    },

    token: function(stream, state) {
      curPunc = null;
      if (stream.sol()) state.indented = stream.indentation();
      var style = state.tokenize[state.tokenize.length-1](stream, state), kwtype;
      var thisTok = curPunc;
      if (style == "ident") {
        var word = stream.current();
        style = state.lastTok == "." ? "property"
          : keywords.propertyIsEnumerable(stream.current()) ? "keyword"
          : /^[A-Z]/.test(word) ? "tag"
          : (state.lastTok == "def" || state.lastTok == "class" || state.varList) ? "def"
          : "variable";
        if (style == "keyword") {
          thisTok = word;
          if (indentWords.propertyIsEnumerable(word)) kwtype = "indent";
          else if (dedentWords.propertyIsEnumerable(word)) kwtype = "dedent";
          else if ((word == "if" || word == "unless") && stream.column() == stream.indentation())
            kwtype = "indent";
          else if (word == "do" && state.context.indented < state.indented)
            kwtype = "indent";
        }
      }
      if (curPunc || (style && style != "comment")) state.lastTok = thisTok;
      if (curPunc == "|") state.varList = !state.varList;

      if (kwtype == "indent" || /[\(\[\{]/.test(curPunc))
        state.context = {prev: state.context, type: curPunc || style, indented: state.indented};
      else if ((kwtype == "dedent" || /[\)\]\}]/.test(curPunc)) && state.context.prev)
        state.context = state.context.prev;

      if (stream.eol())
        state.continuedLine = (curPunc == "\\" || style == "operator");
      return style;
    },

    indent: function(state, textAfter) {
      if (state.tokenize[state.tokenize.length-1] != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0);
      var ct = state.context;
      var closing = ct.type == matching[firstChar] ||
        ct.type == "keyword" && /^(?:end|until|else|elsif|when|rescue)\b/.test(textAfter);
      return ct.indented + (closing ? 0 : config.indentUnit) +
        (state.continuedLine ? config.indentUnit : 0);
    },

    electricInput: /^\s*(?:end|rescue|\})$/,
    lineComment: "#"
  };
});

CodeMirror.defineMIME("text/x-ruby", "ruby");

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("css", function(config, parserConfig) {
  var inline = parserConfig.inline
  if (!parserConfig.propertyKeywords) parserConfig = CodeMirror.resolveMode("text/css");

  var indentUnit = config.indentUnit,
      tokenHooks = parserConfig.tokenHooks,
      documentTypes = parserConfig.documentTypes || {},
      mediaTypes = parserConfig.mediaTypes || {},
      mediaFeatures = parserConfig.mediaFeatures || {},
      mediaValueKeywords = parserConfig.mediaValueKeywords || {},
      propertyKeywords = parserConfig.propertyKeywords || {},
      nonStandardPropertyKeywords = parserConfig.nonStandardPropertyKeywords || {},
      fontProperties = parserConfig.fontProperties || {},
      counterDescriptors = parserConfig.counterDescriptors || {},
      colorKeywords = parserConfig.colorKeywords || {},
      valueKeywords = parserConfig.valueKeywords || {},
      allowNested = parserConfig.allowNested,
      supportsAtComponent = parserConfig.supportsAtComponent === true;

  var type, override;
  function ret(style, tp) { type = tp; return style; }

  // Tokenizers

  function tokenBase(stream, state) {
    var ch = stream.next();
    if (tokenHooks[ch]) {
      var result = tokenHooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (ch == "@") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("def", stream.current());
    } else if (ch == "=" || (ch == "~" || ch == "|") && stream.eat("=")) {
      return ret(null, "compare");
    } else if (ch == "\"" || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "#") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("atom", "hash");
    } else if (ch == "!") {
      stream.match(/^\s*\w*/);
      return ret("keyword", "important");
    } else if (/\d/.test(ch) || ch == "." && stream.eat(/\d/)) {
      stream.eatWhile(/[\w.%]/);
      return ret("number", "unit");
    } else if (ch === "-") {
      if (/[\d.]/.test(stream.peek())) {
        stream.eatWhile(/[\w.%]/);
        return ret("number", "unit");
      } else if (stream.match(/^-[\w\\\-]+/)) {
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ret("variable-2", "variable-definition");
        return ret("variable-2", "variable");
      } else if (stream.match(/^\w+-/)) {
        return ret("meta", "meta");
      }
    } else if (/[,+>*\/]/.test(ch)) {
      return ret(null, "select-op");
    } else if (ch == "." && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
      return ret("qualifier", "qualifier");
    } else if (/[:;{}\[\]\(\)]/.test(ch)) {
      return ret(null, ch);
    } else if ((ch == "u" && stream.match(/rl(-prefix)?\(/)) ||
               (ch == "d" && stream.match("omain(")) ||
               (ch == "r" && stream.match("egexp("))) {
      stream.backUp(1);
      state.tokenize = tokenParenthesized;
      return ret("property", "word");
    } else if (/[\w\\\-]/.test(ch)) {
      stream.eatWhile(/[\w\\\-]/);
      return ret("property", "word");
    } else {
      return ret(null, null);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          if (quote == ")") stream.backUp(1);
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      if (ch == quote || !escaped && quote != ")") state.tokenize = null;
      return ret("string", "string");
    };
  }

  function tokenParenthesized(stream, state) {
    stream.next(); // Must be '('
    if (!stream.match(/\s*[\"\')]/, false))
      state.tokenize = tokenString(")");
    else
      state.tokenize = null;
    return ret(null, "(");
  }

  // Context management

  function Context(type, indent, prev) {
    this.type = type;
    this.indent = indent;
    this.prev = prev;
  }

  function pushContext(state, stream, type, indent) {
    state.context = new Context(type, stream.indentation() + (indent === false ? 0 : indentUnit), state.context);
    return type;
  }

  function popContext(state) {
    if (state.context.prev)
      state.context = state.context.prev;
    return state.context.type;
  }

  function pass(type, stream, state) {
    return states[state.context.type](type, stream, state);
  }
  function popAndPass(type, stream, state, n) {
    for (var i = n || 1; i > 0; i--)
      state.context = state.context.prev;
    return pass(type, stream, state);
  }

  // Parser

  function wordAsValue(stream) {
    var word = stream.current().toLowerCase();
    if (valueKeywords.hasOwnProperty(word))
      override = "atom";
    else if (colorKeywords.hasOwnProperty(word))
      override = "keyword";
    else
      override = "variable";
  }

  var states = {};

  states.top = function(type, stream, state) {
    if (type == "{") {
      return pushContext(state, stream, "block");
    } else if (type == "}" && state.context.prev) {
      return popContext(state);
    } else if (supportsAtComponent && /@component/.test(type)) {
      return pushContext(state, stream, "atComponentBlock");
    } else if (/^@(-moz-)?document$/.test(type)) {
      return pushContext(state, stream, "documentTypes");
    } else if (/^@(media|supports|(-moz-)?document|import)$/.test(type)) {
      return pushContext(state, stream, "atBlock");
    } else if (/^@(font-face|counter-style)/.test(type)) {
      state.stateArg = type;
      return "restricted_atBlock_before";
    } else if (/^@(-(moz|ms|o|webkit)-)?keyframes$/.test(type)) {
      return "keyframes";
    } else if (type && type.charAt(0) == "@") {
      return pushContext(state, stream, "at");
    } else if (type == "hash") {
      override = "builtin";
    } else if (type == "word") {
      override = "tag";
    } else if (type == "variable-definition") {
      return "maybeprop";
    } else if (type == "interpolation") {
      return pushContext(state, stream, "interpolation");
    } else if (type == ":") {
      return "pseudo";
    } else if (allowNested && type == "(") {
      return pushContext(state, stream, "parens");
    }
    return state.context.type;
  };

  states.block = function(type, stream, state) {
    if (type == "word") {
      var word = stream.current().toLowerCase();
      if (propertyKeywords.hasOwnProperty(word)) {
        override = "property";
        return "maybeprop";
      } else if (nonStandardPropertyKeywords.hasOwnProperty(word)) {
        override = "string-2";
        return "maybeprop";
      } else if (allowNested) {
        override = stream.match(/^\s*:(?:\s|$)/, false) ? "property" : "tag";
        return "block";
      } else {
        override += " error";
        return "maybeprop";
      }
    } else if (type == "meta") {
      return "block";
    } else if (!allowNested && (type == "hash" || type == "qualifier")) {
      override = "error";
      return "block";
    } else {
      return states.top(type, stream, state);
    }
  };

  states.maybeprop = function(type, stream, state) {
    if (type == ":") return pushContext(state, stream, "prop");
    return pass(type, stream, state);
  };

  states.prop = function(type, stream, state) {
    if (type == ";") return popContext(state);
    if (type == "{" && allowNested) return pushContext(state, stream, "propBlock");
    if (type == "}" || type == "{") return popAndPass(type, stream, state);
    if (type == "(") return pushContext(state, stream, "parens");

    if (type == "hash" && !/^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(stream.current())) {
      override += " error";
    } else if (type == "word") {
      wordAsValue(stream);
    } else if (type == "interpolation") {
      return pushContext(state, stream, "interpolation");
    }
    return "prop";
  };

  states.propBlock = function(type, _stream, state) {
    if (type == "}") return popContext(state);
    if (type == "word") { override = "property"; return "maybeprop"; }
    return state.context.type;
  };

  states.parens = function(type, stream, state) {
    if (type == "{" || type == "}") return popAndPass(type, stream, state);
    if (type == ")") return popContext(state);
    if (type == "(") return pushContext(state, stream, "parens");
    if (type == "interpolation") return pushContext(state, stream, "interpolation");
    if (type == "word") wordAsValue(stream);
    return "parens";
  };

  states.pseudo = function(type, stream, state) {
    if (type == "word") {
      override = "variable-3";
      return state.context.type;
    }
    return pass(type, stream, state);
  };

  states.documentTypes = function(type, stream, state) {
    if (type == "word" && documentTypes.hasOwnProperty(stream.current())) {
      override = "tag";
      return state.context.type;
    } else {
      return states.atBlock(type, stream, state);
    }
  };

  states.atBlock = function(type, stream, state) {
    if (type == "(") return pushContext(state, stream, "atBlock_parens");
    if (type == "}" || type == ";") return popAndPass(type, stream, state);
    if (type == "{") return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top");

    if (type == "interpolation") return pushContext(state, stream, "interpolation");

    if (type == "word") {
      var word = stream.current().toLowerCase();
      if (word == "only" || word == "not" || word == "and" || word == "or")
        override = "keyword";
      else if (mediaTypes.hasOwnProperty(word))
        override = "attribute";
      else if (mediaFeatures.hasOwnProperty(word))
        override = "property";
      else if (mediaValueKeywords.hasOwnProperty(word))
        override = "keyword";
      else if (propertyKeywords.hasOwnProperty(word))
        override = "property";
      else if (nonStandardPropertyKeywords.hasOwnProperty(word))
        override = "string-2";
      else if (valueKeywords.hasOwnProperty(word))
        override = "atom";
      else if (colorKeywords.hasOwnProperty(word))
        override = "keyword";
      else
        override = "error";
    }
    return state.context.type;
  };

  states.atComponentBlock = function(type, stream, state) {
    if (type == "}")
      return popAndPass(type, stream, state);
    if (type == "{")
      return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top", false);
    if (type == "word")
      override = "error";
    return state.context.type;
  };

  states.atBlock_parens = function(type, stream, state) {
    if (type == ")") return popContext(state);
    if (type == "{" || type == "}") return popAndPass(type, stream, state, 2);
    return states.atBlock(type, stream, state);
  };

  states.restricted_atBlock_before = function(type, stream, state) {
    if (type == "{")
      return pushContext(state, stream, "restricted_atBlock");
    if (type == "word" && state.stateArg == "@counter-style") {
      override = "variable";
      return "restricted_atBlock_before";
    }
    return pass(type, stream, state);
  };

  states.restricted_atBlock = function(type, stream, state) {
    if (type == "}") {
      state.stateArg = null;
      return popContext(state);
    }
    if (type == "word") {
      if ((state.stateArg == "@font-face" && !fontProperties.hasOwnProperty(stream.current().toLowerCase())) ||
          (state.stateArg == "@counter-style" && !counterDescriptors.hasOwnProperty(stream.current().toLowerCase())))
        override = "error";
      else
        override = "property";
      return "maybeprop";
    }
    return "restricted_atBlock";
  };

  states.keyframes = function(type, stream, state) {
    if (type == "word") { override = "variable"; return "keyframes"; }
    if (type == "{") return pushContext(state, stream, "top");
    return pass(type, stream, state);
  };

  states.at = function(type, stream, state) {
    if (type == ";") return popContext(state);
    if (type == "{" || type == "}") return popAndPass(type, stream, state);
    if (type == "word") override = "tag";
    else if (type == "hash") override = "builtin";
    return "at";
  };

  states.interpolation = function(type, stream, state) {
    if (type == "}") return popContext(state);
    if (type == "{" || type == ";") return popAndPass(type, stream, state);
    if (type == "word") override = "variable";
    else if (type != "variable" && type != "(" && type != ")") override = "error";
    return "interpolation";
  };

  return {
    startState: function(base) {
      return {tokenize: null,
              state: inline ? "block" : "top",
              stateArg: null,
              context: new Context(inline ? "block" : "top", base || 0, null)};
    },

    token: function(stream, state) {
      if (!state.tokenize && stream.eatSpace()) return null;
      var style = (state.tokenize || tokenBase)(stream, state);
      if (style && typeof style == "object") {
        type = style[1];
        style = style[0];
      }
      override = style;
      state.state = states[state.state](type, stream, state);
      return override;
    },

    indent: function(state, textAfter) {
      var cx = state.context, ch = textAfter && textAfter.charAt(0);
      var indent = cx.indent;
      if (cx.type == "prop" && (ch == "}" || ch == ")")) cx = cx.prev;
      if (cx.prev) {
        if (ch == "}" && (cx.type == "block" || cx.type == "top" ||
                          cx.type == "interpolation" || cx.type == "restricted_atBlock")) {
          // Resume indentation from parent context.
          cx = cx.prev;
          indent = cx.indent;
        } else if (ch == ")" && (cx.type == "parens" || cx.type == "atBlock_parens") ||
            ch == "{" && (cx.type == "at" || cx.type == "atBlock")) {
          // Dedent relative to current context.
          indent = Math.max(0, cx.indent - indentUnit);
          cx = cx.prev;
        }
      }
      return indent;
    },

    electricChars: "}",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    fold: "brace"
  };
});

  function keySet(array) {
    var keys = {};
    for (var i = 0; i < array.length; ++i) {
      keys[array[i]] = true;
    }
    return keys;
  }

  var documentTypes_ = [
    "domain", "regexp", "url", "url-prefix"
  ], documentTypes = keySet(documentTypes_);

  var mediaTypes_ = [
    "all", "aural", "braille", "handheld", "print", "projection", "screen",
    "tty", "tv", "embossed"
  ], mediaTypes = keySet(mediaTypes_);

  var mediaFeatures_ = [
    "width", "min-width", "max-width", "height", "min-height", "max-height",
    "device-width", "min-device-width", "max-device-width", "device-height",
    "min-device-height", "max-device-height", "aspect-ratio",
    "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio",
    "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color",
    "max-color", "color-index", "min-color-index", "max-color-index",
    "monochrome", "min-monochrome", "max-monochrome", "resolution",
    "min-resolution", "max-resolution", "scan", "grid", "orientation",
    "device-pixel-ratio", "min-device-pixel-ratio", "max-device-pixel-ratio",
    "pointer", "any-pointer", "hover", "any-hover"
  ], mediaFeatures = keySet(mediaFeatures_);

  var mediaValueKeywords_ = [
    "landscape", "portrait", "none", "coarse", "fine", "on-demand", "hover",
    "interlace", "progressive"
  ], mediaValueKeywords = keySet(mediaValueKeywords_);

  var propertyKeywords_ = [
    "align-content", "align-items", "align-self", "alignment-adjust",
    "alignment-baseline", "anchor-point", "animation", "animation-delay",
    "animation-direction", "animation-duration", "animation-fill-mode",
    "animation-iteration-count", "animation-name", "animation-play-state",
    "animation-timing-function", "appearance", "azimuth", "backface-visibility",
    "background", "background-attachment", "background-blend-mode", "background-clip",
    "background-color", "background-image", "background-origin", "background-position",
    "background-repeat", "background-size", "baseline-shift", "binding",
    "bleed", "bookmark-label", "bookmark-level", "bookmark-state",
    "bookmark-target", "border", "border-bottom", "border-bottom-color",
    "border-bottom-left-radius", "border-bottom-right-radius",
    "border-bottom-style", "border-bottom-width", "border-collapse",
    "border-color", "border-image", "border-image-outset",
    "border-image-repeat", "border-image-slice", "border-image-source",
    "border-image-width", "border-left", "border-left-color",
    "border-left-style", "border-left-width", "border-radius", "border-right",
    "border-right-color", "border-right-style", "border-right-width",
    "border-spacing", "border-style", "border-top", "border-top-color",
    "border-top-left-radius", "border-top-right-radius", "border-top-style",
    "border-top-width", "border-width", "bottom", "box-decoration-break",
    "box-shadow", "box-sizing", "break-after", "break-before", "break-inside",
    "caption-side", "clear", "clip", "color", "color-profile", "column-count",
    "column-fill", "column-gap", "column-rule", "column-rule-color",
    "column-rule-style", "column-rule-width", "column-span", "column-width",
    "columns", "content", "counter-increment", "counter-reset", "crop", "cue",
    "cue-after", "cue-before", "cursor", "direction", "display",
    "dominant-baseline", "drop-initial-after-adjust",
    "drop-initial-after-align", "drop-initial-before-adjust",
    "drop-initial-before-align", "drop-initial-size", "drop-initial-value",
    "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis",
    "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap",
    "float", "float-offset", "flow-from", "flow-into", "font", "font-feature-settings",
    "font-family", "font-kerning", "font-language-override", "font-size", "font-size-adjust",
    "font-stretch", "font-style", "font-synthesis", "font-variant",
    "font-variant-alternates", "font-variant-caps", "font-variant-east-asian",
    "font-variant-ligatures", "font-variant-numeric", "font-variant-position",
    "font-weight", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow",
    "grid-auto-position", "grid-auto-rows", "grid-column", "grid-column-end",
    "grid-column-start", "grid-row", "grid-row-end", "grid-row-start",
    "grid-template", "grid-template-areas", "grid-template-columns",
    "grid-template-rows", "hanging-punctuation", "height", "hyphens",
    "icon", "image-orientation", "image-rendering", "image-resolution",
    "inline-box-align", "justify-content", "left", "letter-spacing",
    "line-break", "line-height", "line-stacking", "line-stacking-ruby",
    "line-stacking-shift", "line-stacking-strategy", "list-style",
    "list-style-image", "list-style-position", "list-style-type", "margin",
    "margin-bottom", "margin-left", "margin-right", "margin-top",
    "marker-offset", "marks", "marquee-direction", "marquee-loop",
    "marquee-play-count", "marquee-speed", "marquee-style", "max-height",
    "max-width", "min-height", "min-width", "move-to", "nav-down", "nav-index",
    "nav-left", "nav-right", "nav-up", "object-fit", "object-position",
    "opacity", "order", "orphans", "outline",
    "outline-color", "outline-offset", "outline-style", "outline-width",
    "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y",
    "padding", "padding-bottom", "padding-left", "padding-right", "padding-top",
    "page", "page-break-after", "page-break-before", "page-break-inside",
    "page-policy", "pause", "pause-after", "pause-before", "perspective",
    "perspective-origin", "pitch", "pitch-range", "play-during", "position",
    "presentation-level", "punctuation-trim", "quotes", "region-break-after",
    "region-break-before", "region-break-inside", "region-fragment",
    "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness",
    "right", "rotation", "rotation-point", "ruby-align", "ruby-overhang",
    "ruby-position", "ruby-span", "shape-image-threshold", "shape-inside", "shape-margin",
    "shape-outside", "size", "speak", "speak-as", "speak-header",
    "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set",
    "tab-size", "table-layout", "target", "target-name", "target-new",
    "target-position", "text-align", "text-align-last", "text-decoration",
    "text-decoration-color", "text-decoration-line", "text-decoration-skip",
    "text-decoration-style", "text-emphasis", "text-emphasis-color",
    "text-emphasis-position", "text-emphasis-style", "text-height",
    "text-indent", "text-justify", "text-outline", "text-overflow", "text-shadow",
    "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position",
    "text-wrap", "top", "transform", "transform-origin", "transform-style",
    "transition", "transition-delay", "transition-duration",
    "transition-property", "transition-timing-function", "unicode-bidi",
    "vertical-align", "visibility", "voice-balance", "voice-duration",
    "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress",
    "voice-volume", "volume", "white-space", "widows", "width", "word-break",
    "word-spacing", "word-wrap", "z-index",
    // SVG-specific
    "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color",
    "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events",
    "color-interpolation", "color-interpolation-filters",
    "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering",
    "marker", "marker-end", "marker-mid", "marker-start", "shape-rendering", "stroke",
    "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin",
    "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering",
    "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal",
    "glyph-orientation-vertical", "text-anchor", "writing-mode"
  ], propertyKeywords = keySet(propertyKeywords_);

  var nonStandardPropertyKeywords_ = [
    "scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color",
    "scrollbar-face-color", "scrollbar-highlight-color", "scrollbar-shadow-color",
    "scrollbar-3d-light-color", "scrollbar-track-color", "shape-inside",
    "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button",
    "searchfield-results-decoration", "zoom"
  ], nonStandardPropertyKeywords = keySet(nonStandardPropertyKeywords_);

  var fontProperties_ = [
    "font-family", "src", "unicode-range", "font-variant", "font-feature-settings",
    "font-stretch", "font-weight", "font-style"
  ], fontProperties = keySet(fontProperties_);

  var counterDescriptors_ = [
    "additive-symbols", "fallback", "negative", "pad", "prefix", "range",
    "speak-as", "suffix", "symbols", "system"
  ], counterDescriptors = keySet(counterDescriptors_);

  var colorKeywords_ = [
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
    "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
    "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue",
    "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod",
    "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen",
    "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
    "darkslateblue", "darkslategray", "darkturquoise", "darkviolet",
    "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick",
    "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite",
    "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew",
    "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender",
    "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral",
    "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink",
    "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
    "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta",
    "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
    "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
    "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
    "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered",
    "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred",
    "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue",
    "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown",
    "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue",
    "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan",
    "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
    "whitesmoke", "yellow", "yellowgreen"
  ], colorKeywords = keySet(colorKeywords_);

  var valueKeywords_ = [
    "above", "absolute", "activeborder", "additive", "activecaption", "afar",
    "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate",
    "always", "amharic", "amharic-abegede", "antialiased", "appworkspace",
    "arabic-indic", "armenian", "asterisks", "attr", "auto", "avoid", "avoid-column", "avoid-page",
    "avoid-region", "background", "backwards", "baseline", "below", "bidi-override", "binary",
    "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box",
    "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "button-bevel",
    "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian",
    "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret",
    "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch",
    "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote",
    "col-resize", "collapse", "color", "color-burn", "color-dodge", "column", "column-reverse",
    "compact", "condensed", "contain", "content",
    "content-box", "context-menu", "continuous", "copy", "counter", "counters", "cover", "crop",
    "cross", "crosshair", "currentcolor", "cursive", "cyclic", "darken", "dashed", "decimal",
    "decimal-leading-zero", "default", "default-button", "destination-atop",
    "destination-in", "destination-out", "destination-over", "devanagari", "difference",
    "disc", "discard", "disclosure-closed", "disclosure-open", "document",
    "dot-dash", "dot-dot-dash",
    "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out",
    "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede",
    "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er",
    "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er",
    "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et",
    "ethiopic-halehame-gez", "ethiopic-halehame-om-et",
    "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et",
    "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig",
    "ethiopic-numeric", "ew-resize", "exclusion", "expanded", "extends", "extra-condensed",
    "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "flex", "flex-end", "flex-start", "footnotes",
    "forwards", "from", "geometricPrecision", "georgian", "graytext", "groove",
    "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hard-light", "hebrew",
    "help", "hidden", "hide", "higher", "highlight", "highlighttext",
    "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "hue", "icon", "ignore",
    "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite",
    "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis",
    "inline-block", "inline-flex", "inline-table", "inset", "inside", "intrinsic", "invert",
    "italic", "japanese-formal", "japanese-informal", "justify", "kannada",
    "katakana", "katakana-iroha", "keep-all", "khmer",
    "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal",
    "landscape", "lao", "large", "larger", "left", "level", "lighter", "lighten",
    "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem",
    "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian",
    "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian",
    "lower-roman", "lowercase", "ltr", "luminosity", "malayalam", "match", "matrix", "matrix3d",
    "media-controls-background", "media-current-time-display",
    "media-fullscreen-button", "media-mute-button", "media-play-button",
    "media-return-to-realtime-button", "media-rewind-button",
    "media-seek-back-button", "media-seek-forward-button", "media-slider",
    "media-sliderthumb", "media-time-remaining-display", "media-volume-slider",
    "media-volume-slider-container", "media-volume-sliderthumb", "medium",
    "menu", "menulist", "menulist-button", "menulist-text",
    "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic",
    "mix", "mongolian", "monospace", "move", "multiple", "multiply", "myanmar", "n-resize",
    "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop",
    "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap",
    "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "open-quote",
    "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset",
    "outside", "outside-shape", "overlay", "overline", "padding", "padding-box",
    "painted", "page", "paused", "persian", "perspective", "plus-darker", "plus-lighter",
    "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d",
    "progress", "push-button", "radial-gradient", "radio", "read-only",
    "read-write", "read-write-plaintext-only", "rectangle", "region",
    "relative", "repeat", "repeating-linear-gradient",
    "repeating-radial-gradient", "repeat-x", "repeat-y", "reset", "reverse",
    "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY",
    "rotateZ", "round", "row", "row-resize", "row-reverse", "rtl", "run-in", "running",
    "s-resize", "sans-serif", "saturation", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "screen",
    "scroll", "scrollbar", "se-resize", "searchfield",
    "searchfield-cancel-button", "searchfield-decoration",
    "searchfield-results-button", "searchfield-results-decoration",
    "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama",
    "simp-chinese-formal", "simp-chinese-informal", "single",
    "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal",
    "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow",
    "small", "small-caps", "small-caption", "smaller", "soft-light", "solid", "somali",
    "source-atop", "source-in", "source-out", "source-over", "space", "space-around", "space-between", "spell-out", "square",
    "square-button", "start", "static", "status-bar", "stretch", "stroke", "sub",
    "subpixel-antialiased", "super", "sw-resize", "symbolic", "symbols", "table",
    "table-caption", "table-cell", "table-column", "table-column-group",
    "table-footer-group", "table-header-group", "table-row", "table-row-group",
    "tamil",
    "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai",
    "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight",
    "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er",
    "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top",
    "trad-chinese-formal", "trad-chinese-informal",
    "translate", "translate3d", "translateX", "translateY", "translateZ",
    "transparent", "ultra-condensed", "ultra-expanded", "underline", "up",
    "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal",
    "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url",
    "var", "vertical", "vertical-text", "visible", "visibleFill", "visiblePainted",
    "visibleStroke", "visual", "w-resize", "wait", "wave", "wider",
    "window", "windowframe", "windowtext", "words", "wrap", "wrap-reverse", "x-large", "x-small", "xor",
    "xx-large", "xx-small"
  ], valueKeywords = keySet(valueKeywords_);

  var allWords = documentTypes_.concat(mediaTypes_).concat(mediaFeatures_).concat(mediaValueKeywords_)
    .concat(propertyKeywords_).concat(nonStandardPropertyKeywords_).concat(colorKeywords_)
    .concat(valueKeywords_);
  CodeMirror.registerHelper("hintWords", "css", allWords);

  function tokenCComment(stream, state) {
    var maybeEnd = false, ch;
    while ((ch = stream.next()) != null) {
      if (maybeEnd && ch == "/") {
        state.tokenize = null;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ["comment", "comment"];
  }

  CodeMirror.defineMIME("text/css", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css"
  });

  CodeMirror.defineMIME("text/x-scss", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      ":": function(stream) {
        if (stream.match(/\s*\{/))
          return [null, "{"];
        return false;
      },
      "$": function(stream) {
        stream.match(/^[\w-]+/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "#": function(stream) {
        if (!stream.eat("{")) return false;
        return [null, "interpolation"];
      }
    },
    name: "css",
    helperType: "scss"
  });

  CodeMirror.defineMIME("text/x-less", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      "@": function(stream) {
        if (stream.eat("{")) return [null, "interpolation"];
        if (stream.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/, false)) return false;
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "&": function() {
        return ["atom", "atom"];
      }
    },
    name: "css",
    helperType: "less"
  });

  CodeMirror.defineMIME("text/x-gss", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    supportsAtComponent: true,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css",
    helperType: "gss"
  });

});

!function(a){function b(){return"Markdown.mk_block( "+uneval(this.toString())+", "+uneval(this.trailing)+", "+uneval(this.lineNumber)+" )"}function c(){var a=require("util");return"Markdown.mk_block( "+a.inspect(this.toString())+", "+a.inspect(this.trailing)+", "+a.inspect(this.lineNumber)+" )"}function d(a){for(var b=0,c=-1;-1!==(c=a.indexOf("\n",c+1));)b++;return b}function e(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function f(a){if("string"==typeof a)return e(a);var b=a.shift(),c={},d=[];for(!a.length||"object"!=typeof a[0]||a[0]instanceof Array||(c=a.shift());a.length;)d.push(f(a.shift()));var g="";for(var h in c)g+=" "+h+'="'+e(c[h])+'"';return"img"===b||"br"===b||"hr"===b?"<"+b+g+"/>":"<"+b+g+">"+d.join("")+"</"+b+">"}function g(a,b,c){var d;c=c||{};var e=a.slice(0);"function"==typeof c.preprocessTreeNode&&(e=c.preprocessTreeNode(e,b));var f=o(e);if(f){e[1]={};for(d in f)e[1][d]=f[d];f=e[1]}if("string"==typeof e)return e;switch(e[0]){case"header":e[0]="h"+e[1].level,delete e[1].level;break;case"bulletlist":e[0]="ul";break;case"numberlist":e[0]="ol";break;case"listitem":e[0]="li";break;case"para":e[0]="p";break;case"markdown":e[0]="html",f&&delete f.references;break;case"code_block":e[0]="pre",d=f?2:1;var h=["code"];h.push.apply(h,e.splice(d,e.length-d)),e[d]=h;break;case"inlinecode":e[0]="code";break;case"img":e[1].src=e[1].href,delete e[1].href;break;case"linebreak":e[0]="br";break;case"link":e[0]="a";break;case"link_ref":e[0]="a";var i=b[f.ref];if(!i)return f.original;delete f.ref,f.href=i.href,i.title&&(f.title=i.title),delete f.original;break;case"img_ref":e[0]="img";var i=b[f.ref];if(!i)return f.original;delete f.ref,f.src=i.href,i.title&&(f.title=i.title),delete f.original}if(d=1,f){for(var j in e[1]){d=2;break}1===d&&e.splice(d,1)}for(;d<e.length;++d)e[d]=g(e[d],b,c);return e}function h(a){for(var b=o(a)?2:1;b<a.length;)"string"==typeof a[b]?b+1<a.length&&"string"==typeof a[b+1]?a[b]+=a.splice(b+1,1)[0]:++b:(h(a[b]),++b)}function i(a,b){function c(a){this.len_after=a,this.name="close_"+b}var d=a+"_state",e="strong"===a?"em_state":"strong_state";return function(f){if(this[d][0]===b)return this[d].shift(),[f.length,new c(f.length-b.length)];var g=this[e].slice(),h=this[d].slice();this[d].unshift(b);var i=this.processInline(f.substr(b.length)),j=i[i.length-1];if(this[d].shift(),j instanceof c){i.pop();var k=f.length-j.len_after;return[k,[a].concat(i)]}return this[e]=g,this[d]=h,[b.length,b]}}function j(a){for(var b=a.split(""),c=[""],d=!1;b.length;){var e=b.shift();switch(e){case" ":d?c[c.length-1]+=e:c.push("");break;case"'":case'"':d=!d;break;case"\\":e=b.shift();default:c[c.length-1]+=e}}return c}var k={};k.mk_block=function(a,d,e){1===arguments.length&&(d="\n\n");var f=new String(a);return f.trailing=d,f.inspect=c,f.toSource=b,void 0!==e&&(f.lineNumber=e),f};var l=k.isArray=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)};k.forEach=Array.prototype.forEach?function(a,b,c){return a.forEach(b,c)}:function(a,b,c){for(var d=0;d<a.length;d++)b.call(c||a,a[d],d,a)},k.isEmpty=function(a){for(var b in a)if(hasOwnProperty.call(a,b))return!1;return!0},k.extract_attr=function(a){return l(a)&&a.length>1&&"object"==typeof a[1]&&!l(a[1])?a[1]:void 0};var m=function(a){switch(typeof a){case"undefined":this.dialect=m.dialects.Gruber;break;case"object":this.dialect=a;break;default:if(!(a in m.dialects))throw new Error("Unknown Markdown dialect '"+String(a)+"'");this.dialect=m.dialects[a]}this.em_state=[],this.strong_state=[],this.debug_indent=""};m.dialects={};var n=m.mk_block=k.mk_block,l=k.isArray;m.parse=function(a,b){var c=new m(b);return c.toTree(a)},m.prototype.split_blocks=function(a){a=a.replace(/(\r\n|\n|\r)/g,"\n");var b,c=/([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,e=[],f=1;for(null!==(b=/^(\s*\n)/.exec(a))&&(f+=d(b[0]),c.lastIndex=b[0].length);null!==(b=c.exec(a));)"\n#"===b[2]&&(b[2]="\n",c.lastIndex--),e.push(n(b[1],b[2],f)),f+=d(b[0]);return e},m.prototype.processBlock=function(a,b){var c=this.dialect.block,d=c.__order__;if("__call__"in c)return c.__call__.call(this,a,b);for(var e=0;e<d.length;e++){var f=c[d[e]].call(this,a,b);if(f)return(!l(f)||f.length>0&&!l(f[0]))&&this.debug(d[e],"didn't return a proper array"),f}return[]},m.prototype.processInline=function(a){return this.dialect.inline.__call__.call(this,String(a))},m.prototype.toTree=function(a,b){var c=a instanceof Array?a:this.split_blocks(a),d=this.tree;try{for(this.tree=b||this.tree||["markdown"];c.length;){var e=this.processBlock(c.shift(),c);e.length&&this.tree.push.apply(this.tree,e)}return this.tree}finally{b&&(this.tree=d)}},m.prototype.debug=function(){var a=Array.prototype.slice.call(arguments);a.unshift(this.debug_indent),"undefined"!=typeof print&&print.apply(print,a),"undefined"!=typeof console&&"undefined"!=typeof console.log&&console.log.apply(null,a)},m.prototype.loop_re_over_block=function(a,b,c){for(var d,e=b.valueOf();e.length&&null!==(d=a.exec(e));)e=e.substr(d[0].length),c.call(this,d);return e},m.buildBlockOrder=function(a){var b=[];for(var c in a)"__order__"!==c&&"__call__"!==c&&b.push(c);a.__order__=b},m.buildInlinePatterns=function(a){var b=[];for(var c in a)if(!c.match(/^__.*__$/)){var d=c.replace(/([\\.*+?|()\[\]{}])/g,"\\$1").replace(/\n/,"\\n");b.push(1===c.length?d:"(?:"+d+")")}b=b.join("|"),a.__patterns__=b;var e=a.__call__;a.__call__=function(a,c){return void 0!==c?e.call(this,a,c):e.call(this,a,b)}};var o=k.extract_attr;m.renderJsonML=function(a,b){b=b||{},b.root=b.root||!1;var c=[];if(b.root)c.push(f(a));else for(a.shift(),!a.length||"object"!=typeof a[0]||a[0]instanceof Array||a.shift();a.length;)c.push(f(a.shift()));return c.join("\n\n")},m.toHTMLTree=function(a,b,c){"string"==typeof a&&(a=this.parse(a,b));var d=o(a),e={};d&&d.references&&(e=d.references);var f=g(a,e,c);return h(f),f},m.toHTML=function(a,b,c){var d=this.toHTMLTree(a,b,c);return this.renderJsonML(d)};var p={};p.inline_until_char=function(a,b){for(var c=0,d=[];;){if(a.charAt(c)===b)return c++,[c,d];if(c>=a.length)return null;var e=this.dialect.inline.__oneElement__.call(this,a.substr(c));c+=e[0],d.push.apply(d,e.slice(1))}},p.subclassDialect=function(a){function b(){}function c(){}return b.prototype=a.block,c.prototype=a.inline,{block:new b,inline:new c}};var q=k.forEach,o=k.extract_attr,n=k.mk_block,r=k.isEmpty,s=p.inline_until_char,t={block:{atxHeader:function(a,b){var c=a.match(/^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/);if(!c)return void 0;var d=["header",{level:c[1].length}];return Array.prototype.push.apply(d,this.processInline(c[2])),c[0].length<a.length&&b.unshift(n(a.substr(c[0].length),a.trailing,a.lineNumber+2)),[d]},setextHeader:function(a,b){var c=a.match(/^(.*)\n([-=])\2\2+(?:\n|$)/);if(!c)return void 0;var d="="===c[2]?1:2,e=["header",{level:d},c[1]];return c[0].length<a.length&&b.unshift(n(a.substr(c[0].length),a.trailing,a.lineNumber+2)),[e]},code:function(a,b){var c=[],d=/^(?: {0,3}\t| {4})(.*)\n?/;if(!a.match(d))return void 0;a:for(;;){var e=this.loop_re_over_block(d,a.valueOf(),function(a){c.push(a[1])});if(e.length){b.unshift(n(e,a.trailing));break a}if(!b.length)break a;if(!b[0].match(d))break a;c.push(a.trailing.replace(/[^\n]/g,"").substring(2)),a=b.shift()}return[["code_block",c.join("\n")]]},horizRule:function(a,b){var c=a.match(/^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/);if(!c)return void 0;var d=[["hr"]];if(c[1]){var e=n(c[1],"",a.lineNumber);d.unshift.apply(d,this.toTree(e,[]))}return c[3]&&b.unshift(n(c[3],a.trailing,a.lineNumber+1)),d},lists:function(){function a(a){return new RegExp("(?:^("+i+"{0,"+a+"} {0,3})("+f+")\\s+)|"+"(^"+i+"{0,"+(a-1)+"}[ ]{0,4})")}function b(a){return a.replace(/ {0,3}\t/g,"    ")}function c(a,b,c,d){if(b)return a.push(["para"].concat(c)),void 0;var e=a[a.length-1]instanceof Array&&"para"===a[a.length-1][0]?a[a.length-1]:a;d&&a.length>1&&c.unshift(d);for(var f=0;f<c.length;f++){var g=c[f],h="string"==typeof g;h&&e.length>1&&"string"==typeof e[e.length-1]?e[e.length-1]+=g:e.push(g)}}function d(a,b){for(var c=new RegExp("^("+i+"{"+a+"}.*?\\n?)*$"),d=new RegExp("^"+i+"{"+a+"}","gm"),e=[];b.length>0&&c.exec(b[0]);){var f=b.shift(),g=f.replace(d,"");e.push(n(g,f.trailing,f.lineNumber))}return e}function e(a,b,c){var d=a.list,e=d[d.length-1];if(!(e[1]instanceof Array&&"para"===e[1][0]))if(b+1===c.length)e.push(["para"].concat(e.splice(1,e.length-1)));else{var f=e.pop();e.push(["para"].concat(e.splice(1,e.length-1)),f)}}var f="[*+-]|\\d+\\.",g=/[*+-]/,h=new RegExp("^( {0,3})("+f+")[  ]+"),i="(?: {0,3}\\t| {4})";return function(f,i){function j(a){var b=g.exec(a[2])?["bulletlist"]:["numberlist"];return n.push({list:b,indent:a[1]}),b}var k=f.match(h);if(!k)return void 0;for(var l,m,n=[],o=j(k),p=!1,r=[n[0].list];;){for(var s=f.split(/(?=\n)/),t="",u="",v=0;v<s.length;v++){u="";var w=s[v].replace(/^\n/,function(a){return u=a,""}),x=a(n.length);if(k=w.match(x),void 0!==k[1]){t.length&&(c(l,p,this.processInline(t),u),p=!1,t=""),k[1]=b(k[1]);var y=Math.floor(k[1].length/4)+1;if(y>n.length)o=j(k),l.push(o),l=o[1]=["listitem"];else{var z=!1;for(m=0;m<n.length;m++)if(n[m].indent===k[1]){o=n[m].list,n.splice(m+1,n.length-(m+1)),z=!0;break}z||(y++,y<=n.length?(n.splice(y,n.length-y),o=n[y-1].list):(o=j(k),l.push(o))),l=["listitem"],o.push(l)}u=""}w.length>k[0].length&&(t+=u+w.substr(k[0].length))}t.length&&(c(l,p,this.processInline(t),u),p=!1,t="");var A=d(n.length,i);A.length>0&&(q(n,e,this),l.push.apply(l,this.toTree(A,[])));var B=i[0]&&i[0].valueOf()||"";if(!B.match(h)&&!B.match(/^ /))break;f=i.shift();var C=this.dialect.block.horizRule(f,i);if(C){r.push.apply(r,C);break}q(n,e,this),p=!0}return r}}(),blockquote:function(a,b){if(!a.match(/^>/m))return void 0;var c=[];if(">"!==a[0]){for(var d=a.split(/\n/),e=[],f=a.lineNumber;d.length&&">"!==d[0][0];)e.push(d.shift()),f++;var g=n(e.join("\n"),"\n",a.lineNumber);c.push.apply(c,this.processBlock(g,[])),a=n(d.join("\n"),a.trailing,f)}for(;b.length&&">"===b[0][0];){var h=b.shift();a=n(a+a.trailing+h,h.trailing,a.lineNumber)}var i=a.replace(/^> ?/gm,""),j=(this.tree,this.toTree(i,["blockquote"])),k=o(j);return k&&k.references&&(delete k.references,r(k)&&j.splice(1,1)),c.push(j),c},referenceDefn:function(a,b){var c=/^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/;if(!a.match(c))return void 0;o(this.tree)||this.tree.splice(1,0,{});var d=o(this.tree);void 0===d.references&&(d.references={});var e=this.loop_re_over_block(c,a,function(a){a[2]&&"<"===a[2][0]&&">"===a[2][a[2].length-1]&&(a[2]=a[2].substring(1,a[2].length-1));var b=d.references[a[1].toLowerCase()]={href:a[2]};void 0!==a[4]?b.title=a[4]:void 0!==a[5]&&(b.title=a[5])});return e.length&&b.unshift(n(e,a.trailing)),[]},para:function(a){return[["para"].concat(this.processInline(a))]}},inline:{__oneElement__:function(a,b,c){var d,e;b=b||this.dialect.inline.__patterns__;var f=new RegExp("([\\s\\S]*?)("+(b.source||b)+")");if(d=f.exec(a),!d)return[a.length,a];if(d[1])return[d[1].length,d[1]];var e;return d[2]in this.dialect.inline&&(e=this.dialect.inline[d[2]].call(this,a.substr(d.index),d,c||[])),e=e||[d[2].length,d[2]]},__call__:function(a,b){function c(a){"string"==typeof a&&"string"==typeof e[e.length-1]?e[e.length-1]+=a:e.push(a)}for(var d,e=[];a.length>0;)d=this.dialect.inline.__oneElement__.call(this,a,b,e),a=a.substr(d.shift()),q(d,c);return e},"]":function(){},"}":function(){},__escape__:/^\\[\\`\*_{}\[\]()#\+.!\-]/,"\\":function(a){return this.dialect.inline.__escape__.exec(a)?[2,a.charAt(1)]:[1,"\\"]},"![":function(a){var b=a.match(/^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/);if(b){b[2]&&"<"===b[2][0]&&">"===b[2][b[2].length-1]&&(b[2]=b[2].substring(1,b[2].length-1)),b[2]=this.dialect.inline.__call__.call(this,b[2],/\\/)[0];var c={alt:b[1],href:b[2]||""};return void 0!==b[4]&&(c.title=b[4]),[b[0].length,["img",c]]}return b=a.match(/^!\[(.*?)\][ \t]*\[(.*?)\]/),b?[b[0].length,["img_ref",{alt:b[1],ref:b[2].toLowerCase(),original:b[0]}]]:[2,"!["]},"[":function v(a){var b=String(a),c=s.call(this,a.substr(1),"]");if(!c)return[1,"["];var v,d,e=1+c[0],f=c[1];a=a.substr(e);var g=a.match(/^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/);if(g){var h=g[1];if(e+=g[0].length,h&&"<"===h[0]&&">"===h[h.length-1]&&(h=h.substring(1,h.length-1)),!g[3])for(var i=1,j=0;j<h.length;j++)switch(h[j]){case"(":i++;break;case")":0===--i&&(e-=h.length-j,h=h.substring(0,j))}return h=this.dialect.inline.__call__.call(this,h,/\\/)[0],d={href:h||""},void 0!==g[3]&&(d.title=g[3]),v=["link",d].concat(f),[e,v]}return g=a.match(/^\s*\[(.*?)\]/),g?(e+=g[0].length,d={ref:(g[1]||String(f)).toLowerCase(),original:b.substr(0,e)},v=["link_ref",d].concat(f),[e,v]):1===f.length&&"string"==typeof f[0]?(d={ref:f[0].toLowerCase(),original:b.substr(0,e)},v=["link_ref",d,f[0]],[e,v]):[1,"["]},"<":function(a){var b;return null!==(b=a.match(/^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/))?b[3]?[b[0].length,["link",{href:"mailto:"+b[3]},b[3]]]:"mailto"===b[2]?[b[0].length,["link",{href:b[1]},b[1].substr("mailto:".length)]]:[b[0].length,["link",{href:b[1]},b[1]]]:[1,"<"]},"`":function(a){var b=a.match(/(`+)(([\s\S]*?)\1)/);return b&&b[2]?[b[1].length+b[2].length,["inlinecode",b[3]]]:[1,"`"]},"  \n":function(){return[3,["linebreak"]]}}};t.inline["**"]=i("strong","**"),t.inline.__=i("strong","__"),t.inline["*"]=i("em","*"),t.inline._=i("em","_"),m.dialects.Gruber=t,m.buildBlockOrder(m.dialects.Gruber.block),m.buildInlinePatterns(m.dialects.Gruber.inline);var u=p.subclassDialect(t),o=k.extract_attr,q=k.forEach;u.processMetaHash=function(a){for(var b=j(a),c={},d=0;d<b.length;++d)if(/^#/.test(b[d]))c.id=b[d].substring(1);else if(/^\./.test(b[d]))c["class"]=c["class"]?c["class"]+b[d].replace(/./," "):b[d].substring(1);else if(/\=/.test(b[d])){var e=b[d].split(/\=/);c[e[0]]=e[1]}return c},u.block.document_meta=function(a){if(a.lineNumber>1)return void 0;if(!a.match(/^(?:\w+:.*\n)*\w+:.*$/))return void 0;o(this.tree)||this.tree.splice(1,0,{});var b=a.split(/\n/);for(var c in b){var d=b[c].match(/(\w+):\s*(.*)$/),e=d[1].toLowerCase(),f=d[2];this.tree[1][e]=f}return[]},u.block.block_meta=function(a){var b=a.match(/(^|\n) {0,3}\{:\s*((?:\\\}|[^\}])*)\s*\}$/);if(!b)return void 0;var c,d=this.dialect.processMetaHash(b[2]);if(""===b[1]){var e=this.tree[this.tree.length-1];if(c=o(e),"string"==typeof e)return void 0;c||(c={},e.splice(1,0,c));for(var f in d)c[f]=d[f];return[]}var g=a.replace(/\n.*$/,""),h=this.processBlock(g,[]);c=o(h[0]),c||(c={},h[0].splice(1,0,c));for(var f in d)c[f]=d[f];return h},u.block.definition_list=function(a,b){var c,d,e=/^((?:[^\s:].*\n)+):\s+([\s\S]+)$/,f=["dl"];if(!(d=a.match(e)))return void 0;for(var g=[a];b.length&&e.exec(b[0]);)g.push(b.shift());for(var h=0;h<g.length;++h){var d=g[h].match(e),i=d[1].replace(/\n$/,"").split(/\n/),j=d[2].split(/\n:\s+/);for(c=0;c<i.length;++c)f.push(["dt",i[c]]);for(c=0;c<j.length;++c)f.push(["dd"].concat(this.processInline(j[c].replace(/(\n)\s+/,"$1"))))}return[f]},u.block.table=function w(a){var b,c,d=function(a,b){b=b||"\\s",b.match(/^[\\|\[\]{}?*.+^$]$/)&&(b="\\"+b);for(var c,d=[],e=new RegExp("^((?:\\\\.|[^\\\\"+b+"])*)"+b+"(.*)");c=a.match(e);)d.push(c[1]),a=c[2];return d.push(a),d},e=/^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,f=/^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/;if(c=a.match(e))c[3]=c[3].replace(/^\s*\|/gm,"");else if(!(c=a.match(f)))return void 0;var w=["table",["thead",["tr"]],["tbody"]];c[2]=c[2].replace(/\|\s*$/,"").split("|");var g=[];for(q(c[2],function(a){a.match(/^\s*-+:\s*$/)?g.push({align:"right"}):a.match(/^\s*:-+\s*$/)?g.push({align:"left"}):a.match(/^\s*:-+:\s*$/)?g.push({align:"center"}):g.push({})}),c[1]=d(c[1].replace(/\|\s*$/,""),"|"),b=0;b<c[1].length;b++)w[1][1].push(["th",g[b]||{}].concat(this.processInline(c[1][b].trim())));return q(c[3].replace(/\|\s*$/gm,"").split("\n"),function(a){var c=["tr"];for(a=d(a,"|"),b=0;b<a.length;b++)c.push(["td",g[b]||{}].concat(this.processInline(a[b].trim())));w[2].push(c)},this),[w]},u.inline["{:"]=function(a,b,c){if(!c.length)return[2,"{:"];var d=c[c.length-1];if("string"==typeof d)return[2,"{:"];var e=a.match(/^\{:\s*((?:\\\}|[^\}])*)\s*\}/);if(!e)return[2,"{:"];var f=this.dialect.processMetaHash(e[1]),g=o(d);g||(g={},d.splice(1,0,g));for(var h in f)g[h]=f[h];return[e[0].length,""]},m.dialects.Maruku=u,m.dialects.Maruku.inline.__escape__=/^\\[\\`\*_{}\[\]()#\+.!\-|:]/,m.buildBlockOrder(m.dialects.Maruku.block),m.buildInlinePatterns(m.dialects.Maruku.inline),a.Markdown=m,a.parse=m.parse,a.toHTML=m.toHTML,a.toHTMLTree=m.toHTMLTree,a.renderJsonML=m.renderJsonML}(function(){return window.markdown={},window.markdown}());
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("clike", function(config, parserConfig) {
  var indentUnit = config.indentUnit,
      statementIndentUnit = parserConfig.statementIndentUnit || indentUnit,
      dontAlignCalls = parserConfig.dontAlignCalls,
      keywords = parserConfig.keywords || {},
      types = parserConfig.types || {},
      builtin = parserConfig.builtin || {},
      blockKeywords = parserConfig.blockKeywords || {},
      defKeywords = parserConfig.defKeywords || {},
      atoms = parserConfig.atoms || {},
      hooks = parserConfig.hooks || {},
      multiLineStrings = parserConfig.multiLineStrings,
      indentStatements = parserConfig.indentStatements !== false,
      indentSwitch = parserConfig.indentSwitch !== false,
      namespaceSeparator = parserConfig.namespaceSeparator,
      isPunctuationChar = parserConfig.isPunctuationChar || /[\[\]{}\(\),;\:\.]/,
      numberStart = parserConfig.numberStart || /[\d\.]/,
      number = parserConfig.number || /^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(u|ll?|l|f)?/i,
      isOperatorChar = parserConfig.isOperatorChar || /[+\-*&%=<>!?|\/]/,
      endStatement = parserConfig.endStatement || /^[;:,]$/;

  var curPunc, isDefKeyword;

  function tokenBase(stream, state) {
    var ch = stream.next();
    if (hooks[ch]) {
      var result = hooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    }
    if (isPunctuationChar.test(ch)) {
      curPunc = ch;
      return null;
    }
    if (numberStart.test(ch)) {
      stream.backUp(1)
      if (stream.match(number)) return "number"
      stream.next()
    }
    if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      }
      if (stream.eat("/")) {
        stream.skipToEnd();
        return "comment";
      }
    }
    if (isOperatorChar.test(ch)) {
      stream.eatWhile(isOperatorChar);
      return "operator";
    }
    stream.eatWhile(/[\w\$_\xa1-\uffff]/);
    if (namespaceSeparator) while (stream.match(namespaceSeparator))
      stream.eatWhile(/[\w\$_\xa1-\uffff]/);

    var cur = stream.current();
    if (contains(keywords, cur)) {
      if (contains(blockKeywords, cur)) curPunc = "newstatement";
      if (contains(defKeywords, cur)) isDefKeyword = true;
      return "keyword";
    }
    if (contains(types, cur)) return "variable-3";
    if (contains(builtin, cur)) {
      if (contains(blockKeywords, cur)) curPunc = "newstatement";
      return "builtin";
    }
    if (contains(atoms, cur)) return "atom";
    return "variable";
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next, end = false;
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) {end = true; break;}
        escaped = !escaped && next == "\\";
      }
      if (end || !(escaped || multiLineStrings))
        state.tokenize = null;
      return "string";
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = null;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return "comment";
  }

  function Context(indented, column, type, align, prev) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.align = align;
    this.prev = prev;
  }
  function isStatement(type) {
    return type == "statement" || type == "switchstatement" || type == "namespace";
  }
  function pushContext(state, col, type) {
    var indent = state.indented;
    if (state.context && isStatement(state.context.type) && !isStatement(type))
      indent = state.context.indented;
    return state.context = new Context(indent, col, type, null, state.context);
  }
  function popContext(state) {
    var t = state.context.type;
    if (t == ")" || t == "]" || t == "}")
      state.indented = state.context.indented;
    return state.context = state.context.prev;
  }

  function typeBefore(stream, state) {
    if (state.prevToken == "variable" || state.prevToken == "variable-3") return true;
    if (/\S(?:[^- ]>|[*\]])\s*$|\*$/.test(stream.string.slice(0, stream.start))) return true;
  }

  function isTopScope(context) {
    for (;;) {
      if (!context || context.type == "top") return true;
      if (context.type == "}" && context.prev.type != "namespace") return false;
      context = context.prev;
    }
  }

  // Interface

  return {
    startState: function(basecolumn) {
      return {
        tokenize: null,
        context: new Context((basecolumn || 0) - indentUnit, 0, "top", false),
        indented: 0,
        startOfLine: true,
        prevToken: null
      };
    },

    token: function(stream, state) {
      var ctx = state.context;
      if (stream.sol()) {
        if (ctx.align == null) ctx.align = false;
        state.indented = stream.indentation();
        state.startOfLine = true;
      }
      if (stream.eatSpace()) return null;
      curPunc = isDefKeyword = null;
      var style = (state.tokenize || tokenBase)(stream, state);
      if (style == "comment" || style == "meta") return style;
      if (ctx.align == null) ctx.align = true;

      if (endStatement.test(curPunc)) while (isStatement(state.context.type)) popContext(state);
      else if (curPunc == "{") pushContext(state, stream.column(), "}");
      else if (curPunc == "[") pushContext(state, stream.column(), "]");
      else if (curPunc == "(") pushContext(state, stream.column(), ")");
      else if (curPunc == "}") {
        while (isStatement(ctx.type)) ctx = popContext(state);
        if (ctx.type == "}") ctx = popContext(state);
        while (isStatement(ctx.type)) ctx = popContext(state);
      }
      else if (curPunc == ctx.type) popContext(state);
      else if (indentStatements &&
               (((ctx.type == "}" || ctx.type == "top") && curPunc != ";") ||
                (isStatement(ctx.type) && curPunc == "newstatement"))) {
        var type = "statement";
        if (curPunc == "newstatement" && indentSwitch && stream.current() == "switch")
          type = "switchstatement";
        else if (style == "keyword" && stream.current() == "namespace")
          type = "namespace";
        pushContext(state, stream.column(), type);
      }

      if (style == "variable" &&
          ((state.prevToken == "def" ||
            (parserConfig.typeFirstDefinitions && typeBefore(stream, state) &&
             isTopScope(state.context) && stream.match(/^\s*\(/, false)))))
        style = "def";

      if (hooks.token) {
        var result = hooks.token(stream, state, style);
        if (result !== undefined) style = result;
      }

      if (style == "def" && parserConfig.styleDefs === false) style = "variable";

      state.startOfLine = false;
      state.prevToken = isDefKeyword ? "def" : style || curPunc;
      return style;
    },

    indent: function(state, textAfter) {
      if (state.tokenize != tokenBase && state.tokenize != null) return CodeMirror.Pass;
      var ctx = state.context, firstChar = textAfter && textAfter.charAt(0);
      if (isStatement(ctx.type) && firstChar == "}") ctx = ctx.prev;
      if (hooks.indent) {
        var hook = hooks.indent(state, ctx, textAfter);
        if (typeof hook == "number") return hook
      }
      var closing = firstChar == ctx.type;
      var switchBlock = ctx.prev && ctx.prev.type == "switchstatement";
      if (parserConfig.allmanIndentation && /[{(]/.test(firstChar)) {
        while (ctx.type != "top" && ctx.type != "}") ctx = ctx.prev
        return ctx.indented
      }
      if (isStatement(ctx.type))
        return ctx.indented + (firstChar == "{" ? 0 : statementIndentUnit);
      if (ctx.align && (!dontAlignCalls || ctx.type != ")"))
        return ctx.column + (closing ? 0 : 1);
      if (ctx.type == ")" && !closing)
        return ctx.indented + statementIndentUnit;

      return ctx.indented + (closing ? 0 : indentUnit) +
        (!closing && switchBlock && !/^(?:case|default)\b/.test(textAfter) ? indentUnit : 0);
    },

    electricInput: indentSwitch ? /^\s*(?:case .*?:|default:|\{\}?|\})$/ : /^\s*[{}]$/,
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: "//",
    fold: "brace"
  };
});

  function words(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }
  function contains(words, word) {
    if (typeof words === "function") {
      return words(word);
    } else {
      return words.propertyIsEnumerable(word);
    }
  }
  var cKeywords = "auto if break case register continue return default do sizeof " +
    "static else struct switch extern typedef union for goto while enum const volatile";
  var cTypes = "int long char short double float unsigned signed void size_t ptrdiff_t";

  function cppHook(stream, state) {
    if (!state.startOfLine) return false
    for (var ch, next = null; ch = stream.peek();) {
      if (ch == "\\" && stream.match(/^.$/)) {
        next = cppHook
        break
      } else if (ch == "/" && stream.match(/^\/[\/\*]/, false)) {
        break
      }
      stream.next()
    }
    state.tokenize = next
    return "meta"
  }

  function pointerHook(_stream, state) {
    if (state.prevToken == "variable-3") return "variable-3";
    return false;
  }

  function cpp14Literal(stream) {
    stream.eatWhile(/[\w\.']/);
    return "number";
  }

  function cpp11StringHook(stream, state) {
    stream.backUp(1);
    // Raw strings.
    if (stream.match(/(R|u8R|uR|UR|LR)/)) {
      var match = stream.match(/"([^\s\\()]{0,16})\(/);
      if (!match) {
        return false;
      }
      state.cpp11RawStringDelim = match[1];
      state.tokenize = tokenRawString;
      return tokenRawString(stream, state);
    }
    // Unicode strings/chars.
    if (stream.match(/(u8|u|U|L)/)) {
      if (stream.match(/["']/, /* eat */ false)) {
        return "string";
      }
      return false;
    }
    // Ignore this hook.
    stream.next();
    return false;
  }

  function cppLooksLikeConstructor(word) {
    var lastTwo = /(\w+)::(\w+)$/.exec(word);
    return lastTwo && lastTwo[1] == lastTwo[2];
  }

  // C#-style strings where "" escapes a quote.
  function tokenAtString(stream, state) {
    var next;
    while ((next = stream.next()) != null) {
      if (next == '"' && !stream.eat('"')) {
        state.tokenize = null;
        break;
      }
    }
    return "string";
  }

  // C++11 raw string literal is <prefix>"<delim>( anything )<delim>", where
  // <delim> can be a string up to 16 characters long.
  function tokenRawString(stream, state) {
    // Escape characters that have special regex meanings.
    var delim = state.cpp11RawStringDelim.replace(/[^\w\s]/g, '\\$&');
    var match = stream.match(new RegExp(".*?\\)" + delim + '"'));
    if (match)
      state.tokenize = null;
    else
      stream.skipToEnd();
    return "string";
  }

  function def(mimes, mode) {
    if (typeof mimes == "string") mimes = [mimes];
    var words = [];
    function add(obj) {
      if (obj) for (var prop in obj) if (obj.hasOwnProperty(prop))
        words.push(prop);
    }
    add(mode.keywords);
    add(mode.types);
    add(mode.builtin);
    add(mode.atoms);
    if (words.length) {
      mode.helperType = mimes[0];
      CodeMirror.registerHelper("hintWords", mimes[0], words);
    }

    for (var i = 0; i < mimes.length; ++i)
      CodeMirror.defineMIME(mimes[i], mode);
  }

  def(["text/x-csrc", "text/x-c", "text/x-chdr"], {
    name: "clike",
    keywords: words(cKeywords),
    types: words(cTypes + " bool _Complex _Bool float_t double_t intptr_t intmax_t " +
                 "int8_t int16_t int32_t int64_t uintptr_t uintmax_t uint8_t uint16_t " +
                 "uint32_t uint64_t"),
    blockKeywords: words("case do else for if switch while struct"),
    defKeywords: words("struct"),
    typeFirstDefinitions: true,
    atoms: words("null true false"),
    hooks: {"#": cppHook, "*": pointerHook},
    modeProps: {fold: ["brace", "include"]}
  });

  def(["text/x-c++src", "text/x-c++hdr"], {
    name: "clike",
    keywords: words(cKeywords + " asm dynamic_cast namespace reinterpret_cast try explicit new " +
                    "static_cast typeid catch operator template typename class friend private " +
                    "this using const_cast inline public throw virtual delete mutable protected " +
                    "alignas alignof constexpr decltype nullptr noexcept thread_local final " +
                    "static_assert override"),
    types: words(cTypes + " bool wchar_t"),
    blockKeywords: words("catch class do else finally for if struct switch try while"),
    defKeywords: words("class namespace struct enum union"),
    typeFirstDefinitions: true,
    atoms: words("true false null"),
    hooks: {
      "#": cppHook,
      "*": pointerHook,
      "u": cpp11StringHook,
      "U": cpp11StringHook,
      "L": cpp11StringHook,
      "R": cpp11StringHook,
      "0": cpp14Literal,
      "1": cpp14Literal,
      "2": cpp14Literal,
      "3": cpp14Literal,
      "4": cpp14Literal,
      "5": cpp14Literal,
      "6": cpp14Literal,
      "7": cpp14Literal,
      "8": cpp14Literal,
      "9": cpp14Literal,
      token: function(stream, state, style) {
        if (style == "variable" && stream.peek() == "(" &&
            (state.prevToken == ";" || state.prevToken == null ||
             state.prevToken == "}") &&
            cppLooksLikeConstructor(stream.current()))
          return "def";
      }
    },
    namespaceSeparator: "::",
    modeProps: {fold: ["brace", "include"]}
  });

  def("text/x-java", {
    name: "clike",
    keywords: words("abstract assert break case catch class const continue default " +
                    "do else enum extends final finally float for goto if implements import " +
                    "instanceof interface native new package private protected public " +
                    "return static strictfp super switch synchronized this throw throws transient " +
                    "try volatile while"),
    types: words("byte short int long float double boolean char void Boolean Byte Character Double Float " +
                 "Integer Long Number Object Short String StringBuffer StringBuilder Void"),
    blockKeywords: words("catch class do else finally for if switch try while"),
    defKeywords: words("class interface package enum"),
    typeFirstDefinitions: true,
    atoms: words("true false null"),
    endStatement: /^[;:]$/,
    hooks: {
      "@": function(stream) {
        stream.eatWhile(/[\w\$_]/);
        return "meta";
      }
    },
    modeProps: {fold: ["brace", "import"]}
  });

  def("text/x-csharp", {
    name: "clike",
    keywords: words("abstract as async await base break case catch checked class const continue" +
                    " default delegate do else enum event explicit extern finally fixed for" +
                    " foreach goto if implicit in interface internal is lock namespace new" +
                    " operator out override params private protected public readonly ref return sealed" +
                    " sizeof stackalloc static struct switch this throw try typeof unchecked" +
                    " unsafe using virtual void volatile while add alias ascending descending dynamic from get" +
                    " global group into join let orderby partial remove select set value var yield"),
    types: words("Action Boolean Byte Char DateTime DateTimeOffset Decimal Double Func" +
                 " Guid Int16 Int32 Int64 Object SByte Single String Task TimeSpan UInt16 UInt32" +
                 " UInt64 bool byte char decimal double short int long object"  +
                 " sbyte float string ushort uint ulong"),
    blockKeywords: words("catch class do else finally for foreach if struct switch try while"),
    defKeywords: words("class interface namespace struct var"),
    typeFirstDefinitions: true,
    atoms: words("true false null"),
    hooks: {
      "@": function(stream, state) {
        if (stream.eat('"')) {
          state.tokenize = tokenAtString;
          return tokenAtString(stream, state);
        }
        stream.eatWhile(/[\w\$_]/);
        return "meta";
      }
    }
  });

  function tokenTripleString(stream, state) {
    var escaped = false;
    while (!stream.eol()) {
      if (!escaped && stream.match('"""')) {
        state.tokenize = null;
        break;
      }
      escaped = stream.next() == "\\" && !escaped;
    }
    return "string";
  }

  def("text/x-scala", {
    name: "clike",
    keywords: words(

      /* scala */
      "abstract case catch class def do else extends final finally for forSome if " +
      "implicit import lazy match new null object override package private protected return " +
      "sealed super this throw trait try type val var while with yield _ : = => <- <: " +
      "<% >: # @ " +

      /* package scala */
      "assert assume require print println printf readLine readBoolean readByte readShort " +
      "readChar readInt readLong readFloat readDouble " +

      ":: #:: "
    ),
    types: words(
      "AnyVal App Application Array BufferedIterator BigDecimal BigInt Char Console Either " +
      "Enumeration Equiv Error Exception Fractional Function IndexedSeq Integral Iterable " +
      "Iterator List Map Numeric Nil NotNull Option Ordered Ordering PartialFunction PartialOrdering " +
      "Product Proxy Range Responder Seq Serializable Set Specializable Stream StringBuilder " +
      "StringContext Symbol Throwable Traversable TraversableOnce Tuple Unit Vector " +

      /* package java.lang */
      "Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable " +
      "Compiler Double Exception Float Integer Long Math Number Object Package Pair Process " +
      "Runtime Runnable SecurityManager Short StackTraceElement StrictMath String " +
      "StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void"
    ),
    multiLineStrings: true,
    blockKeywords: words("catch class do else finally for forSome if match switch try while"),
    defKeywords: words("class def object package trait type val var"),
    atoms: words("true false null"),
    indentStatements: false,
    indentSwitch: false,
    hooks: {
      "@": function(stream) {
        stream.eatWhile(/[\w\$_]/);
        return "meta";
      },
      '"': function(stream, state) {
        if (!stream.match('""')) return false;
        state.tokenize = tokenTripleString;
        return state.tokenize(stream, state);
      },
      "'": function(stream) {
        stream.eatWhile(/[\w\$_\xa1-\uffff]/);
        return "atom";
      }
    },
    modeProps: {closeBrackets: {triples: '"'}}
  });

  function tokenKotlinString(tripleString){
    return function (stream, state) {
      var escaped = false, next, end = false;
      while (!stream.eol()) {
        if (!tripleString && !escaped && stream.match('"') ) {end = true; break;}
        if (tripleString && stream.match('"""')) {end = true; break;}
        next = stream.next();
        if(!escaped && next == "$" && stream.match('{'))
          stream.skipTo("}");
        escaped = !escaped && next == "\\" && !tripleString;
      }
      if (end || !tripleString)
        state.tokenize = null;
      return "string";
    }
  }

  def("text/x-kotlin", {
    name: "clike",
    keywords: words(
      /*keywords*/
      "package as typealias class interface this super val " +
      "var fun for is in This throw return " +
      "break continue object if else while do try when !in !is as? " +

      /*soft keywords*/
      "file import where by get set abstract enum open inner override private public internal " +
      "protected catch finally out final vararg reified dynamic companion constructor init " +
      "sealed field property receiver param sparam lateinit data inline noinline tailrec " +
      "external annotation crossinline const operator infix"
    ),
    types: words(
      /* package java.lang */
      "Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable " +
      "Compiler Double Exception Float Integer Long Math Number Object Package Pair Process " +
      "Runtime Runnable SecurityManager Short StackTraceElement StrictMath String " +
      "StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void"
    ),
    intendSwitch: false,
    indentStatements: false,
    multiLineStrings: true,
    blockKeywords: words("catch class do else finally for if where try while enum"),
    defKeywords: words("class val var object package interface fun"),
    atoms: words("true false null this"),
    hooks: {
      '"': function(stream, state) {
        state.tokenize = tokenKotlinString(stream.match('""'));
        return state.tokenize(stream, state);
      }
    },
    modeProps: {closeBrackets: {triples: '"'}}
  });

  def(["x-shader/x-vertex", "x-shader/x-fragment"], {
    name: "clike",
    keywords: words("sampler1D sampler2D sampler3D samplerCube " +
                    "sampler1DShadow sampler2DShadow " +
                    "const attribute uniform varying " +
                    "break continue discard return " +
                    "for while do if else struct " +
                    "in out inout"),
    types: words("float int bool void " +
                 "vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 " +
                 "mat2 mat3 mat4"),
    blockKeywords: words("for while do if else struct"),
    builtin: words("radians degrees sin cos tan asin acos atan " +
                    "pow exp log exp2 sqrt inversesqrt " +
                    "abs sign floor ceil fract mod min max clamp mix step smoothstep " +
                    "length distance dot cross normalize ftransform faceforward " +
                    "reflect refract matrixCompMult " +
                    "lessThan lessThanEqual greaterThan greaterThanEqual " +
                    "equal notEqual any all not " +
                    "texture1D texture1DProj texture1DLod texture1DProjLod " +
                    "texture2D texture2DProj texture2DLod texture2DProjLod " +
                    "texture3D texture3DProj texture3DLod texture3DProjLod " +
                    "textureCube textureCubeLod " +
                    "shadow1D shadow2D shadow1DProj shadow2DProj " +
                    "shadow1DLod shadow2DLod shadow1DProjLod shadow2DProjLod " +
                    "dFdx dFdy fwidth " +
                    "noise1 noise2 noise3 noise4"),
    atoms: words("true false " +
                "gl_FragColor gl_SecondaryColor gl_Normal gl_Vertex " +
                "gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 " +
                "gl_MultiTexCoord4 gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 " +
                "gl_FogCoord gl_PointCoord " +
                "gl_Position gl_PointSize gl_ClipVertex " +
                "gl_FrontColor gl_BackColor gl_FrontSecondaryColor gl_BackSecondaryColor " +
                "gl_TexCoord gl_FogFragCoord " +
                "gl_FragCoord gl_FrontFacing " +
                "gl_FragData gl_FragDepth " +
                "gl_ModelViewMatrix gl_ProjectionMatrix gl_ModelViewProjectionMatrix " +
                "gl_TextureMatrix gl_NormalMatrix gl_ModelViewMatrixInverse " +
                "gl_ProjectionMatrixInverse gl_ModelViewProjectionMatrixInverse " +
                "gl_TexureMatrixTranspose gl_ModelViewMatrixInverseTranspose " +
                "gl_ProjectionMatrixInverseTranspose " +
                "gl_ModelViewProjectionMatrixInverseTranspose " +
                "gl_TextureMatrixInverseTranspose " +
                "gl_NormalScale gl_DepthRange gl_ClipPlane " +
                "gl_Point gl_FrontMaterial gl_BackMaterial gl_LightSource gl_LightModel " +
                "gl_FrontLightModelProduct gl_BackLightModelProduct " +
                "gl_TextureColor gl_EyePlaneS gl_EyePlaneT gl_EyePlaneR gl_EyePlaneQ " +
                "gl_FogParameters " +
                "gl_MaxLights gl_MaxClipPlanes gl_MaxTextureUnits gl_MaxTextureCoords " +
                "gl_MaxVertexAttribs gl_MaxVertexUniformComponents gl_MaxVaryingFloats " +
                "gl_MaxVertexTextureImageUnits gl_MaxTextureImageUnits " +
                "gl_MaxFragmentUniformComponents gl_MaxCombineTextureImageUnits " +
                "gl_MaxDrawBuffers"),
    indentSwitch: false,
    hooks: {"#": cppHook},
    modeProps: {fold: ["brace", "include"]}
  });

  def("text/x-nesc", {
    name: "clike",
    keywords: words(cKeywords + "as atomic async call command component components configuration event generic " +
                    "implementation includes interface module new norace nx_struct nx_union post provides " +
                    "signal task uses abstract extends"),
    types: words(cTypes),
    blockKeywords: words("case do else for if switch while struct"),
    atoms: words("null true false"),
    hooks: {"#": cppHook},
    modeProps: {fold: ["brace", "include"]}
  });

  def("text/x-objectivec", {
    name: "clike",
    keywords: words(cKeywords + "inline restrict _Bool _Complex _Imaginery BOOL Class bycopy byref id IMP in " +
                    "inout nil oneway out Protocol SEL self super atomic nonatomic retain copy readwrite readonly"),
    types: words(cTypes),
    atoms: words("YES NO NULL NILL ON OFF true false"),
    hooks: {
      "@": function(stream) {
        stream.eatWhile(/[\w\$]/);
        return "keyword";
      },
      "#": cppHook,
      indent: function(_state, ctx, textAfter) {
        if (ctx.type == "statement" && /^@\w/.test(textAfter)) return ctx.indented
      }
    },
    modeProps: {fold: "brace"}
  });

  def("text/x-squirrel", {
    name: "clike",
    keywords: words("base break clone continue const default delete enum extends function in class" +
                    " foreach local resume return this throw typeof yield constructor instanceof static"),
    types: words(cTypes),
    blockKeywords: words("case catch class else for foreach if switch try while"),
    defKeywords: words("function local class"),
    typeFirstDefinitions: true,
    atoms: words("true false null"),
    hooks: {"#": cppHook},
    modeProps: {fold: ["brace", "include"]}
  });

  // Ceylon Strings need to deal with interpolation
  var stringTokenizer = null;
  function tokenCeylonString(type) {
    return function(stream, state) {
      var escaped = false, next, end = false;
      while (!stream.eol()) {
        if (!escaped && stream.match('"') &&
              (type == "single" || stream.match('""'))) {
          end = true;
          break;
        }
        if (!escaped && stream.match('``')) {
          stringTokenizer = tokenCeylonString(type);
          end = true;
          break;
        }
        next = stream.next();
        escaped = type == "single" && !escaped && next == "\\";
      }
      if (end)
          state.tokenize = null;
      return "string";
    }
  }

  def("text/x-ceylon", {
    name: "clike",
    keywords: words("abstracts alias assembly assert assign break case catch class continue dynamic else" +
                    " exists extends finally for function given if import in interface is let module new" +
                    " nonempty object of out outer package return satisfies super switch then this throw" +
                    " try value void while"),
    types: function(word) {
        // In Ceylon all identifiers that start with an uppercase are types
        var first = word.charAt(0);
        return (first === first.toUpperCase() && first !== first.toLowerCase());
    },
    blockKeywords: words("case catch class dynamic else finally for function if interface module new object switch try while"),
    defKeywords: words("class dynamic function interface module object package value"),
    builtin: words("abstract actual aliased annotation by default deprecated doc final formal late license" +
                   " native optional sealed see serializable shared suppressWarnings tagged throws variable"),
    isPunctuationChar: /[\[\]{}\(\),;\:\.`]/,
    isOperatorChar: /[+\-*&%=<>!?|^~:\/]/,
    numberStart: /[\d#$]/,
    number: /^(?:#[\da-fA-F_]+|\$[01_]+|[\d_]+[kMGTPmunpf]?|[\d_]+\.[\d_]+(?:[eE][-+]?\d+|[kMGTPmunpf]|)|)/i,
    multiLineStrings: true,
    typeFirstDefinitions: true,
    atoms: words("true false null larger smaller equal empty finished"),
    indentSwitch: false,
    styleDefs: false,
    hooks: {
      "@": function(stream) {
        stream.eatWhile(/[\w\$_]/);
        return "meta";
      },
      '"': function(stream, state) {
          state.tokenize = tokenCeylonString(stream.match('""') ? "triple" : "single");
          return state.tokenize(stream, state);
        },
      '`': function(stream, state) {
          if (!stringTokenizer || !stream.match('`')) return false;
          state.tokenize = stringTokenizer;
          stringTokenizer = null;
          return state.tokenize(stream, state);
        },
      "'": function(stream) {
        stream.eatWhile(/[\w\$_\xa1-\uffff]/);
        return "atom";
      },
      token: function(_stream, state, style) {
          if ((style == "variable" || style == "variable-3") &&
              state.prevToken == ".") {
            return "variable-2";
          }
        }
    },
    modeProps: {
        fold: ["brace", "import"],
        closeBrackets: {triples: '"'}
    }
  });

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("go", function(config) {
  var indentUnit = config.indentUnit;

  var keywords = {
    "break":true, "case":true, "chan":true, "const":true, "continue":true,
    "default":true, "defer":true, "else":true, "fallthrough":true, "for":true,
    "func":true, "go":true, "goto":true, "if":true, "import":true,
    "interface":true, "map":true, "package":true, "range":true, "return":true,
    "select":true, "struct":true, "switch":true, "type":true, "var":true,
    "bool":true, "byte":true, "complex64":true, "complex128":true,
    "float32":true, "float64":true, "int8":true, "int16":true, "int32":true,
    "int64":true, "string":true, "uint8":true, "uint16":true, "uint32":true,
    "uint64":true, "int":true, "uint":true, "uintptr":true
  };

  var atoms = {
    "true":true, "false":true, "iota":true, "nil":true, "append":true,
    "cap":true, "close":true, "complex":true, "copy":true, "imag":true,
    "len":true, "make":true, "new":true, "panic":true, "print":true,
    "println":true, "real":true, "recover":true
  };

  var isOperatorChar = /[+\-*&^%:=<>!|\/]/;

  var curPunc;

  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'" || ch == "`") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    }
    if (/[\d\.]/.test(ch)) {
      if (ch == ".") {
        stream.match(/^[0-9]+([eE][\-+]?[0-9]+)?/);
      } else if (ch == "0") {
        stream.match(/^[xX][0-9a-fA-F]+/) || stream.match(/^0[0-7]+/);
      } else {
        stream.match(/^[0-9]*\.?[0-9]*([eE][\-+]?[0-9]+)?/);
      }
      return "number";
    }
    if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      curPunc = ch;
      return null;
    }
    if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      }
      if (stream.eat("/")) {
        stream.skipToEnd();
        return "comment";
      }
    }
    if (isOperatorChar.test(ch)) {
      stream.eatWhile(isOperatorChar);
      return "operator";
    }
    stream.eatWhile(/[\w\$_\xa1-\uffff]/);
    var cur = stream.current();
    if (keywords.propertyIsEnumerable(cur)) {
      if (cur == "case" || cur == "default") curPunc = "case";
      return "keyword";
    }
    if (atoms.propertyIsEnumerable(cur)) return "atom";
    return "variable";
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next, end = false;
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) {end = true; break;}
        escaped = !escaped && quote != "`" && next == "\\";
      }
      if (end || !(escaped || quote == "`"))
        state.tokenize = tokenBase;
      return "string";
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return "comment";
  }

  function Context(indented, column, type, align, prev) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.align = align;
    this.prev = prev;
  }
  function pushContext(state, col, type) {
    return state.context = new Context(state.indented, col, type, null, state.context);
  }
  function popContext(state) {
    if (!state.context.prev) return;
    var t = state.context.type;
    if (t == ")" || t == "]" || t == "}")
      state.indented = state.context.indented;
    return state.context = state.context.prev;
  }

  // Interface

  return {
    startState: function(basecolumn) {
      return {
        tokenize: null,
        context: new Context((basecolumn || 0) - indentUnit, 0, "top", false),
        indented: 0,
        startOfLine: true
      };
    },

    token: function(stream, state) {
      var ctx = state.context;
      if (stream.sol()) {
        if (ctx.align == null) ctx.align = false;
        state.indented = stream.indentation();
        state.startOfLine = true;
        if (ctx.type == "case") ctx.type = "}";
      }
      if (stream.eatSpace()) return null;
      curPunc = null;
      var style = (state.tokenize || tokenBase)(stream, state);
      if (style == "comment") return style;
      if (ctx.align == null) ctx.align = true;

      if (curPunc == "{") pushContext(state, stream.column(), "}");
      else if (curPunc == "[") pushContext(state, stream.column(), "]");
      else if (curPunc == "(") pushContext(state, stream.column(), ")");
      else if (curPunc == "case") ctx.type = "case";
      else if (curPunc == "}" && ctx.type == "}") ctx = popContext(state);
      else if (curPunc == ctx.type) popContext(state);
      state.startOfLine = false;
      return style;
    },

    indent: function(state, textAfter) {
      if (state.tokenize != tokenBase && state.tokenize != null) return 0;
      var ctx = state.context, firstChar = textAfter && textAfter.charAt(0);
      if (ctx.type == "case" && /^(?:case|default)\b/.test(textAfter)) {
        state.context.type = "}";
        return ctx.indented;
      }
      var closing = firstChar == ctx.type;
      if (ctx.align) return ctx.column + (closing ? 0 : 1);
      else return ctx.indented + (closing ? 0 : indentUnit);
    },

    electricChars: "{}):",
    fold: "brace",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: "//"
  };
});

CodeMirror.defineMIME("text/x-go", "go");

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../htmlmixed/htmlmixed"), require("../clike/clike"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../htmlmixed/htmlmixed", "../clike/clike"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  function keywords(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }

  // Helper for phpString
  function matchSequence(list, end, escapes) {
    if (list.length == 0) return phpString(end);
    return function (stream, state) {
      var patterns = list[0];
      for (var i = 0; i < patterns.length; i++) if (stream.match(patterns[i][0])) {
        state.tokenize = matchSequence(list.slice(1), end);
        return patterns[i][1];
      }
      state.tokenize = phpString(end, escapes);
      return "string";
    };
  }
  function phpString(closing, escapes) {
    return function(stream, state) { return phpString_(stream, state, closing, escapes); };
  }
  function phpString_(stream, state, closing, escapes) {
    // "Complex" syntax
    if (escapes !== false && stream.match("${", false) || stream.match("{$", false)) {
      state.tokenize = null;
      return "string";
    }

    // Simple syntax
    if (escapes !== false && stream.match(/^\$[a-zA-Z_][a-zA-Z0-9_]*/)) {
      // After the variable name there may appear array or object operator.
      if (stream.match("[", false)) {
        // Match array operator
        state.tokenize = matchSequence([
          [["[", null]],
          [[/\d[\w\.]*/, "number"],
           [/\$[a-zA-Z_][a-zA-Z0-9_]*/, "variable-2"],
           [/[\w\$]+/, "variable"]],
          [["]", null]]
        ], closing, escapes);
      }
      if (stream.match(/\-\>\w/, false)) {
        // Match object operator
        state.tokenize = matchSequence([
          [["->", null]],
          [[/[\w]+/, "variable"]]
        ], closing, escapes);
      }
      return "variable-2";
    }

    var escaped = false;
    // Normal string
    while (!stream.eol() &&
           (escaped || escapes === false ||
            (!stream.match("{$", false) &&
             !stream.match(/^(\$[a-zA-Z_][a-zA-Z0-9_]*|\$\{)/, false)))) {
      if (!escaped && stream.match(closing)) {
        state.tokenize = null;
        state.tokStack.pop(); state.tokStack.pop();
        break;
      }
      escaped = stream.next() == "\\" && !escaped;
    }
    return "string";
  }

  var phpKeywords = "abstract and array as break case catch class clone const continue declare default " +
    "do else elseif enddeclare endfor endforeach endif endswitch endwhile extends final " +
    "for foreach function global goto if implements interface instanceof namespace " +
    "new or private protected public static switch throw trait try use var while xor " +
    "die echo empty exit eval include include_once isset list require require_once return " +
    "print unset __halt_compiler self static parent yield insteadof finally";
  var phpAtoms = "true false null TRUE FALSE NULL __CLASS__ __DIR__ __FILE__ __LINE__ __METHOD__ __FUNCTION__ __NAMESPACE__ __TRAIT__";
  var phpBuiltin = "func_num_args func_get_arg func_get_args strlen strcmp strncmp strcasecmp strncasecmp each error_reporting define defined trigger_error user_error set_error_handler restore_error_handler get_declared_classes get_loaded_extensions extension_loaded get_extension_funcs debug_backtrace constant bin2hex hex2bin sleep usleep time mktime gmmktime strftime gmstrftime strtotime date gmdate getdate localtime checkdate flush wordwrap htmlspecialchars htmlentities html_entity_decode md5 md5_file crc32 getimagesize image_type_to_mime_type phpinfo phpversion phpcredits strnatcmp strnatcasecmp substr_count strspn strcspn strtok strtoupper strtolower strpos strrpos strrev hebrev hebrevc nl2br basename dirname pathinfo stripslashes stripcslashes strstr stristr strrchr str_shuffle str_word_count strcoll substr substr_replace quotemeta ucfirst ucwords strtr addslashes addcslashes rtrim str_replace str_repeat count_chars chunk_split trim ltrim strip_tags similar_text explode implode setlocale localeconv parse_str str_pad chop strchr sprintf printf vprintf vsprintf sscanf fscanf parse_url urlencode urldecode rawurlencode rawurldecode readlink linkinfo link unlink exec system escapeshellcmd escapeshellarg passthru shell_exec proc_open proc_close rand srand getrandmax mt_rand mt_srand mt_getrandmax base64_decode base64_encode abs ceil floor round is_finite is_nan is_infinite bindec hexdec octdec decbin decoct dechex base_convert number_format fmod ip2long long2ip getenv putenv getopt microtime gettimeofday getrusage uniqid quoted_printable_decode set_time_limit get_cfg_var magic_quotes_runtime set_magic_quotes_runtime get_magic_quotes_gpc get_magic_quotes_runtime import_request_variables error_log serialize unserialize memory_get_usage var_dump var_export debug_zval_dump print_r highlight_file show_source highlight_string ini_get ini_get_all ini_set ini_alter ini_restore get_include_path set_include_path restore_include_path setcookie header headers_sent connection_aborted connection_status ignore_user_abort parse_ini_file is_uploaded_file move_uploaded_file intval floatval doubleval strval gettype settype is_null is_resource is_bool is_long is_float is_int is_integer is_double is_real is_numeric is_string is_array is_object is_scalar ereg ereg_replace eregi eregi_replace split spliti join sql_regcase dl pclose popen readfile rewind rmdir umask fclose feof fgetc fgets fgetss fread fopen fpassthru ftruncate fstat fseek ftell fflush fwrite fputs mkdir rename copy tempnam tmpfile file file_get_contents file_put_contents stream_select stream_context_create stream_context_set_params stream_context_set_option stream_context_get_options stream_filter_prepend stream_filter_append fgetcsv flock get_meta_tags stream_set_write_buffer set_file_buffer set_socket_blocking stream_set_blocking socket_set_blocking stream_get_meta_data stream_register_wrapper stream_wrapper_register stream_set_timeout socket_set_timeout socket_get_status realpath fnmatch fsockopen pfsockopen pack unpack get_browser crypt opendir closedir chdir getcwd rewinddir readdir dir glob fileatime filectime filegroup fileinode filemtime fileowner fileperms filesize filetype file_exists is_writable is_writeable is_readable is_executable is_file is_dir is_link stat lstat chown touch clearstatcache mail ob_start ob_flush ob_clean ob_end_flush ob_end_clean ob_get_flush ob_get_clean ob_get_length ob_get_level ob_get_status ob_get_contents ob_implicit_flush ob_list_handlers ksort krsort natsort natcasesort asort arsort sort rsort usort uasort uksort shuffle array_walk count end prev next reset current key min max in_array array_search extract compact array_fill range array_multisort array_push array_pop array_shift array_unshift array_splice array_slice array_merge array_merge_recursive array_keys array_values array_count_values array_reverse array_reduce array_pad array_flip array_change_key_case array_rand array_unique array_intersect array_intersect_assoc array_diff array_diff_assoc array_sum array_filter array_map array_chunk array_key_exists pos sizeof key_exists assert assert_options version_compare ftok str_rot13 aggregate session_name session_module_name session_save_path session_id session_regenerate_id session_decode session_register session_unregister session_is_registered session_encode session_start session_destroy session_unset session_set_save_handler session_cache_limiter session_cache_expire session_set_cookie_params session_get_cookie_params session_write_close preg_match preg_match_all preg_replace preg_replace_callback preg_split preg_quote preg_grep overload ctype_alnum ctype_alpha ctype_cntrl ctype_digit ctype_lower ctype_graph ctype_print ctype_punct ctype_space ctype_upper ctype_xdigit virtual apache_request_headers apache_note apache_lookup_uri apache_child_terminate apache_setenv apache_response_headers apache_get_version getallheaders mysql_connect mysql_pconnect mysql_close mysql_select_db mysql_create_db mysql_drop_db mysql_query mysql_unbuffered_query mysql_db_query mysql_list_dbs mysql_list_tables mysql_list_fields mysql_list_processes mysql_error mysql_errno mysql_affected_rows mysql_insert_id mysql_result mysql_num_rows mysql_num_fields mysql_fetch_row mysql_fetch_array mysql_fetch_assoc mysql_fetch_object mysql_data_seek mysql_fetch_lengths mysql_fetch_field mysql_field_seek mysql_free_result mysql_field_name mysql_field_table mysql_field_len mysql_field_type mysql_field_flags mysql_escape_string mysql_real_escape_string mysql_stat mysql_thread_id mysql_client_encoding mysql_get_client_info mysql_get_host_info mysql_get_proto_info mysql_get_server_info mysql_info mysql mysql_fieldname mysql_fieldtable mysql_fieldlen mysql_fieldtype mysql_fieldflags mysql_selectdb mysql_createdb mysql_dropdb mysql_freeresult mysql_numfields mysql_numrows mysql_listdbs mysql_listtables mysql_listfields mysql_db_name mysql_dbname mysql_tablename mysql_table_name pg_connect pg_pconnect pg_close pg_connection_status pg_connection_busy pg_connection_reset pg_host pg_dbname pg_port pg_tty pg_options pg_ping pg_query pg_send_query pg_cancel_query pg_fetch_result pg_fetch_row pg_fetch_assoc pg_fetch_array pg_fetch_object pg_fetch_all pg_affected_rows pg_get_result pg_result_seek pg_result_status pg_free_result pg_last_oid pg_num_rows pg_num_fields pg_field_name pg_field_num pg_field_size pg_field_type pg_field_prtlen pg_field_is_null pg_get_notify pg_get_pid pg_result_error pg_last_error pg_last_notice pg_put_line pg_end_copy pg_copy_to pg_copy_from pg_trace pg_untrace pg_lo_create pg_lo_unlink pg_lo_open pg_lo_close pg_lo_read pg_lo_write pg_lo_read_all pg_lo_import pg_lo_export pg_lo_seek pg_lo_tell pg_escape_string pg_escape_bytea pg_unescape_bytea pg_client_encoding pg_set_client_encoding pg_meta_data pg_convert pg_insert pg_update pg_delete pg_select pg_exec pg_getlastoid pg_cmdtuples pg_errormessage pg_numrows pg_numfields pg_fieldname pg_fieldsize pg_fieldtype pg_fieldnum pg_fieldprtlen pg_fieldisnull pg_freeresult pg_result pg_loreadall pg_locreate pg_lounlink pg_loopen pg_loclose pg_loread pg_lowrite pg_loimport pg_loexport http_response_code get_declared_traits getimagesizefromstring socket_import_stream stream_set_chunk_size trait_exists header_register_callback class_uses session_status session_register_shutdown echo print global static exit array empty eval isset unset die include require include_once require_once json_decode json_encode json_last_error json_last_error_msg curl_close curl_copy_handle curl_errno curl_error curl_escape curl_exec curl_file_create curl_getinfo curl_init curl_multi_add_handle curl_multi_close curl_multi_exec curl_multi_getcontent curl_multi_info_read curl_multi_init curl_multi_remove_handle curl_multi_select curl_multi_setopt curl_multi_strerror curl_pause curl_reset curl_setopt_array curl_setopt curl_share_close curl_share_init curl_share_setopt curl_strerror curl_unescape curl_version mysqli_affected_rows mysqli_autocommit mysqli_change_user mysqli_character_set_name mysqli_close mysqli_commit mysqli_connect_errno mysqli_connect_error mysqli_connect mysqli_data_seek mysqli_debug mysqli_dump_debug_info mysqli_errno mysqli_error_list mysqli_error mysqli_fetch_all mysqli_fetch_array mysqli_fetch_assoc mysqli_fetch_field_direct mysqli_fetch_field mysqli_fetch_fields mysqli_fetch_lengths mysqli_fetch_object mysqli_fetch_row mysqli_field_count mysqli_field_seek mysqli_field_tell mysqli_free_result mysqli_get_charset mysqli_get_client_info mysqli_get_client_stats mysqli_get_client_version mysqli_get_connection_stats mysqli_get_host_info mysqli_get_proto_info mysqli_get_server_info mysqli_get_server_version mysqli_info mysqli_init mysqli_insert_id mysqli_kill mysqli_more_results mysqli_multi_query mysqli_next_result mysqli_num_fields mysqli_num_rows mysqli_options mysqli_ping mysqli_prepare mysqli_query mysqli_real_connect mysqli_real_escape_string mysqli_real_query mysqli_reap_async_query mysqli_refresh mysqli_rollback mysqli_select_db mysqli_set_charset mysqli_set_local_infile_default mysqli_set_local_infile_handler mysqli_sqlstate mysqli_ssl_set mysqli_stat mysqli_stmt_init mysqli_store_result mysqli_thread_id mysqli_thread_safe mysqli_use_result mysqli_warning_count";
  CodeMirror.registerHelper("hintWords", "php", [phpKeywords, phpAtoms, phpBuiltin].join(" ").split(" "));
  CodeMirror.registerHelper("wordChars", "php", /[\w$]/);

  var phpConfig = {
    name: "clike",
    helperType: "php",
    keywords: keywords(phpKeywords),
    blockKeywords: keywords("catch do else elseif for foreach if switch try while finally"),
    defKeywords: keywords("class function interface namespace trait"),
    atoms: keywords(phpAtoms),
    builtin: keywords(phpBuiltin),
    multiLineStrings: true,
    hooks: {
      "$": function(stream) {
        stream.eatWhile(/[\w\$_]/);
        return "variable-2";
      },
      "<": function(stream, state) {
        var before;
        if (before = stream.match(/<<\s*/)) {
          var quoted = stream.eat(/['"]/);
          stream.eatWhile(/[\w\.]/);
          var delim = stream.current().slice(before[0].length + (quoted ? 2 : 1));
          if (quoted) stream.eat(quoted);
          if (delim) {
            (state.tokStack || (state.tokStack = [])).push(delim, 0);
            state.tokenize = phpString(delim, quoted != "'");
            return "string";
          }
        }
        return false;
      },
      "#": function(stream) {
        while (!stream.eol() && !stream.match("?>", false)) stream.next();
        return "comment";
      },
      "/": function(stream) {
        if (stream.eat("/")) {
          while (!stream.eol() && !stream.match("?>", false)) stream.next();
          return "comment";
        }
        return false;
      },
      '"': function(_stream, state) {
        (state.tokStack || (state.tokStack = [])).push('"', 0);
        state.tokenize = phpString('"');
        return "string";
      },
      "{": function(_stream, state) {
        if (state.tokStack && state.tokStack.length)
          state.tokStack[state.tokStack.length - 1]++;
        return false;
      },
      "}": function(_stream, state) {
        if (state.tokStack && state.tokStack.length > 0 &&
            !--state.tokStack[state.tokStack.length - 1]) {
          state.tokenize = phpString(state.tokStack[state.tokStack.length - 2]);
        }
        return false;
      }
    }
  };

  CodeMirror.defineMode("php", function(config, parserConfig) {
    var htmlMode = CodeMirror.getMode(config, "text/html");
    var phpMode = CodeMirror.getMode(config, phpConfig);

    function dispatch(stream, state) {
      var isPHP = state.curMode == phpMode;
      if (stream.sol() && state.pending && state.pending != '"' && state.pending != "'") state.pending = null;
      if (!isPHP) {
        if (stream.match(/^<\?\w*/)) {
          state.curMode = phpMode;
          if (!state.php) state.php = CodeMirror.startState(phpMode, htmlMode.indent(state.html, ""))
          state.curState = state.php;
          return "meta";
        }
        if (state.pending == '"' || state.pending == "'") {
          while (!stream.eol() && stream.next() != state.pending) {}
          var style = "string";
        } else if (state.pending && stream.pos < state.pending.end) {
          stream.pos = state.pending.end;
          var style = state.pending.style;
        } else {
          var style = htmlMode.token(stream, state.curState);
        }
        if (state.pending) state.pending = null;
        var cur = stream.current(), openPHP = cur.search(/<\?/), m;
        if (openPHP != -1) {
          if (style == "string" && (m = cur.match(/[\'\"]$/)) && !/\?>/.test(cur)) state.pending = m[0];
          else state.pending = {end: stream.pos, style: style};
          stream.backUp(cur.length - openPHP);
        }
        return style;
      } else if (isPHP && state.php.tokenize == null && stream.match("?>")) {
        state.curMode = htmlMode;
        state.curState = state.html;
        if (!state.php.context.prev) state.php = null;
        return "meta";
      } else {
        return phpMode.token(stream, state.curState);
      }
    }

    return {
      startState: function() {
        var html = CodeMirror.startState(htmlMode)
        var php = parserConfig.startOpen ? CodeMirror.startState(phpMode) : null
        return {html: html,
                php: php,
                curMode: parserConfig.startOpen ? phpMode : htmlMode,
                curState: parserConfig.startOpen ? php : html,
                pending: null};
      },

      copyState: function(state) {
        var html = state.html, htmlNew = CodeMirror.copyState(htmlMode, html),
            php = state.php, phpNew = php && CodeMirror.copyState(phpMode, php), cur;
        if (state.curMode == htmlMode) cur = htmlNew;
        else cur = phpNew;
        return {html: htmlNew, php: phpNew, curMode: state.curMode, curState: cur,
                pending: state.pending};
      },

      token: dispatch,

      indent: function(state, textAfter) {
        if ((state.curMode != phpMode && /^\s*<\//.test(textAfter)) ||
            (state.curMode == phpMode && /^\?>/.test(textAfter)))
          return htmlMode.indent(state.html, textAfter);
        return state.curMode.indent(state.curState, textAfter);
      },

      blockCommentStart: "/*",
      blockCommentEnd: "*/",
      lineComment: "//",

      innerMode: function(state) { return {state: state.curState, mode: state.curMode}; }
    };
  }, "htmlmixed", "clike");

  CodeMirror.defineMIME("application/x-httpd-php", "php");
  CodeMirror.defineMIME("application/x-httpd-php-open", {name: "php", startOpen: true});
  CodeMirror.defineMIME("text/x-php", phpConfig);
});

;(function(){
var h, aa = aa || {}, ba = this;
function ca(a) {
  return void 0 !== a;
}
function da() {
}
function p(a) {
  var b = typeof a;
  if ("object" == b) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return b;
      }
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c) {
        return "object";
      }
      if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == b && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return b;
}
function fa(a) {
  return "array" == p(a);
}
function ga(a) {
  var b = p(a);
  return "array" == b || "object" == b && "number" == typeof a.length;
}
function ha(a) {
  return "string" == typeof a;
}
function ia(a) {
  return "function" == p(a);
}
function ja(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
}
function la(a) {
  return a[ma] || (a[ma] = ++na);
}
var ma = "closure_uid_" + (1E9 * Math.random() >>> 0), na = 0;
function oa(a, b, c) {
  return a.call.apply(a.bind, arguments);
}
function qa(a, b, c) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
}
function ra(a, b, c) {
  ra = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? oa : qa;
  return ra.apply(null, arguments);
}
var ua = Date.now || function() {
  return +new Date;
};
function va(a, b) {
  var c = a.split("."), d = ba;
  c[0] in d || !d.execScript || d.execScript("var " + c[0]);
  for (var e;c.length && (e = c.shift());) {
    !c.length && ca(b) ? d[e] = b : d = d[e] ? d[e] : d[e] = {};
  }
}
function ya(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.$f = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.base = function(a, c, f) {
    for (var g = Array(arguments.length - 2), k = 2;k < arguments.length;k++) {
      g[k - 2] = arguments[k];
    }
    return b.prototype[c].apply(a, g);
  };
}
;function za(a, b) {
  for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1);e.length && 1 < c.length;) {
    d += c.shift() + e.shift();
  }
  return d + c.join("%s");
}
function Aa(a) {
  return /^[\s\xa0]*$/.test(a);
}
var Ba = String.prototype.trim ? function(a) {
  return a.trim();
} : function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
function Ca(a) {
  if (!Da.test(a)) {
    return a;
  }
  -1 != a.indexOf("\x26") && (a = a.replace(Ea, "\x26amp;"));
  -1 != a.indexOf("\x3c") && (a = a.replace(Fa, "\x26lt;"));
  -1 != a.indexOf("\x3e") && (a = a.replace(Ha, "\x26gt;"));
  -1 != a.indexOf('"') && (a = a.replace(Ia, "\x26quot;"));
  -1 != a.indexOf("'") && (a = a.replace(Ja, "\x26#39;"));
  -1 != a.indexOf("\x00") && (a = a.replace(Ka, "\x26#0;"));
  return a;
}
var Ea = /&/g, Fa = /</g, Ha = />/g, Ia = /"/g, Ja = /'/g, Ka = /\x00/g, Da = /[\x00&<>"']/;
function La(a) {
  return null == a ? "" : String(a);
}
function Ma(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
;function Na(a, b) {
  for (var c in a) {
    b.call(void 0, a[c], c, a);
  }
}
function Oa(a, b) {
  for (var c in a) {
    if (b.call(void 0, a[c], c, a)) {
      return !0;
    }
  }
  return !1;
}
function Pa(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = a[d];
  }
  return b;
}
function Qa(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = d;
  }
  return b;
}
var Ta = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function Ua(a, b) {
  for (var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for (c in d) {
      a[c] = d[c];
    }
    for (var f = 0;f < Ta.length;f++) {
      c = Ta[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
}
;function Va(a, b) {
  this.oa = [];
  this.Ab = b;
  for (var c = !0, d = a.length - 1;0 <= d;d--) {
    var e = a[d] | 0;
    c && e == b || (this.oa[d] = e, c = !1);
  }
}
var Xa = {};
function Ya(a) {
  if (-128 <= a && 128 > a) {
    var b = Xa[a];
    if (b) {
      return b;
    }
  }
  b = new Va([a | 0], 0 > a ? -1 : 0);
  -128 <= a && 128 > a && (Xa[a] = b);
  return b;
}
function Za(a) {
  if (isNaN(a) || !isFinite(a)) {
    return $a;
  }
  if (0 > a) {
    return Za(-a).ba();
  }
  for (var b = [], c = 1, d = 0;a >= c;d++) {
    b[d] = a / c | 0, c *= ab;
  }
  return new Va(b, 0);
}
var ab = 4294967296, $a = Ya(0), bb = Ya(1), cb = Ya(16777216);
h = Va.prototype;
h.Pd = function() {
  return 0 < this.oa.length ? this.oa[0] : this.Ab;
};
h.Ob = function() {
  if (this.ra()) {
    return -this.ba().Ob();
  }
  for (var a = 0, b = 1, c = 0;c < this.oa.length;c++) {
    var d = eb(this, c), a = a + (0 <= d ? d : ab + d) * b, b = b * ab
  }
  return a;
};
h.toString = function(a) {
  a = a || 10;
  if (2 > a || 36 < a) {
    throw Error("radix out of range: " + a);
  }
  if (this.Za()) {
    return "0";
  }
  if (this.ra()) {
    return "-" + this.ba().toString(a);
  }
  for (var b = Za(Math.pow(a, 6)), c = this, d = "";;) {
    var e = fb(c, b), f = (c.ec(e.multiply(b)).Pd() >>> 0).toString(a), c = e;
    if (c.Za()) {
      return f + d;
    }
    for (;6 > f.length;) {
      f = "0" + f;
    }
    d = "" + f + d;
  }
};
function eb(a, b) {
  return 0 > b ? 0 : b < a.oa.length ? a.oa[b] : a.Ab;
}
h.Za = function() {
  if (0 != this.Ab) {
    return !1;
  }
  for (var a = 0;a < this.oa.length;a++) {
    if (0 != this.oa[a]) {
      return !1;
    }
  }
  return !0;
};
h.ra = function() {
  return -1 == this.Ab;
};
h.Se = function() {
  return 0 == this.oa.length && -1 == this.Ab || 0 < this.oa.length && 0 != (this.oa[0] & 1);
};
h.eb = function(a) {
  if (this.Ab != a.Ab) {
    return !1;
  }
  for (var b = Math.max(this.oa.length, a.oa.length), c = 0;c < b;c++) {
    if (eb(this, c) != eb(a, c)) {
      return !1;
    }
  }
  return !0;
};
h.de = function(a) {
  return 0 < this.compare(a);
};
h.Oe = function(a) {
  return 0 <= this.compare(a);
};
h.Zc = function(a) {
  return 0 > this.compare(a);
};
h.Te = function(a) {
  return 0 >= this.compare(a);
};
h.compare = function(a) {
  a = this.ec(a);
  return a.ra() ? -1 : a.Za() ? 0 : 1;
};
h.ba = function() {
  return this.Ve().add(bb);
};
h.add = function(a) {
  for (var b = Math.max(this.oa.length, a.oa.length), c = [], d = 0, e = 0;e <= b;e++) {
    var f = d + (eb(this, e) & 65535) + (eb(a, e) & 65535), g = (f >>> 16) + (eb(this, e) >>> 16) + (eb(a, e) >>> 16), d = g >>> 16, f = f & 65535, g = g & 65535;
    c[e] = g << 16 | f;
  }
  return new Va(c, c[c.length - 1] & -2147483648 ? -1 : 0);
};
h.ec = function(a) {
  return this.add(a.ba());
};
h.multiply = function(a) {
  if (this.Za() || a.Za()) {
    return $a;
  }
  if (this.ra()) {
    return a.ra() ? this.ba().multiply(a.ba()) : this.ba().multiply(a).ba();
  }
  if (a.ra()) {
    return this.multiply(a.ba()).ba();
  }
  if (this.Zc(cb) && a.Zc(cb)) {
    return Za(this.Ob() * a.Ob());
  }
  for (var b = this.oa.length + a.oa.length, c = [], d = 0;d < 2 * b;d++) {
    c[d] = 0;
  }
  for (d = 0;d < this.oa.length;d++) {
    for (var e = 0;e < a.oa.length;e++) {
      var f = eb(this, d) >>> 16, g = eb(this, d) & 65535, k = eb(a, e) >>> 16, l = eb(a, e) & 65535;
      c[2 * d + 2 * e] += g * l;
      gb(c, 2 * d + 2 * e);
      c[2 * d + 2 * e + 1] += f * l;
      gb(c, 2 * d + 2 * e + 1);
      c[2 * d + 2 * e + 1] += g * k;
      gb(c, 2 * d + 2 * e + 1);
      c[2 * d + 2 * e + 2] += f * k;
      gb(c, 2 * d + 2 * e + 2);
    }
  }
  for (d = 0;d < b;d++) {
    c[d] = c[2 * d + 1] << 16 | c[2 * d];
  }
  for (d = b;d < 2 * b;d++) {
    c[d] = 0;
  }
  return new Va(c, 0);
};
function gb(a, b) {
  for (;(a[b] & 65535) != a[b];) {
    a[b + 1] += a[b] >>> 16, a[b] &= 65535;
  }
}
function fb(a, b) {
  if (b.Za()) {
    throw Error("division by zero");
  }
  if (a.Za()) {
    return $a;
  }
  if (a.ra()) {
    return b.ra() ? fb(a.ba(), b.ba()) : fb(a.ba(), b).ba();
  }
  if (b.ra()) {
    return fb(a, b.ba()).ba();
  }
  if (30 < a.oa.length) {
    if (a.ra() || b.ra()) {
      throw Error("slowDivide_ only works with positive integers.");
    }
    for (var c = bb, d = b;d.Te(a);) {
      c = c.shiftLeft(1), d = d.shiftLeft(1);
    }
    for (var e = c.uc(1), f = d.uc(1), g, d = d.uc(2), c = c.uc(2);!d.Za();) {
      g = f.add(d), g.Te(a) && (e = e.add(c), f = g), d = d.uc(1), c = c.uc(1);
    }
    return e;
  }
  c = $a;
  for (d = a;d.Oe(b);) {
    e = Math.max(1, Math.floor(d.Ob() / b.Ob()));
    f = Math.ceil(Math.log(e) / Math.LN2);
    f = 48 >= f ? 1 : Math.pow(2, f - 48);
    g = Za(e);
    for (var k = g.multiply(b);k.ra() || k.de(d);) {
      e -= f, g = Za(e), k = g.multiply(b);
    }
    g.Za() && (g = bb);
    c = c.add(g);
    d = d.ec(k);
  }
  return c;
}
h.Ve = function() {
  for (var a = this.oa.length, b = [], c = 0;c < a;c++) {
    b[c] = ~this.oa[c];
  }
  return new Va(b, ~this.Ab);
};
h.jf = function(a) {
  for (var b = Math.max(this.oa.length, a.oa.length), c = [], d = 0;d < b;d++) {
    c[d] = eb(this, d) & eb(a, d);
  }
  return new Va(c, this.Ab & a.Ab);
};
h.shiftLeft = function(a) {
  var b = a >> 5;
  a %= 32;
  for (var c = this.oa.length + b + (0 < a ? 1 : 0), d = [], e = 0;e < c;e++) {
    d[e] = 0 < a ? eb(this, e - b) << a | eb(this, e - b - 1) >>> 32 - a : eb(this, e - b);
  }
  return new Va(d, this.Ab);
};
h.uc = function(a) {
  var b = a >> 5;
  a %= 32;
  for (var c = this.oa.length - b, d = [], e = 0;e < c;e++) {
    d[e] = 0 < a ? eb(this, e + b) >>> a | eb(this, e + b + 1) << 32 - a : eb(this, e + b);
  }
  return new Va(d, this.Ab);
};
function hb(a, b) {
  null != a && this.append.apply(this, arguments);
}
h = hb.prototype;
h.ic = "";
h.set = function(a) {
  this.ic = "" + a;
};
h.append = function(a, b, c) {
  this.ic += String(a);
  if (null != b) {
    for (var d = 1;d < arguments.length;d++) {
      this.ic += arguments[d];
    }
  }
  return this;
};
h.clear = function() {
  this.ic = "";
};
h.toString = function() {
  return this.ic;
};
function ib(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ib);
  } else {
    var b = Error().stack;
    b && (this.stack = b);
  }
  a && (this.message = String(a));
}
ya(ib, Error);
ib.prototype.name = "CustomError";
function jb(a, b) {
  b.unshift(a);
  ib.call(this, za.apply(null, b));
  b.shift();
}
ya(jb, ib);
jb.prototype.name = "AssertionError";
function mb(a, b) {
  throw new jb("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
}
;var nb = Array.prototype.indexOf ? function(a, b, c) {
  return Array.prototype.indexOf.call(a, b, c);
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if (ha(a)) {
    return ha(b) && 1 == b.length ? a.indexOf(b, c) : -1;
  }
  for (;c < a.length;c++) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return -1;
}, ob = Array.prototype.forEach ? function(a, b, c) {
  Array.prototype.forEach.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = ha(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a);
  }
}, pb = Array.prototype.some ? function(a, b, c) {
  return Array.prototype.some.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = ha(a) ? a.split("") : a, f = 0;f < d;f++) {
    if (f in e && b.call(c, e[f], f, a)) {
      return !0;
    }
  }
  return !1;
};
function qb(a) {
  var b;
  a: {
    b = sb;
    for (var c = a.length, d = ha(a) ? a.split("") : a, e = 0;e < c;e++) {
      if (e in d && b.call(void 0, d[e], e, a)) {
        b = e;
        break a;
      }
    }
    b = -1;
  }
  return 0 > b ? null : ha(a) ? a.charAt(b) : a[b];
}
function tb(a) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
}
function ub(a) {
  var b = a.length;
  if (0 < b) {
    for (var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d];
    }
    return c;
  }
  return [];
}
function vb(a, b) {
  a.sort(b || wb);
}
function xb(a, b) {
  for (var c = Array(a.length), d = 0;d < a.length;d++) {
    c[d] = {index:d, value:a[d]};
  }
  var e = b || wb;
  vb(c, function(a, b) {
    return e(a.value, b.value) || a.index - b.index;
  });
  for (d = 0;d < a.length;d++) {
    a[d] = c[d].value;
  }
}
function wb(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}
;function yb(a) {
  yb[" "](a);
  return a;
}
yb[" "] = da;
function zb(a, b, c) {
  return Object.prototype.hasOwnProperty.call(a, b) ? a[b] : a[b] = c(b);
}
;function Ab(a, b) {
  this.za = a | 0;
  this.Sa = b | 0;
}
var Bb = {}, Cb = {};
function Db(a) {
  return -128 <= a && 128 > a ? zb(Bb, a, function(a) {
    return new Ab(a | 0, 0 > a ? -1 : 0);
  }) : new Ab(a | 0, 0 > a ? -1 : 0);
}
function Eb(a) {
  return isNaN(a) ? Fb() : a <= -Gb ? Hb() : a + 1 >= Gb ? Ib() : 0 > a ? Eb(-a).ba() : new Ab(a % Jb | 0, a / Jb | 0);
}
function Kb(a, b) {
  return new Ab(a, b);
}
function Lb(a, b) {
  if (0 == a.length) {
    throw Error("number format error: empty string");
  }
  var c = b || 10;
  if (2 > c || 36 < c) {
    throw Error("radix out of range: " + c);
  }
  if ("-" == a.charAt(0)) {
    return Lb(a.substring(1), c).ba();
  }
  if (0 <= a.indexOf("-")) {
    throw Error('number format error: interior "-" character: ' + a);
  }
  for (var d = Eb(Math.pow(c, 8)), e = Fb(), f = 0;f < a.length;f += 8) {
    var g = Math.min(8, a.length - f), k = parseInt(a.substring(f, f + g), c);
    8 > g ? (g = Eb(Math.pow(c, g)), e = e.multiply(g).add(Eb(k))) : (e = e.multiply(d), e = e.add(Eb(k)));
  }
  return e;
}
var Jb = 4294967296, Gb = Jb * Jb / 2;
function Fb() {
  return zb(Cb, Nb, function() {
    return Db(0);
  });
}
function Ob() {
  return zb(Cb, Pb, function() {
    return Db(1);
  });
}
function Qb() {
  return zb(Cb, Rb, function() {
    return Db(-1);
  });
}
function Ib() {
  return zb(Cb, Sb, function() {
    return Kb(-1, 2147483647);
  });
}
function Hb() {
  return zb(Cb, Tb, function() {
    return Kb(0, -2147483648);
  });
}
function Ub() {
  return zb(Cb, Vb, function() {
    return Db(16777216);
  });
}
h = Ab.prototype;
h.Pd = function() {
  return this.za;
};
h.Ob = function() {
  return this.Sa * Jb + (0 <= this.za ? this.za : Jb + this.za);
};
h.toString = function(a) {
  a = a || 10;
  if (2 > a || 36 < a) {
    throw Error("radix out of range: " + a);
  }
  if (this.Za()) {
    return "0";
  }
  if (this.ra()) {
    if (this.eb(Hb())) {
      var b = Eb(a), c = this.div(b), b = c.multiply(b).ec(this);
      return c.toString(a) + b.Pd().toString(a);
    }
    return "-" + this.ba().toString(a);
  }
  for (var c = Eb(Math.pow(a, 6)), b = this, d = "";;) {
    var e = b.div(c), f = (b.ec(e.multiply(c)).Pd() >>> 0).toString(a), b = e;
    if (b.Za()) {
      return f + d;
    }
    for (;6 > f.length;) {
      f = "0" + f;
    }
    d = "" + f + d;
  }
};
h.Za = function() {
  return 0 == this.Sa && 0 == this.za;
};
h.ra = function() {
  return 0 > this.Sa;
};
h.Se = function() {
  return 1 == (this.za & 1);
};
h.eb = function(a) {
  return this.Sa == a.Sa && this.za == a.za;
};
h.Zc = function(a) {
  return 0 > this.compare(a);
};
h.Te = function(a) {
  return 0 >= this.compare(a);
};
h.de = function(a) {
  return 0 < this.compare(a);
};
h.Oe = function(a) {
  return 0 <= this.compare(a);
};
h.compare = function(a) {
  if (this.eb(a)) {
    return 0;
  }
  var b = this.ra(), c = a.ra();
  return b && !c ? -1 : !b && c ? 1 : this.ec(a).ra() ? -1 : 1;
};
h.ba = function() {
  return this.eb(Hb()) ? Hb() : this.Ve().add(Ob());
};
h.add = function(a) {
  var b = this.Sa >>> 16, c = this.Sa & 65535, d = this.za >>> 16, e = a.Sa >>> 16, f = a.Sa & 65535, g = a.za >>> 16;
  a = 0 + ((this.za & 65535) + (a.za & 65535));
  g = 0 + (a >>> 16) + (d + g);
  d = 0 + (g >>> 16);
  d += c + f;
  b = 0 + (d >>> 16) + (b + e) & 65535;
  return Kb((g & 65535) << 16 | a & 65535, b << 16 | d & 65535);
};
h.ec = function(a) {
  return this.add(a.ba());
};
h.multiply = function(a) {
  if (this.Za() || a.Za()) {
    return Fb();
  }
  if (this.eb(Hb())) {
    return a.Se() ? Hb() : Fb();
  }
  if (a.eb(Hb())) {
    return this.Se() ? Hb() : Fb();
  }
  if (this.ra()) {
    return a.ra() ? this.ba().multiply(a.ba()) : this.ba().multiply(a).ba();
  }
  if (a.ra()) {
    return this.multiply(a.ba()).ba();
  }
  if (this.Zc(Ub()) && a.Zc(Ub())) {
    return Eb(this.Ob() * a.Ob());
  }
  var b = this.Sa >>> 16, c = this.Sa & 65535, d = this.za >>> 16, e = this.za & 65535, f = a.Sa >>> 16, g = a.Sa & 65535, k = a.za >>> 16;
  a = a.za & 65535;
  var l, n, m, r;
  r = 0 + e * a;
  m = 0 + (r >>> 16) + d * a;
  n = 0 + (m >>> 16);
  m = (m & 65535) + e * k;
  n += m >>> 16;
  m &= 65535;
  n += c * a;
  l = 0 + (n >>> 16);
  n = (n & 65535) + d * k;
  l += n >>> 16;
  n = (n & 65535) + e * g;
  l += n >>> 16;
  n &= 65535;
  return Kb(m << 16 | r & 65535, (l + (b * a + c * k + d * g + e * f) & 65535) << 16 | n);
};
h.div = function(a) {
  if (a.Za()) {
    throw Error("division by zero");
  }
  if (this.Za()) {
    return Fb();
  }
  if (this.eb(Hb())) {
    if (a.eb(Ob()) || a.eb(Qb())) {
      return Hb();
    }
    if (a.eb(Hb())) {
      return Ob();
    }
    var b = this.uc(1).div(a).shiftLeft(1);
    if (b.eb(Fb())) {
      return a.ra() ? Ob() : Qb();
    }
    var c = this.ec(a.multiply(b));
    return b.add(c.div(a));
  }
  if (a.eb(Hb())) {
    return Fb();
  }
  if (this.ra()) {
    return a.ra() ? this.ba().div(a.ba()) : this.ba().div(a).ba();
  }
  if (a.ra()) {
    return this.div(a.ba()).ba();
  }
  for (var d = Fb(), c = this;c.Oe(a);) {
    for (var b = Math.max(1, Math.floor(c.Ob() / a.Ob())), e = Math.ceil(Math.log(b) / Math.LN2), e = 48 >= e ? 1 : Math.pow(2, e - 48), f = Eb(b), g = f.multiply(a);g.ra() || g.de(c);) {
      b -= e, f = Eb(b), g = f.multiply(a);
    }
    f.Za() && (f = Ob());
    d = d.add(f);
    c = c.ec(g);
  }
  return d;
};
h.Ve = function() {
  return Kb(~this.za, ~this.Sa);
};
h.jf = function(a) {
  return Kb(this.za & a.za, this.Sa & a.Sa);
};
h.shiftLeft = function(a) {
  a &= 63;
  if (0 == a) {
    return this;
  }
  var b = this.za;
  return 32 > a ? Kb(b << a, this.Sa << a | b >>> 32 - a) : Kb(0, b << a - 32);
};
h.uc = function(a) {
  a &= 63;
  if (0 == a) {
    return this;
  }
  var b = this.Sa;
  return 32 > a ? Kb(this.za >>> a | b << 32 - a, b >> a) : Kb(b >> a - 32, 0 <= b ? 0 : -1);
};
function Wb(a, b) {
  b &= 63;
  if (0 == b) {
    return a;
  }
  var c = a.Sa;
  return 32 > b ? Kb(a.za >>> b | c << 32 - b, c >>> b) : 32 == b ? Kb(c, 0) : Kb(c >>> b - 32, 0);
}
var Sb = 1, Tb = 2, Nb = 3, Pb = 4, Rb = 5, Vb = 6;
var Xb;
if ("undefined" === typeof Yb) {
  var Yb = function() {
    throw Error("No *print-fn* fn set for evaluation environment");
  }
}
if ("undefined" === typeof Zb) {
  var Zb = function() {
    throw Error("No *print-err-fn* fn set for evaluation environment");
  }
}
var $b = null;
if ("undefined" === typeof ac) {
  var ac = null
}
function bc() {
  return new q(null, 5, [cc, !0, dc, !0, ec, !1, fc, !1, gc, null], null);
}
function hc() {
  Yb = function() {
    function a(a) {
      var d = null;
      if (0 < arguments.length) {
        for (var d = 0, e = Array(arguments.length - 0);d < e.length;) {
          e[d] = arguments[d + 0], ++d;
        }
        d = new w(e, 0);
      }
      return b.call(this, d);
    }
    function b(a) {
      return console.log.apply(console, ic ? jc(a) : kc.call(null, a));
    }
    a.L = 0;
    a.H = function(a) {
      a = x(a);
      return b(a);
    };
    a.A = b;
    return a;
  }();
  Zb = function() {
    function a(a) {
      var d = null;
      if (0 < arguments.length) {
        for (var d = 0, e = Array(arguments.length - 0);d < e.length;) {
          e[d] = arguments[d + 0], ++d;
        }
        d = new w(e, 0);
      }
      return b.call(this, d);
    }
    function b(a) {
      return console.error.apply(console, ic ? jc(a) : kc.call(null, a));
    }
    a.L = 0;
    a.H = function(a) {
      a = x(a);
      return b(a);
    };
    a.A = b;
    return a;
  }();
}
function z(a) {
  return null != a && !1 !== a;
}
function lc(a) {
  return null == a;
}
function mc(a) {
  return a instanceof Array;
}
function nc(a) {
  return null == a ? !0 : !1 === a ? !0 : !1;
}
function oc(a) {
  return ha(a);
}
function A(a, b) {
  return a[p(null == b ? null : b)] ? !0 : a._ ? !0 : !1;
}
function qc(a) {
  return null == a ? null : a.constructor;
}
function C(a, b) {
  var c = qc(b), c = z(z(c) ? c.Db : c) ? c.ob : p(b);
  return Error(["No protocol method ", a, " defined for type ", c, ": ", b].join(""));
}
function rc(a) {
  var b = a.ob;
  return z(b) ? b : "" + E(a);
}
var sc = "undefined" !== typeof Symbol && "function" === p(Symbol) ? Symbol.iterator : "@@iterator";
function tc(a) {
  for (var b = a.length, c = Array(b), d = 0;;) {
    if (d < b) {
      c[d] = a[d], d += 1;
    } else {
      break;
    }
  }
  return c;
}
function kc(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 1:
      return jc(arguments[0]);
    case 2:
      return jc(arguments[1]);
    default:
      throw Error([E("Invalid arity: "), E(b.length)].join(""));;
  }
}
function ic(a) {
  return jc(a);
}
function jc(a) {
  function b(a, b) {
    a.push(b);
    return a;
  }
  var c = [];
  return uc ? uc(b, c, a) : vc.call(null, b, c, a);
}
function wc() {
}
var xc = function xc(b) {
  if (null != b && null != b.Xa) {
    return b.Xa(b);
  }
  var c = xc[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = xc._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("ICloneable.-clone", b);
};
function yc() {
}
var zc = function zc(b) {
  if (null != b && null != b.ia) {
    return b.ia(b);
  }
  var c = zc[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = zc._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("ICounted.-count", b);
}, Ac = function Ac(b) {
  if (null != b && null != b.ma) {
    return b.ma(b);
  }
  var c = Ac[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Ac._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IEmptyableCollection.-empty", b);
};
function Bc() {
}
var Cc = function Cc(b, c) {
  if (null != b && null != b.ea) {
    return b.ea(b, c);
  }
  var d = Cc[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = Cc._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("ICollection.-conj", b);
};
function Dc() {
}
var Ec = function Ec(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 2:
      return Ec.j(arguments[0], arguments[1]);
    case 3:
      return Ec.l(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([E("Invalid arity: "), E(c.length)].join(""));;
  }
};
Ec.j = function(a, b) {
  if (null != a && null != a.Z) {
    return a.Z(a, b);
  }
  var c = Ec[p(null == a ? null : a)];
  if (null != c) {
    return c.j ? c.j(a, b) : c.call(null, a, b);
  }
  c = Ec._;
  if (null != c) {
    return c.j ? c.j(a, b) : c.call(null, a, b);
  }
  throw C("IIndexed.-nth", a);
};
Ec.l = function(a, b, c) {
  if (null != a && null != a.cb) {
    return a.cb(a, b, c);
  }
  var d = Ec[p(null == a ? null : a)];
  if (null != d) {
    return d.l ? d.l(a, b, c) : d.call(null, a, b, c);
  }
  d = Ec._;
  if (null != d) {
    return d.l ? d.l(a, b, c) : d.call(null, a, b, c);
  }
  throw C("IIndexed.-nth", a);
};
Ec.L = 3;
function Fc() {
}
var Gc = function Gc(b) {
  if (null != b && null != b.xa) {
    return b.xa(b);
  }
  var c = Gc[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Gc._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("ISeq.-first", b);
}, Hc = function Hc(b) {
  if (null != b && null != b.Qa) {
    return b.Qa(b);
  }
  var c = Hc[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Hc._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("ISeq.-rest", b);
};
function Ic() {
}
function Jc() {
}
var Kc = function Kc(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 2:
      return Kc.j(arguments[0], arguments[1]);
    case 3:
      return Kc.l(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([E("Invalid arity: "), E(c.length)].join(""));;
  }
};
Kc.j = function(a, b) {
  if (null != a && null != a.N) {
    return a.N(a, b);
  }
  var c = Kc[p(null == a ? null : a)];
  if (null != c) {
    return c.j ? c.j(a, b) : c.call(null, a, b);
  }
  c = Kc._;
  if (null != c) {
    return c.j ? c.j(a, b) : c.call(null, a, b);
  }
  throw C("ILookup.-lookup", a);
};
Kc.l = function(a, b, c) {
  if (null != a && null != a.M) {
    return a.M(a, b, c);
  }
  var d = Kc[p(null == a ? null : a)];
  if (null != d) {
    return d.l ? d.l(a, b, c) : d.call(null, a, b, c);
  }
  d = Kc._;
  if (null != d) {
    return d.l ? d.l(a, b, c) : d.call(null, a, b, c);
  }
  throw C("ILookup.-lookup", a);
};
Kc.L = 3;
function Lc() {
}
var Mc = function Mc(b, c) {
  if (null != b && null != b.Ud) {
    return b.Ud(b, c);
  }
  var d = Mc[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = Mc._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("IAssociative.-contains-key?", b);
}, Nc = function Nc(b, c, d) {
  if (null != b && null != b.Qb) {
    return b.Qb(b, c, d);
  }
  var e = Nc[p(null == b ? null : b)];
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  e = Nc._;
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  throw C("IAssociative.-assoc", b);
};
function Oc() {
}
var Pc = function Pc(b, c) {
  if (null != b && null != b.Tc) {
    return b.Tc(b, c);
  }
  var d = Pc[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = Pc._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("IMap.-dissoc", b);
};
function Qc() {
}
var Rc = function Rc(b) {
  if (null != b && null != b.nd) {
    return b.nd(b);
  }
  var c = Rc[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Rc._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IMapEntry.-key", b);
}, Sc = function Sc(b) {
  if (null != b && null != b.od) {
    return b.od(b);
  }
  var c = Sc[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Sc._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IMapEntry.-val", b);
};
function Tc() {
}
var Uc = function Uc(b) {
  if (null != b && null != b.kc) {
    return b.kc(b);
  }
  var c = Uc[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Uc._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IStack.-peek", b);
}, Vc = function Vc(b) {
  if (null != b && null != b.lc) {
    return b.lc(b);
  }
  var c = Vc[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Vc._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IStack.-pop", b);
};
function Wc() {
}
var Xc = function Xc(b, c, d) {
  if (null != b && null != b.Ac) {
    return b.Ac(b, c, d);
  }
  var e = Xc[p(null == b ? null : b)];
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  e = Xc._;
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  throw C("IVector.-assoc-n", b);
}, Yc = function Yc(b) {
  if (null != b && null != b.ld) {
    return b.ld(b);
  }
  var c = Yc[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Yc._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IDeref.-deref", b);
};
function Zc() {
}
var bd = function bd(b) {
  if (null != b && null != b.O) {
    return b.O(b);
  }
  var c = bd[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = bd._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IMeta.-meta", b);
};
function cd() {
}
var dd = function dd(b, c) {
  if (null != b && null != b.S) {
    return b.S(b, c);
  }
  var d = dd[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = dd._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("IWithMeta.-with-meta", b);
};
function ed() {
}
var fd = function fd(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 2:
      return fd.j(arguments[0], arguments[1]);
    case 3:
      return fd.l(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([E("Invalid arity: "), E(c.length)].join(""));;
  }
};
fd.j = function(a, b) {
  if (null != a && null != a.va) {
    return a.va(a, b);
  }
  var c = fd[p(null == a ? null : a)];
  if (null != c) {
    return c.j ? c.j(a, b) : c.call(null, a, b);
  }
  c = fd._;
  if (null != c) {
    return c.j ? c.j(a, b) : c.call(null, a, b);
  }
  throw C("IReduce.-reduce", a);
};
fd.l = function(a, b, c) {
  if (null != a && null != a.wa) {
    return a.wa(a, b, c);
  }
  var d = fd[p(null == a ? null : a)];
  if (null != d) {
    return d.l ? d.l(a, b, c) : d.call(null, a, b, c);
  }
  d = fd._;
  if (null != d) {
    return d.l ? d.l(a, b, c) : d.call(null, a, b, c);
  }
  throw C("IReduce.-reduce", a);
};
fd.L = 3;
var gd = function gd(b, c, d) {
  if (null != b && null != b.Sc) {
    return b.Sc(b, c, d);
  }
  var e = gd[p(null == b ? null : b)];
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  e = gd._;
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  throw C("IKVReduce.-kv-reduce", b);
}, hd = function hd(b, c) {
  if (null != b && null != b.I) {
    return b.I(b, c);
  }
  var d = hd[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = hd._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("IEquiv.-equiv", b);
}, id = function id(b) {
  if (null != b && null != b.U) {
    return b.U(b);
  }
  var c = id[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = id._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IHash.-hash", b);
};
function jd() {
}
var kd = function kd(b) {
  if (null != b && null != b.da) {
    return b.da(b);
  }
  var c = kd[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = kd._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("ISeqable.-seq", b);
};
function ld() {
}
function md() {
}
function nd() {
}
function od() {
}
var pd = function pd(b) {
  if (null != b && null != b.Uc) {
    return b.Uc(b);
  }
  var c = pd[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = pd._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IReversible.-rseq", b);
}, qd = function qd(b, c) {
  if (null != b && null != b.yf) {
    return b.yf(0, c);
  }
  var d = qd[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = qd._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("IWriter.-write", b);
}, rd = function rd(b, c, d) {
  if (null != b && null != b.xf) {
    return b.xf(0, c, d);
  }
  var e = rd[p(null == b ? null : b)];
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  e = rd._;
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  throw C("IWatchable.-notify-watches", b);
}, sd = function sd(b) {
  if (null != b && null != b.Rc) {
    return b.Rc(b);
  }
  var c = sd[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = sd._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IEditableCollection.-as-transient", b);
}, td = function td(b, c) {
  if (null != b && null != b.sd) {
    return b.sd(b, c);
  }
  var d = td[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = td._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("ITransientCollection.-conj!", b);
}, ud = function ud(b) {
  if (null != b && null != b.ud) {
    return b.ud(b);
  }
  var c = ud[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = ud._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("ITransientCollection.-persistent!", b);
}, vd = function vd(b, c, d) {
  if (null != b && null != b.rd) {
    return b.rd(b, c, d);
  }
  var e = vd[p(null == b ? null : b)];
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  e = vd._;
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  throw C("ITransientAssociative.-assoc!", b);
}, wd = function wd(b, c, d) {
  if (null != b && null != b.vf) {
    return b.vf(0, c, d);
  }
  var e = wd[p(null == b ? null : b)];
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  e = wd._;
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  throw C("ITransientVector.-assoc-n!", b);
};
function xd() {
}
var yd = function yd(b, c) {
  if (null != b && null != b.Zb) {
    return b.Zb(b, c);
  }
  var d = yd[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = yd._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("IComparable.-compare", b);
}, zd = function zd(b) {
  if (null != b && null != b.rf) {
    return b.rf();
  }
  var c = zd[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = zd._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IChunk.-drop-first", b);
}, Ad = function Ad(b) {
  if (null != b && null != b.Be) {
    return b.Be(b);
  }
  var c = Ad[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Ad._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IChunkedSeq.-chunked-first", b);
}, Bd = function Bd(b) {
  if (null != b && null != b.Ce) {
    return b.Ce(b);
  }
  var c = Bd[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Bd._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IChunkedSeq.-chunked-rest", b);
}, Cd = function Cd(b) {
  if (null != b && null != b.Ae) {
    return b.Ae(b);
  }
  var c = Cd[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Cd._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IChunkedNext.-chunked-next", b);
}, Dd = function Dd(b) {
  if (null != b && null != b.pd) {
    return b.pd(b);
  }
  var c = Dd[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Dd._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("INamed.-name", b);
}, Ed = function Ed(b) {
  if (null != b && null != b.qd) {
    return b.qd(b);
  }
  var c = Ed[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Ed._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("INamed.-namespace", b);
}, Fd = function Fd(b, c) {
  if (null != b && null != b.ug) {
    return b.ug(b, c);
  }
  var d = Fd[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = Fd._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("IReset.-reset!", b);
}, Gd = function Gd(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 2:
      return Gd.j(arguments[0], arguments[1]);
    case 3:
      return Gd.l(arguments[0], arguments[1], arguments[2]);
    case 4:
      return Gd.J(arguments[0], arguments[1], arguments[2], arguments[3]);
    case 5:
      return Gd.P(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    default:
      throw Error([E("Invalid arity: "), E(c.length)].join(""));;
  }
};
Gd.j = function(a, b) {
  if (null != a && null != a.wg) {
    return a.wg(a, b);
  }
  var c = Gd[p(null == a ? null : a)];
  if (null != c) {
    return c.j ? c.j(a, b) : c.call(null, a, b);
  }
  c = Gd._;
  if (null != c) {
    return c.j ? c.j(a, b) : c.call(null, a, b);
  }
  throw C("ISwap.-swap!", a);
};
Gd.l = function(a, b, c) {
  if (null != a && null != a.xg) {
    return a.xg(a, b, c);
  }
  var d = Gd[p(null == a ? null : a)];
  if (null != d) {
    return d.l ? d.l(a, b, c) : d.call(null, a, b, c);
  }
  d = Gd._;
  if (null != d) {
    return d.l ? d.l(a, b, c) : d.call(null, a, b, c);
  }
  throw C("ISwap.-swap!", a);
};
Gd.J = function(a, b, c, d) {
  if (null != a && null != a.yg) {
    return a.yg(a, b, c, d);
  }
  var e = Gd[p(null == a ? null : a)];
  if (null != e) {
    return e.J ? e.J(a, b, c, d) : e.call(null, a, b, c, d);
  }
  e = Gd._;
  if (null != e) {
    return e.J ? e.J(a, b, c, d) : e.call(null, a, b, c, d);
  }
  throw C("ISwap.-swap!", a);
};
Gd.P = function(a, b, c, d, e) {
  if (null != a && null != a.zg) {
    return a.zg(a, b, c, d, e);
  }
  var f = Gd[p(null == a ? null : a)];
  if (null != f) {
    return f.P ? f.P(a, b, c, d, e) : f.call(null, a, b, c, d, e);
  }
  f = Gd._;
  if (null != f) {
    return f.P ? f.P(a, b, c, d, e) : f.call(null, a, b, c, d, e);
  }
  throw C("ISwap.-swap!", a);
};
Gd.L = 5;
var Hd = function Hd(b, c) {
  if (null != b && null != b.wf) {
    return b.wf(0, c);
  }
  var d = Hd[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = Hd._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("IVolatile.-vreset!", b);
}, Id = function Id(b) {
  if (null != b && null != b.mb) {
    return b.mb(b);
  }
  var c = Id[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Id._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IIterable.-iterator", b);
};
function Jd(a) {
  this.ph = a;
  this.v = 1073741824;
  this.K = 0;
}
Jd.prototype.yf = function(a, b) {
  return this.ph.append(b);
};
function Kd(a) {
  var b = new hb;
  a.V(null, new Jd(b), bc());
  return "" + E(b);
}
var Ld = "undefined" !== typeof Math.imul && 0 !== Math.imul(4294967295, 5) ? function(a, b) {
  return Math.imul(a, b);
} : function(a, b) {
  var c = a & 65535, d = b & 65535;
  return c * d + ((a >>> 16 & 65535) * d + c * (b >>> 16 & 65535) << 16 >>> 0) | 0;
};
function Md(a) {
  a = Ld(a | 0, -862048943);
  return Ld(a << 15 | a >>> -15, 461845907);
}
function Nd(a, b) {
  var c = (a | 0) ^ (b | 0);
  return Ld(c << 13 | c >>> -13, 5) + -430675100 | 0;
}
function Od(a, b) {
  var c = (a | 0) ^ b, c = Ld(c ^ c >>> 16, -2048144789), c = Ld(c ^ c >>> 13, -1028477387);
  return c ^ c >>> 16;
}
function Qd(a) {
  var b;
  a: {
    b = 1;
    for (var c = 0;;) {
      if (b < a.length) {
        var d = b + 2, c = Nd(c, Md(a.charCodeAt(b - 1) | a.charCodeAt(b) << 16));
        b = d;
      } else {
        b = c;
        break a;
      }
    }
  }
  b = 1 === (a.length & 1) ? b ^ Md(a.charCodeAt(a.length - 1)) : b;
  return Od(b, Ld(2, a.length));
}
var Rd = {}, Sd = 0;
function Td(a) {
  255 < Sd && (Rd = {}, Sd = 0);
  if (null == a) {
    return 0;
  }
  var b = Rd[a];
  if ("number" !== typeof b) {
    a: {
      if (null != a) {
        if (b = a.length, 0 < b) {
          for (var c = 0, d = 0;;) {
            if (c < b) {
              var e = c + 1, d = Ld(31, d) + a.charCodeAt(c), c = e
            } else {
              b = d;
              break a;
            }
          }
        } else {
          b = 0;
        }
      } else {
        b = 0;
      }
    }
    Rd[a] = b;
    Sd += 1;
  }
  return a = b;
}
function Ud(a) {
  if (null != a && (a.v & 4194304 || a.Ee)) {
    return a.U(null);
  }
  if ("number" === typeof a) {
    if (z(isFinite(a))) {
      return Math.floor(a) % 2147483647;
    }
    switch(a) {
      case Infinity:
        return 2146435072;
      case -Infinity:
        return -1048576;
      default:
        return 2146959360;
    }
  } else {
    return !0 === a ? a = 1 : !1 === a ? a = 0 : "string" === typeof a ? (a = Td(a), 0 !== a && (a = Md(a), a = Nd(0, a), a = Od(a, 4))) : a = a instanceof Date ? a.valueOf() : null == a ? 0 : id(a), a;
  }
}
function Vd(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2);
}
function Wd(a, b) {
  if (a.ab === b.ab) {
    return 0;
  }
  var c = nc(a.Va);
  if (z(c ? b.Va : c)) {
    return -1;
  }
  if (z(a.Va)) {
    if (nc(b.Va)) {
      return 1;
    }
    c = wb(a.Va, b.Va);
    return 0 === c ? wb(a.name, b.name) : c;
  }
  return wb(a.name, b.name);
}
function F(a, b, c, d, e) {
  this.Va = a;
  this.name = b;
  this.ab = c;
  this.Mc = d;
  this.bb = e;
  this.v = 2154168321;
  this.K = 4096;
}
h = F.prototype;
h.toString = function() {
  return this.ab;
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.I = function(a, b) {
  return b instanceof F ? this.ab === b.ab : !1;
};
h.call = function() {
  function a(a, b, c) {
    return H.l ? H.l(b, this, c) : H.call(null, b, this, c);
  }
  function b(a, b) {
    return H.j ? H.j(b, this) : H.call(null, b, this);
  }
  var c = null, c = function(c, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, 0, e);
      case 3:
        return a.call(this, 0, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  c.j = b;
  c.l = a;
  return c;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return H.j ? H.j(a, this) : H.call(null, a, this);
};
h.j = function(a, b) {
  return H.l ? H.l(a, this, b) : H.call(null, a, this, b);
};
h.O = function() {
  return this.bb;
};
h.S = function(a, b) {
  return new F(this.Va, this.name, this.ab, this.Mc, b);
};
h.U = function() {
  var a = this.Mc;
  return null != a ? a : this.Mc = a = Vd(Qd(this.name), Td(this.Va));
};
h.pd = function() {
  return this.name;
};
h.qd = function() {
  return this.Va;
};
h.V = function(a, b) {
  return qd(b, this.ab);
};
var Xd = function Xd(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 1:
      return Xd.h(arguments[0]);
    case 2:
      return Xd.j(arguments[0], arguments[1]);
    default:
      throw Error([E("Invalid arity: "), E(c.length)].join(""));;
  }
};
Xd.h = function(a) {
  if (a instanceof F) {
    return a;
  }
  var b = a.indexOf("/");
  return 1 > b ? Xd.j(null, a) : Xd.j(a.substring(0, b), a.substring(b + 1, a.length));
};
Xd.j = function(a, b) {
  var c = null != a ? [E(a), E("/"), E(b)].join("") : b;
  return new F(a, b, c, null, null);
};
Xd.L = 2;
function x(a) {
  if (null == a) {
    return null;
  }
  if (null != a && (a.v & 8388608 || a.vg)) {
    return a.da(null);
  }
  if (mc(a) || "string" === typeof a) {
    return 0 === a.length ? null : new w(a, 0, null);
  }
  if (A(jd, a)) {
    return kd(a);
  }
  throw Error([E(a), E(" is not ISeqable")].join(""));
}
function I(a) {
  if (null == a) {
    return null;
  }
  if (null != a && (a.v & 64 || a.R)) {
    return a.xa(null);
  }
  a = x(a);
  return null == a ? null : Gc(a);
}
function Yd(a) {
  return null != a ? null != a && (a.v & 64 || a.R) ? a.Qa(null) : (a = x(a)) ? Hc(a) : Zd : Zd;
}
function K(a) {
  return null == a ? null : null != a && (a.v & 128 || a.Vd) ? a.Ya(null) : x(Yd(a));
}
var M = function M(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 1:
      return M.h(arguments[0]);
    case 2:
      return M.j(arguments[0], arguments[1]);
    default:
      return M.A(arguments[0], arguments[1], new w(c.slice(2), 0, null));
  }
};
M.h = function() {
  return !0;
};
M.j = function(a, b) {
  return null == a ? null == b : a === b || hd(a, b);
};
M.A = function(a, b, c) {
  for (;;) {
    if (M.j(a, b)) {
      if (K(c)) {
        a = b, b = I(c), c = K(c);
      } else {
        return M.j(b, I(c));
      }
    } else {
      return !1;
    }
  }
};
M.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  c = K(c);
  return M.A(b, a, c);
};
M.L = 2;
function $d(a) {
  this.s = a;
}
$d.prototype.next = function() {
  if (null != this.s) {
    var a = I(this.s);
    this.s = K(this.s);
    return {value:a, done:!1};
  }
  return {value:null, done:!0};
};
function ae(a) {
  return new $d(x(a));
}
function be(a, b) {
  var c = Md(a), c = Nd(0, c);
  return Od(c, b);
}
function ce(a) {
  var b = 0, c = 1;
  for (a = x(a);;) {
    if (null != a) {
      b += 1, c = Ld(31, c) + Ud(I(a)) | 0, a = K(a);
    } else {
      return be(c, b);
    }
  }
}
var de = be(1, 0);
function ee(a) {
  var b = 0, c = 0;
  for (a = x(a);;) {
    if (null != a) {
      b += 1, c = c + Ud(I(a)) | 0, a = K(a);
    } else {
      return be(c, b);
    }
  }
}
var fe = be(0, 0);
yc["null"] = !0;
zc["null"] = function() {
  return 0;
};
Date.prototype.I = function(a, b) {
  return b instanceof Date && this.valueOf() === b.valueOf();
};
Date.prototype.zc = !0;
Date.prototype.Zb = function(a, b) {
  if (b instanceof Date) {
    return wb(this.valueOf(), b.valueOf());
  }
  throw Error([E("Cannot compare "), E(this), E(" to "), E(b)].join(""));
};
hd.number = function(a, b) {
  return a === b;
};
wc["function"] = !0;
Zc["function"] = !0;
bd["function"] = function() {
  return null;
};
id._ = function(a) {
  return la(a);
};
function ge(a) {
  return a + 1;
}
function he(a) {
  this.G = a;
  this.v = 32768;
  this.K = 0;
}
he.prototype.ld = function() {
  return this.G;
};
function ie(a) {
  return a instanceof he;
}
function N(a) {
  return Yc(a);
}
function je(a, b) {
  var c = zc(a);
  if (0 === c) {
    return b.w ? b.w() : b.call(null);
  }
  for (var d = Ec.j(a, 0), e = 1;;) {
    if (e < c) {
      var f = Ec.j(a, e), d = b.j ? b.j(d, f) : b.call(null, d, f);
      if (ie(d)) {
        return Yc(d);
      }
      e += 1;
    } else {
      return d;
    }
  }
}
function ke(a, b, c) {
  var d = zc(a), e = c;
  for (c = 0;;) {
    if (c < d) {
      var f = Ec.j(a, c), e = b.j ? b.j(e, f) : b.call(null, e, f);
      if (ie(e)) {
        return Yc(e);
      }
      c += 1;
    } else {
      return e;
    }
  }
}
function le(a, b) {
  var c = a.length;
  if (0 === a.length) {
    return b.w ? b.w() : b.call(null);
  }
  for (var d = a[0], e = 1;;) {
    if (e < c) {
      var f = a[e], d = b.j ? b.j(d, f) : b.call(null, d, f);
      if (ie(d)) {
        return Yc(d);
      }
      e += 1;
    } else {
      return d;
    }
  }
}
function me(a, b, c) {
  var d = a.length, e = c;
  for (c = 0;;) {
    if (c < d) {
      var f = a[c], e = b.j ? b.j(e, f) : b.call(null, e, f);
      if (ie(e)) {
        return Yc(e);
      }
      c += 1;
    } else {
      return e;
    }
  }
}
function ne(a, b, c, d) {
  for (var e = a.length;;) {
    if (d < e) {
      var f = a[d];
      c = b.j ? b.j(c, f) : b.call(null, c, f);
      if (ie(c)) {
        return Yc(c);
      }
      d += 1;
    } else {
      return c;
    }
  }
}
function oe(a) {
  return null != a ? a.v & 2 || a.lg ? !0 : a.v ? !1 : A(yc, a) : A(yc, a);
}
function pe(a) {
  return null != a ? a.v & 16 || a.sf ? !0 : a.v ? !1 : A(Dc, a) : A(Dc, a);
}
function O(a, b, c) {
  var d = P.h ? P.h(a) : P.call(null, a);
  if (c >= d) {
    return -1;
  }
  !(0 < c) && 0 > c && (c += d, c = 0 > c ? 0 : c);
  for (;;) {
    if (c < d) {
      if (M.j(qe ? qe(a, c) : re.call(null, a, c), b)) {
        return c;
      }
      c += 1;
    } else {
      return -1;
    }
  }
}
function Q(a, b, c) {
  var d = P.h ? P.h(a) : P.call(null, a);
  if (0 === d) {
    return -1;
  }
  0 < c ? (--d, c = d < c ? d : c) : c = 0 > c ? d + c : c;
  for (;;) {
    if (0 <= c) {
      if (M.j(qe ? qe(a, c) : re.call(null, a, c), b)) {
        return c;
      }
      --c;
    } else {
      return -1;
    }
  }
}
function se(a, b) {
  this.o = a;
  this.i = b;
}
se.prototype.Ca = function() {
  return this.i < this.o.length;
};
se.prototype.next = function() {
  var a = this.o[this.i];
  this.i += 1;
  return a;
};
function w(a, b, c) {
  this.o = a;
  this.i = b;
  this.meta = c;
  this.v = 166592766;
  this.K = 8192;
}
h = w.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P.h ? P.h(this) : P.call(null, this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.Z = function(a, b) {
  var c = b + this.i;
  return c < this.o.length ? this.o[c] : null;
};
h.cb = function(a, b, c) {
  a = b + this.i;
  return a < this.o.length ? this.o[a] : c;
};
h.mb = function() {
  return new se(this.o, this.i);
};
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new w(this.o, this.i, this.meta);
};
h.Ya = function() {
  return this.i + 1 < this.o.length ? new w(this.o, this.i + 1, null) : null;
};
h.ia = function() {
  var a = this.o.length - this.i;
  return 0 > a ? 0 : a;
};
h.Uc = function() {
  var a = zc(this);
  return 0 < a ? new te(this, a - 1, null) : null;
};
h.U = function() {
  return ce(this);
};
h.I = function(a, b) {
  return ue.j ? ue.j(this, b) : ue.call(null, this, b);
};
h.ma = function() {
  return Zd;
};
h.va = function(a, b) {
  return ne(this.o, b, this.o[this.i], this.i + 1);
};
h.wa = function(a, b, c) {
  return ne(this.o, b, c, this.i);
};
h.xa = function() {
  return this.o[this.i];
};
h.Qa = function() {
  return this.i + 1 < this.o.length ? new w(this.o, this.i + 1, null) : Zd;
};
h.da = function() {
  return this.i < this.o.length ? this : null;
};
h.S = function(a, b) {
  return new w(this.o, this.i, b);
};
h.ea = function(a, b) {
  return ve.j ? ve.j(b, this) : ve.call(null, b, this);
};
w.prototype[sc] = function() {
  return ae(this);
};
function we(a, b) {
  return b < a.length ? new w(a, b, null) : null;
}
function S(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 1:
      return we(arguments[0], 0);
    case 2:
      return we(arguments[0], arguments[1]);
    default:
      throw Error([E("Invalid arity: "), E(b.length)].join(""));;
  }
}
function te(a, b, c) {
  this.kd = a;
  this.i = b;
  this.meta = c;
  this.v = 32374990;
  this.K = 8192;
}
h = te.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P.h ? P.h(this) : P.call(null, this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new te(this.kd, this.i, this.meta);
};
h.Ya = function() {
  return 0 < this.i ? new te(this.kd, this.i - 1, null) : null;
};
h.ia = function() {
  return this.i + 1;
};
h.U = function() {
  return ce(this);
};
h.I = function(a, b) {
  return ue.j ? ue.j(this, b) : ue.call(null, this, b);
};
h.ma = function() {
  var a = Zd, b = this.meta;
  return xe.j ? xe.j(a, b) : xe.call(null, a, b);
};
h.va = function(a, b) {
  return ye ? ye(b, this) : ze.call(null, b, this);
};
h.wa = function(a, b, c) {
  return Ae ? Ae(b, c, this) : ze.call(null, b, c, this);
};
h.xa = function() {
  return Ec.j(this.kd, this.i);
};
h.Qa = function() {
  return 0 < this.i ? new te(this.kd, this.i - 1, null) : Zd;
};
h.da = function() {
  return this;
};
h.S = function(a, b) {
  return new te(this.kd, this.i, b);
};
h.ea = function(a, b) {
  return ve.j ? ve.j(b, this) : ve.call(null, b, this);
};
te.prototype[sc] = function() {
  return ae(this);
};
function Be(a) {
  return I(K(a));
}
hd._ = function(a, b) {
  return a === b;
};
var Ce = function Ce(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 0:
      return Ce.w();
    case 1:
      return Ce.h(arguments[0]);
    case 2:
      return Ce.j(arguments[0], arguments[1]);
    default:
      return Ce.A(arguments[0], arguments[1], new w(c.slice(2), 0, null));
  }
};
Ce.w = function() {
  return De;
};
Ce.h = function(a) {
  return a;
};
Ce.j = function(a, b) {
  return null != a ? Cc(a, b) : Cc(Zd, b);
};
Ce.A = function(a, b, c) {
  for (;;) {
    if (z(c)) {
      a = Ce.j(a, b), b = I(c), c = K(c);
    } else {
      return Ce.j(a, b);
    }
  }
};
Ce.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  c = K(c);
  return Ce.A(b, a, c);
};
Ce.L = 2;
function P(a) {
  if (null != a) {
    if (null != a && (a.v & 2 || a.lg)) {
      a = a.ia(null);
    } else {
      if (mc(a)) {
        a = a.length;
      } else {
        if ("string" === typeof a) {
          a = a.length;
        } else {
          if (null != a && (a.v & 8388608 || a.vg)) {
            a: {
              a = x(a);
              for (var b = 0;;) {
                if (oe(a)) {
                  a = b + zc(a);
                  break a;
                }
                a = K(a);
                b += 1;
              }
            }
          } else {
            a = zc(a);
          }
        }
      }
    }
  } else {
    a = 0;
  }
  return a;
}
function Ee(a, b, c) {
  for (;;) {
    if (null == a) {
      return c;
    }
    if (0 === b) {
      return x(a) ? I(a) : c;
    }
    if (pe(a)) {
      return Ec.l(a, b, c);
    }
    if (x(a)) {
      a = K(a), --b;
    } else {
      return c;
    }
  }
}
function re(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 2:
      return qe(arguments[0], arguments[1]);
    case 3:
      return T(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([E("Invalid arity: "), E(b.length)].join(""));;
  }
}
function qe(a, b) {
  if ("number" !== typeof b) {
    throw Error("index argument to nth must be a number");
  }
  if (null == a) {
    return a;
  }
  if (null != a && (a.v & 16 || a.sf)) {
    return a.Z(null, b);
  }
  if (mc(a)) {
    return b < a.length ? a[b] : null;
  }
  if ("string" === typeof a) {
    return b < a.length ? a.charAt(b) : null;
  }
  if (null != a && (a.v & 64 || a.R)) {
    var c;
    a: {
      c = a;
      for (var d = b;;) {
        if (null == c) {
          throw Error("Index out of bounds");
        }
        if (0 === d) {
          if (x(c)) {
            c = I(c);
            break a;
          }
          throw Error("Index out of bounds");
        }
        if (pe(c)) {
          c = Ec.j(c, d);
          break a;
        }
        if (x(c)) {
          c = K(c), --d;
        } else {
          throw Error("Index out of bounds");
        }
      }
    }
    return c;
  }
  if (A(Dc, a)) {
    return Ec.j(a, b);
  }
  throw Error([E("nth not supported on this type "), E(rc(qc(a)))].join(""));
}
function T(a, b, c) {
  if ("number" !== typeof b) {
    throw Error("index argument to nth must be a number.");
  }
  if (null == a) {
    return c;
  }
  if (null != a && (a.v & 16 || a.sf)) {
    return a.cb(null, b, c);
  }
  if (mc(a)) {
    return b < a.length ? a[b] : c;
  }
  if ("string" === typeof a) {
    return b < a.length ? a.charAt(b) : c;
  }
  if (null != a && (a.v & 64 || a.R)) {
    return Ee(a, b, c);
  }
  if (A(Dc, a)) {
    return Ec.j(a, b);
  }
  throw Error([E("nth not supported on this type "), E(rc(qc(a)))].join(""));
}
var H = function H(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 2:
      return H.j(arguments[0], arguments[1]);
    case 3:
      return H.l(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([E("Invalid arity: "), E(c.length)].join(""));;
  }
};
H.j = function(a, b) {
  return null == a ? null : null != a && (a.v & 256 || a.qg) ? a.N(null, b) : mc(a) ? b < a.length ? a[b | 0] : null : "string" === typeof a ? b < a.length ? a[b | 0] : null : A(Jc, a) ? Kc.j(a, b) : null;
};
H.l = function(a, b, c) {
  return null != a ? null != a && (a.v & 256 || a.qg) ? a.M(null, b, c) : mc(a) ? b < a.length ? a[b] : c : "string" === typeof a ? b < a.length ? a[b] : c : A(Jc, a) ? Kc.l(a, b, c) : c : c;
};
H.L = 3;
var U = function U(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 3:
      return U.l(arguments[0], arguments[1], arguments[2]);
    default:
      return U.A(arguments[0], arguments[1], arguments[2], new w(c.slice(3), 0, null));
  }
};
U.l = function(a, b, c) {
  return null != a ? Nc(a, b, c) : Fe([b], [c]);
};
U.A = function(a, b, c, d) {
  for (;;) {
    if (a = U.l(a, b, c), z(d)) {
      b = I(d), c = Be(d), d = K(K(d));
    } else {
      return a;
    }
  }
};
U.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  var d = K(c), c = I(d), d = K(d);
  return U.A(b, a, c, d);
};
U.L = 3;
var Ge = function Ge(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 1:
      return Ge.h(arguments[0]);
    case 2:
      return Ge.j(arguments[0], arguments[1]);
    default:
      return Ge.A(arguments[0], arguments[1], new w(c.slice(2), 0, null));
  }
};
Ge.h = function(a) {
  return a;
};
Ge.j = function(a, b) {
  return null == a ? null : Pc(a, b);
};
Ge.A = function(a, b, c) {
  for (;;) {
    if (null == a) {
      return null;
    }
    a = Ge.j(a, b);
    if (z(c)) {
      b = I(c), c = K(c);
    } else {
      return a;
    }
  }
};
Ge.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  c = K(c);
  return Ge.A(b, a, c);
};
Ge.L = 2;
function He(a, b) {
  this.B = a;
  this.meta = b;
  this.v = 393217;
  this.K = 0;
}
h = He.prototype;
h.O = function() {
  return this.meta;
};
h.S = function(a, b) {
  return new He(this.B, b);
};
h.kg = !0;
h.call = function() {
  function a(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, L, J, R) {
    a = this;
    return Ie.md ? Ie.md(a.B, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, L, J, R) : Ie.call(null, a.B, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, L, J, R);
  }
  function b(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, L, J) {
    a = this;
    return a.B.Na ? a.B.Na(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, L, J) : a.B.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, L, J);
  }
  function c(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, L) {
    a = this;
    return a.B.Ma ? a.B.Ma(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, L) : a.B.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, L);
  }
  function d(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D) {
    a = this;
    return a.B.La ? a.B.La(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D) : a.B.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D);
  }
  function e(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G) {
    a = this;
    return a.B.Ka ? a.B.Ka(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G) : a.B.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G);
  }
  function f(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B) {
    a = this;
    return a.B.Ja ? a.B.Ja(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B) : a.B.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B);
  }
  function g(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y) {
    a = this;
    return a.B.Ia ? a.B.Ia(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y) : a.B.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y);
  }
  function k(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v) {
    a = this;
    return a.B.Ha ? a.B.Ha(b, c, d, e, f, g, k, l, m, n, r, t, u, v) : a.B.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v);
  }
  function l(a, b, c, d, e, f, g, k, l, m, n, r, t, u) {
    a = this;
    return a.B.Ga ? a.B.Ga(b, c, d, e, f, g, k, l, m, n, r, t, u) : a.B.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u);
  }
  function n(a, b, c, d, e, f, g, k, l, m, n, r, t) {
    a = this;
    return a.B.Fa ? a.B.Fa(b, c, d, e, f, g, k, l, m, n, r, t) : a.B.call(null, b, c, d, e, f, g, k, l, m, n, r, t);
  }
  function m(a, b, c, d, e, f, g, k, l, m, n, r) {
    a = this;
    return a.B.Ea ? a.B.Ea(b, c, d, e, f, g, k, l, m, n, r) : a.B.call(null, b, c, d, e, f, g, k, l, m, n, r);
  }
  function r(a, b, c, d, e, f, g, k, l, m, n) {
    a = this;
    return a.B.Da ? a.B.Da(b, c, d, e, f, g, k, l, m, n) : a.B.call(null, b, c, d, e, f, g, k, l, m, n);
  }
  function t(a, b, c, d, e, f, g, k, l, m) {
    a = this;
    return a.B.Pa ? a.B.Pa(b, c, d, e, f, g, k, l, m) : a.B.call(null, b, c, d, e, f, g, k, l, m);
  }
  function u(a, b, c, d, e, f, g, k, l) {
    a = this;
    return a.B.Oa ? a.B.Oa(b, c, d, e, f, g, k, l) : a.B.call(null, b, c, d, e, f, g, k, l);
  }
  function v(a, b, c, d, e, f, g, k) {
    a = this;
    return a.B.Aa ? a.B.Aa(b, c, d, e, f, g, k) : a.B.call(null, b, c, d, e, f, g, k);
  }
  function y(a, b, c, d, e, f, g) {
    a = this;
    return a.B.ta ? a.B.ta(b, c, d, e, f, g) : a.B.call(null, b, c, d, e, f, g);
  }
  function B(a, b, c, d, e, f) {
    a = this;
    return a.B.P ? a.B.P(b, c, d, e, f) : a.B.call(null, b, c, d, e, f);
  }
  function G(a, b, c, d, e) {
    a = this;
    return a.B.J ? a.B.J(b, c, d, e) : a.B.call(null, b, c, d, e);
  }
  function D(a, b, c, d) {
    a = this;
    return a.B.l ? a.B.l(b, c, d) : a.B.call(null, b, c, d);
  }
  function L(a, b, c) {
    a = this;
    return a.B.j ? a.B.j(b, c) : a.B.call(null, b, c);
  }
  function R(a, b) {
    a = this;
    return a.B.h ? a.B.h(b) : a.B.call(null, b);
  }
  function wa(a) {
    a = this;
    return a.B.w ? a.B.w() : a.B.call(null);
  }
  var J = null, J = function(Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, J, kb, rb, lb, Mb, pc, ad, Pd, Oe, Bg, Ik) {
    switch(arguments.length) {
      case 1:
        return wa.call(this, Ra);
      case 2:
        return R.call(this, Ra, ea);
      case 3:
        return L.call(this, Ra, ea, ka);
      case 4:
        return D.call(this, Ra, ea, ka, sa);
      case 5:
        return G.call(this, Ra, ea, ka, sa, xa);
      case 6:
        return B.call(this, Ra, ea, ka, sa, xa, ta);
      case 7:
        return y.call(this, Ra, ea, ka, sa, xa, ta, pa);
      case 8:
        return v.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga);
      case 9:
        return u.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa);
      case 10:
        return t.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa);
      case 11:
        return r.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db);
      case 12:
        return m.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, J);
      case 13:
        return n.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, J, kb);
      case 14:
        return l.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, J, kb, rb);
      case 15:
        return k.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, J, kb, rb, lb);
      case 16:
        return g.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, J, kb, rb, lb, Mb);
      case 17:
        return f.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, J, kb, rb, lb, Mb, pc);
      case 18:
        return e.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, J, kb, rb, lb, Mb, pc, ad);
      case 19:
        return d.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, J, kb, rb, lb, Mb, pc, ad, Pd);
      case 20:
        return c.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, J, kb, rb, lb, Mb, pc, ad, Pd, Oe);
      case 21:
        return b.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, J, kb, rb, lb, Mb, pc, ad, Pd, Oe, Bg);
      case 22:
        return a.call(this, Ra, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, J, kb, rb, lb, Mb, pc, ad, Pd, Oe, Bg, Ik);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  J.h = wa;
  J.j = R;
  J.l = L;
  J.J = D;
  J.P = G;
  J.ta = B;
  J.Aa = y;
  J.Oa = v;
  J.Pa = u;
  J.Da = t;
  J.Ea = r;
  J.Fa = m;
  J.Ga = n;
  J.Ha = l;
  J.Ia = k;
  J.Ja = g;
  J.Ka = f;
  J.La = e;
  J.Ma = d;
  J.Na = c;
  J.De = b;
  J.md = a;
  return J;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.w = function() {
  return this.B.w ? this.B.w() : this.B.call(null);
};
h.h = function(a) {
  return this.B.h ? this.B.h(a) : this.B.call(null, a);
};
h.j = function(a, b) {
  return this.B.j ? this.B.j(a, b) : this.B.call(null, a, b);
};
h.l = function(a, b, c) {
  return this.B.l ? this.B.l(a, b, c) : this.B.call(null, a, b, c);
};
h.J = function(a, b, c, d) {
  return this.B.J ? this.B.J(a, b, c, d) : this.B.call(null, a, b, c, d);
};
h.P = function(a, b, c, d, e) {
  return this.B.P ? this.B.P(a, b, c, d, e) : this.B.call(null, a, b, c, d, e);
};
h.ta = function(a, b, c, d, e, f) {
  return this.B.ta ? this.B.ta(a, b, c, d, e, f) : this.B.call(null, a, b, c, d, e, f);
};
h.Aa = function(a, b, c, d, e, f, g) {
  return this.B.Aa ? this.B.Aa(a, b, c, d, e, f, g) : this.B.call(null, a, b, c, d, e, f, g);
};
h.Oa = function(a, b, c, d, e, f, g, k) {
  return this.B.Oa ? this.B.Oa(a, b, c, d, e, f, g, k) : this.B.call(null, a, b, c, d, e, f, g, k);
};
h.Pa = function(a, b, c, d, e, f, g, k, l) {
  return this.B.Pa ? this.B.Pa(a, b, c, d, e, f, g, k, l) : this.B.call(null, a, b, c, d, e, f, g, k, l);
};
h.Da = function(a, b, c, d, e, f, g, k, l, n) {
  return this.B.Da ? this.B.Da(a, b, c, d, e, f, g, k, l, n) : this.B.call(null, a, b, c, d, e, f, g, k, l, n);
};
h.Ea = function(a, b, c, d, e, f, g, k, l, n, m) {
  return this.B.Ea ? this.B.Ea(a, b, c, d, e, f, g, k, l, n, m) : this.B.call(null, a, b, c, d, e, f, g, k, l, n, m);
};
h.Fa = function(a, b, c, d, e, f, g, k, l, n, m, r) {
  return this.B.Fa ? this.B.Fa(a, b, c, d, e, f, g, k, l, n, m, r) : this.B.call(null, a, b, c, d, e, f, g, k, l, n, m, r);
};
h.Ga = function(a, b, c, d, e, f, g, k, l, n, m, r, t) {
  return this.B.Ga ? this.B.Ga(a, b, c, d, e, f, g, k, l, n, m, r, t) : this.B.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t);
};
h.Ha = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u) {
  return this.B.Ha ? this.B.Ha(a, b, c, d, e, f, g, k, l, n, m, r, t, u) : this.B.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u);
};
h.Ia = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v) {
  return this.B.Ia ? this.B.Ia(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v) : this.B.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v);
};
h.Ja = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y) {
  return this.B.Ja ? this.B.Ja(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y) : this.B.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y);
};
h.Ka = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B) {
  return this.B.Ka ? this.B.Ka(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B) : this.B.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B);
};
h.La = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G) {
  return this.B.La ? this.B.La(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G) : this.B.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G);
};
h.Ma = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D) {
  return this.B.Ma ? this.B.Ma(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D) : this.B.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D);
};
h.Na = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L) {
  return this.B.Na ? this.B.Na(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L) : this.B.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L);
};
h.De = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L, R) {
  return Ie.md ? Ie.md(this.B, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L, R) : Ie.call(null, this.B, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L, R);
};
function xe(a, b) {
  return ia(a) ? new He(a, b) : null == a ? null : dd(a, b);
}
function Je(a) {
  var b = null != a;
  return (b ? null != a ? a.v & 131072 || a.tf || (a.v ? 0 : A(Zc, a)) : A(Zc, a) : b) ? bd(a) : null;
}
function Ke(a) {
  return null == a || nc(x(a));
}
function Le(a) {
  return null == a ? !1 : null != a ? a.v & 8 || a.Ah ? !0 : a.v ? !1 : A(Bc, a) : A(Bc, a);
}
function Me(a) {
  return null == a ? !1 : null != a ? a.v & 4096 || a.Gh ? !0 : a.v ? !1 : A(Tc, a) : A(Tc, a);
}
function Ne(a) {
  return null != a ? a.v & 16777216 || a.Fh ? !0 : a.v ? !1 : A(ld, a) : A(ld, a);
}
function Pe(a) {
  return null == a ? !1 : null != a ? a.v & 1024 || a.rg ? !0 : a.v ? !1 : A(Oc, a) : A(Oc, a);
}
function Qe(a) {
  return null != a ? a.v & 67108864 || a.Dh ? !0 : a.v ? !1 : A(nd, a) : A(nd, a);
}
function Re(a) {
  return null != a ? a.v & 16384 || a.Hh ? !0 : a.v ? !1 : A(Wc, a) : A(Wc, a);
}
function Se(a) {
  return null != a ? a.K & 512 || a.zh ? !0 : !1 : !1;
}
function Te(a) {
  var b = [];
  Na(a, function(a, b) {
    return function(a, c) {
      return b.push(c);
    };
  }(a, b));
  return b;
}
function Ue(a, b, c, d, e) {
  for (;0 !== e;) {
    c[d] = a[b], d += 1, --e, b += 1;
  }
}
var Ve = {};
function We(a) {
  return null == a ? !1 : null != a ? a.v & 64 || a.R ? !0 : a.v ? !1 : A(Fc, a) : A(Fc, a);
}
function Xe(a) {
  return null == a ? !1 : !1 === a ? !1 : !0;
}
function Ye(a) {
  return "number" === typeof a && !isNaN(a) && Infinity !== a && parseFloat(a) === parseInt(a, 10);
}
function Ze(a, b) {
  return H.l(a, b, Ve) === Ve ? !1 : !0;
}
function $e(a, b) {
  var c;
  if (c = null != a) {
    c = null != a ? a.v & 512 || a.yh ? !0 : a.v ? !1 : A(Lc, a) : A(Lc, a);
  }
  return c && Ze(a, b) ? new V(null, 2, 5, W, [b, H.j(a, b)], null) : null;
}
function af(a, b) {
  if (a === b) {
    return 0;
  }
  if (null == a) {
    return -1;
  }
  if (null == b) {
    return 1;
  }
  if ("number" === typeof a) {
    if ("number" === typeof b) {
      return wb(a, b);
    }
    throw Error([E("Cannot compare "), E(a), E(" to "), E(b)].join(""));
  }
  if (null != a ? a.K & 2048 || a.zc || (a.K ? 0 : A(xd, a)) : A(xd, a)) {
    return yd(a, b);
  }
  if ("string" !== typeof a && !mc(a) && !0 !== a && !1 !== a || qc(a) !== qc(b)) {
    throw Error([E("Cannot compare "), E(a), E(" to "), E(b)].join(""));
  }
  return wb(a, b);
}
function bf(a, b) {
  var c = P(a), d = P(b);
  if (c < d) {
    c = -1;
  } else {
    if (c > d) {
      c = 1;
    } else {
      if (0 === c) {
        c = 0;
      } else {
        a: {
          for (d = 0;;) {
            var e = af(qe(a, d), qe(b, d));
            if (0 === e && d + 1 < c) {
              d += 1;
            } else {
              c = e;
              break a;
            }
          }
        }
      }
    }
  }
  return c;
}
function cf() {
  return M.j(af, af) ? af : function(a, b) {
    var c = af.j ? af.j(a, b) : af.call(null, a, b);
    return "number" === typeof c ? c : z(c) ? -1 : z(af.j ? af.j(b, a) : af.call(null, b, a)) ? 1 : 0;
  };
}
function df(a) {
  if (x(a)) {
    a = ef.h ? ef.h(a) : ef.call(null, a);
    var b = cf();
    xb(a, b);
    return x(a);
  }
  return Zd;
}
function ze(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 2:
      return ye(arguments[0], arguments[1]);
    case 3:
      return Ae(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([E("Invalid arity: "), E(b.length)].join(""));;
  }
}
function ye(a, b) {
  var c = x(b);
  if (c) {
    var d = I(c), c = K(c);
    return uc ? uc(a, d, c) : vc.call(null, a, d, c);
  }
  return a.w ? a.w() : a.call(null);
}
function Ae(a, b, c) {
  for (c = x(c);;) {
    if (c) {
      var d = I(c);
      b = a.j ? a.j(b, d) : a.call(null, b, d);
      if (ie(b)) {
        return Yc(b);
      }
      c = K(c);
    } else {
      return b;
    }
  }
}
function vc(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 2:
      return ff(arguments[0], arguments[1]);
    case 3:
      return uc(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([E("Invalid arity: "), E(b.length)].join(""));;
  }
}
function ff(a, b) {
  return null != b && (b.v & 524288 || b.tg) ? b.va(null, a) : mc(b) ? le(b, a) : "string" === typeof b ? le(b, a) : A(ed, b) ? fd.j(b, a) : ye(a, b);
}
function uc(a, b, c) {
  return null != c && (c.v & 524288 || c.tg) ? c.wa(null, a, b) : mc(c) ? me(c, a, b) : "string" === typeof c ? me(c, a, b) : A(ed, c) ? fd.l(c, a, b) : Ae(a, b, c);
}
function gf(a, b) {
  var c = ["^ "];
  return null != b ? gd(b, a, c) : c;
}
function hf(a) {
  return a;
}
function jf(a, b, c, d) {
  a = a.h ? a.h(b) : a.call(null, b);
  c = uc(a, c, d);
  return a.h ? a.h(c) : a.call(null, c);
}
function kf(a) {
  return a - 1;
}
function lf(a) {
  a = (a - a % 2) / 2;
  return 0 <= a ? Math.floor(a) : Math.ceil(a);
}
function mf(a) {
  a -= a >> 1 & 1431655765;
  a = (a & 858993459) + (a >> 2 & 858993459);
  return 16843009 * (a + (a >> 4) & 252645135) >> 24;
}
function nf(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 1:
      return !0;
    case 2:
      return hd(arguments[0], arguments[1]);
    default:
      a: {
        for (c = arguments[0], d = arguments[1], b = new w(b.slice(2), 0, null);;) {
          if (c === d) {
            if (K(b)) {
              c = d, d = I(b), b = K(b);
            } else {
              c = d === I(b);
              break a;
            }
          } else {
            c = !1;
            break a;
          }
        }
      }
      return c;
  }
}
function of(a, b) {
  return hd(a, b);
}
var E = function E(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 0:
      return E.w();
    case 1:
      return E.h(arguments[0]);
    default:
      return E.A(arguments[0], new w(c.slice(1), 0, null));
  }
};
E.w = function() {
  return "";
};
E.h = function(a) {
  return null == a ? "" : "" + a;
};
E.A = function(a, b) {
  for (var c = new hb("" + E(a)), d = b;;) {
    if (z(d)) {
      c = c.append("" + E(I(d))), d = K(d);
    } else {
      return c.toString();
    }
  }
};
E.H = function(a) {
  var b = I(a);
  a = K(a);
  return E.A(b, a);
};
E.L = 1;
function pf(a, b, c) {
  return a.substring(b, c);
}
function ue(a, b) {
  var c;
  if (Ne(b)) {
    if (oe(a) && oe(b) && P(a) !== P(b)) {
      c = !1;
    } else {
      a: {
        c = x(a);
        for (var d = x(b);;) {
          if (null == c) {
            c = null == d;
            break a;
          }
          if (null != d && M.j(I(c), I(d))) {
            c = K(c), d = K(d);
          } else {
            c = !1;
            break a;
          }
        }
      }
    }
  } else {
    c = null;
  }
  return Xe(c);
}
function qf(a) {
  var b = 0;
  for (a = x(a);;) {
    if (a) {
      var c = I(a), b = (b + (Ud(rf.h ? rf.h(c) : rf.call(null, c)) ^ Ud(sf.h ? sf.h(c) : sf.call(null, c)))) % 4503599627370496;
      a = K(a);
    } else {
      return b;
    }
  }
}
function tf(a, b, c, d, e) {
  this.meta = a;
  this.first = b;
  this.Mb = c;
  this.count = d;
  this.F = e;
  this.v = 65937646;
  this.K = 8192;
}
h = tf.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, this.count);
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new tf(this.meta, this.first, this.Mb, this.count, this.F);
};
h.Ya = function() {
  return 1 === this.count ? null : this.Mb;
};
h.ia = function() {
  return this.count;
};
h.kc = function() {
  return this.first;
};
h.lc = function() {
  return Hc(this);
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return dd(Zd, this.meta);
};
h.va = function(a, b) {
  return ye(b, this);
};
h.wa = function(a, b, c) {
  return Ae(b, c, this);
};
h.xa = function() {
  return this.first;
};
h.Qa = function() {
  return 1 === this.count ? Zd : this.Mb;
};
h.da = function() {
  return this;
};
h.S = function(a, b) {
  return new tf(b, this.first, this.Mb, this.count, this.F);
};
h.ea = function(a, b) {
  return new tf(this.meta, b, this, this.count + 1, null);
};
function uf(a) {
  return null != a ? a.v & 33554432 || a.Ch ? !0 : a.v ? !1 : A(md, a) : A(md, a);
}
tf.prototype[sc] = function() {
  return ae(this);
};
function vf(a) {
  this.meta = a;
  this.v = 65937614;
  this.K = 8192;
}
h = vf.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new vf(this.meta);
};
h.Ya = function() {
  return null;
};
h.ia = function() {
  return 0;
};
h.kc = function() {
  return null;
};
h.lc = function() {
  throw Error("Can't pop empty list");
};
h.U = function() {
  return de;
};
h.I = function(a, b) {
  return uf(b) || Ne(b) ? null == x(b) : !1;
};
h.ma = function() {
  return this;
};
h.va = function(a, b) {
  return ye(b, this);
};
h.wa = function(a, b, c) {
  return Ae(b, c, this);
};
h.xa = function() {
  return null;
};
h.Qa = function() {
  return Zd;
};
h.da = function() {
  return null;
};
h.S = function(a, b) {
  return new vf(b);
};
h.ea = function(a, b) {
  return new tf(this.meta, b, null, 1, null);
};
var Zd = new vf(null);
vf.prototype[sc] = function() {
  return ae(this);
};
function wf(a) {
  return (null != a ? a.v & 134217728 || a.Eh || (a.v ? 0 : A(od, a)) : A(od, a)) ? pd(a) : uc(Ce, Zd, a);
}
var xf = function xf(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  return xf.A(0 < c.length ? new w(c.slice(0), 0, null) : null);
};
xf.A = function(a) {
  var b;
  if (a instanceof w && 0 === a.i) {
    b = a.o;
  } else {
    a: {
      for (b = [];;) {
        if (null != a) {
          b.push(a.xa(null)), a = a.Ya(null);
        } else {
          break a;
        }
      }
    }
  }
  a = b.length;
  for (var c = Zd;;) {
    if (0 < a) {
      var d = a - 1, c = c.ea(null, b[a - 1]);
      a = d;
    } else {
      return c;
    }
  }
};
xf.L = 0;
xf.H = function(a) {
  return xf.A(x(a));
};
function yf(a, b, c, d) {
  this.meta = a;
  this.first = b;
  this.Mb = c;
  this.F = d;
  this.v = 65929452;
  this.K = 8192;
}
h = yf.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new yf(this.meta, this.first, this.Mb, this.F);
};
h.Ya = function() {
  return null == this.Mb ? null : x(this.Mb);
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(Zd, this.meta);
};
h.va = function(a, b) {
  return ye(b, this);
};
h.wa = function(a, b, c) {
  return Ae(b, c, this);
};
h.xa = function() {
  return this.first;
};
h.Qa = function() {
  return null == this.Mb ? Zd : this.Mb;
};
h.da = function() {
  return this;
};
h.S = function(a, b) {
  return new yf(b, this.first, this.Mb, this.F);
};
h.ea = function(a, b) {
  return new yf(null, b, this, null);
};
yf.prototype[sc] = function() {
  return ae(this);
};
function ve(a, b) {
  var c = null == b;
  return (c ? c : null != b && (b.v & 64 || b.R)) ? new yf(null, a, b, null) : new yf(null, a, x(b), null);
}
function zf(a, b) {
  if (a.hb === b.hb) {
    return 0;
  }
  var c = nc(a.Va);
  if (z(c ? b.Va : c)) {
    return -1;
  }
  if (z(a.Va)) {
    if (nc(b.Va)) {
      return 1;
    }
    c = wb(a.Va, b.Va);
    return 0 === c ? wb(a.name, b.name) : c;
  }
  return wb(a.name, b.name);
}
function X(a, b, c, d) {
  this.Va = a;
  this.name = b;
  this.hb = c;
  this.Mc = d;
  this.v = 2153775105;
  this.K = 4096;
}
h = X.prototype;
h.toString = function() {
  return [E(":"), E(this.hb)].join("");
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.I = function(a, b) {
  return b instanceof X ? this.hb === b.hb : !1;
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return H.j(c, this);
      case 3:
        return H.l(c, this, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.j = function(a, c) {
    return H.j(c, this);
  };
  a.l = function(a, c, d) {
    return H.l(c, this, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return H.j(a, this);
};
h.j = function(a, b) {
  return H.l(a, this, b);
};
h.U = function() {
  var a = this.Mc;
  return null != a ? a : this.Mc = a = Vd(Qd(this.name), Td(this.Va)) + 2654435769 | 0;
};
h.pd = function() {
  return this.name;
};
h.qd = function() {
  return this.Va;
};
h.V = function(a, b) {
  return qd(b, [E(":"), E(this.hb)].join(""));
};
function Y(a, b) {
  return a === b ? !0 : a instanceof X && b instanceof X ? a.hb === b.hb : !1;
}
function Af(a) {
  if (null != a && (a.K & 4096 || a.uf)) {
    return a.qd(null);
  }
  throw Error([E("Doesn't support namespace: "), E(a)].join(""));
}
var Bf = function Bf(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 1:
      return Bf.h(arguments[0]);
    case 2:
      return Bf.j(arguments[0], arguments[1]);
    default:
      throw Error([E("Invalid arity: "), E(c.length)].join(""));;
  }
};
Bf.h = function(a) {
  if (a instanceof X) {
    return a;
  }
  if (a instanceof F) {
    return new X(Af(a), Cf.h ? Cf.h(a) : Cf.call(null, a), a.ab, null);
  }
  if ("string" === typeof a) {
    var b = a.split("/");
    return 2 === b.length ? new X(b[0], b[1], a, null) : new X(null, b[0], a, null);
  }
  return null;
};
Bf.j = function(a, b) {
  return new X(a, b, [E(z(a) ? [E(a), E("/")].join("") : null), E(b)].join(""), null);
};
Bf.L = 2;
function Df(a, b, c, d) {
  this.meta = a;
  this.Sb = b;
  this.s = c;
  this.F = d;
  this.v = 32374988;
  this.K = 1;
}
h = Df.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
function Ef(a) {
  null != a.Sb && (a.s = a.Sb.w ? a.Sb.w() : a.Sb.call(null), a.Sb = null);
  return a.s;
}
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.meta;
};
h.Ya = function() {
  kd(this);
  return null == this.s ? null : K(this.s);
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(Zd, this.meta);
};
h.va = function(a, b) {
  return ye(b, this);
};
h.wa = function(a, b, c) {
  return Ae(b, c, this);
};
h.xa = function() {
  kd(this);
  return null == this.s ? null : I(this.s);
};
h.Qa = function() {
  kd(this);
  return null != this.s ? Yd(this.s) : Zd;
};
h.da = function() {
  Ef(this);
  if (null == this.s) {
    return null;
  }
  for (var a = this.s;;) {
    if (a instanceof Df) {
      a = Ef(a);
    } else {
      return this.s = a, x(this.s);
    }
  }
};
h.S = function(a, b) {
  return new Df(b, this.Sb, this.s, this.F);
};
h.ea = function(a, b) {
  return ve(b, this);
};
Df.prototype[sc] = function() {
  return ae(this);
};
function Ff(a, b) {
  this.X = a;
  this.end = b;
  this.v = 2;
  this.K = 0;
}
Ff.prototype.add = function(a) {
  this.X[this.end] = a;
  return this.end += 1;
};
Ff.prototype.ib = function() {
  var a = new Gf(this.X, 0, this.end);
  this.X = null;
  return a;
};
Ff.prototype.ia = function() {
  return this.end;
};
function Gf(a, b, c) {
  this.o = a;
  this.off = b;
  this.end = c;
  this.v = 524306;
  this.K = 0;
}
h = Gf.prototype;
h.ia = function() {
  return this.end - this.off;
};
h.Z = function(a, b) {
  return this.o[this.off + b];
};
h.cb = function(a, b, c) {
  return 0 <= b && b < this.end - this.off ? this.o[this.off + b] : c;
};
h.rf = function() {
  if (this.off === this.end) {
    throw Error("-drop-first of empty chunk");
  }
  return new Gf(this.o, this.off + 1, this.end);
};
h.va = function(a, b) {
  return ne(this.o, b, this.o[this.off], this.off + 1);
};
h.wa = function(a, b, c) {
  return ne(this.o, b, c, this.off);
};
function Hf(a, b, c, d) {
  this.ib = a;
  this.Ub = b;
  this.meta = c;
  this.F = d;
  this.v = 31850732;
  this.K = 1536;
}
h = Hf.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.meta;
};
h.Ya = function() {
  if (1 < zc(this.ib)) {
    return new Hf(zd(this.ib), this.Ub, this.meta, null);
  }
  var a = kd(this.Ub);
  return null == a ? null : a;
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(Zd, this.meta);
};
h.xa = function() {
  return Ec.j(this.ib, 0);
};
h.Qa = function() {
  return 1 < zc(this.ib) ? new Hf(zd(this.ib), this.Ub, this.meta, null) : null == this.Ub ? Zd : this.Ub;
};
h.da = function() {
  return this;
};
h.Be = function() {
  return this.ib;
};
h.Ce = function() {
  return null == this.Ub ? Zd : this.Ub;
};
h.S = function(a, b) {
  return new Hf(this.ib, this.Ub, b, this.F);
};
h.ea = function(a, b) {
  return ve(b, this);
};
h.Ae = function() {
  return null == this.Ub ? null : this.Ub;
};
Hf.prototype[sc] = function() {
  return ae(this);
};
function If(a, b) {
  return 0 === zc(a) ? b : new Hf(a, b, null, null);
}
function Jf(a, b) {
  a.add(b);
}
function ef(a) {
  for (var b = [];;) {
    if (x(a)) {
      b.push(I(a)), a = K(a);
    } else {
      return b;
    }
  }
}
function Kf(a) {
  if ("number" === typeof a) {
    a: {
      var b = Array(a);
      if (We(null)) {
        for (var c = 0, d = x(null);;) {
          if (d && c < a) {
            b[c] = I(d), c += 1, d = K(d);
          } else {
            a = b;
            break a;
          }
        }
      } else {
        for (c = 0;;) {
          if (c < a) {
            b[c] = null, c += 1;
          } else {
            break;
          }
        }
        a = b;
      }
    }
  } else {
    a = jc(a);
  }
  return a;
}
function Lf(a, b) {
  if (oe(b)) {
    return P(b);
  }
  for (var c = 0, d = x(b);;) {
    if (null != d && c < a) {
      c += 1, d = K(d);
    } else {
      return c;
    }
  }
}
var Mf = function Mf(b) {
  return null == b ? null : null == K(b) ? x(I(b)) : ve(I(b), Mf(K(b)));
}, Nf = function Nf(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 0:
      return Nf.w();
    case 1:
      return Nf.h(arguments[0]);
    case 2:
      return Nf.j(arguments[0], arguments[1]);
    default:
      return Nf.A(arguments[0], arguments[1], new w(c.slice(2), 0, null));
  }
};
Nf.w = function() {
  return new Df(null, function() {
    return null;
  }, null, null);
};
Nf.h = function(a) {
  return new Df(null, function() {
    return a;
  }, null, null);
};
Nf.j = function(a, b) {
  return new Df(null, function() {
    var c = x(a);
    return c ? Se(c) ? If(Ad(c), Nf.j(Bd(c), b)) : ve(I(c), Nf.j(Yd(c), b)) : b;
  }, null, null);
};
Nf.A = function(a, b, c) {
  return function e(a, b) {
    return new Df(null, function() {
      var c = x(a);
      return c ? Se(c) ? If(Ad(c), e(Bd(c), b)) : ve(I(c), e(Yd(c), b)) : z(b) ? e(I(b), K(b)) : null;
    }, null, null);
  }(Nf.j(a, b), c);
};
Nf.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  c = K(c);
  return Nf.A(b, a, c);
};
Nf.L = 2;
var Of = function Of(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 0:
      return Of.w();
    case 1:
      return Of.h(arguments[0]);
    case 2:
      return Of.j(arguments[0], arguments[1]);
    default:
      return Of.A(arguments[0], arguments[1], new w(c.slice(2), 0, null));
  }
};
Of.w = function() {
  return sd(De);
};
Of.h = function(a) {
  return a;
};
Of.j = function(a, b) {
  return td(a, b);
};
Of.A = function(a, b, c) {
  for (;;) {
    if (a = td(a, b), z(c)) {
      b = I(c), c = K(c);
    } else {
      return a;
    }
  }
};
Of.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  c = K(c);
  return Of.A(b, a, c);
};
Of.L = 2;
var Pf = function Pf(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 3:
      return Pf.l(arguments[0], arguments[1], arguments[2]);
    default:
      return Pf.A(arguments[0], arguments[1], arguments[2], new w(c.slice(3), 0, null));
  }
};
Pf.l = function(a, b, c) {
  return vd(a, b, c);
};
Pf.A = function(a, b, c, d) {
  for (;;) {
    if (a = vd(a, b, c), z(d)) {
      b = I(d), c = Be(d), d = K(K(d));
    } else {
      return a;
    }
  }
};
Pf.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  var d = K(c), c = I(d), d = K(d);
  return Pf.A(b, a, c, d);
};
Pf.L = 3;
function Qf(a, b, c) {
  var d = x(c);
  if (0 === b) {
    return a.w ? a.w() : a.call(null);
  }
  c = Gc(d);
  var e = Hc(d);
  if (1 === b) {
    return a.h ? a.h(c) : a.h ? a.h(c) : a.call(null, c);
  }
  var d = Gc(e), f = Hc(e);
  if (2 === b) {
    return a.j ? a.j(c, d) : a.j ? a.j(c, d) : a.call(null, c, d);
  }
  var e = Gc(f), g = Hc(f);
  if (3 === b) {
    return a.l ? a.l(c, d, e) : a.l ? a.l(c, d, e) : a.call(null, c, d, e);
  }
  var f = Gc(g), k = Hc(g);
  if (4 === b) {
    return a.J ? a.J(c, d, e, f) : a.J ? a.J(c, d, e, f) : a.call(null, c, d, e, f);
  }
  var g = Gc(k), l = Hc(k);
  if (5 === b) {
    return a.P ? a.P(c, d, e, f, g) : a.P ? a.P(c, d, e, f, g) : a.call(null, c, d, e, f, g);
  }
  var k = Gc(l), n = Hc(l);
  if (6 === b) {
    return a.ta ? a.ta(c, d, e, f, g, k) : a.ta ? a.ta(c, d, e, f, g, k) : a.call(null, c, d, e, f, g, k);
  }
  var l = Gc(n), m = Hc(n);
  if (7 === b) {
    return a.Aa ? a.Aa(c, d, e, f, g, k, l) : a.Aa ? a.Aa(c, d, e, f, g, k, l) : a.call(null, c, d, e, f, g, k, l);
  }
  var n = Gc(m), r = Hc(m);
  if (8 === b) {
    return a.Oa ? a.Oa(c, d, e, f, g, k, l, n) : a.Oa ? a.Oa(c, d, e, f, g, k, l, n) : a.call(null, c, d, e, f, g, k, l, n);
  }
  var m = Gc(r), t = Hc(r);
  if (9 === b) {
    return a.Pa ? a.Pa(c, d, e, f, g, k, l, n, m) : a.Pa ? a.Pa(c, d, e, f, g, k, l, n, m) : a.call(null, c, d, e, f, g, k, l, n, m);
  }
  var r = Gc(t), u = Hc(t);
  if (10 === b) {
    return a.Da ? a.Da(c, d, e, f, g, k, l, n, m, r) : a.Da ? a.Da(c, d, e, f, g, k, l, n, m, r) : a.call(null, c, d, e, f, g, k, l, n, m, r);
  }
  var t = Gc(u), v = Hc(u);
  if (11 === b) {
    return a.Ea ? a.Ea(c, d, e, f, g, k, l, n, m, r, t) : a.Ea ? a.Ea(c, d, e, f, g, k, l, n, m, r, t) : a.call(null, c, d, e, f, g, k, l, n, m, r, t);
  }
  var u = Gc(v), y = Hc(v);
  if (12 === b) {
    return a.Fa ? a.Fa(c, d, e, f, g, k, l, n, m, r, t, u) : a.Fa ? a.Fa(c, d, e, f, g, k, l, n, m, r, t, u) : a.call(null, c, d, e, f, g, k, l, n, m, r, t, u);
  }
  var v = Gc(y), B = Hc(y);
  if (13 === b) {
    return a.Ga ? a.Ga(c, d, e, f, g, k, l, n, m, r, t, u, v) : a.Ga ? a.Ga(c, d, e, f, g, k, l, n, m, r, t, u, v) : a.call(null, c, d, e, f, g, k, l, n, m, r, t, u, v);
  }
  var y = Gc(B), G = Hc(B);
  if (14 === b) {
    return a.Ha ? a.Ha(c, d, e, f, g, k, l, n, m, r, t, u, v, y) : a.Ha ? a.Ha(c, d, e, f, g, k, l, n, m, r, t, u, v, y) : a.call(null, c, d, e, f, g, k, l, n, m, r, t, u, v, y);
  }
  var B = Gc(G), D = Hc(G);
  if (15 === b) {
    return a.Ia ? a.Ia(c, d, e, f, g, k, l, n, m, r, t, u, v, y, B) : a.Ia ? a.Ia(c, d, e, f, g, k, l, n, m, r, t, u, v, y, B) : a.call(null, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B);
  }
  var G = Gc(D), L = Hc(D);
  if (16 === b) {
    return a.Ja ? a.Ja(c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G) : a.Ja ? a.Ja(c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G) : a.call(null, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G);
  }
  var D = Gc(L), R = Hc(L);
  if (17 === b) {
    return a.Ka ? a.Ka(c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D) : a.Ka ? a.Ka(c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D) : a.call(null, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D);
  }
  var L = Gc(R), wa = Hc(R);
  if (18 === b) {
    return a.La ? a.La(c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L) : a.La ? a.La(c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L) : a.call(null, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L);
  }
  R = Gc(wa);
  wa = Hc(wa);
  if (19 === b) {
    return a.Ma ? a.Ma(c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L, R) : a.Ma ? a.Ma(c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L, R) : a.call(null, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L, R);
  }
  var J = Gc(wa);
  Hc(wa);
  if (20 === b) {
    return a.Na ? a.Na(c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L, R, J) : a.Na ? a.Na(c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L, R, J) : a.call(null, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L, R, J);
  }
  throw Error("Only up to 20 arguments supported on functions");
}
function Ie(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 2:
      return Rf(arguments[0], arguments[1]);
    case 3:
      return Sf(arguments[0], arguments[1], arguments[2]);
    case 4:
      return Tf(arguments[0], arguments[1], arguments[2], arguments[3]);
    case 5:
      return Uf(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    default:
      return Vf(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], new w(b.slice(5), 0, null));
  }
}
function Rf(a, b) {
  var c = a.L;
  if (a.H) {
    var d = Lf(c + 1, b);
    return d <= c ? Qf(a, d, b) : a.H(b);
  }
  return a.apply(a, ef(b));
}
function Sf(a, b, c) {
  b = ve(b, c);
  c = a.L;
  if (a.H) {
    var d = Lf(c + 1, b);
    return d <= c ? Qf(a, d, b) : a.H(b);
  }
  return a.apply(a, ef(b));
}
function Tf(a, b, c, d) {
  b = ve(b, ve(c, d));
  c = a.L;
  return a.H ? (d = Lf(c + 1, b), d <= c ? Qf(a, d, b) : a.H(b)) : a.apply(a, ef(b));
}
function Uf(a, b, c, d, e) {
  b = ve(b, ve(c, ve(d, e)));
  c = a.L;
  return a.H ? (d = Lf(c + 1, b), d <= c ? Qf(a, d, b) : a.H(b)) : a.apply(a, ef(b));
}
function Vf(a, b, c, d, e, f) {
  b = ve(b, ve(c, ve(d, ve(e, Mf(f)))));
  c = a.L;
  return a.H ? (d = Lf(c + 1, b), d <= c ? Qf(a, d, b) : a.H(b)) : a.apply(a, ef(b));
}
var Wf = function Wf(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 1:
      return Wf.h(arguments[0]);
    case 2:
      return Wf.j(arguments[0], arguments[1]);
    default:
      return Wf.A(arguments[0], arguments[1], new w(c.slice(2), 0, null));
  }
};
Wf.h = function() {
  return !1;
};
Wf.j = function(a, b) {
  return !M.j(a, b);
};
Wf.A = function(a, b, c) {
  return nc(Tf(M, a, b, c));
};
Wf.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  c = K(c);
  return Wf.A(b, a, c);
};
Wf.L = 2;
function Xf(a) {
  return x(a) ? a : null;
}
var Yf = function Yf() {
  "undefined" === typeof Xb && (Xb = function(b, c) {
    this.Yg = b;
    this.Ng = c;
    this.v = 393216;
    this.K = 0;
  }, Xb.prototype.S = function(b, c) {
    return new Xb(this.Yg, c);
  }, Xb.prototype.O = function() {
    return this.Ng;
  }, Xb.prototype.Ca = function() {
    return !1;
  }, Xb.prototype.next = function() {
    return Error("No such element");
  }, Xb.prototype.remove = function() {
    return Error("Unsupported operation");
  }, Xb.cc = function() {
    return new V(null, 2, 5, W, [xe(Zf, new q(null, 1, [$f, xf(ag, xf(De))], null)), bg], null);
  }, Xb.Db = !0, Xb.ob = "cljs.core/t_cljs$core59449", Xb.Rb = function(b, c) {
    return qd(c, "cljs.core/t_cljs$core59449");
  });
  return new Xb(Yf, cg);
};
function dg(a, b) {
  for (;;) {
    if (null == x(b)) {
      return !0;
    }
    var c;
    c = I(b);
    c = a.h ? a.h(c) : a.call(null, c);
    if (z(c)) {
      c = a;
      var d = K(b);
      a = c;
      b = d;
    } else {
      return !1;
    }
  }
}
function eg(a, b) {
  for (;;) {
    if (x(b)) {
      var c;
      c = I(b);
      c = a.h ? a.h(c) : a.call(null, c);
      if (z(c)) {
        return c;
      }
      c = a;
      var d = K(b);
      a = c;
      b = d;
    } else {
      return null;
    }
  }
}
function fg(a) {
  return function() {
    function b(b, c) {
      return nc(a.j ? a.j(b, c) : a.call(null, b, c));
    }
    function c(b) {
      return nc(a.h ? a.h(b) : a.call(null, b));
    }
    function d() {
      return nc(a.w ? a.w() : a.call(null));
    }
    var e = null, f = function() {
      function b(a, d, e) {
        var f = null;
        if (2 < arguments.length) {
          for (var f = 0, g = Array(arguments.length - 2);f < g.length;) {
            g[f] = arguments[f + 2], ++f;
          }
          f = new w(g, 0);
        }
        return c.call(this, a, d, f);
      }
      function c(b, d, e) {
        return nc(Tf(a, b, d, e));
      }
      b.L = 2;
      b.H = function(a) {
        var b = I(a);
        a = K(a);
        var d = I(a);
        a = Yd(a);
        return c(b, d, a);
      };
      b.A = c;
      return b;
    }(), e = function(a, e, l) {
      switch(arguments.length) {
        case 0:
          return d.call(this);
        case 1:
          return c.call(this, a);
        case 2:
          return b.call(this, a, e);
        default:
          var n = null;
          if (2 < arguments.length) {
            for (var n = 0, m = Array(arguments.length - 2);n < m.length;) {
              m[n] = arguments[n + 2], ++n;
            }
            n = new w(m, 0);
          }
          return f.A(a, e, n);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    e.L = 2;
    e.H = f.H;
    e.w = d;
    e.h = c;
    e.j = b;
    e.A = f.A;
    return e;
  }();
}
function gg() {
  return function() {
    function a(a) {
      if (0 < arguments.length) {
        for (var c = 0, d = Array(arguments.length - 0);c < d.length;) {
          d[c] = arguments[c + 0], ++c;
        }
      }
      return !1;
    }
    a.L = 0;
    a.H = function(a) {
      x(a);
      return !1;
    };
    a.A = function() {
      return !1;
    };
    return a;
  }();
}
var hg = function hg(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 0:
      return hg.w();
    case 1:
      return hg.h(arguments[0]);
    case 2:
      return hg.j(arguments[0], arguments[1]);
    case 3:
      return hg.l(arguments[0], arguments[1], arguments[2]);
    default:
      return hg.A(arguments[0], arguments[1], arguments[2], new w(c.slice(3), 0, null));
  }
};
hg.w = function() {
  return hf;
};
hg.h = function(a) {
  return a;
};
hg.j = function(a, b) {
  return function() {
    function c(c, d, e) {
      c = b.l ? b.l(c, d, e) : b.call(null, c, d, e);
      return a.h ? a.h(c) : a.call(null, c);
    }
    function d(c, d) {
      var e = b.j ? b.j(c, d) : b.call(null, c, d);
      return a.h ? a.h(e) : a.call(null, e);
    }
    function e(c) {
      c = b.h ? b.h(c) : b.call(null, c);
      return a.h ? a.h(c) : a.call(null, c);
    }
    function f() {
      var c = b.w ? b.w() : b.call(null);
      return a.h ? a.h(c) : a.call(null, c);
    }
    var g = null, k = function() {
      function c(a, b, e, f) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
            k[g] = arguments[g + 3], ++g;
          }
          g = new w(k, 0);
        }
        return d.call(this, a, b, e, g);
      }
      function d(c, e, f, g) {
        c = Uf(b, c, e, f, g);
        return a.h ? a.h(c) : a.call(null, c);
      }
      c.L = 3;
      c.H = function(a) {
        var b = I(a);
        a = K(a);
        var c = I(a);
        a = K(a);
        var e = I(a);
        a = Yd(a);
        return d(b, c, e, a);
      };
      c.A = d;
      return c;
    }(), g = function(a, b, g, r) {
      switch(arguments.length) {
        case 0:
          return f.call(this);
        case 1:
          return e.call(this, a);
        case 2:
          return d.call(this, a, b);
        case 3:
          return c.call(this, a, b, g);
        default:
          var t = null;
          if (3 < arguments.length) {
            for (var t = 0, u = Array(arguments.length - 3);t < u.length;) {
              u[t] = arguments[t + 3], ++t;
            }
            t = new w(u, 0);
          }
          return k.A(a, b, g, t);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    g.L = 3;
    g.H = k.H;
    g.w = f;
    g.h = e;
    g.j = d;
    g.l = c;
    g.A = k.A;
    return g;
  }();
};
hg.l = function(a, b, c) {
  return function() {
    function d(d, e, f) {
      d = c.l ? c.l(d, e, f) : c.call(null, d, e, f);
      d = b.h ? b.h(d) : b.call(null, d);
      return a.h ? a.h(d) : a.call(null, d);
    }
    function e(d, e) {
      var f;
      f = c.j ? c.j(d, e) : c.call(null, d, e);
      f = b.h ? b.h(f) : b.call(null, f);
      return a.h ? a.h(f) : a.call(null, f);
    }
    function f(d) {
      d = c.h ? c.h(d) : c.call(null, d);
      d = b.h ? b.h(d) : b.call(null, d);
      return a.h ? a.h(d) : a.call(null, d);
    }
    function g() {
      var d;
      d = c.w ? c.w() : c.call(null);
      d = b.h ? b.h(d) : b.call(null, d);
      return a.h ? a.h(d) : a.call(null, d);
    }
    var k = null, l = function() {
      function d(a, b, c, f) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
            k[g] = arguments[g + 3], ++g;
          }
          g = new w(k, 0);
        }
        return e.call(this, a, b, c, g);
      }
      function e(d, f, g, k) {
        d = Uf(c, d, f, g, k);
        d = b.h ? b.h(d) : b.call(null, d);
        return a.h ? a.h(d) : a.call(null, d);
      }
      d.L = 3;
      d.H = function(a) {
        var b = I(a);
        a = K(a);
        var c = I(a);
        a = K(a);
        var d = I(a);
        a = Yd(a);
        return e(b, c, d, a);
      };
      d.A = e;
      return d;
    }(), k = function(a, b, c, k) {
      switch(arguments.length) {
        case 0:
          return g.call(this);
        case 1:
          return f.call(this, a);
        case 2:
          return e.call(this, a, b);
        case 3:
          return d.call(this, a, b, c);
        default:
          var u = null;
          if (3 < arguments.length) {
            for (var u = 0, v = Array(arguments.length - 3);u < v.length;) {
              v[u] = arguments[u + 3], ++u;
            }
            u = new w(v, 0);
          }
          return l.A(a, b, c, u);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    k.L = 3;
    k.H = l.H;
    k.w = g;
    k.h = f;
    k.j = e;
    k.l = d;
    k.A = l.A;
    return k;
  }();
};
hg.A = function(a, b, c, d) {
  return function(a) {
    return function() {
      function b(a) {
        var d = null;
        if (0 < arguments.length) {
          for (var d = 0, e = Array(arguments.length - 0);d < e.length;) {
            e[d] = arguments[d + 0], ++d;
          }
          d = new w(e, 0);
        }
        return c.call(this, d);
      }
      function c(b) {
        b = Rf(I(a), b);
        for (var d = K(a);;) {
          if (d) {
            b = I(d).call(null, b), d = K(d);
          } else {
            return b;
          }
        }
      }
      b.L = 0;
      b.H = function(a) {
        a = x(a);
        return c(a);
      };
      b.A = c;
      return b;
    }();
  }(wf(ve(a, ve(b, ve(c, d)))));
};
hg.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  var d = K(c), c = I(d), d = K(d);
  return hg.A(b, a, c, d);
};
hg.L = 3;
function ig(a, b) {
  return function() {
    function c(c, d, e) {
      return a.J ? a.J(b, c, d, e) : a.call(null, b, c, d, e);
    }
    function d(c, d) {
      return a.l ? a.l(b, c, d) : a.call(null, b, c, d);
    }
    function e(c) {
      return a.j ? a.j(b, c) : a.call(null, b, c);
    }
    function f() {
      return a.h ? a.h(b) : a.call(null, b);
    }
    var g = null, k = function() {
      function c(a, b, e, f) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
            k[g] = arguments[g + 3], ++g;
          }
          g = new w(k, 0);
        }
        return d.call(this, a, b, e, g);
      }
      function d(c, e, f, g) {
        return Vf(a, b, c, e, f, S([g], 0));
      }
      c.L = 3;
      c.H = function(a) {
        var b = I(a);
        a = K(a);
        var c = I(a);
        a = K(a);
        var e = I(a);
        a = Yd(a);
        return d(b, c, e, a);
      };
      c.A = d;
      return c;
    }(), g = function(a, b, g, r) {
      switch(arguments.length) {
        case 0:
          return f.call(this);
        case 1:
          return e.call(this, a);
        case 2:
          return d.call(this, a, b);
        case 3:
          return c.call(this, a, b, g);
        default:
          var t = null;
          if (3 < arguments.length) {
            for (var t = 0, u = Array(arguments.length - 3);t < u.length;) {
              u[t] = arguments[t + 3], ++t;
            }
            t = new w(u, 0);
          }
          return k.A(a, b, g, t);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    g.L = 3;
    g.H = k.H;
    g.w = f;
    g.h = e;
    g.j = d;
    g.l = c;
    g.A = k.A;
    return g;
  }();
}
function jg(a, b) {
  var c = kg;
  return function() {
    function d(d, e, f) {
      return c.P ? c.P(a, b, d, e, f) : c.call(null, a, b, d, e, f);
    }
    function e(d, e) {
      return c.J ? c.J(a, b, d, e) : c.call(null, a, b, d, e);
    }
    function f(d) {
      return c.l ? c.l(a, b, d) : c.call(null, a, b, d);
    }
    function g() {
      return c.j ? c.j(a, b) : c.call(null, a, b);
    }
    var k = null, l = function() {
      function d(a, b, c, f) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
            k[g] = arguments[g + 3], ++g;
          }
          g = new w(k, 0);
        }
        return e.call(this, a, b, c, g);
      }
      function e(d, f, g, k) {
        return Vf(c, a, b, d, f, S([g, k], 0));
      }
      d.L = 3;
      d.H = function(a) {
        var b = I(a);
        a = K(a);
        var c = I(a);
        a = K(a);
        var d = I(a);
        a = Yd(a);
        return e(b, c, d, a);
      };
      d.A = e;
      return d;
    }(), k = function(a, b, c, k) {
      switch(arguments.length) {
        case 0:
          return g.call(this);
        case 1:
          return f.call(this, a);
        case 2:
          return e.call(this, a, b);
        case 3:
          return d.call(this, a, b, c);
        default:
          var u = null;
          if (3 < arguments.length) {
            for (var u = 0, v = Array(arguments.length - 3);u < v.length;) {
              v[u] = arguments[u + 3], ++u;
            }
            u = new w(v, 0);
          }
          return l.A(a, b, c, u);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    k.L = 3;
    k.H = l.H;
    k.w = g;
    k.h = f;
    k.j = e;
    k.l = d;
    k.A = l.A;
    return k;
  }();
}
function lg(a, b, c) {
  var d = mg;
  return function() {
    function e(e, f, g) {
      return d.ta ? d.ta(a, b, c, e, f, g) : d.call(null, a, b, c, e, f, g);
    }
    function f(e, f) {
      return d.P ? d.P(a, b, c, e, f) : d.call(null, a, b, c, e, f);
    }
    function g(e) {
      return d.J ? d.J(a, b, c, e) : d.call(null, a, b, c, e);
    }
    function k() {
      return d.l ? d.l(a, b, c) : d.call(null, a, b, c);
    }
    var l = null, n = function() {
      function e(a, b, c, d) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
            k[g] = arguments[g + 3], ++g;
          }
          g = new w(k, 0);
        }
        return f.call(this, a, b, c, g);
      }
      function f(e, g, k, l) {
        return Vf(d, a, b, c, e, S([g, k, l], 0));
      }
      e.L = 3;
      e.H = function(a) {
        var b = I(a);
        a = K(a);
        var c = I(a);
        a = K(a);
        var d = I(a);
        a = Yd(a);
        return f(b, c, d, a);
      };
      e.A = f;
      return e;
    }(), l = function(a, b, c, d) {
      switch(arguments.length) {
        case 0:
          return k.call(this);
        case 1:
          return g.call(this, a);
        case 2:
          return f.call(this, a, b);
        case 3:
          return e.call(this, a, b, c);
        default:
          var l = null;
          if (3 < arguments.length) {
            for (var l = 0, y = Array(arguments.length - 3);l < y.length;) {
              y[l] = arguments[l + 3], ++l;
            }
            l = new w(y, 0);
          }
          return n.A(a, b, c, l);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    l.L = 3;
    l.H = n.H;
    l.w = k;
    l.h = g;
    l.j = f;
    l.l = e;
    l.A = n.A;
    return l;
  }();
}
function ng(a, b, c, d) {
  this.state = a;
  this.meta = b;
  this.wh = c;
  this.bg = d;
  this.K = 16386;
  this.v = 6455296;
}
h = ng.prototype;
h.equiv = function(a) {
  return this.I(null, a);
};
h.I = function(a, b) {
  return this === b;
};
h.ld = function() {
  return this.state;
};
h.O = function() {
  return this.meta;
};
h.xf = function(a, b, c) {
  a = x(this.bg);
  for (var d = null, e = 0, f = 0;;) {
    if (f < e) {
      var g = d.Z(null, f), k = T(g, 0, null), g = T(g, 1, null);
      g.J ? g.J(k, this, b, c) : g.call(null, k, this, b, c);
      f += 1;
    } else {
      if (a = x(a)) {
        Se(a) ? (d = Ad(a), a = Bd(a), k = d, e = P(d), d = k) : (d = I(a), k = T(d, 0, null), g = T(d, 1, null), g.J ? g.J(k, this, b, c) : g.call(null, k, this, b, c), a = K(a), d = null, e = 0), f = 0;
      } else {
        return null;
      }
    }
  }
};
h.U = function() {
  return la(this);
};
function og(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 1:
      return pg(arguments[0]);
    default:
      return c = arguments[0], b = new w(b.slice(1), 0, null), d = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b, b = H.j(d, ec), d = H.j(d, rg), new ng(c, b, d, null);
  }
}
function pg(a) {
  return new ng(a, null, null, null);
}
function sg(a, b) {
  if (a instanceof ng) {
    var c = a.wh;
    if (null != c && !z(c.h ? c.h(b) : c.call(null, b))) {
      throw Error("Validator rejected reference state");
    }
    c = a.state;
    a.state = b;
    null != a.bg && rd(a, c, b);
    return b;
  }
  return Fd(a, b);
}
var tg = function tg(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 2:
      return tg.j(arguments[0], arguments[1]);
    case 3:
      return tg.l(arguments[0], arguments[1], arguments[2]);
    case 4:
      return tg.J(arguments[0], arguments[1], arguments[2], arguments[3]);
    default:
      return tg.A(arguments[0], arguments[1], arguments[2], arguments[3], new w(c.slice(4), 0, null));
  }
};
tg.j = function(a, b) {
  var c;
  a instanceof ng ? (c = a.state, c = b.h ? b.h(c) : b.call(null, c), c = sg(a, c)) : c = Gd.j(a, b);
  return c;
};
tg.l = function(a, b, c) {
  if (a instanceof ng) {
    var d = a.state;
    b = b.j ? b.j(d, c) : b.call(null, d, c);
    a = sg(a, b);
  } else {
    a = Gd.l(a, b, c);
  }
  return a;
};
tg.J = function(a, b, c, d) {
  if (a instanceof ng) {
    var e = a.state;
    b = b.l ? b.l(e, c, d) : b.call(null, e, c, d);
    a = sg(a, b);
  } else {
    a = Gd.J(a, b, c, d);
  }
  return a;
};
tg.A = function(a, b, c, d, e) {
  return a instanceof ng ? sg(a, Uf(b, a.state, c, d, e)) : Gd.P(a, b, c, d, e);
};
tg.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  var d = K(c), c = I(d), e = K(d), d = I(e), e = K(e);
  return tg.A(b, a, c, d, e);
};
tg.L = 4;
function ug(a) {
  this.state = a;
  this.v = 32768;
  this.K = 0;
}
ug.prototype.wf = function(a, b) {
  return this.state = b;
};
ug.prototype.ld = function() {
  return this.state;
};
var vg = function vg(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 1:
      return vg.h(arguments[0]);
    case 2:
      return vg.j(arguments[0], arguments[1]);
    case 3:
      return vg.l(arguments[0], arguments[1], arguments[2]);
    default:
      return vg.A(arguments[0], arguments[1], arguments[2], new w(c.slice(3), 0, null));
  }
};
vg.h = function(a) {
  return function() {
    function b(b, c, d) {
      b = a.h ? a.h(b) : a.call(null, b);
      z(b) ? (c = a.h ? a.h(c) : a.call(null, c), d = z(c) ? a.h ? a.h(d) : a.call(null, d) : c) : d = b;
      return Xe(d);
    }
    function c(b, c) {
      var d;
      d = a.h ? a.h(b) : a.call(null, b);
      d = z(d) ? a.h ? a.h(c) : a.call(null, c) : d;
      return Xe(d);
    }
    function d(b) {
      return Xe(a.h ? a.h(b) : a.call(null, b));
    }
    var e = null, f = function() {
      function b(a, d, e, f) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, u = Array(arguments.length - 3);g < u.length;) {
            u[g] = arguments[g + 3], ++g;
          }
          g = new w(u, 0);
        }
        return c.call(this, a, d, e, g);
      }
      function c(b, d, f, g) {
        b = e.l(b, d, f);
        g = z(b) ? dg(a, g) : b;
        return Xe(g);
      }
      b.L = 3;
      b.H = function(a) {
        var b = I(a);
        a = K(a);
        var d = I(a);
        a = K(a);
        var e = I(a);
        a = Yd(a);
        return c(b, d, e, a);
      };
      b.A = c;
      return b;
    }(), e = function(a, e, l, n) {
      switch(arguments.length) {
        case 0:
          return !0;
        case 1:
          return d.call(this, a);
        case 2:
          return c.call(this, a, e);
        case 3:
          return b.call(this, a, e, l);
        default:
          var m = null;
          if (3 < arguments.length) {
            for (var m = 0, r = Array(arguments.length - 3);m < r.length;) {
              r[m] = arguments[m + 3], ++m;
            }
            m = new w(r, 0);
          }
          return f.A(a, e, l, m);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    e.L = 3;
    e.H = f.H;
    e.w = function() {
      return !0;
    };
    e.h = d;
    e.j = c;
    e.l = b;
    e.A = f.A;
    return e;
  }();
};
vg.j = function(a, b) {
  return function() {
    function c(c, d, e) {
      return Xe(function() {
        var f = a.h ? a.h(c) : a.call(null, c);
        return z(f) && (f = a.h ? a.h(d) : a.call(null, d), z(f) && (f = a.h ? a.h(e) : a.call(null, e), z(f) && (f = b.h ? b.h(c) : b.call(null, c), z(f)))) ? (f = b.h ? b.h(d) : b.call(null, d), z(f) ? b.h ? b.h(e) : b.call(null, e) : f) : f;
      }());
    }
    function d(c, d) {
      return Xe(function() {
        var e = a.h ? a.h(c) : a.call(null, c);
        return z(e) && (e = a.h ? a.h(d) : a.call(null, d), z(e)) ? (e = b.h ? b.h(c) : b.call(null, c), z(e) ? b.h ? b.h(d) : b.call(null, d) : e) : e;
      }());
    }
    function e(c) {
      var d = a.h ? a.h(c) : a.call(null, c);
      c = z(d) ? b.h ? b.h(c) : b.call(null, c) : d;
      return Xe(c);
    }
    var f = null, g = function() {
      function c(a, b, e, f) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
            k[g] = arguments[g + 3], ++g;
          }
          g = new w(k, 0);
        }
        return d.call(this, a, b, e, g);
      }
      function d(c, e, g, k) {
        return Xe(function() {
          var d = f.l(c, e, g);
          return z(d) ? dg(function() {
            return function(c) {
              var d = a.h ? a.h(c) : a.call(null, c);
              return z(d) ? b.h ? b.h(c) : b.call(null, c) : d;
            };
          }(d), k) : d;
        }());
      }
      c.L = 3;
      c.H = function(a) {
        var b = I(a);
        a = K(a);
        var c = I(a);
        a = K(a);
        var e = I(a);
        a = Yd(a);
        return d(b, c, e, a);
      };
      c.A = d;
      return c;
    }(), f = function(a, b, f, m) {
      switch(arguments.length) {
        case 0:
          return !0;
        case 1:
          return e.call(this, a);
        case 2:
          return d.call(this, a, b);
        case 3:
          return c.call(this, a, b, f);
        default:
          var r = null;
          if (3 < arguments.length) {
            for (var r = 0, t = Array(arguments.length - 3);r < t.length;) {
              t[r] = arguments[r + 3], ++r;
            }
            r = new w(t, 0);
          }
          return g.A(a, b, f, r);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    f.L = 3;
    f.H = g.H;
    f.w = function() {
      return !0;
    };
    f.h = e;
    f.j = d;
    f.l = c;
    f.A = g.A;
    return f;
  }();
};
vg.l = function(a, b, c) {
  return function() {
    function d(d, e, f) {
      return Xe(function() {
        var g = a.h ? a.h(d) : a.call(null, d);
        return z(g) && (g = b.h ? b.h(d) : b.call(null, d), z(g) && (g = c.h ? c.h(d) : c.call(null, d), z(g) && (g = a.h ? a.h(e) : a.call(null, e), z(g) && (g = b.h ? b.h(e) : b.call(null, e), z(g) && (g = c.h ? c.h(e) : c.call(null, e), z(g) && (g = a.h ? a.h(f) : a.call(null, f), z(g))))))) ? (g = b.h ? b.h(f) : b.call(null, f), z(g) ? c.h ? c.h(f) : c.call(null, f) : g) : g;
      }());
    }
    function e(d, e) {
      return Xe(function() {
        var f = a.h ? a.h(d) : a.call(null, d);
        return z(f) && (f = b.h ? b.h(d) : b.call(null, d), z(f) && (f = c.h ? c.h(d) : c.call(null, d), z(f) && (f = a.h ? a.h(e) : a.call(null, e), z(f)))) ? (f = b.h ? b.h(e) : b.call(null, e), z(f) ? c.h ? c.h(e) : c.call(null, e) : f) : f;
      }());
    }
    function f(d) {
      var e = a.h ? a.h(d) : a.call(null, d);
      z(e) ? (e = b.h ? b.h(d) : b.call(null, d), d = z(e) ? c.h ? c.h(d) : c.call(null, d) : e) : d = e;
      return Xe(d);
    }
    var g = null, k = function() {
      function d(a, b, c, f) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
            k[g] = arguments[g + 3], ++g;
          }
          g = new w(k, 0);
        }
        return e.call(this, a, b, c, g);
      }
      function e(d, f, k, l) {
        return Xe(function() {
          var e = g.l(d, f, k);
          return z(e) ? dg(function() {
            return function(d) {
              var e = a.h ? a.h(d) : a.call(null, d);
              return z(e) ? (e = b.h ? b.h(d) : b.call(null, d), z(e) ? c.h ? c.h(d) : c.call(null, d) : e) : e;
            };
          }(e), l) : e;
        }());
      }
      d.L = 3;
      d.H = function(a) {
        var b = I(a);
        a = K(a);
        var c = I(a);
        a = K(a);
        var d = I(a);
        a = Yd(a);
        return e(b, c, d, a);
      };
      d.A = e;
      return d;
    }(), g = function(a, b, c, g) {
      switch(arguments.length) {
        case 0:
          return !0;
        case 1:
          return f.call(this, a);
        case 2:
          return e.call(this, a, b);
        case 3:
          return d.call(this, a, b, c);
        default:
          var t = null;
          if (3 < arguments.length) {
            for (var t = 0, u = Array(arguments.length - 3);t < u.length;) {
              u[t] = arguments[t + 3], ++t;
            }
            t = new w(u, 0);
          }
          return k.A(a, b, c, t);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    g.L = 3;
    g.H = k.H;
    g.w = function() {
      return !0;
    };
    g.h = f;
    g.j = e;
    g.l = d;
    g.A = k.A;
    return g;
  }();
};
vg.A = function(a, b, c, d) {
  return function(a) {
    return function() {
      function b(c, d, f) {
        return dg(function() {
          return function(a) {
            var b = a.h ? a.h(c) : a.call(null, c);
            return z(b) ? (b = a.h ? a.h(d) : a.call(null, d), z(b) ? a.h ? a.h(f) : a.call(null, f) : b) : b;
          };
        }(a), a);
      }
      function c(b, d) {
        return dg(function() {
          return function(a) {
            var c = a.h ? a.h(b) : a.call(null, b);
            return z(c) ? a.h ? a.h(d) : a.call(null, d) : c;
          };
        }(a), a);
      }
      function d(b) {
        return dg(function() {
          return function(a) {
            return a.h ? a.h(b) : a.call(null, b);
          };
        }(a), a);
      }
      var l = null, n = function() {
        function b(a, d, e, f) {
          var g = null;
          if (3 < arguments.length) {
            for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
              k[g] = arguments[g + 3], ++g;
            }
            g = new w(k, 0);
          }
          return c.call(this, a, d, e, g);
        }
        function c(b, d, f, g) {
          return Xe(function() {
            var c = l.l(b, d, f);
            return z(c) ? dg(function() {
              return function(a) {
                return dg(a, g);
              };
            }(c, a), a) : c;
          }());
        }
        b.L = 3;
        b.H = function(a) {
          var b = I(a);
          a = K(a);
          var d = I(a);
          a = K(a);
          var e = I(a);
          a = Yd(a);
          return c(b, d, e, a);
        };
        b.A = c;
        return b;
      }(), l = function(a, e, l, u) {
        switch(arguments.length) {
          case 0:
            return !0;
          case 1:
            return d.call(this, a);
          case 2:
            return c.call(this, a, e);
          case 3:
            return b.call(this, a, e, l);
          default:
            var v = null;
            if (3 < arguments.length) {
              for (var v = 0, y = Array(arguments.length - 3);v < y.length;) {
                y[v] = arguments[v + 3], ++v;
              }
              v = new w(y, 0);
            }
            return n.A(a, e, l, v);
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      l.L = 3;
      l.H = n.H;
      l.w = function() {
        return !0;
      };
      l.h = d;
      l.j = c;
      l.l = b;
      l.A = n.A;
      return l;
    }();
  }(ve(a, ve(b, ve(c, d))));
};
vg.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  var d = K(c), c = I(d), d = K(d);
  return vg.A(b, a, c, d);
};
vg.L = 3;
var wg = function wg(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 1:
      return wg.h(arguments[0]);
    case 2:
      return wg.j(arguments[0], arguments[1]);
    case 3:
      return wg.l(arguments[0], arguments[1], arguments[2]);
    case 4:
      return wg.J(arguments[0], arguments[1], arguments[2], arguments[3]);
    default:
      return wg.A(arguments[0], arguments[1], arguments[2], arguments[3], new w(c.slice(4), 0, null));
  }
};
wg.h = function(a) {
  return function(b) {
    return function() {
      function c(c, d) {
        var e = a.h ? a.h(d) : a.call(null, d);
        return b.j ? b.j(c, e) : b.call(null, c, e);
      }
      function d(a) {
        return b.h ? b.h(a) : b.call(null, a);
      }
      function e() {
        return b.w ? b.w() : b.call(null);
      }
      var f = null, g = function() {
        function c(a, b, e) {
          var f = null;
          if (2 < arguments.length) {
            for (var f = 0, g = Array(arguments.length - 2);f < g.length;) {
              g[f] = arguments[f + 2], ++f;
            }
            f = new w(g, 0);
          }
          return d.call(this, a, b, f);
        }
        function d(c, e, f) {
          e = Sf(a, e, f);
          return b.j ? b.j(c, e) : b.call(null, c, e);
        }
        c.L = 2;
        c.H = function(a) {
          var b = I(a);
          a = K(a);
          var c = I(a);
          a = Yd(a);
          return d(b, c, a);
        };
        c.A = d;
        return c;
      }(), f = function(a, b, f) {
        switch(arguments.length) {
          case 0:
            return e.call(this);
          case 1:
            return d.call(this, a);
          case 2:
            return c.call(this, a, b);
          default:
            var m = null;
            if (2 < arguments.length) {
              for (var m = 0, r = Array(arguments.length - 2);m < r.length;) {
                r[m] = arguments[m + 2], ++m;
              }
              m = new w(r, 0);
            }
            return g.A(a, b, m);
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      f.L = 2;
      f.H = g.H;
      f.w = e;
      f.h = d;
      f.j = c;
      f.A = g.A;
      return f;
    }();
  };
};
wg.j = function(a, b) {
  return new Df(null, function() {
    var c = x(b);
    if (c) {
      if (Se(c)) {
        for (var d = Ad(c), e = P(d), f = new Ff(Array(e), 0), g = 0;;) {
          if (g < e) {
            Jf(f, function() {
              var b = Ec.j(d, g);
              return a.h ? a.h(b) : a.call(null, b);
            }()), g += 1;
          } else {
            break;
          }
        }
        return If(f.ib(), wg.j(a, Bd(c)));
      }
      return ve(function() {
        var b = I(c);
        return a.h ? a.h(b) : a.call(null, b);
      }(), wg.j(a, Yd(c)));
    }
    return null;
  }, null, null);
};
wg.l = function(a, b, c) {
  return new Df(null, function() {
    var d = x(b), e = x(c);
    if (d && e) {
      var f = ve, g;
      g = I(d);
      var k = I(e);
      g = a.j ? a.j(g, k) : a.call(null, g, k);
      d = f(g, wg.l(a, Yd(d), Yd(e)));
    } else {
      d = null;
    }
    return d;
  }, null, null);
};
wg.J = function(a, b, c, d) {
  return new Df(null, function() {
    var e = x(b), f = x(c), g = x(d);
    if (e && f && g) {
      var k = ve, l;
      l = I(e);
      var n = I(f), m = I(g);
      l = a.l ? a.l(l, n, m) : a.call(null, l, n, m);
      e = k(l, wg.J(a, Yd(e), Yd(f), Yd(g)));
    } else {
      e = null;
    }
    return e;
  }, null, null);
};
wg.A = function(a, b, c, d, e) {
  var f = function k(a) {
    return new Df(null, function() {
      var b = wg.j(x, a);
      return dg(hf, b) ? ve(wg.j(I, b), k(wg.j(Yd, b))) : null;
    }, null, null);
  };
  return wg.j(function() {
    return function(b) {
      return Rf(a, b);
    };
  }(f), f(Ce.A(e, d, S([c, b], 0))));
};
wg.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  var d = K(c), c = I(d), e = K(d), d = I(e), e = K(e);
  return wg.A(b, a, c, d, e);
};
wg.L = 4;
var xg = function xg(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 1:
      return xg.h(arguments[0]);
    case 2:
      return xg.j(arguments[0], arguments[1]);
    default:
      throw Error([E("Invalid arity: "), E(c.length)].join(""));;
  }
};
xg.h = function(a) {
  if ("number" !== typeof a) {
    throw Error("Assert failed: (number? n)");
  }
  return function(b) {
    return function(a) {
      return function() {
        function d(d, e) {
          var f = Yc(a), g = Hd(a, Yc(a) - 1), f = 0 < f ? b.j ? b.j(d, e) : b.call(null, d, e) : d;
          return 0 < g ? f : ie(f) ? f : new he(f);
        }
        function e(a) {
          return b.h ? b.h(a) : b.call(null, a);
        }
        function f() {
          return b.w ? b.w() : b.call(null);
        }
        var g = null, g = function(a, b) {
          switch(arguments.length) {
            case 0:
              return f.call(this);
            case 1:
              return e.call(this, a);
            case 2:
              return d.call(this, a, b);
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        g.w = f;
        g.h = e;
        g.j = d;
        return g;
      }();
    }(new ug(a));
  };
};
xg.j = function(a, b) {
  if ("number" !== typeof a) {
    throw Error("Assert failed: (number? n)");
  }
  return new Df(null, function() {
    if (0 < a) {
      var c = x(b);
      return c ? ve(I(c), xg.j(a - 1, Yd(c))) : null;
    }
    return null;
  }, null, null);
};
xg.L = 2;
function yg(a) {
  return new Df(null, function(b) {
    return function() {
      return b(1, a);
    };
  }(function(a, c) {
    for (;;) {
      var d = x(c);
      if (0 < a && d) {
        var e = a - 1, d = Yd(d);
        a = e;
        c = d;
      } else {
        return d;
      }
    }
  }), null, null);
}
function zg(a, b) {
  return new Df(null, function(c) {
    return function() {
      return c(a, b);
    };
  }(function(a, b) {
    for (;;) {
      var e = x(b), f;
      if (f = e) {
        f = I(e), f = a.h ? a.h(f) : a.call(null, f);
      }
      if (z(f)) {
        f = a, e = Yd(e), a = f, b = e;
      } else {
        return e;
      }
    }
  }), null, null);
}
function Ag(a) {
  return new Df(null, function() {
    return ve(a, Ag(a));
  }, null, null);
}
var Cg = function Cg(b, c) {
  return ve(c, new Df(null, function() {
    return Cg(b, b.h ? b.h(c) : b.call(null, c));
  }, null, null));
}, Dg = function Dg(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 2:
      return Dg.j(arguments[0], arguments[1]);
    default:
      return Dg.A(arguments[0], arguments[1], new w(c.slice(2), 0, null));
  }
};
Dg.j = function(a, b) {
  return new Df(null, function() {
    var c = x(a), d = x(b);
    return c && d ? ve(I(c), ve(I(d), Dg.j(Yd(c), Yd(d)))) : null;
  }, null, null);
};
Dg.A = function(a, b, c) {
  return new Df(null, function() {
    var d = wg.j(x, Ce.A(c, b, S([a], 0)));
    return dg(hf, d) ? Nf.j(wg.j(I, d), Rf(Dg, wg.j(Yd, d))) : null;
  }, null, null);
};
Dg.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  c = K(c);
  return Dg.A(b, a, c);
};
Dg.L = 2;
function Eg(a, b) {
  return new Df(null, function() {
    var c = x(b);
    if (c) {
      if (Se(c)) {
        for (var d = Ad(c), e = P(d), f = new Ff(Array(e), 0), g = 0;;) {
          if (g < e) {
            var k;
            k = Ec.j(d, g);
            k = a.h ? a.h(k) : a.call(null, k);
            z(k) && (k = Ec.j(d, g), f.add(k));
            g += 1;
          } else {
            break;
          }
        }
        return If(f.ib(), Eg(a, Bd(c)));
      }
      d = I(c);
      c = Yd(c);
      return z(a.h ? a.h(d) : a.call(null, d)) ? ve(d, Eg(a, c)) : Eg(a, c);
    }
    return null;
  }, null, null);
}
function Fg(a, b) {
  return Eg(fg(a), b);
}
function Gg(a) {
  var b = x;
  return function d(a) {
    return new Df(null, function() {
      var f;
      z(Ne.h ? Ne.h(a) : Ne.call(null, a)) ? (f = S([b.h ? b.h(a) : b.call(null, a)], 0), f = Rf(Nf, Sf(wg, d, f))) : f = null;
      return ve(a, f);
    }, null, null);
  }(a);
}
function Hg(a) {
  return Eg(function(a) {
    return !Ne(a);
  }, Yd(Gg(a)));
}
var Ig = function Ig(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 2:
      return Ig.j(arguments[0], arguments[1]);
    case 3:
      return Ig.l(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([E("Invalid arity: "), E(c.length)].join(""));;
  }
};
Ig.j = function(a, b) {
  return null != a ? null != a && (a.K & 4 || a.mg) ? xe(ud(uc(td, sd(a), b)), Je(a)) : uc(Cc, a, b) : uc(Ce, Zd, b);
};
Ig.l = function(a, b, c) {
  return null != a && (a.K & 4 || a.mg) ? xe(ud(jf(b, Of, sd(a), c)), Je(a)) : jf(b, Ce, a, c);
};
Ig.L = 3;
function Jg(a, b) {
  return ud(uc(function(b, d) {
    return Of.j(b, a.h ? a.h(d) : a.call(null, d));
  }, sd(De), b));
}
var Kg = function Kg(b, c, d) {
  var e = x(c);
  c = I(e);
  return (e = K(e)) ? U.l(b, c, Kg(H.j(b, c), e, d)) : U.l(b, c, d);
}, Lg = function Lg(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 3:
      return Lg.l(arguments[0], arguments[1], arguments[2]);
    case 4:
      return Lg.J(arguments[0], arguments[1], arguments[2], arguments[3]);
    case 5:
      return Lg.P(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    case 6:
      return Lg.ta(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    default:
      return Lg.A(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], new w(c.slice(6), 0, null));
  }
};
Lg.l = function(a, b, c) {
  b = x(b);
  var d = I(b);
  return (b = K(b)) ? U.l(a, d, Lg.l(H.j(a, d), b, c)) : U.l(a, d, function() {
    var b = H.j(a, d);
    return c.h ? c.h(b) : c.call(null, b);
  }());
};
Lg.J = function(a, b, c, d) {
  b = x(b);
  var e = I(b);
  return (b = K(b)) ? U.l(a, e, Lg.J(H.j(a, e), b, c, d)) : U.l(a, e, function() {
    var b = H.j(a, e);
    return c.j ? c.j(b, d) : c.call(null, b, d);
  }());
};
Lg.P = function(a, b, c, d, e) {
  b = x(b);
  var f = I(b);
  return (b = K(b)) ? U.l(a, f, Lg.P(H.j(a, f), b, c, d, e)) : U.l(a, f, function() {
    var b = H.j(a, f);
    return c.l ? c.l(b, d, e) : c.call(null, b, d, e);
  }());
};
Lg.ta = function(a, b, c, d, e, f) {
  b = x(b);
  var g = I(b);
  return (b = K(b)) ? U.l(a, g, Lg.ta(H.j(a, g), b, c, d, e, f)) : U.l(a, g, function() {
    var b = H.j(a, g);
    return c.J ? c.J(b, d, e, f) : c.call(null, b, d, e, f);
  }());
};
Lg.A = function(a, b, c, d, e, f, g) {
  var k = x(b);
  b = I(k);
  return (k = K(k)) ? U.l(a, b, Vf(Lg, H.j(a, b), k, c, d, S([e, f, g], 0))) : U.l(a, b, Vf(c, H.j(a, b), d, e, f, S([g], 0)));
};
Lg.H = function(a) {
  var b = I(a), c = K(a);
  a = I(c);
  var d = K(c), c = I(d), e = K(d), d = I(e), f = K(e), e = I(f), g = K(f), f = I(g), g = K(g);
  return Lg.A(b, a, c, d, e, f, g);
};
Lg.L = 6;
function Mg(a, b) {
  this.ka = a;
  this.o = b;
}
function Ng(a) {
  return new Mg(a, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
}
function Og(a) {
  return new Mg(a.ka, tc(a.o));
}
function Pg(a) {
  a = a.D;
  return 32 > a ? 0 : a - 1 >>> 5 << 5;
}
function Qg(a, b, c) {
  for (;;) {
    if (0 === b) {
      return c;
    }
    var d = Ng(a);
    d.o[0] = c;
    c = d;
    b -= 5;
  }
}
var Rg = function Rg(b, c, d, e) {
  var f = Og(d), g = b.D - 1 >>> c & 31;
  5 === c ? f.o[g] = e : (d = d.o[g], b = null != d ? Rg(b, c - 5, d, e) : Qg(null, c - 5, e), f.o[g] = b);
  return f;
};
function Sg(a, b) {
  throw Error([E("No item "), E(a), E(" in vector of length "), E(b)].join(""));
}
function Tg(a, b) {
  if (b >= Pg(a)) {
    return a.aa;
  }
  for (var c = a.root, d = a.shift;;) {
    if (0 < d) {
      var e = d - 5, c = c.o[b >>> d & 31], d = e
    } else {
      return c.o;
    }
  }
}
function Ug(a, b) {
  return 0 <= b && b < a.D ? Tg(a, b) : Sg(b, a.D);
}
var Vg = function Vg(b, c, d, e, f) {
  var g = Og(d);
  if (0 === c) {
    g.o[e & 31] = f;
  } else {
    var k = e >>> c & 31;
    b = Vg(b, c - 5, d.o[k], e, f);
    g.o[k] = b;
  }
  return g;
}, Wg = function Wg(b, c, d) {
  var e = b.D - 2 >>> c & 31;
  if (5 < c) {
    b = Wg(b, c - 5, d.o[e]);
    if (null == b && 0 === e) {
      return null;
    }
    d = Og(d);
    d.o[e] = b;
    return d;
  }
  if (0 === e) {
    return null;
  }
  d = Og(d);
  d.o[e] = null;
  return d;
};
function Xg(a, b, c, d, e, f) {
  this.i = a;
  this.base = b;
  this.o = c;
  this.kb = d;
  this.start = e;
  this.end = f;
}
Xg.prototype.Ca = function() {
  return this.i < this.end;
};
Xg.prototype.next = function() {
  32 === this.i - this.base && (this.o = Tg(this.kb, this.i), this.base += 32);
  var a = this.o[this.i & 31];
  this.i += 1;
  return a;
};
function V(a, b, c, d, e, f) {
  this.meta = a;
  this.D = b;
  this.shift = c;
  this.root = d;
  this.aa = e;
  this.F = f;
  this.v = 167668511;
  this.K = 8196;
}
h = V.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.N = function(a, b) {
  return Kc.l(this, b, null);
};
h.M = function(a, b, c) {
  return "number" === typeof b ? Ec.l(this, b, c) : c;
};
h.Sc = function(a, b, c) {
  a = 0;
  for (var d = c;;) {
    if (a < this.D) {
      var e = Tg(this, a);
      c = e.length;
      a: {
        for (var f = 0;;) {
          if (f < c) {
            var g = f + a, k = e[f], d = b.l ? b.l(d, g, k) : b.call(null, d, g, k);
            if (ie(d)) {
              e = d;
              break a;
            }
            f += 1;
          } else {
            e = d;
            break a;
          }
        }
      }
      if (ie(e)) {
        return N.h ? N.h(e) : N.call(null, e);
      }
      a += c;
      d = e;
    } else {
      return d;
    }
  }
};
h.Z = function(a, b) {
  return Ug(this, b)[b & 31];
};
h.cb = function(a, b, c) {
  return 0 <= b && b < this.D ? Tg(this, b)[b & 31] : c;
};
h.Ac = function(a, b, c) {
  if (0 <= b && b < this.D) {
    return Pg(this) <= b ? (a = tc(this.aa), a[b & 31] = c, new V(this.meta, this.D, this.shift, this.root, a, null)) : new V(this.meta, this.D, this.shift, Vg(this, this.shift, this.root, b, c), this.aa, null);
  }
  if (b === this.D) {
    return Cc(this, c);
  }
  throw Error([E("Index "), E(b), E(" out of bounds  [0,"), E(this.D), E("]")].join(""));
};
h.mb = function() {
  var a = this.D;
  return new Xg(0, 0, 0 < P(this) ? Tg(this, 0) : null, this, 0, a);
};
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new V(this.meta, this.D, this.shift, this.root, this.aa, this.F);
};
h.ia = function() {
  return this.D;
};
h.nd = function() {
  return Ec.j(this, 0);
};
h.od = function() {
  return Ec.j(this, 1);
};
h.kc = function() {
  return 0 < this.D ? Ec.j(this, this.D - 1) : null;
};
h.lc = function() {
  if (0 === this.D) {
    throw Error("Can't pop empty vector");
  }
  if (1 === this.D) {
    return dd(De, this.meta);
  }
  if (1 < this.D - Pg(this)) {
    return new V(this.meta, this.D - 1, this.shift, this.root, this.aa.slice(0, -1), null);
  }
  var a = Tg(this, this.D - 2), b = Wg(this, this.shift, this.root), b = null == b ? W : b, c = this.D - 1;
  return 5 < this.shift && null == b.o[1] ? new V(this.meta, c, this.shift - 5, b.o[0], a, null) : new V(this.meta, c, this.shift, b, a, null);
};
h.Uc = function() {
  return 0 < this.D ? new te(this, this.D - 1, null) : null;
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  if (b instanceof V) {
    if (this.D === P(b)) {
      for (var c = Id(this), d = Id(b);;) {
        if (z(c.Ca())) {
          var e = c.next(), f = d.next();
          if (!M.j(e, f)) {
            return !1;
          }
        } else {
          return !0;
        }
      }
    } else {
      return !1;
    }
  } else {
    return ue(this, b);
  }
};
h.Rc = function() {
  return new Yg(this.D, this.shift, Zg.h ? Zg.h(this.root) : Zg.call(null, this.root), $g.h ? $g.h(this.aa) : $g.call(null, this.aa));
};
h.ma = function() {
  return xe(De, this.meta);
};
h.va = function(a, b) {
  return je(this, b);
};
h.wa = function(a, b, c) {
  a = 0;
  for (var d = c;;) {
    if (a < this.D) {
      var e = Tg(this, a);
      c = e.length;
      a: {
        for (var f = 0;;) {
          if (f < c) {
            var g = e[f], d = b.j ? b.j(d, g) : b.call(null, d, g);
            if (ie(d)) {
              e = d;
              break a;
            }
            f += 1;
          } else {
            e = d;
            break a;
          }
        }
      }
      if (ie(e)) {
        return N.h ? N.h(e) : N.call(null, e);
      }
      a += c;
      d = e;
    } else {
      return d;
    }
  }
};
h.Qb = function(a, b, c) {
  if ("number" === typeof b) {
    return Xc(this, b, c);
  }
  throw Error("Vector's key for assoc must be a number.");
};
h.da = function() {
  if (0 === this.D) {
    return null;
  }
  if (32 >= this.D) {
    return new w(this.aa, 0, null);
  }
  var a;
  a: {
    a = this.root;
    for (var b = this.shift;;) {
      if (0 < b) {
        b -= 5, a = a.o[0];
      } else {
        a = a.o;
        break a;
      }
    }
  }
  return ah ? ah(this, a, 0, 0) : bh.call(null, this, a, 0, 0);
};
h.S = function(a, b) {
  return new V(b, this.D, this.shift, this.root, this.aa, this.F);
};
h.ea = function(a, b) {
  if (32 > this.D - Pg(this)) {
    for (var c = this.aa.length, d = Array(c + 1), e = 0;;) {
      if (e < c) {
        d[e] = this.aa[e], e += 1;
      } else {
        break;
      }
    }
    d[c] = b;
    return new V(this.meta, this.D + 1, this.shift, this.root, d, null);
  }
  c = (d = this.D >>> 5 > 1 << this.shift) ? this.shift + 5 : this.shift;
  d ? (d = Ng(null), d.o[0] = this.root, e = Qg(null, this.shift, new Mg(null, this.aa)), d.o[1] = e) : d = Rg(this, this.shift, this.root, new Mg(null, this.aa));
  return new V(this.meta, this.D + 1, c, d, [b], null);
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.Z(null, c);
      case 3:
        return this.cb(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.j = function(a, c) {
    return this.Z(null, c);
  };
  a.l = function(a, c, d) {
    return this.cb(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return this.Z(null, a);
};
h.j = function(a, b) {
  return this.cb(null, a, b);
};
var W = new Mg(null, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]), De = new V(null, 0, 5, W, [], de);
function ch(a, b) {
  var c = a.length, d = b ? a : tc(a);
  if (32 > c) {
    return new V(null, c, 5, W, d, null);
  }
  for (var e = 32, f = (new V(null, 32, 5, W, d.slice(0, 32), null)).Rc(null);;) {
    if (e < c) {
      var g = e + 1, f = Of.j(f, d[e]), e = g
    } else {
      return ud(f);
    }
  }
}
V.prototype[sc] = function() {
  return ae(this);
};
function dh(a) {
  return mc(a) ? ch(a, !0) : ud(uc(td, sd(De), a));
}
var eh = function eh(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  return eh.A(0 < c.length ? new w(c.slice(0), 0, null) : null);
};
eh.A = function(a) {
  return a instanceof w && 0 === a.i ? ch(a.o, !0) : dh(a);
};
eh.L = 0;
eh.H = function(a) {
  return eh.A(x(a));
};
function fh(a, b, c, d, e, f) {
  this.lb = a;
  this.node = b;
  this.i = c;
  this.off = d;
  this.meta = e;
  this.F = f;
  this.v = 32375020;
  this.K = 1536;
}
h = fh.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.meta;
};
h.Ya = function() {
  if (this.off + 1 < this.node.length) {
    var a;
    a = this.lb;
    var b = this.node, c = this.i, d = this.off + 1;
    a = ah ? ah(a, b, c, d) : bh.call(null, a, b, c, d);
    return null == a ? null : a;
  }
  return Cd(this);
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(De, this.meta);
};
h.va = function(a, b) {
  var c;
  c = this.lb;
  var d = this.i + this.off, e = P(this.lb);
  c = gh ? gh(c, d, e) : hh.call(null, c, d, e);
  return je(c, b);
};
h.wa = function(a, b, c) {
  a = this.lb;
  var d = this.i + this.off, e = P(this.lb);
  a = gh ? gh(a, d, e) : hh.call(null, a, d, e);
  return ke(a, b, c);
};
h.xa = function() {
  return this.node[this.off];
};
h.Qa = function() {
  if (this.off + 1 < this.node.length) {
    var a;
    a = this.lb;
    var b = this.node, c = this.i, d = this.off + 1;
    a = ah ? ah(a, b, c, d) : bh.call(null, a, b, c, d);
    return null == a ? Zd : a;
  }
  return Bd(this);
};
h.da = function() {
  return this;
};
h.Be = function() {
  var a = this.node;
  return new Gf(a, this.off, a.length);
};
h.Ce = function() {
  var a = this.i + this.node.length;
  if (a < zc(this.lb)) {
    var b = this.lb, c = Tg(this.lb, a);
    return ah ? ah(b, c, a, 0) : bh.call(null, b, c, a, 0);
  }
  return Zd;
};
h.S = function(a, b) {
  return ih ? ih(this.lb, this.node, this.i, this.off, b) : bh.call(null, this.lb, this.node, this.i, this.off, b);
};
h.ea = function(a, b) {
  return ve(b, this);
};
h.Ae = function() {
  var a = this.i + this.node.length;
  if (a < zc(this.lb)) {
    var b = this.lb, c = Tg(this.lb, a);
    return ah ? ah(b, c, a, 0) : bh.call(null, b, c, a, 0);
  }
  return null;
};
fh.prototype[sc] = function() {
  return ae(this);
};
function bh(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 3:
      return b = arguments[0], c = arguments[1], d = arguments[2], new fh(b, Ug(b, c), c, d, null, null);
    case 4:
      return ah(arguments[0], arguments[1], arguments[2], arguments[3]);
    case 5:
      return ih(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    default:
      throw Error([E("Invalid arity: "), E(b.length)].join(""));;
  }
}
function ah(a, b, c, d) {
  return new fh(a, b, c, d, null, null);
}
function ih(a, b, c, d, e) {
  return new fh(a, b, c, d, e, null);
}
function jh(a, b, c, d, e) {
  this.meta = a;
  this.kb = b;
  this.start = c;
  this.end = d;
  this.F = e;
  this.v = 167666463;
  this.K = 8192;
}
h = jh.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.N = function(a, b) {
  return Kc.l(this, b, null);
};
h.M = function(a, b, c) {
  return "number" === typeof b ? Ec.l(this, b, c) : c;
};
h.Sc = function(a, b, c) {
  a = this.start;
  for (var d = 0;;) {
    if (a < this.end) {
      var e = d, f = Ec.j(this.kb, a);
      c = b.l ? b.l(c, e, f) : b.call(null, c, e, f);
      if (ie(c)) {
        return N.h ? N.h(c) : N.call(null, c);
      }
      d += 1;
      a += 1;
    } else {
      return c;
    }
  }
};
h.Z = function(a, b) {
  return 0 > b || this.end <= this.start + b ? Sg(b, this.end - this.start) : Ec.j(this.kb, this.start + b);
};
h.cb = function(a, b, c) {
  return 0 > b || this.end <= this.start + b ? c : Ec.l(this.kb, this.start + b, c);
};
h.Ac = function(a, b, c) {
  var d = this.start + b;
  a = this.meta;
  c = U.l(this.kb, d, c);
  b = this.start;
  var e = this.end, d = d + 1, d = e > d ? e : d;
  return kh.P ? kh.P(a, c, b, d, null) : kh.call(null, a, c, b, d, null);
};
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new jh(this.meta, this.kb, this.start, this.end, this.F);
};
h.ia = function() {
  return this.end - this.start;
};
h.kc = function() {
  return Ec.j(this.kb, this.end - 1);
};
h.lc = function() {
  if (this.start === this.end) {
    throw Error("Can't pop empty vector");
  }
  var a = this.meta, b = this.kb, c = this.start, d = this.end - 1;
  return kh.P ? kh.P(a, b, c, d, null) : kh.call(null, a, b, c, d, null);
};
h.Uc = function() {
  return this.start !== this.end ? new te(this, this.end - this.start - 1, null) : null;
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(De, this.meta);
};
h.va = function(a, b) {
  return je(this, b);
};
h.wa = function(a, b, c) {
  return ke(this, b, c);
};
h.Qb = function(a, b, c) {
  if ("number" === typeof b) {
    return Xc(this, b, c);
  }
  throw Error("Subvec's key for assoc must be a number.");
};
h.da = function() {
  var a = this;
  return function(b) {
    return function d(e) {
      return e === a.end ? null : ve(Ec.j(a.kb, e), new Df(null, function() {
        return function() {
          return d(e + 1);
        };
      }(b), null, null));
    };
  }(this)(a.start);
};
h.S = function(a, b) {
  return kh.P ? kh.P(b, this.kb, this.start, this.end, this.F) : kh.call(null, b, this.kb, this.start, this.end, this.F);
};
h.ea = function(a, b) {
  var c = this.meta, d = Xc(this.kb, this.end, b), e = this.start, f = this.end + 1;
  return kh.P ? kh.P(c, d, e, f, null) : kh.call(null, c, d, e, f, null);
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.Z(null, c);
      case 3:
        return this.cb(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.j = function(a, c) {
    return this.Z(null, c);
  };
  a.l = function(a, c, d) {
    return this.cb(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return this.Z(null, a);
};
h.j = function(a, b) {
  return this.cb(null, a, b);
};
jh.prototype[sc] = function() {
  return ae(this);
};
function kh(a, b, c, d, e) {
  for (;;) {
    if (b instanceof jh) {
      c = b.start + c, d = b.start + d, b = b.kb;
    } else {
      var f = P(b);
      if (0 > c || 0 > d || c > f || d > f) {
        throw Error("Index out of bounds");
      }
      return new jh(a, b, c, d, e);
    }
  }
}
function hh(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 2:
      return b = arguments[0], gh(b, arguments[1], P(b));
    case 3:
      return gh(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([E("Invalid arity: "), E(b.length)].join(""));;
  }
}
function gh(a, b, c) {
  return kh(null, a, b, c, null);
}
function lh(a, b) {
  return a === b.ka ? b : new Mg(a, tc(b.o));
}
function Zg(a) {
  return new Mg({}, tc(a.o));
}
function $g(a) {
  var b = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
  Ue(a, 0, b, 0, a.length);
  return b;
}
var mh = function mh(b, c, d, e) {
  d = lh(b.root.ka, d);
  var f = b.D - 1 >>> c & 31;
  if (5 === c) {
    b = e;
  } else {
    var g = d.o[f];
    b = null != g ? mh(b, c - 5, g, e) : Qg(b.root.ka, c - 5, e);
  }
  d.o[f] = b;
  return d;
};
function Yg(a, b, c, d) {
  this.D = a;
  this.shift = b;
  this.root = c;
  this.aa = d;
  this.K = 88;
  this.v = 275;
}
h = Yg.prototype;
h.sd = function(a, b) {
  if (this.root.ka) {
    if (32 > this.D - Pg(this)) {
      this.aa[this.D & 31] = b;
    } else {
      var c = new Mg(this.root.ka, this.aa), d = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      d[0] = b;
      this.aa = d;
      if (this.D >>> 5 > 1 << this.shift) {
        var d = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], e = this.shift + 5;
        d[0] = this.root;
        d[1] = Qg(this.root.ka, this.shift, c);
        this.root = new Mg(this.root.ka, d);
        this.shift = e;
      } else {
        this.root = mh(this, this.shift, this.root, c);
      }
    }
    this.D += 1;
    return this;
  }
  throw Error("conj! after persistent!");
};
h.ud = function() {
  if (this.root.ka) {
    this.root.ka = null;
    var a = this.D - Pg(this), b = Array(a);
    Ue(this.aa, 0, b, 0, a);
    return new V(null, this.D, this.shift, this.root, b, null);
  }
  throw Error("persistent! called twice");
};
h.rd = function(a, b, c) {
  if ("number" === typeof b) {
    return wd(this, b, c);
  }
  throw Error("TransientVector's key for assoc! must be a number.");
};
h.vf = function(a, b, c) {
  var d = this;
  if (d.root.ka) {
    if (0 <= b && b < d.D) {
      return Pg(this) <= b ? d.aa[b & 31] = c : (a = function() {
        return function f(a, k) {
          var l = lh(d.root.ka, k);
          if (0 === a) {
            l.o[b & 31] = c;
          } else {
            var n = b >>> a & 31, m = f(a - 5, l.o[n]);
            l.o[n] = m;
          }
          return l;
        };
      }(this).call(null, d.shift, d.root), d.root = a), this;
    }
    if (b === d.D) {
      return td(this, c);
    }
    throw Error([E("Index "), E(b), E(" out of bounds for TransientVector of length"), E(d.D)].join(""));
  }
  throw Error("assoc! after persistent!");
};
h.ia = function() {
  if (this.root.ka) {
    return this.D;
  }
  throw Error("count after persistent!");
};
h.Z = function(a, b) {
  if (this.root.ka) {
    return Ug(this, b)[b & 31];
  }
  throw Error("nth after persistent!");
};
h.cb = function(a, b, c) {
  return 0 <= b && b < this.D ? Ec.j(this, b) : c;
};
h.N = function(a, b) {
  return Kc.l(this, b, null);
};
h.M = function(a, b, c) {
  return "number" === typeof b ? Ec.l(this, b, c) : c;
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.N(null, c);
      case 3:
        return this.M(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.j = function(a, c) {
    return this.N(null, c);
  };
  a.l = function(a, c, d) {
    return this.M(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return this.N(null, a);
};
h.j = function(a, b) {
  return this.M(null, a, b);
};
function nh(a, b) {
  this.Xc = a;
  this.Od = b;
}
nh.prototype.Ca = function() {
  var a = null != this.Xc && x(this.Xc);
  return a ? a : (a = null != this.Od) ? this.Od.Ca() : a;
};
nh.prototype.next = function() {
  if (null != this.Xc) {
    var a = I(this.Xc);
    this.Xc = K(this.Xc);
    return a;
  }
  if (null != this.Od && this.Od.Ca()) {
    return this.Od.next();
  }
  throw Error("No such element");
};
nh.prototype.remove = function() {
  return Error("Unsupported operation");
};
function oh(a, b, c, d) {
  this.meta = a;
  this.fb = b;
  this.zb = c;
  this.F = d;
  this.v = 31850572;
  this.K = 0;
}
h = oh.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.meta;
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(Zd, this.meta);
};
h.xa = function() {
  return I(this.fb);
};
h.Qa = function() {
  var a = K(this.fb);
  return a ? new oh(this.meta, a, this.zb, null) : null == this.zb ? Ac(this) : new oh(this.meta, this.zb, null, null);
};
h.da = function() {
  return this;
};
h.S = function(a, b) {
  return new oh(b, this.fb, this.zb, this.F);
};
h.ea = function(a, b) {
  return ve(b, this);
};
oh.prototype[sc] = function() {
  return ae(this);
};
function ph(a, b, c, d, e) {
  this.meta = a;
  this.count = b;
  this.fb = c;
  this.zb = d;
  this.F = e;
  this.v = 31858766;
  this.K = 8192;
}
h = ph.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, this.count.h ? this.count.h(this) : this.count.call(null, this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.mb = function() {
  return new nh(this.fb, Id(this.zb));
};
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new ph(this.meta, this.count, this.fb, this.zb, this.F);
};
h.ia = function() {
  return this.count;
};
h.kc = function() {
  return I(this.fb);
};
h.lc = function() {
  if (z(this.fb)) {
    var a = K(this.fb);
    return a ? new ph(this.meta, this.count - 1, a, this.zb, null) : new ph(this.meta, this.count - 1, x(this.zb), De, null);
  }
  return this;
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(qh, this.meta);
};
h.xa = function() {
  return I(this.fb);
};
h.Qa = function() {
  return Yd(x(this));
};
h.da = function() {
  var a = x(this.zb), b = this.fb;
  return z(z(b) ? b : a) ? new oh(null, this.fb, x(a), null) : null;
};
h.S = function(a, b) {
  return new ph(b, this.count, this.fb, this.zb, this.F);
};
h.ea = function(a, b) {
  var c;
  z(this.fb) ? (c = this.zb, c = new ph(this.meta, this.count + 1, this.fb, Ce.j(z(c) ? c : De, b), null)) : c = new ph(this.meta, this.count + 1, Ce.j(this.fb, b), De, null);
  return c;
};
var qh = new ph(null, 0, null, De, de);
ph.prototype[sc] = function() {
  return ae(this);
};
function rh() {
  this.v = 2097152;
  this.K = 0;
}
rh.prototype.equiv = function(a) {
  return this.I(null, a);
};
rh.prototype.I = function() {
  return !1;
};
var sh = new rh;
function th(a, b) {
  return Xe(Pe(b) ? P(a) === P(b) ? dg(function(a) {
    return M.j(H.l(b, I(a), sh), Be(a));
  }, a) : null : null);
}
function uh(a, b, c, d, e) {
  this.i = a;
  this.jh = b;
  this.nf = c;
  this.Eg = d;
  this.If = e;
}
uh.prototype.Ca = function() {
  var a = this.i < this.nf;
  return a ? a : this.If.Ca();
};
uh.prototype.next = function() {
  if (this.i < this.nf) {
    var a = qe(this.Eg, this.i);
    this.i += 1;
    return new V(null, 2, 5, W, [a, Kc.j(this.jh, a)], null);
  }
  return this.If.next();
};
uh.prototype.remove = function() {
  return Error("Unsupported operation");
};
function vh(a) {
  this.s = a;
}
vh.prototype.next = function() {
  if (null != this.s) {
    var a = I(this.s), b = T(a, 0, null), a = T(a, 1, null);
    this.s = K(this.s);
    return {value:[b, a], done:!1};
  }
  return {value:null, done:!0};
};
function wh(a) {
  this.s = a;
}
wh.prototype.next = function() {
  if (null != this.s) {
    var a = I(this.s);
    this.s = K(this.s);
    return {value:[a, a], done:!1};
  }
  return {value:null, done:!0};
};
function xh(a, b) {
  var c;
  if (b instanceof X) {
    a: {
      c = a.length;
      for (var d = b.hb, e = 0;;) {
        if (c <= e) {
          c = -1;
          break a;
        }
        if (a[e] instanceof X && d === a[e].hb) {
          c = e;
          break a;
        }
        e += 2;
      }
    }
  } else {
    if (ha(b) || "number" === typeof b) {
      a: {
        for (c = a.length, d = 0;;) {
          if (c <= d) {
            c = -1;
            break a;
          }
          if (b === a[d]) {
            c = d;
            break a;
          }
          d += 2;
        }
      }
    } else {
      if (b instanceof F) {
        a: {
          for (c = a.length, d = b.ab, e = 0;;) {
            if (c <= e) {
              c = -1;
              break a;
            }
            if (a[e] instanceof F && d === a[e].ab) {
              c = e;
              break a;
            }
            e += 2;
          }
        }
      } else {
        if (null == b) {
          a: {
            for (c = a.length, d = 0;;) {
              if (c <= d) {
                c = -1;
                break a;
              }
              if (null == a[d]) {
                c = d;
                break a;
              }
              d += 2;
            }
          }
        } else {
          a: {
            for (c = a.length, d = 0;;) {
              if (c <= d) {
                c = -1;
                break a;
              }
              if (M.j(b, a[d])) {
                c = d;
                break a;
              }
              d += 2;
            }
          }
        }
      }
    }
  }
  return c;
}
function yh(a, b, c) {
  this.o = a;
  this.i = b;
  this.bb = c;
  this.v = 32374990;
  this.K = 0;
}
h = yh.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.bb;
};
h.Ya = function() {
  return this.i < this.o.length - 2 ? new yh(this.o, this.i + 2, this.bb) : null;
};
h.ia = function() {
  return (this.o.length - this.i) / 2;
};
h.U = function() {
  return ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(Zd, this.bb);
};
h.va = function(a, b) {
  return ye(b, this);
};
h.wa = function(a, b, c) {
  return Ae(b, c, this);
};
h.xa = function() {
  return new V(null, 2, 5, W, [this.o[this.i], this.o[this.i + 1]], null);
};
h.Qa = function() {
  return this.i < this.o.length - 2 ? new yh(this.o, this.i + 2, this.bb) : Zd;
};
h.da = function() {
  return this;
};
h.S = function(a, b) {
  return new yh(this.o, this.i, b);
};
h.ea = function(a, b) {
  return ve(b, this);
};
yh.prototype[sc] = function() {
  return ae(this);
};
function zh(a, b, c) {
  this.o = a;
  this.i = b;
  this.D = c;
}
zh.prototype.Ca = function() {
  return this.i < this.D;
};
zh.prototype.next = function() {
  var a = new V(null, 2, 5, W, [this.o[this.i], this.o[this.i + 1]], null);
  this.i += 2;
  return a;
};
function q(a, b, c, d) {
  this.meta = a;
  this.D = b;
  this.o = c;
  this.F = d;
  this.v = 16647951;
  this.K = 8196;
}
h = q.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.keys = function() {
  return ae(Ah.h ? Ah.h(this) : Ah.call(null, this));
};
h.entries = function() {
  return new vh(x(x(this)));
};
h.values = function() {
  return ae(Bh.h ? Bh.h(this) : Bh.call(null, this));
};
h.has = function(a) {
  return Ze(this, a);
};
h.get = function(a, b) {
  return this.M(null, a, b);
};
h.forEach = function(a) {
  for (var b = x(this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = c.Z(null, e), g = T(f, 0, null), f = T(f, 1, null);
      a.j ? a.j(f, g) : a.call(null, f, g);
      e += 1;
    } else {
      if (b = x(b)) {
        Se(b) ? (c = Ad(b), b = Bd(b), g = c, d = P(c), c = g) : (c = I(b), g = T(c, 0, null), f = T(c, 1, null), a.j ? a.j(f, g) : a.call(null, f, g), b = K(b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
h.N = function(a, b) {
  return Kc.l(this, b, null);
};
h.M = function(a, b, c) {
  a = xh(this.o, b);
  return -1 === a ? c : this.o[a + 1];
};
h.Sc = function(a, b, c) {
  a = this.o.length;
  for (var d = 0;;) {
    if (d < a) {
      var e = this.o[d], f = this.o[d + 1];
      c = b.l ? b.l(c, e, f) : b.call(null, c, e, f);
      if (ie(c)) {
        return N.h ? N.h(c) : N.call(null, c);
      }
      d += 2;
    } else {
      return c;
    }
  }
};
h.mb = function() {
  return new zh(this.o, 0, 2 * this.D);
};
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new q(this.meta, this.D, this.o, this.F);
};
h.ia = function() {
  return this.D;
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ee(this);
};
h.I = function(a, b) {
  if (null != b && (b.v & 1024 || b.rg)) {
    var c = this.o.length;
    if (this.D === b.ia(null)) {
      for (var d = 0;;) {
        if (d < c) {
          var e = b.M(null, this.o[d], Ve);
          if (e !== Ve) {
            if (M.j(this.o[d + 1], e)) {
              d += 2;
            } else {
              return !1;
            }
          } else {
            return !1;
          }
        } else {
          return !0;
        }
      }
    } else {
      return !1;
    }
  } else {
    return th(this, b);
  }
};
h.Rc = function() {
  return new Ch({}, this.o.length, tc(this.o));
};
h.ma = function() {
  return dd(cg, this.meta);
};
h.va = function(a, b) {
  return ye(b, this);
};
h.wa = function(a, b, c) {
  return Ae(b, c, this);
};
h.Tc = function(a, b) {
  if (0 <= xh(this.o, b)) {
    var c = this.o.length, d = c - 2;
    if (0 === d) {
      return Ac(this);
    }
    for (var d = Array(d), e = 0, f = 0;;) {
      if (e >= c) {
        return new q(this.meta, this.D - 1, d, null);
      }
      M.j(b, this.o[e]) || (d[f] = this.o[e], d[f + 1] = this.o[e + 1], f += 2);
      e += 2;
    }
  } else {
    return this;
  }
};
h.Qb = function(a, b, c) {
  a = xh(this.o, b);
  if (-1 === a) {
    if (this.D < Dh) {
      a = this.o;
      for (var d = a.length, e = Array(d + 2), f = 0;;) {
        if (f < d) {
          e[f] = a[f], f += 1;
        } else {
          break;
        }
      }
      e[d] = b;
      e[d + 1] = c;
      return new q(this.meta, this.D + 1, e, null);
    }
    return dd(Nc(Ig.j(Eh, this), b, c), this.meta);
  }
  if (c === this.o[a + 1]) {
    return this;
  }
  b = tc(this.o);
  b[a + 1] = c;
  return new q(this.meta, this.D, b, null);
};
h.Ud = function(a, b) {
  return -1 !== xh(this.o, b);
};
h.da = function() {
  var a = this.o;
  return 0 <= a.length - 2 ? new yh(a, 0, null) : null;
};
h.S = function(a, b) {
  return new q(b, this.D, this.o, this.F);
};
h.ea = function(a, b) {
  if (Re(b)) {
    return Nc(this, Ec.j(b, 0), Ec.j(b, 1));
  }
  for (var c = this, d = x(b);;) {
    if (null == d) {
      return c;
    }
    var e = I(d);
    if (Re(e)) {
      c = Nc(c, Ec.j(e, 0), Ec.j(e, 1)), d = K(d);
    } else {
      throw Error("conj on a map takes map entries or seqables of map entries");
    }
  }
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.N(null, c);
      case 3:
        return this.M(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.j = function(a, c) {
    return this.N(null, c);
  };
  a.l = function(a, c, d) {
    return this.M(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return this.N(null, a);
};
h.j = function(a, b) {
  return this.M(null, a, b);
};
var cg = new q(null, 0, [], fe), Dh = 8;
function Fh(a, b, c) {
  a = b ? a : tc(a);
  if (!c) {
    c = [];
    for (b = 0;;) {
      if (b < a.length) {
        var d = a[b], e = a[b + 1];
        -1 === xh(c, d) && (c.push(d), c.push(e));
        b += 2;
      } else {
        break;
      }
    }
    a = c;
  }
  return new q(null, a.length / 2, a, null);
}
q.prototype[sc] = function() {
  return ae(this);
};
function Ch(a, b, c) {
  this.Vc = a;
  this.Jc = b;
  this.o = c;
  this.v = 258;
  this.K = 56;
}
h = Ch.prototype;
h.ia = function() {
  if (z(this.Vc)) {
    return lf(this.Jc);
  }
  throw Error("count after persistent!");
};
h.N = function(a, b) {
  return Kc.l(this, b, null);
};
h.M = function(a, b, c) {
  if (z(this.Vc)) {
    return a = xh(this.o, b), -1 === a ? c : this.o[a + 1];
  }
  throw Error("lookup after persistent!");
};
h.sd = function(a, b) {
  if (z(this.Vc)) {
    if (null != b ? b.v & 2048 || b.sg || (b.v ? 0 : A(Qc, b)) : A(Qc, b)) {
      return vd(this, rf.h ? rf.h(b) : rf.call(null, b), sf.h ? sf.h(b) : sf.call(null, b));
    }
    for (var c = x(b), d = this;;) {
      var e = I(c);
      if (z(e)) {
        c = K(c), d = vd(d, rf.h ? rf.h(e) : rf.call(null, e), sf.h ? sf.h(e) : sf.call(null, e));
      } else {
        return d;
      }
    }
  } else {
    throw Error("conj! after persistent!");
  }
};
h.ud = function() {
  if (z(this.Vc)) {
    return this.Vc = !1, new q(null, lf(this.Jc), this.o, null);
  }
  throw Error("persistent! called twice");
};
h.rd = function(a, b, c) {
  if (z(this.Vc)) {
    a = xh(this.o, b);
    if (-1 === a) {
      return this.Jc + 2 <= 2 * Dh ? (this.Jc += 2, this.o.push(b), this.o.push(c), this) : Pf.l(Gh.j ? Gh.j(this.Jc, this.o) : Gh.call(null, this.Jc, this.o), b, c);
    }
    c !== this.o[a + 1] && (this.o[a + 1] = c);
    return this;
  }
  throw Error("assoc! after persistent!");
};
function Gh(a, b) {
  for (var c = sd(Eh), d = 0;;) {
    if (d < a) {
      c = Pf.l(c, b[d], b[d + 1]), d += 2;
    } else {
      return c;
    }
  }
}
function Hh() {
  this.G = !1;
}
function Ih(a, b) {
  return a === b ? !0 : Y(a, b) ? !0 : M.j(a, b);
}
function Jh(a, b, c) {
  a = tc(a);
  a[b] = c;
  return a;
}
function Kh(a, b) {
  var c = Array(a.length - 2);
  Ue(a, 0, c, 0, 2 * b);
  Ue(a, 2 * (b + 1), c, 2 * b, c.length - 2 * b);
  return c;
}
function Lh(a, b, c, d) {
  a = a.Bc(b);
  a.o[c] = d;
  return a;
}
function Mh(a, b, c) {
  for (var d = a.length, e = 0, f = c;;) {
    if (e < d) {
      c = a[e];
      if (null != c) {
        var g = a[e + 1];
        c = b.l ? b.l(f, c, g) : b.call(null, f, c, g);
      } else {
        c = a[e + 1], c = null != c ? c.Hc(b, f) : f;
      }
      if (ie(c)) {
        return N.h ? N.h(c) : N.call(null, c);
      }
      e += 2;
      f = c;
    } else {
      return f;
    }
  }
}
function Nh(a, b, c, d) {
  this.o = a;
  this.i = b;
  this.Kd = c;
  this.Kb = d;
}
Nh.prototype.advance = function() {
  for (var a = this.o.length;;) {
    if (this.i < a) {
      var b = this.o[this.i], c = this.o[this.i + 1];
      null != b ? b = this.Kd = new V(null, 2, 5, W, [b, c], null) : null != c ? (b = Id(c), b = b.Ca() ? this.Kb = b : !1) : b = !1;
      this.i += 2;
      if (b) {
        return !0;
      }
    } else {
      return !1;
    }
  }
};
Nh.prototype.Ca = function() {
  var a = null != this.Kd;
  return a ? a : (a = null != this.Kb) ? a : this.advance();
};
Nh.prototype.next = function() {
  if (null != this.Kd) {
    var a = this.Kd;
    this.Kd = null;
    return a;
  }
  if (null != this.Kb) {
    return a = this.Kb.next(), this.Kb.Ca() || (this.Kb = null), a;
  }
  if (this.advance()) {
    return this.next();
  }
  throw Error("No such element");
};
Nh.prototype.remove = function() {
  return Error("Unsupported operation");
};
function Oh(a, b, c) {
  this.ka = a;
  this.na = b;
  this.o = c;
}
h = Oh.prototype;
h.Bc = function(a) {
  if (a === this.ka) {
    return this;
  }
  var b = mf(this.na), c = Array(0 > b ? 4 : 2 * (b + 1));
  Ue(this.o, 0, c, 0, 2 * b);
  return new Oh(a, this.na, c);
};
h.Fd = function() {
  return Ph ? Ph(this.o) : Qh.call(null, this.o);
};
h.Hc = function(a, b) {
  return Mh(this.o, a, b);
};
h.oc = function(a, b, c, d) {
  var e = 1 << (b >>> a & 31);
  if (0 === (this.na & e)) {
    return d;
  }
  var f = mf(this.na & e - 1), e = this.o[2 * f], f = this.o[2 * f + 1];
  return null == e ? f.oc(a + 5, b, c, d) : Ih(c, e) ? f : d;
};
h.Jb = function(a, b, c, d, e, f) {
  var g = 1 << (c >>> b & 31), k = mf(this.na & g - 1);
  if (0 === (this.na & g)) {
    var l = mf(this.na);
    if (2 * l < this.o.length) {
      a = this.Bc(a);
      b = a.o;
      f.G = !0;
      a: {
        for (c = 2 * (l - k), f = 2 * k + (c - 1), l = 2 * (k + 1) + (c - 1);;) {
          if (0 === c) {
            break a;
          }
          b[l] = b[f];
          --l;
          --c;
          --f;
        }
      }
      b[2 * k] = d;
      b[2 * k + 1] = e;
      a.na |= g;
      return a;
    }
    if (16 <= l) {
      k = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      k[c >>> b & 31] = Rh.Jb(a, b + 5, c, d, e, f);
      for (e = d = 0;;) {
        if (32 > d) {
          0 !== (this.na >>> d & 1) && (k[d] = null != this.o[e] ? Rh.Jb(a, b + 5, Ud(this.o[e]), this.o[e], this.o[e + 1], f) : this.o[e + 1], e += 2), d += 1;
        } else {
          break;
        }
      }
      return new Sh(a, l + 1, k);
    }
    b = Array(2 * (l + 4));
    Ue(this.o, 0, b, 0, 2 * k);
    b[2 * k] = d;
    b[2 * k + 1] = e;
    Ue(this.o, 2 * k, b, 2 * (k + 1), 2 * (l - k));
    f.G = !0;
    a = this.Bc(a);
    a.o = b;
    a.na |= g;
    return a;
  }
  l = this.o[2 * k];
  g = this.o[2 * k + 1];
  if (null == l) {
    return l = g.Jb(a, b + 5, c, d, e, f), l === g ? this : Lh(this, a, 2 * k + 1, l);
  }
  if (Ih(d, l)) {
    return e === g ? this : Lh(this, a, 2 * k + 1, e);
  }
  f.G = !0;
  f = b + 5;
  d = Th ? Th(a, f, l, g, c, d, e) : Uh.call(null, a, f, l, g, c, d, e);
  e = 2 * k;
  k = 2 * k + 1;
  a = this.Bc(a);
  a.o[e] = null;
  a.o[k] = d;
  return a;
};
h.Ib = function(a, b, c, d, e) {
  var f = 1 << (b >>> a & 31), g = mf(this.na & f - 1);
  if (0 === (this.na & f)) {
    var k = mf(this.na);
    if (16 <= k) {
      g = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      g[b >>> a & 31] = Rh.Ib(a + 5, b, c, d, e);
      for (d = c = 0;;) {
        if (32 > c) {
          0 !== (this.na >>> c & 1) && (g[c] = null != this.o[d] ? Rh.Ib(a + 5, Ud(this.o[d]), this.o[d], this.o[d + 1], e) : this.o[d + 1], d += 2), c += 1;
        } else {
          break;
        }
      }
      return new Sh(null, k + 1, g);
    }
    a = Array(2 * (k + 1));
    Ue(this.o, 0, a, 0, 2 * g);
    a[2 * g] = c;
    a[2 * g + 1] = d;
    Ue(this.o, 2 * g, a, 2 * (g + 1), 2 * (k - g));
    e.G = !0;
    return new Oh(null, this.na | f, a);
  }
  var l = this.o[2 * g], f = this.o[2 * g + 1];
  if (null == l) {
    return k = f.Ib(a + 5, b, c, d, e), k === f ? this : new Oh(null, this.na, Jh(this.o, 2 * g + 1, k));
  }
  if (Ih(c, l)) {
    return d === f ? this : new Oh(null, this.na, Jh(this.o, 2 * g + 1, d));
  }
  e.G = !0;
  e = this.na;
  k = this.o;
  a += 5;
  a = Vh ? Vh(a, l, f, b, c, d) : Uh.call(null, a, l, f, b, c, d);
  c = 2 * g;
  g = 2 * g + 1;
  d = tc(k);
  d[c] = null;
  d[g] = a;
  return new Oh(null, e, d);
};
h.Gd = function(a, b, c) {
  var d = 1 << (b >>> a & 31);
  if (0 === (this.na & d)) {
    return this;
  }
  var e = mf(this.na & d - 1), f = this.o[2 * e], g = this.o[2 * e + 1];
  return null == f ? (a = g.Gd(a + 5, b, c), a === g ? this : null != a ? new Oh(null, this.na, Jh(this.o, 2 * e + 1, a)) : this.na === d ? null : new Oh(null, this.na ^ d, Kh(this.o, e))) : Ih(c, f) ? new Oh(null, this.na ^ d, Kh(this.o, e)) : this;
};
h.mb = function() {
  return new Nh(this.o, 0, null, null);
};
var Rh = new Oh(null, 0, []);
function Wh(a, b, c) {
  this.o = a;
  this.i = b;
  this.Kb = c;
}
Wh.prototype.Ca = function() {
  for (var a = this.o.length;;) {
    if (null != this.Kb && this.Kb.Ca()) {
      return !0;
    }
    if (this.i < a) {
      var b = this.o[this.i];
      this.i += 1;
      null != b && (this.Kb = Id(b));
    } else {
      return !1;
    }
  }
};
Wh.prototype.next = function() {
  if (this.Ca()) {
    return this.Kb.next();
  }
  throw Error("No such element");
};
Wh.prototype.remove = function() {
  return Error("Unsupported operation");
};
function Sh(a, b, c) {
  this.ka = a;
  this.D = b;
  this.o = c;
}
h = Sh.prototype;
h.Bc = function(a) {
  return a === this.ka ? this : new Sh(a, this.D, tc(this.o));
};
h.Fd = function() {
  return Xh ? Xh(this.o) : Yh.call(null, this.o);
};
h.Hc = function(a, b) {
  for (var c = this.o.length, d = 0, e = b;;) {
    if (d < c) {
      var f = this.o[d];
      if (null != f && (e = f.Hc(a, e), ie(e))) {
        return N.h ? N.h(e) : N.call(null, e);
      }
      d += 1;
    } else {
      return e;
    }
  }
};
h.oc = function(a, b, c, d) {
  var e = this.o[b >>> a & 31];
  return null != e ? e.oc(a + 5, b, c, d) : d;
};
h.Jb = function(a, b, c, d, e, f) {
  var g = c >>> b & 31, k = this.o[g];
  if (null == k) {
    return a = Lh(this, a, g, Rh.Jb(a, b + 5, c, d, e, f)), a.D += 1, a;
  }
  b = k.Jb(a, b + 5, c, d, e, f);
  return b === k ? this : Lh(this, a, g, b);
};
h.Ib = function(a, b, c, d, e) {
  var f = b >>> a & 31, g = this.o[f];
  if (null == g) {
    return new Sh(null, this.D + 1, Jh(this.o, f, Rh.Ib(a + 5, b, c, d, e)));
  }
  a = g.Ib(a + 5, b, c, d, e);
  return a === g ? this : new Sh(null, this.D, Jh(this.o, f, a));
};
h.Gd = function(a, b, c) {
  var d = b >>> a & 31, e = this.o[d];
  if (null != e) {
    a = e.Gd(a + 5, b, c);
    if (a === e) {
      d = this;
    } else {
      if (null == a) {
        if (8 >= this.D) {
          a: {
            e = this.o;
            a = e.length;
            b = Array(2 * (this.D - 1));
            c = 0;
            for (var f = 1, g = 0;;) {
              if (c < a) {
                c !== d && null != e[c] && (b[f] = e[c], f += 2, g |= 1 << c), c += 1;
              } else {
                d = new Oh(null, g, b);
                break a;
              }
            }
          }
        } else {
          d = new Sh(null, this.D - 1, Jh(this.o, d, a));
        }
      } else {
        d = new Sh(null, this.D, Jh(this.o, d, a));
      }
    }
    return d;
  }
  return this;
};
h.mb = function() {
  return new Wh(this.o, 0, null);
};
function Zh(a, b, c) {
  b *= 2;
  for (var d = 0;;) {
    if (d < b) {
      if (Ih(c, a[d])) {
        return d;
      }
      d += 2;
    } else {
      return -1;
    }
  }
}
function $h(a, b, c, d) {
  this.ka = a;
  this.$b = b;
  this.D = c;
  this.o = d;
}
h = $h.prototype;
h.Bc = function(a) {
  if (a === this.ka) {
    return this;
  }
  var b = Array(2 * (this.D + 1));
  Ue(this.o, 0, b, 0, 2 * this.D);
  return new $h(a, this.$b, this.D, b);
};
h.Fd = function() {
  return Ph ? Ph(this.o) : Qh.call(null, this.o);
};
h.Hc = function(a, b) {
  return Mh(this.o, a, b);
};
h.oc = function(a, b, c, d) {
  a = Zh(this.o, this.D, c);
  return 0 > a ? d : Ih(c, this.o[a]) ? this.o[a + 1] : d;
};
h.Jb = function(a, b, c, d, e, f) {
  if (c === this.$b) {
    b = Zh(this.o, this.D, d);
    if (-1 === b) {
      if (this.o.length > 2 * this.D) {
        return b = 2 * this.D, c = 2 * this.D + 1, a = this.Bc(a), a.o[b] = d, a.o[c] = e, f.G = !0, a.D += 1, a;
      }
      c = this.o.length;
      b = Array(c + 2);
      Ue(this.o, 0, b, 0, c);
      b[c] = d;
      b[c + 1] = e;
      f.G = !0;
      d = this.D + 1;
      a === this.ka ? (this.o = b, this.D = d, a = this) : a = new $h(this.ka, this.$b, d, b);
      return a;
    }
    return this.o[b + 1] === e ? this : Lh(this, a, b + 1, e);
  }
  return (new Oh(a, 1 << (this.$b >>> b & 31), [null, this, null, null])).Jb(a, b, c, d, e, f);
};
h.Ib = function(a, b, c, d, e) {
  return b === this.$b ? (a = Zh(this.o, this.D, c), -1 === a ? (a = 2 * this.D, b = Array(a + 2), Ue(this.o, 0, b, 0, a), b[a] = c, b[a + 1] = d, e.G = !0, new $h(null, this.$b, this.D + 1, b)) : M.j(this.o[a], d) ? this : new $h(null, this.$b, this.D, Jh(this.o, a + 1, d))) : (new Oh(null, 1 << (this.$b >>> a & 31), [null, this])).Ib(a, b, c, d, e);
};
h.Gd = function(a, b, c) {
  a = Zh(this.o, this.D, c);
  return -1 === a ? this : 1 === this.D ? null : new $h(null, this.$b, this.D - 1, Kh(this.o, lf(a)));
};
h.mb = function() {
  return new Nh(this.o, 0, null, null);
};
function Uh(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 6:
      return Vh(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    case 7:
      return Th(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
    default:
      throw Error([E("Invalid arity: "), E(b.length)].join(""));;
  }
}
function Vh(a, b, c, d, e, f) {
  var g = Ud(b);
  if (g === d) {
    return new $h(null, g, 2, [b, c, e, f]);
  }
  var k = new Hh;
  return Rh.Ib(a, g, b, c, k).Ib(a, d, e, f, k);
}
function Th(a, b, c, d, e, f, g) {
  var k = Ud(c);
  if (k === e) {
    return new $h(null, k, 2, [c, d, f, g]);
  }
  var l = new Hh;
  return Rh.Jb(a, b, k, c, d, l).Jb(a, b, e, f, g, l);
}
function ai(a, b, c, d, e) {
  this.meta = a;
  this.qc = b;
  this.i = c;
  this.s = d;
  this.F = e;
  this.v = 32374860;
  this.K = 0;
}
h = ai.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.meta;
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(Zd, this.meta);
};
h.va = function(a, b) {
  return ye(b, this);
};
h.wa = function(a, b, c) {
  return Ae(b, c, this);
};
h.xa = function() {
  return null == this.s ? new V(null, 2, 5, W, [this.qc[this.i], this.qc[this.i + 1]], null) : I(this.s);
};
h.Qa = function() {
  var a = this, b = null == a.s ? function() {
    var b = a.qc, d = a.i + 2;
    return bi ? bi(b, d, null) : Qh.call(null, b, d, null);
  }() : function() {
    var b = a.qc, d = a.i, e = K(a.s);
    return bi ? bi(b, d, e) : Qh.call(null, b, d, e);
  }();
  return null != b ? b : Zd;
};
h.da = function() {
  return this;
};
h.S = function(a, b) {
  return new ai(b, this.qc, this.i, this.s, this.F);
};
h.ea = function(a, b) {
  return ve(b, this);
};
ai.prototype[sc] = function() {
  return ae(this);
};
function Qh(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 1:
      return Ph(arguments[0]);
    case 3:
      return bi(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([E("Invalid arity: "), E(b.length)].join(""));;
  }
}
function Ph(a) {
  return bi(a, 0, null);
}
function bi(a, b, c) {
  if (null == c) {
    for (c = a.length;;) {
      if (b < c) {
        if (null != a[b]) {
          return new ai(null, a, b, null, null);
        }
        var d = a[b + 1];
        if (z(d) && (d = d.Fd(), z(d))) {
          return new ai(null, a, b + 2, d, null);
        }
        b += 2;
      } else {
        return null;
      }
    }
  } else {
    return new ai(null, a, b, c, null);
  }
}
function ci(a, b, c, d, e) {
  this.meta = a;
  this.qc = b;
  this.i = c;
  this.s = d;
  this.F = e;
  this.v = 32374860;
  this.K = 0;
}
h = ci.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.meta;
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(Zd, this.meta);
};
h.va = function(a, b) {
  return ye(b, this);
};
h.wa = function(a, b, c) {
  return Ae(b, c, this);
};
h.xa = function() {
  return I(this.s);
};
h.Qa = function() {
  var a;
  a = this.qc;
  var b = this.i, c = K(this.s);
  a = di ? di(null, a, b, c) : Yh.call(null, null, a, b, c);
  return null != a ? a : Zd;
};
h.da = function() {
  return this;
};
h.S = function(a, b) {
  return new ci(b, this.qc, this.i, this.s, this.F);
};
h.ea = function(a, b) {
  return ve(b, this);
};
ci.prototype[sc] = function() {
  return ae(this);
};
function Yh(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 1:
      return Xh(arguments[0]);
    case 4:
      return di(arguments[0], arguments[1], arguments[2], arguments[3]);
    default:
      throw Error([E("Invalid arity: "), E(b.length)].join(""));;
  }
}
function Xh(a) {
  return di(null, a, 0, null);
}
function di(a, b, c, d) {
  if (null == d) {
    for (d = b.length;;) {
      if (c < d) {
        var e = b[c];
        if (z(e) && (e = e.Fd(), z(e))) {
          return new ci(a, b, c + 1, e, null);
        }
        c += 1;
      } else {
        return null;
      }
    }
  } else {
    return new ci(a, b, c, d, null);
  }
}
function ei(a, b, c) {
  this.Ta = a;
  this.Xf = b;
  this.af = c;
}
ei.prototype.Ca = function() {
  return this.af && this.Xf.Ca();
};
ei.prototype.next = function() {
  if (this.af) {
    return this.Xf.next();
  }
  this.af = !0;
  return this.Ta;
};
ei.prototype.remove = function() {
  return Error("Unsupported operation");
};
function fi(a, b, c, d, e, f) {
  this.meta = a;
  this.D = b;
  this.root = c;
  this.Ra = d;
  this.Ta = e;
  this.F = f;
  this.v = 16123663;
  this.K = 8196;
}
h = fi.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.keys = function() {
  return ae(Ah.h ? Ah.h(this) : Ah.call(null, this));
};
h.entries = function() {
  return new vh(x(x(this)));
};
h.values = function() {
  return ae(Bh.h ? Bh.h(this) : Bh.call(null, this));
};
h.has = function(a) {
  return Ze(this, a);
};
h.get = function(a, b) {
  return this.M(null, a, b);
};
h.forEach = function(a) {
  for (var b = x(this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = c.Z(null, e), g = T(f, 0, null), f = T(f, 1, null);
      a.j ? a.j(f, g) : a.call(null, f, g);
      e += 1;
    } else {
      if (b = x(b)) {
        Se(b) ? (c = Ad(b), b = Bd(b), g = c, d = P(c), c = g) : (c = I(b), g = T(c, 0, null), f = T(c, 1, null), a.j ? a.j(f, g) : a.call(null, f, g), b = K(b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
h.N = function(a, b) {
  return Kc.l(this, b, null);
};
h.M = function(a, b, c) {
  return null == b ? this.Ra ? this.Ta : c : null == this.root ? c : this.root.oc(0, Ud(b), b, c);
};
h.Sc = function(a, b, c) {
  a = this.Ra ? b.l ? b.l(c, null, this.Ta) : b.call(null, c, null, this.Ta) : c;
  return ie(a) ? N.h ? N.h(a) : N.call(null, a) : null != this.root ? this.root.Hc(b, a) : a;
};
h.mb = function() {
  var a = this.root ? Id(this.root) : Yf;
  return this.Ra ? new ei(this.Ta, a, !1) : a;
};
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new fi(this.meta, this.D, this.root, this.Ra, this.Ta, this.F);
};
h.ia = function() {
  return this.D;
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ee(this);
};
h.I = function(a, b) {
  return th(this, b);
};
h.Rc = function() {
  return new gi({}, this.root, this.D, this.Ra, this.Ta);
};
h.ma = function() {
  return dd(Eh, this.meta);
};
h.Tc = function(a, b) {
  if (null == b) {
    return this.Ra ? new fi(this.meta, this.D - 1, this.root, !1, null, null) : this;
  }
  if (null == this.root) {
    return this;
  }
  var c = this.root.Gd(0, Ud(b), b);
  return c === this.root ? this : new fi(this.meta, this.D - 1, c, this.Ra, this.Ta, null);
};
h.Qb = function(a, b, c) {
  if (null == b) {
    return this.Ra && c === this.Ta ? this : new fi(this.meta, this.Ra ? this.D : this.D + 1, this.root, !0, c, null);
  }
  a = new Hh;
  b = (null == this.root ? Rh : this.root).Ib(0, Ud(b), b, c, a);
  return b === this.root ? this : new fi(this.meta, a.G ? this.D + 1 : this.D, b, this.Ra, this.Ta, null);
};
h.Ud = function(a, b) {
  return null == b ? this.Ra : null == this.root ? !1 : this.root.oc(0, Ud(b), b, Ve) !== Ve;
};
h.da = function() {
  if (0 < this.D) {
    var a = null != this.root ? this.root.Fd() : null;
    return this.Ra ? ve(new V(null, 2, 5, W, [null, this.Ta], null), a) : a;
  }
  return null;
};
h.S = function(a, b) {
  return new fi(b, this.D, this.root, this.Ra, this.Ta, this.F);
};
h.ea = function(a, b) {
  if (Re(b)) {
    return Nc(this, Ec.j(b, 0), Ec.j(b, 1));
  }
  for (var c = this, d = x(b);;) {
    if (null == d) {
      return c;
    }
    var e = I(d);
    if (Re(e)) {
      c = Nc(c, Ec.j(e, 0), Ec.j(e, 1)), d = K(d);
    } else {
      throw Error("conj on a map takes map entries or seqables of map entries");
    }
  }
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.N(null, c);
      case 3:
        return this.M(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.j = function(a, c) {
    return this.N(null, c);
  };
  a.l = function(a, c, d) {
    return this.M(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return this.N(null, a);
};
h.j = function(a, b) {
  return this.M(null, a, b);
};
var Eh = new fi(null, 0, null, !1, null, fe);
function Fe(a, b) {
  for (var c = a.length, d = 0, e = sd(Eh);;) {
    if (d < c) {
      var f = d + 1, e = e.rd(null, a[d], b[d]), d = f
    } else {
      return ud(e);
    }
  }
}
fi.prototype[sc] = function() {
  return ae(this);
};
function gi(a, b, c, d, e) {
  this.ka = a;
  this.root = b;
  this.count = c;
  this.Ra = d;
  this.Ta = e;
  this.v = 258;
  this.K = 56;
}
function hi(a, b, c) {
  if (a.ka) {
    if (null == b) {
      a.Ta !== c && (a.Ta = c), a.Ra || (a.count += 1, a.Ra = !0);
    } else {
      var d = new Hh;
      b = (null == a.root ? Rh : a.root).Jb(a.ka, 0, Ud(b), b, c, d);
      b !== a.root && (a.root = b);
      d.G && (a.count += 1);
    }
    return a;
  }
  throw Error("assoc! after persistent!");
}
h = gi.prototype;
h.ia = function() {
  if (this.ka) {
    return this.count;
  }
  throw Error("count after persistent!");
};
h.N = function(a, b) {
  return null == b ? this.Ra ? this.Ta : null : null == this.root ? null : this.root.oc(0, Ud(b), b);
};
h.M = function(a, b, c) {
  return null == b ? this.Ra ? this.Ta : c : null == this.root ? c : this.root.oc(0, Ud(b), b, c);
};
h.sd = function(a, b) {
  var c;
  a: {
    if (this.ka) {
      if (null != b ? b.v & 2048 || b.sg || (b.v ? 0 : A(Qc, b)) : A(Qc, b)) {
        c = hi(this, rf.h ? rf.h(b) : rf.call(null, b), sf.h ? sf.h(b) : sf.call(null, b));
      } else {
        c = x(b);
        for (var d = this;;) {
          var e = I(c);
          if (z(e)) {
            c = K(c), d = hi(d, rf.h ? rf.h(e) : rf.call(null, e), sf.h ? sf.h(e) : sf.call(null, e));
          } else {
            c = d;
            break a;
          }
        }
      }
    } else {
      throw Error("conj! after persistent");
    }
  }
  return c;
};
h.ud = function() {
  var a;
  if (this.ka) {
    this.ka = null, a = new fi(null, this.count, this.root, this.Ra, this.Ta, null);
  } else {
    throw Error("persistent! called twice");
  }
  return a;
};
h.rd = function(a, b, c) {
  return hi(this, b, c);
};
function ii(a, b, c) {
  for (var d = b;;) {
    if (null != a) {
      b = c ? a.left : a.right, d = Ce.j(d, a), a = b;
    } else {
      return d;
    }
  }
}
function ji(a, b, c, d, e) {
  this.meta = a;
  this.stack = b;
  this.Sd = c;
  this.D = d;
  this.F = e;
  this.v = 32374862;
  this.K = 0;
}
h = ji.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.meta;
};
h.ia = function() {
  return 0 > this.D ? P(K(this)) + 1 : this.D;
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(Zd, this.meta);
};
h.va = function(a, b) {
  return ye(b, this);
};
h.wa = function(a, b, c) {
  return Ae(b, c, this);
};
h.xa = function() {
  var a = this.stack;
  return null == a ? null : Uc(a);
};
h.Qa = function() {
  var a = I(this.stack), a = ii(this.Sd ? a.right : a.left, K(this.stack), this.Sd);
  return null != a ? new ji(null, a, this.Sd, this.D - 1, null) : Zd;
};
h.da = function() {
  return this;
};
h.S = function(a, b) {
  return new ji(b, this.stack, this.Sd, this.D, this.F);
};
h.ea = function(a, b) {
  return ve(b, this);
};
ji.prototype[sc] = function() {
  return ae(this);
};
function ki(a, b, c) {
  return new ji(null, ii(a, null, b), b, c, null);
}
function li(a, b, c, d) {
  return c instanceof mi ? c.left instanceof mi ? new mi(c.key, c.G, c.left.Yb(), new ni(a, b, c.right, d, null), null) : c.right instanceof mi ? new mi(c.right.key, c.right.G, new ni(c.key, c.G, c.left, c.right.left, null), new ni(a, b, c.right.right, d, null), null) : new ni(a, b, c, d, null) : new ni(a, b, c, d, null);
}
function oi(a, b, c, d) {
  return d instanceof mi ? d.right instanceof mi ? new mi(d.key, d.G, new ni(a, b, c, d.left, null), d.right.Yb(), null) : d.left instanceof mi ? new mi(d.left.key, d.left.G, new ni(a, b, c, d.left.left, null), new ni(d.key, d.G, d.left.right, d.right, null), null) : new ni(a, b, c, d, null) : new ni(a, b, c, d, null);
}
function pi(a, b, c, d) {
  if (c instanceof mi) {
    return new mi(a, b, c.Yb(), d, null);
  }
  if (d instanceof ni) {
    return oi(a, b, c, d.Md());
  }
  if (d instanceof mi && d.left instanceof ni) {
    return new mi(d.left.key, d.left.G, new ni(a, b, c, d.left.left, null), oi(d.key, d.G, d.left.right, d.right.Md()), null);
  }
  throw Error("red-black tree invariant violation");
}
var qi = function qi(b, c, d) {
  d = null != b.left ? qi(b.left, c, d) : d;
  if (ie(d)) {
    return N.h ? N.h(d) : N.call(null, d);
  }
  var e = b.key, f = b.G;
  d = c.l ? c.l(d, e, f) : c.call(null, d, e, f);
  if (ie(d)) {
    return N.h ? N.h(d) : N.call(null, d);
  }
  b = null != b.right ? qi(b.right, c, d) : d;
  return ie(b) ? N.h ? N.h(b) : N.call(null, b) : b;
};
function ni(a, b, c, d, e) {
  this.key = a;
  this.G = b;
  this.left = c;
  this.right = d;
  this.F = e;
  this.v = 32402207;
  this.K = 0;
}
h = ni.prototype;
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.hf = function(a) {
  return a.mf(this);
};
h.Md = function() {
  return new mi(this.key, this.G, this.left, this.right, null);
};
h.Yb = function() {
  return this;
};
h.gf = function(a) {
  return a.lf(this);
};
h.replace = function(a, b, c, d) {
  return new ni(a, b, c, d, null);
};
h.lf = function(a) {
  return new ni(a.key, a.G, this, a.right, null);
};
h.mf = function(a) {
  return new ni(a.key, a.G, a.left, this, null);
};
h.Hc = function(a, b) {
  return qi(this, a, b);
};
h.N = function(a, b) {
  return Ec.l(this, b, null);
};
h.M = function(a, b, c) {
  return Ec.l(this, b, c);
};
h.Z = function(a, b) {
  return 0 === b ? this.key : 1 === b ? this.G : null;
};
h.cb = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.G : c;
};
h.Ac = function(a, b, c) {
  return (new V(null, 2, 5, W, [this.key, this.G], null)).Ac(null, b, c);
};
h.O = function() {
  return null;
};
h.ia = function() {
  return 2;
};
h.nd = function() {
  return this.key;
};
h.od = function() {
  return this.G;
};
h.kc = function() {
  return this.G;
};
h.lc = function() {
  return new V(null, 1, 5, W, [this.key], null);
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return De;
};
h.va = function(a, b) {
  return je(this, b);
};
h.wa = function(a, b, c) {
  return ke(this, b, c);
};
h.Qb = function(a, b, c) {
  return U.l(new V(null, 2, 5, W, [this.key, this.G], null), b, c);
};
h.da = function() {
  var a = this.key;
  return Cc(Cc(Zd, this.G), a);
};
h.S = function(a, b) {
  return xe(new V(null, 2, 5, W, [this.key, this.G], null), b);
};
h.ea = function(a, b) {
  return new V(null, 3, 5, W, [this.key, this.G, b], null);
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.N(null, c);
      case 3:
        return this.M(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.j = function(a, c) {
    return this.N(null, c);
  };
  a.l = function(a, c, d) {
    return this.M(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return this.N(null, a);
};
h.j = function(a, b) {
  return this.M(null, a, b);
};
ni.prototype[sc] = function() {
  return ae(this);
};
function mi(a, b, c, d, e) {
  this.key = a;
  this.G = b;
  this.left = c;
  this.right = d;
  this.F = e;
  this.v = 32402207;
  this.K = 0;
}
h = mi.prototype;
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.hf = function(a) {
  return new mi(this.key, this.G, this.left, a, null);
};
h.Md = function() {
  throw Error("red-black tree invariant violation");
};
h.Yb = function() {
  return new ni(this.key, this.G, this.left, this.right, null);
};
h.gf = function(a) {
  return new mi(this.key, this.G, a, this.right, null);
};
h.replace = function(a, b, c, d) {
  return new mi(a, b, c, d, null);
};
h.lf = function(a) {
  return this.left instanceof mi ? new mi(this.key, this.G, this.left.Yb(), new ni(a.key, a.G, this.right, a.right, null), null) : this.right instanceof mi ? new mi(this.right.key, this.right.G, new ni(this.key, this.G, this.left, this.right.left, null), new ni(a.key, a.G, this.right.right, a.right, null), null) : new ni(a.key, a.G, this, a.right, null);
};
h.mf = function(a) {
  return this.right instanceof mi ? new mi(this.key, this.G, new ni(a.key, a.G, a.left, this.left, null), this.right.Yb(), null) : this.left instanceof mi ? new mi(this.left.key, this.left.G, new ni(a.key, a.G, a.left, this.left.left, null), new ni(this.key, this.G, this.left.right, this.right, null), null) : new ni(a.key, a.G, a.left, this, null);
};
h.Hc = function(a, b) {
  return qi(this, a, b);
};
h.N = function(a, b) {
  return Ec.l(this, b, null);
};
h.M = function(a, b, c) {
  return Ec.l(this, b, c);
};
h.Z = function(a, b) {
  return 0 === b ? this.key : 1 === b ? this.G : null;
};
h.cb = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.G : c;
};
h.Ac = function(a, b, c) {
  return (new V(null, 2, 5, W, [this.key, this.G], null)).Ac(null, b, c);
};
h.O = function() {
  return null;
};
h.ia = function() {
  return 2;
};
h.nd = function() {
  return this.key;
};
h.od = function() {
  return this.G;
};
h.kc = function() {
  return this.G;
};
h.lc = function() {
  return new V(null, 1, 5, W, [this.key], null);
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return De;
};
h.va = function(a, b) {
  return je(this, b);
};
h.wa = function(a, b, c) {
  return ke(this, b, c);
};
h.Qb = function(a, b, c) {
  return U.l(new V(null, 2, 5, W, [this.key, this.G], null), b, c);
};
h.da = function() {
  var a = this.key;
  return Cc(Cc(Zd, this.G), a);
};
h.S = function(a, b) {
  return xe(new V(null, 2, 5, W, [this.key, this.G], null), b);
};
h.ea = function(a, b) {
  return new V(null, 3, 5, W, [this.key, this.G, b], null);
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.N(null, c);
      case 3:
        return this.M(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.j = function(a, c) {
    return this.N(null, c);
  };
  a.l = function(a, c, d) {
    return this.M(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return this.N(null, a);
};
h.j = function(a, b) {
  return this.M(null, a, b);
};
mi.prototype[sc] = function() {
  return ae(this);
};
var ri = function ri(b, c, d, e, f) {
  if (null == c) {
    return new mi(d, e, null, null, null);
  }
  var g;
  g = c.key;
  g = b.j ? b.j(d, g) : b.call(null, d, g);
  if (0 === g) {
    return f[0] = c, null;
  }
  if (0 > g) {
    return b = ri(b, c.left, d, e, f), null != b ? c.gf(b) : null;
  }
  b = ri(b, c.right, d, e, f);
  return null != b ? c.hf(b) : null;
}, si = function si(b, c) {
  if (null == b) {
    return c;
  }
  if (null == c) {
    return b;
  }
  if (b instanceof mi) {
    if (c instanceof mi) {
      var d = si(b.right, c.left);
      return d instanceof mi ? new mi(d.key, d.G, new mi(b.key, b.G, b.left, d.left, null), new mi(c.key, c.G, d.right, c.right, null), null) : new mi(b.key, b.G, b.left, new mi(c.key, c.G, d, c.right, null), null);
    }
    return new mi(b.key, b.G, b.left, si(b.right, c), null);
  }
  if (c instanceof mi) {
    return new mi(c.key, c.G, si(b, c.left), c.right, null);
  }
  d = si(b.right, c.left);
  return d instanceof mi ? new mi(d.key, d.G, new ni(b.key, b.G, b.left, d.left, null), new ni(c.key, c.G, d.right, c.right, null), null) : pi(b.key, b.G, b.left, new ni(c.key, c.G, d, c.right, null));
}, ti = function ti(b, c, d, e) {
  if (null != c) {
    var f;
    f = c.key;
    f = b.j ? b.j(d, f) : b.call(null, d, f);
    if (0 === f) {
      return e[0] = c, si(c.left, c.right);
    }
    if (0 > f) {
      return b = ti(b, c.left, d, e), null != b || null != e[0] ? c.left instanceof ni ? pi(c.key, c.G, b, c.right) : new mi(c.key, c.G, b, c.right, null) : null;
    }
    b = ti(b, c.right, d, e);
    if (null != b || null != e[0]) {
      if (c.right instanceof ni) {
        if (e = c.key, d = c.G, c = c.left, b instanceof mi) {
          c = new mi(e, d, c, b.Yb(), null);
        } else {
          if (c instanceof ni) {
            c = li(e, d, c.Md(), b);
          } else {
            if (c instanceof mi && c.right instanceof ni) {
              c = new mi(c.right.key, c.right.G, li(c.key, c.G, c.left.Md(), c.right.left), new ni(e, d, c.right.right, b, null), null);
            } else {
              throw Error("red-black tree invariant violation");
            }
          }
        }
      } else {
        c = new mi(c.key, c.G, c.left, b, null);
      }
    } else {
      c = null;
    }
    return c;
  }
  return null;
}, ui = function ui(b, c, d, e) {
  var f = c.key, g = b.j ? b.j(d, f) : b.call(null, d, f);
  return 0 === g ? c.replace(f, e, c.left, c.right) : 0 > g ? c.replace(f, c.G, ui(b, c.left, d, e), c.right) : c.replace(f, c.G, c.left, ui(b, c.right, d, e));
};
function vi(a, b, c, d, e) {
  this.pb = a;
  this.Xb = b;
  this.D = c;
  this.meta = d;
  this.F = e;
  this.v = 418776847;
  this.K = 8192;
}
h = vi.prototype;
h.forEach = function(a) {
  for (var b = x(this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = c.Z(null, e), g = T(f, 0, null), f = T(f, 1, null);
      a.j ? a.j(f, g) : a.call(null, f, g);
      e += 1;
    } else {
      if (b = x(b)) {
        Se(b) ? (c = Ad(b), b = Bd(b), g = c, d = P(c), c = g) : (c = I(b), g = T(c, 0, null), f = T(c, 1, null), a.j ? a.j(f, g) : a.call(null, f, g), b = K(b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
h.get = function(a, b) {
  return this.M(null, a, b);
};
h.entries = function() {
  return new vh(x(x(this)));
};
h.toString = function() {
  return Kd(this);
};
h.keys = function() {
  return ae(Ah.h ? Ah.h(this) : Ah.call(null, this));
};
h.values = function() {
  return ae(Bh.h ? Bh.h(this) : Bh.call(null, this));
};
h.equiv = function(a) {
  return this.I(null, a);
};
function wi(a, b) {
  for (var c = a.Xb;;) {
    if (null != c) {
      var d;
      d = c.key;
      d = a.pb.j ? a.pb.j(b, d) : a.pb.call(null, b, d);
      if (0 === d) {
        return c;
      }
      c = 0 > d ? c.left : c.right;
    } else {
      return null;
    }
  }
}
h.has = function(a) {
  return Ze(this, a);
};
h.N = function(a, b) {
  return Kc.l(this, b, null);
};
h.M = function(a, b, c) {
  a = wi(this, b);
  return null != a ? a.G : c;
};
h.Sc = function(a, b, c) {
  return null != this.Xb ? qi(this.Xb, b, c) : c;
};
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new vi(this.pb, this.Xb, this.D, this.meta, this.F);
};
h.ia = function() {
  return this.D;
};
h.Uc = function() {
  return 0 < this.D ? ki(this.Xb, !1, this.D) : null;
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ee(this);
};
h.I = function(a, b) {
  return th(this, b);
};
h.ma = function() {
  return new vi(this.pb, null, 0, this.meta, 0);
};
h.Tc = function(a, b) {
  var c = [null], d = ti(this.pb, this.Xb, b, c);
  return null == d ? null == qe(c, 0) ? this : new vi(this.pb, null, 0, this.meta, null) : new vi(this.pb, d.Yb(), this.D - 1, this.meta, null);
};
h.Qb = function(a, b, c) {
  a = [null];
  var d = ri(this.pb, this.Xb, b, c, a);
  return null == d ? (a = qe(a, 0), M.j(c, a.G) ? this : new vi(this.pb, ui(this.pb, this.Xb, b, c), this.D, this.meta, null)) : new vi(this.pb, d.Yb(), this.D + 1, this.meta, null);
};
h.Ud = function(a, b) {
  return null != wi(this, b);
};
h.da = function() {
  return 0 < this.D ? ki(this.Xb, !0, this.D) : null;
};
h.S = function(a, b) {
  return new vi(this.pb, this.Xb, this.D, b, this.F);
};
h.ea = function(a, b) {
  if (Re(b)) {
    return Nc(this, Ec.j(b, 0), Ec.j(b, 1));
  }
  for (var c = this, d = x(b);;) {
    if (null == d) {
      return c;
    }
    var e = I(d);
    if (Re(e)) {
      c = Nc(c, Ec.j(e, 0), Ec.j(e, 1)), d = K(d);
    } else {
      throw Error("conj on a map takes map entries or seqables of map entries");
    }
  }
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.N(null, c);
      case 3:
        return this.M(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.j = function(a, c) {
    return this.N(null, c);
  };
  a.l = function(a, c, d) {
    return this.M(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return this.N(null, a);
};
h.j = function(a, b) {
  return this.M(null, a, b);
};
vi.prototype[sc] = function() {
  return ae(this);
};
var qg = function qg(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  return qg.A(0 < c.length ? new w(c.slice(0), 0, null) : null);
};
qg.A = function(a) {
  a = x(a);
  for (var b = sd(Eh);;) {
    if (a) {
      var c = K(K(a)), b = Pf.l(b, I(a), Be(a));
      a = c;
    } else {
      return ud(b);
    }
  }
};
qg.L = 0;
qg.H = function(a) {
  return qg.A(x(a));
};
var xi = function xi(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  return xi.A(0 < c.length ? new w(c.slice(0), 0, null) : null);
};
xi.A = function(a) {
  a = a instanceof w && 0 === a.i ? a.o : jc(a);
  return Fh(a, !0, !1);
};
xi.L = 0;
xi.H = function(a) {
  return xi.A(x(a));
};
function yi(a, b) {
  this.W = a;
  this.bb = b;
  this.v = 32374988;
  this.K = 0;
}
h = yi.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.bb;
};
h.Ya = function() {
  var a = (null != this.W ? this.W.v & 128 || this.W.Vd || (this.W.v ? 0 : A(Ic, this.W)) : A(Ic, this.W)) ? this.W.Ya(null) : K(this.W);
  return null == a ? null : new yi(a, this.bb);
};
h.U = function() {
  return ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(Zd, this.bb);
};
h.va = function(a, b) {
  return ye(b, this);
};
h.wa = function(a, b, c) {
  return Ae(b, c, this);
};
h.xa = function() {
  return this.W.xa(null).nd(null);
};
h.Qa = function() {
  var a = (null != this.W ? this.W.v & 128 || this.W.Vd || (this.W.v ? 0 : A(Ic, this.W)) : A(Ic, this.W)) ? this.W.Ya(null) : K(this.W);
  return null != a ? new yi(a, this.bb) : Zd;
};
h.da = function() {
  return this;
};
h.S = function(a, b) {
  return new yi(this.W, b);
};
h.ea = function(a, b) {
  return ve(b, this);
};
yi.prototype[sc] = function() {
  return ae(this);
};
function Ah(a) {
  return (a = x(a)) ? new yi(a, null) : null;
}
function rf(a) {
  return Rc(a);
}
function zi(a, b) {
  this.W = a;
  this.bb = b;
  this.v = 32374988;
  this.K = 0;
}
h = zi.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.O = function() {
  return this.bb;
};
h.Ya = function() {
  var a = (null != this.W ? this.W.v & 128 || this.W.Vd || (this.W.v ? 0 : A(Ic, this.W)) : A(Ic, this.W)) ? this.W.Ya(null) : K(this.W);
  return null == a ? null : new zi(a, this.bb);
};
h.U = function() {
  return ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(Zd, this.bb);
};
h.va = function(a, b) {
  return ye(b, this);
};
h.wa = function(a, b, c) {
  return Ae(b, c, this);
};
h.xa = function() {
  return this.W.xa(null).od(null);
};
h.Qa = function() {
  var a = (null != this.W ? this.W.v & 128 || this.W.Vd || (this.W.v ? 0 : A(Ic, this.W)) : A(Ic, this.W)) ? this.W.Ya(null) : K(this.W);
  return null != a ? new zi(a, this.bb) : Zd;
};
h.da = function() {
  return this;
};
h.S = function(a, b) {
  return new zi(this.W, b);
};
h.ea = function(a, b) {
  return ve(b, this);
};
zi.prototype[sc] = function() {
  return ae(this);
};
function Bh(a) {
  return (a = x(a)) ? new zi(a, null) : null;
}
function sf(a) {
  return Sc(a);
}
var Ai = function Ai(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  return Ai.A(0 < c.length ? new w(c.slice(0), 0, null) : null);
};
Ai.A = function(a) {
  return z(eg(hf, a)) ? ff(function(a, c) {
    return Ce.j(z(a) ? a : cg, c);
  }, a) : null;
};
Ai.L = 0;
Ai.H = function(a) {
  return Ai.A(x(a));
};
function Bi(a) {
  this.iter = a;
}
Bi.prototype.Ca = function() {
  return this.iter.Ca();
};
Bi.prototype.next = function() {
  if (this.iter.Ca()) {
    return this.iter.next().aa[0];
  }
  throw Error("No such element");
};
Bi.prototype.remove = function() {
  return Error("Unsupported operation");
};
function Ci(a, b, c) {
  this.meta = a;
  this.nc = b;
  this.F = c;
  this.v = 15077647;
  this.K = 8196;
}
h = Ci.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.keys = function() {
  return ae(x(this));
};
h.entries = function() {
  return new wh(x(x(this)));
};
h.values = function() {
  return ae(x(this));
};
h.has = function(a) {
  return Ze(this, a);
};
h.forEach = function(a) {
  for (var b = x(this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = c.Z(null, e), g = T(f, 0, null), f = T(f, 1, null);
      a.j ? a.j(f, g) : a.call(null, f, g);
      e += 1;
    } else {
      if (b = x(b)) {
        Se(b) ? (c = Ad(b), b = Bd(b), g = c, d = P(c), c = g) : (c = I(b), g = T(c, 0, null), f = T(c, 1, null), a.j ? a.j(f, g) : a.call(null, f, g), b = K(b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
h.N = function(a, b) {
  return Kc.l(this, b, null);
};
h.M = function(a, b, c) {
  return Mc(this.nc, b) ? b : c;
};
h.mb = function() {
  return new Bi(Id(this.nc));
};
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new Ci(this.meta, this.nc, this.F);
};
h.ia = function() {
  return zc(this.nc);
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ee(this);
};
h.I = function(a, b) {
  return Me(b) && P(this) === P(b) && dg(function(a) {
    return function(b) {
      return Ze(a, b);
    };
  }(this), b);
};
h.Rc = function() {
  return new Di(sd(this.nc));
};
h.ma = function() {
  return xe(Ei, this.meta);
};
h.da = function() {
  return Ah(this.nc);
};
h.S = function(a, b) {
  return new Ci(b, this.nc, this.F);
};
h.ea = function(a, b) {
  return new Ci(this.meta, U.l(this.nc, b, null), null);
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.N(null, c);
      case 3:
        return this.M(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.j = function(a, c) {
    return this.N(null, c);
  };
  a.l = function(a, c, d) {
    return this.M(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return this.N(null, a);
};
h.j = function(a, b) {
  return this.M(null, a, b);
};
var Ei = new Ci(null, cg, fe);
Ci.prototype[sc] = function() {
  return ae(this);
};
function Di(a) {
  this.fc = a;
  this.K = 136;
  this.v = 259;
}
h = Di.prototype;
h.sd = function(a, b) {
  this.fc = Pf.l(this.fc, b, null);
  return this;
};
h.ud = function() {
  return new Ci(null, ud(this.fc), null);
};
h.ia = function() {
  return P(this.fc);
};
h.N = function(a, b) {
  return Kc.l(this, b, null);
};
h.M = function(a, b, c) {
  return Kc.l(this.fc, b, Ve) === Ve ? c : b;
};
h.call = function() {
  function a(a, b, c) {
    return Kc.l(this.fc, b, Ve) === Ve ? c : b;
  }
  function b(a, b) {
    return Kc.l(this.fc, b, Ve) === Ve ? null : b;
  }
  var c = null, c = function(c, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, 0, e);
      case 3:
        return a.call(this, 0, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  c.j = b;
  c.l = a;
  return c;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return Kc.l(this.fc, a, Ve) === Ve ? null : a;
};
h.j = function(a, b) {
  return Kc.l(this.fc, a, Ve) === Ve ? b : a;
};
function Fi(a, b, c) {
  this.meta = a;
  this.gc = b;
  this.F = c;
  this.v = 417730831;
  this.K = 8192;
}
h = Fi.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.keys = function() {
  return ae(x(this));
};
h.entries = function() {
  return new wh(x(x(this)));
};
h.values = function() {
  return ae(x(this));
};
h.has = function(a) {
  return Ze(this, a);
};
h.forEach = function(a) {
  for (var b = x(this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = c.Z(null, e), g = T(f, 0, null), f = T(f, 1, null);
      a.j ? a.j(f, g) : a.call(null, f, g);
      e += 1;
    } else {
      if (b = x(b)) {
        Se(b) ? (c = Ad(b), b = Bd(b), g = c, d = P(c), c = g) : (c = I(b), g = T(c, 0, null), f = T(c, 1, null), a.j ? a.j(f, g) : a.call(null, f, g), b = K(b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
h.N = function(a, b) {
  return Kc.l(this, b, null);
};
h.M = function(a, b, c) {
  a = wi(this.gc, b);
  return null != a ? a.key : c;
};
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new Fi(this.meta, this.gc, this.F);
};
h.ia = function() {
  return P(this.gc);
};
h.Uc = function() {
  return 0 < P(this.gc) ? wg.j(rf, pd(this.gc)) : null;
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ee(this);
};
h.I = function(a, b) {
  return Me(b) && P(this) === P(b) && dg(function(a) {
    return function(b) {
      return Ze(a, b);
    };
  }(this), b);
};
h.ma = function() {
  return new Fi(this.meta, Ac(this.gc), 0);
};
h.da = function() {
  return Ah(this.gc);
};
h.S = function(a, b) {
  return new Fi(b, this.gc, this.F);
};
h.ea = function(a, b) {
  return new Fi(this.meta, U.l(this.gc, b, null), null);
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.N(null, c);
      case 3:
        return this.M(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.j = function(a, c) {
    return this.N(null, c);
  };
  a.l = function(a, c, d) {
    return this.M(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.h = function(a) {
  return this.N(null, a);
};
h.j = function(a, b) {
  return this.M(null, a, b);
};
Fi.prototype[sc] = function() {
  return ae(this);
};
function Gi(a) {
  var b = Hi;
  if (Re(a)) {
    var c = P(a);
    return uc(function() {
      return function(a, c) {
        var f = $e(b, qe(a, c));
        return z(f) ? U.l(a, c, Be(f)) : a;
      };
    }(c), a, xg.j(c, Cg(ge, 0)));
  }
  return wg.j(function(a) {
    var c = $e(b, a);
    return z(c) ? Be(c) : a;
  }, a);
}
function Cf(a) {
  if (null != a && (a.K & 4096 || a.uf)) {
    return a.pd(null);
  }
  if ("string" === typeof a) {
    return a;
  }
  throw Error([E("Doesn't support name: "), E(a)].join(""));
}
function Ii(a, b) {
  for (var c = sd(cg), d = x(a), e = x(b);;) {
    if (d && e) {
      c = Pf.l(c, I(d), I(e)), d = K(d), e = K(e);
    } else {
      return ud(c);
    }
  }
}
function Ji(a, b, c) {
  this.i = a;
  this.end = b;
  this.step = c;
}
Ji.prototype.Ca = function() {
  return 0 < this.step ? this.i < this.end : this.i > this.end;
};
Ji.prototype.next = function() {
  var a = this.i;
  this.i += this.step;
  return a;
};
function Ki(a, b, c, d, e) {
  this.meta = a;
  this.start = b;
  this.end = c;
  this.step = d;
  this.F = e;
  this.v = 32375006;
  this.K = 8192;
}
h = Ki.prototype;
h.toString = function() {
  return Kd(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.indexOf = function() {
  var a = null, a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return O(this, a, 0);
      case 2:
        return O(this, a, c);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.h = function(a) {
    return O(this, a, 0);
  };
  a.j = function(a, c) {
    return O(this, a, c);
  };
  return a;
}();
h.lastIndexOf = function() {
  function a(a) {
    return Q(this, a, P(this));
  }
  var b = null, b = function(b, d) {
    switch(arguments.length) {
      case 1:
        return a.call(this, b);
      case 2:
        return Q(this, b, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.h = a;
  b.j = function(a, b) {
    return Q(this, a, b);
  };
  return b;
}();
h.Z = function(a, b) {
  if (b < zc(this)) {
    return this.start + b * this.step;
  }
  if (this.start > this.end && 0 === this.step) {
    return this.start;
  }
  throw Error("Index out of bounds");
};
h.cb = function(a, b, c) {
  return b < zc(this) ? this.start + b * this.step : this.start > this.end && 0 === this.step ? this.start : c;
};
h.mb = function() {
  return new Ji(this.start, this.end, this.step);
};
h.O = function() {
  return this.meta;
};
h.Xa = function() {
  return new Ki(this.meta, this.start, this.end, this.step, this.F);
};
h.Ya = function() {
  return 0 < this.step ? this.start + this.step < this.end ? new Ki(this.meta, this.start + this.step, this.end, this.step, null) : null : this.start + this.step > this.end ? new Ki(this.meta, this.start + this.step, this.end, this.step, null) : null;
};
h.ia = function() {
  return nc(kd(this)) ? 0 : Math.ceil((this.end - this.start) / this.step);
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = ce(this);
};
h.I = function(a, b) {
  return ue(this, b);
};
h.ma = function() {
  return xe(Zd, this.meta);
};
h.va = function(a, b) {
  return je(this, b);
};
h.wa = function(a, b, c) {
  for (a = this.start;;) {
    if (0 < this.step ? a < this.end : a > this.end) {
      c = b.j ? b.j(c, a) : b.call(null, c, a);
      if (ie(c)) {
        return N.h ? N.h(c) : N.call(null, c);
      }
      a += this.step;
    } else {
      return c;
    }
  }
};
h.xa = function() {
  return null == kd(this) ? null : this.start;
};
h.Qa = function() {
  return null != kd(this) ? new Ki(this.meta, this.start + this.step, this.end, this.step, null) : Zd;
};
h.da = function() {
  return 0 < this.step ? this.start < this.end ? this : null : 0 > this.step ? this.start > this.end ? this : null : this.start === this.end ? null : this;
};
h.S = function(a, b) {
  return new Ki(b, this.start, this.end, this.step, this.F);
};
h.ea = function(a, b) {
  return ve(b, this);
};
Ki.prototype[sc] = function() {
  return ae(this);
};
function Li(a) {
  for (;;) {
    if (x(a)) {
      a = K(a);
    } else {
      break;
    }
  }
}
function Mi(a) {
  Li(a);
  return a;
}
function Ni(a, b) {
  if ("string" === typeof b) {
    var c = a.exec(b);
    return M.j(I(c), b) ? 1 === P(c) ? I(c) : dh(c) : null;
  }
  throw new TypeError("re-matches must match against a string.");
}
function Oi(a, b) {
  if ("string" === typeof b) {
    var c = a.exec(b);
    return null == c ? null : 1 === P(c) ? I(c) : dh(c);
  }
  throw new TypeError("re-find must match against a string.");
}
function Pi(a) {
  if (a instanceof RegExp) {
    return a;
  }
  var b = Oi(/^\(\?([idmsux]*)\)/, a), c = T(b, 0, null), b = T(b, 1, null), c = P(c);
  return new RegExp(a.substring(c), z(b) ? b : "");
}
function Qi(a, b, c, d, e, f, g) {
  var k = $b;
  $b = null == $b ? null : $b - 1;
  try {
    if (null != $b && 0 > $b) {
      return qd(a, "#");
    }
    qd(a, c);
    if (0 === gc.h(f)) {
      x(g) && qd(a, function() {
        var a = Ri.h(f);
        return z(a) ? a : "...";
      }());
    } else {
      if (x(g)) {
        var l = I(g);
        b.l ? b.l(l, a, f) : b.call(null, l, a, f);
      }
      for (var n = K(g), m = gc.h(f) - 1;;) {
        if (!n || null != m && 0 === m) {
          x(n) && 0 === m && (qd(a, d), qd(a, function() {
            var a = Ri.h(f);
            return z(a) ? a : "...";
          }()));
          break;
        } else {
          qd(a, d);
          var r = I(n);
          c = a;
          g = f;
          b.l ? b.l(r, c, g) : b.call(null, r, c, g);
          var t = K(n);
          c = m - 1;
          n = t;
          m = c;
        }
      }
    }
    return qd(a, e);
  } finally {
    $b = k;
  }
}
function Si(a, b) {
  for (var c = x(b), d = null, e = 0, f = 0;;) {
    if (f < e) {
      var g = d.Z(null, f);
      qd(a, g);
      f += 1;
    } else {
      if (c = x(c)) {
        d = c, Se(d) ? (c = Ad(d), e = Bd(d), d = c, g = P(c), c = e, e = g) : (g = I(d), qd(a, g), c = K(d), d = null, e = 0), f = 0;
      } else {
        return null;
      }
    }
  }
}
var Ti = {'"':'\\"', "\\":"\\\\", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t"};
function Ui(a) {
  return [E('"'), E(a.replace(RegExp('[\\\\"\b\f\n\r\t]', "g"), function(a) {
    return Ti[a];
  })), E('"')].join("");
}
function Vi(a, b) {
  var c = Xe(H.j(a, ec));
  return c ? (c = null != b ? b.v & 131072 || b.tf ? !0 : !1 : !1) ? null != Je(b) : c : c;
}
function Wi(a, b, c) {
  if (null == a) {
    return qd(b, "nil");
  }
  if (Vi(c, a)) {
    qd(b, "^");
    var d = Je(a);
    Xi.l ? Xi.l(d, b, c) : Xi.call(null, d, b, c);
    qd(b, " ");
  }
  if (a.Db) {
    return a.Rb(a, b, c);
  }
  if (null != a && (a.v & 2147483648 || a.ja)) {
    return a.V(null, b, c);
  }
  if (!0 === a || !1 === a || "number" === typeof a) {
    return qd(b, "" + E(a));
  }
  if (null != a && a.constructor === Object) {
    return qd(b, "#js "), d = wg.j(function(b) {
      return new V(null, 2, 5, W, [Bf.h(b), a[b]], null);
    }, Te(a)), Yi.J ? Yi.J(d, Xi, b, c) : Yi.call(null, d, Xi, b, c);
  }
  if (mc(a)) {
    return Qi(b, Xi, "#js [", " ", "]", c, a);
  }
  if (ha(a)) {
    return z(dc.h(c)) ? qd(b, Ui(a)) : qd(b, a);
  }
  if (ia(a)) {
    var e = a.name;
    c = z(function() {
      var a = null == e;
      return a ? a : Aa(e);
    }()) ? "Function" : e;
    return Si(b, S(["#object[", c, ' "', "" + E(a), '"]'], 0));
  }
  if (a instanceof Date) {
    return c = function(a, b) {
      for (var c = "" + E(a);;) {
        if (P(c) < b) {
          c = [E("0"), E(c)].join("");
        } else {
          return c;
        }
      }
    }, Si(b, S(['#inst "', "" + E(a.getUTCFullYear()), "-", c(a.getUTCMonth() + 1, 2), "-", c(a.getUTCDate(), 2), "T", c(a.getUTCHours(), 2), ":", c(a.getUTCMinutes(), 2), ":", c(a.getUTCSeconds(), 2), ".", c(a.getUTCMilliseconds(), 3), "-", '00:00"'], 0));
  }
  if (a instanceof RegExp) {
    return Si(b, S(['#"', a.source, '"'], 0));
  }
  if (z(a.constructor.ob)) {
    return Si(b, S(["#object[", a.constructor.ob.replace(RegExp("/", "g"), "."), "]"], 0));
  }
  e = a.constructor.name;
  c = z(function() {
    var a = null == e;
    return a ? a : Aa(e);
  }()) ? "Object" : e;
  return Si(b, S(["#object[", c, " ", "" + E(a), "]"], 0));
}
function Xi(a, b, c) {
  var d = Zi.h(c);
  return z(d) ? (c = U.l(c, $i, Wi), d.l ? d.l(a, b, c) : d.call(null, a, b, c)) : Wi(a, b, c);
}
function aj(a, b) {
  var c;
  if (Ke(a)) {
    c = "";
  } else {
    c = E;
    var d = new hb;
    a: {
      var e = new Jd(d);
      Xi(I(a), e, b);
      for (var f = x(K(a)), g = null, k = 0, l = 0;;) {
        if (l < k) {
          var n = g.Z(null, l);
          qd(e, " ");
          Xi(n, e, b);
          l += 1;
        } else {
          if (f = x(f)) {
            g = f, Se(g) ? (f = Ad(g), k = Bd(g), g = f, n = P(f), f = k, k = n) : (n = I(g), qd(e, " "), Xi(n, e, b), f = K(g), g = null, k = 0), l = 0;
          } else {
            break a;
          }
        }
      }
    }
    c = "" + c(d);
  }
  return c;
}
var bj = function() {
  function a(a) {
    var d = null;
    if (0 < arguments.length) {
      for (var d = 0, e = Array(arguments.length - 0);d < e.length;) {
        e[d] = arguments[d + 0], ++d;
      }
      d = new w(e, 0);
    }
    return b.call(this, d);
  }
  function b(a) {
    var b = U.l(bc(), dc, !1);
    a = aj(a, b);
    Yb.h ? Yb.h(a) : Yb.call(null, a);
    return null;
  }
  a.L = 0;
  a.H = function(a) {
    a = x(a);
    return b(a);
  };
  a.A = b;
  return a;
}();
function Yi(a, b, c, d) {
  return Qi(c, function(a, c, d) {
    var k = Rc(a);
    b.l ? b.l(k, c, d) : b.call(null, k, c, d);
    qd(c, " ");
    a = Sc(a);
    return b.l ? b.l(a, c, d) : b.call(null, a, c, d);
  }, "{", ", ", "}", d, x(a));
}
ug.prototype.ja = !0;
ug.prototype.V = function(a, b, c) {
  qd(b, "#object [cljs.core.Volatile ");
  Xi(new q(null, 1, [cj, this.state], null), b, c);
  return qd(b, "]");
};
w.prototype.ja = !0;
w.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
Df.prototype.ja = !0;
Df.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
ji.prototype.ja = !0;
ji.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
ai.prototype.ja = !0;
ai.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
ni.prototype.ja = !0;
ni.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "[", " ", "]", c, this);
};
yh.prototype.ja = !0;
yh.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
Fi.prototype.ja = !0;
Fi.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "#{", " ", "}", c, this);
};
fh.prototype.ja = !0;
fh.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
yf.prototype.ja = !0;
yf.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
te.prototype.ja = !0;
te.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
fi.prototype.ja = !0;
fi.prototype.V = function(a, b, c) {
  return Yi(this, Xi, b, c);
};
ci.prototype.ja = !0;
ci.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
jh.prototype.ja = !0;
jh.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "[", " ", "]", c, this);
};
vi.prototype.ja = !0;
vi.prototype.V = function(a, b, c) {
  return Yi(this, Xi, b, c);
};
Ci.prototype.ja = !0;
Ci.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "#{", " ", "}", c, this);
};
Hf.prototype.ja = !0;
Hf.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
ng.prototype.ja = !0;
ng.prototype.V = function(a, b, c) {
  qd(b, "#object [cljs.core.Atom ");
  Xi(new q(null, 1, [cj, this.state], null), b, c);
  return qd(b, "]");
};
zi.prototype.ja = !0;
zi.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
mi.prototype.ja = !0;
mi.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "[", " ", "]", c, this);
};
V.prototype.ja = !0;
V.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "[", " ", "]", c, this);
};
oh.prototype.ja = !0;
oh.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
vf.prototype.ja = !0;
vf.prototype.V = function(a, b) {
  return qd(b, "()");
};
ph.prototype.ja = !0;
ph.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "#queue [", " ", "]", c, x(this));
};
q.prototype.ja = !0;
q.prototype.V = function(a, b, c) {
  return Yi(this, Xi, b, c);
};
Ki.prototype.ja = !0;
Ki.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
yi.prototype.ja = !0;
yi.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
tf.prototype.ja = !0;
tf.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "(", " ", ")", c, this);
};
F.prototype.zc = !0;
F.prototype.Zb = function(a, b) {
  if (b instanceof F) {
    return Wd(this, b);
  }
  throw Error([E("Cannot compare "), E(this), E(" to "), E(b)].join(""));
};
X.prototype.zc = !0;
X.prototype.Zb = function(a, b) {
  if (b instanceof X) {
    return zf(this, b);
  }
  throw Error([E("Cannot compare "), E(this), E(" to "), E(b)].join(""));
};
jh.prototype.zc = !0;
jh.prototype.Zb = function(a, b) {
  if (Re(b)) {
    return bf(this, b);
  }
  throw Error([E("Cannot compare "), E(this), E(" to "), E(b)].join(""));
};
V.prototype.zc = !0;
V.prototype.Zb = function(a, b) {
  if (Re(b)) {
    return bf(this, b);
  }
  throw Error([E("Cannot compare "), E(this), E(" to "), E(b)].join(""));
};
function dj() {
}
var ej = function ej(b) {
  if (null != b && null != b.pg) {
    return b.pg(b);
  }
  var c = ej[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = ej._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("IEncodeJS.-clj-\x3ejs", b);
};
function fj(a) {
  return (null != a ? a.og || (a.Ge ? 0 : A(dj, a)) : A(dj, a)) ? ej(a) : "string" === typeof a || "number" === typeof a || a instanceof X || a instanceof F ? gj.h ? gj.h(a) : gj.call(null, a) : aj(S([a], 0), bc());
}
var gj = function gj(b) {
  if (null == b) {
    return null;
  }
  if (null != b ? b.og || (b.Ge ? 0 : A(dj, b)) : A(dj, b)) {
    return ej(b);
  }
  if (b instanceof X) {
    return Cf(b);
  }
  if (b instanceof F) {
    return "" + E(b);
  }
  if (Pe(b)) {
    var c = {};
    b = x(b);
    for (var d = null, e = 0, f = 0;;) {
      if (f < e) {
        var g = d.Z(null, f), k = T(g, 0, null), g = T(g, 1, null);
        c[fj(k)] = gj(g);
        f += 1;
      } else {
        if (b = x(b)) {
          Se(b) ? (e = Ad(b), b = Bd(b), d = e, e = P(e)) : (e = I(b), d = T(e, 0, null), e = T(e, 1, null), c[fj(d)] = gj(e), b = K(b), d = null, e = 0), f = 0;
        } else {
          break;
        }
      }
    }
    return c;
  }
  if (Le(b)) {
    c = [];
    b = x(wg.j(gj, b));
    d = null;
    for (f = e = 0;;) {
      if (f < e) {
        k = d.Z(null, f), c.push(k), f += 1;
      } else {
        if (b = x(b)) {
          d = b, Se(d) ? (b = Ad(d), f = Bd(d), d = b, e = P(b), b = f) : (b = I(d), c.push(b), b = K(d), d = null, e = 0), f = 0;
        } else {
          break;
        }
      }
    }
    return c;
  }
  return b;
};
function hj() {
}
var ij = function ij(b, c) {
  if (null != b && null != b.ng) {
    return b.ng(b, c);
  }
  var d = ij[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = ij._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("IEncodeClojure.-js-\x3eclj", b);
};
function jj(a, b) {
  var c = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b, d = H.j(c, kj);
  return function(a, c, d, k) {
    return function n(m) {
      return (null != m ? m.Bh || (m.Ge ? 0 : A(hj, m)) : A(hj, m)) ? ij(m, Rf(xi, b)) : We(m) ? Mi(wg.j(n, m)) : Le(m) ? Ig.j(null == m ? null : Ac(m), wg.j(n, m)) : mc(m) ? dh(wg.j(n, m)) : qc(m) === Object ? Ig.j(cg, function() {
        return function(a, b, c, d) {
          return function B(e) {
            return new Df(null, function(a, b, c, d) {
              return function() {
                for (;;) {
                  var a = x(e);
                  if (a) {
                    if (Se(a)) {
                      var b = Ad(a), c = P(b), f = new Ff(Array(c), 0);
                      a: {
                        for (var g = 0;;) {
                          if (g < c) {
                            var k = Ec.j(b, g), k = new V(null, 2, 5, W, [d.h ? d.h(k) : d.call(null, k), n(m[k])], null);
                            f.add(k);
                            g += 1;
                          } else {
                            b = !0;
                            break a;
                          }
                        }
                      }
                      return b ? If(f.ib(), B(Bd(a))) : If(f.ib(), null);
                    }
                    f = I(a);
                    return ve(new V(null, 2, 5, W, [d.h ? d.h(f) : d.call(null, f), n(m[f])], null), B(Yd(a)));
                  }
                  return null;
                }
              };
            }(a, b, c, d), null, null);
          };
        }(a, c, d, k)(Te(m));
      }()) : m;
    };
  }(b, c, d, z(d) ? Bf : E)(a);
}
var lj = null;
function mj() {
  if (null == lj) {
    var a = new q(null, 3, [nj, cg, oj, cg, pj, cg], null);
    lj = pg ? pg(a) : og.call(null, a);
  }
  return lj;
}
function qj(a, b, c) {
  var d = M.j(b, c);
  if (!d && !(d = Ze(pj.h(a).call(null, b), c)) && (d = Re(c)) && (d = Re(b))) {
    if (d = P(c) === P(b)) {
      for (var d = !0, e = 0;;) {
        if (d && e !== P(c)) {
          d = qj(a, b.h ? b.h(e) : b.call(null, e), c.h ? c.h(e) : c.call(null, e)), e += 1;
        } else {
          return d;
        }
      }
    } else {
      return d;
    }
  } else {
    return d;
  }
}
function rj(a) {
  var b;
  b = mj();
  b = N.h ? N.h(b) : N.call(null, b);
  return Xf(H.j(nj.h(b), a));
}
function sj(a, b, c, d) {
  tg.j(a, function() {
    return N.h ? N.h(b) : N.call(null, b);
  });
  tg.j(c, function() {
    return N.h ? N.h(d) : N.call(null, d);
  });
}
var tj = function tj(b, c, d) {
  var e = (N.h ? N.h(d) : N.call(null, d)).call(null, b), e = z(z(e) ? e.h ? e.h(c) : e.call(null, c) : e) ? !0 : null;
  if (z(e)) {
    return e;
  }
  e = function() {
    for (var e = rj(c);;) {
      if (0 < P(e)) {
        tj(b, I(e), d), e = Yd(e);
      } else {
        return null;
      }
    }
  }();
  if (z(e)) {
    return e;
  }
  e = function() {
    for (var e = rj(b);;) {
      if (0 < P(e)) {
        tj(I(e), c, d), e = Yd(e);
      } else {
        return null;
      }
    }
  }();
  return z(e) ? e : !1;
};
function uj(a, b, c) {
  c = tj(a, b, c);
  if (z(c)) {
    a = c;
  } else {
    c = qj;
    var d;
    d = mj();
    d = N.h ? N.h(d) : N.call(null, d);
    a = c(d, a, b);
  }
  return a;
}
var vj = function vj(b, c, d, e, f, g, k) {
  var l = uc(function(e, g) {
    var k = T(g, 0, null);
    T(g, 1, null);
    if (qj(N.h ? N.h(d) : N.call(null, d), c, k)) {
      var l;
      l = (l = null == e) ? l : uj(k, I(e), f);
      l = z(l) ? g : e;
      if (!z(uj(I(l), k, f))) {
        throw Error([E("Multiple methods in multimethod '"), E(b), E("' match dispatch value: "), E(c), E(" -\x3e "), E(k), E(" and "), E(I(l)), E(", and neither is preferred")].join(""));
      }
      return l;
    }
    return e;
  }, null, N.h ? N.h(e) : N.call(null, e));
  if (z(l)) {
    if (M.j(N.h ? N.h(k) : N.call(null, k), N.h ? N.h(d) : N.call(null, d))) {
      return tg.J(g, U, c, Be(l)), Be(l);
    }
    sj(g, e, k, d);
    return vj(b, c, d, e, f, g, k);
  }
  return null;
};
function wj(a, b) {
  throw Error([E("No method in multimethod '"), E(a), E("' for dispatch value: "), E(b)].join(""));
}
function xj(a, b, c, d, e, f, g, k) {
  this.name = a;
  this.C = b;
  this.Cg = c;
  this.Dd = d;
  this.$c = e;
  this.ih = f;
  this.Jd = g;
  this.gd = k;
  this.v = 4194305;
  this.K = 4352;
}
h = xj.prototype;
h.call = function() {
  function a(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, J, L, R) {
    a = this;
    var wa = Vf(a.C, b, c, d, e, S([f, g, k, l, m, n, r, t, u, v, y, B, G, D, J, L, R], 0)), op = yj(this, wa);
    z(op) || wj(a.name, wa);
    return Vf(op, b, c, d, e, S([f, g, k, l, m, n, r, t, u, v, y, B, G, D, J, L, R], 0));
  }
  function b(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, J, L) {
    a = this;
    var R = a.C.Na ? a.C.Na(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, J, L) : a.C.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, J, L), wa = yj(this, R);
    z(wa) || wj(a.name, R);
    return wa.Na ? wa.Na(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, J, L) : wa.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, J, L);
  }
  function c(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, J) {
    a = this;
    var L = a.C.Ma ? a.C.Ma(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, J) : a.C.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, J), R = yj(this, L);
    z(R) || wj(a.name, L);
    return R.Ma ? R.Ma(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, J) : R.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D, J);
  }
  function d(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D) {
    a = this;
    var J = a.C.La ? a.C.La(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D) : a.C.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D), L = yj(this, J);
    z(L) || wj(a.name, J);
    return L.La ? L.La(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D) : L.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, D);
  }
  function e(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G) {
    a = this;
    var D = a.C.Ka ? a.C.Ka(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G) : a.C.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G), J = yj(this, D);
    z(J) || wj(a.name, D);
    return J.Ka ? J.Ka(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G) : J.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G);
  }
  function f(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B) {
    a = this;
    var G = a.C.Ja ? a.C.Ja(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B) : a.C.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B), D = yj(this, G);
    z(D) || wj(a.name, G);
    return D.Ja ? D.Ja(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B) : D.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B);
  }
  function g(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y) {
    a = this;
    var B = a.C.Ia ? a.C.Ia(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y) : a.C.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y), G = yj(this, B);
    z(G) || wj(a.name, B);
    return G.Ia ? G.Ia(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y) : G.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y);
  }
  function k(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v) {
    a = this;
    var y = a.C.Ha ? a.C.Ha(b, c, d, e, f, g, k, l, m, n, r, t, u, v) : a.C.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v), B = yj(this, y);
    z(B) || wj(a.name, y);
    return B.Ha ? B.Ha(b, c, d, e, f, g, k, l, m, n, r, t, u, v) : B.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u, v);
  }
  function l(a, b, c, d, e, f, g, k, l, m, n, r, t, u) {
    a = this;
    var v = a.C.Ga ? a.C.Ga(b, c, d, e, f, g, k, l, m, n, r, t, u) : a.C.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u), y = yj(this, v);
    z(y) || wj(a.name, v);
    return y.Ga ? y.Ga(b, c, d, e, f, g, k, l, m, n, r, t, u) : y.call(null, b, c, d, e, f, g, k, l, m, n, r, t, u);
  }
  function n(a, b, c, d, e, f, g, k, l, m, n, r, t) {
    a = this;
    var u = a.C.Fa ? a.C.Fa(b, c, d, e, f, g, k, l, m, n, r, t) : a.C.call(null, b, c, d, e, f, g, k, l, m, n, r, t), v = yj(this, u);
    z(v) || wj(a.name, u);
    return v.Fa ? v.Fa(b, c, d, e, f, g, k, l, m, n, r, t) : v.call(null, b, c, d, e, f, g, k, l, m, n, r, t);
  }
  function m(a, b, c, d, e, f, g, k, l, m, n, r) {
    a = this;
    var t = a.C.Ea ? a.C.Ea(b, c, d, e, f, g, k, l, m, n, r) : a.C.call(null, b, c, d, e, f, g, k, l, m, n, r), u = yj(this, t);
    z(u) || wj(a.name, t);
    return u.Ea ? u.Ea(b, c, d, e, f, g, k, l, m, n, r) : u.call(null, b, c, d, e, f, g, k, l, m, n, r);
  }
  function r(a, b, c, d, e, f, g, k, l, m, n) {
    a = this;
    var r = a.C.Da ? a.C.Da(b, c, d, e, f, g, k, l, m, n) : a.C.call(null, b, c, d, e, f, g, k, l, m, n), t = yj(this, r);
    z(t) || wj(a.name, r);
    return t.Da ? t.Da(b, c, d, e, f, g, k, l, m, n) : t.call(null, b, c, d, e, f, g, k, l, m, n);
  }
  function t(a, b, c, d, e, f, g, k, l, m) {
    a = this;
    var n = a.C.Pa ? a.C.Pa(b, c, d, e, f, g, k, l, m) : a.C.call(null, b, c, d, e, f, g, k, l, m), r = yj(this, n);
    z(r) || wj(a.name, n);
    return r.Pa ? r.Pa(b, c, d, e, f, g, k, l, m) : r.call(null, b, c, d, e, f, g, k, l, m);
  }
  function u(a, b, c, d, e, f, g, k, l) {
    a = this;
    var m = a.C.Oa ? a.C.Oa(b, c, d, e, f, g, k, l) : a.C.call(null, b, c, d, e, f, g, k, l), n = yj(this, m);
    z(n) || wj(a.name, m);
    return n.Oa ? n.Oa(b, c, d, e, f, g, k, l) : n.call(null, b, c, d, e, f, g, k, l);
  }
  function v(a, b, c, d, e, f, g, k) {
    a = this;
    var l = a.C.Aa ? a.C.Aa(b, c, d, e, f, g, k) : a.C.call(null, b, c, d, e, f, g, k), m = yj(this, l);
    z(m) || wj(a.name, l);
    return m.Aa ? m.Aa(b, c, d, e, f, g, k) : m.call(null, b, c, d, e, f, g, k);
  }
  function y(a, b, c, d, e, f, g) {
    a = this;
    var k = a.C.ta ? a.C.ta(b, c, d, e, f, g) : a.C.call(null, b, c, d, e, f, g), l = yj(this, k);
    z(l) || wj(a.name, k);
    return l.ta ? l.ta(b, c, d, e, f, g) : l.call(null, b, c, d, e, f, g);
  }
  function B(a, b, c, d, e, f) {
    a = this;
    var g = a.C.P ? a.C.P(b, c, d, e, f) : a.C.call(null, b, c, d, e, f), k = yj(this, g);
    z(k) || wj(a.name, g);
    return k.P ? k.P(b, c, d, e, f) : k.call(null, b, c, d, e, f);
  }
  function G(a, b, c, d, e) {
    a = this;
    var f = a.C.J ? a.C.J(b, c, d, e) : a.C.call(null, b, c, d, e), g = yj(this, f);
    z(g) || wj(a.name, f);
    return g.J ? g.J(b, c, d, e) : g.call(null, b, c, d, e);
  }
  function D(a, b, c, d) {
    a = this;
    var e = a.C.l ? a.C.l(b, c, d) : a.C.call(null, b, c, d), f = yj(this, e);
    z(f) || wj(a.name, e);
    return f.l ? f.l(b, c, d) : f.call(null, b, c, d);
  }
  function L(a, b, c) {
    a = this;
    var d = a.C.j ? a.C.j(b, c) : a.C.call(null, b, c), e = yj(this, d);
    z(e) || wj(a.name, d);
    return e.j ? e.j(b, c) : e.call(null, b, c);
  }
  function R(a, b) {
    a = this;
    var c = a.C.h ? a.C.h(b) : a.C.call(null, b), d = yj(this, c);
    z(d) || wj(a.name, c);
    return d.h ? d.h(b) : d.call(null, b);
  }
  function wa(a) {
    a = this;
    var b = a.C.w ? a.C.w() : a.C.call(null), c = yj(this, b);
    z(c) || wj(a.name, b);
    return c.w ? c.w() : c.call(null);
  }
  var J = null, J = function(J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, $c, kb, rb, lb, Mb, pc, ad, Pd, Oe, Bg, Ik) {
    switch(arguments.length) {
      case 1:
        return wa.call(this, J);
      case 2:
        return R.call(this, J, ea);
      case 3:
        return L.call(this, J, ea, ka);
      case 4:
        return D.call(this, J, ea, ka, sa);
      case 5:
        return G.call(this, J, ea, ka, sa, xa);
      case 6:
        return B.call(this, J, ea, ka, sa, xa, ta);
      case 7:
        return y.call(this, J, ea, ka, sa, xa, ta, pa);
      case 8:
        return v.call(this, J, ea, ka, sa, xa, ta, pa, Ga);
      case 9:
        return u.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa);
      case 10:
        return t.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa);
      case 11:
        return r.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db);
      case 12:
        return m.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, $c);
      case 13:
        return n.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, $c, kb);
      case 14:
        return l.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, $c, kb, rb);
      case 15:
        return k.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, $c, kb, rb, lb);
      case 16:
        return g.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, $c, kb, rb, lb, Mb);
      case 17:
        return f.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, $c, kb, rb, lb, Mb, pc);
      case 18:
        return e.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, $c, kb, rb, lb, Mb, pc, ad);
      case 19:
        return d.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, $c, kb, rb, lb, Mb, pc, ad, Pd);
      case 20:
        return c.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, $c, kb, rb, lb, Mb, pc, ad, Pd, Oe);
      case 21:
        return b.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, $c, kb, rb, lb, Mb, pc, ad, Pd, Oe, Bg);
      case 22:
        return a.call(this, J, ea, ka, sa, xa, ta, pa, Ga, Sa, Wa, db, $c, kb, rb, lb, Mb, pc, ad, Pd, Oe, Bg, Ik);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  J.h = wa;
  J.j = R;
  J.l = L;
  J.J = D;
  J.P = G;
  J.ta = B;
  J.Aa = y;
  J.Oa = v;
  J.Pa = u;
  J.Da = t;
  J.Ea = r;
  J.Fa = m;
  J.Ga = n;
  J.Ha = l;
  J.Ia = k;
  J.Ja = g;
  J.Ka = f;
  J.La = e;
  J.Ma = d;
  J.Na = c;
  J.De = b;
  J.md = a;
  return J;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(tc(b)));
};
h.w = function() {
  var a = this.C.w ? this.C.w() : this.C.call(null), b = yj(this, a);
  z(b) || wj(this.name, a);
  return b.w ? b.w() : b.call(null);
};
h.h = function(a) {
  var b = this.C.h ? this.C.h(a) : this.C.call(null, a), c = yj(this, b);
  z(c) || wj(this.name, b);
  return c.h ? c.h(a) : c.call(null, a);
};
h.j = function(a, b) {
  var c = this.C.j ? this.C.j(a, b) : this.C.call(null, a, b), d = yj(this, c);
  z(d) || wj(this.name, c);
  return d.j ? d.j(a, b) : d.call(null, a, b);
};
h.l = function(a, b, c) {
  var d = this.C.l ? this.C.l(a, b, c) : this.C.call(null, a, b, c), e = yj(this, d);
  z(e) || wj(this.name, d);
  return e.l ? e.l(a, b, c) : e.call(null, a, b, c);
};
h.J = function(a, b, c, d) {
  var e = this.C.J ? this.C.J(a, b, c, d) : this.C.call(null, a, b, c, d), f = yj(this, e);
  z(f) || wj(this.name, e);
  return f.J ? f.J(a, b, c, d) : f.call(null, a, b, c, d);
};
h.P = function(a, b, c, d, e) {
  var f = this.C.P ? this.C.P(a, b, c, d, e) : this.C.call(null, a, b, c, d, e), g = yj(this, f);
  z(g) || wj(this.name, f);
  return g.P ? g.P(a, b, c, d, e) : g.call(null, a, b, c, d, e);
};
h.ta = function(a, b, c, d, e, f) {
  var g = this.C.ta ? this.C.ta(a, b, c, d, e, f) : this.C.call(null, a, b, c, d, e, f), k = yj(this, g);
  z(k) || wj(this.name, g);
  return k.ta ? k.ta(a, b, c, d, e, f) : k.call(null, a, b, c, d, e, f);
};
h.Aa = function(a, b, c, d, e, f, g) {
  var k = this.C.Aa ? this.C.Aa(a, b, c, d, e, f, g) : this.C.call(null, a, b, c, d, e, f, g), l = yj(this, k);
  z(l) || wj(this.name, k);
  return l.Aa ? l.Aa(a, b, c, d, e, f, g) : l.call(null, a, b, c, d, e, f, g);
};
h.Oa = function(a, b, c, d, e, f, g, k) {
  var l = this.C.Oa ? this.C.Oa(a, b, c, d, e, f, g, k) : this.C.call(null, a, b, c, d, e, f, g, k), n = yj(this, l);
  z(n) || wj(this.name, l);
  return n.Oa ? n.Oa(a, b, c, d, e, f, g, k) : n.call(null, a, b, c, d, e, f, g, k);
};
h.Pa = function(a, b, c, d, e, f, g, k, l) {
  var n = this.C.Pa ? this.C.Pa(a, b, c, d, e, f, g, k, l) : this.C.call(null, a, b, c, d, e, f, g, k, l), m = yj(this, n);
  z(m) || wj(this.name, n);
  return m.Pa ? m.Pa(a, b, c, d, e, f, g, k, l) : m.call(null, a, b, c, d, e, f, g, k, l);
};
h.Da = function(a, b, c, d, e, f, g, k, l, n) {
  var m = this.C.Da ? this.C.Da(a, b, c, d, e, f, g, k, l, n) : this.C.call(null, a, b, c, d, e, f, g, k, l, n), r = yj(this, m);
  z(r) || wj(this.name, m);
  return r.Da ? r.Da(a, b, c, d, e, f, g, k, l, n) : r.call(null, a, b, c, d, e, f, g, k, l, n);
};
h.Ea = function(a, b, c, d, e, f, g, k, l, n, m) {
  var r = this.C.Ea ? this.C.Ea(a, b, c, d, e, f, g, k, l, n, m) : this.C.call(null, a, b, c, d, e, f, g, k, l, n, m), t = yj(this, r);
  z(t) || wj(this.name, r);
  return t.Ea ? t.Ea(a, b, c, d, e, f, g, k, l, n, m) : t.call(null, a, b, c, d, e, f, g, k, l, n, m);
};
h.Fa = function(a, b, c, d, e, f, g, k, l, n, m, r) {
  var t = this.C.Fa ? this.C.Fa(a, b, c, d, e, f, g, k, l, n, m, r) : this.C.call(null, a, b, c, d, e, f, g, k, l, n, m, r), u = yj(this, t);
  z(u) || wj(this.name, t);
  return u.Fa ? u.Fa(a, b, c, d, e, f, g, k, l, n, m, r) : u.call(null, a, b, c, d, e, f, g, k, l, n, m, r);
};
h.Ga = function(a, b, c, d, e, f, g, k, l, n, m, r, t) {
  var u = this.C.Ga ? this.C.Ga(a, b, c, d, e, f, g, k, l, n, m, r, t) : this.C.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t), v = yj(this, u);
  z(v) || wj(this.name, u);
  return v.Ga ? v.Ga(a, b, c, d, e, f, g, k, l, n, m, r, t) : v.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t);
};
h.Ha = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u) {
  var v = this.C.Ha ? this.C.Ha(a, b, c, d, e, f, g, k, l, n, m, r, t, u) : this.C.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u), y = yj(this, v);
  z(y) || wj(this.name, v);
  return y.Ha ? y.Ha(a, b, c, d, e, f, g, k, l, n, m, r, t, u) : y.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u);
};
h.Ia = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v) {
  var y = this.C.Ia ? this.C.Ia(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v) : this.C.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v), B = yj(this, y);
  z(B) || wj(this.name, y);
  return B.Ia ? B.Ia(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v) : B.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v);
};
h.Ja = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y) {
  var B = this.C.Ja ? this.C.Ja(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y) : this.C.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y), G = yj(this, B);
  z(G) || wj(this.name, B);
  return G.Ja ? G.Ja(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y) : G.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y);
};
h.Ka = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B) {
  var G = this.C.Ka ? this.C.Ka(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B) : this.C.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B), D = yj(this, G);
  z(D) || wj(this.name, G);
  return D.Ka ? D.Ka(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B) : D.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B);
};
h.La = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G) {
  var D = this.C.La ? this.C.La(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G) : this.C.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G), L = yj(this, D);
  z(L) || wj(this.name, D);
  return L.La ? L.La(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G) : L.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G);
};
h.Ma = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D) {
  var L = this.C.Ma ? this.C.Ma(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D) : this.C.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D), R = yj(this, L);
  z(R) || wj(this.name, L);
  return R.Ma ? R.Ma(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D) : R.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D);
};
h.Na = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L) {
  var R = this.C.Na ? this.C.Na(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L) : this.C.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L), wa = yj(this, R);
  z(wa) || wj(this.name, R);
  return wa.Na ? wa.Na(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L) : wa.call(null, a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L);
};
h.De = function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L, R) {
  var wa = Vf(this.C, a, b, c, d, S([e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L, R], 0)), J = yj(this, wa);
  z(J) || wj(this.name, wa);
  return Vf(J, a, b, c, d, S([e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, L, R], 0));
};
function zj(a, b) {
  var c = Aj;
  tg.J(c.$c, U, a, b);
  sj(c.Jd, c.$c, c.gd, c.Dd);
}
function yj(a, b) {
  M.j(N.h ? N.h(a.gd) : N.call(null, a.gd), N.h ? N.h(a.Dd) : N.call(null, a.Dd)) || sj(a.Jd, a.$c, a.gd, a.Dd);
  var c = (N.h ? N.h(a.Jd) : N.call(null, a.Jd)).call(null, b);
  if (z(c)) {
    return c;
  }
  c = vj(a.name, b, a.Dd, a.$c, a.ih, a.Jd, a.gd);
  return z(c) ? c : (N.h ? N.h(a.$c) : N.call(null, a.$c)).call(null, a.Cg);
}
h.pd = function() {
  return Dd(this.name);
};
h.qd = function() {
  return Ed(this.name);
};
h.U = function() {
  return la(this);
};
function Bj(a, b) {
  this.Pb = a;
  this.F = b;
  this.v = 2153775104;
  this.K = 2048;
}
h = Bj.prototype;
h.toString = function() {
  return this.Pb;
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.I = function(a, b) {
  return b instanceof Bj && this.Pb === b.Pb;
};
h.V = function(a, b) {
  return qd(b, [E('#uuid "'), E(this.Pb), E('"')].join(""));
};
h.U = function() {
  null == this.F && (this.F = Ud(this.Pb));
  return this.F;
};
h.Zb = function(a, b) {
  return wb(this.Pb, b.Pb);
};
function Cj() {
  function a() {
    return Math.floor(16 * Math.random()).toString(16);
  }
  var b = (8 | 3 & Math.floor(16 * Math.random())).toString(16);
  return new Bj([E(a()), E(a()), E(a()), E(a()), E(a()), E(a()), E(a()), E(a()), E("-"), E(a()), E(a()), E(a()), E(a()), E("-"), E("4"), E(a()), E(a()), E(a()), E("-"), E(b), E(a()), E(a()), E(a()), E("-"), E(a()), E(a()), E(a()), E(a()), E(a()), E(a()), E(a()), E(a()), E(a()), E(a()), E(a()), E(a())].join(""), null);
}
;var Dj = new F(null, "form", "form", 16469056, null), Ej = new X(null, "code-mirror", "code-mirror", 575084768), Fj = new X(null, "args", "args", 1315556576), Gj = new X(null, "path", "path", -188191168), Hj = new X(null, "options-in", "options-in", -1968094624), Ij = new X(null, "encoding", "encoding", 1728578272), Jj = new X(null, "req-un", "req-un", 1074571008), Kj = new X(null, "opt-un", "opt-un", 883442496), Lj = new F("cljs.spec", "keys", "cljs.spec/keys", -927379584, null), Mj = new F(null,
"unc", "unc", -465250751, null), Nj = new X(null, "offline", "offline", -107631935), Oj = new X(null, "errors", "errors", -908790718), Pj = new X(null, "selector", "selector", 762528866), Qj = new X(null, "ret", "ret", -468222814), Rj = new X(null, "codemirror_options_out", "codemirror_options_out", 440175842), Sj = new X(null, "default-txt", "default-txt", 27736322), Tj = new X(null, "gfn", "gfn", 791517474), Uj = new X(null, "eval-counter", "eval-counter", -1501705598), Vj = new X(null, "external-libs",
"external-libs", 1628481346), Wj = new X(null, "pred-exprs", "pred-exprs", 1792271395), Xj = new X(null, "request", "request", 1772954723), Yj = new X("klipse.plugin", "eval-fn", "klipse.plugin/eval-fn", -51358589), Zj = new X(null, "get", "get", 1683182755), ak = new F(null, "map", "map", -1282745308, null), bk = new X(null, "fn", "fn", -1175266204), ck = new X(null, "json-params", "json-params", -1112693596), dk = new F(null, "regex-spec-impl", "regex-spec-impl", 1541266692, null), ek = new X(null,
"rep+", "rep+", -281382396), fk = new X(null, "idle-msec", "idle-msec", 1257447972), ec = new X(null, "meta", "meta", 1499536964), gk = new F("cljs.core", "\x3d", "cljs.core/\x3d", -1891498332, null), hk = new X(null, "loop-msec", "loop-msec", 1897277156), ik = new X(null, "static-fns", "static-fns", -501950748), jk = new X(null, "file-not-found", "file-not-found", -65398940), kk = new X(null, "jsonp", "jsonp", 226119588), lk = new X("klipse.klipse-editors", "codemirror-options", "klipse.klipse-editors/codemirror-options",
-1372888156), mk = new X(null, "compact-max-chars-in-str", "compact-max-chars-in-str", 240586724), nk = new X(null, "opt-keys", "opt-keys", 1262688261), ok = new F(null, "aform", "aform", 531303525, null), pk = new F(null, "blockable", "blockable", -28395259, null), fc = new X(null, "dup", "dup", 556298533), qk = new X(null, "editor-type", "editor-type", 198227301), rk = new F(null, "meta67389", "meta67389", -676538939, null), sk = new X(null, "jsCode", "jsCode", -574022139), tk = new X(null, "element",
"element", 1974019749), uk = new X(null, "patch", "patch", 380775109), vk = new X(null, "out-mode", "out-mode", -446316699), wk = new X("klipse.plugin", "eval_idle_msec", "klipse.plugin/eval_idle_msec", 15935397), xk = new X("klipse.klipse-editors", "editor-mode", "klipse.klipse-editors/editor-mode", -1678175194), yk = new F(null, "opt", "opt", 845825158, null), zk = new F(null, "argspec", "argspec", -1207762746, null), Ak = new X(null, "private", "private", -558947994), Bk = new X(null, "editor-out-mode",
"editor-out-mode", 1749845542), Ck = new X(null, "cljs_in", "cljs_in", 1284321894), Dk = new X("cljs.spec", "k", "cljs.spec/k", 668466950), Ek = new X(null, "response-type", "response-type", -1493770458), Fk = new X(null, "reset", "reset", -800929946), Gk = new X(null, "protocol", "protocol", 652470118), Hk = new F(null, "map-spec-impl", "map-spec-impl", -1682885722, null), Jk = new X(null, "ks", "ks", 1900203942), Kk = new X(null, "print_length", "print_length", 2140955911), Lk = new F(null, "req-un",
"req-un", -1579864761, null), Mk = new F(null, "p1__67415#", "p1__67415#", -153540217, null), Nk = new F(null, "opt-un", "opt-un", -1770993273, null), Ok = new X(null, "password", "password", 417022471), Pk = new X(null, "transit-params", "transit-params", 357261095), rg = new X(null, "validator", "validator", -1966190681), Qk = new X(null, "method", "method", 55703592), Rk = new F(null, "meta62265", "meta62265", 944909448, null), Tk = new X(null, "default", "default", -1987822328), Uk = new X(null,
"finally-block", "finally-block", 832982472), Vk = new F(null, "cb", "cb", -2064487928, null), Wk = new X(null, "replit-language", "replit-language", -941391192), Xk = new X(null, "on-should-eval", "on-should-eval", 978880168), Yk = new X(null, "matchBrackets", "matchBrackets", 1256448936), Zk = new X("klipse.plugin", "klipse-settings", "klipse.plugin/klipse-settings", 1435250729), $k = new X(null, "name", "name", 1843675177), al = new X(null, "as", "as", 1148689641), bl = new F(null, "zipmap", "zipmap",
-690049687, null), cl = new F("cljs.core", "string?", "cljs.core/string?", -2072921719, null), dl = new X(null, "encoding-opts", "encoding-opts", -1805664631), el = new X(null, "beautify-strings", "beautify-strings", -236207479), fl = new X(null, "req-specs", "req-specs", 553962313), gl = new F(null, "gfn", "gfn", -1862918295, null), hl = new X(null, "callback-name", "callback-name", 336964714), il = new F(null, "fnspec", "fnspec", -1865712406, null), jl = new F(null, "v", "v", 1661996586, null),
kl = new X(null, "username", "username", 1605666410), ll = new F(null, "pred-exprs", "pred-exprs", -862164374, null), ml = new F(null, "keys-pred", "keys-pred", -1795451030, null), nl = new X(null, "beautify?", "beautify?", 1909100619), ol = new X(null, "cwd", "cwd", 14056523), pl = new X(null, "mode", "mode", 654403691), ql = new X(null, "loaded", "loaded", -1246482293), rl = new F("goog.dom", "isElement", "goog.dom/isElement", -1707224949, null), sl = new F(null, "cpred?", "cpred?", 35589515, null),
tl = new X(null, "compact-max-elements-in-seq", "compact-max-elements-in-seq", 418251211), ul = new X(null, "editor_type", "editor_type", 195783179), vl = new F(null, "argm", "argm", -181546357, null), wl = new X(null, "settings", "settings", 1556144875), xl = new F(null, "p1__67416#", "p1__67416#", -100537365, null), yl = new X(null, "max-function-calls", "max-function-calls", -350003092), zl = new X(null, "channel", "channel", 734187692), cj = new X(null, "val", "val", 128701612), Al = new F(null,
"fform", "fform", -176049972, null), Z = new X(null, "recur", "recur", -437573268), Bl = new F(null, "opt-keys", "opt-keys", -1391747508, null), Cl = new X(null, "catch-block", "catch-block", 1175212748), Dl = new X(null, "delete", "delete", -1768633620), El = new X(null, "min-eval-idle-msec", "min-eval-idle-msec", -1547033812), Fl = new X(null, "compilationLevel", "compilationLevel", -1778317460), Gl = new F(null, "pred", "pred", -727012372, null), Hl = new X(null, "src", "src", -1651076051), Il =
new X(null, "warnings", "warnings", -735437651), $i = new X(null, "fallback-impl", "fallback-impl", -1501286995), Jl = new F("cljs.core", "contains?", "cljs.core/contains?", -976526835, null), Kl = new X(null, "comment-str", "comment-str", 130143853), Ll = new F("cljs.core", "map?", "cljs.core/map?", -1390345523, null), Ml = new X(null, "handlers", "handlers", 79528781), cc = new X(null, "flush-on-newline", "flush-on-newline", -151457939), Nl = new X(null, "skip-wiki", "skip-wiki", -2018833298),
Ol = new X(null, "port", "port", 1534937262), Pl = new F("cljs.core", "zipmap", "cljs.core/zipmap", -1902130674, null), Ql = new X(null, "minimalistic_ui", "minimalistic_ui", -944637362), Rl = new X(null, "abort", "abort", 521193198), Sl = new X(null, "base-url", "base-url", 9540398), Tl = new F(null, "alt-flag", "alt-flag", -1794972754, null), Ul = new F(null, "%", "%", -950237169, null), Vl = new X(null, "in-mode", "in-mode", 33987599), Wl = new X("cljs.spec", "pcat", "cljs.spec/pcat", -1959753649),
Xl = new X(null, "source-code", "source-code", -685884337), Yl = new F("cljs.core", "map", "cljs.core/map", -338988913, null), oj = new X(null, "descendants", "descendants", 1824886031), Zl = new F("cljs.spec", "conformer", "cljs.spec/conformer", -236330417, null), $l = new X(null, "http-error", "http-error", -1040049553), am = new F("cljs.core", "fn?", "cljs.core/fn?", 71876239, null), bm = new X(null, "headers", "headers", -835030129), cm = new X(null, "server-port", "server-port", 663745648),
pj = new X(null, "ancestors", "ancestors", -776045424), dm = new F(null, "flag", "flag", -1565787888, null), em = new F(null, "req-specs", "req-specs", -2100473456, null), fm = new X(null, "no-error", "no-error", 1984610064), dc = new X(null, "readably", "readably", 1129599760), gm = new X(null, "error-code", "error-code", 180497232), hm = new F(null, "box", "box", -1123515375, null), Ri = new X(null, "more-marker", "more-marker", -14717935), im = new X(null, "document", "document", -1329188687),
jm = new F(null, "re", "re", 1869207729, null), km = new F("klipse.plugin", "klipsify-with-opts", "klipse.plugin/klipsify-with-opts", 331340081, null), lm = new X(null, "head", "head", -771383919), mm = new X(null, "req", "req", -326448303), nm = new X(null, "host", "host", -1558485167), om = new X(null, "blob", "blob", 1636965233), pm = new X(null, "default-headers", "default-headers", -43146094), qm = new X(null, "total", "total", 1916810418), rm = new X(null, "with-credentials?", "with-credentials?",
-1773202222), sm = new X("cljs.spec", "name", "cljs.spec/name", -1902005006), tm = new F("cljs.core", "integer?", "cljs.core/integer?", 1710697810, null), um = new X("cljs.spec", "unknown", "cljs.spec/unknown", -1620309582), vm = new X(null, "beautify_strings", "beautify_strings", 1690445266), wm = new F(null, "meta66863", "meta66863", 188724722, null), xm = new X(null, "keys", "keys", 1068423698), ym = new F(null, "meta66905", "meta66905", -498393422, null), zm = new X(null, "ff-silent-error", "ff-silent-error",
189390514), Am = new X(null, "success", "success", 1890645906), Bm = new F(null, "meta62220", "meta62220", -889165902, null), Cm = new X("klipse.plugin", "options", "klipse.plugin/options", 1158769650), Dm = new X(null, "form-params", "form-params", 1884296467), Em = new X(null, "priority", "priority", 1431093715), Fm = new X(null, "readOnly", "readOnly", -1749118317), Gm = new F(null, "fn*", "fn*", -752876845, null), Hm = new F(null, "val", "val", 1769233139, null), Im = new X(null, "root", "root",
-448657453), Jm = new X(null, "status", "status", -1997798413), gc = new X(null, "print-length", "print-length", 1931866356), Km = new X(null, "ok", "ok", 967785236), Lm = new X(null, "codemirror-options-out", "codemirror-options-out", 1969968980), Mm = new F(null, "fspec-impl", "fspec-impl", 897021908, null), Nm = new X(null, "decoding-opts", "decoding-opts", 1050289140), Om = new X(null, "catch-exception", "catch-exception", -1997306795), Pm = new X(null, "opts", "opts", 155075701), Qm = new F(null,
"meta62117", "meta62117", -731726603, null), Rm = new X("klipse.plugin", "minimalistic_ui", "klipse.plugin/minimalistic_ui", 231935317), nj = new X(null, "parents", "parents", -2027538891), Sm = new F(null, "/", "/", -1371932971, null), Tm = new F(null, "keys-\x3especs", "keys-\x3especs", -97897643, null), Um = new X(null, "req-keys", "req-keys", 514319221), Vm = new F(null, "k", "k", -505765866, null), Wm = new X(null, "prev", "prev", -1597069226), Xm = new F("klipse.klipse-editors", "editor-options",
"klipse.klipse-editors/editor-options", 1970701494, null), Ym = new F("cljs.core", "fn", "cljs.core/fn", -1065745098, null), Zm = new X(null, "url", "url", 276297046), $m = new X(null, "editor-in-mode", "editor-in-mode", -1964584522), an = new X(null, "continue-block", "continue-block", -1852047850), bn = new X(null, "error-text", "error-text", 2021893718), cn = new F(null, "retspec", "retspec", -920025354, null), dn = new X("cljs.spec", "accept", "cljs.spec/accept", -1753298186), en = new X(null,
"query-params", "query-params", 900640534), fn = new X(null, "opt-specs", "opt-specs", -384905450), gn = new X(null, "in-editor-options", "in-editor-options", -1444530378), hn = new X(null, "content-type", "content-type", -508222634), jn = new X(null, "http", "http", 382524695), kn = new X(null, "timeslot-function-calls-msec", "timeslot-function-calls-msec", 189712759), ln = new X(null, "oauth-token", "oauth-token", 311415191), mn = new X(null, "context", "context", -830191113), nn = new X(null,
"post", "post", 269697687), on = new F("cljs.spec", "cat", "cljs.spec/cat", 850003863, null), pn = new X(null, "options-out", "options-out", 781271031), qn = new F(null, "rform", "rform", -1420499912, null), rn = new X(null, "pred-forms", "pred-forms", 172611832), sn = new F(null, "req", "req", 1314083224, null), tn = new X(null, "error", "error", -978969032), un = new X("klipse.plugin", "comment-str", "klipse.plugin/comment-str", 1428350840), vn = new X(null, "cancel", "cancel", -1964088360), wn =
new X(null, "exception", "exception", -335277064), xn = new X(null, "scrollbarStyle", "scrollbarStyle", -963515367), yn = new X("cljs.spec", "gfn", "cljs.spec/gfn", -432034727), zn = new X(null, "uri", "uri", -774711847), An = new X(null, "tag", "tag", -1290361223), Bn = new X(null, "anchor", "anchor", 1549638489), Cn = new X(null, "decoding", "decoding", -568180903), Dn = new X(null, "server-name", "server-name", -1012104295), En = new F(null, "p__66828", "p__66828", 1157866425, null), Fn = new X(null,
"put", "put", 1299772570), Gn = new X(null, "json", "json", 1279968570), ag = new F(null, "quote", "quote", 1377916282, null), Hn = new F(null, "alt-handler", "alt-handler", 963786170, null), In = new X(null, "timeout", "timeout", -318625318), Jn = new X(null, "eval-fn", "eval-fn", -1111644294), $f = new X(null, "arglists", "arglists", 1661989754), Kn = new X(null, "query", "query", -1288509510), Ln = new X(null, "transit-opts", "transit-opts", 1104386010), Mn = new X(null, "query-string", "query-string",
-1018845061), Zf = new F(null, "nil-iter", "nil-iter", 1101030523, null), Nn = new F(null, "id", "id", 252129435, null), On = new X(null, "progress", "progress", 244323547), Pn = new X(null, "out-editor-options", "out-editor-options", -95308421), Qn = new X(null, "hierarchy", "hierarchy", -1053470341), Rn = new F(null, "meta67405", "meta67405", 1674963515, null), Sn = new X(null, "body", "body", -2049205669), Zi = new X(null, "alt-impl", "alt-impl", 670969595), Tn = new F("cljs.spec", "fspec", "cljs.spec/fspec",
982220571, null), Un = new F(null, "fn-handler", "fn-handler", 648785851, null), Vn = new X(null, "doc", "doc", 1913296891), Wn = new F(null, "specs", "specs", -1227865028, null), Xn = new X(null, "array-buffer", "array-buffer", 519008380), Yn = new F(null, "req-keys", "req-keys", -2140116548, null), Zn = new X(null, "download", "download", -300081668), $n = new X(null, "edn-params", "edn-params", 894273052), ao = new X("cljs.spec", "op", "cljs.spec/op", 939378204), kj = new X(null, "keywordize-keys",
"keywordize-keys", 1310784252), bo = new X("cljs.spec", "v", "cljs.spec/v", -1491964132), co = new F(null, "meta62085", "meta62085", -1051638948, null), eo = new X(null, "basic-auth", "basic-auth", -673163332), fo = new F(null, "deref", "deref", 1494944732, null), go = new X(null, "codemirror_options_in", "codemirror_options_in", -1220877316), ho = new X("klipse.plugin", "editor-in-mode", "klipse.plugin/editor-in-mode", -880426851), io = new X(null, "multipart-params", "multipart-params", -1033508707),
jo = new X("klipse.plugin", "editor-out-mode", "klipse.plugin/editor-out-mode", 724274461), ko = new X(null, "custom-error", "custom-error", -1565161123), lo = new F(null, "opt-specs", "opt-specs", 1255626077, null), mo = new X(null, "scheme", "scheme", 90199613), no = new F("cljs.core", "or", "cljs.core/or", 1201033885, null), oo = new F(null, "map__66860", "map__66860", 122792669, null), po = new X(null, "trace-redirects", "trace-redirects", -1149427907), qo = new X(null, "keywordize-keys?", "keywordize-keys?",
-254545987), ro = new X(null, "direction", "direction", -633359395), so = new X(null, "eval_idle_msec", "eval_idle_msec", 1104296094), to = new X(null, "access-denied", "access-denied", 959449406), uo = new X(null, "upload", "upload", -255769218), vo = new X(null, "request-method", "request-method", 1764796830), wo = new X(null, "forms", "forms", 2045992350), xo = new X(null, "dom", "dom", -1236537922), yo = new X(null, "cmd-chan", "cmd-chan", -1229050306), zo = new F(null, "meta62271", "meta62271",
-622146818, null), Ao = new X(null, "ps", "ps", 292358046), bg = new F(null, "meta59450", "meta59450", 1449762847, null), Bo = new F(null, "k-\x3es", "k-\x3es", -1685112801, null), Co = new X(null, "codemirror-options-in", "codemirror-options-in", -1261564801), Do = new X("cljs.spec", "kvs-\x3emap", "cljs.spec/kvs-\x3emap", -1189105441), Eo = new X(null, "compiledCode", "compiledCode", -1391179489), Fo = new X("klipse.plugin", "dom-element", "klipse.plugin/dom-element", -271611585), Go = new X(null,
"html", "html", -998796897), Ho = new X(null, "accept", "accept", 1874130431), Io = new X(null, "opt", "opt", -794706369), Jo = new X(null, "text", "text", -1790561697), Ko = new F(null, "pred-forms", "pred-forms", 1813143359, null), Lo = new F(null, "f", "f", 43394975, null);
function Mo(a, b) {
  for (var c = new hb, d = x(b);;) {
    if (null != d) {
      c.append("" + E(I(d))), d = K(d), null != d && c.append(a);
    } else {
      return c.toString();
    }
  }
}
function No(a) {
  return 2 > P(a) ? a.toUpperCase() : [E(a.substring(0, 1).toUpperCase()), E(a.substring(1).toLowerCase())].join("");
}
function Oo(a, b) {
  if (0 >= b || b >= 2 + P(a)) {
    return Ce.j(dh(ve("", wg.j(E, x(a)))), "");
  }
  if (z(of ? hd(1, b) : nf.call(null, 1, b))) {
    return new V(null, 1, 5, W, [a], null);
  }
  if (z(of ? hd(2, b) : nf.call(null, 2, b))) {
    return new V(null, 2, 5, W, ["", a], null);
  }
  var c = b - 2;
  return Ce.j(dh(ve("", gh(dh(wg.j(E, x(a))), 0, c))), a.substring(c));
}
function Po(a, b) {
  return Qo(a, b, 0);
}
function Qo(a, b, c) {
  if ("/(?:)/" === "" + E(b)) {
    b = Oo(a, c);
  } else {
    if (1 > c) {
      b = dh(("" + E(a)).split(b));
    } else {
      a: {
        for (var d = c, e = De;;) {
          if (1 === d) {
            b = Ce.j(e, a);
            break a;
          }
          var f = Oi(b, a);
          if (null != f) {
            var g = a.indexOf(f), f = a.substring(g + P(f)), d = d - 1, e = Ce.j(e, a.substring(0, g));
            a = f;
          } else {
            b = Ce.j(e, a);
            break a;
          }
        }
      }
    }
  }
  if (0 === c && 1 < P(b)) {
    a: {
      for (c = b;;) {
        if ("" === (null == c ? null : Uc(c))) {
          c = null == c ? null : Vc(c);
        } else {
          break a;
        }
      }
    }
  } else {
    c = b;
  }
  return c;
}
function Ro(a) {
  return Ba(a);
}
function So(a) {
  return Aa(La(a));
}
;function To(a) {
  return Ig.j(cg, Fg(hg.j(lc, Be), a));
}
;if ("undefined" === typeof Uo) {
  var Uo, Vo = cg;
  Uo = pg ? pg(Vo) : og.call(null, Vo);
}
if ("undefined" === typeof Wo) {
  var Wo = new q(null, 4, [yl, 50, kn, 1E3, tl, 5, mk, 10], null)
}
;hc();
var Xo = S([yl, 100], 0), Yo = null != Xo && (Xo.v & 64 || Xo.R) ? Rf(qg, Xo) : Xo, Wo = Ai.A(S([Wo, Yo], 0));
console.info("KLIPSE version:", "3.2.1");
function Zo(a) {
  if (a.Hb && "function" == typeof a.Hb) {
    return a.Hb();
  }
  if (ha(a)) {
    return a.split("");
  }
  if (ga(a)) {
    for (var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d]);
    }
    return b;
  }
  return Pa(a);
}
function $o(a, b, c) {
  if (a.forEach && "function" == typeof a.forEach) {
    a.forEach(b, c);
  } else {
    if (ga(a) || ha(a)) {
      ob(a, b, c);
    } else {
      var d;
      if (a.rb && "function" == typeof a.rb) {
        d = a.rb();
      } else {
        if (a.Hb && "function" == typeof a.Hb) {
          d = void 0;
        } else {
          if (ga(a) || ha(a)) {
            d = [];
            for (var e = a.length, f = 0;f < e;f++) {
              d.push(f);
            }
          } else {
            d = Qa(a);
          }
        }
      }
      for (var e = Zo(a), f = e.length, g = 0;g < f;g++) {
        b.call(c, e[g], d && d[g], a);
      }
    }
  }
}
;function ap(a, b) {
  this.Tb = {};
  this.$a = [];
  this.pa = 0;
  var c = arguments.length;
  if (1 < c) {
    if (c % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1]);
    }
  } else {
    a && this.addAll(a);
  }
}
h = ap.prototype;
h.Jf = function() {
  return this.pa;
};
h.Hb = function() {
  bp(this);
  for (var a = [], b = 0;b < this.$a.length;b++) {
    a.push(this.Tb[this.$a[b]]);
  }
  return a;
};
h.rb = function() {
  bp(this);
  return this.$a.concat();
};
h.xd = function(a) {
  return cp(this.Tb, a);
};
h.eb = function(a, b) {
  if (this === a) {
    return !0;
  }
  if (this.pa != a.Jf()) {
    return !1;
  }
  var c = b || dp;
  bp(this);
  for (var d, e = 0;d = this.$a[e];e++) {
    if (!c(this.get(d), a.get(d))) {
      return !1;
    }
  }
  return !0;
};
function dp(a, b) {
  return a === b;
}
h.Re = function() {
  return 0 == this.pa;
};
h.clear = function() {
  this.Tb = {};
  this.pa = this.$a.length = 0;
};
h.remove = function(a) {
  return cp(this.Tb, a) ? (delete this.Tb[a], this.pa--, this.$a.length > 2 * this.pa && bp(this), !0) : !1;
};
function bp(a) {
  if (a.pa != a.$a.length) {
    for (var b = 0, c = 0;b < a.$a.length;) {
      var d = a.$a[b];
      cp(a.Tb, d) && (a.$a[c++] = d);
      b++;
    }
    a.$a.length = c;
  }
  if (a.pa != a.$a.length) {
    for (var e = {}, c = b = 0;b < a.$a.length;) {
      d = a.$a[b], cp(e, d) || (a.$a[c++] = d, e[d] = 1), b++;
    }
    a.$a.length = c;
  }
}
h.get = function(a, b) {
  return cp(this.Tb, a) ? this.Tb[a] : b;
};
h.set = function(a, b) {
  cp(this.Tb, a) || (this.pa++, this.$a.push(a));
  this.Tb[a] = b;
};
h.addAll = function(a) {
  var b;
  a instanceof ap ? (b = a.rb(), a = a.Hb()) : (b = Qa(a), a = Pa(a));
  for (var c = 0;c < b.length;c++) {
    this.set(b[c], a[c]);
  }
};
h.forEach = function(a, b) {
  for (var c = this.rb(), d = 0;d < c.length;d++) {
    var e = c[d], f = this.get(e);
    a.call(b, f, e, this);
  }
};
h.clone = function() {
  return new ap(this);
};
function cp(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
}
;var ep = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;
function fp(a, b) {
  if (a) {
    for (var c = a.split("\x26"), d = 0;d < c.length;d++) {
      var e = c[d].indexOf("\x3d"), f = null, g = null;
      0 <= e ? (f = c[d].substring(0, e), g = c[d].substring(e + 1)) : f = c[d];
      b(f, g ? decodeURIComponent(g.replace(/\+/g, " ")) : "");
    }
  }
}
;function gp(a, b) {
  this.ac = this.wc = this.Wb = "";
  this.sc = null;
  this.mc = this.Vb = "";
  this.wb = this.Gg = !1;
  var c;
  if (a instanceof gp) {
    this.wb = ca(b) ? b : a.wb, hp(this, a.Wb), c = a.wc, ip(this), this.wc = c, jp(this, a.ac), kp(this, a.sc), lp(this, a.Vb), mp(this, a.yb.clone()), c = a.mc, ip(this), this.mc = c;
  } else {
    if (a && (c = String(a).match(ep))) {
      this.wb = !!b;
      hp(this, c[1] || "", !0);
      var d = c[2] || "";
      ip(this);
      this.wc = np(d);
      jp(this, c[3] || "", !0);
      kp(this, c[4]);
      lp(this, c[5] || "", !0);
      mp(this, c[6] || "", !0);
      c = c[7] || "";
      ip(this);
      this.mc = np(c);
    } else {
      this.wb = !!b, this.yb = new pp(null, 0, this.wb);
    }
  }
}
gp.prototype.toString = function() {
  var a = [], b = this.Wb;
  b && a.push(qp(b, rp, !0), ":");
  var c = this.ac;
  if (c || "file" == b) {
    a.push("//"), (b = this.wc) && a.push(qp(b, rp, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.sc, null != c && a.push(":", String(c));
  }
  if (c = this.Vb) {
    this.ac && "/" != c.charAt(0) && a.push("/"), a.push(qp(c, "/" == c.charAt(0) ? sp : tp, !0));
  }
  (c = this.yb.toString()) && a.push("?", c);
  (c = this.mc) && a.push("#", qp(c, up));
  return a.join("");
};
gp.prototype.resolve = function(a) {
  var b = this.clone(), c = !!a.Wb;
  c ? hp(b, a.Wb) : c = !!a.wc;
  if (c) {
    var d = a.wc;
    ip(b);
    b.wc = d;
  } else {
    c = !!a.ac;
  }
  c ? jp(b, a.ac) : c = null != a.sc;
  d = a.Vb;
  if (c) {
    kp(b, a.sc);
  } else {
    if (c = !!a.Vb) {
      if ("/" != d.charAt(0)) {
        if (this.ac && !this.Vb) {
          d = "/" + d;
        } else {
          var e = b.Vb.lastIndexOf("/");
          -1 != e && (d = b.Vb.substr(0, e + 1) + d);
        }
      }
      e = d;
      if (".." == e || "." == e) {
        d = "";
      } else {
        if (-1 != e.indexOf("./") || -1 != e.indexOf("/.")) {
          for (var d = 0 == e.lastIndexOf("/", 0), e = e.split("/"), f = [], g = 0;g < e.length;) {
            var k = e[g++];
            "." == k ? d && g == e.length && f.push("") : ".." == k ? ((1 < f.length || 1 == f.length && "" != f[0]) && f.pop(), d && g == e.length && f.push("")) : (f.push(k), d = !0);
          }
          d = f.join("/");
        } else {
          d = e;
        }
      }
    }
  }
  c ? lp(b, d) : c = "" !== a.yb.toString();
  c ? mp(b, np(a.yb.toString())) : c = !!a.mc;
  c && (a = a.mc, ip(b), b.mc = a);
  return b;
};
gp.prototype.clone = function() {
  return new gp(this);
};
function hp(a, b, c) {
  ip(a);
  a.Wb = c ? np(b, !0) : b;
  a.Wb && (a.Wb = a.Wb.replace(/:$/, ""));
}
function jp(a, b, c) {
  ip(a);
  a.ac = c ? np(b, !0) : b;
}
function kp(a, b) {
  ip(a);
  if (b) {
    b = Number(b);
    if (isNaN(b) || 0 > b) {
      throw Error("Bad port number " + b);
    }
    a.sc = b;
  } else {
    a.sc = null;
  }
}
function lp(a, b, c) {
  ip(a);
  a.Vb = c ? np(b, !0) : b;
}
function mp(a, b, c) {
  ip(a);
  b instanceof pp ? (a.yb = b, a.yb.bf(a.wb)) : (c || (b = qp(b, vp)), a.yb = new pp(b, 0, a.wb));
}
function wp(a, b, c) {
  ip(a);
  fa(c) || (c = [String(c)]);
  xp(a.yb, b, c);
}
function ip(a) {
  if (a.Gg) {
    throw Error("Tried to modify a read-only Uri");
  }
}
gp.prototype.bf = function(a) {
  this.wb = a;
  this.yb && this.yb.bf(a);
  return this;
};
function np(a, b) {
  return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
}
function qp(a, b, c) {
  return ha(a) ? (a = encodeURI(a).replace(b, yp), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
}
function yp(a) {
  a = a.charCodeAt(0);
  return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
}
var rp = /[#\/\?@]/g, tp = /[\#\?:]/g, sp = /[\#\?]/g, vp = /[\#\?@]/g, up = /#/g;
function pp(a, b, c) {
  this.pa = this.ya = null;
  this.qb = a || null;
  this.wb = !!c;
}
function zp(a) {
  a.ya || (a.ya = new ap, a.pa = 0, a.qb && fp(a.qb, function(b, c) {
    a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
  }));
}
h = pp.prototype;
h.Jf = function() {
  zp(this);
  return this.pa;
};
h.add = function(a, b) {
  zp(this);
  this.qb = null;
  a = Ap(this, a);
  var c = this.ya.get(a);
  c || this.ya.set(a, c = []);
  c.push(b);
  this.pa += 1;
  return this;
};
h.remove = function(a) {
  zp(this);
  a = Ap(this, a);
  return this.ya.xd(a) ? (this.qb = null, this.pa -= this.ya.get(a).length, this.ya.remove(a)) : !1;
};
h.clear = function() {
  this.ya = this.qb = null;
  this.pa = 0;
};
h.Re = function() {
  zp(this);
  return 0 == this.pa;
};
h.xd = function(a) {
  zp(this);
  a = Ap(this, a);
  return this.ya.xd(a);
};
h.rb = function() {
  zp(this);
  for (var a = this.ya.Hb(), b = this.ya.rb(), c = [], d = 0;d < b.length;d++) {
    for (var e = a[d], f = 0;f < e.length;f++) {
      c.push(b[d]);
    }
  }
  return c;
};
h.Hb = function(a) {
  zp(this);
  var b = [];
  if (ha(a)) {
    this.xd(a) && (b = tb(b, this.ya.get(Ap(this, a))));
  } else {
    a = this.ya.Hb();
    for (var c = 0;c < a.length;c++) {
      b = tb(b, a[c]);
    }
  }
  return b;
};
h.set = function(a, b) {
  zp(this);
  this.qb = null;
  a = Ap(this, a);
  this.xd(a) && (this.pa -= this.ya.get(a).length);
  this.ya.set(a, [b]);
  this.pa += 1;
  return this;
};
h.get = function(a, b) {
  var c = a ? this.Hb(a) : [];
  return 0 < c.length ? String(c[0]) : b;
};
function xp(a, b, c) {
  a.remove(b);
  0 < c.length && (a.qb = null, a.ya.set(Ap(a, b), ub(c)), a.pa += c.length);
}
h.toString = function() {
  if (this.qb) {
    return this.qb;
  }
  if (!this.ya) {
    return "";
  }
  for (var a = [], b = this.ya.rb(), c = 0;c < b.length;c++) {
    for (var d = b[c], e = encodeURIComponent(String(d)), d = this.Hb(d), f = 0;f < d.length;f++) {
      var g = e;
      "" !== d[f] && (g += "\x3d" + encodeURIComponent(String(d[f])));
      a.push(g);
    }
  }
  return this.qb = a.join("\x26");
};
h.clone = function() {
  var a = new pp;
  a.qb = this.qb;
  this.ya && (a.ya = this.ya.clone(), a.pa = this.pa);
  return a;
};
function Ap(a, b) {
  var c = String(b);
  a.wb && (c = c.toLowerCase());
  return c;
}
h.bf = function(a) {
  a && !this.wb && (zp(this), this.qb = null, this.ya.forEach(function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), xp(this, d, a));
  }, this));
  this.wb = a;
};
h.extend = function(a) {
  for (var b = 0;b < arguments.length;b++) {
    $o(arguments[b], function(a, b) {
      this.add(b, a);
    }, this);
  }
};
function Bp(a) {
  a.prototype.then = a.prototype.then;
  a.prototype.$goog_Thenable = !0;
}
function Cp(a) {
  if (!a) {
    return !1;
  }
  try {
    return !!a.$goog_Thenable;
  } catch (b) {
    return !1;
  }
}
;function Dp(a, b, c) {
  this.Kg = c;
  this.Ag = a;
  this.oh = b;
  this.ie = 0;
  this.fe = null;
}
Dp.prototype.get = function() {
  var a;
  0 < this.ie ? (this.ie--, a = this.fe, this.fe = a.next, a.next = null) : a = this.Ag();
  return a;
};
Dp.prototype.put = function(a) {
  this.oh(a);
  this.ie < this.Kg && (this.ie++, a.next = this.fe, this.fe = a);
};
function Ep() {
  this.se = this.ed = null;
}
var Gp = new Dp(function() {
  return new Fp;
}, function(a) {
  a.reset();
}, 100);
Ep.prototype.add = function(a, b) {
  var c = Gp.get();
  c.set(a, b);
  this.se ? this.se.next = c : this.ed = c;
  this.se = c;
};
Ep.prototype.remove = function() {
  var a = null;
  this.ed && (a = this.ed, this.ed = this.ed.next, this.ed || (this.se = null), a.next = null);
  return a;
};
function Fp() {
  this.next = this.scope = this.Sb = null;
}
Fp.prototype.set = function(a, b) {
  this.Sb = a;
  this.scope = b;
  this.next = null;
};
Fp.prototype.reset = function() {
  this.next = this.scope = this.Sb = null;
};
var Hp;
a: {
  var Ip = ba.navigator;
  if (Ip) {
    var Jp = Ip.userAgent;
    if (Jp) {
      Hp = Jp;
      break a;
    }
  }
  Hp = "";
}
function Kp(a) {
  return -1 != Hp.indexOf(a);
}
;function Lp() {
  return (Kp("Chrome") || Kp("CriOS")) && !Kp("Edge");
}
;function Mp(a) {
  ba.setTimeout(function() {
    throw a;
  }, 0);
}
function Np(a) {
  !ia(ba.setImmediate) || ba.Window && ba.Window.prototype && !Kp("Edge") && ba.Window.prototype.setImmediate == ba.setImmediate ? (Op || (Op = Pp()), Op(a)) : ba.setImmediate(a);
}
var Op;
function Pp() {
  var a = ba.MessageChannel;
  "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !Kp("Presto") && (a = function() {
    var a = document.createElement("IFRAME");
    a.style.display = "none";
    a.src = "";
    document.documentElement.appendChild(a);
    var b = a.contentWindow, a = b.document;
    a.open();
    a.write("");
    a.close();
    var c = "callImmediate" + Math.random(), d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host, a = ra(function(a) {
      if (("*" == d || a.origin == d) && a.data == c) {
        this.port1.onmessage();
      }
    }, this);
    b.addEventListener("message", a, !1);
    this.port1 = {};
    this.port2 = {postMessage:function() {
      b.postMessage(c, d);
    }};
  });
  if ("undefined" !== typeof a && !Kp("Trident") && !Kp("MSIE")) {
    var b = new a, c = {}, d = c;
    b.port1.onmessage = function() {
      if (ca(c.next)) {
        c = c.next;
        var a = c.jd;
        c.jd = null;
        a();
      }
    };
    return function(a) {
      d.next = {jd:a};
      d = d.next;
      b.port2.postMessage(0);
    };
  }
  return "undefined" !== typeof document && "onreadystatechange" in document.createElement("SCRIPT") ? function(a) {
    var b = document.createElement("SCRIPT");
    b.onreadystatechange = function() {
      b.onreadystatechange = null;
      b.parentNode.removeChild(b);
      b = null;
      a();
      a = null;
    };
    document.documentElement.appendChild(b);
  } : function(a) {
    ba.setTimeout(a, 0);
  };
}
;function Qp(a, b) {
  Rp || Sp();
  Tp || (Rp(), Tp = !0);
  Up.add(a, b);
}
var Rp;
function Sp() {
  if (ba.Promise && ba.Promise.resolve) {
    var a = ba.Promise.resolve(void 0);
    Rp = function() {
      a.then(Vp);
    };
  } else {
    Rp = function() {
      Np(Vp);
    };
  }
}
var Tp = !1, Up = new Ep;
function Vp() {
  for (var a = null;a = Up.remove();) {
    try {
      a.Sb.call(a.scope);
    } catch (b) {
      Mp(b);
    }
    Gp.put(a);
  }
  Tp = !1;
}
;function Wp(a, b) {
  this.Nb = Xp;
  this.dc = void 0;
  this.Qc = this.jc = this.Ua = null;
  this.ee = this.Ke = !1;
  if (a != da) {
    try {
      var c = this;
      a.call(b, function(a) {
        Yp(c, Zp, a);
      }, function(a) {
        if (!(a instanceof $p)) {
          try {
            if (a instanceof Error) {
              throw a;
            }
            throw Error("Promise rejected.");
          } catch (b) {
          }
        }
        Yp(c, aq, a);
      });
    } catch (d) {
      Yp(this, aq, d);
    }
  }
}
var Xp = 0, Zp = 2, aq = 3;
function bq() {
  this.next = this.context = this.ad = this.Ld = this.yc = null;
  this.Rd = !1;
}
bq.prototype.reset = function() {
  this.context = this.ad = this.Ld = this.yc = null;
  this.Rd = !1;
};
var cq = new Dp(function() {
  return new bq;
}, function(a) {
  a.reset();
}, 100);
function dq(a, b, c) {
  var d = cq.get();
  d.Ld = a;
  d.ad = b;
  d.context = c;
  return d;
}
Wp.prototype.then = function(a, b, c) {
  return eq(this, ia(a) ? a : null, ia(b) ? b : null, c);
};
Bp(Wp);
Wp.prototype.cancel = function(a) {
  this.Nb == Xp && Qp(function() {
    var b = new $p(a);
    fq(this, b);
  }, this);
};
function fq(a, b) {
  if (a.Nb == Xp) {
    if (a.Ua) {
      var c = a.Ua;
      if (c.jc) {
        for (var d = 0, e = null, f = null, g = c.jc;g && (g.Rd || (d++, g.yc == a && (e = g), !(e && 1 < d)));g = g.next) {
          e || (f = g);
        }
        e && (c.Nb == Xp && 1 == d ? fq(c, b) : (f ? (d = f, d.next == c.Qc && (c.Qc = d), d.next = d.next.next) : gq(c), hq(c, e, aq, b)));
      }
      a.Ua = null;
    } else {
      Yp(a, aq, b);
    }
  }
}
function iq(a, b) {
  a.jc || a.Nb != Zp && a.Nb != aq || jq(a);
  a.Qc ? a.Qc.next = b : a.jc = b;
  a.Qc = b;
}
function eq(a, b, c, d) {
  var e = dq(null, null, null);
  e.yc = new Wp(function(a, g) {
    e.Ld = b ? function(c) {
      try {
        var e = b.call(d, c);
        a(e);
      } catch (n) {
        g(n);
      }
    } : a;
    e.ad = c ? function(b) {
      try {
        var e = c.call(d, b);
        !ca(e) && b instanceof $p ? g(b) : a(e);
      } catch (n) {
        g(n);
      }
    } : g;
  });
  e.yc.Ua = a;
  iq(a, e);
  return e.yc;
}
Wp.prototype.rh = function(a) {
  this.Nb = Xp;
  Yp(this, Zp, a);
};
Wp.prototype.sh = function(a) {
  this.Nb = Xp;
  Yp(this, aq, a);
};
function Yp(a, b, c) {
  if (a.Nb == Xp) {
    a === c && (b = aq, c = new TypeError("Promise cannot resolve to itself"));
    a.Nb = 1;
    var d;
    a: {
      var e = c, f = a.rh, g = a.sh;
      if (e instanceof Wp) {
        iq(e, dq(f || da, g || null, a)), d = !0;
      } else {
        if (Cp(e)) {
          e.then(f, g, a), d = !0;
        } else {
          if (ja(e)) {
            try {
              var k = e.then;
              if (ia(k)) {
                kq(e, k, f, g, a);
                d = !0;
                break a;
              }
            } catch (l) {
              g.call(a, l);
              d = !0;
              break a;
            }
          }
          d = !1;
        }
      }
    }
    d || (a.dc = c, a.Nb = b, a.Ua = null, jq(a), b != aq || c instanceof $p || lq(a, c));
  }
}
function kq(a, b, c, d, e) {
  function f(a) {
    k || (k = !0, d.call(e, a));
  }
  function g(a) {
    k || (k = !0, c.call(e, a));
  }
  var k = !1;
  try {
    b.call(a, g, f);
  } catch (l) {
    f(l);
  }
}
function jq(a) {
  a.Ke || (a.Ke = !0, Qp(a.Dg, a));
}
function gq(a) {
  var b = null;
  a.jc && (b = a.jc, a.jc = b.next, b.next = null);
  a.jc || (a.Qc = null);
  return b;
}
Wp.prototype.Dg = function() {
  for (var a = null;a = gq(this);) {
    hq(this, a, this.Nb, this.dc);
  }
  this.Ke = !1;
};
function hq(a, b, c, d) {
  if (c == aq && b.ad && !b.Rd) {
    for (;a && a.ee;a = a.Ua) {
      a.ee = !1;
    }
  }
  if (b.yc) {
    b.yc.Ua = null, mq(b, c, d);
  } else {
    try {
      b.Rd ? b.Ld.call(b.context) : mq(b, c, d);
    } catch (e) {
      nq.call(null, e);
    }
  }
  cq.put(b);
}
function mq(a, b, c) {
  b == Zp ? a.Ld.call(a.context, c) : a.ad && a.ad.call(a.context, c);
}
function lq(a, b) {
  a.ee = !0;
  Qp(function() {
    a.ee && nq.call(null, b);
  });
}
var nq = Mp;
function $p(a) {
  ib.call(this, a);
}
ya($p, ib);
$p.prototype.name = "cancel";
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function oq(a, b) {
  this.me = [];
  this.Qf = a;
  this.Ff = b || null;
  this.Bd = this.Wc = !1;
  this.dc = void 0;
  this.cf = this.fg = this.xe = !1;
  this.pe = 0;
  this.Ua = null;
  this.ye = 0;
}
oq.prototype.cancel = function(a) {
  if (this.Wc) {
    this.dc instanceof oq && this.dc.cancel();
  } else {
    if (this.Ua) {
      var b = this.Ua;
      delete this.Ua;
      a ? b.cancel(a) : (b.ye--, 0 >= b.ye && b.cancel());
    }
    this.Qf ? this.Qf.call(this.Ff, this) : this.cf = !0;
    this.Wc || (a = new pq, qq(this), rq(this, !1, a));
  }
};
oq.prototype.Df = function(a, b) {
  this.xe = !1;
  rq(this, a, b);
};
function rq(a, b, c) {
  a.Wc = !0;
  a.dc = c;
  a.Bd = !b;
  sq(a);
}
function qq(a) {
  if (a.Wc) {
    if (!a.cf) {
      throw new tq;
    }
    a.cf = !1;
  }
}
function uq(a, b, c, d) {
  a.me.push([b, c, d]);
  a.Wc && sq(a);
}
oq.prototype.then = function(a, b, c) {
  var d, e, f = new Wp(function(a, b) {
    d = a;
    e = b;
  });
  uq(this, d, function(a) {
    a instanceof pq ? f.cancel() : e(a);
  });
  return f.then(a, b, c);
};
Bp(oq);
function vq(a) {
  return pb(a.me, function(a) {
    return ia(a[1]);
  });
}
function sq(a) {
  if (a.pe && a.Wc && vq(a)) {
    var b = a.pe, c = wq[b];
    c && (ba.clearTimeout(c.Fc), delete wq[b]);
    a.pe = 0;
  }
  a.Ua && (a.Ua.ye--, delete a.Ua);
  for (var b = a.dc, d = c = !1;a.me.length && !a.xe;) {
    var e = a.me.shift(), f = e[0], g = e[1], e = e[2];
    if (f = a.Bd ? g : f) {
      try {
        var k = f.call(e || a.Ff, b);
        ca(k) && (a.Bd = a.Bd && (k == b || k instanceof Error), a.dc = b = k);
        if (Cp(b) || "function" === typeof ba.Promise && b instanceof ba.Promise) {
          d = !0, a.xe = !0;
        }
      } catch (l) {
        b = l, a.Bd = !0, vq(a) || (c = !0);
      }
    }
  }
  a.dc = b;
  d && (k = ra(a.Df, a, !0), d = ra(a.Df, a, !1), b instanceof oq ? (uq(b, k, d), b.fg = !0) : b.then(k, d));
  c && (b = new xq(b), wq[b.Fc] = b, a.pe = b.Fc);
}
function tq() {
  ib.call(this);
}
ya(tq, ib);
tq.prototype.message = "Deferred has already fired";
tq.prototype.name = "AlreadyCalledError";
function pq() {
  ib.call(this);
}
ya(pq, ib);
pq.prototype.message = "Deferred was canceled";
pq.prototype.name = "CanceledError";
function xq(a) {
  this.Fc = ba.setTimeout(ra(this.qh, this), 0);
  this.ae = a;
}
xq.prototype.qh = function() {
  delete wq[this.Fc];
  throw this.ae;
};
var wq = {};
function yq() {
  return Kp("iPhone") && !Kp("iPod") && !Kp("iPad");
}
;var zq = Kp("Opera"), Aq = Kp("Trident") || Kp("MSIE"), Bq = Kp("Edge"), Cq = Kp("Gecko") && !(-1 != Hp.toLowerCase().indexOf("webkit") && !Kp("Edge")) && !(Kp("Trident") || Kp("MSIE")) && !Kp("Edge"), Dq = -1 != Hp.toLowerCase().indexOf("webkit") && !Kp("Edge");
Dq && Kp("Mobile");
Kp("Macintosh");
Kp("Windows");
Kp("Linux") || Kp("CrOS");
var Eq = ba.navigator || null;
Eq && (Eq.appVersion || "").indexOf("X11");
Kp("Android");
yq();
Kp("iPad");
Kp("iPod");
function Fq() {
  var a = ba.document;
  return a ? a.documentMode : void 0;
}
var Gq;
a: {
  var Hq = "", Iq = function() {
    var a = Hp;
    if (Cq) {
      return /rv\:([^\);]+)(\)|;)/.exec(a);
    }
    if (Bq) {
      return /Edge\/([\d\.]+)/.exec(a);
    }
    if (Aq) {
      return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
    }
    if (Dq) {
      return /WebKit\/(\S+)/.exec(a);
    }
    if (zq) {
      return /(?:Version)[ \/]?(\S+)/.exec(a);
    }
  }();
  Iq && (Hq = Iq ? Iq[1] : "");
  if (Aq) {
    var Jq = Fq();
    if (null != Jq && Jq > parseFloat(Hq)) {
      Gq = String(Jq);
      break a;
    }
  }
  Gq = Hq;
}
var Kq = {};
function Lq(a) {
  var b;
  if (!(b = Kq[a])) {
    b = 0;
    for (var c = Ba(String(Gq)).split("."), d = Ba(String(a)).split("."), e = Math.max(c.length, d.length), f = 0;0 == b && f < e;f++) {
      var g = c[f] || "", k = d[f] || "", l = RegExp("(\\d*)(\\D*)", "g"), n = RegExp("(\\d*)(\\D*)", "g");
      do {
        var m = l.exec(g) || ["", "", ""], r = n.exec(k) || ["", "", ""];
        if (0 == m[0].length && 0 == r[0].length) {
          break;
        }
        b = Ma(0 == m[1].length ? 0 : parseInt(m[1], 10), 0 == r[1].length ? 0 : parseInt(r[1], 10)) || Ma(0 == m[2].length, 0 == r[2].length) || Ma(m[2], r[2]);
      } while (0 == b);
    }
    b = Kq[a] = 0 <= b;
  }
  return b;
}
var Mq = ba.document, Nq = Mq && Aq ? Fq() || ("CSS1Compat" == Mq.compatMode ? parseInt(Gq, 10) : 5) : void 0;
var Oq = !Aq || 9 <= Number(Nq);
!Cq && !Aq || Aq && 9 <= Number(Nq) || Cq && Lq("1.9.1");
Aq && Lq("9");
function Pq(a, b) {
  Na(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : Qq.hasOwnProperty(d) ? a.setAttribute(Qq[d], b) : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0) ? a.setAttribute(d, b) : a[d] = b;
  });
}
var Qq = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", nonce:"nonce", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
function Rq(a, b, c) {
  var d = arguments, e = document, f = d[0], g = d[1];
  if (!Oq && g && (g.name || g.type)) {
    f = ["\x3c", f];
    g.name && f.push(' name\x3d"', Ca(g.name), '"');
    if (g.type) {
      f.push(' type\x3d"', Ca(g.type), '"');
      var k = {};
      Ua(k, g);
      delete k.type;
      g = k;
    }
    f.push("\x3e");
    f = f.join("");
  }
  f = e.createElement(f);
  g && (ha(g) ? f.className = g : fa(g) ? f.className = g.join(" ") : Pq(f, g));
  2 < d.length && Sq(e, f, d);
  return f;
}
function Sq(a, b, c) {
  function d(c) {
    c && b.appendChild(ha(c) ? a.createTextNode(c) : c);
  }
  for (var e = 2;e < c.length;e++) {
    var f = c[e];
    !ga(f) || ja(f) && 0 < f.nodeType ? d(f) : ob(Tq(f) ? ub(f) : f, d);
  }
}
function Uq(a, b) {
  if ("textContent" in a) {
    a.textContent = b;
  } else {
    if (3 == a.nodeType) {
      a.data = b;
    } else {
      if (a.firstChild && 3 == a.firstChild.nodeType) {
        for (;a.lastChild != a.firstChild;) {
          a.removeChild(a.lastChild);
        }
        a.firstChild.data = b;
      } else {
        for (var c;c = a.firstChild;) {
          a.removeChild(c);
        }
        a.appendChild((9 == a.nodeType ? a : a.ownerDocument || a.document).createTextNode(String(b)));
      }
    }
  }
}
function Tq(a) {
  if (a && "number" == typeof a.length) {
    if (ja(a)) {
      return "function" == typeof a.item || "string" == typeof a.item;
    }
    if (ia(a)) {
      return "function" == typeof a.item;
    }
  }
  return !1;
}
;function Vq(a, b) {
  var c = b || {}, d = c.document || document, e = document.createElement("SCRIPT"), f = {Yf:e, vc:void 0}, g = new oq(Wq, f), k = null, l = null != c.timeout ? c.timeout : 5E3;
  0 < l && (k = window.setTimeout(function() {
    Xq(e, !0);
    var b = new Yq(Zq, "Timeout reached for loading script " + a);
    qq(g);
    rq(g, !1, b);
  }, l), f.vc = k);
  e.onload = e.onreadystatechange = function() {
    e.readyState && "loaded" != e.readyState && "complete" != e.readyState || (Xq(e, c.jg || !1, k), qq(g), rq(g, !0, null));
  };
  e.onerror = function() {
    Xq(e, !0, k);
    var b = new Yq($q, "Error while loading script " + a);
    qq(g);
    rq(g, !1, b);
  };
  f = c.attributes || {};
  Ua(f, {type:"text/javascript", charset:"UTF-8", src:a});
  Pq(e, f);
  ar(d).appendChild(e);
  return g;
}
function ar(a) {
  var b = a.getElementsByTagName("HEAD");
  return b && 0 != b.length ? b[0] : a.documentElement;
}
function Wq() {
  if (this && this.Yf) {
    var a = this.Yf;
    a && "SCRIPT" == a.tagName && Xq(a, !0, this.vc);
  }
}
function Xq(a, b, c) {
  null != c && ba.clearTimeout(c);
  a.onload = da;
  a.onerror = da;
  a.onreadystatechange = da;
  b && window.setTimeout(function() {
    a && a.parentNode && a.parentNode.removeChild(a);
  }, 0);
}
var $q = 0, Zq = 1;
function Yq(a, b) {
  var c = "Jsloader error (code #" + a + ")";
  b && (c += ": " + b);
  ib.call(this, c);
  this.code = a;
}
ya(Yq, ib);
function br(a, b) {
  this.vh = new gp(a);
  this.ig = b ? b : "callback";
  this.vc = 5E3;
  this.Of = "";
}
var cr = 0;
br.prototype.send = function(a, b, c, d) {
  a = a || null;
  d = d || "_" + (cr++).toString(36) + ua().toString(36);
  var e = "_callbacks___" + d, f = this.vh.clone();
  if (a) {
    for (var g in a) {
      a.hasOwnProperty && !a.hasOwnProperty(g) || wp(f, g, a[g]);
    }
  }
  b && (ba[e] = dr(d, b), wp(f, this.ig, e));
  b = {timeout:this.vc, jg:!0};
  this.Of && (b.attributes = {nonce:this.Of});
  b = Vq(f.toString(), b);
  uq(b, null, er(d, a, c), void 0);
  return {Fc:d, Gf:b};
};
br.prototype.cancel = function(a) {
  a && (a.Gf && a.Gf.cancel(), a.Fc && fr(a.Fc, !1));
};
function er(a, b, c) {
  return function() {
    fr(a, !1);
    c && c(b);
  };
}
function dr(a, b) {
  return function(c) {
    fr(a, !0);
    b.apply(void 0, arguments);
  };
}
function fr(a, b) {
  var c = "_callbacks___" + a;
  if (ba[c]) {
    if (b) {
      try {
        delete ba[c];
      } catch (d) {
        ba[c] = void 0;
      }
    } else {
      ba[c] = da;
    }
  }
}
;function gr() {
  0 != hr && la(this);
  this.Ie = this.Ie;
  this.Zg = this.Zg;
}
var hr = 0;
gr.prototype.Ie = !1;
var ir = !Aq || 9 <= Number(Nq), jr = Aq && !Lq("9");
!Dq || Lq("528");
Cq && Lq("1.9b") || Aq && Lq("8") || zq && Lq("9.5") || Dq && Lq("528");
Cq && !Lq("8") || Aq && Lq("9");
function kr(a, b) {
  this.type = a;
  this.currentTarget = this.target = b;
  this.defaultPrevented = this.Kc = !1;
  this.Wf = !0;
}
kr.prototype.stopPropagation = function() {
  this.Kc = !0;
};
kr.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.Wf = !1;
};
function lr(a, b) {
  kr.call(this, a ? a.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.yd = this.state = null;
  a && this.Yc(a, b);
}
ya(lr, kr);
lr.prototype.Yc = function(a, b) {
  var c = this.type = a.type, d = a.changedTouches ? a.changedTouches[0] : null;
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var e = a.relatedTarget;
  if (e) {
    if (Cq) {
      var f;
      a: {
        try {
          yb(e.nodeName);
          f = !0;
          break a;
        } catch (g) {
        }
        f = !1;
      }
      f || (e = null);
    }
  } else {
    "mouseover" == c ? e = a.fromElement : "mouseout" == c && (e = a.toElement);
  }
  this.relatedTarget = e;
  null === d ? (this.offsetX = Dq || void 0 !== a.offsetX ? a.offsetX : a.layerX, this.offsetY = Dq || void 0 !== a.offsetY ? a.offsetY : a.layerY, this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0) : (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY ||
  0);
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.state = a.state;
  this.yd = a;
  a.defaultPrevented && this.preventDefault();
};
lr.prototype.stopPropagation = function() {
  lr.$f.stopPropagation.call(this);
  this.yd.stopPropagation ? this.yd.stopPropagation() : this.yd.cancelBubble = !0;
};
lr.prototype.preventDefault = function() {
  lr.$f.preventDefault.call(this);
  var a = this.yd;
  if (a.preventDefault) {
    a.preventDefault();
  } else {
    if (a.returnValue = !1, jr) {
      try {
        if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1;
        }
      } catch (b) {
      }
    }
  }
};
var mr = "closure_listenable_" + (1E6 * Math.random() | 0), nr = 0;
function or(a, b, c, d, e) {
  this.listener = a;
  this.ke = null;
  this.src = b;
  this.type = c;
  this.hd = !!d;
  this.jb = e;
  this.key = ++nr;
  this.bd = this.Td = !1;
}
function pr(a) {
  a.bd = !0;
  a.listener = null;
  a.ke = null;
  a.src = null;
  a.jb = null;
}
;function qr(a) {
  this.src = a;
  this.sb = {};
  this.oe = 0;
}
qr.prototype.add = function(a, b, c, d, e) {
  var f = a.toString();
  a = this.sb[f];
  a || (a = this.sb[f] = [], this.oe++);
  var g = rr(a, b, d, e);
  -1 < g ? (b = a[g], c || (b.Td = !1)) : (b = new or(b, this.src, f, !!d, e), b.Td = c, a.push(b));
  return b;
};
qr.prototype.remove = function(a, b, c, d) {
  a = a.toString();
  if (!(a in this.sb)) {
    return !1;
  }
  var e = this.sb[a];
  b = rr(e, b, c, d);
  return -1 < b ? (pr(e[b]), Array.prototype.splice.call(e, b, 1), 0 == e.length && (delete this.sb[a], this.oe--), !0) : !1;
};
function sr(a, b) {
  var c = b.type;
  if (c in a.sb) {
    var d = a.sb[c], e = nb(d, b), f;
    (f = 0 <= e) && Array.prototype.splice.call(d, e, 1);
    f && (pr(b), 0 == a.sb[c].length && (delete a.sb[c], a.oe--));
  }
}
qr.prototype.Ne = function(a, b, c, d) {
  a = this.sb[a.toString()];
  var e = -1;
  a && (e = rr(a, b, c, d));
  return -1 < e ? a[e] : null;
};
qr.prototype.hasListener = function(a, b) {
  var c = ca(a), d = c ? a.toString() : "", e = ca(b);
  return Oa(this.sb, function(a) {
    for (var g = 0;g < a.length;++g) {
      if (!(c && a[g].type != d || e && a[g].hd != b)) {
        return !0;
      }
    }
    return !1;
  });
};
function rr(a, b, c, d) {
  for (var e = 0;e < a.length;++e) {
    var f = a[e];
    if (!f.bd && f.listener == b && f.hd == !!c && f.jb == d) {
      return e;
    }
  }
  return -1;
}
;var tr = "closure_lm_" + (1E6 * Math.random() | 0), ur = {}, vr = 0;
function wr(a, b, c, d, e) {
  if (fa(b)) {
    for (var f = 0;f < b.length;f++) {
      wr(a, b[f], c, d, e);
    }
  } else {
    if (c = xr(c), a && a[mr]) {
      yr(a, b, c, d, e);
    } else {
      if (!b) {
        throw Error("Invalid event type");
      }
      var f = !!d, g = zr(a);
      g || (a[tr] = g = new qr(a));
      c = g.add(b, c, !1, d, e);
      if (!c.ke) {
        d = Ar();
        c.ke = d;
        d.src = a;
        d.listener = c;
        if (a.addEventListener) {
          a.addEventListener(b.toString(), d, f);
        } else {
          if (a.attachEvent) {
            a.attachEvent(Br(b.toString()), d);
          } else {
            throw Error("addEventListener and attachEvent are unavailable.");
          }
        }
        vr++;
      }
    }
  }
}
function Ar() {
  var a = Cr, b = ir ? function(c) {
    return a.call(b.src, b.listener, c);
  } : function(c) {
    c = a.call(b.src, b.listener, c);
    if (!c) {
      return c;
    }
  };
  return b;
}
function Dr(a, b, c, d, e) {
  if (fa(b)) {
    for (var f = 0;f < b.length;f++) {
      Dr(a, b[f], c, d, e);
    }
  } else {
    c = xr(c), a && a[mr] ? a.Cc.remove(String(b), c, d, e) : a && (a = zr(a)) && (b = a.Ne(b, c, !!d, e)) && Er(b);
  }
}
function Er(a) {
  if ("number" != typeof a && a && !a.bd) {
    var b = a.src;
    if (b && b[mr]) {
      sr(b.Cc, a);
    } else {
      var c = a.type, d = a.ke;
      b.removeEventListener ? b.removeEventListener(c, d, a.hd) : b.detachEvent && b.detachEvent(Br(c), d);
      vr--;
      (c = zr(b)) ? (sr(c, a), 0 == c.oe && (c.src = null, b[tr] = null)) : pr(a);
    }
  }
}
function Br(a) {
  return a in ur ? ur[a] : ur[a] = "on" + a;
}
function Fr(a, b, c, d) {
  var e = !0;
  if (a = zr(a)) {
    if (b = a.sb[b.toString()]) {
      for (b = b.concat(), a = 0;a < b.length;a++) {
        var f = b[a];
        f && f.hd == c && !f.bd && (f = Gr(f, d), e = e && !1 !== f);
      }
    }
  }
  return e;
}
function Gr(a, b) {
  var c = a.listener, d = a.jb || a.src;
  a.Td && Er(a);
  return c.call(d, b);
}
function Cr(a, b) {
  if (a.bd) {
    return !0;
  }
  if (!ir) {
    var c;
    if (!(c = b)) {
      a: {
        c = ["window", "event"];
        for (var d = ba, e;e = c.shift();) {
          if (null != d[e]) {
            d = d[e];
          } else {
            c = null;
            break a;
          }
        }
        c = d;
      }
    }
    e = c;
    c = new lr(e, this);
    d = !0;
    if (!(0 > e.keyCode || void 0 != e.returnValue)) {
      a: {
        var f = !1;
        if (0 == e.keyCode) {
          try {
            e.keyCode = -1;
            break a;
          } catch (l) {
            f = !0;
          }
        }
        if (f || void 0 == e.returnValue) {
          e.returnValue = !0;
        }
      }
      e = [];
      for (f = c.currentTarget;f;f = f.parentNode) {
        e.push(f);
      }
      for (var f = a.type, g = e.length - 1;!c.Kc && 0 <= g;g--) {
        c.currentTarget = e[g];
        var k = Fr(e[g], f, !0, c), d = d && k;
      }
      for (g = 0;!c.Kc && g < e.length;g++) {
        c.currentTarget = e[g], k = Fr(e[g], f, !1, c), d = d && k;
      }
    }
    return d;
  }
  return Gr(a, new lr(b, this));
}
function zr(a) {
  a = a[tr];
  return a instanceof qr ? a : null;
}
var Hr = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
function xr(a) {
  if (ia(a)) {
    return a;
  }
  a[Hr] || (a[Hr] = function(b) {
    return a.handleEvent(b);
  });
  return a[Hr];
}
;function Ir() {
  gr.call(this);
  this.Cc = new qr(this);
  this.cg = this;
  this.Tf = null;
}
ya(Ir, gr);
Ir.prototype[mr] = !0;
h = Ir.prototype;
h.addEventListener = function(a, b, c, d) {
  wr(this, a, b, c, d);
};
h.removeEventListener = function(a, b, c, d) {
  Dr(this, a, b, c, d);
};
h.dispatchEvent = function(a) {
  var b, c = this.Tf;
  if (c) {
    for (b = [];c;c = c.Tf) {
      b.push(c);
    }
  }
  var c = this.cg, d = a.type || a;
  if (ha(a)) {
    a = new kr(a, c);
  } else {
    if (a instanceof kr) {
      a.target = a.target || c;
    } else {
      var e = a;
      a = new kr(d, c);
      Ua(a, e);
    }
  }
  var e = !0, f;
  if (b) {
    for (var g = b.length - 1;!a.Kc && 0 <= g;g--) {
      f = a.currentTarget = b[g], e = Jr(f, d, !0, a) && e;
    }
  }
  a.Kc || (f = a.currentTarget = c, e = Jr(f, d, !0, a) && e, a.Kc || (e = Jr(f, d, !1, a) && e));
  if (b) {
    for (g = 0;!a.Kc && g < b.length;g++) {
      f = a.currentTarget = b[g], e = Jr(f, d, !1, a) && e;
    }
  }
  return e;
};
function yr(a, b, c, d, e) {
  a.Cc.add(String(b), c, !1, d, e);
}
function Jr(a, b, c, d) {
  b = a.Cc.sb[String(b)];
  if (!b) {
    return !0;
  }
  b = b.concat();
  for (var e = !0, f = 0;f < b.length;++f) {
    var g = b[f];
    if (g && !g.bd && g.hd == c) {
      var k = g.listener, l = g.jb || g.src;
      g.Td && sr(a.Cc, g);
      e = !1 !== k.call(l, d) && e;
    }
  }
  return e && 0 != d.Wf;
}
h.Ne = function(a, b, c, d) {
  return this.Cc.Ne(String(a), b, c, d);
};
h.hasListener = function(a, b) {
  return this.Cc.hasListener(ca(a) ? String(a) : void 0, b);
};
function Kr(a, b, c) {
  if (ia(a)) {
    c && (a = ra(a, c));
  } else {
    if (a && "function" == typeof a.handleEvent) {
      a = ra(a.handleEvent, a);
    } else {
      throw Error("Invalid listener argument");
    }
  }
  return 2147483647 < Number(b) ? -1 : ba.setTimeout(a, b || 0);
}
;function Lr(a, b, c, d, e) {
  this.reset(a, b, c, d, e);
}
Lr.prototype.Hf = null;
var Mr = 0;
Lr.prototype.reset = function(a, b, c, d, e) {
  "number" == typeof e || Mr++;
  d || ua();
  this.Id = a;
  this.Xg = b;
  delete this.Hf;
};
Lr.prototype.Zf = function(a) {
  this.Id = a;
};
function Nr(a) {
  this.Nf = a;
  this.Kf = this.ze = this.Id = this.Ua = null;
}
function Or(a, b) {
  this.name = a;
  this.value = b;
}
Or.prototype.toString = function() {
  return this.name;
};
var Pr = new Or("SEVERE", 1E3), Qr = new Or("INFO", 800), Rr = new Or("CONFIG", 700), Sr = new Or("FINE", 500);
h = Nr.prototype;
h.getName = function() {
  return this.Nf;
};
h.getParent = function() {
  return this.Ua;
};
h.Zf = function(a) {
  this.Id = a;
};
function Tr(a) {
  if (a.Id) {
    return a.Id;
  }
  if (a.Ua) {
    return Tr(a.Ua);
  }
  mb("Root logger has no level set.");
  return null;
}
h.log = function(a, b, c) {
  if (a.value >= Tr(this).value) {
    for (ia(b) && (b = b()), a = new Lr(a, String(b), this.Nf), c && (a.Hf = c), c = "log:" + a.Xg, ba.console && (ba.console.timeStamp ? ba.console.timeStamp(c) : ba.console.markTimeline && ba.console.markTimeline(c)), ba.msWriteProfilerMark && ba.msWriteProfilerMark(c), c = this;c;) {
      b = c;
      var d = a;
      if (b.Kf) {
        for (var e = 0, f = void 0;f = b.Kf[e];e++) {
          f(d);
        }
      }
      c = c.getParent();
    }
  }
};
h.info = function(a, b) {
  this.log(Qr, a, b);
};
var Ur = {}, Vr = null;
function Wr(a) {
  Vr || (Vr = new Nr(""), Ur[""] = Vr, Vr.Zf(Rr));
  var b;
  if (!(b = Ur[a])) {
    b = new Nr(a);
    var c = a.lastIndexOf("."), d = a.substr(c + 1), c = Wr(a.substr(0, c));
    c.ze || (c.ze = {});
    c.ze[d] = b;
    b.Ua = c;
    Ur[a] = b;
  }
  return b;
}
;function Xr(a, b) {
  a && a.log(Sr, b, void 0);
}
;function Yr() {
}
Yr.prototype.qf = null;
function Zr(a) {
  var b;
  (b = a.qf) || (b = {}, $r(a) && (b[0] = !0, b[1] = !0), b = a.qf = b);
  return b;
}
;var as;
function bs() {
}
ya(bs, Yr);
function cs(a) {
  return (a = $r(a)) ? new ActiveXObject(a) : new XMLHttpRequest;
}
function $r(a) {
  if (!a.Lf && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for (var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
      var d = b[c];
      try {
        return new ActiveXObject(d), a.Lf = d;
      } catch (e) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
  }
  return a.Lf;
}
as = new bs;
function ds(a) {
  Ir.call(this);
  this.headers = new ap;
  this.ue = a || null;
  this.Oc = !1;
  this.te = this.T = null;
  this.Mf = this.Hd = "";
  this.Ic = 0;
  this.pc = "";
  this.Ed = this.Qe = this.ge = this.Je = !1;
  this.cd = 0;
  this.ne = null;
  this.Nd = es;
  this.re = this.Vf = this.ef = !1;
}
ya(ds, Ir);
var es = "", fs = ds.prototype, gs = Wr("goog.net.XhrIo");
fs.tb = gs;
var hs = /^https?$/i, is = ["POST", "PUT"];
function js(a, b) {
  a.Nd = b;
}
h = ds.prototype;
h.send = function(a, b, c, d) {
  if (this.T) {
    throw Error("[goog.net.XhrIo] Object is active with another request\x3d" + this.Hd + "; newUri\x3d" + a);
  }
  b = b ? b.toUpperCase() : "GET";
  this.Hd = a;
  this.pc = "";
  this.Ic = 0;
  this.Mf = b;
  this.Je = !1;
  this.Oc = !0;
  this.T = this.ue ? cs(this.ue) : cs(as);
  this.te = this.ue ? Zr(this.ue) : Zr(as);
  this.T.onreadystatechange = ra(this.Sf, this);
  this.Vf && "onprogress" in this.T && (this.T.onprogress = ra(function(a) {
    this.Rf(a, !0);
  }, this), this.T.upload && (this.T.upload.onprogress = ra(this.Rf, this)));
  try {
    Xr(this.tb, ks(this, "Opening Xhr")), this.Qe = !0, this.T.open(b, String(a), !0), this.Qe = !1;
  } catch (f) {
    Xr(this.tb, ks(this, "Error opening Xhr: " + f.message));
    this.ae(5, f);
    return;
  }
  a = c || "";
  var e = this.headers.clone();
  d && $o(d, function(a, b) {
    e.set(b, a);
  });
  d = qb(e.rb());
  c = ba.FormData && a instanceof ba.FormData;
  !(0 <= nb(is, b)) || d || c || e.set("Content-Type", "application/x-www-form-urlencoded;charset\x3dutf-8");
  e.forEach(function(a, b) {
    this.T.setRequestHeader(b, a);
  }, this);
  this.Nd && (this.T.responseType = this.Nd);
  "withCredentials" in this.T && this.T.withCredentials !== this.ef && (this.T.withCredentials = this.ef);
  try {
    ls(this), 0 < this.cd && (this.re = ms(this.T), Xr(this.tb, ks(this, "Will abort after " + this.cd + "ms if incomplete, xhr2 " + this.re)), this.re ? (this.T.timeout = this.cd, this.T.ontimeout = ra(this.vc, this)) : this.ne = Kr(this.vc, this.cd, this)), Xr(this.tb, ks(this, "Sending request")), this.ge = !0, this.T.send(a), this.ge = !1;
  } catch (f) {
    Xr(this.tb, ks(this, "Send error: " + f.message)), this.ae(5, f);
  }
};
function ms(a) {
  return Aq && Lq(9) && "number" == typeof a.timeout && ca(a.ontimeout);
}
function sb(a) {
  return "content-type" == a.toLowerCase();
}
h.vc = function() {
  "undefined" != typeof aa && this.T && (this.pc = "Timed out after " + this.cd + "ms, aborting", this.Ic = 8, Xr(this.tb, ks(this, this.pc)), this.dispatchEvent("timeout"), this.abort(8));
};
h.ae = function(a, b) {
  this.Oc = !1;
  this.T && (this.Ed = !0, this.T.abort(), this.Ed = !1);
  this.pc = b;
  this.Ic = a;
  ns(this);
  os(this);
};
function ns(a) {
  a.Je || (a.Je = !0, a.dispatchEvent("complete"), a.dispatchEvent("error"));
}
h.abort = function(a) {
  this.T && this.Oc && (Xr(this.tb, ks(this, "Aborting")), this.Oc = !1, this.Ed = !0, this.T.abort(), this.Ed = !1, this.Ic = a || 7, this.dispatchEvent("complete"), this.dispatchEvent("abort"), os(this));
};
h.Sf = function() {
  this.Ie || (this.Qe || this.ge || this.Ed ? ps(this) : this.$g());
};
h.$g = function() {
  ps(this);
};
function ps(a) {
  if (a.Oc && "undefined" != typeof aa) {
    if (a.te[1] && 4 == qs(a) && 2 == rs(a)) {
      Xr(a.tb, ks(a, "Local request error detected and ignored"));
    } else {
      if (a.ge && 4 == qs(a)) {
        Kr(a.Sf, 0, a);
      } else {
        if (a.dispatchEvent("readystatechange"), 4 == qs(a)) {
          Xr(a.tb, ks(a, "Request complete"));
          a.Oc = !1;
          try {
            if (ss(a)) {
              a.dispatchEvent("complete"), a.dispatchEvent("success");
            } else {
              a.Ic = 6;
              var b;
              try {
                b = 2 < qs(a) ? a.T.statusText : "";
              } catch (c) {
                Xr(a.tb, "Can not get status: " + c.message), b = "";
              }
              a.pc = b + " [" + rs(a) + "]";
              ns(a);
            }
          } finally {
            os(a);
          }
        }
      }
    }
  }
}
h.Rf = function(a, b) {
  this.dispatchEvent(ts(a, "progress"));
  this.dispatchEvent(ts(a, b ? "downloadprogress" : "uploadprogress"));
};
function ts(a, b) {
  return {type:b, lengthComputable:a.lengthComputable, loaded:a.loaded, total:a.total};
}
function os(a) {
  if (a.T) {
    ls(a);
    var b = a.T, c = a.te[0] ? da : null;
    a.T = null;
    a.te = null;
    a.dispatchEvent("ready");
    try {
      b.onreadystatechange = c;
    } catch (d) {
      (a = a.tb) && a.log(Pr, "Problem encountered resetting onreadystatechange: " + d.message, void 0);
    }
  }
}
function ls(a) {
  a.T && a.re && (a.T.ontimeout = null);
  "number" == typeof a.ne && (ba.clearTimeout(a.ne), a.ne = null);
}
function ss(a) {
  var b = rs(a), c;
  a: {
    switch(b) {
      case 200:
      ;
      case 201:
      ;
      case 202:
      ;
      case 204:
      ;
      case 206:
      ;
      case 304:
      ;
      case 1223:
        c = !0;
        break a;
      default:
        c = !1;
    }
  }
  if (!c) {
    if (b = 0 === b) {
      a = String(a.Hd).match(ep)[1] || null, !a && ba.self && ba.self.location && (a = ba.self.location.protocol, a = a.substr(0, a.length - 1)), b = !hs.test(a ? a.toLowerCase() : "");
    }
    c = b;
  }
  return c;
}
function qs(a) {
  return a.T ? a.T.readyState : 0;
}
function rs(a) {
  try {
    return 2 < qs(a) ? a.T.status : -1;
  } catch (b) {
    return -1;
  }
}
function us(a) {
  try {
    if (!a.T) {
      return null;
    }
    if ("response" in a.T) {
      return a.T.response;
    }
    switch(a.Nd) {
      case es:
      ;
      case "text":
        return a.T.responseText;
      case "arraybuffer":
        if ("mozResponseArrayBuffer" in a.T) {
          return a.T.mozResponseArrayBuffer;
        }
      ;
    }
    var b = a.tb;
    b && b.log(Pr, "Response type " + a.Nd + " is not supported on this browser", void 0);
    return null;
  } catch (c) {
    return Xr(a.tb, "Can not get response: " + c.message), null;
  }
}
h.getResponseHeader = function(a) {
  return this.T && 4 == qs(this) ? this.T.getResponseHeader(a) : void 0;
};
h.getAllResponseHeaders = function() {
  return this.T && 4 == qs(this) ? this.T.getAllResponseHeaders() : "";
};
function ks(a, b) {
  return b + " [" + a.Mf + " " + a.Hd + " " + rs(a) + "]";
}
;Kp("Firefox");
yq() || Kp("iPod");
Kp("iPad");
!Kp("Android") || Lp() || Kp("Firefox") || Kp("Opera") || Kp("Silk");
Lp();
var vs = Kp("Safari") && !(Lp() || Kp("Coast") || Kp("Opera") || Kp("Edge") || Kp("Silk") || Kp("Android")) && !(yq() || Kp("iPad") || Kp("iPod"));
var ws = null, xs = Cq || Dq && !vs || zq || "function" == typeof ba.btoa;
var ys = function ys(b) {
  if (null != b && null != b.Bf) {
    return b.Bf();
  }
  var c = ys[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = ys._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("PushbackReader.read-char", b);
}, zs = function zs(b, c) {
  if (null != b && null != b.Cf) {
    return b.Cf(0, c);
  }
  var d = zs[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = zs._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("PushbackReader.unread", b);
};
function As(a, b, c) {
  this.s = a;
  this.buffer = b;
  this.fa = c;
}
As.prototype.Bf = function() {
  return 0 === this.buffer.length ? (this.fa += 1, this.s[this.fa]) : this.buffer.pop();
};
As.prototype.Cf = function(a, b) {
  return this.buffer.push(b);
};
function Bs(a) {
  var b = !/[^\t\n\r ]/.test(a);
  return z(b) ? b : "," === a;
}
function Cs(a) {
  throw Error(Rf(E, a));
}
function Ds(a, b) {
  for (var c = new hb(b), d = ys(a);;) {
    var e;
    if (!(e = null == d || Bs(d))) {
      e = d;
      var f = "#" !== e;
      e = f ? (f = "'" !== e) ? (f = ":" !== e) ? Es.h ? Es.h(e) : Es.call(null, e) : f : f : f;
    }
    if (e) {
      return zs(a, d), c.toString();
    }
    c.append(d);
    d = ys(a);
  }
}
function Fs(a) {
  for (;;) {
    var b = ys(a);
    if ("\n" === b || "\r" === b || null == b) {
      return a;
    }
  }
}
var Gs = Pi("^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+))(N)?$"), Hs = Pi("^([-+]?[0-9]+)/([0-9]+)$"), Is = Pi("^([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?$"), Js = Pi("^[:]?([^0-9/].*/)?([^0-9/][^/]*)$");
function Ks(a, b) {
  var c = a.exec(b);
  return null != c && c[0] === b ? 1 === c.length ? c[0] : c : null;
}
var Ls = Pi("^[0-9A-Fa-f]{2}$"), Ms = Pi("^[0-9A-Fa-f]{4}$");
function Ns(a, b, c) {
  return z(Ni(a, c)) ? c : Cs(S(["Unexpected unicode escape \\", b, c], 0));
}
function Os(a) {
  var b = ys(a), c = "t" === b ? "\t" : "r" === b ? "\r" : "n" === b ? "\n" : "\\" === b ? "\\" : '"' === b ? '"' : "b" === b ? "\b" : "f" === b ? "\f" : null;
  z(c) ? b = c : "x" === b ? (a = (new hb(ys(a), ys(a))).toString(), b = String.fromCharCode(parseInt(Ns(Ls, b, a), 16))) : "u" === b ? (a = (new hb(ys(a), ys(a), ys(a), ys(a))).toString(), b = String.fromCharCode(parseInt(Ns(Ms, b, a), 16))) : b = /[^0-9]/.test(b) ? Cs(S(["Unexpected unicode escape \\", b], 0)) : String.fromCharCode(b);
  return b;
}
function Ps(a, b) {
  for (var c = [];;) {
    var d;
    a: {
      d = b;
      for (var e = Bs, f = ys(d);;) {
        if (z(e.h ? e.h(f) : e.call(null, f))) {
          f = ys(d);
        } else {
          d = f;
          break a;
        }
      }
    }
    z(d) || Cs(S(["EOF while reading"], 0));
    if (a === d) {
      return c;
    }
    e = Es.h ? Es.h(d) : Es.call(null, d);
    z(e) ? d = e.j ? e.j(b, d) : e.call(null, b, d) : (zs(b, d), d = Qs.J ? Qs.J(b, !0, null, !0) : Qs.call(null, b, !0, null));
    d !== b && c.push(d);
  }
}
function Rs(a, b) {
  return Cs(S(["Reader for ", b, " not implemented yet"], 0));
}
function Ss(a, b) {
  var c = ys(a), d = Ts.h ? Ts.h(c) : Ts.call(null, c);
  if (z(d)) {
    return d.j ? d.j(a, b) : d.call(null, a, b);
  }
  d = Us.j ? Us.j(a, c) : Us.call(null, a, c);
  return z(d) ? d : Cs(S(["No dispatch macro for ", c], 0));
}
function Vs(a, b) {
  return Cs(S(["Unmatched delimiter ", b], 0));
}
function Ws(a) {
  a = Ps(")", a);
  for (var b = a.length, c = Zd;;) {
    if (0 < b) {
      var d = b - 1, c = c.ea(null, a[b - 1]), b = d
    } else {
      return c;
    }
  }
}
function Xs(a) {
  return dh(Ps("]", a));
}
function Ys(a) {
  a = Ps("}", a);
  var b = a.length;
  if (!Ye(b)) {
    throw Error([E("Argument must be an integer: "), E(b)].join(""));
  }
  0 !== (b & 1) && Cs(S(["Map literal must contain an even number of forms"], 0));
  if (b <= 2 * Dh) {
    a = Fh(a, !0, !0);
  } else {
    a: {
      for (var b = a.length, c = 0, d = sd(Eh);;) {
        if (c < b) {
          var e = c + 2, d = vd(d, a[c], a[c + 1]), c = e
        } else {
          a = ud(d);
          break a;
        }
      }
    }
  }
  return a;
}
function Zs(a) {
  for (var b = new hb, c = ys(a);;) {
    if (null == c) {
      return Cs(S(["EOF while reading"], 0));
    }
    if ("\\" === c) {
      b.append(Os(a));
    } else {
      if ('"' === c) {
        return b.toString();
      }
      b.append(c);
    }
    c = ys(a);
  }
}
function $s(a) {
  for (var b = new hb, c = ys(a);;) {
    if (null == c) {
      return Cs(S(["EOF while reading"], 0));
    }
    if ("\\" === c) {
      b.append(c);
      var d = ys(a);
      if (null == d) {
        return Cs(S(["EOF while reading"], 0));
      }
      var e = function() {
        var a = b;
        a.append(d);
        return a;
      }(), f = ys(a);
    } else {
      if ('"' === c) {
        return b.toString();
      }
      e = function() {
        var a = b;
        a.append(c);
        return a;
      }();
      f = ys(a);
    }
    b = e;
    c = f;
  }
}
function at(a, b) {
  var c = Ds(a, b), d = -1 != c.indexOf("/");
  z(z(d) ? 1 !== c.length : d) ? c = Xd.j(pf(c, 0, c.indexOf("/")), pf(c, c.indexOf("/") + 1, c.length)) : (d = Xd.h(c), c = "nil" === c ? null : "true" === c ? !0 : "false" === c ? !1 : "/" === c ? Sm : d);
  return c;
}
function bt(a, b) {
  var c = Ds(a, b), d = c.substring(1);
  return 1 === d.length ? d : "tab" === d ? "\t" : "return" === d ? "\r" : "newline" === d ? "\n" : "space" === d ? " " : "backspace" === d ? "\b" : "formfeed" === d ? "\f" : "u" === d.charAt(0) ? String.fromCharCode(parseInt(d.substring(1), 16)) : "o" === d.charAt(0) ? Rs(0, c) : Cs(S(["Unknown character literal: ", c], 0));
}
function ct(a) {
  a = Ds(a, ys(a));
  var b = Ks(Js, a);
  a = b[0];
  var c = b[1], b = b[2];
  return void 0 !== c && ":/" === c.substring(c.length - 2, c.length) || ":" === b[b.length - 1] || -1 !== a.indexOf("::", 1) ? Cs(S(["Invalid token: ", a], 0)) : null != c && 0 < c.length ? Bf.j(c.substring(0, c.indexOf("/")), b) : Bf.h(a);
}
function dt(a) {
  return function(b) {
    b = Qs.J ? Qs.J(b, !0, null, !0) : Qs.call(null, b, !0, null);
    b = Cc(Zd, b);
    return Cc(b, a);
  };
}
function et() {
  return function() {
    return Cs(S(["Unreadable form"], 0));
  };
}
function ft(a) {
  var b;
  b = Qs.J ? Qs.J(a, !0, null, !0) : Qs.call(null, a, !0, null);
  b = b instanceof F ? new q(null, 1, [An, b], null) : "string" === typeof b ? new q(null, 1, [An, b], null) : b instanceof X ? Fh([b, !0], !0, !1) : b;
  Pe(b) || Cs(S(["Metadata must be Symbol,Keyword,String or Map"], 0));
  a = Qs.J ? Qs.J(a, !0, null, !0) : Qs.call(null, a, !0, null);
  return (null != a ? a.v & 262144 || a.Ih || (a.v ? 0 : A(cd, a)) : A(cd, a)) ? xe(a, Ai.A(S([Je(a), b], 0))) : Cs(S(["Metadata can only be applied to IWithMetas"], 0));
}
function gt(a) {
  a: {
    a = Ps("}", a);
    var b = a.length;
    if (b <= Dh) {
      for (var c = 0, d = sd(cg);;) {
        if (c < b) {
          var e = c + 1, d = vd(d, a[c], null), c = e
        } else {
          a = new Ci(null, ud(d), null);
          break a;
        }
      }
    } else {
      for (c = 0, d = sd(Ei);;) {
        if (c < b) {
          e = c + 1, d = td(d, a[c]), c = e;
        } else {
          a = ud(d);
          break a;
        }
      }
    }
  }
  return a;
}
function ht(a) {
  return Pi($s(a));
}
function it(a) {
  Qs.J ? Qs.J(a, !0, null, !0) : Qs.call(null, a, !0, null);
  return a;
}
function Es(a) {
  return '"' === a ? Zs : ":" === a ? ct : ";" === a ? Fs : "'" === a ? dt(ag) : "@" === a ? dt(fo) : "^" === a ? ft : "`" === a ? Rs : "~" === a ? Rs : "(" === a ? Ws : ")" === a ? Vs : "[" === a ? Xs : "]" === a ? Vs : "{" === a ? Ys : "}" === a ? Vs : "\\" === a ? bt : "#" === a ? Ss : null;
}
function Ts(a) {
  return "{" === a ? gt : "\x3c" === a ? et() : '"' === a ? ht : "!" === a ? Fs : "_" === a ? it : null;
}
function Qs(a, b, c) {
  for (;;) {
    var d = ys(a);
    if (null == d) {
      return z(b) ? Cs(S(["EOF while reading"], 0)) : c;
    }
    if (!Bs(d)) {
      if (";" === d) {
        a = Fs.j ? Fs.j(a, d) : Fs.call(null, a);
      } else {
        var e = Es(d);
        if (z(e)) {
          e = e.j ? e.j(a, d) : e.call(null, a, d);
        } else {
          var e = a, f = void 0;
          !(f = !/[^0-9]/.test(d)) && (f = void 0, f = "+" === d || "-" === d) && (f = ys(e), zs(e, f), f = !/[^0-9]/.test(f));
          if (f) {
            a: {
              for (e = a, d = new hb(d), f = ys(e);;) {
                var g;
                g = null == f;
                g || (g = (g = Bs(f)) ? g : Es.h ? Es.h(f) : Es.call(null, f));
                if (z(g)) {
                  zs(e, f);
                  d = e = d.toString();
                  f = void 0;
                  z(Ks(Gs, d)) ? (d = Ks(Gs, d), f = d[2], null != (M.j(f, "") ? null : f) ? f = 0 : (f = z(d[3]) ? [d[3], 10] : z(d[4]) ? [d[4], 16] : z(d[5]) ? [d[5], 8] : z(d[6]) ? [d[7], parseInt(d[6], 10)] : [null, null], g = f[0], null == g ? f = null : (f = parseInt(g, f[1]), f = "-" === d[1] ? -f : f))) : (f = void 0, z(Ks(Hs, d)) ? (d = Ks(Hs, d), f = parseInt(d[1], 10) / parseInt(d[2], 10)) : f = z(Ks(Is, d)) ? parseFloat(d) : null);
                  d = f;
                  e = z(d) ? d : Cs(S(["Invalid number format [", e, "]"], 0));
                  break a;
                }
                d.append(f);
                f = ys(e);
              }
            }
          } else {
            e = at(a, d);
          }
        }
        if (e !== a) {
          return e;
        }
      }
    }
  }
}
function jt(a) {
  if ("string" !== typeof a) {
    throw Error("Cannot read from non-string object.");
  }
  return Qs(new As(a, [], -1), !1, null);
}
var kt = function(a, b) {
  return function(c, d) {
    return H.j(z(d) ? b : a, c);
  };
}(new V(null, 13, 5, W, [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], null), new V(null, 13, 5, W, [null, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], null)), lt = /(\d\d\d\d)(?:-(\d\d)(?:-(\d\d)(?:[T](\d\d)(?::(\d\d)(?::(\d\d)(?:[.](\d+))?)?)?)?)?)?(?:[Z]|([-+])(\d\d):(\d\d))?/;
function mt(a) {
  a = parseInt(a, 10);
  return nc(isNaN(a)) ? a : null;
}
function nt(a, b, c, d) {
  a <= b && b <= c || Cs(S([[E(d), E(" Failed:  "), E(a), E("\x3c\x3d"), E(b), E("\x3c\x3d"), E(c)].join("")], 0));
  return b;
}
function ot(a) {
  var b = Ni(lt, a);
  T(b, 0, null);
  var c = T(b, 1, null), d = T(b, 2, null), e = T(b, 3, null), f = T(b, 4, null), g = T(b, 5, null), k = T(b, 6, null), l = T(b, 7, null), n = T(b, 8, null), m = T(b, 9, null), r = T(b, 10, null);
  if (nc(b)) {
    return Cs(S([[E("Unrecognized date/time syntax: "), E(a)].join("")], 0));
  }
  var t = mt(c), u = function() {
    var a = mt(d);
    return z(a) ? a : 1;
  }();
  a = function() {
    var a = mt(e);
    return z(a) ? a : 1;
  }();
  var b = function() {
    var a = mt(f);
    return z(a) ? a : 0;
  }(), c = function() {
    var a = mt(g);
    return z(a) ? a : 0;
  }(), v = function() {
    var a = mt(k);
    return z(a) ? a : 0;
  }(), y = function() {
    var a;
    a: {
      if (M.j(3, P(l))) {
        a = l;
      } else {
        if (3 < P(l)) {
          a = l.substring(0, 3);
        } else {
          for (a = new hb(l);;) {
            if (3 > a.ic.length) {
              a = a.append("0");
            } else {
              a = a.toString();
              break a;
            }
          }
        }
      }
    }
    a = mt(a);
    return z(a) ? a : 0;
  }(), n = (M.j(n, "-") ? -1 : 1) * (60 * function() {
    var a = mt(m);
    return z(a) ? a : 0;
  }() + function() {
    var a = mt(r);
    return z(a) ? a : 0;
  }());
  return new V(null, 8, 5, W, [t, nt(1, u, 12, "timestamp month field must be in range 1..12"), nt(1, a, function() {
    var a;
    a = 0 === (t % 4 + 4) % 4;
    z(a) && (a = nc(0 === (t % 100 + 100) % 100), a = z(a) ? a : 0 === (t % 400 + 400) % 400);
    return kt.j ? kt.j(u, a) : kt.call(null, u, a);
  }(), "timestamp day field must be in range 1..last day in month"), nt(0, b, 23, "timestamp hour field must be in range 0..23"), nt(0, c, 59, "timestamp minute field must be in range 0..59"), nt(0, v, M.j(c, 59) ? 60 : 59, "timestamp second field must be in range 0..60"), nt(0, y, 999, "timestamp millisecond field must be in range 0..999"), n], null);
}
var pt, qt = new q(null, 4, ["inst", function(a) {
  var b;
  if ("string" === typeof a) {
    if (b = ot(a), z(b)) {
      a = T(b, 0, null);
      var c = T(b, 1, null), d = T(b, 2, null), e = T(b, 3, null), f = T(b, 4, null), g = T(b, 5, null), k = T(b, 6, null);
      b = T(b, 7, null);
      b = new Date(Date.UTC(a, c - 1, d, e, f, g, k) - 6E4 * b);
    } else {
      b = Cs(S([[E("Unrecognized date/time syntax: "), E(a)].join("")], 0));
    }
  } else {
    b = Cs(S(["Instance literal expects a string for its timestamp."], 0));
  }
  return b;
}, "uuid", function(a) {
  return "string" === typeof a ? new Bj(a, null) : Cs(S(["UUID literal expects a string as its representation."], 0));
}, "queue", function(a) {
  return Re(a) ? Ig.j(qh, a) : Cs(S(["Queue literal expects a vector for its elements."], 0));
}, "js", function(a) {
  if (Re(a)) {
    var b = [];
    a = x(a);
    for (var c = null, d = 0, e = 0;;) {
      if (e < d) {
        var f = c.Z(null, e);
        b.push(f);
        e += 1;
      } else {
        if (a = x(a)) {
          c = a, Se(c) ? (a = Ad(c), e = Bd(c), c = a, d = P(a), a = e) : (a = I(c), b.push(a), a = K(c), c = null, d = 0), e = 0;
        } else {
          break;
        }
      }
    }
    return b;
  }
  if (Pe(a)) {
    b = {};
    a = x(a);
    c = null;
    for (e = d = 0;;) {
      if (e < d) {
        var g = c.Z(null, e), f = T(g, 0, null), g = T(g, 1, null);
        b[Cf(f)] = g;
        e += 1;
      } else {
        if (a = x(a)) {
          Se(a) ? (d = Ad(a), a = Bd(a), c = d, d = P(d)) : (d = I(a), c = T(d, 0, null), d = T(d, 1, null), b[Cf(c)] = d, a = K(a), c = null, d = 0), e = 0;
        } else {
          break;
        }
      }
    }
    return b;
  }
  return Cs(S([[E("JS literal expects a vector or map containing "), E("only string or unqualified keyword keys")].join("")], 0));
}], null);
pt = pg ? pg(qt) : og.call(null, qt);
var rt = pg ? pg(null) : og.call(null, null);
function Us(a, b) {
  var c = at(a, b), d = H.j(N.h ? N.h(pt) : N.call(null, pt), "" + E(c)), e = N.h ? N.h(rt) : N.call(null, rt);
  return z(d) ? (c = Qs(a, !0, null), d.h ? d.h(c) : d.call(null, c)) : z(e) ? (d = Qs(a, !0, null), e.j ? e.j(c, d) : e.call(null, c, d)) : Cs(S(["Could not find tag parser for ", "" + E(c), " in ", aj(S([Ah(N.h ? N.h(pt) : N.call(null, pt))], 0), bc())], 0));
}
;function st(a) {
  var b;
  if (z(a)) {
    if (xs) {
      b = ba.btoa(a);
    } else {
      b = [];
      for (var c = 0, d = 0;d < a.length;d++) {
        for (var e = a.charCodeAt(d);255 < e;) {
          b[c++] = e & 255, e >>= 8;
        }
        b[c++] = e;
      }
      if (!ws) {
        for (ws = {}, a = 0;65 > a;a++) {
          ws[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(a);
        }
      }
      a = ws;
      c = [];
      for (d = 0;d < b.length;d += 3) {
        var f = b[d], g = (e = d + 1 < b.length) ? b[d + 1] : 0, k = d + 2 < b.length, l = k ? b[d + 2] : 0, n = f >> 2, f = (f & 3) << 4 | g >> 4, g = (g & 15) << 2 | l >> 6, l = l & 63;
        k || (l = 64, e || (g = 64));
        c.push(a[n], a[f], a[g], a[l]);
      }
      b = c.join("");
    }
  } else {
    b = null;
  }
  return b;
}
function tt(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  c = arguments[0];
  T(1 < b.length ? new w(b.slice(1), 0, null) : null, 0, null);
  if (z(c)) {
    a: {
      b = "" + E(c), b = encodeURIComponent(b).replace(new RegExp("*".replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08"), "g"), "%2A");
      break a;
      throw [E("Invalid match arg: "), E("*")].join("");
    }
  } else {
    b = null;
  }
  return b;
}
function ut(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  c = arguments[0];
  T(1 < b.length ? new w(b.slice(1), 0, null) : null, 0, null);
  return z(c) ? decodeURIComponent(c) : null;
}
Fe("TKGMYZEBP".split(""), [Math.pow(1024, 4), Math.pow(1024, 1), Math.pow(1024, 3), Math.pow(1024, 2), Math.pow(1024, 8), Math.pow(1024, 7), Math.pow(1024, 6), Math.pow(1024, 0), Math.pow(1024, 5)]);
var vt = "undefined" != typeof Object.keys ? function(a) {
  return Object.keys(a);
} : function(a) {
  return Qa(a);
}, wt = "undefined" != typeof Array.isArray ? function(a) {
  return Array.isArray(a);
} : function(a) {
  return "array" === p(a);
};
function xt() {
  return Math.round(15 * Math.random()).toString(16);
}
;var yt = 1;
function zt(a, b) {
  if (null == a) {
    return null == b;
  }
  if (a === b) {
    return !0;
  }
  if ("object" === typeof a) {
    if (wt(a)) {
      if (wt(b) && a.length === b.length) {
        for (var c = 0;c < a.length;c++) {
          if (!zt(a[c], b[c])) {
            return !1;
          }
        }
        return !0;
      }
      return !1;
    }
    if (a.vb) {
      return a.vb(b);
    }
    if (null != b && "object" === typeof b) {
      if (b.vb) {
        return b.vb(a);
      }
      var c = 0, d = vt(b).length, e;
      for (e in a) {
        if (a.hasOwnProperty(e) && (c++, !b.hasOwnProperty(e) || !zt(a[e], b[e]))) {
          return !1;
        }
      }
      return c === d;
    }
  }
  return !1;
}
function At(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2);
}
var Bt = {}, Ct = 0;
function Dt(a) {
  var b = 0;
  if (null != a.forEach) {
    a.forEach(function(a, c) {
      b = (b + (Et(c) ^ Et(a))) % 4503599627370496;
    });
  } else {
    for (var c = vt(a), d = 0;d < c.length;d++) {
      var e = c[d], f = a[e], b = (b + (Et(e) ^ Et(f))) % 4503599627370496
    }
  }
  return b;
}
function Ft(a) {
  var b = 0;
  if (wt(a)) {
    for (var c = 0;c < a.length;c++) {
      b = At(b, Et(a[c]));
    }
  } else {
    a.forEach && a.forEach(function(a) {
      b = At(b, Et(a));
    });
  }
  return b;
}
function Et(a) {
  if (null == a) {
    return 0;
  }
  switch(typeof a) {
    case "number":
      return a;
    case "boolean":
      return !0 === a ? 1 : 0;
    case "string":
      var b = Bt[a];
      if (null == b) {
        for (var c = b = 0;c < a.length;++c) {
          b = 31 * b + a.charCodeAt(c), b %= 4294967296;
        }
        Ct++;
        256 <= Ct && (Bt = {}, Ct = 1);
        Bt[a] = b;
      }
      a = b;
      return a;
    case "function":
      return b = a.transit$hashCode$, b || (b = yt, "undefined" != typeof Object.defineProperty ? Object.defineProperty(a, "transit$hashCode$", {value:b, enumerable:!1}) : a.transit$hashCode$ = b, yt++), b;
    default:
      return a instanceof Date ? a.valueOf() : wt(a) ? Ft(a) : a.Eb ? a.Eb() : Dt(a);
  }
}
;var Gt = "undefined" != typeof Symbol ? Symbol.iterator : "@@iterator";
function Ht(a, b) {
  this.tag = a;
  this.Y = b;
  this.la = -1;
}
Ht.prototype.toString = function() {
  return "[TaggedValue: " + this.tag + ", " + this.Y + "]";
};
Ht.prototype.equiv = function(a) {
  return zt(this, a);
};
Ht.prototype.equiv = Ht.prototype.equiv;
Ht.prototype.vb = function(a) {
  return a instanceof Ht ? this.tag === a.tag && zt(this.Y, a.Y) : !1;
};
Ht.prototype.Eb = function() {
  -1 === this.la && (this.la = At(Et(this.tag), Et(this.Y)));
  return this.la;
};
function It(a, b) {
  return new Ht(a, b);
}
var Jt = Lb("9007199254740991"), Kt = Lb("-9007199254740991");
Ab.prototype.equiv = function(a) {
  return zt(this, a);
};
Ab.prototype.equiv = Ab.prototype.equiv;
Ab.prototype.vb = function(a) {
  return a instanceof Ab && this.eb(a);
};
Ab.prototype.Eb = function() {
  return this.Pd();
};
function Lt(a) {
  this.ua = a;
  this.la = -1;
}
Lt.prototype.toString = function() {
  return ":" + this.ua;
};
Lt.prototype.namespace = function() {
  var a = this.ua.indexOf("/");
  return -1 != a ? this.ua.substring(0, a) : null;
};
Lt.prototype.name = function() {
  var a = this.ua.indexOf("/");
  return -1 != a ? this.ua.substring(a + 1, this.ua.length) : this.ua;
};
Lt.prototype.equiv = function(a) {
  return zt(this, a);
};
Lt.prototype.equiv = Lt.prototype.equiv;
Lt.prototype.vb = function(a) {
  return a instanceof Lt && this.ua == a.ua;
};
Lt.prototype.Eb = function() {
  -1 === this.la && (this.la = Et(this.ua));
  return this.la;
};
function Mt(a) {
  this.ua = a;
  this.la = -1;
}
Mt.prototype.namespace = function() {
  var a = this.ua.indexOf("/");
  return -1 != a ? this.ua.substring(0, a) : null;
};
Mt.prototype.name = function() {
  var a = this.ua.indexOf("/");
  return -1 != a ? this.ua.substring(a + 1, this.ua.length) : this.ua;
};
Mt.prototype.toString = function() {
  return this.ua;
};
Mt.prototype.equiv = function(a) {
  return zt(this, a);
};
Mt.prototype.equiv = Mt.prototype.equiv;
Mt.prototype.vb = function(a) {
  return a instanceof Mt && this.ua == a.ua;
};
Mt.prototype.Eb = function() {
  -1 === this.la && (this.la = Et(this.ua));
  return this.la;
};
function Nt(a, b, c) {
  var d = "";
  c = c || b + 1;
  for (var e = 8 * (7 - b), f = Db(255).shiftLeft(e);b < c;b++, e -= 8, f = Wb(f, 8)) {
    var g = Wb(a.jf(f), e).toString(16);
    1 == g.length && (g = "0" + g);
    d += g;
  }
  return d;
}
function Ot(a, b) {
  this.Pe = a;
  this.Ue = b;
  this.la = -1;
}
Ot.prototype.toString = function() {
  var a, b = this.Pe, c = this.Ue;
  a = "" + (Nt(b, 0, 4) + "-");
  a += Nt(b, 4, 6) + "-";
  a += Nt(b, 6, 8) + "-";
  a += Nt(c, 0, 2) + "-";
  return a += Nt(c, 2, 8);
};
Ot.prototype.equiv = function(a) {
  return zt(this, a);
};
Ot.prototype.equiv = Ot.prototype.equiv;
Ot.prototype.vb = function(a) {
  return a instanceof Ot && this.Pe.eb(a.Pe) && this.Ue.eb(a.Ue);
};
Ot.prototype.Eb = function() {
  -1 === this.la && (this.la = Et(this.toString()));
  return this.la;
};
Date.prototype.vb = function(a) {
  return a instanceof Date ? this.valueOf() === a.valueOf() : !1;
};
Date.prototype.Eb = function() {
  return this.valueOf();
};
function Pt(a, b) {
  this.entries = a;
  this.type = b || 0;
  this.fa = 0;
}
Pt.prototype.next = function() {
  if (this.fa < this.entries.length) {
    var a = null, a = 0 === this.type ? this.entries[this.fa] : 1 === this.type ? this.entries[this.fa + 1] : [this.entries[this.fa], this.entries[this.fa + 1]], a = {value:a, done:!1};
    this.fa += 2;
    return a;
  }
  return {value:null, done:!0};
};
Pt.prototype.next = Pt.prototype.next;
Pt.prototype[Gt] = function() {
  return this;
};
function Qt(a, b) {
  this.map = a;
  this.type = b || 0;
  this.keys = this.map.rb();
  this.fa = 0;
  this.xc = null;
  this.hc = 0;
}
Qt.prototype.next = function() {
  if (this.fa < this.map.size) {
    null != this.xc && this.hc < this.xc.length || (this.xc = this.map.map[this.keys[this.fa]], this.hc = 0);
    var a = null, a = 0 === this.type ? this.xc[this.hc] : 1 === this.type ? this.xc[this.hc + 1] : [this.xc[this.hc], this.xc[this.hc + 1]], a = {value:a, done:!1};
    this.fa++;
    this.hc += 2;
    return a;
  }
  return {value:null, done:!0};
};
Qt.prototype.next = Qt.prototype.next;
Qt.prototype[Gt] = function() {
  return this;
};
function Rt(a, b) {
  if (a instanceof St && (b instanceof Tt || b instanceof St)) {
    if (a.size !== b.size) {
      return !1;
    }
    for (var c in a.map) {
      for (var d = a.map[c], e = 0;e < d.length;e += 2) {
        if (!zt(d[e + 1], b.get(d[e]))) {
          return !1;
        }
      }
    }
    return !0;
  }
  if (a instanceof Tt && (b instanceof Tt || b instanceof St)) {
    if (a.size !== b.size) {
      return !1;
    }
    c = a.ha;
    for (e = 0;e < c.length;e += 2) {
      if (!zt(c[e + 1], b.get(c[e]))) {
        return !1;
      }
    }
    return !0;
  }
  if (null != b && "object" === typeof b && (e = vt(b), c = e.length, a.size === c)) {
    for (d = 0;d < c;d++) {
      var f = e[d];
      if (!a.has(f) || !zt(b[f], a.get(f))) {
        return !1;
      }
    }
    return !0;
  }
  return !1;
}
function Ut(a) {
  return null == a ? "null" : fa(a) ? "[" + a.toString() + "]" : ha(a) ? '"' + a + '"' : a.toString();
}
function Vt(a) {
  var b = 0, c = "TransitMap {";
  a.forEach(function(d, e) {
    c += Ut(e) + " \x3d\x3e " + Ut(d);
    b < a.size - 1 && (c += ", ");
    b++;
  });
  return c + "}";
}
function Wt(a) {
  var b = 0, c = "TransitSet {";
  a.forEach(function(d) {
    c += Ut(d);
    b < a.size - 1 && (c += ", ");
    b++;
  });
  return c + "}";
}
function Tt(a) {
  this.ha = a;
  this.ga = null;
  this.la = -1;
  this.size = a.length / 2;
  this.ff = 0;
}
Tt.prototype.toString = function() {
  return Vt(this);
};
Tt.prototype.inspect = function() {
  return this.toString();
};
function Xt(a) {
  if (a.ga) {
    throw Error("Invalid operation, already converted");
  }
  if (8 > a.size) {
    return !1;
  }
  a.ff++;
  return 32 < a.ff ? (a.ga = Yt(a.ha, !1, !0), a.ha = [], !0) : !1;
}
Tt.prototype.clear = function() {
  this.la = -1;
  this.ga ? this.ga.clear() : this.ha = [];
  this.size = 0;
};
Tt.prototype.clear = Tt.prototype.clear;
Tt.prototype.keys = function() {
  return this.ga ? this.ga.keys() : new Pt(this.ha, 0);
};
Tt.prototype.keys = Tt.prototype.keys;
Tt.prototype.Gc = function() {
  if (this.ga) {
    return this.ga.Gc();
  }
  for (var a = [], b = 0, c = 0;c < this.ha.length;b++, c += 2) {
    a[b] = this.ha[c];
  }
  return a;
};
Tt.prototype.keySet = Tt.prototype.Gc;
Tt.prototype.entries = function() {
  return this.ga ? this.ga.entries() : new Pt(this.ha, 2);
};
Tt.prototype.entries = Tt.prototype.entries;
Tt.prototype.values = function() {
  return this.ga ? this.ga.values() : new Pt(this.ha, 1);
};
Tt.prototype.values = Tt.prototype.values;
Tt.prototype.forEach = function(a) {
  if (this.ga) {
    this.ga.forEach(a);
  } else {
    for (var b = 0;b < this.ha.length;b += 2) {
      a(this.ha[b + 1], this.ha[b]);
    }
  }
};
Tt.prototype.forEach = Tt.prototype.forEach;
Tt.prototype.get = function(a, b) {
  if (this.ga) {
    return this.ga.get(a);
  }
  if (Xt(this)) {
    return this.get(a);
  }
  for (var c = 0;c < this.ha.length;c += 2) {
    if (zt(this.ha[c], a)) {
      return this.ha[c + 1];
    }
  }
  return b;
};
Tt.prototype.get = Tt.prototype.get;
Tt.prototype.has = function(a) {
  if (this.ga) {
    return this.ga.has(a);
  }
  if (Xt(this)) {
    return this.has(a);
  }
  for (var b = 0;b < this.ha.length;b += 2) {
    if (zt(this.ha[b], a)) {
      return !0;
    }
  }
  return !1;
};
Tt.prototype.has = Tt.prototype.has;
Tt.prototype.set = function(a, b) {
  this.la = -1;
  if (this.ga) {
    this.ga.set(a, b), this.size = this.ga.size;
  } else {
    for (var c = 0;c < this.ha.length;c += 2) {
      if (zt(this.ha[c], a)) {
        this.ha[c + 1] = b;
        return;
      }
    }
    this.ha.push(a);
    this.ha.push(b);
    this.size++;
    32 < this.size && (this.ga = Yt(this.ha, !1, !0), this.ha = null);
  }
};
Tt.prototype.set = Tt.prototype.set;
Tt.prototype["delete"] = function(a) {
  this.la = -1;
  if (this.ga) {
    return a = this.ga["delete"](a), this.size = this.ga.size, a;
  }
  for (var b = 0;b < this.ha.length;b += 2) {
    if (zt(this.ha[b], a)) {
      return a = this.ha[b + 1], this.ha.splice(b, 2), this.size--, a;
    }
  }
};
Tt.prototype.clone = function() {
  var a = Yt();
  this.forEach(function(b, c) {
    a.set(c, b);
  });
  return a;
};
Tt.prototype.clone = Tt.prototype.clone;
Tt.prototype[Gt] = function() {
  return this.entries();
};
Tt.prototype.Eb = function() {
  if (this.ga) {
    return this.ga.Eb();
  }
  -1 === this.la && (this.la = Dt(this));
  return this.la;
};
Tt.prototype.vb = function(a) {
  return this.ga ? Rt(this.ga, a) : Rt(this, a);
};
function St(a, b, c) {
  this.map = b || {};
  this.Nc = a || [];
  this.size = c || 0;
  this.la = -1;
}
St.prototype.toString = function() {
  return Vt(this);
};
St.prototype.inspect = function() {
  return this.toString();
};
St.prototype.clear = function() {
  this.la = -1;
  this.map = {};
  this.Nc = [];
  this.size = 0;
};
St.prototype.clear = St.prototype.clear;
St.prototype.rb = function() {
  return null != this.Nc ? this.Nc : vt(this.map);
};
St.prototype["delete"] = function(a) {
  this.la = -1;
  this.Nc = null;
  for (var b = Et(a), c = this.map[b], d = 0;d < c.length;d += 2) {
    if (zt(a, c[d])) {
      return a = c[d + 1], c.splice(d, 2), 0 === c.length && delete this.map[b], this.size--, a;
    }
  }
};
St.prototype.entries = function() {
  return new Qt(this, 2);
};
St.prototype.entries = St.prototype.entries;
St.prototype.forEach = function(a) {
  for (var b = this.rb(), c = 0;c < b.length;c++) {
    for (var d = this.map[b[c]], e = 0;e < d.length;e += 2) {
      a(d[e + 1], d[e], this);
    }
  }
};
St.prototype.forEach = St.prototype.forEach;
St.prototype.get = function(a, b) {
  var c = Et(a), c = this.map[c];
  if (null != c) {
    for (var d = 0;d < c.length;d += 2) {
      if (zt(a, c[d])) {
        return c[d + 1];
      }
    }
  } else {
    return b;
  }
};
St.prototype.get = St.prototype.get;
St.prototype.has = function(a) {
  var b = Et(a), b = this.map[b];
  if (null != b) {
    for (var c = 0;c < b.length;c += 2) {
      if (zt(a, b[c])) {
        return !0;
      }
    }
  }
  return !1;
};
St.prototype.has = St.prototype.has;
St.prototype.keys = function() {
  return new Qt(this, 0);
};
St.prototype.keys = St.prototype.keys;
St.prototype.Gc = function() {
  for (var a = this.rb(), b = [], c = 0;c < a.length;c++) {
    for (var d = this.map[a[c]], e = 0;e < d.length;e += 2) {
      b.push(d[e]);
    }
  }
  return b;
};
St.prototype.keySet = St.prototype.Gc;
St.prototype.set = function(a, b) {
  this.la = -1;
  var c = Et(a), d = this.map[c];
  if (null == d) {
    this.Nc && this.Nc.push(c), this.map[c] = [a, b], this.size++;
  } else {
    for (var c = !0, e = 0;e < d.length;e += 2) {
      if (zt(b, d[e])) {
        c = !1;
        d[e] = b;
        break;
      }
    }
    c && (d.push(a), d.push(b), this.size++);
  }
};
St.prototype.set = St.prototype.set;
St.prototype.values = function() {
  return new Qt(this, 1);
};
St.prototype.values = St.prototype.values;
St.prototype.clone = function() {
  var a = Yt();
  this.forEach(function(b, c) {
    a.set(c, b);
  });
  return a;
};
St.prototype.clone = St.prototype.clone;
St.prototype[Gt] = function() {
  return this.entries();
};
St.prototype.Eb = function() {
  -1 === this.la && (this.la = Dt(this));
  return this.la;
};
St.prototype.vb = function(a) {
  return Rt(this, a);
};
function Yt(a, b, c) {
  a = a || [];
  b = !1 === b ? b : !0;
  if ((!0 !== c || !c) && 64 >= a.length) {
    if (b) {
      var d = a;
      a = [];
      for (b = 0;b < d.length;b += 2) {
        var e = !1;
        for (c = 0;c < a.length;c += 2) {
          if (zt(a[c], d[b])) {
            a[c + 1] = d[b + 1];
            e = !0;
            break;
          }
        }
        e || (a.push(d[b]), a.push(d[b + 1]));
      }
    }
    return new Tt(a);
  }
  var d = {}, e = [], f = 0;
  for (b = 0;b < a.length;b += 2) {
    c = Et(a[b]);
    var g = d[c];
    if (null == g) {
      e.push(c), d[c] = [a[b], a[b + 1]], f++;
    } else {
      var k = !0;
      for (c = 0;c < g.length;c += 2) {
        if (zt(g[c], a[b])) {
          g[c + 1] = a[b + 1];
          k = !1;
          break;
        }
      }
      k && (g.push(a[b]), g.push(a[b + 1]), f++);
    }
  }
  return new St(e, d, f);
}
function Zt(a) {
  this.map = a;
  this.size = a.size;
}
Zt.prototype.toString = function() {
  return Wt(this);
};
Zt.prototype.inspect = function() {
  return this.toString();
};
Zt.prototype.add = function(a) {
  this.map.set(a, a);
  this.size = this.map.size;
};
Zt.prototype.add = Zt.prototype.add;
Zt.prototype.clear = function() {
  this.map = new St;
  this.size = 0;
};
Zt.prototype.clear = Zt.prototype.clear;
Zt.prototype["delete"] = function(a) {
  a = this.map["delete"](a);
  this.size = this.map.size;
  return a;
};
Zt.prototype.entries = function() {
  return this.map.entries();
};
Zt.prototype.entries = Zt.prototype.entries;
Zt.prototype.forEach = function(a) {
  var b = this;
  this.map.forEach(function(c, d) {
    a(d, b);
  });
};
Zt.prototype.forEach = Zt.prototype.forEach;
Zt.prototype.has = function(a) {
  return this.map.has(a);
};
Zt.prototype.has = Zt.prototype.has;
Zt.prototype.keys = function() {
  return this.map.keys();
};
Zt.prototype.keys = Zt.prototype.keys;
Zt.prototype.Gc = function() {
  return this.map.Gc();
};
Zt.prototype.keySet = Zt.prototype.Gc;
Zt.prototype.values = function() {
  return this.map.values();
};
Zt.prototype.values = Zt.prototype.values;
Zt.prototype.clone = function() {
  var a = $t();
  this.forEach(function(b) {
    a.add(b);
  });
  return a;
};
Zt.prototype.clone = Zt.prototype.clone;
Zt.prototype[Gt] = function() {
  return this.values();
};
Zt.prototype.vb = function(a) {
  if (a instanceof Zt) {
    if (this.size === a.size) {
      return zt(this.map, a.map);
    }
  } else {
    return !1;
  }
};
Zt.prototype.Eb = function() {
  return Et(this.map);
};
function $t(a) {
  a = a || [];
  for (var b = {}, c = [], d = 0, e = 0;e < a.length;e++) {
    var f = Et(a[e]), g = b[f];
    if (null == g) {
      c.push(f), b[f] = [a[e], a[e]], d++;
    } else {
      for (var f = !0, k = 0;k < g.length;k += 2) {
        if (zt(g[k], a[e])) {
          f = !1;
          break;
        }
      }
      f && (g.push(a[e]), g.push(a[e]), d++);
    }
  }
  return new Zt(new St(c, b, d));
}
;function au(a, b) {
  if (3 < a.length) {
    if (b) {
      return !0;
    }
    var c = a.charAt(1);
    return "~" === a.charAt(0) ? ":" === c || "$" === c || "#" === c : !1;
  }
  return !1;
}
function bu(a) {
  var b = Math.floor(a / 44);
  a = String.fromCharCode(a % 44 + 48);
  return 0 === b ? "^" + a : "^" + String.fromCharCode(b + 48) + a;
}
function cu() {
  this.hg = this.Ad = this.fa = 0;
  this.cache = {};
}
cu.prototype.write = function(a, b) {
  if (au(a, b)) {
    4096 === this.hg ? (this.clear(), this.Ad = 0, this.cache = {}) : 1936 === this.fa && this.clear();
    var c = this.cache[a];
    return null == c ? (this.cache[a] = [bu(this.fa), this.Ad], this.fa++, a) : c[1] != this.Ad ? (c[1] = this.Ad, c[0] = bu(this.fa), this.fa++, a) : c[0];
  }
  return a;
};
cu.prototype.clear = function() {
  this.fa = 0;
  this.Ad++;
};
function du() {
  this.fa = 0;
  this.cache = [];
}
du.prototype.write = function(a) {
  1936 == this.fa && (this.fa = 0);
  this.cache[this.fa] = a;
  this.fa++;
  return a;
};
du.prototype.read = function(a) {
  return this.cache[2 === a.length ? a.charCodeAt(1) - 48 : 44 * (a.charCodeAt(1) - 48) + (a.charCodeAt(2) - 48)];
};
du.prototype.clear = function() {
  this.fa = 0;
};
function eu(a) {
  this.ab = a;
}
function fu(a) {
  this.options = a || {};
  this.Ba = {};
  for (var b in this.defaults.Ba) {
    this.Ba[b] = this.defaults.Ba[b];
  }
  for (b in this.options.handlers) {
    a: {
      switch(b) {
        case "_":
        ;
        case "s":
        ;
        case "?":
        ;
        case "i":
        ;
        case "d":
        ;
        case "b":
        ;
        case "'":
        ;
        case "array":
        ;
        case "map":
          a = !0;
          break a;
      }
      a = !1;
    }
    if (a) {
      throw Error('Cannot override handler for ground type "' + b + '"');
    }
    this.Ba[b] = this.options.handlers[b];
  }
  this.je = null != this.options.preferStrings ? this.options.preferStrings : this.defaults.je;
  this.Xe = null != this.options.preferBuffers ? this.options.preferBuffers : this.defaults.Xe;
  this.He = this.options.defaultHandler || this.defaults.He;
  this.xb = this.options.mapBuilder;
  this.Pc = this.options.arrayBuilder;
}
fu.prototype.defaults = {Ba:{_:function() {
  return null;
}, "?":function(a) {
  return "t" === a;
}, b:function(a, b) {
  var c;
  if (b && !1 === b.Xe || "undefined" == typeof Buffer) {
    if ("undefined" != typeof Uint8Array) {
      if ("undefined" != typeof atob) {
        c = atob(a);
      } else {
        c = String(a).replace(/=+$/, "");
        if (1 == c.length % 4) {
          throw Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }
        for (var d = 0, e, f, g = 0, k = "";f = c.charAt(g++);~f && (e = d % 4 ? 64 * e + f : f, d++ % 4) ? k += String.fromCharCode(255 & e >> (-2 * d & 6)) : 0) {
          f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(f);
        }
        c = k;
      }
      d = c.length;
      e = new Uint8Array(d);
      for (f = 0;f < d;f++) {
        e[f] = c.charCodeAt(f);
      }
      c = e;
    } else {
      c = It("b", a);
    }
  } else {
    c = new Buffer(a, "base64");
  }
  return c;
}, i:function(a) {
  "number" === typeof a || a instanceof Ab || (a = Lb(a, 10), a = a.de(Jt) || a.Zc(Kt) ? a : a.Ob());
  return a;
}, n:function(a) {
  return It("n", a);
}, d:function(a) {
  return parseFloat(a);
}, f:function(a) {
  return It("f", a);
}, c:function(a) {
  return a;
}, ":":function(a) {
  return new Lt(a);
}, $:function(a) {
  return new Mt(a);
}, r:function(a) {
  return It("r", a);
}, z:function(a) {
  a: {
    switch(a) {
      case "-INF":
        a = -Infinity;
        break a;
      case "INF":
        a = Infinity;
        break a;
      case "NaN":
        a = NaN;
        break a;
      default:
        throw Error("Invalid special double value " + a);;
    }
  }
  return a;
}, "'":function(a) {
  return a;
}, m:function(a) {
  a = "number" === typeof a ? a : parseInt(a, 10);
  return new Date(a);
}, t:function(a) {
  return new Date(a);
}, u:function(a) {
  a = a.replace(/-/g, "");
  for (var b = null, c = null, d = c = 0, e = 24, f = 0, f = c = 0, e = 24;8 > f;f += 2, e -= 8) {
    c |= parseInt(a.substring(f, f + 2), 16) << e;
  }
  d = 0;
  f = 8;
  for (e = 24;16 > f;f += 2, e -= 8) {
    d |= parseInt(a.substring(f, f + 2), 16) << e;
  }
  b = Kb(d, c);
  c = 0;
  f = 16;
  for (e = 24;24 > f;f += 2, e -= 8) {
    c |= parseInt(a.substring(f, f + 2), 16) << e;
  }
  d = 0;
  for (e = f = 24;32 > f;f += 2, e -= 8) {
    d |= parseInt(a.substring(f, f + 2), 16) << e;
  }
  c = Kb(d, c);
  return new Ot(b, c);
}, set:function(a) {
  return $t(a);
}, list:function(a) {
  return It("list", a);
}, link:function(a) {
  return It("link", a);
}, cmap:function(a) {
  return Yt(a, !1);
}}, He:function(a, b) {
  return It(a, b);
}, je:!0, Xe:!0};
fu.prototype.decode = function(a, b, c, d) {
  if (null == a) {
    return null;
  }
  switch(typeof a) {
    case "string":
      return au(a, c) ? (a = gu(this, a), b && b.write(a, c), b = a) : b = "^" === a.charAt(0) && " " !== a.charAt(1) ? b.read(a, c) : gu(this, a), b;
    case "object":
      if (wt(a)) {
        if ("^ " === a[0]) {
          if (this.xb) {
            if (17 > a.length && this.xb.Dc) {
              d = [];
              for (c = 1;c < a.length;c += 2) {
                d.push(this.decode(a[c], b, !0, !1)), d.push(this.decode(a[c + 1], b, !1, !1));
              }
              b = this.xb.Dc(d, a);
            } else {
              d = this.xb.Yc(a);
              for (c = 1;c < a.length;c += 2) {
                d = this.xb.add(d, this.decode(a[c], b, !0, !1), this.decode(a[c + 1], b, !1, !1), a);
              }
              b = this.xb.be(d, a);
            }
          } else {
            d = [];
            for (c = 1;c < a.length;c += 2) {
              d.push(this.decode(a[c], b, !0, !1)), d.push(this.decode(a[c + 1], b, !1, !1));
            }
            b = Yt(d, !1);
          }
        } else {
          b = hu(this, a, b, c, d);
        }
      } else {
        c = vt(a);
        var e = c[0];
        if ((d = 1 == c.length ? this.decode(e, b, !1, !1) : null) && d instanceof eu) {
          a = a[e], c = this.Ba[d.ab], b = null != c ? c(this.decode(a, b, !1, !0), this) : It(d.ab, this.decode(a, b, !1, !1));
        } else {
          if (this.xb) {
            if (16 > c.length && this.xb.Dc) {
              var f = [];
              for (d = 0;d < c.length;d++) {
                e = c[d], f.push(this.decode(e, b, !0, !1)), f.push(this.decode(a[e], b, !1, !1));
              }
              b = this.xb.Dc(f, a);
            } else {
              f = this.xb.Yc(a);
              for (d = 0;d < c.length;d++) {
                e = c[d], f = this.xb.add(f, this.decode(e, b, !0, !1), this.decode(a[e], b, !1, !1), a);
              }
              b = this.xb.be(f, a);
            }
          } else {
            f = [];
            for (d = 0;d < c.length;d++) {
              e = c[d], f.push(this.decode(e, b, !0, !1)), f.push(this.decode(a[e], b, !1, !1));
            }
            b = Yt(f, !1);
          }
        }
      }
      return b;
  }
  return a;
};
fu.prototype.decode = fu.prototype.decode;
function hu(a, b, c, d, e) {
  if (e) {
    var f = [];
    for (e = 0;e < b.length;e++) {
      f.push(a.decode(b[e], c, d, !1));
    }
    return f;
  }
  f = c && c.fa;
  if (2 === b.length && "string" === typeof b[0] && (e = a.decode(b[0], c, !1, !1)) && e instanceof eu) {
    return b = b[1], f = a.Ba[e.ab], null != f ? f = f(a.decode(b, c, d, !0), a) : It(e.ab, a.decode(b, c, d, !1));
  }
  c && f != c.fa && (c.fa = f);
  if (a.Pc) {
    if (32 >= b.length && a.Pc.Dc) {
      f = [];
      for (e = 0;e < b.length;e++) {
        f.push(a.decode(b[e], c, d, !1));
      }
      return a.Pc.Dc(f, b);
    }
    f = a.Pc.Yc(b);
    for (e = 0;e < b.length;e++) {
      f = a.Pc.add(f, a.decode(b[e], c, d, !1), b);
    }
    return a.Pc.be(f, b);
  }
  f = [];
  for (e = 0;e < b.length;e++) {
    f.push(a.decode(b[e], c, d, !1));
  }
  return f;
}
function gu(a, b) {
  if ("~" === b.charAt(0)) {
    var c = b.charAt(1);
    if ("~" === c || "^" === c || "`" === c) {
      return b.substring(1);
    }
    if ("#" === c) {
      return new eu(b.substring(2));
    }
    var d = a.Ba[c];
    return null == d ? a.He(c, b.substring(2)) : d(b.substring(2), a);
  }
  return b;
}
;function iu(a) {
  this.Bg = new fu(a);
}
function ju(a, b) {
  this.uh = a;
  this.options = b || {};
  this.cache = this.options.cache ? this.options.cache : new du;
}
ju.prototype.read = function(a) {
  var b = this.cache;
  a = this.uh.Bg.decode(JSON.parse(a), b);
  this.cache.clear();
  return a;
};
ju.prototype.read = ju.prototype.read;
var ku = 0, lu = (8 | 3 & Math.round(14 * Math.random())).toString(16), mu = "transit$guid$" + (xt() + xt() + xt() + xt() + xt() + xt() + xt() + xt() + "-" + xt() + xt() + xt() + xt() + "-4" + xt() + xt() + xt() + "-" + lu + xt() + xt() + xt() + "-" + xt() + xt() + xt() + xt() + xt() + xt() + xt() + xt() + xt() + xt() + xt() + xt());
function nu(a) {
  if (null == a) {
    return "null";
  }
  if (a === String) {
    return "string";
  }
  if (a === Boolean) {
    return "boolean";
  }
  if (a === Number) {
    return "number";
  }
  if (a === Array) {
    return "array";
  }
  if (a === Object) {
    return "map";
  }
  var b = a[mu];
  null == b && ("undefined" != typeof Object.defineProperty ? (b = ++ku, Object.defineProperty(a, mu, {value:b, enumerable:!1})) : a[mu] = b = ++ku);
  return b;
}
function ou(a, b) {
  for (var c = a.toString(), d = c.length;d < b;d++) {
    c = "0" + c;
  }
  return c;
}
function pu() {
}
pu.prototype.tag = function() {
  return "_";
};
pu.prototype.Y = function() {
  return null;
};
pu.prototype.qa = function() {
  return "null";
};
function qu() {
}
qu.prototype.tag = function() {
  return "s";
};
qu.prototype.Y = function(a) {
  return a;
};
qu.prototype.qa = function(a) {
  return a;
};
function ru() {
}
ru.prototype.tag = function() {
  return "i";
};
ru.prototype.Y = function(a) {
  return a;
};
ru.prototype.qa = function(a) {
  return a.toString();
};
function su() {
}
su.prototype.tag = function() {
  return "i";
};
su.prototype.Y = function(a) {
  return a.toString();
};
su.prototype.qa = function(a) {
  return a.toString();
};
function tu() {
}
tu.prototype.tag = function() {
  return "?";
};
tu.prototype.Y = function(a) {
  return a;
};
tu.prototype.qa = function(a) {
  return a.toString();
};
function uu() {
}
uu.prototype.tag = function() {
  return "array";
};
uu.prototype.Y = function(a) {
  return a;
};
uu.prototype.qa = function() {
  return null;
};
function vu() {
}
vu.prototype.tag = function() {
  return "map";
};
vu.prototype.Y = function(a) {
  return a;
};
vu.prototype.qa = function() {
  return null;
};
function wu() {
}
wu.prototype.tag = function() {
  return "t";
};
wu.prototype.Y = function(a) {
  return a.getUTCFullYear() + "-" + ou(a.getUTCMonth() + 1, 2) + "-" + ou(a.getUTCDate(), 2) + "T" + ou(a.getUTCHours(), 2) + ":" + ou(a.getUTCMinutes(), 2) + ":" + ou(a.getUTCSeconds(), 2) + "." + ou(a.getUTCMilliseconds(), 3) + "Z";
};
wu.prototype.qa = function(a, b) {
  return b.Y(a);
};
function xu() {
}
xu.prototype.tag = function() {
  return "m";
};
xu.prototype.Y = function(a) {
  return a.valueOf();
};
xu.prototype.qa = function(a) {
  return a.valueOf().toString();
};
function yu() {
}
yu.prototype.tag = function() {
  return "u";
};
yu.prototype.Y = function(a) {
  return a.toString();
};
yu.prototype.qa = function(a) {
  return a.toString();
};
function zu() {
}
zu.prototype.tag = function() {
  return ":";
};
zu.prototype.Y = function(a) {
  return a.ua;
};
zu.prototype.qa = function(a, b) {
  return b.Y(a);
};
function Au() {
}
Au.prototype.tag = function() {
  return "$";
};
Au.prototype.Y = function(a) {
  return a.ua;
};
Au.prototype.qa = function(a, b) {
  return b.Y(a);
};
function Bu() {
}
Bu.prototype.tag = function(a) {
  return a.tag;
};
Bu.prototype.Y = function(a) {
  return a.Y;
};
Bu.prototype.qa = function() {
  return null;
};
function Cu() {
}
Cu.prototype.tag = function() {
  return "set";
};
Cu.prototype.Y = function(a) {
  var b = [];
  a.forEach(function(a) {
    b.push(a);
  });
  return It("array", b);
};
Cu.prototype.qa = function() {
  return null;
};
function Du() {
}
Du.prototype.tag = function() {
  return "map";
};
Du.prototype.Y = function(a) {
  return a;
};
Du.prototype.qa = function() {
  return null;
};
function Eu() {
}
Eu.prototype.tag = function() {
  return "map";
};
Eu.prototype.Y = function(a) {
  return a;
};
Eu.prototype.qa = function() {
  return null;
};
function Fu() {
}
Fu.prototype.tag = function() {
  return "b";
};
Fu.prototype.Y = function(a) {
  return a.toString("base64");
};
Fu.prototype.qa = function() {
  return null;
};
function Gu() {
}
Gu.prototype.tag = function() {
  return "b";
};
Gu.prototype.Y = function(a) {
  for (var b = 0, c = a.length, d = "", e = null;b < c;) {
    e = a.subarray(b, Math.min(b + 32768, c)), d += String.fromCharCode.apply(null, e), b += 32768;
  }
  var f;
  if ("undefined" != typeof btoa) {
    f = btoa(d);
  } else {
    a = String(d);
    c = 0;
    d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d";
    for (e = "";a.charAt(c | 0) || (d = "\x3d", c % 1);e += d.charAt(63 & f >> 8 - c % 1 * 8)) {
      b = a.charCodeAt(c += .75);
      if (255 < b) {
        throw Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      f = f << 8 | b;
    }
    f = e;
  }
  return f;
};
Gu.prototype.qa = function() {
  return null;
};
function Hu() {
  this.Ba = {};
  this.set(null, new pu);
  this.set(String, new qu);
  this.set(Number, new ru);
  this.set(Ab, new su);
  this.set(Boolean, new tu);
  this.set(Array, new uu);
  this.set(Object, new vu);
  this.set(Date, new xu);
  this.set(Ot, new yu);
  this.set(Lt, new zu);
  this.set(Mt, new Au);
  this.set(Ht, new Bu);
  this.set(Zt, new Cu);
  this.set(Tt, new Du);
  this.set(St, new Eu);
  "undefined" != typeof Buffer && this.set(Buffer, new Fu);
  "undefined" != typeof Uint8Array && this.set(Uint8Array, new Gu);
}
Hu.prototype.get = function(a) {
  var b = null, b = "string" === typeof a ? this.Ba[a] : this.Ba[nu(a)];
  return null != b ? b : this.Ba["default"];
};
Hu.prototype.get = Hu.prototype.get;
Hu.prototype.set = function(a, b) {
  var c;
  if (c = "string" === typeof a) {
    a: {
      switch(a) {
        case "null":
        ;
        case "string":
        ;
        case "boolean":
        ;
        case "number":
        ;
        case "array":
        ;
        case "map":
          c = !1;
          break a;
      }
      c = !0;
    }
  }
  c ? this.Ba[a] = b : this.Ba[nu(a)] = b;
};
function Iu(a) {
  this.rc = a || {};
  this.je = null != this.rc.preferStrings ? this.rc.preferStrings : !0;
  this.Pf = this.rc.objectBuilder || null;
  this.Ba = new Hu;
  if (a = this.rc.handlers) {
    if (wt(a) || !a.forEach) {
      throw Error('transit writer "handlers" option must be a map');
    }
    var b = this;
    a.forEach(function(a, d) {
      if (void 0 !== d) {
        b.Ba.set(d, a);
      } else {
        throw Error("Cannot create handler for JavaScript undefined");
      }
    });
  }
  this.Cd = this.rc.handlerForForeign;
  this.qe = this.rc.unpack || function(a) {
    return a instanceof Tt && null === a.ga ? a.ha : !1;
  };
  this.Qd = this.rc && this.rc.verbose || !1;
}
Iu.prototype.jb = function(a) {
  var b = this.Ba.get(null == a ? null : a.constructor);
  return null != b ? b : (a = a && a.transitTag) ? this.Ba.get(a) : null;
};
function Ju(a, b, c, d, e) {
  a = a + b + c;
  return e ? e.write(a, d) : a;
}
function Ku(a, b, c) {
  var d = [];
  if (wt(b)) {
    for (var e = 0;e < b.length;e++) {
      d.push(Lu(a, b[e], !1, c));
    }
  } else {
    b.forEach(function(b) {
      d.push(Lu(a, b, !1, c));
    });
  }
  return d;
}
function Mu(a, b) {
  if ("string" !== typeof b) {
    var c = a.jb(b);
    return c && 1 === c.tag(b).length;
  }
  return !0;
}
function Nu(a, b) {
  var c = a.qe(b), d = !0;
  if (c) {
    for (var e = 0;e < c.length && (d = Mu(a, c[e]), d);e += 2) {
    }
    return d;
  }
  if (b.keys && (c = b.keys(), e = null, c.next)) {
    for (e = c.next();!e.done;) {
      d = Mu(a, e.value);
      if (!d) {
        break;
      }
      e = c.next();
    }
    return d;
  }
  if (b.forEach) {
    return b.forEach(function(b, c) {
      d = d && Mu(a, c);
    }), d;
  }
  throw Error("Cannot walk keys of object type " + (null == b ? null : b.constructor).name);
}
function Ou(a) {
  if (a.constructor.transit$isObject) {
    return !0;
  }
  var b = a.constructor.toString(), b = b.substr(9), b = b.substr(0, b.indexOf("("));
  isObject = "Object" == b;
  "undefined" != typeof Object.defineProperty ? Object.defineProperty(a.constructor, "transit$isObject", {value:isObject, enumerable:!1}) : a.constructor.transit$isObject = isObject;
  return isObject;
}
function Pu(a, b, c) {
  var d = null, e = null, f = null, d = null, g = 0;
  if (b.constructor === Object || null != b.forEach || a.Cd && Ou(b)) {
    if (a.Qd) {
      if (null != b.forEach) {
        if (Nu(a, b)) {
          var k = {};
          b.forEach(function(b, d) {
            k[Lu(a, d, !0, !1)] = Lu(a, b, !1, c);
          });
        } else {
          d = a.qe(b);
          e = [];
          f = Ju("~#", "cmap", "", !0, c);
          if (d) {
            for (;g < d.length;g += 2) {
              e.push(Lu(a, d[g], !1, !1)), e.push(Lu(a, d[g + 1], !1, c));
            }
          } else {
            b.forEach(function(b, d) {
              e.push(Lu(a, d, !1, !1));
              e.push(Lu(a, b, !1, c));
            });
          }
          k = {};
          k[f] = e;
        }
      } else {
        for (d = vt(b), k = {};g < d.length;g++) {
          k[Lu(a, d[g], !0, !1)] = Lu(a, b[d[g]], !1, c);
        }
      }
      return k;
    }
    if (null != b.forEach) {
      if (Nu(a, b)) {
        d = a.qe(b);
        k = ["^ "];
        if (d) {
          for (;g < d.length;g += 2) {
            k.push(Lu(a, d[g], !0, c)), k.push(Lu(a, d[g + 1], !1, c));
          }
        } else {
          b.forEach(function(b, d) {
            k.push(Lu(a, d, !0, c));
            k.push(Lu(a, b, !1, c));
          });
        }
        return k;
      }
      d = a.qe(b);
      e = [];
      f = Ju("~#", "cmap", "", !0, c);
      if (d) {
        for (;g < d.length;g += 2) {
          e.push(Lu(a, d[g], !1, c)), e.push(Lu(a, d[g + 1], !1, c));
        }
      } else {
        b.forEach(function(b, d) {
          e.push(Lu(a, d, !1, c));
          e.push(Lu(a, b, !1, c));
        });
      }
      return [f, e];
    }
    k = ["^ "];
    for (d = vt(b);g < d.length;g++) {
      k.push(Lu(a, d[g], !0, c)), k.push(Lu(a, b[d[g]], !1, c));
    }
    return k;
  }
  if (null != a.Pf) {
    return a.Pf(b, function(b) {
      return Lu(a, b, !0, c);
    }, function(b) {
      return Lu(a, b, !1, c);
    });
  }
  g = (null == b ? null : b.constructor).name;
  d = Error("Cannot write " + g);
  d.data = {We:b, type:g};
  throw d;
}
function Lu(a, b, c, d) {
  var e = a.jb(b) || (a.Cd ? a.Cd(b, a.Ba) : null), f = e ? e.tag(b) : null, g = e ? e.Y(b) : null;
  if (null != e && null != f) {
    switch(f) {
      case "_":
        return c ? Ju("~", "_", "", c, d) : null;
      case "s":
        return 0 < g.length ? (a = g.charAt(0), a = "~" === a || "^" === a || "`" === a ? "~" + g : g) : a = g, Ju("", "", a, c, d);
      case "?":
        return c ? Ju("~", "?", g.toString()[0], c, d) : g;
      case "i":
        return Infinity === g ? Ju("~", "z", "INF", c, d) : -Infinity === g ? Ju("~", "z", "-INF", c, d) : isNaN(g) ? Ju("~", "z", "NaN", c, d) : c || "string" === typeof g || g instanceof Ab ? Ju("~", "i", g.toString(), c, d) : g;
      case "d":
        return c ? Ju(g.xh, "d", g, c, d) : g;
      case "b":
        return Ju("~", "b", g, c, d);
      case "'":
        return a.Qd ? (b = {}, c = Ju("~#", "'", "", !0, d), b[c] = Lu(a, g, !1, d), d = b) : d = [Ju("~#", "'", "", !0, d), Lu(a, g, !1, d)], d;
      case "array":
        return Ku(a, g, d);
      case "map":
        return Pu(a, g, d);
      default:
        a: {
          if (1 === f.length) {
            if ("string" === typeof g) {
              d = Ju("~", f, g, c, d);
              break a;
            }
            if (c || a.je) {
              (a = a.Qd && new wu) ? (f = a.tag(b), g = a.qa(b, a)) : g = e.qa(b, e);
              if (null !== g) {
                d = Ju("~", f, g, c, d);
                break a;
              }
              d = Error('Tag "' + f + '" cannot be encoded as string');
              d.data = {tag:f, Y:g, We:b};
              throw d;
            }
          }
          b = f;
          c = g;
          a.Qd ? (g = {}, g[Ju("~#", b, "", !0, d)] = Lu(a, c, !1, d), d = g) : d = [Ju("~#", b, "", !0, d), Lu(a, c, !1, d)];
        }
        return d;
    }
  } else {
    throw d = (null == b ? null : b.constructor).name, a = Error("Cannot write " + d), a.data = {We:b, type:d}, a;
  }
}
function Qu(a, b) {
  var c = a.jb(b) || (a.Cd ? a.Cd(b, a.Ba) : null);
  if (null != c) {
    return 1 === c.tag(b).length ? It("'", b) : b;
  }
  var c = (null == b ? null : b.constructor).name, d = Error("Cannot write " + c);
  d.data = {We:b, type:c};
  throw d;
}
function Ru(a, b) {
  this.fd = a;
  this.options = b || {};
  this.cache = !1 === this.options.cache ? null : this.options.cache ? this.options.cache : new cu;
}
Ru.prototype.Mg = function() {
  return this.fd;
};
Ru.prototype.marshaller = Ru.prototype.Mg;
Ru.prototype.write = function(a, b) {
  var c = null, d = b || {}, c = d.asMapKey || !1, e = this.fd.Qd ? !1 : this.cache;
  !1 === d.marshalTop ? c = Lu(this.fd, a, c, e) : (d = this.fd, c = JSON.stringify(Lu(d, Qu(d, a), c, e)));
  null != this.cache && this.cache.clear();
  return c;
};
Ru.prototype.write = Ru.prototype.write;
Ru.prototype.register = function(a, b) {
  this.fd.Ba.set(a, b);
};
Ru.prototype.register = Ru.prototype.register;
function Su(a, b) {
  if ("json" === a || "json-verbose" === a || null == a) {
    var c = new iu(b);
    return new ju(c, b);
  }
  throw Error("Cannot create reader of type " + a);
}
function Tu(a, b) {
  if ("json" === a || "json-verbose" === a || null == a) {
    "json-verbose" === a && (null == b && (b = {}), b.verbose = !0);
    var c = new Iu(b);
    return new Ru(c, b);
  }
  c = Error('Type must be "json"');
  c.data = {type:a};
  throw c;
}
;Bj.prototype.I = function(a, b) {
  return b instanceof Bj ? this.Pb === b.Pb : b instanceof Ot ? this.Pb === b.toString() : !1;
};
Bj.prototype.zc = !0;
Bj.prototype.Zb = function(a, b) {
  if (b instanceof Bj || b instanceof Ot) {
    return af(this.toString(), b.toString());
  }
  throw Error([E("Cannot compare "), E(this), E(" to "), E(b)].join(""));
};
Ot.prototype.zc = !0;
Ot.prototype.Zb = function(a, b) {
  if (b instanceof Bj || b instanceof Ot) {
    return af(this.toString(), b.toString());
  }
  throw Error([E("Cannot compare "), E(this), E(" to "), E(b)].join(""));
};
Ab.prototype.I = function(a, b) {
  return this.equiv(b);
};
Ot.prototype.I = function(a, b) {
  return b instanceof Bj ? hd(b, this) : this.equiv(b);
};
Ht.prototype.I = function(a, b) {
  return this.equiv(b);
};
Ab.prototype.Ee = !0;
Ab.prototype.U = function() {
  return Et.h ? Et.h(this) : Et.call(null, this);
};
Ot.prototype.Ee = !0;
Ot.prototype.U = function() {
  return Ud(this.toString());
};
Ht.prototype.Ee = !0;
Ht.prototype.U = function() {
  return Et.h ? Et.h(this) : Et.call(null, this);
};
Ot.prototype.ja = !0;
Ot.prototype.V = function(a, b) {
  return qd(b, [E('#uuid "'), E(this.toString()), E('"')].join(""));
};
function Uu(a, b) {
  for (var c = x(Te(b)), d = null, e = 0, f = 0;;) {
    if (f < e) {
      var g = d.Z(null, f);
      a[g] = b[g];
      f += 1;
    } else {
      if (c = x(c)) {
        d = c, Se(d) ? (c = Ad(d), f = Bd(d), d = c, e = P(c), c = f) : (c = I(d), a[c] = b[c], c = K(d), d = null, e = 0), f = 0;
      } else {
        break;
      }
    }
  }
  return a;
}
function Vu() {
}
Vu.prototype.Yc = function() {
  return sd(cg);
};
Vu.prototype.add = function(a, b, c) {
  return Pf.l(a, b, c);
};
Vu.prototype.be = function(a) {
  return ud(a);
};
Vu.prototype.Dc = function(a) {
  return Fh.l ? Fh.l(a, !0, !0) : Fh.call(null, a, !0, !0);
};
function Wu() {
}
Wu.prototype.Yc = function() {
  return sd(De);
};
Wu.prototype.add = function(a, b) {
  return Of.j(a, b);
};
Wu.prototype.be = function(a) {
  return ud(a);
};
Wu.prototype.Dc = function(a) {
  return ch.j ? ch.j(a, !0) : ch.call(null, a, !0);
};
function Xu(a, b) {
  var c = Cf(a), d = Uu({handlers:gj(Ai.A(S([new q(null, 5, ["$", function() {
    return function(a) {
      return Xd.h(a);
    };
  }(c), ":", function() {
    return function(a) {
      return Bf.h(a);
    };
  }(c), "set", function() {
    return function(a) {
      return Ig.j(Ei, a);
    };
  }(c), "list", function() {
    return function(a) {
      return Ig.j(Zd, a.reverse());
    };
  }(c), "cmap", function() {
    return function(a) {
      for (var b = 0, c = sd(cg);;) {
        if (b < a.length) {
          var d = b + 2, c = Pf.l(c, a[b], a[b + 1]), b = d
        } else {
          return ud(c);
        }
      }
    };
  }(c)], null), Ml.h(b)], 0))), mapBuilder:new Vu, arrayBuilder:new Wu, prefersStrings:!1}, gj(Ge.j(b, Ml)));
  return Su.j ? Su.j(c, d) : Su.call(null, c, d);
}
function Yu() {
}
Yu.prototype.tag = function() {
  return ":";
};
Yu.prototype.Y = function(a) {
  return a.hb;
};
Yu.prototype.qa = function(a) {
  return a.hb;
};
function Zu() {
}
Zu.prototype.tag = function() {
  return "$";
};
Zu.prototype.Y = function(a) {
  return a.ab;
};
Zu.prototype.qa = function(a) {
  return a.ab;
};
function $u() {
}
$u.prototype.tag = function() {
  return "list";
};
$u.prototype.Y = function(a) {
  var b = [];
  a = x(a);
  for (var c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = c.Z(null, e);
      b.push(f);
      e += 1;
    } else {
      if (a = x(a)) {
        c = a, Se(c) ? (a = Ad(c), e = Bd(c), c = a, d = P(a), a = e) : (a = I(c), b.push(a), a = K(c), c = null, d = 0), e = 0;
      } else {
        break;
      }
    }
  }
  return It.j ? It.j("array", b) : It.call(null, "array", b);
};
$u.prototype.qa = function() {
  return null;
};
function av() {
}
av.prototype.tag = function() {
  return "map";
};
av.prototype.Y = function(a) {
  return a;
};
av.prototype.qa = function() {
  return null;
};
function bv() {
}
bv.prototype.tag = function() {
  return "set";
};
bv.prototype.Y = function(a) {
  var b = [];
  a = x(a);
  for (var c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = c.Z(null, e);
      b.push(f);
      e += 1;
    } else {
      if (a = x(a)) {
        c = a, Se(c) ? (a = Ad(c), e = Bd(c), c = a, d = P(a), a = e) : (a = I(c), b.push(a), a = K(c), c = null, d = 0), e = 0;
      } else {
        break;
      }
    }
  }
  return It.j ? It.j("array", b) : It.call(null, "array", b);
};
bv.prototype.qa = function() {
  return null;
};
function cv() {
}
cv.prototype.tag = function() {
  return "array";
};
cv.prototype.Y = function(a) {
  var b = [];
  a = x(a);
  for (var c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = c.Z(null, e);
      b.push(f);
      e += 1;
    } else {
      if (a = x(a)) {
        c = a, Se(c) ? (a = Ad(c), e = Bd(c), c = a, d = P(a), a = e) : (a = I(c), b.push(a), a = K(c), c = null, d = 0), e = 0;
      } else {
        break;
      }
    }
  }
  return b;
};
cv.prototype.qa = function() {
  return null;
};
function dv() {
}
dv.prototype.tag = function() {
  return "u";
};
dv.prototype.Y = function(a) {
  return a.Pb;
};
dv.prototype.qa = function(a) {
  return this.Y(a);
};
function ev(a, b) {
  var c = new Yu, d = new Zu, e = new $u, f = new av, g = new bv, k = new cv, l = new dv, n = Ai.A(S([Fe([fi, yf, q, ai, ph, w, X, vf, Df, jh, oh, ci, zi, yh, V, tf, te, Ci, vi, yi, fh, Fi, Hf, F, Bj, Ki, ji], [f, e, f, e, e, e, c, e, e, k, e, e, e, e, k, e, e, g, f, e, e, g, e, d, l, e, e]), Ml.h(b)], 0)), m = Cf(a), r = Uu({objectBuilder:function(a, b, c, d, e, f, g, k, l) {
    return function(m, n, r) {
      return gf(function() {
        return function(a, b, c) {
          a.push(n.h ? n.h(b) : n.call(null, b), r.h ? r.h(c) : r.call(null, c));
          return a;
        };
      }(a, b, c, d, e, f, g, k, l), m);
    };
  }(m, c, d, e, f, g, k, l, n), handlers:function() {
    var a = xc(n);
    a.forEach = function() {
      return function(a) {
        for (var b = x(this), c = null, d = 0, e = 0;;) {
          if (e < d) {
            var f = c.Z(null, e), g = T(f, 0, null), f = T(f, 1, null);
            a.j ? a.j(f, g) : a.call(null, f, g);
            e += 1;
          } else {
            if (b = x(b)) {
              Se(b) ? (c = Ad(b), b = Bd(b), g = c, d = P(c), c = g) : (c = I(b), g = T(c, 0, null), f = T(c, 1, null), a.j ? a.j(f, g) : a.call(null, f, g), b = K(b), c = null, d = 0), e = 0;
            } else {
              return null;
            }
          }
        }
      };
    }(a, m, c, d, e, f, g, k, l, n);
    return a;
  }(), unpack:function() {
    return function(a) {
      return a instanceof q ? a.o : !1;
    };
  }(m, c, d, e, f, g, k, l, n)}, gj(Ge.j(b, Ml)));
  return Tu.j ? Tu.j(m, r) : Tu.call(null, m, r);
}
;function fv(a) {
  var b = null != a && (a.v & 64 || a.R) ? Rf(qg, a) : a;
  a = H.j(b, mo);
  var c = H.j(b, Dn), d = H.j(b, cm), e = H.j(b, zn), b = H.j(b, Mn), f = E, g = new gp;
  hp(g, Cf(z(a) ? a : jn));
  jp(g, c);
  kp(g, d);
  lp(g, e);
  mp(g, b, !0);
  return "" + f(g);
}
function gv(a) {
  return Mo("-", wg.j(No, Po("" + E(a), /-/)));
}
function hv(a) {
  return gj(Ii(wg.j(gv, Ah(a)), Bh(a)));
}
function iv(a, b, c) {
  return ev(b, c).write(a);
}
function jv(a) {
  a = Aa(La(a)) ? null : JSON.parse(a);
  return z(a) ? jj(a, S([kj, !0], 0)) : null;
}
function kv(a) {
  a = gj(a);
  return JSON.stringify(a);
}
function lv(a) {
  return uc(function(a, c) {
    var d = Po(c, /:\s+/), e = T(d, 0, null), d = T(d, 1, null);
    return Aa(La(e)) || Aa(La(d)) ? a : U.l(a, e.toLowerCase(), d);
  }, cg, Po(z(a) ? a : "", /(\n)|(\r)|(\r\n)|(\n\r)/));
}
;var mv, nv, ov, pv = function pv(b, c) {
  if (null != b && null != b.Fe) {
    return b.Fe(0, c);
  }
  var d = pv[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = pv._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("ReadPort.take!", b);
}, qv = function qv(b, c, d) {
  if (null != b && null != b.Xd) {
    return b.Xd(0, c, d);
  }
  var e = qv[p(null == b ? null : b)];
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  e = qv._;
  if (null != e) {
    return e.l ? e.l(b, c, d) : e.call(null, b, c, d);
  }
  throw C("WritePort.put!", b);
}, rv = function rv(b) {
  if (null != b && null != b.Wd) {
    return b.Wd();
  }
  var c = rv[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = rv._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("Channel.close!", b);
}, sv = function sv(b) {
  if (null != b && null != b.nb) {
    return b.nb(b);
  }
  var c = sv[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = sv._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("Handler.active?", b);
}, tv = function tv(b) {
  if (null != b && null != b.gb) {
    return b.gb(b);
  }
  var c = tv[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = tv._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("Handler.commit", b);
}, uv = function uv(b, c) {
  if (null != b && null != b.Af) {
    return b.Af(0, c);
  }
  var d = uv[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = uv._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("Buffer.add!*", b);
}, vv = function vv(b) {
  for (var c = [], d = arguments.length, e = 0;;) {
    if (e < d) {
      c.push(arguments[e]), e += 1;
    } else {
      break;
    }
  }
  switch(c.length) {
    case 1:
      return vv.h(arguments[0]);
    case 2:
      return vv.j(arguments[0], arguments[1]);
    default:
      throw Error([E("Invalid arity: "), E(c.length)].join(""));;
  }
};
vv.h = function(a) {
  return a;
};
vv.j = function(a, b) {
  if (null == b) {
    throw Error("Assert failed: (not (nil? itm))");
  }
  return uv(a, b);
};
vv.L = 2;
function wv(a, b, c, d, e) {
  for (var f = 0;;) {
    if (f < e) {
      c[d + f] = a[b + f], f += 1;
    } else {
      break;
    }
  }
}
function xv(a, b, c, d) {
  this.head = a;
  this.aa = b;
  this.length = c;
  this.o = d;
}
xv.prototype.pop = function() {
  if (0 === this.length) {
    return null;
  }
  var a = this.o[this.aa];
  this.o[this.aa] = null;
  this.aa = (this.aa + 1) % this.o.length;
  --this.length;
  return a;
};
xv.prototype.unshift = function(a) {
  this.o[this.head] = a;
  this.head = (this.head + 1) % this.o.length;
  this.length += 1;
  return null;
};
function yv(a, b) {
  a.length + 1 === a.o.length && a.resize();
  a.unshift(b);
}
xv.prototype.resize = function() {
  var a = Array(2 * this.o.length);
  return this.aa < this.head ? (wv(this.o, this.aa, a, 0, this.length), this.aa = 0, this.head = this.length, this.o = a) : this.aa > this.head ? (wv(this.o, this.aa, a, 0, this.o.length - this.aa), wv(this.o, 0, a, this.o.length - this.aa, this.head), this.aa = 0, this.head = this.length, this.o = a) : this.aa === this.head ? (this.head = this.aa = 0, this.o = a) : null;
};
function zv(a, b) {
  for (var c = a.length, d = 0;;) {
    if (d < c) {
      var e = a.pop();
      (b.h ? b.h(e) : b.call(null, e)) && a.unshift(e);
      d += 1;
    } else {
      break;
    }
  }
}
function Av(a) {
  if (!(0 < a)) {
    throw Error([E("Assert failed: "), E("Can't create a ring buffer of size 0"), E("\n"), E("(\x3e n 0)")].join(""));
  }
  return new xv(0, 0, 0, Array(a));
}
function Bv(a, b) {
  this.X = a;
  this.n = b;
  this.v = 2;
  this.K = 0;
}
function Cv(a) {
  return a.X.length === a.n;
}
Bv.prototype.Af = function(a, b) {
  yv(this.X, b);
  return this;
};
Bv.prototype.ia = function() {
  return this.X.length;
};
if ("undefined" === typeof Dv) {
  var Dv = {}
}
;var Ev = Av(32), Fv = !1, Gv = !1;
function Hv() {
  Fv = !0;
  Gv = !1;
  for (var a = 0;;) {
    var b = Ev.pop();
    if (null != b && (b.w ? b.w() : b.call(null), 1024 > a)) {
      a += 1;
      continue;
    }
    break;
  }
  Fv = !1;
  return 0 < Ev.length ? Iv.w ? Iv.w() : Iv.call(null) : null;
}
function Iv() {
  var a = Gv;
  if (z(z(a) ? Fv : a)) {
    return null;
  }
  Gv = !0;
  return Np(Hv);
}
function Jv(a) {
  yv(Ev, a);
  return Iv();
}
function Kv(a, b) {
  setTimeout(a, b);
}
;var Lv, Mv = function Mv(b) {
  "undefined" === typeof Lv && (Lv = function(b, d, e) {
    this.gg = b;
    this.G = d;
    this.Og = e;
    this.v = 425984;
    this.K = 0;
  }, Lv.prototype.S = function(b, d) {
    return new Lv(this.gg, this.G, d);
  }, Lv.prototype.O = function() {
    return this.Og;
  }, Lv.prototype.ld = function() {
    return this.G;
  }, Lv.cc = function() {
    return new V(null, 3, 5, W, [xe(hm, new q(null, 1, [$f, xf(ag, xf(new V(null, 1, 5, W, [Hm], null)))], null)), Hm, co], null);
  }, Lv.Db = !0, Lv.ob = "cljs.core.async.impl.channels/t_cljs$core$async$impl$channels62084", Lv.Rb = function(b, d) {
    return qd(d, "cljs.core.async.impl.channels/t_cljs$core$async$impl$channels62084");
  });
  return new Lv(Mv, b, cg);
};
function Nv(a, b) {
  this.jb = a;
  this.G = b;
}
function Ov(a) {
  return sv(a.jb);
}
var Pv = function Pv(b) {
  if (null != b && null != b.zf) {
    return b.zf();
  }
  var c = Pv[p(null == b ? null : b)];
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  c = Pv._;
  if (null != c) {
    return c.h ? c.h(b) : c.call(null, b);
  }
  throw C("MMC.abort", b);
};
function Qv(a, b, c, d, e, f, g) {
  this.Lc = a;
  this.$d = b;
  this.tc = c;
  this.Zd = d;
  this.X = e;
  this.closed = f;
  this.ub = g;
}
Qv.prototype.zf = function() {
  for (;;) {
    var a = this.tc.pop();
    if (null != a) {
      var b = a.jb, c = a.G;
      if (b.nb(null)) {
        var d = b.gb(null);
        Jv(function(a) {
          return function() {
            return a.h ? a.h(!0) : a.call(null, !0);
          };
        }(d, b, c, a, this));
      } else {
        continue;
      }
    }
    break;
  }
  zv(this.tc, gg());
  return rv(this);
};
Qv.prototype.Xd = function(a, b, c) {
  var d = this;
  if (null == b) {
    throw Error([E("Assert failed: "), E("Can't put nil in on a channel"), E("\n"), E("(not (nil? val))")].join(""));
  }
  if ((a = d.closed) || !c.nb(null)) {
    return Mv(!a);
  }
  if (z(function() {
    var a = d.X;
    return z(a) ? nc(Cv(d.X)) : a;
  }())) {
    c.gb(null);
    for (c = ie(d.ub.j ? d.ub.j(d.X, b) : d.ub.call(null, d.X, b));;) {
      if (0 < d.Lc.length && 0 < P(d.X)) {
        var e = d.Lc.pop();
        if (e.nb(null)) {
          var f = e.gb(null), g = d.X.X.pop();
          Jv(function(a, b) {
            return function() {
              return a.h ? a.h(b) : a.call(null, b);
            };
          }(f, g, e, c, a, this));
        } else {
          continue;
        }
      }
      break;
    }
    c && Pv(this);
    return Mv(!0);
  }
  e = function() {
    for (;;) {
      var a = d.Lc.pop();
      if (z(a)) {
        if (z(a.nb(null))) {
          return a;
        }
      } else {
        return null;
      }
    }
  }();
  if (z(e)) {
    return f = tv(e), c.gb(null), Jv(function(a) {
      return function() {
        return a.h ? a.h(b) : a.call(null, b);
      };
    }(f, e, a, this)), Mv(!0);
  }
  64 < d.Zd ? (d.Zd = 0, zv(d.tc, Ov)) : d.Zd += 1;
  if (z(c.vd(null))) {
    if (!(1024 > d.tc.length)) {
      throw Error([E("Assert failed: "), E([E("No more than "), E(1024), E(" pending puts are allowed on a single channel."), E(" Consider using a windowed buffer.")].join("")), E("\n"), E("(\x3c (.-length puts) impl/MAX-QUEUE-SIZE)")].join(""));
    }
    yv(d.tc, new Nv(c, b));
  }
  return null;
};
Qv.prototype.Fe = function(a, b) {
  var c = this;
  if (b.nb(null)) {
    if (null != c.X && 0 < P(c.X)) {
      for (var d = b.gb(null), e = Mv(c.X.X.pop());;) {
        if (!z(Cv(c.X))) {
          var f = c.tc.pop();
          if (null != f) {
            var g = f.jb, k = f.G;
            if (g.nb(null)) {
              var l = g.gb(null);
              b.gb(null);
              Jv(function(a) {
                return function() {
                  return a.h ? a.h(!0) : a.call(null, !0);
                };
              }(l, g, k, f, d, e, this));
              ie(c.ub.j ? c.ub.j(c.X, k) : c.ub.call(null, c.X, k)) && Pv(this);
            }
            continue;
          }
        }
        break;
      }
      return e;
    }
    d = function() {
      for (;;) {
        var a = c.tc.pop();
        if (z(a)) {
          if (sv(a.jb)) {
            return a;
          }
        } else {
          return null;
        }
      }
    }();
    if (z(d)) {
      return e = tv(d.jb), b.gb(null), Jv(function(a) {
        return function() {
          return a.h ? a.h(!0) : a.call(null, !0);
        };
      }(e, d, this)), Mv(d.G);
    }
    if (z(c.closed)) {
      return z(c.X) && (c.ub.h ? c.ub.h(c.X) : c.ub.call(null, c.X)), z(function() {
        var a = b.nb(null);
        return z(a) ? b.gb(null) : a;
      }()) ? (d = function() {
        var a = c.X;
        return z(a) ? 0 < P(c.X) : a;
      }(), d = z(d) ? c.X.X.pop() : null, Mv(d)) : null;
    }
    64 < c.$d ? (c.$d = 0, zv(c.Lc, sv)) : c.$d += 1;
    if (z(b.vd(null))) {
      if (!(1024 > c.Lc.length)) {
        throw Error([E("Assert failed: "), E([E("No more than "), E(1024), E(" pending takes are allowed on a single channel.")].join("")), E("\n"), E("(\x3c (.-length takes) impl/MAX-QUEUE-SIZE)")].join(""));
      }
      yv(c.Lc, b);
    }
  }
  return null;
};
Qv.prototype.Wd = function() {
  var a = this;
  if (!a.closed) {
    for (a.closed = !0, z(function() {
      var b = a.X;
      return z(b) ? 0 === a.tc.length : b;
    }()) && (a.ub.h ? a.ub.h(a.X) : a.ub.call(null, a.X));;) {
      var b = a.Lc.pop();
      if (null == b) {
        break;
      } else {
        if (b.nb(null)) {
          var c = b.gb(null), d = z(function() {
            var b = a.X;
            return z(b) ? 0 < P(a.X) : b;
          }()) ? a.X.X.pop() : null;
          Jv(function(a, b) {
            return function() {
              return a.h ? a.h(b) : a.call(null, b);
            };
          }(c, d, b, this));
        }
      }
    }
  }
  return null;
};
function Rv(a) {
  console.log(a);
  return null;
}
function Sv(a, b) {
  var c = (z(null) ? null : Rv).call(null, b);
  return null == c ? a : vv.j(a, c);
}
function Tv(a) {
  return new Qv(Av(32), 0, Av(32), 0, a, !1, function() {
    return function(a) {
      return function() {
        function c(c, d) {
          try {
            return a.j ? a.j(c, d) : a.call(null, c, d);
          } catch (e) {
            return Sv(c, e);
          }
        }
        function d(c) {
          try {
            return a.h ? a.h(c) : a.call(null, c);
          } catch (d) {
            return Sv(c, d);
          }
        }
        var e = null, e = function(a, b) {
          switch(arguments.length) {
            case 1:
              return d.call(this, a);
            case 2:
              return c.call(this, a, b);
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        e.h = d;
        e.j = c;
        return e;
      }();
    }(z(null) ? null.h ? null.h(vv) : null.call(null, vv) : vv);
  }());
}
;var Uv, Vv = function Vv(b) {
  "undefined" === typeof Uv && (Uv = function(b, d, e) {
    this.Fg = b;
    this.zd = d;
    this.Pg = e;
    this.v = 393216;
    this.K = 0;
  }, Uv.prototype.S = function(b, d) {
    return new Uv(this.Fg, this.zd, d);
  }, Uv.prototype.O = function() {
    return this.Pg;
  }, Uv.prototype.nb = function() {
    return !0;
  }, Uv.prototype.vd = function() {
    return !0;
  }, Uv.prototype.gb = function() {
    return this.zd;
  }, Uv.cc = function() {
    return new V(null, 3, 5, W, [xe(Un, new q(null, 2, [Ak, !0, $f, xf(ag, xf(new V(null, 1, 5, W, [Lo], null)))], null)), Lo, Qm], null);
  }, Uv.Db = !0, Uv.ob = "cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers62116", Uv.Rb = function(b, d) {
    return qd(d, "cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers62116");
  });
  return new Uv(Vv, b, cg);
};
function Wv(a) {
  try {
    return a[0].call(null, a);
  } catch (b) {
    throw b instanceof Object && a[6].Wd(), b;
  }
}
function Xv(a, b, c) {
  c = c.Fe(0, Vv(function(c) {
    a[2] = c;
    a[1] = b;
    return Wv(a);
  }));
  return z(c) ? (a[2] = N.h ? N.h(c) : N.call(null, c), a[1] = b, Z) : null;
}
function Yv(a, b, c, d) {
  c = c.Xd(0, d, Vv(function(c) {
    a[2] = c;
    a[1] = b;
    return Wv(a);
  }));
  return z(c) ? (a[2] = N.h ? N.h(c) : N.call(null, c), a[1] = b, Z) : null;
}
function Zv(a, b) {
  var c = a[6];
  null != b && c.Xd(0, b, Vv(function() {
    return function() {
      return null;
    };
  }(c)));
  c.Wd();
  return c;
}
function $v(a, b, c, d, e, f, g, k) {
  this.Bb = a;
  this.Cb = b;
  this.Gb = c;
  this.Fb = d;
  this.Lb = e;
  this.sa = f;
  this.ca = g;
  this.F = k;
  this.v = 2229667594;
  this.K = 8192;
}
h = $v.prototype;
h.N = function(a, b) {
  return Kc.l(this, b, null);
};
h.M = function(a, b, c) {
  switch(b instanceof X ? b.hb : null) {
    case "catch-block":
      return this.Bb;
    case "catch-exception":
      return this.Cb;
    case "finally-block":
      return this.Gb;
    case "continue-block":
      return this.Fb;
    case "prev":
      return this.Lb;
    default:
      return H.l(this.ca, b, c);
  }
};
h.V = function(a, b, c) {
  return Qi(b, function() {
    return function(a) {
      return Qi(b, Xi, "", " ", "", c, a);
    };
  }(this), "#cljs.core.async.impl.ioc-helpers.ExceptionFrame{", ", ", "}", c, Nf.j(new V(null, 5, 5, W, [new V(null, 2, 5, W, [Cl, this.Bb], null), new V(null, 2, 5, W, [Om, this.Cb], null), new V(null, 2, 5, W, [Uk, this.Gb], null), new V(null, 2, 5, W, [an, this.Fb], null), new V(null, 2, 5, W, [Wm, this.Lb], null)], null), this.ca));
};
h.mb = function() {
  return new uh(0, this, 5, new V(null, 5, 5, W, [Cl, Om, Uk, an, Wm], null), Id(this.ca));
};
h.O = function() {
  return this.sa;
};
h.Xa = function() {
  return new $v(this.Bb, this.Cb, this.Gb, this.Fb, this.Lb, this.sa, this.ca, this.F);
};
h.ia = function() {
  return 5 + P(this.ca);
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = qf(this);
};
h.I = function(a, b) {
  var c;
  c = z(b) ? (c = this.constructor === b.constructor) ? th(this, b) : c : b;
  return z(c) ? !0 : !1;
};
h.Tc = function(a, b) {
  return Ze(new Ci(null, new q(null, 5, [Uk, null, Cl, null, Om, null, Wm, null, an, null], null), null), b) ? Ge.j(xe(Ig.j(cg, this), this.sa), b) : new $v(this.Bb, this.Cb, this.Gb, this.Fb, this.Lb, this.sa, Xf(Ge.j(this.ca, b)), null);
};
h.Qb = function(a, b, c) {
  return z(Y.j ? Y.j(Cl, b) : Y.call(null, Cl, b)) ? new $v(c, this.Cb, this.Gb, this.Fb, this.Lb, this.sa, this.ca, null) : z(Y.j ? Y.j(Om, b) : Y.call(null, Om, b)) ? new $v(this.Bb, c, this.Gb, this.Fb, this.Lb, this.sa, this.ca, null) : z(Y.j ? Y.j(Uk, b) : Y.call(null, Uk, b)) ? new $v(this.Bb, this.Cb, c, this.Fb, this.Lb, this.sa, this.ca, null) : z(Y.j ? Y.j(an, b) : Y.call(null, an, b)) ? new $v(this.Bb, this.Cb, this.Gb, c, this.Lb, this.sa, this.ca, null) : z(Y.j ? Y.j(Wm, b) : Y.call(null,
  Wm, b)) ? new $v(this.Bb, this.Cb, this.Gb, this.Fb, c, this.sa, this.ca, null) : new $v(this.Bb, this.Cb, this.Gb, this.Fb, this.Lb, this.sa, U.l(this.ca, b, c), null);
};
h.da = function() {
  return x(Nf.j(new V(null, 5, 5, W, [new V(null, 2, 5, W, [Cl, this.Bb], null), new V(null, 2, 5, W, [Om, this.Cb], null), new V(null, 2, 5, W, [Uk, this.Gb], null), new V(null, 2, 5, W, [an, this.Fb], null), new V(null, 2, 5, W, [Wm, this.Lb], null)], null), this.ca));
};
h.S = function(a, b) {
  return new $v(this.Bb, this.Cb, this.Gb, this.Fb, this.Lb, b, this.ca, this.F);
};
h.ea = function(a, b) {
  return Re(b) ? Nc(this, Ec.j(b, 0), Ec.j(b, 1)) : uc(Cc, this, b);
};
function aw(a, b, c) {
  a[4] = new $v(b, Object, null, c, a[4], null, null, null);
}
function bw(a) {
  for (;;) {
    var b = a[4], c = Cl.h(b), d = Om.h(b), e = a[5];
    if (z(function() {
      var a = e;
      return z(a) ? nc(b) : a;
    }())) {
      throw e;
    }
    if (z(function() {
      var a = e;
      return z(a) ? (a = c, z(a) ? M.j(Tk, d) || e instanceof d : a) : a;
    }())) {
      a[1] = c;
      a[2] = e;
      a[5] = null;
      a[4] = U.A(b, Cl, null, S([Om, null], 0));
      break;
    }
    if (z(function() {
      var a = e;
      return z(a) ? nc(c) && nc(Uk.h(b)) : a;
    }())) {
      a[4] = Wm.h(b);
    } else {
      if (z(function() {
        var a = e;
        return z(a) ? (a = nc(c)) ? Uk.h(b) : a : a;
      }())) {
        a[1] = Uk.h(b);
        a[4] = U.l(b, Uk, null);
        break;
      }
      if (z(function() {
        var a = nc(e);
        return a ? Uk.h(b) : a;
      }())) {
        a[1] = Uk.h(b);
        a[4] = U.l(b, Uk, null);
        break;
      }
      if (nc(e) && nc(Uk.h(b))) {
        a[1] = an.h(b);
        a[4] = Wm.h(b);
        break;
      }
      throw Error("No matching clause");
    }
  }
}
;function cw(a, b, c) {
  this.key = a;
  this.G = b;
  this.forward = c;
  this.v = 2155872256;
  this.K = 0;
}
cw.prototype.da = function() {
  var a = this.key;
  return Cc(Cc(Zd, this.G), a);
};
cw.prototype.V = function(a, b, c) {
  return Qi(b, Xi, "[", " ", "]", c, this);
};
function dw(a, b, c) {
  c = Array(c + 1);
  for (var d = 0;;) {
    if (d < c.length) {
      c[d] = null, d += 1;
    } else {
      break;
    }
  }
  return new cw(a, b, c);
}
function ew(a, b, c, d) {
  for (;;) {
    if (0 > c) {
      return a;
    }
    a: {
      for (;;) {
        var e = a.forward[c];
        if (z(e)) {
          if (e.key < b) {
            a = e;
          } else {
            break a;
          }
        } else {
          break a;
        }
      }
    }
    null != d && (d[c] = a);
    --c;
  }
}
function fw(a, b) {
  this.header = a;
  this.level = b;
  this.v = 2155872256;
  this.K = 0;
}
fw.prototype.put = function(a, b) {
  var c = Array(15), d = ew(this.header, a, this.level, c).forward[0];
  if (null != d && d.key === a) {
    return d.G = b;
  }
  a: {
    for (d = 0;;) {
      if (.5 > Math.random() && 15 > d) {
        d += 1;
      } else {
        break a;
      }
    }
  }
  if (d > this.level) {
    for (var e = this.level + 1;;) {
      if (e <= d + 1) {
        c[e] = this.header, e += 1;
      } else {
        break;
      }
    }
    this.level = d;
  }
  for (d = dw(a, b, Array(d));;) {
    return 0 <= this.level ? (c = c[0].forward, d.forward[0] = c[0], c[0] = d) : null;
  }
};
fw.prototype.remove = function(a) {
  var b = Array(15), c = ew(this.header, a, this.level, b).forward[0];
  if (null != c && c.key === a) {
    for (a = 0;;) {
      if (a <= this.level) {
        var d = b[a].forward;
        d[a] === c && (d[a] = c.forward[a]);
        a += 1;
      } else {
        break;
      }
    }
    for (;;) {
      if (0 < this.level && null == this.header.forward[this.level]) {
        --this.level;
      } else {
        return null;
      }
    }
  } else {
    return null;
  }
};
function gw(a) {
  for (var b = hw, c = b.header, d = b.level;;) {
    if (0 > d) {
      return c === b.header ? null : c;
    }
    var e;
    a: {
      for (e = c;;) {
        e = e.forward[d];
        if (null == e) {
          e = null;
          break a;
        }
        if (e.key >= a) {
          break a;
        }
      }
    }
    null != e ? (--d, c = e) : --d;
  }
}
fw.prototype.da = function() {
  return function(a) {
    return function c(d) {
      return new Df(null, function() {
        return function() {
          return null == d ? null : ve(new V(null, 2, 5, W, [d.key, d.G], null), c(d.forward[0]));
        };
      }(a), null, null);
    };
  }(this)(this.header.forward[0]);
};
fw.prototype.V = function(a, b, c) {
  return Qi(b, function() {
    return function(a) {
      return Qi(b, Xi, "", " ", "", c, a);
    };
  }(this), "{", ", ", "}", c, this);
};
var hw = new fw(dw(null, null, 0), 0);
function iw(a) {
  var b = (new Date).valueOf() + a, c = gw(b), d = z(z(c) ? c.key < b + 10 : c) ? c.G : null;
  if (z(d)) {
    return d;
  }
  var e = Tv(null);
  hw.put(b, e);
  Kv(function(a, b, c) {
    return function() {
      hw.remove(c);
      return rv(a);
    };
  }(e, d, b, c), a);
  return e;
}
;function jw(a) {
  "undefined" === typeof mv && (mv = function(a, c, d) {
    this.zd = a;
    this.pf = c;
    this.Qg = d;
    this.v = 393216;
    this.K = 0;
  }, mv.prototype.S = function(a, c) {
    return new mv(this.zd, this.pf, c);
  }, mv.prototype.O = function() {
    return this.Qg;
  }, mv.prototype.nb = function() {
    return !0;
  }, mv.prototype.vd = function() {
    return this.pf;
  }, mv.prototype.gb = function() {
    return this.zd;
  }, mv.cc = function() {
    return new V(null, 3, 5, W, [Lo, pk, Bm], null);
  }, mv.Db = !0, mv.ob = "cljs.core.async/t_cljs$core$async62219", mv.Rb = function(a, c) {
    return qd(c, "cljs.core.async/t_cljs$core$async62219");
  });
  return new mv(a, !0, cg);
}
function kw(a) {
  a = M.j(a, 0) ? null : a;
  if (z(null) && !z(a)) {
    throw Error([E("Assert failed: "), E("buffer must be supplied when transducer is"), E("\n"), E("buf-or-n")].join(""));
  }
  a = "number" === typeof a ? new Bv(Av(a), a) : a;
  return Tv(a);
}
function lw() {
  throw Error("\x3c! used not in (go ...) block");
}
function mw(a, b) {
  var c = pv(a, jw(b));
  if (z(c)) {
    var d = N.h ? N.h(c) : N.call(null, c);
    z(!0) ? b.h ? b.h(d) : b.call(null, d) : Jv(function(a) {
      return function() {
        return b.h ? b.h(a) : b.call(null, a);
      };
    }(d, c));
  }
  return null;
}
var nw = jw(function() {
  return null;
});
function ow(a, b) {
  var c = qv(a, b, nw);
  return z(c) ? N.h ? N.h(c) : N.call(null, c) : !0;
}
function pw(a) {
  for (var b = Array(a), c = 0;;) {
    if (c < a) {
      b[c] = 0, c += 1;
    } else {
      break;
    }
  }
  for (c = 1;;) {
    if (M.j(c, a)) {
      return b;
    }
    var d = Math.floor(Math.random() * c);
    b[c] = b[d];
    b[d] = c;
    c += 1;
  }
}
var qw = function qw() {
  var b = pg ? pg(!0) : og.call(null, !0);
  "undefined" === typeof nv && (nv = function(b, d, e) {
    this.dg = b;
    this.bc = d;
    this.Rg = e;
    this.v = 393216;
    this.K = 0;
  }, nv.prototype.S = function() {
    return function(b, d) {
      return new nv(this.dg, this.bc, d);
    };
  }(b), nv.prototype.O = function() {
    return function() {
      return this.Rg;
    };
  }(b), nv.prototype.nb = function() {
    return function() {
      return N.h ? N.h(this.bc) : N.call(null, this.bc);
    };
  }(b), nv.prototype.vd = function() {
    return function() {
      return !0;
    };
  }(b), nv.prototype.gb = function() {
    return function() {
      sg.j ? sg.j(this.bc, null) : sg.call(null, this.bc, null);
      return !0;
    };
  }(b), nv.cc = function() {
    return function() {
      return new V(null, 3, 5, W, [xe(Tl, new q(null, 2, [Ak, !0, $f, xf(ag, xf(De))], null)), dm, Rk], null);
    };
  }(b), nv.Db = !0, nv.ob = "cljs.core.async/t_cljs$core$async62264", nv.Rb = function() {
    return function(b, d) {
      return qd(d, "cljs.core.async/t_cljs$core$async62264");
    };
  }(b));
  return new nv(qw, b, cg);
}, rw = function rw(b, c) {
  "undefined" === typeof ov && (ov = function(b, c, f, g) {
    this.eg = b;
    this.bc = c;
    this.jd = f;
    this.Sg = g;
    this.v = 393216;
    this.K = 0;
  }, ov.prototype.S = function(b, c) {
    return new ov(this.eg, this.bc, this.jd, c);
  }, ov.prototype.O = function() {
    return this.Sg;
  }, ov.prototype.nb = function() {
    return sv(this.bc);
  }, ov.prototype.vd = function() {
    return !0;
  }, ov.prototype.gb = function() {
    tv(this.bc);
    return this.jd;
  }, ov.cc = function() {
    return new V(null, 4, 5, W, [xe(Hn, new q(null, 2, [Ak, !0, $f, xf(ag, xf(new V(null, 2, 5, W, [dm, Vk], null)))], null)), dm, Vk, zo], null);
  }, ov.Db = !0, ov.ob = "cljs.core.async/t_cljs$core$async62270", ov.Rb = function(b, c) {
    return qd(c, "cljs.core.async/t_cljs$core$async62270");
  });
  return new ov(rw, b, c, cg);
};
function sw(a, b, c) {
  var d = qw(), e = P(b), f = pw(e), g = Em.h(c), k = function() {
    for (var c = 0;;) {
      if (c < e) {
        var k = z(g) ? c : f[c], m = qe(b, k), r = Re(m) ? m.h ? m.h(0) : m.call(null, 0) : null, t = z(r) ? function() {
          var b = m.h ? m.h(1) : m.call(null, 1);
          return qv(r, b, rw(d, function(b, c, d, e, f) {
            return function(b) {
              b = new V(null, 2, 5, W, [b, f], null);
              return a.h ? a.h(b) : a.call(null, b);
            };
          }(c, b, k, m, r, d, e, f, g)));
        }() : pv(m, rw(d, function(b, c, d) {
          return function(b) {
            b = new V(null, 2, 5, W, [b, d], null);
            return a.h ? a.h(b) : a.call(null, b);
          };
        }(c, k, m, r, d, e, f, g)));
        if (z(t)) {
          return Mv(new V(null, 2, 5, W, [N.h ? N.h(t) : N.call(null, t), function() {
            var a = r;
            return z(a) ? a : m;
          }()], null));
        }
        c += 1;
      } else {
        return null;
      }
    }
  }();
  return z(k) ? k : Ze(c, Tk) && (k = function() {
    var a = sv(d);
    return z(a) ? tv(d) : a;
  }(), z(k)) ? Mv(new V(null, 2, 5, W, [Tk.h(c), Tk], null)) : null;
}
function tw(a, b) {
  var c = kw(1);
  Jv(function(c) {
    return function() {
      var e = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function() {
          return function(c) {
            var d = c[1];
            return 7 === d ? (c[2] = c[2], c[1] = 3, Z) : 1 === d ? (c[2] = null, c[1] = 2, Z) : 4 === d ? (d = c[7], d = c[2], c[7] = d, c[1] = z(null == d) ? 5 : 6, Z) : 13 === d ? (c[2] = null, c[1] = 14, Z) : 6 === d ? (d = c[7], Yv(c, 11, b, d)) : 3 === d ? Zv(c, c[2]) : 12 === d ? (c[2] = null, c[1] = 2, Z) : 2 === d ? Xv(c, 4, a) : 11 === d ? (c[1] = z(c[2]) ? 12 : 13, Z) : 9 === d ? (c[2] = null, c[1] = 10, Z) : 5 === d ? (c[1] = z(!0) ? 8 : 9, Z) : 14 === d || 10 === d ? (c[2] = c[2], c[1] =
            7, Z) : 8 === d ? (d = rv(b), c[2] = d, c[1] = 10, Z) : null;
          };
        }(c), c);
      }(), f = function() {
        var a = e.w ? e.w() : e.call(null);
        a[6] = c;
        return a;
      }();
      return Wv(f);
    };
  }(c));
  return b;
}
function uw(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  return vw(arguments[0], arguments[1], arguments[2], 3 < b.length ? new w(b.slice(3), 0, null) : null);
}
function vw(a, b, c, d) {
  var e = null != d && (d.v & 64 || d.R) ? Rf(qg, d) : d;
  a[1] = b;
  b = sw(function() {
    return function(b) {
      a[2] = b;
      return Wv(a);
    };
  }(d, e, e), c, e);
  return z(b) ? (a[2] = N.h ? N.h(b) : N.call(null, b), Z) : null;
}
function ww(a, b) {
  return xw(a, b);
}
function xw(a, b) {
  var c = dh(b), d = kw(null), e = P(c), f = Kf(e), g = kw(1), k = pg ? pg(null) : og.call(null, null), l = Jg(function(a, b, c, d, e, f) {
    return function(g) {
      return function(a, b, c, d, e, f) {
        return function(a) {
          d[g] = a;
          return 0 === tg.j(f, kf) ? ow(e, d.slice(0)) : null;
        };
      }(a, b, c, d, e, f);
    };
  }(c, d, e, f, g, k), new Ki(null, 0, e, 1, null)), n = kw(1);
  Jv(function(b, c, d, e, f, g, k, l) {
    return function() {
      var n = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function(b, c, d, e, f, g, k, l) {
          return function(b) {
            var f = b[1];
            if (7 === f) {
              return b[2] = null, b[1] = 8, Z;
            }
            if (1 === f) {
              return b[2] = null, b[1] = 2, Z;
            }
            if (4 === f) {
              return f = b[7], b[1] = z(f < e) ? 6 : 7, Z;
            }
            if (15 === f) {
              return b[2] = b[2], b[1] = 3, Z;
            }
            if (13 === f) {
              return f = rv(d), b[2] = f, b[1] = 15, Z;
            }
            if (6 === f) {
              return b[2] = null, b[1] = 11, Z;
            }
            if (3 === f) {
              return Zv(b, b[2]);
            }
            if (12 === f) {
              var f = b[8], f = b[2], m = eg(lc, f);
              b[8] = f;
              b[1] = z(m) ? 13 : 14;
              return Z;
            }
            return 2 === f ? (f = sg.j ? sg.j(k, e) : sg.call(null, k, e), b[7] = 0, b[9] = f, b[2] = null, b[1] = 4, Z) : 11 === f ? (f = b[7], aw(b, 10, 9), m = c.h ? c.h(f) : c.call(null, f), f = l.h ? l.h(f) : l.call(null, f), f = mw(m, f), b[2] = f, bw(b), Z) : 9 === f ? (f = b[7], m = b[2], b[7] = f + 1, b[10] = m, b[2] = null, b[1] = 4, Z) : 5 === f ? (b[11] = b[2], Xv(b, 12, g)) : 14 === f ? (f = b[8], f = Rf(a, f), Yv(b, 16, d, f)) : 16 === f ? (b[12] = b[2], b[2] = null, b[1] = 2, Z) :
            10 === f ? (m = b[2], f = tg.j(k, kf), b[13] = m, b[2] = f, bw(b), Z) : 8 === f ? (b[2] = b[2], b[1] = 5, Z) : null;
          };
        }(b, c, d, e, f, g, k, l), b, c, d, e, f, g, k, l);
      }(), L = function() {
        var a = n.w ? n.w() : n.call(null);
        a[6] = b;
        return a;
      }();
      return Wv(L);
    };
  }(n, c, d, e, f, g, k, l));
  return d;
}
;var yw, zw = cg;
yw = pg ? pg(zw) : og.call(null, zw);
function Aw(a, b) {
  var c = Ii(wg.j(gv, Ah(b)), Bh(b));
  Li(wg.j(function() {
    return function(b) {
      var c = T(b, 0, null);
      b = T(b, 1, null);
      return a.headers.set(c, b);
    };
  }(c), c));
}
function Bw(a, b) {
  js(a, function() {
    if (M.j(Xn, b)) {
      return "arraybuffer";
    }
    if (M.j(om, b)) {
      return "blob";
    }
    if (M.j(im, b)) {
      return "document";
    }
    if (M.j(Jo, b)) {
      return "text";
    }
    if (M.j(Tk, b) || M.j(null, b)) {
      return es;
    }
    throw Error([E("No matching clause: "), E(b)].join(""));
  }());
}
function Cw(a) {
  var b = null != a && (a.v & 64 || a.R) ? Rf(qg, a) : a, c = H.j(b, rm);
  a = H.j(b, pm);
  var d = H.j(b, Ek), b = In.h(b), b = z(b) ? b : 0, c = null == c ? !0 : c, e = new ds;
  Aw(e, a);
  Bw(e, d);
  e.cd = Math.max(0, b);
  e.ef = c;
  return e;
}
var Dw = Fe([0, 7, 1, 4, 6, 3, 2, 9, 5, 8], [fm, Rl, to, ko, $l, zm, jk, Nj, wn, In]);
function Ew(a) {
  var b = null != a && (a.v & 64 || a.R) ? Rf(qg, a) : a, c = H.j(b, vo), d = H.j(b, bm), e = H.j(b, Sn), f = H.j(b, rm), g = H.j(b, vn), k = H.j(b, On), l = kw(null), n = fv(b), m = Cf(z(c) ? c : Zj), r = hv(d), t = Cw(b);
  tg.J(yw, U, l, t);
  yr(t, "complete", function(a, b, c, d, e, f, g, k, l, m, n, r, t) {
    return function(c) {
      c = c.target;
      var d = rs(c), f = ss(c), g = us(c), k = lv(c.getAllResponseHeaders()), l = new V(null, 2, 5, W, [b, String(c.Hd)], null), m;
      m = c.Ic;
      m = Dw.h ? Dw.h(m) : Dw.call(null, m);
      c = new q(null, 7, [Jm, d, Am, f, Sn, g, bm, k, po, l, gm, m, bn, ha(c.pc) ? c.pc : String(c.pc)], null);
      nc(M.j(e.Ic, 7)) && ow(a, c);
      tg.l(yw, Ge, a);
      z(t) && rv(t);
      return rv(a);
    };
  }(l, n, m, r, t, a, b, b, c, d, e, f, g, k));
  if (z(k)) {
    var u = function(a, b, c, d, e, f, g, k, l, m, n, r, t, u) {
      return function(a, b) {
        return ow(u, Ai.A(S([new q(null, 2, [ro, a, ql, b.loaded], null), z(b.lengthComputable) ? new q(null, 1, [qm, b.total], null) : null], 0)));
      };
    }(l, n, m, r, t, a, b, b, c, d, e, f, g, k);
    t.Vf = !0;
    yr(t, "uploadprogress", ig(u, uo));
    yr(t, "downloadprogress", ig(u, Zn));
  }
  t.send(n, m, e, r);
  z(g) && (u = kw(1), Jv(function(a, b, c, d, e, f, g, k, l, m, n, r, t, u, ta) {
    return function() {
      var pa = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function(a, b, c, d, e, f, g, k, l, m, n, r, t, u) {
          return function(a) {
            var b = a[1];
            return 1 === b ? Xv(a, 2, u) : 2 === b ? (b = nc(4 == qs(f)), a[7] = a[2], a[1] = b ? 3 : 4, Z) : 3 === b ? (b = f.abort(), a[2] = b, a[1] = 5, Z) : 4 === b ? (a[2] = null, a[1] = 5, Z) : 5 === b ? Zv(a, a[2]) : null;
          };
        }(a, b, c, d, e, f, g, k, l, m, n, r, t, u, ta), a, b, c, d, e, f, g, k, l, m, n, r, t, u, ta);
      }(), Ga = function() {
        var b = pa.w ? pa.w() : pa.call(null);
        b[6] = a;
        return b;
      }();
      return Wv(Ga);
    };
  }(u, l, n, m, r, t, a, b, b, c, d, e, f, g, k)));
  return l;
}
function Fw(a) {
  var b = null != a && (a.v & 64 || a.R) ? Rf(qg, a) : a, c = H.j(b, In), d = H.j(b, hl), e = H.j(b, vn), f = H.l(b, qo, !0), g = kw(null), k = new br(fv(b), d);
  k.vc = c;
  var l = k.send(null, function(a, b, c, d, e, f, g, k, l) {
    return function(b) {
      b = new q(null, 3, [Jm, 200, Am, !0, Sn, jj(b, S([kj, l], 0))], null);
      ow(a, b);
      tg.l(yw, Ge, a);
      z(k) && rv(k);
      return rv(a);
    };
  }(g, k, a, b, b, c, d, e, f), function(a, b, c, d, e, f, g, k) {
    return function() {
      tg.l(yw, Ge, a);
      z(k) && rv(k);
      return rv(a);
    };
  }(g, k, a, b, b, c, d, e, f));
  tg.J(yw, U, g, new q(null, 2, [kk, k, Xj, l], null));
  if (z(e)) {
    var n = kw(1);
    Jv(function(a, b, c, d, e, f, g, k, l, n, R) {
      return function() {
        var wa = function() {
          return function(a) {
            return function() {
              function b(c) {
                for (;;) {
                  var d;
                  a: {
                    try {
                      for (;;) {
                        var e = a(c);
                        if (!Y(e, Z)) {
                          d = e;
                          break a;
                        }
                      }
                    } catch (f) {
                      if (f instanceof Object) {
                        c[5] = f, bw(c), d = Z;
                      } else {
                        throw f;
                      }
                    }
                  }
                  if (!Y(d, Z)) {
                    return d;
                  }
                }
              }
              function c() {
                var a = [null, null, null, null, null, null, null, null];
                a[0] = d;
                a[1] = 1;
                return a;
              }
              var d = null, d = function(a) {
                switch(arguments.length) {
                  case 0:
                    return c.call(this);
                  case 1:
                    return b.call(this, a);
                }
                throw Error("Invalid arity: " + arguments.length);
              };
              d.w = c;
              d.h = b;
              return d;
            }();
          }(function(a, b, c, d, e, f, g, k, l, m) {
            return function(a) {
              var c = a[1];
              if (1 === c) {
                return Xv(a, 2, m);
              }
              if (2 === c) {
                var c = a[2], e = d.cancel(b);
                a[7] = c;
                return Zv(a, e);
              }
              return null;
            };
          }(a, b, c, d, e, f, g, k, l, n, R), a, b, c, d, e, f, g, k, l, n, R);
        }(), J = function() {
          var b = wa.w ? wa.w() : wa.call(null);
          b[6] = a;
          return b;
        }();
        return Wv(J);
      };
    }(n, l, g, k, a, b, b, c, d, e, f));
  }
  return g;
}
;function Gw(a) {
  return Aa(La(a)) ? null : uc(function(a, c) {
    var d = Po(c, /=/), e = T(d, 0, null), d = T(d, 1, null);
    return U.l(a, Bf.h(ut(e)), ut(d));
  }, cg, Po("" + E(a), /&/));
}
function Hw(a) {
  if (Aa(La(a))) {
    return null;
  }
  a = a instanceof gp ? a.clone() : new gp(a, void 0);
  var b = a.yb, c = Bf.h(a.Wb), d = a.sc;
  return new q(null, 6, [mo, c, Dn, a.ac, cm, z(z(d) ? 0 < d : d) ? d : null, zn, a.Vb, Mn, nc(b.Re()) ? "" + E(b) : null, en, nc(b.Re()) ? Gw("" + E(b)) : null], null);
}
function Iw(a, b) {
  return [E(tt(Cf(a))), E("\x3d"), E(tt("" + E(b)))].join("");
}
function Jw(a, b) {
  return Mo("\x26", wg.j(function(b) {
    return Iw(a, b);
  }, b));
}
function Kw(a) {
  var b = T(a, 0, null);
  a = T(a, 1, null);
  return Le(a) ? Jw(b, a) : Iw(b, a);
}
var Hi = Ii("()*\x26^%$#!+", wg.j(function(a) {
  return [E("\\"), E(a)].join("");
}, "()*\x26^%$#!+"));
function Lw(a, b, c, d) {
  c = (d = Wf.j(lm, d)) ? (d = Wf.j(204, Jm.h(a))) ? Oi(Pi([E("(?i)"), E(ff(E, Gi(c)))].join("")), "" + E(H.l(bm.h(a), "content-type", ""))) : d : d;
  return z(c) ? Lg.l(a, new V(null, 1, 5, W, [Sn], null), b) : a;
}
function Mw(a, b) {
  var c = T(b, 0, null);
  return function(b, c) {
    return function(b) {
      var d;
      d = pm.h(b);
      d = z(d) ? d : c;
      z(d) && (b = U.l(b, pm, d));
      return a.h ? a.h(b) : a.call(null, b);
    };
  }(b, c);
}
function Nw(a, b) {
  var c = T(b, 0, null);
  return function(b, c) {
    return function(b) {
      var d;
      d = Ho.h(b);
      d = z(d) ? d : c;
      z(d) && (b = Kg(b, new V(null, 2, 5, W, [bm, "accept"], null), d));
      return a.h ? a.h(b) : a.call(null, b);
    };
  }(b, c);
}
function Ow(a, b) {
  var c = T(b, 0, null);
  return function(b, c) {
    return function(b) {
      var d;
      d = hn.h(b);
      d = z(d) ? d : c;
      z(d) && (b = Kg(b, new V(null, 2, 5, W, [bm, "content-type"], null), d));
      return a.h ? a.h(b) : a.call(null, b);
    };
  }(b, c);
}
var Pw = new q(null, 4, [Ij, Gn, dl, cg, Cn, Gn, Nm, cg], null);
function Qw(a) {
  var b = new FormData;
  a = x(a);
  for (var c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = c.Z(null, e), g = T(f, 0, null), f = T(f, 1, null);
      Le(f) ? b.append(Cf(g), I(f), Be(f)) : b.append(Cf(g), f);
      e += 1;
    } else {
      if (a = x(a)) {
        Se(a) ? (d = Ad(a), a = Bd(a), c = d, d = P(d)) : (d = I(a), c = T(d, 0, null), d = T(d, 1, null), Le(d) ? b.append(Cf(c), I(d), Be(d)) : b.append(Cf(c), d), a = K(a), c = null, d = 0), e = 0;
      } else {
        break;
      }
    }
  }
  return b;
}
function Rw(a, b) {
  var c = T(b, 0, null);
  return function(b, c) {
    return function(b) {
      var d, k = eo.h(b);
      d = z(k) ? k : c;
      if (Ke(d)) {
        return a.h ? a.h(b) : a.call(null, b);
      }
      b = Ge.j(b, eo);
      k = new V(null, 2, 5, W, [bm, "authorization"], null);
      if (z(d)) {
        var l = Pe(d) ? wg.j(d, new V(null, 2, 5, W, [kl, Ok], null)) : d;
        d = T(l, 0, null);
        l = T(l, 1, null);
        d = [E("Basic "), E(st([E(d), E(":"), E(l)].join("")))].join("");
      } else {
        d = null;
      }
      b = Kg(b, k, d);
      return a.h ? a.h(b) : a.call(null, b);
    };
  }(b, c);
}
var Sw = function(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  return Mw(arguments[0], 1 < b.length ? new w(b.slice(1), 0, null) : null);
}(function(a) {
  return function(b) {
    var c = zl.h(b);
    z(c) ? (b = a.h ? a.h(b) : a.call(null, b), c = tw(b, c)) : c = a.h ? a.h(b) : a.call(null, b);
    return c;
  };
}(function(a) {
  return function(b) {
    var c = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b, d = H.j(c, en), e = Hw(Zm.h(c));
    return z(e) ? (b = Lg.l(Ge.j(Ai.A(S([c, e], 0)), Zm), new V(null, 1, 5, W, [en], null), function(a, b, c, d, e, m) {
      return function(a) {
        return Ai.A(S([a, m], 0));
      };
    }(e, e, b, c, c, d)), a.h ? a.h(b) : a.call(null, b)) : a.h ? a.h(c) : a.call(null, c);
  };
}(function(a) {
  return function(b) {
    var c = Qk.h(b);
    z(c) && (b = U.l(Ge.j(b, Qk), vo, c));
    return a.h ? a.h(b) : a.call(null, b);
  };
}(function(a) {
  return function(b) {
    var c = ln.h(b);
    z(c) && (b = Kg(Ge.j(b, ln), new V(null, 2, 5, W, [bm, "authorization"], null), [E("Bearer "), E(c)].join("")));
    return a.h ? a.h(b) : a.call(null, b);
  };
}(function(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  return Rw(arguments[0], 1 < b.length ? new w(b.slice(1), 0, null) : null);
}(function(a) {
  return function(b) {
    b = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b;
    var c = H.j(b, en);
    z(c) && (b = U.l(Ge.j(b, en), Mn, Mo("\x26", wg.j(Kw, c))));
    return a.h ? a.h(b) : a.call(null, b);
  };
}(function(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  return Ow(arguments[0], 1 < b.length ? new w(b.slice(1), 0, null) : null);
}(function(a) {
  return function(b) {
    return ww(function(a) {
      return Lw(a, jv, "application/json", vo.h(b));
    }, new V(null, 1, 5, W, [a.h ? a.h(b) : a.call(null, b)], null));
  };
}(function(a) {
  return function(b) {
    var c = ck.h(b);
    if (z(c)) {
      var d = Ai.A(S([new q(null, 1, ["content-type", "application/json"], null), bm.h(b)], 0));
      b = U.l(U.l(Ge.j(b, ck), Sn, kv(c)), bm, d);
    }
    return a.h ? a.h(b) : a.call(null, b);
  };
}(function(a) {
  return function(b) {
    var c = Ai.A(S([Pw, Ln.h(b)], 0)), d = null != c && (c.v & 64 || c.R) ? Rf(qg, c) : c, e = H.j(d, Cn), f = H.j(d, Nm);
    return ww(function(a, c, d, e, f) {
      return function(a) {
        return Lw(a, f, "application/transit+json", vo.h(b));
      };
    }(c, d, e, f, function(a, b, c, d) {
      return function(a) {
        return Xu(c, d).read(a);
      };
    }(c, d, e, f)), new V(null, 1, 5, W, [a.h ? a.h(b) : a.call(null, b)], null));
  };
}(function(a) {
  return function(b) {
    var c = Pk.h(b);
    if (z(c)) {
      var d = Ai.A(S([Pw, Ln.h(b)], 0)), e = null != d && (d.v & 64 || d.R) ? Rf(qg, d) : d, d = H.j(e, Ij), e = H.j(e, dl), f = Ai.A(S([new q(null, 1, ["content-type", "application/transit+json"], null), bm.h(b)], 0));
      b = U.l(U.l(Ge.j(b, Pk), Sn, iv(c, d, e)), bm, f);
    }
    return a.h ? a.h(b) : a.call(null, b);
  };
}(function(a) {
  return function(b) {
    return ww(function(a) {
      return Lw(a, jt, "application/edn", vo.h(b));
    }, new V(null, 1, 5, W, [a.h ? a.h(b) : a.call(null, b)], null));
  };
}(function(a) {
  return function(b) {
    var c = $n.h(b);
    if (z(c)) {
      var d = Ai.A(S([new q(null, 1, ["content-type", "application/edn"], null), bm.h(b)], 0));
      b = U.l(U.l(Ge.j(b, $n), Sn, aj(S([c], 0), bc())), bm, d);
    }
    return a.h ? a.h(b) : a.call(null, b);
  };
}(function(a) {
  return function(b) {
    b = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b;
    var c = H.j(b, io), d = H.j(b, vo);
    z(z(c) ? (new Ci(null, new q(null, 4, [uk, null, Dl, null, nn, null, Fn, null], null), null)).call(null, d) : c) && (b = U.l(Ge.j(b, io), Sn, Qw(c)));
    return a.h ? a.h(b) : a.call(null, b);
  };
}(function(a) {
  return function(b) {
    b = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b;
    var c = H.j(b, Dm), d = H.j(b, vo), e = H.j(b, bm);
    z(z(c) ? (new Ci(null, new q(null, 4, [uk, null, Dl, null, nn, null, Fn, null], null), null)).call(null, d) : c) && (d = Ai.A(S([new q(null, 1, ["content-type", "application/x-www-form-urlencoded"], null), e], 0)), b = U.l(U.l(Ge.j(b, Dm), Sn, Mo("\x26", wg.j(Kw, c))), bm, d));
    return a.h ? a.h(b) : a.call(null, b);
  };
}(function(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  return Nw(arguments[0], 1 < b.length ? new w(b.slice(1), 0, null) : null);
}(function(a) {
  a = null != a && (a.v & 64 || a.R) ? Rf(qg, a) : a;
  var b = H.j(a, vo);
  return M.j(b, kk) ? Fw(a) : Ew(a);
})))))))))))))))));
function Tw(a, b) {
  var c = T(b, 0, null), c = Ai.A(S([c, new q(null, 2, [Qk, Zj, Zm, a], null)], 0));
  return Sw.h ? Sw.h(c) : Sw.call(null, c);
}
;var Uw = Pi("/");
function Vw(a) {
  if (Ke("" + E(a))) {
    return null;
  }
  a = M.j(a, "/") ? De : Po("" + E(a), Uw);
  if (M.j(0, P(a))) {
    return new V(null, 1, 5, W, [Im], null);
  }
  switch(I(a)) {
    case "":
      return Sf(eh, Im, Yd(a));
    case ".":
      return Sf(eh, ol, Yd(a));
    default:
      return Sf(eh, ol, a);
  }
}
function Ww(a) {
  switch(I(a) instanceof X ? I(a).hb : null) {
    case "root":
      return [E("/"), E(Mo("/", Yd(a)))].join("");
    case "cwd":
      return K(a) ? Mo("/", Yd(a)) : ".";
    default:
      return Mo("/", a);
  }
}
function Xw(a) {
  var b = new V(null, 1, 5, W, [I(a)], null);
  for (a = Yd(a);;) {
    var c = x(a);
    a = I(c);
    var d = K(c), c = a;
    a = d;
    var d = M, e = c;
    if (z(d.j ? d.j(null, e) : d.call(null, null, e))) {
      return b;
    }
    if (!z(d.j ? d.j("", e) : d.call(null, "", e)) && !z(d.j ? d.j(".", e) : d.call(null, ".", e))) {
      if (z(d.j ? d.j("..", e) : d.call(null, "..", e))) {
        a: {
          for (c = b;;) {
            if (d = K(c), null != d) {
              c = d;
            } else {
              c = I(c);
              break a;
            }
          }
        }
        b = M.j(ol, c) ? Ce.j(b, "..") : M.j("..", c) ? Ce.j(b, "..") : M.j(Im, c) ? b : null == b ? null : Vc(b);
      } else {
        b = Ce.j(b, c);
      }
    }
  }
}
;function Yw(a) {
  a = null == a ? null : "" + E(a);
  a = null == a ? null : encodeURIComponent(a);
  return null == a ? null : a.replace("+", "%20");
}
function Zw(a) {
  a = null == a ? null : "" + E(a);
  return null == a ? null : decodeURIComponent(a);
}
function $w(a) {
  a = x(a);
  var b = null == a ? null : df(a);
  a = null == b ? null : wg.j(function() {
    return function(a) {
      var b = T(a, 0, null);
      a = T(a, 1, null);
      return new V(null, 3, 5, W, [Yw(Cf(b)), "\x3d", Yw("" + E(a))], null);
    };
  }(a, b), b);
  a = null == a ? null : yg(Dg.j(Ag("\x26"), a));
  a = null == a ? null : Hg(a);
  return null == a ? null : Rf(E, a);
}
function ax(a) {
  return xg.j(2, Nf.j(Po(a, /=/), Ag("")));
}
function bx(a) {
  if (Aa(La(a))) {
    return null;
  }
  a = Po(a, /&/);
  a = null == a ? null : x(a);
  null == a ? a = null : (a = S([a], 0), a = Rf(Nf, Sf(wg, ax, a)));
  a = null == a ? null : wg.j(Zw, a);
  return null == a ? null : Rf(qg, a);
}
function cx(a, b) {
  return !Wf.j(null, b) || !Wf.j(-1, b) || 80 === b && M.j(a, "http") || 443 === b && M.j(a, "https") ? null : [E(":"), E(b)].join("");
}
function dx(a, b, c, d, e, f, g, k, l, n, m) {
  this.protocol = a;
  this.username = b;
  this.password = c;
  this.host = d;
  this.port = e;
  this.path = f;
  this.Wa = g;
  this.anchor = k;
  this.sa = l;
  this.ca = n;
  this.F = m;
  this.v = 2229667594;
  this.K = 8192;
}
h = dx.prototype;
h.toString = function() {
  var a;
  a = this.username;
  var b = this.password;
  a = z(a) ? [E(a), E(":"), E(b)].join("") : null;
  return [E(this.protocol), E("://"), E(a), E(z(a) ? "@" : null), E(this.host), E(cx(this.protocol, this.port)), E(this.path), E(x(this.Wa) ? [E("?"), E("string" === typeof this.Wa ? this.Wa : $w(this.Wa))].join("") : null), E(z(this.anchor) ? [E("#"), E(this.anchor)].join("") : null)].join("");
};
h.N = function(a, b) {
  return Kc.l(this, b, null);
};
h.M = function(a, b, c) {
  switch(b instanceof X ? b.hb : null) {
    case "protocol":
      return this.protocol;
    case "username":
      return this.username;
    case "password":
      return this.password;
    case "host":
      return this.host;
    case "port":
      return this.port;
    case "path":
      return this.path;
    case "query":
      return this.Wa;
    case "anchor":
      return this.anchor;
    default:
      return H.l(this.ca, b, c);
  }
};
h.V = function(a, b, c) {
  return Qi(b, function() {
    return function(a) {
      return Qi(b, Xi, "", " ", "", c, a);
    };
  }(this), "#cemerick.url.URL{", ", ", "}", c, Nf.j(new V(null, 8, 5, W, [new V(null, 2, 5, W, [Gk, this.protocol], null), new V(null, 2, 5, W, [kl, this.username], null), new V(null, 2, 5, W, [Ok, this.password], null), new V(null, 2, 5, W, [nm, this.host], null), new V(null, 2, 5, W, [Ol, this.port], null), new V(null, 2, 5, W, [Gj, this.path], null), new V(null, 2, 5, W, [Kn, this.Wa], null), new V(null, 2, 5, W, [Bn, this.anchor], null)], null), this.ca));
};
h.mb = function() {
  return new uh(0, this, 8, new V(null, 8, 5, W, [Gk, kl, Ok, nm, Ol, Gj, Kn, Bn], null), Id(this.ca));
};
h.O = function() {
  return this.sa;
};
h.Xa = function() {
  return new dx(this.protocol, this.username, this.password, this.host, this.port, this.path, this.Wa, this.anchor, this.sa, this.ca, this.F);
};
h.ia = function() {
  return 8 + P(this.ca);
};
h.U = function() {
  var a = this.F;
  return null != a ? a : this.F = a = qf(this);
};
h.I = function(a, b) {
  var c;
  c = z(b) ? (c = this.constructor === b.constructor) ? th(this, b) : c : b;
  return z(c) ? !0 : !1;
};
h.Tc = function(a, b) {
  return Ze(new Ci(null, new q(null, 8, [Gj, null, Gk, null, Ok, null, kl, null, Ol, null, nm, null, Bn, null, Kn, null], null), null), b) ? Ge.j(xe(Ig.j(cg, this), this.sa), b) : new dx(this.protocol, this.username, this.password, this.host, this.port, this.path, this.Wa, this.anchor, this.sa, Xf(Ge.j(this.ca, b)), null);
};
h.Qb = function(a, b, c) {
  return z(Y.j ? Y.j(Gk, b) : Y.call(null, Gk, b)) ? new dx(c, this.username, this.password, this.host, this.port, this.path, this.Wa, this.anchor, this.sa, this.ca, null) : z(Y.j ? Y.j(kl, b) : Y.call(null, kl, b)) ? new dx(this.protocol, c, this.password, this.host, this.port, this.path, this.Wa, this.anchor, this.sa, this.ca, null) : z(Y.j ? Y.j(Ok, b) : Y.call(null, Ok, b)) ? new dx(this.protocol, this.username, c, this.host, this.port, this.path, this.Wa, this.anchor, this.sa, this.ca, null) :
  z(Y.j ? Y.j(nm, b) : Y.call(null, nm, b)) ? new dx(this.protocol, this.username, this.password, c, this.port, this.path, this.Wa, this.anchor, this.sa, this.ca, null) : z(Y.j ? Y.j(Ol, b) : Y.call(null, Ol, b)) ? new dx(this.protocol, this.username, this.password, this.host, c, this.path, this.Wa, this.anchor, this.sa, this.ca, null) : z(Y.j ? Y.j(Gj, b) : Y.call(null, Gj, b)) ? new dx(this.protocol, this.username, this.password, this.host, this.port, c, this.Wa, this.anchor, this.sa, this.ca,
  null) : z(Y.j ? Y.j(Kn, b) : Y.call(null, Kn, b)) ? new dx(this.protocol, this.username, this.password, this.host, this.port, this.path, c, this.anchor, this.sa, this.ca, null) : z(Y.j ? Y.j(Bn, b) : Y.call(null, Bn, b)) ? new dx(this.protocol, this.username, this.password, this.host, this.port, this.path, this.Wa, c, this.sa, this.ca, null) : new dx(this.protocol, this.username, this.password, this.host, this.port, this.path, this.Wa, this.anchor, this.sa, U.l(this.ca, b, c), null);
};
h.da = function() {
  return x(Nf.j(new V(null, 8, 5, W, [new V(null, 2, 5, W, [Gk, this.protocol], null), new V(null, 2, 5, W, [kl, this.username], null), new V(null, 2, 5, W, [Ok, this.password], null), new V(null, 2, 5, W, [nm, this.host], null), new V(null, 2, 5, W, [Ol, this.port], null), new V(null, 2, 5, W, [Gj, this.path], null), new V(null, 2, 5, W, [Kn, this.Wa], null), new V(null, 2, 5, W, [Bn, this.anchor], null)], null), this.ca));
};
h.S = function(a, b) {
  return new dx(this.protocol, this.username, this.password, this.host, this.port, this.path, this.Wa, this.anchor, b, this.ca, this.F);
};
h.ea = function(a, b) {
  return Re(b) ? Nc(this, Ec.j(b, 0), Ec.j(b, 1)) : uc(Cc, this, b);
};
function ex(a, b, c) {
  return M.j(a, b) ? c : a;
}
function fx(a) {
  var b = new gp(a);
  a = Qo(function() {
    var a = b.wc;
    return z(a) ? a : "";
  }(), /:/, 2);
  var c = T(a, 0, null), d = T(a, 1, null);
  return new dx(b.Wb, function() {
    var a = x(c);
    return a ? c : a;
  }(), function() {
    var a = x(d);
    return a ? d : a;
  }(), b.ac, ex(b.sc, null, -1), Ww(Xw(Vw(b.Vb))), bx(ex(b.yb.toString(), "", null)), ex(b.mc, "", null), null, null, null);
}
function gx(a) {
  return a instanceof dx ? a : fx(a);
}
;function hx(a, b, c) {
  if (uf(c)) {
    return c = Rf(xf, wg.j(a, c)), b.h ? b.h(c) : b.call(null, c);
  }
  if (We(c)) {
    return c = Mi(wg.j(a, c)), b.h ? b.h(c) : b.call(null, c);
  }
  if (Qe(c)) {
    return c = uc(function(b, c) {
      return Ce.j(b, a.h ? a.h(c) : a.call(null, c));
    }, c, c), b.h ? b.h(c) : b.call(null, c);
  }
  Le(c) && (c = Ig.j(null == c ? null : Ac(c), wg.j(a, c)));
  return b.h ? b.h(c) : b.call(null, c);
}
var ix = function ix(b, c) {
  return hx(ig(ix, b), b, c);
};
function jx(a) {
  return ix(function(a) {
    return function(c) {
      return Pe(c) ? Ig.j(cg, wg.j(a, c)) : c;
    };
  }(function(a) {
    var c = T(a, 0, null);
    a = T(a, 1, null);
    return "string" === typeof c ? new V(null, 2, 5, W, [Bf.h(c), a], null) : new V(null, 2, 5, W, [c, a], null);
  }), a);
}
;function kx(a, b) {
  var c = z(a) ? gx(a) : gx(location.href);
  return "" + E(Kg(c, new V(null, 2, 5, W, [Kn, Cf(Ck)], null), b));
}
function lx(a, b) {
  return function(c) {
    return function() {
      var d = kw(1);
      Jv(function(c, d) {
        return function() {
          var g = function() {
            return function(a) {
              return function() {
                function b(c) {
                  for (;;) {
                    var d;
                    a: {
                      try {
                        for (;;) {
                          var e = a(c);
                          if (!Y(e, Z)) {
                            d = e;
                            break a;
                          }
                        }
                      } catch (f) {
                        if (f instanceof Object) {
                          c[5] = f, bw(c), d = Z;
                        } else {
                          throw f;
                        }
                      }
                    }
                    if (!Y(d, Z)) {
                      return d;
                    }
                  }
                }
                function c() {
                  var a = [null, null, null, null, null, null, null, null, null, null];
                  a[0] = d;
                  a[1] = 1;
                  return a;
                }
                var d = null, d = function(a) {
                  switch(arguments.length) {
                    case 0:
                      return c.call(this);
                    case 1:
                      return b.call(this, a);
                  }
                  throw Error("Invalid arity: " + arguments.length);
                };
                d.w = c;
                d.h = b;
                return d;
              }();
            }(function(c, d) {
              return function(c) {
                var e = c[1];
                if (1 === e) {
                  var e = tg.j(d, ge), f = iw(b);
                  c[7] = e;
                  return Xv(c, 2, f);
                }
                if (2 === e) {
                  var e = c[2], f = tg.j(d, kf), g = 0 === (N.h ? N.h(d) : N.call(null, d));
                  c[8] = e;
                  c[9] = f;
                  c[1] = z(g) ? 3 : 4;
                  return Z;
                }
                return 3 === e ? (e = a.w ? a.w() : a.call(null), c[2] = e, c[1] = 5, Z) : 4 === e ? (c[2] = null, c[1] = 5, Z) : 5 === e ? Zv(c, c[2]) : null;
              };
            }(c, d), c, d);
          }(), k = function() {
            var a = g.w ? g.w() : g.call(null);
            a[6] = c;
            return a;
          }();
          return Wv(k);
        };
      }(d, c));
      return d;
    };
  }(pg ? pg(0) : og.call(null, 0));
}
function mx(a) {
  var b = kw(1);
  Jv(function(b) {
    return function() {
      var d = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (g) {
                    if (g instanceof Object) {
                      c[5] = g, bw(c), d = Z;
                    } else {
                      throw g;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function() {
          return function(b) {
            var c = b[1];
            if (7 === c) {
              return b[2] = !1, b[1] = 8, Z;
            }
            if (1 === c) {
              return b[1] = z(a) ? 2 : 3, Z;
            }
            if (4 === c) {
              return Zv(b, b[2]);
            }
            if (15 === c) {
              var c = b[7], d = b[8], c = [E('"'), E("Wrong gist path: "), E(d), E("\n"), E("gist-id\x3d "), E(a), E("\n"), E("http status: "), E(c), E('"')].join("");
              b[2] = c;
              b[1] = 17;
              return Z;
            }
            if (13 === c) {
              return c = b[9], b[2] = c, b[1] = 14, Z;
            }
            if (6 === c) {
              return c = b[9], d = c.R, b[1] = z(c.v & 64 || d) ? 9 : 10, Z;
            }
            if (17 === c) {
              return b[2] = b[2], b[1] = 4, Z;
            }
            if (3 === c) {
              return b[2] = null, b[1] = 4, Z;
            }
            if (12 === c) {
              return c = b[9], c = Rf(qg, c), b[2] = c, b[1] = 14, Z;
            }
            if (2 === c) {
              return c = [E("https://gist.githubusercontent.com/"), E(a), E("/raw"), E("?"), E(1 * Math.random())].join(""), d = Fe([rm], [!1]), d = Tw(c, S([d], 0)), b[8] = c, Xv(b, 5, d);
            }
            if (11 === c) {
              return b[2] = b[2], b[1] = 8, Z;
            }
            if (9 === c) {
              return b[2] = !0, b[1] = 11, Z;
            }
            if (5 === c) {
              return c = b[2], d = nc(null == c), b[9] = c, b[1] = d ? 6 : 7, Z;
            }
            if (14 === c) {
              var d = b[2], c = H.j(d, Jm), d = H.j(d, Sn), e = !M.j(c, 200);
              b[10] = d;
              b[7] = c;
              b[1] = e ? 15 : 16;
              return Z;
            }
            return 16 === c ? (d = b[10], b[2] = d, b[1] = 17, Z) : 10 === c ? (b[2] = !1, b[1] = 11, Z) : 8 === c ? (b[1] = z(b[2]) ? 12 : 13, Z) : null;
          };
        }(b), b);
      }(), e = function() {
        var a = d.w ? d.w() : d.call(null);
        a[6] = b;
        return a;
      }();
      return Wv(e);
    };
  }(b));
  return b;
}
;function nx(a, b) {
  return z(a) ? jt(a) : b;
}
function ox(a, b) {
  var c = kw(1);
  Jv(function(c) {
    return function() {
      var e = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function() {
          return function(c) {
            var d = c[1];
            if (1 === d) {
              return d = c[7], d = a.dataset.gistId, c[7] = d, c[1] = z(d) ? 2 : 3, Z;
            }
            if (2 === d) {
              return d = c[7], c[2] = d, c[1] = 4, Z;
            }
            if (3 === d) {
              return c[2] = null, c[1] = 4, Z;
            }
            if (4 === d) {
              var e = c[8], d = c[2];
              c[8] = d;
              c[1] = z(d) ? 5 : 6;
              return Z;
            }
            return 5 === d ? (e = c[8], d = mx(e), Xv(c, 8, d)) : 6 === d ? (c[2] = null, c[1] = 7, Z) : 7 === d ? Zv(c, c[2]) : 8 === d ? (e = c[8], d = c[2], e = [E("https://gist.github.com/"), E(e)].join(""), e = [E("loaded from gist: "), E(e)].join(""), d = [E(b), E(e), E("\n"), E(d)].join(""), c[2] = d, c[1] = 7, Z) : null;
          };
        }(c), c);
      }(), f = function() {
        var a = e.w ? e.w() : e.call(null);
        a[6] = c;
        return a;
      }();
      return Wv(f);
    };
  }(c));
  return c;
}
function px(a, b) {
  var c = kw(1);
  Jv(function(c) {
    return function() {
      var e = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function() {
          return function(c) {
            var d = c[1];
            return 1 === d ? (d = ox(a, b), Xv(c, 2, d)) : 2 === d ? (d = c[7], d = c[2], c[7] = d, c[1] = z(d) ? 3 : 4, Z) : 3 === d ? (d = c[7], c[2] = d, c[1] = 5, Z) : 4 === d ? (c[2] = a.textContent, c[1] = 5, Z) : 5 === d ? Zv(c, c[2]) : null;
          };
        }(c), c);
      }(), f = function() {
        var a = e.w ? e.w() : e.call(null);
        a[6] = c;
        return a;
      }();
      return Wv(f);
    };
  }(c));
  return c;
}
function qx(a, b) {
  var c = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b, d = H.j(c, gc), e = H.j(c, el), f = a.dataset, c = nx(f.staticFns, !1), g = nx(f.evalContext, null), d = nx(f.printLength, d), e = nx(f.beautifyStrings, e), f = f.externalLibs, f = z(f) ? f : null, f = z(f) ? wg.j(Ro, Po(f, ",")) : null;
  return new q(null, 5, [ik, c, gc, d, Vj, f, mn, g, el, e], null);
}
;function rx(a) {
  var b = Rq("div", null, document.createTextNode(""));
  a.parentNode && a.parentNode.insertBefore(b, a.nextSibling);
  return b;
}
function sx(a, b) {
  a.addEventListener.call(a, "input", b);
}
;if (z(window.initMirrorCustomExtensions)) {
  var tx = window;
  tx.initMirrorCustomExtensions.call(tx);
}
var ux = CodeMirror;
function vx(a, b) {
  a.setValue(b);
  return a;
}
function wx(a, b) {
  a.on("change", b);
}
function xx(a, b) {
  a.setOption("extraKeys", b);
}
function yx(a) {
  var b = ux.commands;
  b.goDocStart.call(b, a);
  return a;
}
function zx(a) {
  var b = ux.commands;
  b.selectAll.call(b, a);
  var b = a.getCursor(!0), c = a.getCursor(!1);
  a.autoIndentRange.call(a, b, c);
  return a;
}
function Ax(a) {
  return vx(a, Mo("\n", wf(zg(So, wf(zg(So, Po(a.getValue(), /\n|\r\n/)))))));
}
function kg(a, b, c) {
  a = vx(a, c);
  return Ax(yx(zx(a)));
}
function Bx(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  return Cx(arguments[0], arguments[1], arguments[2], 3 < b.length ? new w(b.slice(3), 0, null) : null);
}
function Cx(a, b, c, d) {
  var e = null != c && (c.v & 64 || c.R) ? Rf(qg, c) : c, f = H.j(e, pl), g = null != d && (d.v & 64 || d.R) ? Rf(qg, d) : d, k = H.l(g, nl, !0), l = function() {
    var b = function() {
      return function(b) {
        var c = a.parentNode;
        c && c.replaceChild(b, a);
      };
    }(c, e, e, f, d, g, k), l = gj(e);
    return CodeMirror(b, l);
  }();
  b = vx(l, b);
  return z(k) ? Ax(yx(zx(b))) : b;
}
function Dx(a, b, c) {
  return Bx(rx(a), b, c);
}
;function Ex(a, b) {
  var c = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b, d = H.j(c, Xk), e = H.j(c, fk), f = H.l(c, Sl, null);
  wx(a, lx(d, e));
  xx(a, {"Ctrl-S":function(b, c, d, e, f) {
    return function() {
      var b = a.getValue(), b = kx(f, b);
      bj.A(S([b], 0));
      alert(b);
      return b;
    };
  }(b, c, d, e, f), "Ctrl-R":function(b, c, d, e, f) {
    return function() {
      var b = a.getValue(), b = kx(f, b);
      return location.replace(b);
    };
  }(b, c, d, e, f), "Ctrl-Enter":d});
}
;var Fx, Gx, Hx, Ix;
var Jx = function Jx(b, c) {
  if (null != b && null != b.wd) {
    return b.wd(b, c);
  }
  var d = Jx[p(null == b ? null : b)];
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  d = Jx._;
  if (null != d) {
    return d.j ? d.j(b, c) : d.call(null, b, c);
  }
  throw C("Spec.with-gen*", b);
};
if ("undefined" === typeof Kx) {
  var Kx, Lx = cg;
  Kx = pg ? pg(Lx) : og.call(null, Lx);
}
function Mx(a) {
  return null != a ? a.K & 4096 || a.uf ? !0 : !1 : !1;
}
function Nx(a, b) {
  return xe(a, U.l(Je(a), sm, b));
}
function Ox(a) {
  if (z(Mx(a))) {
    for (var b = N.h ? N.h(Kx) : N.call(null, Kx), c = a;;) {
      if (z(Mx(c))) {
        c = H.j(b, c);
      } else {
        return z(c) ? Nx(c, a) : null;
      }
    }
  } else {
    return a;
  }
}
function Px(a) {
  var b = null != a ? a.Yd ? !0 : !1 : !1;
  return b ? a : b;
}
function Qx(a) {
  var b = ao.h(a);
  return z(b) ? a : b;
}
function Rx(a) {
  var b = function() {
    var b = Px(a);
    if (z(b)) {
      return b;
    }
    b = Qx(a);
    if (z(b)) {
      return b;
    }
    b = Mx(a);
    b = z(b) ? Ox(a) : b;
    return z(b) ? b : null;
  }();
  return z(Qx(b)) ? Nx(Sx.j ? Sx.j(b, null) : Sx.call(null, b, null), b instanceof X ? b : null != b && (b.v & 131072 || b.tf) ? sm.h(Je(b)) : null) : b;
}
function Tx(a) {
  var b = Rx(a);
  if (z(b)) {
    return b;
  }
  if (z(Mx(a))) {
    throw Error([E("Unable to resolve spec: "), E(a)].join(""));
  }
  return null;
}
function Ux(a, b) {
  var c = Ox(a);
  if (z(Qx(c))) {
    c = U.l(c, yn, b);
  } else {
    var d = Tx(c), c = z(d) ? d : Vx ? Vx(um, c, null, null) : Wx.call(null, um, c, null, null), c = Jx(c, b)
  }
  return c;
}
function Xx(a, b, c) {
  if (!z(function() {
    var b = Mx(a);
    return z(b) ? Af(a) : b;
  }())) {
    throw Error([E("Assert failed: "), E("k must be namespaced keyword or resolveable symbol"), E("\n"), E("(c/and (named? k) (namespace k))")].join(""));
  }
  b = z(function() {
    var a = Px(c);
    if (z(a)) {
      return a;
    }
    a = Qx(c);
    return z(a) ? a : H.j(N.h ? N.h(Kx) : N.call(null, Kx), c);
  }()) ? c : Vx ? Vx(b, c, null, null) : Wx.call(null, b, c, null, null);
  tg.J(Kx, U, a, b);
}
var Yx = function Yx(b) {
  var c = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b, d = H.j(c, Io), e = H.j(c, Jj), f = H.j(c, Kj), g = H.j(c, Tj), k = H.j(c, Wj), l = H.j(c, nk), n = H.j(c, fl), m = H.j(c, mm), r = H.j(c, Um), t = H.j(c, fn), u = H.j(c, rn), v = Rf(vg, k), y = Ii(Nf.j(r, l), Nf.j(n, t)), B = function(b, c) {
    return function(b) {
      var d = c.h ? c.h(b) : c.call(null, b);
      return z(d) ? d : b;
    };
  }(v, y, b, c, c, d, e, f, g, k, l, n, m, r, t, u), G = Cj();
  "undefined" === typeof Fx && (Fx = function(b, c, d, e, f, g, k, l, m, n, r, t, u, v, y, B, G, kb, rb, lb) {
    this.ah = b;
    this.he = c;
    this.nh = d;
    this.eh = e;
    this.Ec = f;
    this.gh = g;
    this.Jg = k;
    this.kf = l;
    this.bh = m;
    this.mh = n;
    this.Ig = r;
    this.kh = t;
    this.fh = u;
    this.id = v;
    this.lh = y;
    this.dh = B;
    this.Lg = G;
    this.Hg = kb;
    this.hh = rb;
    this.Tg = lb;
    this.v = 393216;
    this.K = 0;
  }, Fx.prototype.S = function() {
    return function(b, c) {
      return new Fx(this.ah, this.he, this.nh, this.eh, this.Ec, this.gh, this.Jg, this.kf, this.bh, this.mh, this.Ig, this.kh, this.fh, this.id, this.lh, this.dh, this.Lg, this.Hg, this.hh, c);
    };
  }(v, y, B, G, b, c, c, d, e, f, g, k, l, n, m, r, t, u), Fx.prototype.O = function() {
    return function() {
      return this.Tg;
    };
  }(v, y, B, G, b, c, c, d, e, f, g, k, l, n, m, r, t, u), Fx.prototype.Yd = !0, Fx.prototype.wd = function() {
    return function(b, c) {
      var d = U.l(this.kf, Tj, c);
      return this.he.h ? this.he.h(d) : this.he.call(null, d);
    };
  }(v, y, B, G, b, c, c, d, e, f, g, k, l, n, m, r, t, u), Fx.cc = function() {
    return function() {
      return new V(null, 20, 5, W, [yk, xe(Hk, new q(null, 3, [Nl, !0, $f, xf(ag, xf(new V(null, 1, 5, W, [new q(null, 2, [xm, new V(null, 11, 5, W, [Lk, Nk, ll, Bl, em, sn, Yn, lo, Ko, yk, gl], null), al, vl], null)], null))), Vn, "Do not call this directly, use 'spec' with a map argument"], null)), Lk, Nk, gl, ll, ml, vl, Bl, em, Tm, sn, En, Nn, Yn, lo, oo, Bo, Ko, wm], null);
    };
  }(v, y, B, G, b, c, c, d, e, f, g, k, l, n, m, r, t, u), Fx.Db = !0, Fx.ob = "cljs.spec/t_cljs$spec66862", Fx.Rb = function() {
    return function(b, c) {
      return qd(c, "cljs.spec/t_cljs$spec66862");
    };
  }(v, y, B, G, b, c, c, d, e, f, g, k, l, n, m, r, t, u));
  return new Fx(d, Yx, e, f, g, k, v, c, l, n, B, m, b, G, r, t, c, y, u, cg);
};
function Wx(a) {
  for (var b = [], c = arguments.length, d = 0;;) {
    if (d < c) {
      b.push(arguments[d]), d += 1;
    } else {
      break;
    }
  }
  switch(b.length) {
    case 4:
      return Vx(arguments[0], arguments[1], arguments[2], arguments[3]);
    case 5:
      return Zx(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    default:
      throw Error([E("Invalid arity: "), E(b.length)].join(""));;
  }
}
function Vx(a, b, c, d) {
  return Zx(a, b, c, d, null);
}
function Zx(a, b, c, d, e) {
  if (z(Px(b))) {
    return z(c) ? Ux(b, c) : b;
  }
  if (z(Qx(b))) {
    return Sx.j ? Sx.j(b, c) : Sx.call(null, b, c);
  }
  if (z(Mx(b))) {
    return a = Tx(b), z(c) ? Ux(a, c) : a;
  }
  "undefined" === typeof Gx && (Gx = function(a, b, c, d, e, m) {
    this.form = a;
    this.Uf = b;
    this.Ec = c;
    this.Ef = d;
    this.ag = e;
    this.Ug = m;
    this.v = 393216;
    this.K = 0;
  }, Gx.prototype.S = function(a, b) {
    return new Gx(this.form, this.Uf, this.Ec, this.Ef, this.ag, b);
  }, Gx.prototype.O = function() {
    return this.Ug;
  }, Gx.prototype.Yd = !0, Gx.prototype.wd = function(a, b) {
    return Zx(this.form, this.Uf, b, this.Ef, this.ag);
  }, Gx.cc = function() {
    return new V(null, 6, 5, W, [Dj, Gl, gl, sl, Mj, ym], null);
  }, Gx.Db = !0, Gx.ob = "cljs.spec/t_cljs$spec66904", Gx.Rb = function(a, b) {
    return qd(b, "cljs.spec/t_cljs$spec66904");
  });
  return new Gx(a, b, c, d, e, cg);
}
var $x = function $x(b) {
  var c = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b, d = H.j(c, Ao);
  b = x(d);
  var e = I(b);
  b = K(b);
  var f = H.j(c, Jk), g = x(f), k = I(g), g = K(g), l = H.j(c, wo), n = x(l);
  I(n);
  var n = K(n), m = H.j(c, Qj), c = H.j(c, ek);
  if (dg(hf, d)) {
    var r;
    r = null != e && (e.v & 64 || e.R) ? Rf(qg, e) : e;
    r = H.j(r, ao);
    r = M.j(dn, r);
    return z(r) ? (d = Qj.h(e), d = Ce.j(m, z(f) ? Fh([k, d], !0, !1) : d), b ? $x(new q(null, 4, [Ao, b, Jk, g, wo, n, Qj, d], null)) : new q(null, 2, [ao, dn, Qj, d], null)) : new q(null, 6, [ao, Wl, Ao, d, Qj, m, Jk, f, wo, l, ek, c], null);
  }
  return null;
};
function ay(a, b, c) {
  return $x(new q(null, 4, [Jk, a, Ao, b, wo, c, Qj, cg], null));
}
var Sx = function Sx(b, c) {
  "undefined" === typeof Hx && (Hx = function(b, c, f, g) {
    this.le = b;
    this.Ye = c;
    this.Ec = f;
    this.Vg = g;
    this.v = 393216;
    this.K = 0;
  }, Hx.prototype.S = function(b, c) {
    return new Hx(this.le, this.Ye, this.Ec, c);
  }, Hx.prototype.O = function() {
    return this.Vg;
  }, Hx.prototype.Yd = !0, Hx.prototype.wd = function(b, c) {
    return this.le.j ? this.le.j(this.Ye, c) : this.le.call(null, this.Ye, c);
  }, Hx.cc = function() {
    return new V(null, 4, 5, W, [xe(dk, new q(null, 3, [Nl, !0, $f, xf(ag, xf(new V(null, 2, 5, W, [jm, gl], null))), Vn, "Do not call this directly, use 'spec' with a regex op argument"], null)), jm, gl, rk], null);
  }, Hx.Db = !0, Hx.ob = "cljs.spec/t_cljs$spec67388", Hx.Rb = function(b, c) {
    return qd(c, "cljs.spec/t_cljs$spec67388");
  });
  return new Hx(Sx, b, c, cg);
}, by = function by(b, c, d, e, f, g, k) {
  var l = new q(null, 3, [Fj, b, Qj, d, bk, f], null);
  "undefined" === typeof Ix && (Ix = function(b, c, d, e, f, g, k, l, G, D) {
    this.ce = b;
    this.we = c;
    this.ve = d;
    this.Ze = e;
    this.$e = f;
    this.Me = g;
    this.Le = k;
    this.Ec = l;
    this.df = G;
    this.Wg = D;
    this.v = 393472;
    this.K = 0;
  }, Ix.prototype.S = function() {
    return function(b, c) {
      return new Ix(this.ce, this.we, this.ve, this.Ze, this.$e, this.Me, this.Le, this.Ec, this.df, c);
    };
  }(l), Ix.prototype.O = function() {
    return function() {
      return this.Wg;
    };
  }(l), Ix.prototype.N = function() {
    return function(b, c) {
      return H.j(this.df, c);
    };
  }(l), Ix.prototype.M = function() {
    return function(b, c, d) {
      return H.l(this.df, c, d);
    };
  }(l), Ix.prototype.Yd = !0, Ix.prototype.wd = function() {
    return function(b, c) {
      return this.ce.Aa ? this.ce.Aa(this.we, this.ve, this.Ze, this.$e, this.Me, this.Le, c) : this.ce.call(null, this.we, this.ve, this.Ze, this.$e, this.Me, this.Le, c);
    };
  }(l), Ix.cc = function() {
    return function() {
      return new V(null, 10, 5, W, [xe(Mm, new q(null, 3, [Nl, !0, $f, xf(ag, xf(new V(null, 7, 5, W, [zk, ok, cn, qn, il, Al, gl], null))), Vn, "Do not call this directly, use 'fspec'"], null)), zk, ok, cn, qn, il, Al, gl, Wn, Rn], null);
    };
  }(l), Ix.Db = !0, Ix.ob = "cljs.spec/t_cljs$spec67404", Ix.Rb = function() {
    return function(b, c) {
      return qd(c, "cljs.spec/t_cljs$spec67404");
    };
  }(l));
  return new Ix(by, b, c, d, e, f, g, k, l, cg);
};
Xx(Do, xf(Zl, xf(Gm, new V(null, 1, 5, W, [Mk], null), xf(Pl, xf(Yl, Dk, Mk), xf(Yl, bo, Mk))), xf(Gm, new V(null, 1, 5, W, [xl], null), xf(Yl, xf(Ym, new V(null, 1, 5, W, [new V(null, 2, 5, W, [Vm, jl], null)], null), new q(null, 2, [Dk, Vm, bo, jl], null)), xl))), Zx(xf(Gm, new V(null, 1, 5, W, [Mk], null), xf(bl, xf(ak, Dk, Mk), xf(ak, bo, Mk))), function(a) {
  return Ii(wg.j(Dk, a), wg.j(bo, a));
}, null, !0, function(a) {
  return wg.j(function(a) {
    var c = T(a, 0, null);
    a = T(a, 1, null);
    return new q(null, 2, [Dk, c, bo, a], null);
  }, a);
}));
if ("undefined" === typeof cy) {
  var cy = !0
}
if ("undefined" === typeof dy) {
  var dy = !1
}
;function ey() {
  var a = new q(null, 2, [Uj, 0, yo, kw(null)], null);
  return pg ? pg(a) : og.call(null, a);
}
function fy(a, b, c, d, e) {
  var f = kw(1);
  Jv(function(f) {
    return function() {
      var k = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function(f) {
          return function(g) {
            var k = g[1];
            if (7 === k) {
              return g[2] = g[2], g[1] = 4, Z;
            }
            if (1 === k) {
              var l = g[7], l = N.h ? N.h(e) : N.call(null, e), u = nc(null == l);
              g[7] = l;
              g[1] = u ? 2 : 3;
              return Z;
            }
            if (4 === k) {
              return g[1] = z(g[2]) ? 8 : 9, Z;
            }
            if (15 === k) {
              var v = g[8], y = g[9], B = g[10], G = g[11], D = g[12], L = kw(1), l = Jv(function() {
                return function(e, f, g, k, l, n, m, r, t, u, v, y, B, G) {
                  return function() {
                    var J = function() {
                      return function(a) {
                        return function() {
                          function b(c) {
                            for (;;) {
                              var d;
                              a: {
                                try {
                                  for (;;) {
                                    var e = a(c);
                                    if (!Y(e, Z)) {
                                      d = e;
                                      break a;
                                    }
                                  }
                                } catch (f) {
                                  if (f instanceof Object) {
                                    c[5] = f, bw(c), d = Z;
                                  } else {
                                    throw f;
                                  }
                                }
                              }
                              if (!Y(d, Z)) {
                                return d;
                              }
                            }
                          }
                          function c() {
                            var a = [null, null, null, null, null, null, null, null];
                            a[0] = d;
                            a[1] = 1;
                            return a;
                          }
                          var d = null, d = function(a) {
                            switch(arguments.length) {
                              case 0:
                                return c.call(this);
                              case 1:
                                return b.call(this, a);
                            }
                            throw Error("Invalid arity: " + arguments.length);
                          };
                          d.w = c;
                          d.h = b;
                          return d;
                        }();
                      }(function(e, f) {
                        return function(e) {
                          var g = e[1];
                          if (1 === g) {
                            return e[2] = null, e[1] = 2, Z;
                          }
                          if (2 === g) {
                            var g = W, k = iw(d);
                            return uw(e, 4, new V(null, 2, 5, g, [f, k], null));
                          }
                          return 3 === g ? Zv(e, e[2]) : 4 === g ? (k = e[2], g = T(k, 0, null), k = T(k, 1, null), k = M.j(k, f), g = M.j(g, Fk), e[1] = z(k && g) ? 5 : 6, Z) : 5 === g ? (e[2] = null, e[1] = 7, Z) : 6 === g ? (g = a.h ? a.h(b) : a.call(null, b), Xv(e, 8, g)) : 7 === g ? (e[2] = e[2], e[1] = 3, Z) : 8 === g ? (g = e[2], g = c.h ? c.h(g) : c.call(null, g), e[7] = g, e[2] = null, e[1] = 2, Z) : null;
                        };
                      }(e, f, g, k, l, n, m, r, t, u, v, y, B, G), e, f, g, k, l, n, m, r, t, u, v, y, B, G);
                    }(), D = function() {
                      var a = J.w ? J.w() : J.call(null);
                      a[6] = n;
                      return a;
                    }();
                    return Wv(D);
                  };
                }(v, G, y, B, D, L, v, y, B, G, D, L, k, f);
              }());
              g[13] = l;
              g[2] = L;
              g[1] = 17;
              return Z;
            }
            if (13 === k) {
              var B = g[10], l = g[2], u = tg.J(e, Lg, new V(null, 1, 5, W, [Uj], null), ge), R = a.h ? a.h(b) : a.call(null, b);
              g[14] = u;
              g[15] = l;
              g[10] = R;
              return Xv(g, 14, R);
            }
            if (6 === k) {
              return g[2] = !1, g[1] = 7, Z;
            }
            if (17 === k) {
              var v = g[8], y = g[9], B = g[10], G = g[11], D = g[12], wa = g[2], J = kw(1), l = Jv(function() {
                return function(a, b, d, e, f, g, k, l, n, m, r, t, u, v, y) {
                  return function() {
                    var B = function() {
                      return function(a) {
                        return function() {
                          function b(c) {
                            for (;;) {
                              var d;
                              a: {
                                try {
                                  for (;;) {
                                    var e = a(c);
                                    if (!Y(e, Z)) {
                                      d = e;
                                      break a;
                                    }
                                  }
                                } catch (f) {
                                  if (f instanceof Object) {
                                    c[5] = f, bw(c), d = Z;
                                  } else {
                                    throw f;
                                  }
                                }
                              }
                              if (!Y(d, Z)) {
                                return d;
                              }
                            }
                          }
                          function c() {
                            var a = [null, null, null, null, null, null, null, null, null, null];
                            a[0] = d;
                            a[1] = 1;
                            return a;
                          }
                          var d = null, d = function(a) {
                            switch(arguments.length) {
                              case 0:
                                return c.call(this);
                              case 1:
                                return b.call(this, a);
                            }
                            throw Error("Invalid arity: " + arguments.length);
                          };
                          d.w = c;
                          d.h = b;
                          return d;
                        }();
                      }(function(a, b, d, e, f) {
                        return function(a) {
                          var b = a[1];
                          if (1 === b) {
                            var d = f;
                            a[7] = d;
                            a[2] = null;
                            a[1] = 2;
                            return Z;
                          }
                          return 2 === b ? Xv(a, 4, e) : 3 === b ? Zv(a, a[2]) : 4 === b ? (d = a[7], b = a[2], d = [E(d), E(b)].join(""), a[8] = d, a[1] = null != b ? 5 : 6, Z) : 5 === b ? (d = a[8], b = c.h ? c.h(d) : c.call(null, d), a[9] = b, a[7] = d, a[2] = null, a[1] = 2, Z) : 6 === b ? (a[2] = null, a[1] = 7, Z) : 7 === b ? (a[2] = a[2], a[1] = 3, Z) : null;
                        };
                      }(a, b, d, e, f, g, k, l, n, m, r, t, u, v, y), a, b, d, e, f, g, k, l, n, m, r, t, u, v, y);
                    }(), G = function() {
                      var a = B.w ? B.w() : B.call(null);
                      a[6] = g;
                      return a;
                    }();
                    return Wv(G);
                  };
                }(v, G, y, B, D, J, v, y, B, G, D, wa, J, k, f);
              }());
              g[16] = wa;
              g[17] = l;
              return Zv(g, J);
            }
            return 3 === k ? (g[2] = !1, g[1] = 4, Z) : 12 === k ? (G = g[11], l = ow(G, Fk), g[2] = l, g[1] = 13, Z) : 2 === k ? (l = g[7], u = l.R, g[1] = z(l.v & 64 || u) ? 5 : 6, Z) : 11 === k ? (g[2] = null, g[1] = 13, Z) : 9 === k ? (l = g[7], g[2] = l, g[1] = 10, Z) : 5 === k ? (g[2] = !0, g[1] = 7, Z) : 14 === k ? (D = g[12], l = g[2], u = c.h ? c.h(l) : c.call(null, l), g[18] = u, g[12] = l, g[1] = z(d) ? 15 : 16, Z) : 16 === k ? (g[2] = null, g[1] = 17, Z) : 10 === k ? (v = g[8], y = g[9],
            l = g[2], G = H.j(l, yo), u = H.j(l, Uj), g[8] = l, g[9] = u, g[11] = G, g[1] = z(0 === u) ? 11 : 12, Z) : 8 === k ? (l = g[7], l = Rf(qg, l), g[2] = l, g[1] = 10, Z) : null;
          };
        }(f), f);
      }(), l = function() {
        var a = k.w ? k.w() : k.call(null);
        a[6] = f;
        return a;
      }();
      return Wv(l);
    };
  }(f));
  return f;
}
function gy(a, b, c, d, e) {
  var f = c.value;
  return fy(a, z(f) ? f : c.textContent, ig(Uq, b), d, e);
}
function hy(a, b, c, d, e) {
  return fy(a, c.getValue(), function(a) {
    b.innerHTML = a;
    return b;
  }, d, e);
}
Xx(lk, Ll, Pe);
Xx(xk, cl, oc);
Xx(Xm, xf(Tn, Fj, xf(on, Vl, xk, vk, xk, Hj, lk, pn, lk)), by(Vx(xf(on, Vl, xk, vk, xk, Hj, lk, pn, lk), ay(new V(null, 4, 5, W, [Vl, vk, Hj, pn], null), new V(null, 4, 5, W, [xk, xk, lk, lk], null), new V(null, 4, 5, W, [xk, xk, lk, lk], null)), null, null), xf(on, Vl, xk, vk, xk, Hj, lk, pn, lk), null, null, null, null, null));
var iy = new q(null, 2, [Yk, !0, xn, "overlay"], null);
function jy(a, b, c, d) {
  return new V(null, 2, 5, W, [Ai.A(S([U.l(iy, pl, a), c], 0)), Ai.A(S([U.A(iy, pl, b, S([Fm, !0], 0)), d], 0))], null);
}
if ("undefined" === typeof Aj) {
  var Aj = function() {
    var a = function() {
      var a = cg;
      return pg ? pg(a) : og.call(null, a);
    }(), b = function() {
      var a = cg;
      return pg ? pg(a) : og.call(null, a);
    }(), c = function() {
      var a = cg;
      return pg ? pg(a) : og.call(null, a);
    }(), d = function() {
      var a = cg;
      return pg ? pg(a) : og.call(null, a);
    }(), e = H.l(cg, Qn, mj());
    return new xj(Xd.j("klipse.klipse-editors", "create-editor"), function() {
      return function(a) {
        return a;
      };
    }(a, b, c, d, e), Tk, e, a, b, c, d);
  }()
}
zj(Go, function(a, b) {
  var c = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b, d = H.j(c, Jn), e = H.j(c, Co), f = H.j(c, Sj), g = H.j(c, fk), k = H.j(c, hk), l = H.j(c, tk), n = H.j(c, Bk), m = H.j(c, nl), r = H.j(c, Xl), t = H.j(c, Lm), u = H.j(c, $m), v = jy(u, n, e, t), y = T(v, 0, null), B = T(v, 1, null), G = rx(l), D = Cx(l, r, y, S([nl, m], 0)), L = ey();
  Ex(D, new q(null, 2, [fk, g, Xk, function(a, b, c, d, e, f, g, k, l, n, m, r, t) {
    return function() {
      return hy(l, d, e, t, f);
    };
  }(v, y, B, G, D, L, b, c, d, e, f, g, k, l, n, m, r, t, u)], null));
  return function(a, b, c, d, e, f, g, k, l, n, m, r, t) {
    return function() {
      return lw(hy(l, d, e, t, f));
    };
  }(v, y, B, G, D, L, b, c, d, e, f, g, k, l, n, m, r, t, u);
});
zj(Ej, function(a, b) {
  var c = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b, d = H.j(c, Jn), e = H.j(c, Co), f = H.j(c, Sj), g = H.j(c, fk), k = H.j(c, hk), l = H.j(c, tk), n = H.j(c, Bk), m = H.j(c, nl), r = H.j(c, Xl), t = H.j(c, Lm), u = H.j(c, $m), v = jy(u, n, e, t), y = T(v, 0, null), B = T(v, 1, null), G = Dx(l, f, B), D = Cx(l, r, y, S([nl, m], 0)), L = ey();
  Ex(D, new q(null, 2, [fk, g, Xk, function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v) {
    return function() {
      return fy(l, e.getValue(), jg(d, v), t, f);
    };
  }(v, y, B, G, D, L, b, c, d, e, f, g, k, l, n, m, r, t, u)], null));
  return function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v) {
    return function() {
      return fy(l, e.getValue(), jg(d, v), t, f);
    };
  }(v, y, B, G, D, L, b, c, d, e, f, g, k, l, n, m, r, t, u);
});
zj(xo, function(a, b) {
  var c = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b, d = H.j(c, tk), e = H.j(c, Pn), f = H.j(c, Xl), g = H.j(c, gn), k = H.j(c, Jn), l = H.j(c, Sj), n = H.j(c, fk), m = H.j(c, hk), r = rx(d), t = ey();
  Uq(r, l);
  sx(d, function(a, b, c, d, e, f, g, k, l, n, m, r) {
    return function() {
      return gy(l, a, e, r, b);
    };
  }(r, t, b, c, d, e, f, g, k, l, n, m));
  return function(a, b, c, d, e, f, g, k, l, n, m, r) {
    return function() {
      return lw(gy(l, a, e, r, b));
    };
  }(r, t, b, c, d, e, f, g, k, l, n, m);
});
hc();
var ky, ly = cg;
ky = pg ? pg(ly) : og.call(null, ly);
var my, ny = cg;
my = pg ? pg(ny) : og.call(null, ny);
function oy(a, b, c) {
  console.info("register-mode: ", a, b);
  tg.J(ky, U, b, a);
  tg.J(my, U, a, c);
}
function py(a, b, c, d) {
  var e = a.dataset;
  a = e.editorType;
  var f = nx(e.loopMsec, null), e = nx(e.evalIdleMsec, null);
  a = To(new q(null, 3, [fk, e, hk, f, qk, a], null));
  a = null != a && (a.v & 64 || a.R) ? Rf(qg, a) : a;
  b = H.l(a, fk, b);
  d = H.l(a, qk, d);
  a = H.l(a, hk, null);
  return To(new q(null, 3, [fk, c > b ? c : b, hk, a, qk, d], null));
}
function qy(a, b) {
  if (z(a)) {
    return xo;
  }
  switch(b) {
    case "code-mirror":
      return Ej;
    case "dom":
      return xo;
    case "html":
      return Go;
    default:
      return Ej;
  }
}
function ry(a, b, c) {
  var d = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b, e = H.l(d, so, 20), f = H.l(d, Ql, !1), g = H.j(d, ul), k = H.l(d, Kk, 1E3), l = H.l(d, vm, !1), n = H.l(d, go, cg), m = H.l(d, Rj, cg), r = null != c && (c.v & 64 || c.R) ? Rf(qg, c) : c, t = H.j(r, $m), u = H.j(r, Bk), v = H.j(r, Jn), y = H.j(r, Kl), B = H.l(r, nl, !0), G = H.l(r, El, 0), D = kw(1);
  Jv(function(b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D) {
    return function() {
      var lb = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function(b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, J) {
          return function(D) {
            var L = D[1];
            if (7 === L) {
              return D[2] = !1, D[1] = 8, Z;
            }
            if (1 === L) {
              return D[1] = z(a) ? 2 : 3, Z;
            }
            if (4 === L) {
              return Zv(D, D[2]);
            }
            if (13 === L) {
              var R = D[7];
              D[2] = R;
              D[1] = 14;
              return Z;
            }
            if (6 === L) {
              var R = D[7], ea = R.R;
              D[1] = z(R.v & 64 || ea) ? 9 : 10;
              return Z;
            }
            if (3 === L) {
              return D[2] = null, D[1] = 4, Z;
            }
            if (12 === L) {
              return R = D[7], R = Rf(qg, R), D[2] = R, D[1] = 14, Z;
            }
            if (2 === L) {
              var ka = [gc, el], sa = [k, l], wa = Fe(ka, sa), xa = qx(a, wa), ea = function() {
                return function(a, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D, J, L) {
                  return function(b) {
                    return L.j ? L.j(b, a) : L.call(null, b, a);
                  };
                }(xa, ka, sa, wa, xa, L, b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, J);
              }(), R = px(a, B);
              D[8] = ea;
              return Xv(D, 5, R);
            }
            if (11 === L) {
              return D[2] = D[2], D[1] = 8, Z;
            }
            if (9 === L) {
              return D[2] = !0, D[1] = 11, Z;
            }
            if (5 === L) {
              var R = D[7], R = D[2], ea = py(a, e, J, g), ta = nc(null == ea);
              D[9] = R;
              D[7] = ea;
              D[1] = ta ? 6 : 7;
              return Z;
            }
            if (14 === L) {
              var ea = D[8], R = D[9], pa = D[2], ta = H.j(pa, fk), Ra = H.j(pa, qk), pa = H.j(pa, hk), Ra = qy(f, Ra), R = Fe([Sj, fk, hk, tk, Bk, nl, Xl, Lm, $m, Jn, Co], [";the evaluation will appear here (soon)...", ta, pa, a, v, G, R, m, u, ea, n]), R = Aj.j ? Aj.j(Ra, R) : Aj.call(null, Ra, R);
              D[2] = R;
              D[1] = 4;
              return Z;
            }
            return 10 === L ? (D[2] = !1, D[1] = 11, Z) : 8 === L ? (D[1] = z(D[2]) ? 12 : 13, Z) : null;
          };
        }(b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D), b, c, d, e, f, g, k, l, n, m, r, t, u, v, y, B, G, D);
      }(), Mb = function() {
        var a = lb.w ? lb.w() : lb.call(null);
        a[6] = b;
        return a;
      }();
      return Wv(Mb);
    };
  }(D, b, d, e, f, g, k, l, n, m, c, r, t, u, v, y, B, G));
  return D;
}
Xx(Fo, rl, function(a) {
  return ja(a) && 1 == a.nodeType;
});
Xx(ho, cl, oc);
Xx(jo, cl, oc);
Xx(Yj, am, function(a) {
  var b = ia(a);
  return b ? b : null != a ? a.kg ? !0 : a.Ge ? !1 : A(wc, a) : A(wc, a);
});
Xx(un, cl, oc);
Xx(wk, tm, Ye);
Xx(Rm, xf(Ym, new V(null, 1, 5, W, [Ul], null), xf(no, xf(gk, Ul, !0), xf(gk, Ul, !1))), function(a) {
  return M.j(a, !0) || M.j(a, !1);
});
Xx(Cm, xf(Lj, Jj, new V(null, 4, 5, W, [ho, jo, Yj, un], null)), Yx(Fe([Jj, Kj, Tj, Wj, nk, fl, mm, Um, fn, rn, Io], [new V(null, 4, 5, W, [ho, jo, Yj, un], null), null, null, new V(null, 5, 5, W, [Pe, function(a) {
  return Ze(a, $m);
}, function(a) {
  return Ze(a, Bk);
}, function(a) {
  return Ze(a, Jn);
}, function(a) {
  return Ze(a, Kl);
}], null), De, new V(null, 4, 5, W, [ho, jo, Yj, un], null), null, new V(null, 4, 5, W, [$m, Bk, Jn, Kl], null), De, new V(null, 5, 5, W, [Ll, xf(Ym, new V(null, 1, 5, W, [Ul], null), xf(Jl, Ul, $m)), xf(Ym, new V(null, 1, 5, W, [Ul], null), xf(Jl, Ul, Bk)), xf(Ym, new V(null, 1, 5, W, [Ul], null), xf(Jl, Ul, Jn)), xf(Ym, new V(null, 1, 5, W, [Ul], null), xf(Jl, Ul, Kl))], null), null])));
Xx(Zk, xf(Lj, Kj, new V(null, 2, 5, W, [wk, Rm], null)), Yx(Fe([Jj, Kj, Tj, Wj, nk, fl, mm, Um, fn, rn, Io], [null, new V(null, 2, 5, W, [wk, Rm], null), null, new V(null, 1, 5, W, [Pe], null), new V(null, 2, 5, W, [so, Ql], null), De, null, De, new V(null, 2, 5, W, [wk, Rm], null), new V(null, 1, 5, W, [Ll], null), null])));
Xx(km, xf(Tn, Fj, xf(on, tk, Fo, wl, Zk, Pm, Cm)), by(Vx(xf(on, tk, Fo, wl, Zk, Pm, Cm), ay(new V(null, 3, 5, W, [tk, wl, Pm], null), new V(null, 3, 5, W, [Fo, Zk, Cm], null), new V(null, 3, 5, W, [Fo, Zk, Cm], null)), null, null), xf(on, tk, Fo, wl, Zk, Pm, Cm), null, null, null, null, null));
va("klipse.plugin.klipsify", function(a, b, c) {
  var d = (N.h ? N.h(my) : N.call(null, my)).call(null, c);
  if (z(d)) {
    var e = kw(1);
    Jv(function(c, d, e) {
      return function() {
        var l = function() {
          return function(a) {
            return function() {
              function b(c) {
                for (;;) {
                  var d;
                  a: {
                    try {
                      for (;;) {
                        var e = a(c);
                        if (!Y(e, Z)) {
                          d = e;
                          break a;
                        }
                      }
                    } catch (f) {
                      if (f instanceof Object) {
                        c[5] = f, bw(c), d = Z;
                      } else {
                        throw f;
                      }
                    }
                  }
                  if (!Y(d, Z)) {
                    return d;
                  }
                }
              }
              function c() {
                var a = [null, null, null, null, null, null, null];
                a[0] = d;
                a[1] = 1;
                return a;
              }
              var d = null, d = function(a) {
                switch(arguments.length) {
                  case 0:
                    return c.call(this);
                  case 1:
                    return b.call(this, a);
                }
                throw Error("Invalid arity: " + arguments.length);
              };
              d.w = c;
              d.h = b;
              return d;
            }();
          }(function(c, d) {
            return function(c) {
              var e = c[1];
              return 1 === e ? (e = ry(a, b, d), Xv(c, 3, e)) : 2 === e ? Zv(c, c[2]) : 3 === e ? (e = c[2], e = e.w ? e.w() : e.call(null), Xv(c, 2, e)) : null;
            };
          }(c, d, e), c, d, e);
        }(), n = function() {
          var a = l.w ? l.w() : l.call(null);
          a[6] = c;
          return a;
        }();
        return Wv(n);
      };
    }(e, d, d));
  } else {
    e = kw(1), Jv(function(a, b) {
      return function() {
        var d = function() {
          return function(a) {
            return function() {
              function b(c) {
                for (;;) {
                  var d;
                  a: {
                    try {
                      for (;;) {
                        var e = a(c);
                        if (!Y(e, Z)) {
                          d = e;
                          break a;
                        }
                      }
                    } catch (f) {
                      if (f instanceof Object) {
                        c[5] = f, bw(c), d = Z;
                      } else {
                        throw f;
                      }
                    }
                  }
                  if (!Y(d, Z)) {
                    return d;
                  }
                }
              }
              function c() {
                var a = [null, null, null, null, null, null, null];
                a[0] = d;
                a[1] = 1;
                return a;
              }
              var d = null, d = function(a) {
                switch(arguments.length) {
                  case 0:
                    return c.call(this);
                  case 1:
                    return b.call(this, a);
                }
                throw Error("Invalid arity: " + arguments.length);
              };
              d.w = c;
              d.h = b;
              return d;
            }();
          }(function() {
            return function(a) {
              if (1 === a[1]) {
                var b = N.h ? N.h(my) : N.call(null, my), b = Ah(b), b = console.error("cannot find options for mode: ", c, ". Supported modes: ", b);
                return Zv(a, b);
              }
              return null;
            };
          }(a, b), a, b);
        }(), e = function() {
          var b = d.w ? d.w() : d.call(null);
          b[6] = a;
          return b;
        }();
        return Wv(e);
      };
    }(e, d));
  }
  return e;
});
function sy(a, b, c) {
  var d = (N.h ? N.h(my) : N.call(null, my)).call(null, c);
  if (z(d)) {
    return ry(a, b, d);
  }
  a = kw(1);
  Jv(function(a, b) {
    return function() {
      var d = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function(a, b) {
          return function(d) {
            var e = d[1];
            return 1 === e ? Zv(d, function() {
              return function(a, b, d) {
                return function() {
                  var e = kw(1);
                  Jv(function(a, b, d, e) {
                    return function() {
                      var f = function() {
                        return function(a) {
                          return function() {
                            function b(c) {
                              for (;;) {
                                var d;
                                a: {
                                  try {
                                    for (;;) {
                                      var e = a(c);
                                      if (!Y(e, Z)) {
                                        d = e;
                                        break a;
                                      }
                                    }
                                  } catch (f) {
                                    if (f instanceof Object) {
                                      c[5] = f, bw(c), d = Z;
                                    } else {
                                      throw f;
                                    }
                                  }
                                }
                                if (!Y(d, Z)) {
                                  return d;
                                }
                              }
                            }
                            function c() {
                              var a = [null, null, null, null, null, null, null];
                              a[0] = d;
                              a[1] = 1;
                              return a;
                            }
                            var d = null, d = function(a) {
                              switch(arguments.length) {
                                case 0:
                                  return c.call(this);
                                case 1:
                                  return b.call(this, a);
                              }
                              throw Error("Invalid arity: " + arguments.length);
                            };
                            d.w = c;
                            d.h = b;
                            return d;
                          }();
                        }(function() {
                          return function(a) {
                            if (1 === a[1]) {
                              var b = N.h ? N.h(my) : N.call(null, my), b = Ah(b), b = console.error("cannot find options for mode: ", c, ". Supported modes: ", b);
                              return Zv(a, b);
                            }
                            return null;
                          };
                        }(a, b, d, e), a, b, d, e);
                      }(), g = function() {
                        var b = f.w ? f.w() : f.call(null);
                        b[6] = a;
                        return b;
                      }();
                      return Wv(g);
                    };
                  }(e, a, b, d));
                  return e;
                };
              }(e, a, b);
            }()) : null;
          };
        }(a, b), a, b);
      }(), k = function() {
        var b = d.w ? d.w() : d.call(null);
        b[6] = a;
        return b;
      }();
      return Wv(k);
    };
  }(a, d));
  return a;
}
va("klipse.plugin.klipsify_no_eval", sy);
function ty(a, b, c) {
  var d = kw(1);
  Jv(function(d) {
    return function() {
      var f = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function() {
          return function(d) {
            var e = d[1];
            if (7 === e) {
              return e = sy(d[7], b, d[8]), Xv(d, 10, e);
            }
            if (1 === e) {
              var f = a, e = De;
              d[9] = f;
              d[10] = e;
              d[2] = null;
              d[1] = 2;
              return Z;
            }
            if (4 === e) {
              var f = d[9], e = I(f), g = c.h ? c.h(e) : c.call(null, e);
              d[7] = e;
              d[8] = g;
              d[1] = z(g) ? 7 : 8;
              return Z;
            }
            return 6 === e ? (d[2] = d[2], d[1] = 3, Z) : 3 === e ? Zv(d, d[2]) : 2 === e ? (f = d[9], e = x(f), d[1] = e ? 4 : 5, Z) : 9 === e ? (d[2] = d[2], d[1] = 6, Z) : 5 === e ? (e = d[10], d[2] = e, d[1] = 6, Z) : 10 === e ? (f = d[9], e = d[10], g = d[2], f = Yd(f), e = Ce.j(e, g), d[9] = f, d[10] = e, d[2] = null, d[1] = 2, Z) : 8 === e ? (f = d[9], e = d[10], g = Yd(f), d[9] = g, d[10] = e, d[2] = null, d[1] = 2, Z) : null;
          };
        }(d), d);
      }(), g = function() {
        var a = f.w ? f.w() : f.call(null);
        a[6] = d;
        return a;
      }();
      return Wv(g);
    };
  }(d));
  return d;
}
function uy(a, b, c) {
  var d = kw(1);
  Jv(function(d) {
    return function() {
      var f = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function() {
          return function(d) {
            var e = d[1];
            if (7 === e) {
              return d[2] = d[2], d[1] = 4, Z;
            }
            if (1 === e) {
              return e = ty(a, b, c), Xv(d, 2, e);
            }
            if (4 === e) {
              return Zv(d, d[2]);
            }
            if (15 === e) {
              var f = d[7], e = d[2], g = K(f), r;
              d[8] = null;
              d[9] = 0;
              d[10] = 0;
              d[11] = g;
              d[12] = e;
              d[2] = null;
              d[1] = 3;
              return Z;
            }
            if (13 === e) {
              return f = d[7], e = I(f), e = e.w ? e.w() : e.call(null), Xv(d, 15, e);
            }
            if (6 === e) {
              return g = d[11], e = x(g), d[7] = e, d[1] = e ? 9 : 10, Z;
            }
            if (3 === e) {
              return f = d[9], r = d[10], d[1] = z(f < r) ? 5 : 6, Z;
            }
            if (12 === e) {
              var f = d[7], e = Ad(f), f = Bd(f), t = P(e);
              d[8] = e;
              d[9] = 0;
              d[10] = t;
              d[11] = f;
              d[2] = null;
              d[1] = 3;
              return Z;
            }
            return 2 === e ? (g = x(d[2]), d[8] = null, d[9] = 0, d[10] = 0, d[11] = g, d[2] = null, d[1] = 3, Z) : 11 === e ? (d[2] = d[2], d[1] = 7, Z) : 9 === e ? (f = d[7], d[1] = Se(f) ? 12 : 13, Z) : 5 === e ? (e = d[8], f = d[9], e = Ec.j(e, f), e = e.w ? e.w() : e.call(null), Xv(d, 8, e)) : 14 === e ? (d[2] = d[2], d[1] = 11, Z) : 10 === e ? (d[2] = null, d[1] = 11, Z) : 8 === e ? (e = d[8], f = d[9], r = d[10], g = d[11], t = d[2], d[8] = e, d[9] = f + 1, d[10] = r, d[11] = g, d[13] = t,
            d[2] = null, d[1] = 3, Z) : null;
          };
        }(d), d);
      }(), g = function() {
        var a = f.w ? f.w() : f.call(null);
        a[6] = d;
        return a;
      }();
      return Wv(g);
    };
  }(d));
  return d;
}
function vy(a) {
  return Ig.j(cg, function() {
    return function c(d) {
      return new Df(null, function() {
        for (var e = d;;) {
          var f = x(e);
          if (f) {
            var g = f, k = I(g), l = a.h ? a.h(k) : a.call(null, k);
            if (z(l) && (f = x(function(a, c, d, e, f) {
              return function y(g) {
                return new Df(null, function(a, c, d) {
                  return function() {
                    for (;;) {
                      var a = x(g);
                      if (a) {
                        if (Se(a)) {
                          var c = Ad(a), e = P(c), f = new Ff(Array(e), 0);
                          a: {
                            for (var k = 0;;) {
                              if (k < e) {
                                var l = Ec.j(c, k), l = new V(null, 2, 5, W, [l, (N.h ? N.h(ky) : N.call(null, ky)).call(null, d)], null);
                                f.add(l);
                                k += 1;
                              } else {
                                c = !0;
                                break a;
                              }
                            }
                          }
                          return c ? If(f.ib(), y(Bd(a))) : If(f.ib(), null);
                        }
                        f = I(a);
                        return ve(new V(null, 2, 5, W, [f, (N.h ? N.h(ky) : N.call(null, ky)).call(null, d)], null), y(Yd(a)));
                      }
                      return null;
                    }
                  };
                }(a, c, d, e, f), null, null);
              };
            }(e, l, k, g, f)(we(document.querySelectorAll(l), 0))))) {
              return Nf.j(f, c(Yd(e)));
            }
            e = Yd(e);
          } else {
            return null;
          }
        }
      }, null, null);
    }(Ah(N.h ? N.h(ky) : N.call(null, ky)));
  }());
}
function wy(a) {
  var b = jx(a), c = vy(a), d = Ah(N.h ? N.h(ky) : N.call(null, ky));
  a = Mo(",", Fg(lc, wg.j(a, d)));
  return uy(we(document.querySelectorAll(a), 0), b, c);
}
va("klipse.plugin.init_clj", wy);
function xy(a) {
  return wy(jj(a, S([kj, !1], 0)));
}
va("klipse.plugin.init", xy);
function yy(a) {
  if (null == Sk.builtinFiles || null == function() {
    var a = Sk.builtinFiles;
    return z(a) ? (a = a.files, z(a) ? a : null) : null;
  }()[a]) {
    throw [E("File not found: '"), E(a), E("'")].join("");
  }
  return function() {
    var a = Sk.builtinFiles;
    return z(a) ? (a = a.files, z(a) ? a : null) : null;
  }()[a];
}
oy("eval-python-client", "selector_eval_python_client", new q(null, 5, [$m, "python", Bk, "python", Jn, function(a) {
  var b = kw(null), c = Sk, d = c.configure;
  d.call(c, {output:function(a, b, c) {
    return function(a) {
      return ow(c, a);
    };
  }(c, d, b), read:yy});
  (function() {
    var c = Sk.misceval, d = c.asyncToPromise;
    return d.call(c, function() {
      return function() {
        var b = Sk;
        return b.importMainWithBody.call(b, "\x3cstdin\x3e", !1, a, !0);
      };
    }(c, d, b));
  })().then(function() {
    return function() {
      var b = console;
      return b.info.call(b, "success to eval skulpt: ", a);
    };
  }(b), function(a) {
    return function(b) {
      return ow(a, [E("error: "), E(b)].join(""));
    };
  }(b));
  return b;
}, nl, !1, Kl, "#"], null));
function zy(a) {
  return z(a.inspect) ? a.inspect.call(a) : "" + E(a);
}
oy("eval-scheme", "selector_eval_scheme", new q(null, 4, [$m, "scheme", Bk, "scheme", Jn, function(a) {
  var b = kw(null), c = new BiwaScheme.Interpreter(function(a) {
    return function(b) {
      return ow(a, "" + E(b));
    };
  }(b));
  window.exp = a;
  ow(b, zy(c.evaluate.call(c, a)));
  return b;
}, Kl, ";"], null));
oy("eval-html", "selector_eval_html", new q(null, 4, [$m, "text/html", Bk, "text", Jn, function(a) {
  var b = kw(1);
  Jv(function(b) {
    return function() {
      var d = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (g) {
                    if (g instanceof Object) {
                      c[5] = g, bw(c), d = Z;
                    } else {
                      throw g;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function() {
          return function(b) {
            return 1 === b[1] ? Zv(b, a) : null;
          };
        }(b), b);
      }(), e = function() {
        var a = d.w ? d.w() : d.call(null);
        a[6] = b;
        return a;
      }();
      return Wv(e);
    };
  }(b));
  return b;
}, Kl, "; "], null));
oy("eval-lambdaway", "selector_eval_lambdaway", new q(null, 4, [$m, "clojure", Bk, "text", Jn, function(a) {
  var b = kw(1);
  Jv(function(b) {
    return function() {
      var d = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (g) {
                    if (g instanceof Object) {
                      c[5] = g, bw(c), d = Z;
                    } else {
                      throw g;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function() {
          return function(b) {
            if (1 === b[1]) {
              var c = LAMBDATALK.evaluate.call(LAMBDATALK, a).val;
              return Zv(b, c);
            }
            return null;
          };
        }(b), b);
      }(), e = function() {
        var a = d.w ? d.w() : d.call(null);
        a[6] = b;
        return a;
      }();
      return Wv(e);
    };
  }(b));
  return b;
}, Kl, "[comment]: "], null));
var Ay = function(a) {
  return function(b) {
    return function() {
      function c(a) {
        var b = null;
        if (0 < arguments.length) {
          for (var b = 0, c = Array(arguments.length - 0);b < c.length;) {
            c[b] = arguments[b + 0], ++b;
          }
          b = new w(c, 0);
        }
        return d.call(this, b);
      }
      function d(c) {
        if (z(N.h ? N.h(b) : N.call(null, b))) {
          return null;
        }
        sg.j ? sg.j(b, !0) : sg.call(null, b, !0);
        return Rf(a, c);
      }
      c.L = 0;
      c.H = function(a) {
        a = x(a);
        return d(a);
      };
      c.A = d;
      return c;
    }();
  }(pg ? pg(!1) : og.call(null, !1));
}(function() {
  var a = Opal;
  return a.load.call(a, "opal-parser");
});
oy("eval-ruby", "selector_eval_ruby", new q(null, 4, [$m, "ruby", Bk, "ruby", Jn, function(a) {
  var b = kw(1);
  Jv(function(b) {
    return function() {
      var d = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (g) {
                    if (g instanceof Object) {
                      c[5] = g, bw(c), d = Z;
                    } else {
                      throw g;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function() {
          return function(b) {
            var c = b[1];
            return 1 === c ? (c = Ay.w ? Ay.w() : Ay.call(null), b[7] = c, b[2] = null, b[1] = 4, Z) : 2 === c ? Zv(b, b[2]) : 3 === c ? (c = "" + E(b[2]), b[2] = c, bw(b), Z) : 4 === c ? (aw(b, 3, 2), c = Opal.eval.call(Opal, a), c = c.$inspect.call(c), b[2] = c, bw(b), Z) : null;
          };
        }(b), b);
      }(), e = function() {
        var a = d.w ? d.w() : d.call(null);
        a[6] = b;
        return a;
      }();
      return Wv(e);
    };
  }(b));
  return b;
}, Kl, "#"], null));
var By = new q(null, 3, "immutable https://raw.githubusercontent.com/facebook/immutable-js/master/dist/immutable.min.js jQuery https://code.jquery.com/jquery-2.2.4.min.js underscore http://underscorejs.org/underscore-min.js".split(" "), null), Cy = eval;
function Dy(a) {
  var b = kw(1);
  Jv(function(b) {
    return function() {
      var d = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (g) {
                    if (g instanceof Object) {
                      c[5] = g, bw(c), d = Z;
                    } else {
                      throw g;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function() {
          return function(b) {
            var c = b[1];
            if (7 === c) {
              var c = b[7], c = b[2], d = nc(null == c);
              b[7] = c;
              b[1] = d ? 8 : 9;
              return Z;
            }
            if (1 === c) {
              return d = a, b[8] = d, b[2] = null, b[1] = 2, Z;
            }
            if (4 === c) {
              var d = b[8], e = b[9], c = I(d), d = 1 * Math.random(), c = [E(c), E("?"), E(d)].join(""), d = console.info("loading:", c), e = Fe([rm], [!1]), e = Tw(c, S([e], 0));
              b[10] = d;
              b[9] = c;
              return Xv(b, 7, e);
            }
            return 15 === c ? (c = b[7], b[2] = c, b[1] = 16, Z) : 13 === c ? (b[2] = b[2], b[1] = 10, Z) : 6 === c ? (b[2] = b[2], b[1] = 3, Z) : 17 === c ? (d = b[8], c = b[11], e = b[9], e = console.info("evaluating:", e), c = Cy.h ? Cy.h(c) : Cy.call(null, c), d = Yd(d), b[12] = e, b[8] = d, b[13] = c, b[2] = null, b[1] = 2, Z) : 3 === c ? Zv(b, b[2]) : 12 === c ? (b[2] = !1, b[1] = 13, Z) : 2 === c ? (d = b[8], c = x(d), b[1] = c ? 4 : 5, Z) : 19 === c ? (b[2] = b[2], b[1] = 6, Z) : 11 === c ?
            (b[2] = !0, b[1] = 13, Z) : 9 === c ? (b[2] = !1, b[1] = 10, Z) : 5 === c ? (b[2] = new V(null, 1, 5, W, [Km], null), b[1] = 6, Z) : 14 === c ? (c = b[7], c = Rf(qg, c), b[2] = c, b[1] = 16, Z) : 16 === c ? (c = b[14], c = b[2], d = H.j(c, Jm), c = H.j(c, Sn), e = M.j(200, d), b[11] = c, b[14] = d, b[1] = e ? 17 : 18, Z) : 10 === c ? (b[1] = z(b[2]) ? 14 : 15, Z) : 18 === c ? (e = b[9], c = b[14], b[2] = new V(null, 3, 5, W, [tn, c, e], null), b[1] = 19, Z) : 8 === c ? (c = b[7], d =
            c.R, b[1] = z(c.v & 64 || d) ? 11 : 12, Z) : null;
          };
        }(b), b);
      }(), e = function() {
        var a = d.w ? d.w() : d.call(null);
        a[6] = b;
        return a;
      }();
      return Wv(e);
    };
  }(b));
  return b;
}
function Ey(a) {
  return H.l(By, a, a);
}
oy("eval-javascript", "selector_eval_js", new q(null, 4, [$m, "javascript", Bk, "javascript", Jn, function(a, b) {
  var c = null != b && (b.v & 64 || b.R) ? Rf(qg, b) : b, d = H.l(c, Vj, null), e = kw(1);
  Jv(function(b, c, d, e) {
    return function() {
      var n = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function(b, c, d, e) {
          return function(b) {
            var c = b[1];
            if (1 === c) {
              var d = wg.j(Ey, e), d = Dy(d);
              return Xv(b, 2, d);
            }
            if (2 === c) {
              var f = b[2], c = T(f, 0, null), d = T(f, 1, null), f = T(f, 2, null), c = M.j(Km, c);
              b[7] = d;
              b[8] = f;
              b[1] = c ? 3 : 4;
              return Z;
            }
            if (3 === c) {
              return b[2] = null, b[1] = 8, Z;
            }
            if (4 === c) {
              return d = b[7], f = b[8], d = [E("Cannot load script: "), E(f), E("\n"), E("error: "), E(d)].join(""), b[2] = d, b[1] = 5, Z;
            }
            if (5 === c) {
              return Zv(b, b[2]);
            }
            if (6 === c) {
              return b[2] = b[2], b[1] = 5, Z;
            }
            if (7 === c) {
              return d = "" + E(b[2]), b[2] = d, bw(b), Z;
            }
            if (8 === c) {
              aw(b, 7, 6);
              c = Cy.h ? Cy.h(a) : Cy.call(null, a);
              try {
                d = "" + E(JSON.stringify(c));
              } catch (g) {
                if (g instanceof Object) {
                  d = "" + E(c);
                } else {
                  throw g;
                }
              }
              b[2] = d;
              bw(b);
              return Z;
            }
            return null;
          };
        }(b, c, d, e), b, c, d, e);
      }(), m = function() {
        var a = n.w ? n.w() : n.call(null);
        a[6] = b;
        return a;
      }();
      return Wv(m);
    };
  }(e, b, c, d));
  return e;
}, Kl, "//"], null));
oy("eval-markdown", "selector_eval_markdown", new q(null, 4, [$m, "markdown", Bk, "htmlmixed", Jn, function(a) {
  var b = kw(1);
  Jv(function(b) {
    return function() {
      var d = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (g) {
                    if (g instanceof Object) {
                      c[5] = g, bw(c), d = Z;
                    } else {
                      throw g;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function() {
          return function(b) {
            if (1 === b[1]) {
              var c = markdown.toHTML(a);
              return Zv(b, c);
            }
            return null;
          };
        }(b), b);
      }(), e = function() {
        var a = d.w ? d.w() : d.call(null);
        a[6] = b;
        return a;
      }();
      return Wv(e);
    };
  }(b));
  return b;
}, Kl, "[comment]: "], null));
var Fy = {msg_mac:"6GpVqi640U22dcEhfB5C58m0oqAWXuVZr+SQ4sBoTMQ\x3d", time_created:1468951584E3}, Gy = function(a) {
  return function(b) {
    return function() {
      function c(a) {
        var b = null;
        if (0 < arguments.length) {
          for (var b = 0, c = Array(arguments.length - 0);b < c.length;) {
            c[b] = arguments[b + 0], ++b;
          }
          b = new w(c, 0);
        }
        return d.call(this, b);
      }
      function d(c) {
        var d = H.l(N.h ? N.h(b) : N.call(null, b), c, Ve);
        d === Ve && (d = Rf(a, c), tg.J(b, U, c, d));
        return d;
      }
      c.L = 0;
      c.H = function(a) {
        a = x(a);
        return d(a);
      };
      c.A = d;
      return c;
    }();
  }(function() {
    var a = cg;
    return pg ? pg(a) : og.call(null, a);
  }());
}(function(a) {
  return new ReplitClient("api.repl.it", 80, a, Fy);
});
function mg(a, b, c) {
  return function() {
    var d = a.evaluate;
    return d.call(a, c, {stdout:function() {
      return function(a) {
        return ow(b, a);
      };
    }(a, d)});
  }().then(function(a) {
    return Ke(a.error) ? ow(b, [E("Result: "), E(a.data), E("\n")].join("")) : ow(b, [E("Error: "), E(a.error), E("\n")].join(""));
  }, function(a) {
    return ow(b, a);
  });
}
function Hy(a, b) {
  var c = kw(null), d = Gy.h ? Gy.h(a) : Gy.call(null, a);
  d.connect.call(d).then(lg(d, c, b));
  return c;
}
;if (z(window.ReplitClient)) {
  for (var Iy = x(new V(null, 3, 5, W, [new q(null, 3, [Pj, "selector_eval_python", $k, "eval-python", Pm, new q(null, 5, [$m, "python", Bk, "python", Wk, "python3", Kl, "#", nl, !1], null)], null), new q(null, 3, [Pj, "selector_eval_csharp", $k, "eval-csharp", Pm, new q(null, 4, [$m, "text/x-csharp", Bk, "text/x-csharp", Wk, "csharp", Kl, "#"], null)], null), new q(null, 3, [Pj, "selector_eval_go", $k, "eval-go", Pm, new q(null, 4, [$m, "go", Bk, "go", Wk, "go", Kl, "//"], null)], null)], null)),
  Jy = null, Ky = 0, Ly = 0;;) {
    if (Ly < Ky) {
      var My = Jy.Z(null, Ly), Ny = null != My && (My.v & 64 || My.R) ? Rf(qg, My) : My, Oy = H.j(Ny, Pj), Py = H.j(Ny, $k), Qy = H.j(Ny, Pm), Ry = U.l(Ge.j(U.l(Qy, Jn, ig(Hy, Wk.h(Qy))), Wk), El, 3E3);
      oy(Py, Oy, Ry);
      Ly += 1;
    } else {
      var Sy = x(Iy);
      if (Sy) {
        var Ty = Sy;
        if (Se(Ty)) {
          var Uy = Ad(Ty), Vy = Bd(Ty), Wy = Uy, Xy = P(Uy), Iy = Vy, Jy = Wy, Ky = Xy
        } else {
          var Yy = I(Ty), Zy = null != Yy && (Yy.v & 64 || Yy.R) ? Rf(qg, Yy) : Yy, $y = H.j(Zy, Pj), az = H.j(Zy, $k), bz = H.j(Zy, Pm), cz = U.l(Ge.j(U.l(bz, Jn, ig(Hy, Wk.h(bz))), Wk), El, 3E3);
          oy(az, $y, cz);
          Iy = K(Ty);
          Jy = null;
          Ky = 0;
        }
        Ly = 0;
      } else {
        break;
      }
    }
  }
}
;function dz(a) {
  a = gj(new q(null, 2, [sk, new V(null, 1, 5, W, [new q(null, 1, [Hl, a], null)], null), Fl, "ADVANCED"], null));
  console.log(a);
  a = jj(compile(a), S([kj, !0], 0));
  a = null != a && (a.v & 64 || a.R) ? Rf(qg, a) : a;
  var b = H.j(a, Eo), c = H.j(a, Oj);
  H.j(a, Il);
  return x(c) ? [E("//errors during compilation:\n"), E(function() {
    var a = gj(c);
    return JSON.stringify(a);
  }())].join("") : b;
}
oy("compile-javascript", "selector_compile_js", new q(null, 5, [$m, "javascript", Bk, "javascript", Jn, function(a) {
  var b = kw(null), c = kw(1);
  Jv(function(b, c) {
    return function() {
      var f = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function(b, c) {
          return function(b) {
            var d = b[1];
            if (1 === d) {
              return Yv(b, 2, c, "//compiling...\n");
            }
            if (2 === d) {
              var d = b[2], e = iw(0);
              b[7] = d;
              return Xv(b, 3, e);
            }
            return 3 === d ? (d = b[2], e = dz(a), b[8] = d, Yv(b, 4, c, e)) : 4 === d ? Zv(b, b[2]) : null;
          };
        }(b, c), b, c);
      }(), g = function() {
        var a = f.w ? f.w() : f.call(null);
        a[6] = b;
        return a;
      }();
      return Wv(g);
    };
  }(c, b));
  return b;
}, El, 5E3, Kl, "//"], null));
function ez() {
  var a = uniter;
  return a.createEngine.call(a, "PHP");
}
oy("eval-php", "selector_eval_php", new q(null, 4, [$m, "text/x-php", Bk, "text/x-php", Jn, function(a) {
  var b = kw(null);
  a = [E("\x3c?php"), E(a)].join("");
  var c = kw(1);
  Jv(function(a, b, c) {
    return function() {
      var g = function() {
        return function(a) {
          return function() {
            function b(c) {
              for (;;) {
                var d;
                a: {
                  try {
                    for (;;) {
                      var e = a(c);
                      if (!Y(e, Z)) {
                        d = e;
                        break a;
                      }
                    }
                  } catch (f) {
                    if (f instanceof Object) {
                      c[5] = f, bw(c), d = Z;
                    } else {
                      throw f;
                    }
                  }
                }
                if (!Y(d, Z)) {
                  return d;
                }
              }
            }
            function c() {
              var a = [null, null, null, null, null, null, null, null, null];
              a[0] = d;
              a[1] = 1;
              return a;
            }
            var d = null, d = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return b.call(this, a);
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            d.w = c;
            d.h = b;
            return d;
          }();
        }(function(a, b, c) {
          return function(d) {
            var e = d[1];
            if (1 === e) {
              var f = ez(), g = f.getStderr, k = g.call(f), B = k.on, G = function() {
                return function(a, b, c, d, e, f, g, k, l, m, n) {
                  return function(a) {
                    return ow(n, "" + E(a));
                  };
                }(f, k, k, B, f, g, k, B, e, a, b, c);
              }(), D = B.call(k, "data", G), L = f.getStdout, R = L.call(f), wa = R.on, J = wa.call(R, "data", function() {
                return function(a, b, c, d, e, f, g, k, l, m, n, r, t, u, v, y) {
                  return function(a) {
                    return ow(y, "" + E(a));
                  };
                }(f, R, R, wa, f, g, k, B, G, D, L, R, wa, e, a, b, c);
              }()), Ra = f.execute.call(f, c);
              d[7] = J;
              d[8] = D;
              return Zv(d, Ra);
            }
            return null;
          };
        }(a, b, c), a, b, c);
      }(), k = function() {
        var b = g.w ? g.w() : g.call(null);
        b[6] = a;
        return b;
      }();
      return Wv(k);
    };
  }(c, b, a));
  return b;
}, Kl, "//"], null));
bj.A(S(["settings: ", window.klipse_settings], 0));
function fz() {
  return window.klipse_settings;
}
va("klipse.run.plugin_prod.plugin.settings", fz);
xy(fz());

})();
