/*
 *Last modified: 2021-07-16 18:04:52
 *Filename: ax.js
 *Description: Global JS
 *Version: v1.0.3
 *Website:www.axui.cn or ax.hobly.cn
 *Github:https://www.github.com/axui/axui
 *Gitee:https://www.gitee.com/axui/axui
 *Contact:3217728223@qq.com
 *Discuss:952502085(qq group)
 *Author:Michael
 */
/* blind client */
var userAgentInfo = navigator.userAgent;
var mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
var platformIs = 'pc';
for (var v = 0; v < mobileAgents.length; v++) {
    if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
        platformIs = 'mobile';
        break;
    }
}
var clientIs = 'pc';
var screenWidth = window.screen.width;
var screenHeight = window.screen.height;
if (screenWidth < 500) {
    clientIs = 'phone';
} else if (screenWidth > 500 && screenWidth < 900) {
    clientIs = 'pad';
} else if (screenWidth > 900 && screenWidth < 1200) {
    clientIs = 'padflip';
} else if (screenWidth > 1200 && screenWidth < 1500) {
    clientIs = 'padpro';
} else {
    clientIs = 'pc';
}

/* jq.cookie.js */
jQuery.cookie = function(name, value, options) {
    if (typeof value != "undefined") {
        options = options || {};
        if (value === null) {
            value = "";
            options = $.extend({}, options);
            options.expires = -1
        }
        var expires = "";
        if (options.expires && (typeof options.expires == "number" || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == "number") {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000))
            } else { date = options.expires }
            expires = "; expires=" + date.toUTCString()
        }
        var path = options.path ? "; path=" + (options.path) : "";
        var domain = options.domain ? "; domain=" + (options.domain) : "";
        var secure = options.secure ? "; secure" : "";
        document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join("")
    } else { var cookieValue = null; if (document.cookie && document.cookie != "") { var cookies = document.cookie.split(";"); for (var i = 0; i < cookies.length; i++) { var cookie = jQuery.trim(cookies[i]); if (cookie.substring(0, name.length + 1) == (name + "=")) { cookieValue = decodeURIComponent(cookie.substring(name.length + 1)); break } } } return cookieValue }
};

