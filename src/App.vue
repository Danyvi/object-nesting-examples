<template>
  <div class="container">
    <RecursiveCard
      label="Root"
      :value="responseBody.response_body"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDefaultStore } from '@/stores/defaultStore.js'
import RecursiveCard from '@/RecursiveCard.vue'

const defaultStore = useDefaultStore()
const { responseBody } = storeToRefs(defaultStore)
</script>

<style>
.container {
  padding: 1rem;
}
</style>
