import { render } from '@vue/server-test-utils'
import { mount, shallowMount } from '@vue/test-utils'
import About from '@/views/About.vue'
import { globals } from '../../jest.config'

describe('About Render', () => {
  it('Test About', async () => {
    function data () {
      return {
        msg: '123'
      }
    }
    // const warpper = mount(About, { data })
    expect.assertions(2)
    expect(globals.__DEV).toBeTruthy()
    const warpper = await render(About, { data })
		expect(warpper.text()).toMatch('123')
  })
})

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
