<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{msg}}</p>
    <slot name="foo"></slot>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'About',
  data () {
    return {
      msg: 'abc'
    }
  }
}
</script>
