'use strict';
/* Filters */
angular.module('myApp.filters', []).
filter('interpolate', ['version', function(version) {
    return function(text) {
        return String(text).replace(/\%VERSION\%/mg, version);
    };
}]);
mdlDirectTvApp.filter('offset', function() {
    return function(input, start) {
        if (input === null || input.length === 0 || (typeof input === 'undefined')) {
            return true;
        }
        start = parseInt(start, 10);
        return input.slice(start);
    };
});
mdlDirectTvApp.filter('range', function() {
    var filter = function(arr, lower, upper) {
        for (var i = lower; i <= upper; i++) {
            arr.push(i);
        }
        return arr;
    };
    return filter;
});
mdlDirectTvApp.directive('compile', ['$compile', function($compile) {
    return function(scope, element, attrs) {
        scope.$watch(function(scope) {
            // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
        }, function(value) {
            var splitResult = value.split('::');
            var description = splitResult[0];
            var source = splitResult[1];
            var id = splitResult[2];
            if (description.length > 120) {
                description = splitResult[0].substring(0, 119);
            }
            var result = description + '<a ng-click="cancelAll()" href="/' + source + '?titleId=' + id + '">..show details</a>';
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(result);
            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope);
        });
    };
}]);
mdlDirectTvApp.filter('split', function() {
    return function(input, splitChar, splitIndex) {
        // do some bounds checking here to ensure it has that index
        return input.split(splitChar)[splitIndex];
    }
});
mdlDirectTvApp.filter('customFilter', [function() {
    return function(items, type) {
        var result = {};
        if (type == "all") {
            return items;
        }
        angular.forEach(items, function(item, key) {
            if (item.isExpired == type) {
                result[key] = item;
            }
        });
        return result;
    };
}]);
mdlDirectTvApp.
filter('htmlToPlaintext', function() {
    return function(text) {
        return String(text).replace(/\$\$(.*?)\$\$/g, "{{'$1'|translate}}</I>");
    }
});
mdlDirectTvApp.filter('show_more', function($compile) {
    return function(input, name) {
        if (input.length < 120) return input;
        else {
            //return $compile( "<a ng-show='true'  href='"+name+"' style='color:#8FA2AF'>..show more</a>" );
            return input.substring(0, 119) + '<a ng-show="true" style="color:#8FA2AF">..show more</a>';
        }
    };
});
// Custom filter to linit the length of the string
mdlDirectTvApp.filter('cut', function() {
    return function(value, wordwise, max, tail) {
        if (!value) return '';
        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;
        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || ' …');
    };
});
mdlDirectTvApp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        console.log(input);
        return input.slice(start);
    };
});
mdlDirectTvApp.filter('html', function($sce) {
    return function(input) {
        return $sce.trustAsHtml(input);
    };
});