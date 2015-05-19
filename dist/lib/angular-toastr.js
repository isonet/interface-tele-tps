angular.module("toastr",[]).directive("toast",["$compile","$timeout","toastr",function($compile,$timeout,toastr){return{replace:!0,templateUrl:"templates/toastr/toastr.html",link:function(scope,element,attrs){function createTimeout(time){return $timeout(function(){toastr.remove(scope.toastId)},time)}var timeout;if(scope.toastClass=scope.options.toastClass,scope.titleClass=scope.options.titleClass,scope.messageClass=scope.options.messageClass,scope.options.closeHtml){var button=angular.element(scope.options.closeHtml);button.addClass("toast-close-button"),button.attr("ng-click","close()"),$compile(button)(scope),element.prepend(button)}scope.init=function(){scope.options.timeOut&&(timeout=createTimeout(scope.options.timeOut))},element.on("mouseenter",function(){timeout&&$timeout.cancel(timeout)}),scope.tapToast=function(){scope.options.tapToDismiss&&scope.close()},scope.close=function(){toastr.remove(scope.toastId)},element.on("mouseleave",function(){(0!==scope.options.timeOut||0!==scope.options.extendedTimeOut)&&(timeout=createTimeout(scope.options.extendedTimeOut))})}}}]).constant("toastrConfig",{allowHtml:!1,closeButton:!1,closeHtml:"<button>&times;</button>",containerId:"toast-container",extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},messageClass:"toast-message",positionClass:"toast-top-right",tapToDismiss:!0,timeOut:5e3,titleClass:"toast-title",toastClass:"toast"}).factory("toastr",["$animate","$compile","$document","$rootScope","$sce","toastrConfig","$q",function($animate,$compile,$document,$rootScope,$sce,toastrConfig,$q){function clear(toast){if(toast)remove(toast.toastId);else for(var i=0;i<toasts.length;i++)remove(toasts[i].toastId)}function error(message,title,optionsOverride){return _notify({iconClass:_getOptions().iconClasses.error,message:message,optionsOverride:optionsOverride,title:title})}function info(message,title,optionsOverride){return _notify({iconClass:_getOptions().iconClasses.info,message:message,optionsOverride:optionsOverride,title:title})}function success(message,title,optionsOverride){return _notify({iconClass:_getOptions().iconClasses.success,message:message,optionsOverride:optionsOverride,title:title})}function warning(message,title,optionsOverride){return _notify({iconClass:_getOptions().iconClasses.warning,message:message,optionsOverride:optionsOverride,title:title})}function _getOptions(){return angular.extend({},toastrConfig)}function _setContainer(options){if(container)return containerDefer.promise;container=angular.element("<div></div>"),container.attr("id",options.containerId),container.addClass(options.positionClass),container.css({"pointer-events":"auto"});var body=$document.find("body").eq(0);return $animate.enter(container,body,null,function(){containerDefer.resolve()}),containerDefer.promise}function _notify(map){function createScope(toast,map,options){options.allowHtml?(toast.scope.allowHtml=!0,toast.scope.title=$sce.trustAsHtml(map.title),toast.scope.message=$sce.trustAsHtml(map.message)):(toast.scope.title=map.title,toast.scope.message=map.message),toast.scope.toastType=toast.iconClass,toast.scope.toastId=toast.toastId,toast.scope.options={extendedTimeOut:options.extendedTimeOut,messageClass:options.messageClass,tapToDismiss:options.tapToDismiss,timeOut:options.timeOut,titleClass:options.titleClass,toastClass:options.toastClass},options.closeButton&&(toast.scope.options.closeHtml=options.closeHtml)}function createToast(scope){var angularDomEl=angular.element("<div toast></div>");return $compile(angularDomEl)(scope)}var options=_getOptions(),newToast={toastId:index++,scope:$rootScope.$new()};return newToast.iconClass=map.iconClass,map.optionsOverride&&(options=angular.extend(options,map.optionsOverride),newToast.iconClass=map.optionsOverride.iconClass||newToast.iconClass),createScope(newToast,map,options),newToast.el=createToast(newToast.scope),toasts.push(newToast),_setContainer(options).then(function(){$animate.enter(newToast.el,container,null,function(){newToast.scope.init()})}),newToast}function remove(toastIndex){function findToast(toastId){for(var i=0;i<toasts.length;i++)if(toasts[i].toastId===toastId)return toasts[i]}var toast=findToast(toastIndex);toast&&$animate.leave(toast.el,function(){toast.scope.$destroy(),container&&0===container.children().length&&(toasts=[],container.remove(),container=null,containerDefer=$q.defer())})}var container,index=0,toasts=[],containerDefer=$q.defer(),toastr={clear:clear,error:error,info:info,remove:remove,success:success,warning:warning};return toastr}]),angular.module("toastr").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("templates/toastr/toastr.html",'<div class="{{toastClass}} {{toastType}}" ng-click="tapToast()">\n  <div ng-switch on="allowHtml">\n    <div ng-switch-default ng-if="title" class="{{titleClass}}">{{title}}</div>\n    <div ng-switch-default class="{{messageClass}}">{{message}}</div>\n    <div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div>\n    <div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div>\n  </div>\n</div>')}]);