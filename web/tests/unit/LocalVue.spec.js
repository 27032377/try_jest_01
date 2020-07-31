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
