<template>
  <div>{{$t(msg)}}</div>
</template>

<script>
export default {
  name: 'MockI18n',
  data () {
    return {
      msg: 'Hello World'
    }
  }
}
</script>
