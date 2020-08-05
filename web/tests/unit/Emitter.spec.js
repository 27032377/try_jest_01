import { shallowMount } from '@vue/test-utils'
import Emitter from '@/components/Emitter.vue'

describe('<Emitter />', () => {
  const wrapper = shallowMount(Emitter)
  wrapper.vm.emitEvent()
  wrapper.vm.emitEvent()
  console.log(wrapper.emitted())
  it('test emitted', () => {
    expect(wrapper.emitted().myEvent.length).toBe(2)
    expect(wrapper.emitted().myEvent[0]).toEqual(['hello', 'world'])

    // call 的实现方式
    const events = {}
    const $emit = (event, ...args) => {
      events[event] = [...args]
    }
    Emitter.methods.emitEvent.call({ $emit })
  })
})
