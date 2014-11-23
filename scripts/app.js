(function () {

    /**
     * Module Angular principal
     */

    var tpApp = angular.module('tpManager', [
        'ngRoute',
        'tpManager.controllers',
        'tpManager.directives',
        'tpManager.filters'
        //'tpManager.services'
    ]);

    tpApp.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/edit', {
                    templateUrl: 'partials/edit.html',
                    controller: 'TpEditCtrl'
                }).
                when('/new', {
                    templateUrl: 'partials/new.html',
                    controller: 'TpNewCtrl'
                }).
                when('/list', {
                    templateUrl: 'partials/list.html',
                    controller: 'TpListCtrl'
                }).
                otherwise({
                    redirectTo: '/list'
                });
        }]);

}());