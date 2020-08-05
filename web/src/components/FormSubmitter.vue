<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="username" data-username />
      <input type="submit" />
    </form>
    <p class="message" v-if="submitted">
      Thank you for your submission, {{ username }}
    </p>
  </div>
</template>
<script>
export default {
  name: 'FormSubmitter',
  data () {
    return {
      username: '',
      submitted: false
    }
  },
  methods: {
    handleSubmit () {
      this.submitted = true
    }
  }
}
</script>
