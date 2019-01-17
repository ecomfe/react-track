# react-track

基于React的声明式PV及用户行为采集框架。

## 为什么自研

在NPM上有若干个类似的包，但它们存在着一些缺陷，这其中主流的两类是：

- [react-tracking](https://www.npmjs.com/package/react-tracking)：偏向于声明式，但使用HOC的形式限制了使用的场景，且通过拦截类方法而臧`props`来进行数据的采集，与React的数据流形式略有不和。
- [react-tracker](https://www.npmjs.com/package/react-tracker)：采用类似`react-redux`的思想，使用`connect`和`Provider`的形式将功能联系起来。但是这种做法更偏向于命令式，从使用的角度来说繁琐之余也不易追踪。

除此之外，这些包均没有提供PV采集的能力。而PV采集中，有一个非常关键的问题至今没有得到很好的解决：

> 当URL中包含参数时，如`/posts/123`与`/posts/456`在PV上会被认为是两个页面，但事实上它们对应的路由均是`/posts/:id`，是相同的。

这一问题导致如果需要将包含参数的URL进一步的汇总与分组来更精确地计算“页面”的PV，则会需要额外的数据分析成本。因此我们希望从源头，即在数据采集的时候就解决这一问题，这也导致需要与`react-router`进行关联。

我们的目标是：

- 使用声明式的形式进行数据采集。
- 与React的组件树结构进行整合，可在JSX中形象地表达。
- 提供PV采集的能力，且**能够获取`react-router`的配置**。
- 尽可能小的移除成本，当一个行为或页面PV不再需要采集时，可以用最简单的手段移除而不影响已有组件的逻辑。

# 使用文档

## 全局环境准备

类似于`redux`或`react-router`，`react-track`需要一个全局的环境来定义数据的采集过程和数据的记录形式，这些环境由`Tracker`组件来定义。`Tracker`组件需要以下2个属性：

- `{Function} collect`：定义如何采集和组装需要记录的数据。
- `{Object} provider`：定义如何将数据记录下来或发送至指定服务。

### 定义数据采集

在`Tracker`组件中，`collect`属性用来定义“采集哪些数据”以及“数据的最终结构”。`connect`是一个函数，其签名如下：

```typescript
type collectPageView = (type: 'pageView', location: Location) => object;
type collectEvent = (type: 'event') => object;
type collect = collectPageView | collectEvent;
```

`react-track`内置了几种常用的采集函数：

- `browser()`：添加浏览器相关的信息，包括UA、分辨率、操作系统、浏览器版本、系统语言。这个采集仅在类型为`pageView`时才会生效。
- `context(env)`：将固定的`env`对象放到采集数据中去，常用于添加当前登录用户名、系统名称、系统版本等信息。
- `session(storageKey)`：跟踪一次用户的访问，为每一次访问生成一个唯一的标识，并存放在`sessionStorage`中，这个唯一标识会变为名为`session`的属性值。可以通过`storageKey`来自定义`sessionStorage`中对应的键名。
- `holmesTag`：百度统计的标签信息采集，用法详见：[holmesTag说明](./src/collect/holmesTag/README.md)

当希望同时使用多个`collect`函数时，可以通过`combineCollects`将它们组合成一个函数。以下代码展示了如何使用多个`collect`函数，并通过`combineCollects`将它们组合成一个：

```js
import {combineCollects, browser, context, session} from '@ecomfe/react-track';

const app = {
    name: 'My App',
    version: '1.0.0',
    branch: 'stable'
};

const collect = combineCollects(
    context(app),
    browser(),
    session()
);
```

### 定义数据应用

`Tracker`组件的`provider`属性用于控制采集到的数据如何使用，通常在生产环境我们会选择将其发送到指定的服务，如百度统计、Google Analysis等，在开发环境中则可以忽略或者显示在控制台中。

`provider`是一个对象，其定义如下：

```typescript
type PageViewData = {
    location: Location,
    referrer: Location,
    [key: string]: any
};

type EventData = {
    category: string,
    action: string,
    label: string,
    [key: string]: any
};

interface TrackProvider {
    install(): void;
    uninstall(): void;
    trackPageView(data: PageViewData): void;
    trackEvent(data: EventData): void;
}
```

通常使用`install`来做初始化的工作，`uninstall`进行清理，而`trackPageView` 和`trackEvent`则会在每一次PV或自定义事件数据采集完成后被调用。

`react-track`同样内置了几个常用的处理器：

- `holmes(site)`：封装了百度统计，接受对应的百度统计id。
- `print()`：用于调试，通过控制台打印对应的数据。
- `empty()` ：忽略所有的数据。

与`collect`相似地，一个应用中我们可能会需要同时将数据进行多重处理，如既发送到百度统计，又打印在控制台中，此时可以使用`composeProvider`函数进行组装。以下代码自定义了一个`provider`用于将数据通过POST发送到指定的服务器，同时将2个处理器组合为一个，最后仅在生产环境才生效，开发环境仅打印在控制台：

```js
import {holmes, print, composeProvider} from '@ecomfe/react-track';
import axios from 'axios';

const post = url => {
    const send = type => data => axios.post(url, {type, ...data});
    
    return {
        install: noop,
        uninstall: noop,
        trackPageView: send('pageView'),
        trackEvent: send('event')
    };
};

const trackProvider = process.env.NODE_ENV === 'production'
	? composeTracker(
		post('http://127.88.88.88:8888/v1/log'),
		holmes(mySiteID)
    )
	: print();
```

### 定义环境

在有了`collect`和`provider`的定义后，将`Tracker`组件置于应用的最外层即可以完成全部环境的准备：

```jsx
import {Tracker} from '@ecomfe/react-track';
import {BrowserRouter} from 'react-router';
import {App} from 'components';

<Tracker collect={collect} provider={trackProvider}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</Tracker>
```

## 采集PV

对于Web应用，PV是数据采集中的必要信息。传统的PV采集会存在一个问题，假设我们有一个展示用户信息的页面，其路由是`/users/:username`，那么对于不同的用户，我们将会得到不同的URL，如`/users/Alice`和`/users/Bob`。在常见的PV采集方案中，采集工具仅对URL作出反应，因此在数据的统计中，我们会看到2个页面分别有n和m的访问量。

但是在对应用系统的分析时，我们更希望得到这样一个信息：用户信息页被访问了多少次。然而问题是，在采集的数据中，要通过`/users/Alice`和`/users/Bob`去还原用户信息页被问题的问题（n + m）是相对困难的，当路由规则更加复杂时，甚至可能是无法实现的。

为此，`react-track`在PV采集上，提供了将`/users/:username`这个URL模块也一并捕获的能力，使用`react-router`的定义，称之为`path`。由于`react-router 4.x`的特征，从全局顶层来获取`path`是不可能的，因此为了实现这一功能，使用`react-track`的系统不得不在代码上做出一些微小的改变。

### 声明PV采集点

`react-track`要求用户显式地声明需要采集PV信息的路由位置，提供了`TrackRoute`这一组件来进行声明。

`TrackRoute`的功能与`react-router`的`Route`组件完全兼容，因此对于一个已经使用了`react-router`的系统，只需要在合适的位置将`<Route>`修改为`<TrackRoute>`即可：

```jsx
import {Switch, Route} from 'react-router-dom';
import {CommonHeader, AboutTab, Info, Contact} from 'components';

const App = () => (
    <div>
        <CommonHeader />
        <Switch>
    	    <TrackRoute exact path="/console" component={Console} />
	        <TrackRoute exact path="/service" render={() => <Service />} />
        	<Route path="/about" component={AboutMe}>
                <AboutTab />
                <TrackRoute exact path="/about/info" component={Info} />
                <TrackRoute exact path="/about/contact" component={Contact} />
            </Route>
        </Switch>
	</div>
);
```

需要注意的一点是，`TrackRoute`就当仅应用在**最底层的路由**上。如上述代码中的`/about`这一级路由并不是最底层的，其下还有`/about/info`和`/about/contact`，如果将这一层的`<Route>`改为`<TrackRoute>`的话，当访问`/about/info`时，由于上下两个路由都会触发PV采集，最终将会形成2条数据：

- `{pathname: "/about/info", path: "/about"}`
- `{pathname: "/about/info", path: "/about/info"}`

它们的`pathname`是一样的，始终指向当前真实的URL，而`path`则不同，指向`<TrackRoute>`上的`path`属性。这会导致数据的重复。

### 高阶组件

同时`react-track`还提供了`trackPageView`高阶组件，可以将任意的组件声明为PV采集点。`trackRoute`并不会声明路由信息，因此还需要将组件放置在`<Route>`下：

```jsx
import {trackPageView} from 'react-track';
import {Route} from 'react-route';

const Console = () => (
    <div>
        ...
    </div>
);
const ConsoleWithTrack = trackPageView(Console);

<Route exact path="/console" component={ConsoleWithTrack} />
```

## 采集事件

通过事件采集可以分析用户的行为，帮助理解用户的真实需求并进行产品的改进。`react-track`提供了简单直接的采集方式，允许通过对事件回调类型的属性进行拦截来采集相关数据。

在常见的自定义事件模型中，一个事件由`category`、`action` 和`label`三个属性组成。

### 定义采集点

`react-track`提供了`TrackEvent`组件，使用它包裹在对应组件的外层，并通过`eventPropName`指定需要拦截的事件名称，用`category`、`action`、`label`声明事件的相关信息。除以上4个属性外，其它的属性会透传给其子元素。

子组件需要支持`eventPropName`对应的属性，且必须是函数类型。需要支持多个事件类型时可以嵌套使用：

```jsx
import {TrackEvent} from '@ecomfe/react-track';
import {NavLink} from 'react-router-dom';

const NavItem = ({name, to}) => (
    <TrackEvent eventPropName="onMouseEnter" category="navigation" action="mouseEnter" label={name}>
        <TrackEvent eventPropName="onMouseLeave" category="navigation" action="mouseLeave" label={name}>
            <li>
                <NavLink exact to={to}>{name}</NavLink>
            </li>
        </TrackEvent>
    </TrackEvent>
);
```

### 高阶组件

`react-track`同时提供了`trackEvent`高阶组件，用于直接在一个现有组件上添加事件采集的能力。在希望采集多个事件时，与`recompose`一起配合能取得更好的代码可读性：

```jsx
import {trackEvent} from '@ecomfe/react-track';
import {NavLink} from 'react-router-dom';
import {compose} from 'recompose';

const NavItem = ({name, to}) => (
    <li>
    	<NavLink exact to={to}>{name}</NavLink>
    </li>
);

const track = action => {
    const options = {
        eventPropName: 'on' + action[0].toUpperCase() + action.slice(1),
        category: 'navigation',
        action: action,
        label: null
    };
    
    return trackEvent(options);
};

const enhance = compose(
    track('mouseEnter'),
    track('mouseLeave')
);

export default enhance(NavLink);
```

