(function () {

    /**
     * Initializing Angular
     */
    var tpApp = angular.module('tpManager', [
        'ngAnimate',
        'toastr',
        'ngRoute',
        'ngResource',
        'teleTPsLocalization',
        'tpManager.controllers',
        'tpManager.directives',
        'tpManager.filters',
        'ngStorage',
        'ui.bootstrap.datetimepicker'
    ]);

    /**
     * Function which is run on the first start of angular
     */
    tpApp.run(['$rootScope', function($rootScope){

        // Define the default locale
        moment().locale('fr');

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
    tpApp.config(['$routeProvider', 'toastrConfig', function($routeProvider, toastrConfig) {
        angular.extend(toastrConfig, {
            allowHtml: true,
            closeButton: false,
            extendedTimeOut: 1000,
            positionClass: 'toast-bottom-left',
            tapToDismiss: true,
            timeOut: 5000
        });

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