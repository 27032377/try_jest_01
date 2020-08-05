import { shallowMount } from '@vue/test-utils'
import ChangeByProps from '@/components/ChangeByProps.vue'

describe('<ChangeByProps />', () => {
  const wrapper = shallowMount(ChangeByProps)
  it('component init', () => {
    expect(wrapper.find('.name').text()).toBe('Roy')
  })
  it('change props', async () => {
    await wrapper.setProps({
      msg: 'Lucy'
    })
    expect(wrapper.find('.name').text()).toBe('Jack')
  })
})
