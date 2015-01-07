(function () {

    'use strict';
    var app = angular.module('tpManager.directives', []);

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

    app.directive('dateformatter', function () {
        return {
            require: 'ngModel',
            link: function(elem, $scope, attrs, ngModel){
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