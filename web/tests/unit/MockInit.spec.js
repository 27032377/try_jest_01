import { shallowMount } from '@vue/test-utils'
import MockI18n from '@/components/MockI18n.vue'

describe('global MockI18n', () => {
  const wrapper = shallowMount(MockI18n)
  it('test global mock', () => {
    console.log(wrapper.html())
    expect(wrapper.text()).toBe(true)
  })
})
