import Vuex from 'vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import ComponentWithButtons from '@/components/ComponentWithButtons.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

const mutations = {
  TEST_MUTATION: jest.fn()
}

const actions = {
  TEST_ACTION: jest.fn()
}

const store = new Vuex.Store({ state: {}, mutations, actions })

// 验证正确的 mutation 是否被 commit 了
// 验证 payload 是否正确
describe('<ComponentWithButtons />', () => {
  // const mockStore = { dispatch: jest.fn() }
  const wrapper = shallowMount(ComponentWithButtons, {
    store,
    localVue
    // mocks: {
    //   $store: mockStore
    // }
  })
  it('test commit', async () => {
    await wrapper.find('.commit').trigger('click')
    await wrapper.find('.dispatch').trigger('click')
    await wrapper.find('p').trigger('click')
    expect.assertions(2)
    expect(mutations.TEST_MUTATION).toHaveBeenCalledWith(
      {},
      'Test commit'
    )
    expect(actions.TEST_ACTION).toHaveBeenCalled()
    // expect(mockStore.dispatch).toHaveBeenCalledWith('STORE_DISPATCH', 'test store dispatch')
  })
})
