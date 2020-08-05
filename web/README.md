# Jest在Vue中的实践

*SSR依次安装 `vue-server-renderer` 和 `@vue/server-test-utils`*

根目录下的 Jest 配置文件
```
// jest.config.js
{
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    // tell Jest to handle *.vue files
    'vue'
  ],
  transform: {
    // process *.vue files with vue-jest
    '^.+\\.vue$': require.resolve('vue-jest'),
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
    require.resolve('jest-transform-stub'),
    '^.+\\.jsx?$': require.resolve('babel-jest')
  },
  transformIgnorePatterns: ['/node_modules/'],
  // support the same @ -> src alias mapping in source code
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testEnvironment: 'jest-environment-jsdom-fifteen',
  // serializer for snapshots
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  testMatch: [
    '**/tests/unit/**/*.spec.[jt]s?(x)',
    '**/__tests__/*.[jt]s?(x)'
  ],
  // https://github.com/facebook/jest/issues/6766
  testURL: 'http://localhost/',
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname')
  ],
  bail: 1,
  // 理解为 beforeEach jest.clearAllMocks()
  clearMocks: true,
  // globals全局对象
  globals: {},
  // 测试覆盖率
  collectCoverage: true
}
```

## 挂载选项

- `context`，Object，将上下文传递给函数式组件，*该选项只能用于`函数式组件`*
- `data`，Function，向一个组件传入数据，这将会合并到现有的 `data` 函数中

```
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{msg}}</p>
    <slot name="foo"></slot>
    <slot></slot>
  </div>
</template>
```

```
// About.vue

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{msg}}</p>
    <slot name="foo"></slot>
    <slot></slot>
  </div>
</template>
```

```
// About.spec.js

import { render } from '@vue/server-test-utils'
// import { mount } from '@vue/test-utils'
import About from '@/views/About.vue'

describe('About Component Scope', () => {
  it('Test About', async () => {
    function data () {
      return {
        msg: '123'
      }
    }
    // const warpper = mount(About, { data })
    // 这里通过 mount 与 render 等效
    const warpper = await render(About, { data })
		expect(warpper.text()).toMatch('123')
  })
})
```

- `slots`，Object，interface：`{ [name: string]: Array<Component>|Component|string }`，为组件提供一个 `slot` 内容的对象。

```
// About.spec.js

describe('About Slot', () => {
  const wrapper = mount(About, {
    slots: {
      foo: 'roi',
      default: 'olam'
    }
  })
  it('slots inject', () => {
    expect(wrapper.text()).toMatch('roi')
    expect(wrapper.text()).toMatch('olam')
  })
})
```

- `scopedSlots`，Object，`interface: { [name: string]: string|Function }`，提供一个该组件所有作用域插槽的对象。

```
shallowMount(Component, {
    scopedSlots: {
        foo: '<p slot-scope="foo">{{foo.text}}</p>',
        default: '<p>{{props.text}}</p>'
    }
})
```

- `stubs`，Object|Array，interface: `{ [name: string]: Component|boolean } | Array<string>` 将子组件存根。可以是一个要存根的组件名的数组或对象。如果 `stubs` 是一个数组，则每个存根都是一个 `<${component name-stub>`。

> 当编写测试代码时，我们经常会想要 `stub` 掉代码中哪些我们不感兴趣的部分。一个 `stub` 就是简单的一段替身代码。

```
// ParentWithAPICallChild.vue

<template>
  <ComponentWithAsyncCall />
</template>

<script>
import ComponentWithAsyncCall from './ComponentWithAsyncCall.vue'

export default {
  name: 'ParentWithAPICallChild',
  components: {
    ComponentWithAsyncCall
  }
}
</script>
```

```
// ComponentWithAsyncCall.vue

<template>
  <div>
    <ul>
      <li v-for="todo in todoList" :key="todo.id">{{todo.title}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ComponentWithAsyncCall',
  data () {
    return {
      todoList: []
    }
  },
  created () {
    this.maleApiCall()
  },
  methods: {
    async makeApiCall () {
      fetch('https://jsonplaceholder.typicode.com/todos/10')
        .then(res => res.json()).then(result => {
          this.todoList = result
        })
    }
  }
}
</script>
```

