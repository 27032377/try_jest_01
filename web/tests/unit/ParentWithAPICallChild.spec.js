import { mount, shallowMount } from '@vue/test-utils'
import ParentWitAPICallChild from '@/components/ParentWithAPICallChild.vue'
import ComponentWithAsyncCall from '@/components/ComponentWithAsyncCall.vue'

describe('ParentWitAPICallChild Scope', () => {
  const wrapper = mount(ParentWitAPICallChild, {
    stubs: {
      ComponentWithAsyncCall: true
    }
  })
  it('Test stubs by mount stubs Boolean', () => {
    expect(wrapper.findComponent(ComponentWithAsyncCall).exists()).toBe(true)
  })

  const autoWrapper = shallowMount(ParentWitAPICallChild)
  it('Test stubs by shallowMount stubs Auto', () => {
    expect(autoWrapper.exists()).toBe(true)
  })
})
