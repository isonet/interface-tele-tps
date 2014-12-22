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

        /** @type {NetworkInterface} **/
        $rootScope.ni = new NetworkInterface($rootScope.meta);

        $rootScope.resize($rootScope);

        $.getJSON('config.json', function(data) {
            for(var i = 0; i < data.networkObjectList.length; i++) {
                data.networkObjectList[i].index = i;
            }
            /** @type {NetworkObject[]} **/
            $scope.networkObjectList = data.networkObjectList;
            /** @type {string[]} **/
            $scope.softwareList = data.softwareList;
            $scope.$apply();
        });

        $scope.backup = undefined;

        /** @type {string} **/
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
            /** @type {Interface} **/
            $scope.iface = $scope.node.network_interfaces[0];
        };

        $scope.resetForm = function() {
            $scope.node = angular.copy($scope.backup);
            oldId = oldId || $scope.node.id;
            if(oldId !== $scope.node.id) {
                $rootScope.ni.update();
            }
            /** @type {Interface} **/
            $scope.iface = $scope.node.network_interfaces[0];
            $scope.settings.$setPristine();
        };

        /**
         * Enum for the active sidebar tab
         * @readonly
         * @enum {string}
         */
        $scope.TAB = {
            NEW : 'new',
            SETTINGS: 'settings'
        };

        /**
         * Current Sidebar status
         * @type {boolean}
         */
        $scope.sidebarIsDisplayed = false;

        /**
         * Hides the sidebar in the edit view
         */
        $scope.hideSidebar = function() {
            $scope.toggleSidebar(false, $scope.TAB.NEW);
        };

        /**
         * Show the sidebar in the edit view
         * @param {TAB} tab
         */
        $scope.showSidebar = function(tab) {
            $scope.toggleSidebar(true, tab);
        };

        /**
         * Toggles the Sidebar in the edit view
         * @param {boolean} state -
         * @param {TAB} tab -
         */
        $scope.toggleSidebar = function(state, tab) {
            var position = !state ? -330 : -16;
            $('#tpCreatorSideBar').stop().animate({ marginRight: position + 'px' }, 300);
            if(state != $scope.sidebarIsDisplayed) {
                // Change the image of the button
                $('#tpCreatorCanvas').find('.btn-fab').toggleClass('icon-material-add icon-material-close');
                $scope.sidebarIsDisplayed = !$scope.sidebarIsDisplayed;
            }
            if(tab == $scope.TAB.SETTINGS) {
                $('#settings-panel a').tab('show');
            } else if (tab == $scope.TAB.NEW) {
                $('#components-panel a').tab('show');
            }
        };

        // Display the sidebar when the edit view has loaded
        $scope.showSidebar($scope.TAB.NEW);
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

        /** @type {string} **/
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

        try {
            sessionStorage.setItem('throw', 'Exception');

            /** @type {MetaData} **/
            $rootScope.meta = $sessionStorage;

            sessionStorage.removeItem('throw');
        } catch (err) {
            $rootScope.meta = undefined;
        }



        $scope.submit = function() {
            /** @type {MetaData} **/
            $rootScope.meta = $scope.meta;
            $location.path('/edit');
        };

        $scope.resetForm = function() {
            /** @type {MetaData} **/
            $scope.meta = undefined;
            delete $rootScope.meta.experiment;
            delete $rootScope.meta.author;
        };

    }]);

}());