向 `stubs` 传入 `[component]: true` 后用一个 `stub` 替换了原始的组件。依然可以用 `find` 选取，因为 `findComponent` 内部使用的 `name` 属性依旧相同。
不同于使用 `mount` 并手动 `stub`，可以简单使用 `shallwMount`，它默认会自动 `stud` 掉任何其他组件。
```
import { mount, shallowMount } from '@vue/test-utils'
import ParentWitAPICallChild from '@/components/ParentWithAPICallChild.vue'
import ComponentWithAsyncCall from '@/components/ComponentWithAsyncCall.vue'

describe('<ParentWitAPICallChild />', () => {
  const wrapper = mount(ParentWitAPICallChild, {
    stubs: {
      ComponentWithAsyncCall: true
    }
  })
  it('Test stubs by mount stubs Boolean', () => {
    expect(wrapper.findComponent(ComponentWithAsyncCall).exists()).toBe(true)
  })

  // shallowMount 自动去掉了其他组件
  const autoWrapper = shallowMount(ComponentWithAsyncCall)
  it('Test stubs by shallowMount stubs Auto', () => {
    expect(autoWrapper.exists()).toBe(true)
  })
})
```

- `mocks`，Object，为实例添加额外的属性。在伪造全局注入(`Vue.prototype`)的时候有用。它不但对测试用例适用，也可以为所有测试设置默认的 `config.mock`。

```
// MockI18n.vue
<template>
  <div>{{$t(msg)}}</div>
</template>

import { mount } from '@vue/test-utils'
import MockI18n from '@/components/MockI18n.vue'

// MockI18n.spec.js
describe('<MockI18n />', () => {
  it('test Mock', () => {
    // const wrapper = mount(MockI18n) -->
    // _vm.$t is not a function
    // expect(wrapper.text()).toMatch('World')

    const wrapper = mount(MockI18n, {
      mocks: {
        $t: msg => msg
      }
    })
    expect(wrapper.text()).toMatch('World')
  })
})
```

- `localVue`，Vue，通过 `createLocalVue` 创建一个 Vue 的本地拷贝，用于挂载该组件的时候。在这份拷贝上安装插件可以防止原始的 Vue 被污染。适用于在局部使用第三方插件。

> 在测试的过程中，如果想要测试跟路由相关的功能，我们选择安装 `Vue-Router`。这里需要注意的是，我们应该避免直接在 `Vue` 的原型上安装 `Vue-Router`，而是应该把它安装在一个 `localVue` 中，避免全局 `routes` 被污染。

```
import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import About from '@/views/About.vue'
import Home from '@/views/Home.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)

const routes = [{ path: '/home', component: Home }]

const router = new VueRouter({
  routes
})

const wrapper = mount(About, {
  localVue,
  router
})

it('test localVue', () => {
  console.log(wrapper.vm.$route instanceof VueRouter)
  expect(wrapper.vm.$route).toBeInstanceOf(Object)
})
```

- `attachTo`，HTMLElement|string，指定一个 `HTMlElement` 或定位一个 HTML 元素的 CSS 选择器字符串，组件将会被完全挂载到文档中的这个元素。

当要挂载到 DOM 时，需要在测试的结尾调用 `wrapper.destroy()` 以将该元素从文档中移除，并销毁该组件实例。

- `attrs`，Objetct，设置该组件实例的 `$attr` 对象。
- `propsData`，Object，在组件被挂载时设置组件实例的 prop。
- `listeners`，Object，设置组件实例的 `$listeners` 对象。
- `parentComponent`，Object，用来作为被挂载组件的父级组件。

```
const wrapper = shallowMount(Component, {
  parentComponent: Foo
})
expect(wrapper.vm.$parent.$options.name).toBe('foo')
```

- `provide`，Object，为组件传递用于注入的属性。

```
const Component = {
  inject: ['foo'],
  template: '<p>{{this.foo()}}</p>'
}

const wrapper = shallowMount(Component, {
  provide: {
    foo() {
      return 'fooValue'
    }
  }
})

expect(wrapper.text()).toBe('fooValue')
```

## 测试异步行为

在编码测试代码时，会遇到两种异步行为：

- 来自 Vue 的更新
- 来自外部行为的更新

### 来自 Vue 的更新

Vue 会异步的将未生效的 DOM 批量更新，避免因数据反复变化而倒追不必要的渲染。

*async await*
```
it('async await', async () => {
  const button = wrapper.find('button')
  await button.trigger('click')
  expect(wrapper.text()).toContain('1')
})
```

和上述 *await* 触发等价

