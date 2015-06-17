'use strict';
/* Form Validation Directive */
// name pattern validation
mdlDirectTvApp.directive('validNamePattern', function() {
    return {
        restrict: 'A',
        require: "ngModel",
        link: function(scope, elm, attrs, ctrl) {
            var regex = /^[A-z][A-z0-9]+$/;
            var validator = function(value) {
                ctrl.$setValidity('validNamePattern', regex.test(value));
                return value;
            };
            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.unshift(validator);
        }
    };
});
// password pattern validation
mdlDirectTvApp.directive('validPasswordPattern', function() {
    return {
        restrict: 'A',
        require: "ngModel",
        link: function(scope, elm, attrs, ctrl) {
            var regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/;
            var validator = function(value) {
                ctrl.$setValidity('validPasswordPattern', regex.test(value));
                return value;
            };
            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.unshift(validator);
        }
    };
});
//password match validation type 1
mdlDirectTvApp.directive('validPasswordC', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue, $scope) {
                var noMatch = viewValue != scope.signupForm.userpassword.$viewValue;
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
});
//password match validation type 2
mdlDirectTvApp.directive('equals', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
            if (!ngModel) return;
            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function(val) {
                if (val == null || val.length == 0 || (typeof val == undefined)) {
                    ngModel.$setValidity('equals', true);
                    return true;
                }
                validate();
            });
            // observe the other value and re-validate on change
            attrs.$observe('equals', function(val) {
                validate();
            });
            var validate = function() {
                var val1 = ngModel.$viewValue;
                var val2 = attrs.equals;
                // set validity
                ngModel.$setValidity('equals', val1 === val2);
            };
        }
    }
});
mdlDirectTvApp.directive('groupedlist', function() {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: '/groupedList.html',
        link: function() {}
    };
});
mdlDirectTvApp.directive('mousable', function() {
    return {
        link: function(scope, element, attrs, ctrl) {
            element.bind("mouseover", function(e) {
                element.parent().addClass('menu-font-color');
            });
            element.bind("mouseout", function(e) {
                element.parent().removeClass('menu-font-color');
            });
        }
    }
});
mdlDirectTvApp.directive('capitalizeFirst', ['uppercaseFilter', function(uppercaseFilter) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            };
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);
        }
    };
}]);
//active menu color based on the route
mdlDirectTvApp.directive('activeLink', ['$location',
    function(location) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                var clazz = attrs.activeLink;
                var path = attrs.ngHref;
                // path = path.substring(1); //hack because path does bot return including hashbang
                scope.location = location;
                scope.$watch('location.path()', function(newPath) {
                    if (path === newPath) {
                        element.addClass(clazz);
                    } else {
                        element.removeClass(clazz);
                    }
                });
            }
        };
    }
]);