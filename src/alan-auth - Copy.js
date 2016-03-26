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


            // 角色和控制器名称/URL的映射
            var maps = { "controller name or path": [ /*handles*/] };

            // 用户配置的角色
            var roles = {
                "role name": {
                    name: "role name",
                    isRole: function () {
                        /*
                         * confirm controller is in role
                         * return boolean value
                         */

                        return true;
                    },
                    fail: function () {
                        /*
                         * when auth failed
                         */
                    },
                    success: function () {
                        /*
                         * when auth success
                         */
                    }
                }
            };


            var service = {
                version: "0.0.1",
                globalConfigName: "__global1021",

                /**
                 * 添加角色
                 * @param {string} roleName 角色名
                 * @param {string[]/function} isRole 根据控制器信息判断是否拥有当前角色授权, 这个参数可以是一个函数或者一个角色名数组(角色数组之间and关系)
                 * @returns AlanAuth
                 */
                role: function (roleName, isRole) {
                    if (!isValidString(roleName)) {
                        throw "AlanAuth.role: parameter roleName(角色名称) must be a string.";
                    }
                    var isRoleFunction;
                    if (angular.isArray(isRole)) {
                        isRoleFunction = (function (rolesValue) {
                            return function () {
                                for (var index = 0; index < rolesValue.length; index++) {
                                    var roleValue = rolesValue[index];
                                    if (!angular.isString(roleValue)) {
                                        console.error("AlanAuth.role: roleValue must be a string.");
                                        continue;
                                    }
                                    var role = roles[role];
                                    if (role === undefined) {
                                        console.error("AlanAuth.role: role is undefined.");
                                        continue;
                                    }
                                    if (!angular.isFunction(role.isRole)) {
                                        console.error("AlanAuth.role: isRole is not a function.");
                                        continue;
                                    }
                                    var isRole = role.isRole.apply(service, arguments);
                                    if (!isRole) {
                                        return false;
                                    }
                                }
                                return true;
                            };
                        })(isRole);
                    } else {
                        isRoleFunction = isRole;
                    }
                    if (!angular.isFunction(isRoleFunction)) {
                        throw "AlanAuth.role: parameter isRole(角色判断) must be an array(of roles) or a function.";
                    }
                  

                    roles[roleName] = {
                        name: roleName,
                        isRole: isRoleFunction
                    };

                    return this;
                },

                /**
                 * 添加控制器和角色之间的映射
                 * @param {string[]} controllersOrPaths 控制器名称或者页面URL, 可以是字符串或者字符串数组
                 * @param {string[]/function} allowRoles 对应的角色名, 字符串数组或者是个函数(如果是个函数则需要函数自己实现跳转等逻辑)
                 * @returns AlanAuth
                 */
                map: function (controllersOrPaths, allowRoles) {

                    //controllersOrPaths: 可以是一个表示控制器名称的字符串或者表示URL的字符串, 也可以是同时包含这两种类型的数组
                    if (isValidString(controllersOrPaths)) {
                        controllersOrPaths = [controllersOrPaths];
                    }
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


                    angular.forEach(controllersOrPaths, function (ctrlOrPath) {
                        maps[ctrlOrPath] = maps[ctrlOrPath] || [];
                        angular.forEach(allowRoles, function (allowRole) {
                            maps[ctrlOrPath].push(allowRole);
                        });
                    });
                    return this;
                },

                /**
                 * 执行权限校验
                 * @param {object} controller {name:控制器名字, path:当前页面URL, templateUrl: 当前页面对应的模板的URL}
                 * @returns {} 
                 */
                auth: function (controller) {
                    var globalMaps = maps[this.globalConfigName] || [];
                    var ctrlMaps = maps[controller.name] || [];
                    var pathMaps = maps[controller.path] || [];
                    var allMaps = (globalMaps.concat(ctrlMaps)).concat(pathMaps);

                    if (!allMaps.length) {
                        console.info("AlanAuth.auth: not found maps.");
                        return this;
                    }

                    var authResults = {
                        true: [],
                        false: []
                    };

                    for (var index = 0; index < allMaps.length; index++) {
                        var oneMap = allMaps[index];
                        if (isValidString(oneMap)) {
                            var cacheRoleConfig = roles[oneMap];
                            var isInRole = cacheRoleConfig.isRole(controller);

                            authResults[isInRole].push(cacheRoleConfig);
                            continue;
                        }
                        if (angular.isFunction(oneMap)) {
                            var isInRole = role(controller);
                            continue;
                        }
                        console.error("AlanAuth.auth: not a function: ", callback);
                    }

                    if (authResults[true].length) {
                        angular.forEach(authResults[true], function (cacheRoleConfig) {
                            cacheRoleConfig.success(controller);
                        });
                        return this;
                    }

                    if (authResults[false].length) {
                        authResults[false][0].fail(controller);
                    }

                    return this;
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
