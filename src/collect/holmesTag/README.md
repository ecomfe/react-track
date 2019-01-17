`holmesTag`需与处理器`holmes`（provider）同时使用。

注：`holmes`是React-track中已经提供的百度统计最基本事件的处理器，它会发送trackPageView事件，存在该事件才能发送标签。

`holmesTag(type, id, value|getValueFunc [, options])`:

- type：标签类型，可选值有`PAGE、VISIT、USER`，分别对应页面标签、访问标签、访客标签

- id：标签id，在百度统计中生成，详见：https://tongji.baidu.com/web/help/article?id=271&type=0

- value：标签值，当直接将app中的数据作为标签值时可使用（如将用户的等级、角色作为访客标签的值等）

- getValueFunc(location, options)：生成标签值的方法。当标签值的生成依赖location时使用，options是`holmesTag`传入的第四个参数。该方法中可根据location和options自由定义何时发送怎样的标签值。方法应返回要发送的标签值（数值或字符串），不返回或返回null时不发送

- options：当getValueFunc需要额外的参数时传入

```js
import {Tracker, holmes, holmesTag, combineCollects, composeProvider} from '@ecomfe/react-track';

// 当url为 /platform/detail/{platformId} 时将platformId作为标签值发送
const getPlatformId = (location, options) => {
const snippets = location.pathname.split('/');

    const prefix = snippets.slice(0, 3).join('/');

    if (prefix === '/platform/detail') {
        return snippets[3] || null;
    }

    return null;
};

const collect = combineCollects(
    ...
    holmesTag('PAGE', PAGE_TAG_ID, getPlatformId),
    holmesTag('USER', USER_TAG_ID, 'MALE')
);

const provider = composeProvider(
    ...
    holmes(SITE_ID) // SITE_ID在百度统计网站中生成
);

render(
    <Tracker collect={collect} provider={provider}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Tracker>,
    document.body.appendChild(document.createElement('div'))
);
```
