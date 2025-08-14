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
/**
 * Safe nested access: getAtPath(obj, "a.b.c")
 * avoids “cannot read property of undefined.”
 * In real apps, consider caching compiled paths for speed if hot.
 *
 * EXAMPLE
 *
 * const user = { address: { city: "Tokyo" } }
 * getAtPath(user, "address.city") // → "Tokyo"
 * getAtPath(user, "company.name") // → undefined (safe, no error)
 */
function getAtPath(obj, path) {
  // Take the string path like "address.city" and split it into an array: ["address", "city"]
  return path
    .split('.')
    // Use reduce to go step-by-step deeper into the object
    .reduce((acc, key) => {
      // If acc is NOT null/undefined, go one level deeper: acc[key]
      // If acc is null/undefined, stop and return undefined
      return acc && acc[key]
    }, obj) // Start with the original object
}


/**
 * Example
 * const users = [
  { name: "A", address: { city: "Tokyo" } },
  { name: "B", address: { city: "Osaka" } },
  { name: "C", address: { city: "Tokyo" } }
]


groupByPath(users, "address.city")
// → Map {
//   "Tokyo" => [ { name: "A", ...}, { name: "C", ...} ],
//   "Osaka" => [ { name: "B", ...} ]
// }

 */
function groupByPath(items, path) {
  // Create a Map to store groups (key = group name, value = array of items in that group)
  const out = new Map()

  // Loop over each object in the items array
  for (const item of items) {
    // Get the value of the nested property (example: "address.city")
    const rawKey = getAtPath(item, path)

    // If value is null or undefined, use "—" as a placeholder key
    const key = rawKey == null ? '—' : String(rawKey)

    // If we don't yet have an array for this key in the Map, create one
    if (!out.has(key)) {
      out.set(key, [])
    }

    // Add the current item to the correct group array
    out.get(key).push(item)
  }

  // Return the Map containing all groups
  return out
}


/**
 *
 Example 1 — exact value filter

 const users = [
  { name: "A", address: { city: "Tokyo" } },
  { name: "B", address: { city: "Osaka" } }
]

// Only keep users whose city is "Tokyo"
filterBy(users, { "address.city": "Tokyo" })
// → [ { name: "A", address: { city: "Tokyo" } } ]

Example 2 — function filter

// Only keep users whose city starts with "O"
filterBy(users, { "address.city": (v) => v.startsWith("O") })
// → [ { name: "B", address: { city: "Osaka" } } ]

 */
function filterBy(items, spec) {
  // Convert the spec object into an array of [path, test] pairs
  // Example: { "address.city": "Tokyo", "company.name": (v)=>v.startsWith("D") }
  // becomes [ ["address.city", "Tokyo"], ["company.name", function...] ]
  const entries = Object.entries(spec)

  // Return a new array containing only items that match all conditions in spec
  return items.filter((it) =>
    // Check every [path, test] pair for the current item
    entries.every(([path, test]) => {
      // Get the value at the nested path (e.g., "address.city") for the current item
      const val = getAtPath(it, path)

      // If test is a function, call it with the value (true means match)
      // If test is NOT a function, compare the value directly (strict equality)
      return typeof test === 'function'
        ? test(val)
        : val === test
    })
  )
}


// ---- reactive controls ----
const groupPath = ref('company.name')
const cityFilter = ref('')

// ---- derived data ----
// A computed property that returns only the users matching the city filter
const filtered = computed(() => {
  // Start with all users
  const base = users.value

  // If no filter text is entered, return all users unchanged
  if (!cityFilter.value) return base

  // Otherwise, filter users by city
  // The filter spec says: "address.city" must include the text in cityFilter (case-insensitive)
  return filterBy(base, {
    'address.city': (v) =>
      // v is the city string (e.g., "Tokyo")
      // Convert both city and filter text to lowercase for case-insensitive match
      (v || '').toLowerCase().includes(cityFilter.value.toLowerCase())
  })
})


// A computed property that groups the filtered users by the selected group path
const grouped = computed(() => {
  // Take the filtered users and group them by the value of groupPath
  // Example: if groupPath is "company.name", it will group users by their company name
  return groupByPath(filtered.value, groupPath.value)
})



// optional: counts per group (also computed)
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

