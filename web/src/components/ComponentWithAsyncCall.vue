<template>
  <div>
    <ul>
      <li v-for="todo in todoList" :key="todo.id">{{todo.title}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ComponentWithAsyncCall',
  data () {
    return {
      todoList: []
    }
  },
  created () {
    console.log('child component created')
    this.makeApiCall()
  },
  methods: {
    async makeApiCall () {
      console.log('enter the async method')
      fetch('https://jsonplaceholder.typicode.com/todos/10')
        .then(res => res.json()).then(result => {
          this.todoList = result
        })
    }
  }
}
</script>

<style>

</style>