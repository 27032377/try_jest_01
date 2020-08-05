import { mount } from '@vue/test-utils'
import MockI18n from '@/components/MockI18n.vue'
import lang from '../constant/lang.js'

describe('<MockI18n />', () => {
  it('test Mock', () => {
    // const wrapper = mount(MockI18n)
    // vm.$t is not a function
    // expect(wrapper.text()).toMatch('World')

    const wrapper = mount(MockI18n, {
      mocks: {
        $t: msg => lang.ja[msg]
      }
    })
    expect(wrapper.text()).toBe('こんにちは、世界！')
  })
})
