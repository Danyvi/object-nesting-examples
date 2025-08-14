<template>
  <section class="container">
    <div class="controls">
      <label>
        <span>Group by:</span>
        <select v-model="groupPath">
          <option value="company.name">company.name</option>
          <option value="address.city">address.city</option>
        </select>
      </label>

      <label>
        <span>Filter city (contains):</span>
        <input v-model="cityFilter" placeholder="e.g. wis" />
      </label>
    </div>

    <ul class="group-list">
      <li v-for="[key, items] in Array.from(grouped)" :key="key" class="group">
        <div class="group-header">
          {{ key }} <span class="count">({{ items.length }})</span>
        </div>
        <ul class="user-list">
          <li v-for="u in items" :key="u.id" class="user">
            {{ u.name }} — {{ u.email }} — {{ u.address.city }}
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script setup>

import { ref, computed } from 'vue'
import { useDefaultStore } from '@/stores/defaultStore.js'
import { storeToRefs } from 'pinia'

const defaultStore = useDefaultStore()

const {
  users
} = storeToRefs(defaultStore)

console.log(users.value, "usersApiResponse");

// ---- utilities: safe getter + grouping/filtering ----

function getAtPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj)
}

function groupByPath(items, path) {
  const out = new Map()
  for (const item of items) {
    const rawKey = getAtPath(item, path)
    const key = rawKey == null ? '—' : String(rawKey)
    if (!out.has(key)) {
      out.set(key, [])
    }
    out.get(key).push(item)
  }
  return out
}

function filterBy(items, spec) {
  const entries = Object.entries(spec)
  return items.filter((it) =>
    entries.every(([path, test]) => {
      const val = getAtPath(it, path)
      return typeof test === 'function' ? test(val) : val === test
    })
  )
}

// ---- reactive controls ----
const groupPath = ref('company.name')
const cityFilter = ref('')

// ---- derived data ----
const filtered = computed(() => {
  const base = users.value
  if (!cityFilter.value) return base
  return filterBy(base, {
    'address.city': (v) =>
      (v || '').toLowerCase().includes(cityFilter.value.toLowerCase())
  })
})

const grouped = computed(() => groupByPath(filtered.value, groupPath.value))

const counts = computed(() => {
  const out = {}
  for (const [k, arr] of grouped.value) out[k] = arr.length
  return out
})
</script>


<style scoped>
.container {
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.controls label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.controls select,
.controls input {
  padding: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.group-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.group {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.group-header {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.count {
  color: #666;
  font-size: 0.85em;
}

.user-list {
  padding-left: 1rem;
  list-style: disc;
}

.user {
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}
</style>

