# angular-alan-auth

AngularJS Authorize Module.

����[Demo](http://github.alanwei.net/angular-alan-auth/app.html)�鿴��ʾ. DemoԴ�������[gh-pages](https://github.com/Allen-Wei/angular-alan-auth/tree/gh-pages).

## Install
	
������`angular.js`֮������`alan-auth.js`

	<script src="https://cdn.rawgit.com/Allen-Wei/angular-alan-auth/master/src/alan-auth.js"></script>

## Use

������Ҫע��`alanAuth`ģ��, ����ע��`ngRoute`��ģ��һ��.

Ȼ�����û���URL��Ȩ��ӳ��, ��һ�������`angular.run(...)`������.

`AlanAuth.setIsInRole()`������������һ������, �����������У�鵱ǰ�û��Ƿ�ӵ��ĳ����ɫ, �����ĵ�һ�������ǵ�ǰִ��ҳ����������ʵĽ�ɫ����.

`AlanAuth.map(urls or controllers, roles, redirect)`, �����������������Щ��ɫ���Է���ָ����ҳ��/������.

1. ��һ��������URL��ַ���߿���������, ������һ������, Ҳ������һ���ַ���.
2. �ڶ���������������ʵĽ�ɫ, �����ǵ�����ɫ�ַ���, Ҳ������һ����ʶ�����ɫ���ַ�������.
3. ����������������һ������, Ҳ������һ���ַ���. ��Ȩ��У��ʧ��(setIsInRole���õĺ�������false)ʱ, �����������Ǻ�����ִ���������, ������ַ�������ת���ַ���ָ����ҳ��, ����ַ�����`#`��ͷ, ʹ�� `location.href = redirect` �ķ�ʽ��ת, ����ַ�����`~`��ͷ, ��ȥ��`~`, ʹ�� `location.href = redirect`��ת, �������ʹ�� `$location.path(redirect)` ִ����ת.

	angular.module("your app name", [/*your else modules*/, "alanAuth"]).run(function(AlanAuth){
		AlanAuth.setIsInRole(function(roles, controller){
			//ִ�н�ɫ��� ������true/false.
		})
		.map(url, role name, redirect url when unauth)
		.map(....);
	});


