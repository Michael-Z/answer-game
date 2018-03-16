# Csmall-ajax
#### 与后端良好适配的ajax请求工具，可自动判断请求的返回状态，自动显示请求状态提示。
### 用法说明

#####引入到项目中

`import r from 'csmall-ajax';`

#####提供的基本请求方法(method)：
`get, post, put, del`

#####调用方法：
`const p = r.method(url[, option])`

+ url 以 "/" 开使，不允许访问当前页面之外的host
+ option 为 {}, 允许为空，不为空时可以传递如下内容:
+ data：body区传递的参数，请求为 post,put时有效，否则忽略
+ query: 作为QueryString附加至url后，减轻拼接参数的工作
+ path: 以同名替换至 url中以":"开始的路径段，比如 /user/:account/login 中:account将被替换
+ header：将放至Header区传递,如果有 content-type（不区分大小写） 存在，将覆盖默认的 Content-type

如果内置的基本请求不能满足使用，可以使用ajax方法:

`const p = r.ajax(method, url[, option])`

#####返回：
请求返回一个Promise `p`
 
#####`p` 提供如下回调(callback)接口:

`start, success, fail, error, done`

#####调用方法:
`p.callback(callable)`

+ start 回调中的方法将直接执行，可以在发送前在此处做些准备工作
    callable 可接收的参数:
    <pre>
    xhr: XMLHttpRequest
    q: 带有 resolve 和 reject 两个方法可供调用
    </pre>
+ success 将在执行成功(状态为200且服务器返回的 success 为 true)时调用，可接收的参数：
    <pre>
    data: 获得的数据
    xhr: XMLHttpRequest, 如果当前数据有分页，可以通过 xhr.page 获取分页信息
    q: 带有 resolve 和 reject 两个方法可供调用
    </pre>
+ fail 操作失败(状态为200但服务器返回的 success 为 false)时执行，可接收的参数为:
    <pre>
    err: 错误说明，有 code 和 msg 属性, 对code和msg属性进行修改，可以改变在请求状态栏显示的错误提示
    xhr: XMLHttpRequest
    q: 带有 resolve 和 reject 两个方法可供调用
                                       </pre>
                                   + error 请求错误(状态非200)
                                       <pre>
                                       err: 错误说明，有 code 和 msg 属性, 对code和msg属性进行修改，可以改变在请求状态栏显示的错误提示
                                       xhr: XMLHttpRequest
                                       q: 带有 resolve 和 reject 两个方法可供调用
                                       </pre>
                                   + done 请求完成,不管成功或是失败，都分执行,可以获得的参数为:
                                       <pre>
                                       xhr: XMLHttpRequest
                                       q: 带有 resolve 和 reject 两个方法可供调用
    </pre>

注: 调用q.resolve或q.reject将改变流程的走向。resolve后将执行后续的成功流程(如果数据未修复，将继续被判定为错误)，reject后将执行后续的失败流程
####示例:
获取菜单列表:
<pre>
r.get('/menu_list/account').success((data)=>{
   this.menus = data;
});
</pre>
用户登录:
<pre>
r.get('/user/:account/login', {
    path: {account: form.model.account},
    query: {password: form.model.password}
}).success((data)=>{
    location.href = queryParam('ref') || '/summary/';
});
</pre>