<template>
  <div>
    <button
      class="commit"
      @click="TEST_MUTATION('Test commit')"
    >commit it</button>
    <button
      class="dispatch"
      @click="TEST_ACTION('Test dispatch')"
    ></button>
    <p @click="storeDispatch">storeDispatch</p>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'ComponentWithButtons',
  methods: {
    ...mapMutations(['TEST_MUTATION']),
    ...mapActions(['TEST_ACTION']),
    storeDispatch () {
      this.$store.dispatch('STORE_DISPATCH', 'test store dispatch')
    }
  }
}
</script>
