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


}());