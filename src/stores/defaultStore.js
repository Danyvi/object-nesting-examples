import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDefaultStore = defineStore('defaultStore', () => {

  const users = ref([
    {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz",
      address: {
        street: "Kulas Light",
        suite: "Apt. 556",
        city: "Gwenborough",
        zipcode: "92998-3874",
        geo: { lat: "-37.3159", lng: "81.1496" }
      },
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org",
      company: {
        name: "Romaguera-Crona",
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "harness real-time e-markets"
      }
    },
    {
      id: 2,
      name: "Ervin Howell",
      username: "Antonette",
      email: "Shanna@melissa.tv",
      address: {
        street: "Victor Plains",
        suite: "Suite 879",
        city: "Wisokyburgh",
        zipcode: "90566-7771",
        geo: { lat: "-43.9509", lng: "-34.4618" }
      },
      phone: "010-692-6593 x09125",
      website: "anastasia.net",
      company: {
        name: "Deckow-Crist",
        catchPhrase: "Proactive didactic contingency",
        bs: "synergize scalable supply-chains"
      }
    },
    {
      id: 3,
      name: "Clementine Bauch",
      username: "Samantha",
      email: "Nathan@yesenia.net",
      address: {
        street: "Douglas Extension",
        suite: "Suite 8470",
        city: "South Elvis",
        zipcode: "51902-6430",
        geo: { lat: "-14.3990", lng: "-120.7896" }
      },
      phone: "1-463-123-4447",
      website: "ramiro.info",
      company: {
        name: "Romaguera-Jacobson",
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "transition on uhd-mgmt"
      }
    }
  ])

  const responseBody = ref({
  "response_body": {
    "Document type": "Email body",
    "Insured": {
      "name": "John Doe",
      "policy_no": "1234567890",
      "insured_no": "9876543210"
    },
    "Line of business": {
      "line_of_business": "Life Insurance"
    },
    "Losses 2022": {
      "totals": {
        "total_incurred": "$1,000,000",
        "total_paid": "$500,000"
      },
      "losses": [
        {
          "claimant_name": "Jane Doe",
          "loss_date": "2022-12-31",
          "total_incurred": "$500,000",
          "total_paid":"$200,000"
        },
        {
          "claimant_name": "John Doe",
          "loss_date": "2023-12-31",
          "total_incurred": "$730,000",
          "total_paid":"$120,000"
        }
      ]
    }
  }
})
  // const responseBody = ref({
  //   "response_body": {
  //     name: "Alice",
  //     address: {
  //       city: "Paris",
  //       coordinates: {
  //         lat: 48.8566,
  //         lng: 2.3522
  //       }
  //     }
  //   }
  // });

  return {
    users,
    responseBody
  }
})


