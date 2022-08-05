<template>
  <div>
    <h1>Nuxt.js Example</h1>

    <div v-for="entry in entries" :key="entry.id">
      <NuxtLink :to="`/${entry.id}`">
        <div class="title">{{ entry.title }}</div>
        <p>{{ entry.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  asyncData({ payload }) {
    return payload
  },
}
</script>

<style scoped>
.title {
  font-size: larger;
}
</style>
