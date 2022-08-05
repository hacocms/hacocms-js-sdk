<template>
  <div>
    <header>
      <h1>{{ entry.title }}</h1>
      <p>{{ entry.description }}</p>
    </header>

    <div v-html="entry.body"></div>
  </div>
</template>

<script>
export default {
  name: 'EntryPage',
  asyncData({ payload }) {
    return payload
  },
}
</script>
