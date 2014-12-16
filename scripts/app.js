(function () {

    /**
     * Initializing Angular
     */
    var tpApp = angular.module('tpManager', [
        'ngRoute',
        'tpManager.controllers',
        'tpManager.directives',
        'ngStorage'
        //'tpManager.filters'
        //'tpManager.services'
    ]);

    /**
     * Function which is run on the first start of angular
     */
    tpApp.run(['$rootScope', function($rootScope){

        /**
         * Declaration of a global resizing function
         * @param $rootScope
         */
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
        };
    }]);

    /**
     * Decides which template to load depending on the address
     */
    tpApp.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/edit', {
                    templateUrl: 'partials/edit.html'
                }).
                when('/new', {
                    templateUrl: 'partials/new.html'
                }).
                otherwise({
                    redirectTo: '/new'
                });
        }]);

}());