'use strict';
/* Directives */
angular.module('directTvApp.directives', []).
directive('appVersion', ['version',
    function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }
]);
////////////////////////////FORM AUTO FILL//////////////////////////////
mdlDirectTvApp.directive('autoFillSync', function($timeout) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
            var origVal = elem.val();
            $timeout(function() {
                var newVal = elem.val();
                if (ngModel.$pristine && origVal !== newVal) {
                    ngModel.$setViewValue(newVal);
                }
            }, 500);
        }
    }
});
mdlDirectTvApp.directive('imageonload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    //call the function that was passed
                    scope.$apply(attrs.imageonload);
                });
            }
        };
    })
    ////////////////////////////FALLBACK SRC//////////////////////////////
mdlDirectTvApp.directive('fallbackSrc', function() {
    var fallbackSrc = {
        link: function postLink(scope, iElement, iAttrs) {
            iElement.bind('error', function() {
                console.log("%%&$image Load failed");
                console.log(angular.element(this).attr("src"));
                angular.element(this).attr("src", iAttrs.fallbackSrc);
            });
        }
    }
    return fallbackSrc;
});
mdlDirectTvApp.filter('capitalize', function() {
    return function(input, scope) {
        if (input != null) input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
});
mdlDirectTvApp.directive('formAutofillFix', function() {
    return function(scope, elem, attrs) {
        // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
        elem.prop('method', 'POST');
        // Fix autofill issues where Angular doesn't know about autofilled inputs
        if (attrs.ngSubmit) {
            setTimeout(function() {
                elem.unbind('submit').submit(function(e) {
                    e.preventDefault();
                    elem.find('input, textarea, select').trigger('input').trigger('change').trigger('keydown');
                    scope.$apply(attrs.ngSubmit);
                });
            }, 0);
        }
    };
});
////////////////////////FORM AUTO FILL/////////////////////////////////////////
mdlDirectTvApp.directive('resize', ['$window', function($window) {
    return function(scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function() {
            return {
                'h': w.height(),
                'w': w.width()
            };
        };
        scope.$watch(scope.getWindowDimensions, function(newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;
            scope.style = function() {
                return {
                    'height': (newValue.h - 100) + 'px',
                    'width': (newValue.w - 100) + 'px'
                };
            };
        }, true);
        w.bind('resize', function() {
            scope.$apply();
        });
    }
}]);
////////////////////////////////////POSTCODE VALIDATION///////////////////////////////////////////
mdlDirectTvApp.directive('reApply', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ctrl) {
            scope.$watch('regExp', function(newval, oldval) {
                if (!!newval) {
                    var value = ctrl.$viewValue;
                    if (ctrl.$isEmpty(value) || newval.test(value)) {
                        ctrl.$setValidity('pattern', true);
                        return value;
                    } else {
                        ctrl.$setValidity('pattern', false);
                        return undefined;
                    }
                }
            });
        }
    };
});
////////////////////////////////////POSTCODE VALIDATION///////////////////////////////////////////
//used to ditect end of ng-repeat
mdlDirectTvApp.directive('onFinishRenderFilters', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
}]);
//used to ditect end of ng-repeat
mdlDirectTvApp.directive('onFinishSliderFilters', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatSliderFinished');
                    console.log("NG repeat Slider End-----------");
                });
            }
        }
    }
}]);
mdlDirectTvApp.directive('jqdatepickerfrom', function($parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            var ngModel = $parse(attrs.ngModel);
            element.datepicker({
                dateFormat: 'yy-mm-dd',
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1,
                onSelect: function(date) {
                    scope.$apply(function(scope) {
                        ngModel.assign(scope, date);
                    });
                },
                onClose: function(selectedDate) {
                    var toDateElement = jQuery("#toBillingDate");
                    toDateElement.datepicker("option", "minDate", selectedDate);
                    if ((toDateElement.val() != 'undefined') || (toDateElement.val() == null)) scope.getBillingTransaction(selectedDate, toDateElement.val());
                }
            });
        }
    };
});
mdlDirectTvApp.directive('jqdatepickerto', function($parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            var ngModel = $parse(attrs.ngModel);
            element.datepicker({
                dateFormat: 'yy-mm-dd',
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1,
                onSelect: function(date) {
                    scope.$apply(function(scope) {
                        ngModel.assign(scope, date);
                    });
                },
                onClose: function(selectedDate) {
                    var fromDateElement = jQuery("#fromBillingDate");
                    fromDateElement.datepicker("option", "maxDate", selectedDate);
                    scope.getBillingTransaction(fromDateElement.val(), selectedDate);
                }
            });
        }
    };
});
mdlDirectTvApp.directive('jqdatepickerRange', function($parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            var ngModel = $parse(attrs.ngModel);
            element.datepicker({
                defaultDate: "+1w",
                changeMonth: true,
                onSelect: function(date) {
                    scope.$apply(function(scope) {
                        // Change binded variable
                        ngModel.assign(scope, date);
                    });
                },
                onClose: function(selectedDate) {
                    if (jQuery("#fromDate").val() !== '') jQuery("#toDate").datepicker("option", "minDate", selectedDate);
                }
            });
        }
    };
});
//mdlDirectTvApp.directive('navbarMainCollapse', ['$rootScope', function ($rootScope) {
//    return {
//        restrict: 'A',
//        link: function (scope, element) {
//            //watch for state/route change (Angular UI Router specific)
////            $rootScope.$on('$stateChangeSuccess', function () {
////                if (!element.hasClass('collapse')) {
////                    element.collapse('hide');
////                }
////            });
//
//            element.bind("click", function(e){
//                  console.log("click");
//            });
//        }
//    };
//}]);    
mdlDirectTvApp.directive('collapseSubMenu', function() {
    return {
        link: function(scope, element, attrs, ctrl) {
            element.bind("click", function(e) {
                element.parent().parent().removeClass("navOpen");
                element.parent().parent().addClass("navClose");
            });
        }
    }
});
mdlDirectTvApp.directive('showSubMenu', function() {
    return {
        link: function(scope, element, attrs, ctrl) {
            element.bind("mouseover", function(e) {
                jQuery('#collasible').find('ul').removeClass("navOpen");
                if (element.next("ul").is(":hidden")) {
                    element.next("ul").removeClass("navClose");
                    element.next("ul").addClass("navOpen");
                }
            });
            jQuery('#menuDesktop').bind("mouseleave", function(e) {
                jQuery('#collasible').find('ul').removeClass("navOpen");
                jQuery('#navrightside').find('ul').removeClass("navOpen");
            });
        }
    }
});
mdlDirectTvApp.directive('showSubMenuMob', function() {
    return {
        link: function(scope, element, attrs, ctrl) {
            element.bind("click", function(e) {
                if (element.hasClass("openMenu")) {
                    jQuery("#collapsibleMob>ul>li>span.openMenu").removeClass("openMenu");
                    jQuery('#collapsibleMob').find('ul').removeClass("navOpen");
                    jQuery('#navrightside').find('ul').removeClass("navOpen");
                } else {
                    // Close existing open menus & remove class
                    jQuery("#collapsibleMob>ul>li>span.openMenu").removeClass("openMenu");
                    jQuery('#collapsibleMob').find('ul').removeClass("navOpen");
                    element.addClass("openMenu");
                    jQuery('#collasible').find('ul').removeClass("navOpen");
                    if (element.next("ul").is(":hidden")) {
                        element.next("ul").removeClass("navClose");
                        element.next("ul").addClass("navOpen");
                    }
                }
            });
        }
    }
});
mdlDirectTvApp.directive('closeGener', function() {
    return {
        link: function(scope, element, attrs, ctrl) {
            element.bind("click", function(e) {
                jQuery('#drop-gener').removeClass("navOpen");
                jQuery('#drop-gener').addClass("navClose");
            });
        }
    }
});
mdlDirectTvApp.directive('showHideGener', function() {
    return {
        link: function(scope, element, attrs, ctrl) {
            element.bind("mouseover", function(e) {
                jQuery('#drop-gener').removeClass("navOpen");
                if (element.next("ul").is(":hidden")) {
                    element.next("ul").removeClass("navClose");
                    element.next("ul").addClass("navOpen");
                }
            });
            jQuery('.secondaryTopMenuContainer').bind("mouseleave", function(e) {
                jQuery('#collasible').find('ul').removeClass("navOpen");
                jQuery('#navrightside').find('ul').removeClass("navOpen");
            });
        }
    }
});
//SORT -------------------------------------------
mdlDirectTvApp.filter('orderObjectBy', function() {
    return function(input, attribute) {
        if (!angular.isObject(input)) return input;
        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }
        array.sort(function(a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    }
});
//add empty calss to first element in select box -------------------------------------------
mdlDirectTvApp.directive('selectFirstClass', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(attrs.ngModel, function(value) {
                if (value == null || value.length == 0 || (typeof value == undefined)) {
                    element.addClass("empty");
                    return true;
                } else {
                    element.removeClass("empty");
                    return;
                }
            });
        }
    }
});
//////////////////////////////PASSWORD/////////////////////////////////////
mdlDirectTvApp.directive('validateOldPassword', function($compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(attrs.ngModel, function(val) {
                var newPassEle = angular.element(document.querySelector('#uAdminNewPassword'));
                var newPass = newPassEle.val();
                var confirmPassEle = angular.element(document.querySelector('#uAdminConfirmPassword'));
                var confirmPass = confirmPassEle.val();
                if (val == null || val.length == 0 || (typeof val == undefined)) {
                    newPassEle.attr("required", false);
                    confirmPassEle.attr("required", false);
                    return true;
                } else {
                    newPassEle.attr("required", true);
                    confirmPassEle.attr("required", true);
                }
            });
        }
    };
});
mdlDirectTvApp.directive('validateNewPassword', function($compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(attrs.ngModel, function(val) {
                var oldPassEle = angular.element(document.querySelector('#uAdminOldPassword'));
                var oldPass = oldPassEle.val();
                var confirmPassEle = angular.element(document.querySelector('#uAdminConfirmPassword'));
                var confirmPass = confirmPassEle.val();
                if (val == null || val.length == 0 || (typeof val == undefined)) {
                    oldPassEle.attr("required", false);
                    confirmPassEle.attr("required", false);
                    return true;
                } else {
                    oldPassEle.attr("required", false);
                    confirmPassEle.attr("required", true);
                }
            });
        }
    };
});
//////////////////////////////PASSWORD/////////////////////////////////////
mdlDirectTvApp.directive('focusMe', function($timeout) {
    return {
        scope: {
            trigger: '=focusMe'
        },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if (value === true) {
                    //console.log('trigger',value);
                    //$timeout(function() {
                    element[0].focus();
                    scope.trigger = false;
                    //});
                }
            });
        }
    };
});
mdlDirectTvApp.directive('myDirective', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch(attrs.ngModel, function(v) {
                console.log('value changed, new value is: ' + v);
            });
        }
    };
});
mdlDirectTvApp.directive('cardNumberTypeCheck', function($compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(attrs.ngModel, function(val) {
                if (val == null || val.length == 0 || (typeof val == undefined)) {
                    return true;
                } else {
                    ctrl.$setValidity('type', true);
                    var cardType = attrs.cardNumberTypeCheck;
                    if ((cardType != 'mastercard') && (cardType != 'visa') && (cardType != 'amex') && (cardType != 'discover')) {
                        ctrl.$setValidity('type', false);
                    }
                }
            });
        }
    };
});
///////////////////////ANGULAR PAYMENTS//////////////////////////////////////////
mdlDirectTvApp.directive('creditCardType', function() {
        var directive = {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                scope.$watch(attrs.ngModel, function(value) {
                    if (value == null || value.length == 0 || (typeof value == undefined)) {
                        scope.ccinfo = null;
                        return true;
                    } else {
                        scope.ccinfo = (/^5[1-5]/.test(value)) ? "mastercard" : (/^4/.test(value)) ? "visa" : (/^3[47]/.test(value)) ? 'amex' : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(value)) ? 'discover' : undefined
                        ctrl.$setValidity('invalid', !!scope.ccinfo)
                        value = value.replace(/^\d{6}/, 'XXXXXX')
                        return elm.val(value);
                    }
                });
            }
        }
        return directive
    })
    //check credit card month expiry -------------------------------------------
