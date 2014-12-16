/**
 * Contains all angularjs controllers
 */
(function () {
    'use strict';

    var app = angular.module('tpManager.controllers', []);

    /**
     * Controller for the editing page
     */
    app.controller('SettingsController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

        if($rootScope.meta === undefined) {
            $location.path('/new');
        }

        $rootScope.ni = new NetworkInterface($rootScope.meta);
        $rootScope.resize($rootScope);

        $.getJSON('config.json', function(data) {
            for(var i = 0; i < data.networkObjectList.length; i++) {
                data.networkObjectList[i].index = i;
            }
            $scope.networkObjectList = data.networkObjectList;
            $scope.softwareList = data.softwareList;
            $scope.$apply();
        });

        $scope.backup = undefined;

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
        $scope.toggleSidebar(true, '');
    }]);


    /**
     * Controller for the meta dialog (TP name, description, etc)
     */
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

            $scope.backup = $rootScope.meta;
            $scope.meta = angular.copy($scope.backup);
        };

        $scope.resetForm = function() {
            $scope.meta = angular.copy($scope.backup);
        };

        $rootScope.loadMetaDialogController = function() {
            $scope.reset();
        };

    }]);

    /**
     * Controller for the removal dialog (remove elements)
     */
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

    /**
     * Controller for the new TP page
     */
    app.controller('NewTpController', ['$scope', '$rootScope', '$location', '$sessionStorage', function($scope, $rootScope, $location, $sessionStorage) {

        $rootScope.meta = $sessionStorage;

        $scope.submit = function() {
            $rootScope.meta = $scope.meta;
            $location.path('/edit');
        };

        $scope.resetForm = function() {
            $scope.meta = undefined;
            $rootScope.meta = undefined;
            delete $sessionStorage.experiment;
            delete $sessionStorage.author;
        };

    }]);

}());