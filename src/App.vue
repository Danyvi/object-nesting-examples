<template>
  <section class="container">
    <!-- Controls for grouping and filtering -->
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

    <!-- Render groups -->
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

/**
 ------------------------------------------------
 getAtPath(obj, path)
------------------------------------------------
 Safely read a nested property using a string path.
 Example: getAtPath(user, "address.city") → "Tokyo"
 If any level is missing, returns undefined (no error).
*/

function getAtPath(obj, path) {
  return path
    .split('.') // turn "address.city" into ["address", "city"]
    .reduce((acc, key) => {
      // acc is the current nested object/value
      // If acc exists, move one step deeper with acc[key]
      // If acc is null/undefined, stay undefined (safe access)
      return acc && acc[key]
    }, obj) // Start from the whole object
}


/**
------------------------------------------------
 groupByPath(items, path)
------------------------------------------------
 Group an array of objects by the value of a nested property.
 Example: groupByPath(users, "address.city") → Map { "Tokyo" => [...], "Osaka" => [...] }

 */
function groupByPath(items, path) {
  const out = new Map() // Map to store groups: key = group name, value = array of objects

  for (const item of items) {
    // Get the value of the nested property
    const rawKey = getAtPath(item, path)

    // If value is null or undefined, use a placeholder key "—"
    const key = rawKey == null ? '—' : String(rawKey)

    // If the group doesn't exist yet, create an empty array for it
    if (!out.has(key)) {
      out.set(key, [])
    }

    // Add the current item to the correct group array
    out.get(key).push(item)
  }

  return out // Map of groups
}


/**
------------------------------------------------
 filterBy(items, spec)
------------------------------------------------
 Filter an array of objects based on one or more conditions.
 spec is an object where:
   - key = nested path (e.g., "address.city")
   - value = exact match value OR a function that returns true/false

 */
function filterBy(items, spec) {
  // Turn the spec object into an array of [path, test] pairs
  const entries = Object.entries(spec)

  // Keep only the items that match ALL conditions in the spec
  return items.filter((it) =>
    entries.every(([path, test]) => {
      // Get the value at the given nested path
      const val = getAtPath(it, path)

      // If test is a function, call it with the value
      // If test is not a function, check exact equality
      return typeof test === 'function' ? test(val) : val === test
    })
  )
}


// ---- reactive controls ----
const groupPath = ref('company.name') // default grouping: company name
const cityFilter = ref('') // empty means no filter

// ---- derived data ----
/**
 ------------------------------------------------
 Computed: filtered
------------------------------------------------
 Returns only the users whose city matches the filter text (case-insensitive).
 If no filter text, returns all users.
 */
const filtered = computed(() => {
  const base = users.value // start with all users

  // If no city filter text, return all users
  if (!cityFilter.value) return base

  // Filter users by city, using filterBy with a function condition
  return filterBy(base, {
    'address.city': (v) =>
      (v || '').toLowerCase().includes(cityFilter.value.toLowerCase())
  })
})


/**
------------------------------------------------
 Computed: grouped
------------------------------------------------
 Groups the filtered users by the selected path (e.g., company.name or address.city)
 */
const grouped = computed(() => {
  // Take the filtered users and group them by the value of groupPath
  // Example: if groupPath is "company.name", it will group users by their company name
  return groupByPath(filtered.value, groupPath.value)
})



// optional: counts per group (also computed)
/**
------------------------------------------------
 Computed: counts
------------------------------------------------
 A quick helper to see how many items are in each group.
 */
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