mdlDirectTvApp.directive('expiryMonth', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(attrs.ngModel, function(month) {
                if (month == null || month.length == 0 || (typeof month == undefined)) {
                    element.addClass("empty");
                    return true;
                } else {
                    element.removeClass("empty");
                    var yearEle = angular.element(document.querySelector('#vin_PaymentMethod_creditCard_expirationDate_Year'));
                    var year = yearEle.val();
                    if (year == null || year.length == 0 || (typeof year == undefined)) {
                        return true;
                    }
                    var expiryValidity = _checkExpiry(month, year);
                    if (expiryValidity && yearEle.hasClass('ng-invalid-year')) yearEle.removeClass('ng-invalid-year');
                    ctrl.$setValidity('month', expiryValidity);
                    return;
                }
            });
        }
    }
});
//check credit card year expiry -------------------------------------------
mdlDirectTvApp.directive('expiryYear', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(attrs.ngModel, function(year) {
                if (year == null || year.length == 0 || (typeof year == undefined)) {
                    element.addClass("empty");
                    return true;
                } else {
                    element.removeClass("empty");
                    var monthEle = angular.element(document.querySelector('#vin_PaymentMethod_creditCard_expirationDate_Month'));
                    var month = monthEle.val();
                    if (month == null || month.length == 0 || (typeof month == undefined)) {
                        return true;
                    }
                    var expiryValidity = _checkExpiry(month, year);
                    if (expiryValidity && monthEle.hasClass('ng-invalid-month')) monthEle.removeClass('ng-invalid-month');
                    ctrl.$setValidity('year', expiryValidity);
                    return;
                }
            });
        }
    }
});
var _checkExpiry = function(month, year) {
    var currentTime, expiry, prefix;
    if (!(month && year)) {
        return false;
    }
    if (!/^\d+$/.test(month)) {
        return false;
    }
    if (!/^\d+$/.test(year)) {
        return false;
    }
    if (!(parseInt(month, 10) <= 12)) {
        return false;
    }
    if (year.length === 2) {
        prefix = (new Date).getFullYear();
        prefix = prefix.toString().slice(0, 2);
        year = prefix + year;
    }
    expiry = new Date(year, month);
    currentTime = new Date;
    expiry.setMonth(expiry.getMonth() - 1);
    expiry.setMonth(expiry.getMonth() + 1, 1);
    return expiry > currentTime;
}
mdlDirectTvApp.directive('cardExpiration', function() {
    var directive = {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            scope.$watch('[vin_PaymentMethod_creditCard_expirationDate_Month,vin_PaymentMethod_creditCard_expirationDate_Year]', function(value) {
                ctrl.$setValidity('invalid', true)
                var currentYear = new Date().getFullYear();
                var currentMonth = new Date().getMonth() + 1;
                if (scope.vin_PaymentMethod_creditCard_expirationDate_Year == currentYear && scope.vin_PaymentMethod_creditCard_expirationDate_Month <= currentMonth) {
                    ctrl.$setValidity('invalid', false)
                }
                return value
            }, true)
        }
    }
    return directive
});
mdlDirectTvApp.directive('nxEqual', function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, model) {
            if (!attrs.nxEqual) {
                console.error('nxEqual expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.nxEqual, function(value) {
                model.$setValidity('nxEqual', value != model.$viewValue);
            });
            model.$parsers.push(function(value) {
                var isValid = value != scope.$eval(attrs.nxEqual);
                model.$setValidity('nxEqual', isValid);
                return isValid ? value : undefined;
            });
        }
    };
});
mdlDirectTvApp.directive('clickOutside', function($document) {
    return {
        restrict: 'A',
        replace: false,
        require: '?ngModel',
        scope: {
            clickOutside: '&',
        },
        link: function(scope, el, attr) {
            $document.on('click', function(e) {
                if (el !== e.target && !el[0].contains(e.target)) {
                    scope.$parent.showSearchResult = scope.$parent.showNoSearchResult = scope.$parent.showSearchHint = false;
                    if (scope.$parent.searchTerm == '' || scope.$parent.searchTerm == null) {
                        scope.$parent.searchPlaceholder = 'TXT_SEARCH_INITIAL_PLACEHOLDER';
                        scope.$parent.focused = false;
                    } else {
                        scope.$parent.focused = true;
                    }
                    scope.$apply(function() {
                        scope.$eval(scope.clickOutside);
                    });
                }
            });
        }
    }
});
mdlDirectTvApp.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter, {
                        'event': event
                    });
                });
                event.preventDefault();
            }
        });
    };
});
mdlDirectTvApp.directive('isNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope) {
            scope.$watch('vin_PaymentMethod_creditCard_account', function(newValue, oldValue) {
                var arr = String(newValue).split("");
                if (arr.length === 0) return;
                if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.')) return;
                if (arr.length === 2 && newValue === '-.') return;
                if (isNaN(newValue)) {
                    scope.vin_PaymentMethod_creditCard_account = oldValue;
                }
            });
        }
    };
});
mdlDirectTvApp.directive('onlyDigits', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;
            ngModel.$parsers.unshift(function(inputValue) {
                var digits = inputValue.split('').filter(function(s) {
                    return (!isNaN(s) && s != ' ');
                }).join('');
                ngModel.$viewValue = digits;
                ngModel.$render();
                return digits;
            });
        }
    };
});
mdlDirectTvApp.directive("limitTo", [function() {
    return {
        restrict: "A",
        require: '?ngModel',
        link: function(scope, elem, attrs, ngModel) {
            if (!ngModel) return;
            var limit = parseInt(attrs.limitTo);
            ngModel.$parsers.unshift(function(inputValue) {
                var digits = inputValue.split('').filter(function(s) {
                    return (!isNaN(s) && s != ' ');
                }).join('');
                digits = digits.substring(0, limit - 1);
                ngModel.$viewValue = digits;
                ngModel.$render();
                return digits;
            });
        }
    }
}]);
mdlDirectTvApp.directive('ngFocus', [function() {
    var FOCUS_CLASS = "ng-focused";
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$focused = false;
            element.bind('focus', function(evt) {
                element.addClass(FOCUS_CLASS);
                scope.$apply(function() {
                    ctrl.$focused = true;
                });
            }).bind('blur', function(evt) {
                element.removeClass(FOCUS_CLASS);
                scope.$apply(function() {
                    ctrl.$focused = false;
                });
            });
        }
    }
}]);
mdlDirectTvApp.directive('restrict', function($parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, iElement, iAttrs, controller) {
            scope.$watch(iAttrs.ngModel, function(value) {
                if (!value) {
                    return;
                }
                $parse(iAttrs.ngModel).assign(scope, value.replace(new RegExp(iAttrs.restrict, 'g'), ''));
            });
        }
    }
});