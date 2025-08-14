<template>
  <h1>You did it!</h1>
  <p>
    {{count}}
  </p>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDefaultStore } from '@/stores/defaultStore.js'
import { storeToRefs } from 'pinia'

const defaultStore = useDefaultStore()

const {
  count
} = storeToRefs(defaultStore)

console.log(count.value, "default");

</script>


<style scoped></style>

