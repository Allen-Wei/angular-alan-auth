/// <reference path="../test/vendor/angular.js" />

/*
 * author: Alan Wei
 * created: 2016-03-26 16:41:29
 * version: 0.0.1
 * issues: https://github.com/Allen-Wei/angular-auth/issues
 * 
 */

(function () {
    angular.module("alanAuth", [])
        .factory("AlanAuth", function ($location) {
            // utils function
            var isValidString = function (value) {
                return angular.isString(value) && !/^\s*$/g.test(value);
            };

            var isInRoleFn = function (roles, controller) {
                console.info("AlanAuth.isInRole: default isInRole function.");
                return true;
            };


            // 角色和控制器名称/URL的映射
            var maps = { "controller name or path": { roles: [], redirect: function () { } } };

            var service = {
                version: "0.0.1",
                globalConfigName: "__global1021",

                /*
                 * 判断当前用户是否拥有其中的某个角色,调用参数: isInRole(roles, controllers)
                 */
                setIsInRole: function (isInRole) {
                    if (!angular.isFunction(isInRole)) {
                        throw "AlanAuth.setIsInRole: isInRole must be a fucntion.";
                    }
                    isInRoleFn = isInRole;
                    return this;
                },

                /**
                 * 添加控制器和角色之间的映射
                 * @param {string[]} controllersOrPaths 控制器名称或者页面URL, 可以是字符串或者字符串数组
                 * @param {string[]/function} allowRoles 对应的角色名, 字符串数组或者是个函数(如果是个函数则需要函数自己实现跳转等逻辑)
                 * @param {string/function} redirect 可以是一个字符串或者一个回调函数
                 * @returns AlanAuth
                 */
                map: function (controllersOrPaths, allowRoles, redirect) {

                    //判断是否是空字符串
                    if (isValidString(controllersOrPaths)) {
                        controllersOrPaths = [controllersOrPaths];
                    }

                    //controllersOrPaths: 可以是一个表示控制器名称的字符串或者表示URL的字符串, 也可以是同时包含这两种类型的数组
                    if (!angular.isArray(controllersOrPaths)) {
                        throw "AlanAuth.map: parameter controllersOrPaths must be string or an array."
                    }

                    //roles: 可以是一个角色名的字符串或者是一个isRole的函数, 也可以是同时包含这两种的数组
                    if (isValidString(allowRoles) || angular.isFunction(allowRoles)) {
                        allowRoles = [allowRoles];
                    }
                    if (!angular.isArray(allowRoles)) {
                        throw "AlanAuth.map: parameter roles must be string or an array."
                    }

                    var redirectFn = undefined;
                    if (isValidString(redirect) || angular.isFunction(redirect)) {
                        redirectFn = redirect;
                        if (isValidString(redirect)) {
                            if (redirect[0] === "#") {
                                redirectFn = function () { location.href = redirect; };
                            } else if (redirect[0] === "~") {
                                redirectFn = function () { location.href = redirect.substr(1, redirect.length - 1); }
                            } else {
                                redirectFn = function () { $location.path(redirect); }
                            }
                        }
                    }



                    angular.forEach(controllersOrPaths, function (ctrlOrPath) {
                        maps[ctrlOrPath] = maps[ctrlOrPath] || { roles: [], redirect: undefined };
                        angular.forEach(allowRoles, function (allowRole) {
                            maps[ctrlOrPath].roles.push(allowRole);
                        });
                        if (redirectFn) {
                            maps[ctrlOrPath].redirect = redirectFn;
                        }
                    });
                    return this;
                },

                /**
                 * 执行权限校验
                 * @param {object} controller {name:控制器名字, path:当前页面URL, templateUrl: 当前页面对应的模板的URL}
                 * @returns {} 
                 */
                auth: function (controller) {
                    var empty = {
                        roles: [],
                        redirect: function () {
                            console.info("AlanAuth.auth: empty redirect function.");
                        }
                    };
                    var globalMaps = maps[this.globalConfigName] || empty;
                    var ctrlMaps = maps[controller.name] || empty;
                    var pathMaps = maps[controller.path] || empty;

                    var allRoles = globalMaps.roles.concat(ctrlMaps.roles).concat(pathMaps.roles);
                    var redirect = pathMaps.redirect || ctrlMaps.redirect || globalMaps.redirect;

                    if (!allRoles.length) {
                        console.info("AlanAuth.auth: not found maps.");
                        return this;
                    }
                    if (isInRoleFn(allRoles, controller)) {
                        return this;
                    } else {
                        if (angular.isFunction(redirect)) {
                            redirect(controller);
                            return this;
                        }
                        console.info("unauth and redirect is undefined.");
                        return this;
                    }

                }
            };
            return service;
        })
        .run(["AlanAuth", "$rootScope", "$location", "$route", function (AlanAuth, $rootScope, $location, $route) {

            /*
             * 
             * route change events:
             * 
             * $routeChangeSuccess
             * $routeChangeError 
             * $routeUpdate - if reloadOnSearch property has been set to false
             * $locationChangeStart 
             * $locationChangeSuccess
             */


            //监听路由改变事件
            $rootScope.$on("$routeChangeStart", function () {

                var currentPath = $location.path();

                var controller = {
                    path: currentPath,
                    name: undefined,
                    templateUrl: undefined
                };

                for (var key in $route.routes) {
                    var route = $route.routes[key];
                    if (!route.regexp) {
                        continue;
                    }
                    var isCurrent = route.regexp.test(currentPath);
                    if (isCurrent) {
                        var controllerMatch = /^((\w|\d)+)/g.exec(route.controller);
                        if (!controllerMatch) {
                            throw "AuthSvc: get controller name error";
                        }
                        var controllerName = controllerMatch[0];
                        controller.name = controllerName;
                        controller.templateUrl = route.templateUrl;
                        break;
                    }
                }

                AlanAuth.auth(controller);
            });


        }]);
})();
