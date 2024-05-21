React - Buildings Project

1、use vite to build React
=> https://vitejs.dev/guide/
=> yarn create vite

2、setting SASS
=> yarn add sass -D

3、setting Axios
=> yarn add axios

4、setting Proxy
=> yarn add http-proxy-middleware
=> add file src/setupProxy.js

5、token persistence
=> add file src/utils/token.js

6、setting Router v6
=> yarn add react-router-dom
=> BrowserRouter、Routes、Route、Navigate、useNavigate、OutLet、Link、NavLink、useSearchParams、useParams

7、useRoutes hook

8、route validation
=> add auth folder

9、setting useContext & useReducer to Redux
=> add store folder

10、React.lazy
=> 1、const Test = React.lazy(() => import('./pages/AppReduxTest'));
=> 2、add
<React.Suspense fallback={<div>Loading...</div>}>
<xxx />
</React.Suspense>
=> 3、封裝 lazyLoad 方法 , folder lazyLoad

11、env settings
=> https://www.youtube.com/watch?v=jqCjflIGH1o

12、setting i18n
=> yarn add i18next react-i18next

13、setting ahooks
=> https://ahooks.js.org/zh-CN/hooks/use-request/basic/

14、setting ui framework
=> https://ant.design/docs/react/introduce-cn
=> yarn add antd

15、setting cookie 棄用
=> https://github.com/bendotcodes/cookies/tree/main/packages/react-cookie
=> yarn add react-cookie

16、setting cookie
=> https://www.npmjs.com/package/universal-cookie
=> yarn add universal-cookie

17、Git Specification
add branch 命名方式
=> [sprint 開始日]-[sprint 結束日]-[feature|fix|refactor|revert|test]-[page|component]-[開發者名字]-[自由填寫]

commit
=> feature-[page|comp]-[fn]
=> fix-[page|comp]-[fn]
=> refactor-[page|comp]-[fn]
=> revert-[version]
=> test-[page|comp]-[fn]

## Appendix - 和 nuxt 專案共同佈署在同一個 domain 的方式

- 預期用 /v4 開頭的網址來區分要導向 react 專案的路由

需要更動的地方為 :

- /src/main.jsx 中，<BrowserRouter basename={'/v4'}>，後面須加上 basename
- vite.config.js 中的 defineConfig，須加上 base: "/v4/"

:warning: 以上改動會讓 react 專案在執行時，所有路由上除了 domain 以外，會加上 /v4 開頭
:warning: 如果不做此改動，在 Nginx 上如果想導向某個特定的 location，會找不到 .js 檔

Nginx 設定檔中加上以下設定(port 記得調)

```
location /v4 {
    proxy_set_header    X-Forwarded-For $remote_addr;
    proxy_set_header    Host $http_host;
    proxy_set_header    X-Real-IP $remote_addr;
    proxy_pass          "http://127.0.0.1:5173";
}
```
