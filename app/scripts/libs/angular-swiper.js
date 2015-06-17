! function(e, i) {
    "use strict";

    function t() {
        for (var e = [], i = "0123456789abcdef", t = 0; 36 > t; t++) e[t] = i.substr(Math.floor(16 * Math.random()), 1);
        e[14] = "4", e[19] = i.substr(3 & e[19] | 8, 1), e[8] = e[13] = e[18] = e[23] = "-";
        var n = e.join("");
        return n
    }

    function n() {
        return {
            restrict: "E",
            transclude: !0,
            scope: {
                slidesPerView: "=",
                spaceBetween: "=",
                paginationClickable: "=",
                showNavButtons: "=",
                loop: "=",
                initialSlide: "=",
                containerCls: "@",
                paginationCls: "@",
                slideCls: "@",
                direction: "@"
            },
            controller: ["$scope", "$element", function(e, i) {
                this.buildSwiper = function() {
                    var t = e.slidesPerView || 1,
                        n = e.slidesPerColumn || 1,
                        r = e.paginationClickable || !0,
                        o = e.spaceBetween || 0,
                        s = e.direction || "vertical",
                        a = e.showNavButtons || !1,
                        l = e.loop || !1,
                        u = e.initialSlide || 0,
                        c = {
                            slidesPerView: t,
                            slidesPerColumn: n,
                            paginationClickable: r,
                            spaceBetween: o,
                            direction: s,
                            loop: l,
                            initialSlide: u,
                            pagination: "#paginator-" + e.swiper_uuid
                        };
                    a === !0 && (c.nextButton = "#nextButton-" + e.swiper_uuid, c.prevButton = "#prevButton-" + e.swiper_uuid);
                    e.containerCls || "", new Swiper(i[0].firstChild, c)
                }
            }],
            link: function(e, n) {
                var r = t();
                e.swiper_uuid = r;
                var o = "paginator-" + r,
                    s = "prevButton-" + r,
                    a = "nextButton-" + r;
                i.element(n[0].querySelector(".swiper-pagination")).attr("id", o), i.element(n[0].querySelector(".swiper-button-next")).attr("id", a), i.element(n[0].querySelector(".swiper-button-prev")).attr("id", s)
            },
            template: '<div class="swiper-container {{containerCls}}"><div class="swiper-wrapper" ng-transclude></div><div class="swiper-pagination"></div><div class="swiper-button-next" ng-show="showNavButtons"></div><div class="swiper-button-prev" ng-show="showNavButtons"></div></div>'
        }
    }

    function r(e) {
        return {
            restrict: "E",
            require: "^ksSwiperContainer",
            transclude: !0,
            template: "<div ng-transclude></div>",
            replace: !0,
            link: function(i, t, n, r) {
                i.$last === !0 && e(function() {
                    r.buildSwiper()
                }, 0)
            }
        }
    }
    i.module("ksSwiper", []).directive("ksSwiperContainer", n).directive("ksSwiperSlide", r), n.$inject = ["$log"], r.$inject = ["$timeout"]
}(window, angular, void 0);