*Vue.nextTick()*
```
it('Vue.nextTick()', () => {
  const button = wrapper.find('button')
  button.trigger('click')
  await Vue.nextTick()
  expect(wrapper.text()).toContain('1')
})
```

可以被 await 的方法有：
- setData
- setValue
- setChecked
- setSelected
- setProps
- trigger

### 来自外部行为的更新

```
jest.mock('axios')
```

## API

### mount()

> 创建一个包含被挂载和渲染的 Vue 组件的 `wrapper`

### shallowMount()

> 和 `mount` 一样，创建一个包含被挂载和渲染的 Vue 组件的 `wrapper`，不同的是被存根的子组件。

### render()

> 将一个对象渲染成为一个字符串并返回一个 [cheerio 包裹器](https://github.com/cheeriojs/cheerio/wiki/Chinese-README)

### renderToString()

> 将一个组件渲染为 HTML。

## 选择器

> 一个选择器可以是一个 CSS选择器、一个 Vue 组件、或者是一个查找选项对象。

- CSS 选择器
- Vue 组件

```
const wrapper = shallowMount(Foo)
expect(wrapper.is(Foo)).toBe(true)
```

- 查找选项对象

```
// name
const buttonWrapper = wrapper.find({ name: 'my-button' })

// $ref
const buttonWrapper = wrapper.find({ ref: 'myButton' })
```

## createLocalVue()

> `createLocalVue` 返回一个 Vue 的类供你添加组件、混入和安装插件而不会污染全局的 Vue 类。

## createWrapper(node [, options])

> `createWrapper` 为一个呗挂载的 Vue 实例或一个 HTML 元素创建一个 `Wrapper`。

```
import Foo from './Foo.vue'

const Contructor = Vue.extend(Foo)
const vm = new Constructor().$mount()
const wrapper = createWrapper(vm)
expect(wrapper.vm.foo).toBe(true)
```

## Vue Test Utils 配置选项

```
// writeable
import { config } from '@vue/test-utils'
```

## enableAutoDestroy(hook)

> `enableAutoDestroy` 将会使用被传入的钩子函数销毁所有被创建的 `Wrapper` 实例。在调用这个方法之后，可以通过调用 `resetAutoDestroyState` 方法恢复到默认行为。

```
enableAutoDestroy(afterEach)
```

## 实践 tips

### 重构测试

> Don't Repeat Yourself

***用工厂函数重构***

在几个测试 `shallowMount` 中都传入了一个相似的 `porpsData` 对象。一个工厂函数指示一个返回单个对象的简单函数 —— 它制造对象，这就是其名为“工厂”的原因。

```
// factory.js
const msg  = "submit";
const factory = propsData => {
  return shallowMount(SubmitButton, {
    porpsData: {
      msg,
      ...propsData
    }
  })
}

// submitButton.spec.js
describe('SubmitButton', () => {
  describe('dose not have admin privileges', () => {
    it('render a message', () => {
      const wrapper = factory()
      expect(wrapper.find('span').text()).toBe('Not Authorized')
      expect(wrapper.find('button').text()).toBe('submit')
    })
  })

  describe('has admin privileges', () => {
    it('renders a message', () => {
      const wrapper = factory({ isAdmin: true })
      expect(wrapper.find('span').text()).toBe('Admin Privileges')
      expect(wrapper.find('button').text()).toBe('submit')
    })
  })
})
```

### 用 `call` 进行测试

```
// NumberRenderer
computed: {
  numbers() {
    const evens = []
    const odds = []
    for (let i = 1; i < 10; i++) {
      if (i % 2 === 0) {
        evens.push(i)
      } else {
        odds.push(i)
      }
    }
    return this.even ? evens.join(', ') : odds.join(', ');
  }
}

it('renders odd numbers', () => {
  const localThis = { even: false }
  expect(NumberRenderer.computed.numbers.call(localThis).toBe('1, 3, 5, 7, 9'))
})
```

> Vue 自动将 `props` 绑定到 `this`。因为我们没有通过 `mount` 渲染过组件，所以 Vue 不为 this 绑定任何东西。这时候 `console.log(this)`，会发现上下文只有 `computed` 对象：`{ numbers: [Function: numbers] }`

***用 `call` 还是 `mount`***

call 可以在以下情况被使用：

- 在测试一个生命周期方法中执行了某些耗时操作的组件，而想在针对计算属性的单元测试中绕过这些
- 想 `stub` 掉 `this` 上的某些值。使用 `call` 并传递一个自定义的上下文会很有用

### 模拟用户输入

当用户提交表单时，会显示一条感谢消息。我们想要异步提交表单，所有使用了 `.prevent`，防止刷新页面。

```
// FormSubmitter
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="username" data-username />
      <input type="submit" />
    </form>
    <p class="message" v-if="submitted">
      Thank you for your submission, {{ username }}
    </p>
  </div>
</template>
<script>
  export default {
    name: 'FormSubmitter',
    data () {
      return {
        username: '',
        submitted: false
      }
    },
    methods: {
      handleSubmit () {
        this.submitted = true
      }
    }
  }
</script>
```

编写测试

```
import { shallowMount } from '@vue/test-utils'
import FormSubmitter from '@/components/FormSubmitter.vue'

describe('<FormSubmmitter>', () => {
  it('reveals a notification when submitted', async () => {
    const wrapper = shallowMount(FormSubmitter)
    wrapper.find('[data-username]').setValue('alice')
    wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.message').text())
      .toBe('Thank you for your submission, alice.')
  })
})
```

#### mock 一个 ajax 调用

```
// mockHttp.js
const mockHttp = {
  get (_url, _data) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
}
```

编写测试

```
import flushPromises from 'flush-promises'
import mockHttp from './mockHttp.js'

it('reveals a notification when submitted', async () => {
  const wrapper = shallowMount(FormSubmitter, {
    mocks: {
      $http: mockHttp
    }
  })
  wrapper.find("[data-username]").setValue("alice")
  wrapper.find("form").trigger("submit.prevent")

  // flush-promises 确保包括 nextTick 在内的所有 promises 都被 resolve
  await flushPromises()

  expect(wrapper.find(".message").text())
    .toBe("Thank you for your submission, alice.")
})
```

## 测试 Vuex - Mutations

> mutations 易于遵循一套模式：取得一些数据，可能进行一些处理，然后将数据复制给 state

```
// mutations.js
export default {
  SET_POST (state, post) {
    state.postIds.push(post.id)
  }
}

// Mutations.spec.js
import mutations from '@/store/mutations'

describe('SET_POST', () => {
  it('add a post to the state', () => {
    const post = { id: 1 }
    const state = {
      postIds: []
    }
    mutations.SET_POST(state, post)
    expect(state).toEqual({
      postIds: [1]
    })
  })
})
```

## 测试 Vuex - Actions

我们通常会遵循一个 Vuex 模式创建一个 action:

- 发起一个向 API 的异步请求
- 对数据进行一些处理
- 根据 payload 的结果 commit 一个 mutation

```
import actions from '@/store/actions.js'

let url, body

jest.mock('axios', () => {
  return {
    post (_url, _data) {
      url = _url
      body = _data
      return Promise.resolve(true)
    }
  }
})

describe('authenticate', () => {
  const commit = jest.fn()
  const username = 'a'
  const password = 'b'

  it('test actions', async () => {
    await actions.authenticate({ commit }, { username, password })
    expect.assertions(3)
    expect(url).toBe('/api/authenticate')
    expect(body).toEqual({ username, password })
    expect(commit).toHaveBeenCalledWith('SET_AUTH', true)
  })
})

```

## 常用技巧

### 明白要测试的是什么

> 把测试撰写为断言你的组件的公共接口，并在一个黑盒内部处理它。一个简单的测试用例将会断言一些输入(用户的交互或 prop 的改变)提供给某组件之后是否导致预期结果(渲染结果或触发自定义事件)。比如测试点击加一的 Counter 组件，并不用关注如何实现递增数值，而只关注其输入和输出。该好处在于，几遍组件的内部实现已经随时间发生了变化，之哟啊你的组件的公共接口保持一致，测试就可以通过。

### 浅渲染(shallowMount)

> 在测试用例中，我们通常希望专注在一个孤立的单元中测试组件，避免对其子组件的行为进行间接的断言。对于包含许多子组件的组件来说，整个渲染树可能会非常大。重复渲染所有子组件会让测试变慢。

### 生命周期钩子

> 除非使用 Wrapper.destory()，否则 beforeDestroy 和 destroyed 将不会触发。此外组件在每个测试规范结束时并不会被自动销毁，并且将由用户来决定是否要存根或手动清理那些在测试规范结束前继续运行的任务。(e.g setInterval 或者 setTimeout)