<template>
  <div></div>
</template>

<script>
export default {
  name: 'Emitter',
  methods: {
    emitEvent () {
      this.$emit('myEvent', 'hello', 'world')
    }
  }
}
</script>
