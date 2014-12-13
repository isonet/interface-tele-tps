(function () {
    'use strict';

    // Controllers pour Angular

    var app = angular.module('tpManager.controllers', []);

    // TODO Refactor into other file
    /**
     * Controller pour les settings
     */
    app.controller('SettingsController', ['$scope', '$rootScope', function($scope, $rootScope) {

        $scope.backup = undefined;

        $scope.types = [ "Switch", "Router", "Terminal" ];

        var oldId;

        $scope.submit = function() {

            oldId = $scope.node;
            for(var k in $scope.node) $scope.backup[k] = $scope.node[k];

            $scope.resetForm();
            var snack = {
                content: 'Modifications enregistrées',
                style: 'snackbar',
                timeout: 3000
            };
            $.snackbar(snack);
        };

        $scope.reset = function() {
            $scope.backup = $rootScope.ni.getCurrentNode();
            $scope.node = angular.copy($scope.backup);
            $rootScope.updateRemovalDialogController($scope.node.getId());
            $scope.iface = $scope.node.network_interfaces[0];
        };

        $scope.resetForm = function() {
            $scope.node = angular.copy($scope.backup);
            oldId = oldId || $scope.node.id;
            if(oldId !== $scope.node.id) {
                $rootScope.ni.update();
            }
            $scope.iface = $scope.node.network_interfaces[0];
            $scope.settings.$setPristine();
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



    app.controller('MetaDialogController', ['$scope', '$rootScope', function($scope, $rootScope) {

        $scope.backup = undefined;

        $scope.submit = function() {

            for(var k in $scope.meta) $scope.backup[k] = $scope.meta[k];

            $scope.resetForm();
            var snack = {
                content: 'Modifications enregistrées',
                style: 'snackbar',
                timeout: 3000
            };
            $.snackbar(snack);
        };


        $scope.reset = function() {

            $scope.backup = $rootScope.ni.tp.getMeta();
            $scope.meta = angular.copy($scope.backup);
        };

        $scope.resetForm = function() {
            $scope.meta = angular.copy($scope.backup);
        };

        $rootScope.loadMetaDialogController = function() {
            $scope.reset();
        };

    }]);

    app.controller('RemovalDialogController', ['$scope', '$rootScope', function($scope, $rootScope) {

        $scope.id = '';

        $rootScope.updateRemovalDialogController = function(id) {
            $scope.id = id;
        };

        $scope.deleteNode = function() {
            $rootScope.ni.tp.deleteNodeById($scope.id);
            $rootScope.ni.update();
        }
    }]);

    app.controller('TpEditCtrl', ['$scope', '$window', '$rootScope', function($scope, $window, $rootScope) {
        $rootScope.ni = new NetworkInterface();
        $rootScope.resize($rootScope);
    }]);

    app.controller('TpNewCtrl', ['$scope', '$window',
        function($scope, $window) {

    }]);

}());