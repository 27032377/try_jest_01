import { shallowMount } from '@vue/test-utils'
import FormSubmitter from '@/components/FormSubmitter.vue'
import flushPromises from 'flush-promises'
import mockHttp from '../mock/mockHttp.js'

describe('<FormSubmitter />', () => {
  // const wrapper = shallowMount(FormSubmitter, {
  //   data () {
  //     return {
  //       username: 'alice'
  //     }
  //   }
  // })
  const wrapper = shallowMount(FormSubmitter, {
    mocks: {
      $http: mockHttp
    }
  })
  it('user behavior', async () => {
    wrapper.find('[data-username]').setValue('alice')
    wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    // await wrapper.vm.$nextTick()
    console.log(wrapper.find('[data-username]').attributes())
    expect(wrapper.find('.message').text()).toMatch('alice')
  })
})
