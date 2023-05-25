<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useUserInfoStore } from './stores'

const store = useUserInfoStore()
store.login({ username: 'root', password: '123456' })
</script>
<style scoped></style>
