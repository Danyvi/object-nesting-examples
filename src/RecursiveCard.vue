<template>
  <div class="card">
    <b class="card-title">{{ label }}</b>

    <!-- Primitive value -->
    <div v-if="isPrimitive(value)" class="card-content">
      {{ value }}
    </div>

    <!-- Object -->
    <div v-else-if="isObject(value)" class="card-content">
      <div
        v-for="(val, key) in value"
        :key="key"
        class="card-row"
      >
        <!-- Nested object or array -->
        <RecursiveCard
          v-if="isObject(val) || Array.isArray(val)"
          :label="key"
          :value="val"
        />

        <!-- Primitive key-value -->
        <div v-else>
          {{ key }}: {{ val }}
        </div>
      </div>
    </div>

    <!-- Array -->
    <div v-else-if="Array.isArray(value)" class="card-content">
      <div
        v-for="(item, idx) in value"
        :key="idx"
        class="card-row"
      >
        <RecursiveCard
          v-if="isObject(item) || Array.isArray(item)"
          :label="`Item ${idx + 1}`"
          :value="item"
        />
        <div v-else>
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  label: String,
  value: {
    type: [String, Number, Object, Array],
    required: true
  }
})

function isObject(val) {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

function isPrimitive(val) {
  return typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean'
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.75rem;
  margin: 0.5rem 0;
}
.card-title {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.card-content {
  margin-left: 0.75rem;
}
.card-row {
  margin: 0.25rem 0;
}
</style>
