<template>
  <h1>API Response</h1>
  <p>
    {{usersApiResponse}}
  </p>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDefaultStore } from '@/stores/defaultStore.js'
import { storeToRefs } from 'pinia'

const defaultStore = useDefaultStore()

const {
  usersApiResponse
} = storeToRefs(defaultStore)

console.log(usersApiResponse.value, "usersApiResponse");

</script>


<style scoped></style>

