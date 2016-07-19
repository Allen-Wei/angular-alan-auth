# ng-route: alan-auth.ngRoute.js

AngularJS ngRoute authorize module.
为 `ngRoute` 设计的模块.

访问[Demo](http://github.alanwei.net/angular-alan-auth/ngRoute/app.html)查看演示. Demo源码请访问[gh-pages](https://github.com/Allen-Wei/angular-alan-auth/tree/gh-pages).

## Install
	
在引用`angular.js`之后引用`alan-auth.js`

	<script src="https://cdn.rawgit.com/Allen-Wei/angular-alan-auth/master/src/alan-auth.ngRoute.js"></script>

## Use

首先需要注入`alanAuth`模块, 就像注入`ngRoute`等模块一样.

然后配置基于URL的权限映射, 这一步最好在`angular.run(...)`里配置.

`AlanAuth.setIsInRole()`方法用于设置一个方法, 这个方法用来校验当前用户是否拥有某个角色, 方法的第一个参数是当前执行页面所允许访问的角色数组.

`AlanAuth.map(urls or controllers, roles, redirect)`, 这个方法用于配置哪些角色可以访问指定的页面/控制器.

1. 第一个参数是URL地址或者控制器名称, 可以是一个数组, 也可以是一个字符串.
2. 第二个参数是允许访问的角色, 可以是单个角色字符串, 也可以是一个标识多个角色的字符串数组.
3. 第三个参数可以是一个函数, 也可以是一个字符串. 当权限校验失败(setIsInRole设置的函数返回false)时, 如果这个参数是函数会执行这个函数, 如果是字符串会跳转到字符串指定的页面, 如果字符串以`#`开头, 使用 `location.href = redirect` 的方式跳转, 如果字符串以`~`开头, 则去掉`~`, 使用 `location.href = redirect`跳转, 其他情况使用 `$location.path(redirect)` 执行跳转.

	angular.module("your app name", [/*your else modules*/, "alanAuth"]).run(function(AlanAuth){
		AlanAuth.setIsInRole(function(roles, controller){
			//执行角色检查 并返回true/false.
		})
		.map(url, role name, redirect url when unauth)
		.map(....);
	});

# ui-router: alan-auth.ui-route.js

Angular ui-router authorize module.

为 `[ui-router](https://github.com/angular-ui/ui-router)` 设计的模块

## 使用大致类似于上面的为`ng-route`

CDN 

	<script src="https://cdn.rawgit.com/Allen-Wei/angular-alan-auth/master/src/alan-auth.ui-router.js"></script>

`AlanAuth.map(urls or state names, roles, redirect)` 这个函数的第一个参数的含义变成了URL或者状态名称了, 而不是之前的URL或者控制器名称了.

访问[Demo](http://github.alanwei.net/angular-alan-auth/ui.router/app.html)查看演示. Demo源码请访问[gh-pages](https://github.com/Allen-Wei/angular-alan-auth/tree/gh-pages).