!function(){var tpApp=angular.module("tpManager",["ngAnimate","toastr","ngRoute","ngResource","teleTPsLocalization","tpManager.controllers","tpManager.directives","tpManager.filters","ngStorage","ui.bootstrap.datetimepicker"]);tpApp.run(["$rootScope",function($rootScope){moment().locale("fr"),$rootScope.resize=function($rootScope){$rootScope.size=$rootScope.size||{},$rootScope.size.appHeight=$(window).height()-55,$rootScope.size.canvasHeight=$rootScope.size.appHeight-165,$rootScope.size.sidebarHeight=$rootScope.size.canvasHeight+6,$rootScope.size.sidebarTopMargin=-$rootScope.size.canvasHeight,$rootScope.size.paneHeight=$rootScope.size.sidebarHeight-85,$rootScope.size.canvasWidth=$("#mainCanvas").width(),void 0!==$rootScope.ni&&$rootScope.ni.resize($rootScope.size.canvasHeight,$rootScope.size.canvasWidth)}}]),tpApp.config(["$routeProvider","toastrConfig",function($routeProvider,toastrConfig){angular.extend(toastrConfig,{allowHtml:!0,closeButton:!1,extendedTimeOut:1e3,positionClass:"toast-bottom-left",tapToDismiss:!0,timeOut:5e3}),$routeProvider.when("/edit",{templateUrl:"partials/edit.html"}).when("/new",{templateUrl:"partials/new.html"}).otherwise({redirectTo:"/new"})}])}();