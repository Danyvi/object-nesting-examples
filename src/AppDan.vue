<template>
  <div class="container">
    <div v-for="(dataParentLabel,index) in dataParentLabels" :key='index' class="parent_card">
      <b>{{ dataParentLabel }}</b>
      <div class="child_card">
      <div
        v-if="isObject(dataChildrenValues(dataParentLabel))"
      >
        ++++++++ OBJECT CUSTOM ++++++++
      </div>


      <div
        v-else-if="Array.isArray(dataChildrenValues(dataParentLabel))"
        style="display: flex; justify-content: space-between;"
      >
        <div>{{ dataChildrenValues(dataParentLabel)[0] }}</div>
        <div>{{ dataChildrenValues(dataParentLabel)[1] }}</div>
      </div>

      <div
        v-else
      >
        {{ dataChildrenValues(dataParentLabel) }} ** STRING
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue'
import { useDefaultStore } from '@/stores/defaultStore.js'
import { storeToRefs } from 'pinia'

const defaultStore = useDefaultStore()

const {
  responseBody
} = storeToRefs(defaultStore)


function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const dataParentLabels = Object.keys(responseBody.value.response_body)


const dataChildrenValues = (parentLabel) => {
  return responseBody.value.response_body[parentLabel]
}

console.log('dataparent labels', dataParentLabels)
</script>


<style scoped>
.container {
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.parent_card {
  border: 1px solid blue;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.child_card {
  border: 1px solid red;
}
</style>