/* menu */
(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("jquery")) : typeof define === "function" && define.amd ? define(["jquery"], factory) : (global = global || self, global.axMenu = factory(global.jQuery))
}(this, function($) {
    $ = $ && $.hasOwnProperty("default") ? $["default"] : $;

    function _extends() {
        _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key]
                    }
                }
            }
            return target
        };
        return _extends.apply(this, arguments)
    }

    var Util = function($) {
        var TRANSITION_END = "transitionend";
        var Util = {
            TRANSITION_END: "mmTransitionEnd",
            triggerTransitionEnd: function triggerTransitionEnd(element) {
                $(element).trigger(TRANSITION_END)
            },
            supportsTransitionEnd: function supportsTransitionEnd() {
                return Boolean(TRANSITION_END)
            }
        };

        function getSpecialTransitionEndEvent() {
            return {
                bindType: TRANSITION_END,
                delegateType: TRANSITION_END,
                handle: function handle(event) {
                    if ($(event.target).is(this)) {
                        return event.handleObj.handler.apply(this, arguments)
                    }
                    return undefined
                }
            }
        }

        function transitionEndEmulator(duration) {
            var _this = this;
            var called = false;
            $(this).one(Util.TRANSITION_END, function() {
                called = true
            });
            setTimeout(function() {
                if (!called) {
                    Util.triggerTransitionEnd(_this)
                }
            }, duration);
            return this
        }

        function setTransitionEndSupport() {
            $.fn.mmEmulateTransitionEnd = transitionEndEmulator;
            $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent()
        }

        setTransitionEndSupport();
        return Util
    }($);
    var NAME = "axMenu";
    var DATA_KEY = "axMenu";
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = ".data-api";
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var TRANSITION_DURATION = 350;
    var Default = {
        toggle: true,
        cookie: false, //AXUI
        row: false, //AXUI
        width: '', //AXUI
        dropWidth: '', //AXUI
        gutter: '', //AXUI
        trigger: 'click', //AXUI
        preventDefault: true,
        triggerElement: "a",
        parentTrigger: "li",
        subMenu: "ul"
    };
    var Event = {
        SHOW: "show" + EVENT_KEY,
        SHOWN: "shown" + EVENT_KEY,
        HIDE: "hide" + EVENT_KEY,
        HIDDEN: "hidden" + EVENT_KEY,
        CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY,
        CLICK_DATA_API_2: "mouseenter" + EVENT_KEY + DATA_API_KEY, //AXUI
        CLICK_DATA_API_3: "mouseleave" + EVENT_KEY + DATA_API_KEY, //AXUI
    };
    var ClassName = {
        AX: "",
        ACTIVE: "ax-active",
        SHOW: "ax-show",
        COLLAPSE: "ax-collapse",
        COLLAPSING: "ax-collapsing",
        COLLAPSED: "ax-collapsed",
        ROW: "ax-menu-row",
        HOVER: "ax-menu-hover",
    };
    var AxMenu = function() {
        function AxMenu(element, config) {
            this.element = element;
            this.config = _extends({}, Default, {}, config);
            this.transitioning = null;
            this.init()
        }

        var _proto = AxMenu.prototype;
        _proto.init = function init() {
            var self = this;
            var conf = this.config;
            var el = $(this.element);
            el.addClass(ClassName.AX);
            if (conf.row == true) {
                el.addClass(ClassName.ROW);
            }
            if (conf.dropWidth != '') {
                el.children("li").children("ul").css("width", conf.dropWidth);
            }
            if (conf.width != '') {
                el.children("li").css("width", conf.width);
                var offsetLeft = (el.children("li").width() - el.children("li").children("ul").width() - 2) / 2;
                el.children("li").children("ul").css("left", offsetLeft);
            }
            if (conf.gutter != '') {
                el.children("li").css({ "margin-left": conf.gutter, "margin-right": conf.gutter });
            }

            //cookie
            if (conf.cookie == true) {

                var thisMenuid = el.attr("id");
                el.find("li").each(function(i) {
                    $(this).children("a:first-child").attr("aria-cookie", thisMenuid + i);
                });

                var cookieId = "menu-" + thisMenuid;
                var cookieExpand = "expand-" + thisMenuid;

                el.find("a").click(function() {
                    var thismenu = $(this).attr("aria-cookie");
                    $.cookie(cookieId, thismenu, { expires: 365000, path: '/' });
                    var thisexpand = $(this).attr("aria-expanded");
                    if (typeof($(this).attr("aria-expanded")) == "undefined") {
                        $.cookie(cookieExpand, 'false', { expires: 365000, path: '/' });
                    } else {
                        $.cookie(cookieExpand, thisexpand, { expires: 365000, path: '/' });
                    }

                });

                //
                var menuid = $("[aria-cookie=" + $.cookie(cookieId) + "]");
                if ($.cookie(cookieExpand) == "true") {
                    menuid.parent("li").removeClass(ClassName.ACTIVE);
                } else {
                    menuid.parent("li").addClass(ClassName.ACTIVE);
                }
            }

            //
            var thisActive = el.find(conf.parentTrigger + "." + ClassName.ACTIVE);

            $(thisActive).each(function() {
                if ($(this).children("ul").length > 0) {
                    $(this).children(conf.triggerElement).attr("aria-expanded", "true");
                } else {
                    $(this).children(conf.triggerElement).attr("aria-expanded", "childless");
                }
            });

            //
            el.find(conf.parentTrigger + "." + ClassName.ACTIVE).parents(conf.parentTrigger).addClass(ClassName.ACTIVE);

            el.find(conf.parentTrigger + "." + ClassName.ACTIVE).parents(conf.parentTrigger).children(conf.triggerElement).attr("aria-expanded", "true");

            el.find(conf.parentTrigger + "." + ClassName.ACTIVE).has(conf.subMenu).children(conf.subMenu).addClass(ClassName.COLLAPSE + " " + ClassName.SHOW);
            el.find(conf.parentTrigger).not("." + ClassName.ACTIVE).has(conf.subMenu).children(conf.subMenu).addClass(ClassName.COLLAPSE);

            //AXUI
            if (conf.trigger == "hover") {
                el.find(conf.parentTrigger).on(Event.CLICK_DATA_API_3, function(e) {

                    $(this).removeClass(ClassName.ACTIVE);
                    $(this).children(conf.triggerElement).attr('aria-expanded', 'false');
                    $(this).children(conf.subMenu).removeClass(ClassName.SHOW);

                }); //trigger mouseleaver

                el.find(conf.parentTrigger).on(Event.CLICK_DATA_API_2, function(e) {
                    // eslint-disable-line func-names
                    var eTar = $(this).children(conf.triggerElement);

                    if (eTar.attr("aria-disabled") === "true") {
                        return
                    }
                    if (conf.preventDefault && eTar.attr("href") === "#") {
                        e.preventDefault()
                    }
                    var paRent = eTar.parent(conf.parentTrigger);
                    var sibLi = paRent.siblings(conf.parentTrigger);
                    var sibTrigger = sibLi.children(conf.triggerElement);

                    if (paRent.hasClass(ClassName.ACTIVE)) {
                        eTar.attr("aria-expanded", "false");
                        self.removeActive(paRent)
                    } else {
                        if (eTar.next("ul").length > 0) {
                            eTar.attr("aria-expanded", "true")
                        } else {
                            eTar.attr("aria-expanded", "childless")
                        }
                        self.setActive(paRent);
                        if (conf.toggle) {
                            self.removeActive(sibLi);
                            sibTrigger.attr("aria-expanded", "false")
                        }
                    }


                    if (conf.onTransitionStart) {
                        conf.onTransitionStart(e)
                    }
                }); //trigger mouseenter

            } else {
                el.find(conf.parentTrigger).children(conf.triggerElement).on(Event.CLICK_DATA_API, function(e) {
                    var eTar = $(this);
                    if (eTar.attr("aria-disabled") === "true") {
                        return
                    }
                    if (conf.preventDefault && eTar.attr("href") === "#") {
                        e.preventDefault()
                    }
                    var paRent = eTar.parent(conf.parentTrigger);
                    var sibLi = paRent.siblings(conf.parentTrigger);
                    var sibTrigger = sibLi.children(conf.triggerElement);

                    if (paRent.hasClass(ClassName.ACTIVE)) {
                        eTar.attr("aria-expanded", "false");
                        self.removeActive(paRent)
                    } else {
                        if (eTar.next("ul").length > 0) {
                            eTar.attr("aria-expanded", "true")
                        } else {
                            eTar.attr("aria-expanded", "childless")
                        }
                        self.setActive(paRent);
                        if (conf.toggle) {
                            self.removeActive(sibLi);
                            sibTrigger.attr("aria-expanded", "false")
                        }
                    }


                    if (conf.onTransitionStart) {
                        conf.onTransitionStart(e)
                    }

                }); //trigger click
            }
            //AXUI


        };
        _proto.setActive = function setActive(li) {
            $(li).addClass(ClassName.ACTIVE);
            var ul = $(li).children(this.config.subMenu);
            if (ul.length > 0 && !ul.hasClass(ClassName.SHOW)) {
                this.show(ul)
            }
        };
        _proto.removeActive = function removeActive(li) {
            $(li).removeClass(ClassName.ACTIVE);
            var ul = $(li).children(this.config.subMenu + "." + ClassName.SHOW);
            if (ul.length > 0) {
                this.hide(ul)
            }
        };
        _proto.show = function show(element) {
            var _this = this;
            if (this.transitioning || $(element).hasClass(ClassName.COLLAPSING)) {
                return
            }
            var elem = $(element);
            var startEvent = $.Event(Event.SHOW);
            elem.trigger(startEvent);
            if (startEvent.isDefaultPrevented()) {
                return
            }
            elem.parent(this.config.parentTrigger).addClass(ClassName.ACTIVE);
            if (this.config.toggle) {
                var toggleElem = elem.parent(this.config.parentTrigger).siblings().children(this.config.subMenu + "." + ClassName.SHOW);
                this.hide(toggleElem)
            }
            elem.removeClass(ClassName.COLLAPSE).addClass(ClassName.COLLAPSING).height(0);
            this.setTransitioning(true);
            var complete = function complete() {
                if (!_this.config || !_this.element) {
                    return
                }
                elem.removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE + " " + ClassName.SHOW).height("");
                _this.setTransitioning(false);
                elem.trigger(Event.SHOWN)
            };
            elem.height(element[0].scrollHeight).one(Util.TRANSITION_END, complete).mmEmulateTransitionEnd(TRANSITION_DURATION)
        };
        _proto.hide = function hide(element) {
            var _this2 = this;
            if (this.transitioning || !$(element).hasClass(ClassName.SHOW)) {
                return
            }
            var elem = $(element);
            var startEvent = $.Event(Event.HIDE);
            elem.trigger(startEvent);
            if (startEvent.isDefaultPrevented()) {
                return
            }
            elem.parent(this.config.parentTrigger).removeClass(ClassName.ACTIVE);
            elem.height(elem.height())[0].offsetHeight;
            elem.addClass(ClassName.COLLAPSING).removeClass(ClassName.COLLAPSE).removeClass(ClassName.SHOW);
            this.setTransitioning(true);
            var complete = function complete() {
                if (!_this2.config || !_this2.element) {
                    return
                }
                if (_this2.transitioning && _this2.config.onTransitionEnd) {
                    _this2.config.onTransitionEnd()
                }
                _this2.setTransitioning(false);
                elem.trigger(Event.HIDDEN);
                elem.removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE)
            };
            if (elem.height() === 0 || elem.css("display") === "none") {
                complete()
            } else {
                elem.height(0).one(Util.TRANSITION_END, complete).mmEmulateTransitionEnd(TRANSITION_DURATION)
            }
        };
        _proto.setTransitioning = function setTransitioning(isTransitioning) {
            this.transitioning = isTransitioning
        };
        _proto.dispose = function dispose() {
            $.removeData(this.element, DATA_KEY);
            $(this.element).find(this.config.parentTrigger) //.has(this.config.subMenu)
                .children(this.config.triggerElement).off(Event.CLICK_DATA_API);
            this.transitioning = null;
            this.config = null;
            this.element = null
        };
        AxMenu.jQueryInterface = function jQueryInterface(config) {
            return this.each(function() {
                var $this = $(this);
                var data = $this.data(DATA_KEY);
                var conf = _extends({}, Default, {}, $this.data(), {}, typeof config === 'object' && config ? config : {});
                if (!data) {
                    data = new AxMenu(this, conf);
                    $this.data(DATA_KEY, data)
                }
                if (typeof config === "string") {
                    if (data[config] === undefined) {
                        throw new Error('No method named "' + config + '"')
                    }
                    data[config]()
                }
            })
        };
        return AxMenu
    }();
    $.fn[NAME] = AxMenu.jQueryInterface;
    $.fn[NAME].Constructor = AxMenu;
    $.fn[NAME].noConflict = function() {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return AxMenu.jQueryInterface
    };
    return AxMenu
}));


