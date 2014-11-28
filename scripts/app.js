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

    tpApp.run(['$rootScope', function($rootScope){
        $rootScope.resize = function($rootScope) {
            $rootScope.size = $rootScope.size || {};
            $rootScope.size.appHeight = $(window).height() - 55;
            $rootScope.size.canvasHeight = $rootScope.size.appHeight  - (90 + 75);   // 75 = footer height
            $rootScope.size.sidebarHeight = $rootScope.size.canvasHeight + 6;
            $rootScope.size.sidebarTopMargin = - $rootScope.size.canvasHeight;
            $rootScope.size.paneHeight = $rootScope.size.sidebarHeight - 85;
            $rootScope.size.canvasWidth = $('#mainCanvas').width();
            if($rootScope.ni !== undefined) {
                $rootScope.ni.resize($rootScope.size.canvasHeight, $rootScope.size.canvasWidth);
            }
        }
    }]);

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