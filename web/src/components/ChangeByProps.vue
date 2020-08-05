<template>
  <div class="name">{{ name }}</div>
</template>

<script>
export default {
  name: 'ChangeByProps',
  props: {
    msg: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      name: 'Roy'
    }
  },
  watch: {
    msg (val) {
      this.changeName(val)
    }
  },
  methods: {
    changeName (name) {
      this.name = 'Jack'
    }
  }
}
</script>