/* ready */
$(document).ready(function() {


    //scrollnav response
    $(".ax-scrollnav-h").each(function() {
        var nav = $(this);
        var outer = $(this).find(".ax-scrollnav");
        var inner = $(this).find(".ax-scrollnav-list");
        var width = 0;
        inner.find("li").each(function() {
            width += parseInt($(this).outerWidth(true));
        });

        if (outer.width() < width) {
            inner.css("width", width);
            outer.css("overflow-x", "auto");
        }
    });
    $(".ax-scrollnav-v").each(function() {
        var nav = $(this);
        $(this).find(".ax-close").click(function() {
            if (nav.hasClass("ax-hide")) {
                nav.removeClass("ax-hide");
                $.cookie('scrollnav', 'show', { expires: 3650, path: '/' });
            } else {
                nav.addClass("ax-hide");
                $.cookie('scrollnav', 'hide', { expires: 3650, path: '/' });
            }
        });
    });
    if ($.cookie("scrollnav") === 'hide') {
        $(".ax-scrollnav-v").addClass("ax-hide");
    } else {
        $(".ax-scrollnav-v").removeClass("ax-hide");
    }
    
});


// 以下为开始载入执行
$(document).ready(function () {

    //菜单收缩到图标
    if(clientIs == 'phone'||clientIs == 'pad'){
        $(".ax-admin nav").addClass("ax-nav-fold");
    }
    //
    $(".ax-admin nav .ax-close-nav,.ax-admin nav .ax-mask").click(function(){

        //
        if(clientIs == 'phone'||clientIs == 'pad'){
            $(".ax-admin aside").removeClass("ax-aside-unfold");
            $.cookie('closeAside', 'fold', { expires: 3650, path: '/' });
        }

        if($(".ax-admin nav").hasClass("ax-nav-fold")){

            $(".ax-admin nav").removeClass("ax-nav-fold");
            $(".ax-admin nav .ax-menu .ax-show").css("height","auto");
            $.cookie('closeNav', '', { expires: 3650, path: '/' });
        }else{
            $(".ax-admin nav").addClass("ax-nav-fold");
            $(".ax-admin nav .ax-menu .ax-show").css("height","0");
            $.cookie('closeNav', 'fold', { expires: 3650, path: '/' });
        }
    });


    $(".ax-menu a").click(function(){

        if($(".ax-nav").hasClass("ax-nav-fold")){
            $(".ax-nav").removeClass("ax-nav-fold");
            $.cookie('closeNav', '', { expires: 3650, path: '/' });
        }
    });

    if($.cookie("closeNav") === 'fold') {
        $(".ax-admin nav").addClass("ax-nav-fold");
        $(".ax-admin nav .ax-menu .ax-show").css("height","0");
    } else {
        if(clientIs == 'phone'||clientIs == 'pad'){
            $(".ax-admin nav").addClass("ax-nav-fold");
        }else{
            $(".ax-admin nav").removeClass("ax-nav-fold");
        }
        $(".ax-admin nav .ax-menu .ax-show").css("height","auto");
    }

    $('.ax-close-nav-all').click(function(){
      $(".ax-admin nav .ax-close-nav").trigger("click");
    });
});
