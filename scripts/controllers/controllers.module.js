(function () {
    'use strict';

    // Controllers pour Angular

    var app = angular.module('tpManager.controllers', []);

    /**
     * Controller pour les settings
     */
    app.controller('SettingsController', ['$scope', '$window', function($scope, $window) {

        var _data;

        $scope.updateSettings = function(d) {
            _data = d;
            if(d !== undefined) {
                $scope.cfgName = d.name;
                $scope.cfgType = d.type;
                $scope.cfgIP = d.ip;
                $scope.cfgNetmask = d.netmask;
                $scope.cfgGateway = d.gateway;
                if(d.type.toLowerCase() === 'router') {
                    $('#inputForwarding').prop('disabled', false);
                    $scope.cfgForwarding = d.forwarding;
                } else {
                    $('#inputForwarding').prop('disabled', true);
                    $scope.cfgForwarding = false;
                }
            }
        };

        $scope.submit = function() {
            $window.ni.editSettings($scope.cfgName,
                                    $scope.cfgType,
                                    $scope.cfgIP,
                                    $scope.cfgNetmask,
                                    $scope.cfgGateway,
                                    $scope.cfgForwarding);
            var snack = {
                content: 'Modifications enregistrées',
                style: 'snackbar',
                timeout: 3000
            };
            $.snackbar(snack);
        };

        $scope.reset = function() {
            $scope.updateSettings(_data);
        };

        $scope.change = function() {
            if($scope.cfgType.toLocaleLowerCase() === 'router') {
                $('#inputForwarding').prop('disabled', false);
                $scope.cfgForwarding = false;
            } else {
                $('#inputForwarding').prop('disabled', true);
                $scope.cfgForwarding = false;
            }
        };

        $scope.init = function () {
            //
        };

        // TODO Create a function showSidebar, hideSidebar and toggleSidebar
        /**
         * Current Sidebar status
         * @type {boolean}
         */
        $scope.sidebarIsDisplayed = false;

        /**
         * Toggles the Sidebar in the Edit View
         * @param b {boolean} true -> show panel, false -> hide panel
         * @param panel {string} ['settings' -> show settings pane, '' -> show components pane]
         */
        $scope.toggleSidebar = function(b, panel) {
            var position = !b ? -330 : -16;
            $('#tpCreatorSideBar').stop().animate({
                marginRight: position+"px"
            },300);
            if(b != $scope.sidebarIsDisplayed) {
                $('#tpCreatorCanvas').find('.btn-fab').toggleClass('icon-material-add icon-material-close');
                $scope.sidebarIsDisplayed = !$scope.sidebarIsDisplayed;
            }
            if(panel == 'settings') {
                $('#settings-panel a').tab('show');
            } else {
                $('#components-panel a').tab('show');
            }
        };
    }]);

    app.controller('TpEditCtrl', ['$scope', '$window', function($scope, $window) {
        $window.resizeElements();
        $window.ni = new NetworkInterface();
        $window.onresize = function() {
            resizeElements();
            ni.resize();
        };
        ni.resize();
    }]);

    app.controller('TpNewCtrl', ['$scope', '$window',
        function($scope, $window) {
            $window.resizeElements();
        }]);

    app.controller('TpListCtrl', ['$scope', '$http', '$window',
        function($scope, $http, $window) {
            $window.resizeElements();

            $scope.contents = [];

            $scope.get = function (url) {
                var http_get = $http.get(url);
                http_get.success(function (data) {
                    $scope.contents = data;
                });
                http_get.error(function () {
                    var link = '<a href="javascript:void(0)" style="text-decoration: none; color: #FFC400; padding-left: 10px;">Réessayer</a>';
                    var op = {
                        content: 'Erreur de chargement de la liste des TPs ! ' + link,
                        style: 'snackbar',
                        timeout: 10000
                    };
                    $.snackbar(op);
                })
            };

            $scope.get('data/tpList.json');
        }]);

}());