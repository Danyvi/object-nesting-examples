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


function printValues(obj) {
  for (let key in obj) {
    console.log(`Key: ${key}`);

    let value = obj[key];

    if (typeof value === "object" && value !== null) {
      // Not a flat value → recurse
      printValues(value);
    } else {
      // Flat value → do the action
      console.log(`${key}: ${value}`);
    }
  }
}

const person = {
  name: "Alice",
  address: {
    city: "Paris",
    coordinates: {
      lat: 48.8566,
      lng: 2.3522
    }
  }
};

printValues(person);
</script>

<style>
.container {
  padding: 1rem;
}
</style>
