(function () {

    'use strict';
    var app = angular.module('tpManager.directives', []);

    /**
     * Defines which DOM Elements should be watched
     */
    app.directive('responsive', function() {
        return {
            replace: true,
            controller: function ($scope, $window, $rootScope) {
                $(window).resize(function () {
                    $rootScope.resize($rootScope);
                    $rootScope.$digest();
                });
            }
        }
    });

    /**
     * Formats a date type to the current locale
     */
    app.directive('dateformatter', function () {
        return {
            require: 'ngModel',
            link: function(elem, $scope, attrs, ngModel) {
                ngModel.$formatters.push(function(val) {
                    if(!angular.isUndefined(val)) {
                        return moment(val).format('LLL');
                    } else {
                        return;
                    }
                });
            }
        }
    });


}());