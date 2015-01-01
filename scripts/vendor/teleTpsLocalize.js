/*
 *                  Mes Télé-TPs : teleTPsLocalization
 *                  
 * Module Angular de régionalisation pour la localisation d'un site
 * Fonctionnalités offertes :
 *      - externalisation du texte dans des fichiers JSON par langue
 *      - accès au texte par filtre angular
 *      - affichage dynamique de formes plurielles
 *      - changement dynamique de langue avec diffusion évenementiel à l'ensemble de l'application Angular
 *      - autoconfiguration du module pour déterminer la langue de l'utilisateur
 *      - autoconfiguration du module pour déterminer le chemin d'accès aux fichiers de langues
 *      
 * Ce module Fourni :
 *      - Un filtre 'i18n' utilisable avec 1 ou 2 paramètre(s) : {{ CLE_TEXTE [, FORME_PLURIELLE] | i18n }} 
 *      - Un provider 'localization' pour configurer le module (changement de langue dynamique
 */

/*
 * Auteur : Rémi Venant
 * Licence : CeCILL _ Mes Tele-TPs _ 2014
 */

/*
 * Bootstrap du module
 * Pour déterminer le chemin d'accès aux fichiers de langues,
 * l'application utilisatrice du module doit proposer un filtre nommé "resource-location" à deux paramètres (type de ressource et nom de ressource).
 * L'appel de ce filtre avec les paramètres ('i18n', 'texts') doit retourner l'emplacement des fichiers JSON de texte
 * sous le format chemin/d/access/prefix_fichier_:locale.json
 * Le pattern ':locale' sera remplacé par la langue choisie (il est conseillé d'utiliser le format i18n (ex. : francais : fr, allemand : de))
 * Si la langue choisie n'est pas disponible, 'default' sera utilisé
 */

/*
 * Utilisation du filtre i18n
 * Utilisation simple
    * Dans une page html 
    *   exemple : {{'_CLE_TEXTE_' | i18n}}
    * Dans un controleur Angular (nécéssite la dépendance $filter)
    *   exemple : var leTexte = $filter('i18n')('_CLE_TEXTE_');
* Utilisation avec une forme plurielle (si le texte le permet)
    * Dans une page html 
    *   exemple : {{'_CLE_TEXTE_' | i18n : true}}
    * Dans un controleur Angular (nécéssite la dépendance $filter)
    *   exemple : var leTexte = $filter('i18n')('_CLE_TEXTE_', true);
 */

/*
 * Configuration du module par le provider
 * méthodes "publiques" du provider 'localization' :
 *  - changeLanguage(l, cback) :  change la langue
 *          l : la nouvelle langue (ex. : 'fr')
 *          cback : optionnel : fonction de callback appelée avec les nouvelle donnée texte ou l'erreur en argument
 *      Lorsque la langue a été changée avec succès, un evenement Angular 'localizeResourcesUpdated' est diffusé au niveau du rootScope
 *  
 *  - selectedLanguage() : retourne le language selectionné
 */

'use strict';
var teleTPsLocalization = angular.module('teleTPsLocalization', ['ngResource']);
teleTPsLocalization.provider('localization', function localizationProvider(){
   var initialLanguage = undefined;
   
   this.setInitialLanguage = function(l){
       initialLanguage = l;
   };
   
   this.$get = ['$http','$resource', '$rootScope', '$filter', '$window', 
       function localizationFactory($http, $resource, $rootScope, $filter, $window){
           initialLanguage = initialLanguage || $window.navigator.userLanguage || $window.navigator.language;
           var idxInitLanguage = initialLanguage.indexOf("-");
           if(idxInitLanguage > -1) initialLanguage = initialLanguage.substring(0, idxInitLanguage);
           var locaMgr = new LocalizationManager($http,$resource, $rootScope, $filter, initialLanguage);
           locaMgr.initLocalizedResources();
           return locaMgr;
       }
   ];
});
teleTPsLocalization.filter('i18n', ['localization', function(localization) {
        return function(key, pluralForm) {
            return localization.getLocalizedString(key, pluralForm);
        };
    }]);

function LocalizationManager($http, $resource, $rootScope, $filter, language) {
    var defaultLanguage = 'default';
    var dictionary = [];
    var resourceFileLoaded = false;
    var languageResource = $resource($filter('resource-location')('i18n', 'texts'), {locale: '@locale'}, {'get': {isArray: true, cache: false}});

    this.changeLanguage = function(l, cback){
        language = l;
        this.initLocalizedResources(cback);
    };
    
    this.selectedLanguage = function(){
        return language;
    };
    
    var successCallback = function(data, cback){
        dictionary = data;
        resourceFileLoaded = true;
        $rootScope.$broadcast('localizeResourcesUpdated');
        if(angular.isDefined(cback)) cback(data);
    };

    this.initLocalizedResources = function(cback) {
        resourceFileLoaded = false;
        languageResource.get({locale: language}, function(data) {
            successCallback(data, cback);
        }, function() {
            languageResource.get({locale: defaultLanguage}, function(data){
                successCallback(data, cback);
            }, function(error2){
                if(angular.isDefined(cback)) cback(error2);
            });
        });
    };

    this.getLocalizedObject = function(value) {
        if (resourceFileLoaded && dictionary !== [] && dictionary.length > 0) {
            var entry = $filter('filter')(dictionary, {key: value})[0];
            if (angular.isDefined(entry))
                return entry;
        }
        return {};
    };

    this.getLocalizedString = function(value, pluralForm) {
        var obj = this.getLocalizedObject(value);
        if(!angular.isDefined(obj.value) || obj.value === '')
            return ("Unknown string id : "+ value);
        if(angular.isDefined(pluralForm) && pluralForm === true && angular.isDefined(obj.pluralForm)){
            return obj.pluralForm;
        }
        return obj.value;
    };
}
