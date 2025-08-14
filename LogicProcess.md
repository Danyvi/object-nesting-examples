# Frontend Data Transformation Checklist
*(Grouping & Filtering from Backend Responses)*

## 1. Understand the Shape of the Data
Before coding:
- What’s the **top-level structure**? (array of objects? object of objects?)
- What **nested properties** exist? (e.g., `address.city`, `company.name`)
- Are there **arrays inside objects** or **objects inside arrays**?
- Which parts of the data are **useful for the UI** and which can be ignored?

---

## 2. Define the User Experience (Start with the End Goal)
- What does the user need to **see**?
- How do they need to **interact**? (select, search, expand, sort, filter)
- Does **grouping** make sense visually? (e.g., “Users grouped by city”)

---

## 3. Choose Grouping & Filtering Rules
- Which property should I **group by**?
  - Direct: `company.name`
  - Nested: `address.city`
- Do I need **multiple levels** of grouping? (e.g., city → company)
- What **filters** should apply? (text search, dropdown, date range)
- Will grouping be **static** (done once) or **dynamic** (updates on filters)?

💡 *At this stage, imagine `grouped` or `filtered` already exist — helpers like `groupByPath`/`filterBy` come later.*

---

## 4. Decide the Data Flow
- Filter first, then group? *(common)*
- Group first, then filter? *(if you want empty groups preserved)*
- Does this happen on the **frontend** or **backend**?
- Will it happen **once** or on **every user interaction**?

---

## 5. Write Reusable Helpers
- `getAtPath(obj, path)` → safely access nested values
- `groupByPath(data, path)` → group items
- `filterBy(data, criteria)` → filter items

---

## 6. Connect Helpers to State & UI
- Where does the **raw API data** live? (`users`)
- Where does the **filtered data** live? (`filteredUsers`)
- Where does the **grouped data** live? (`groupedUsers`)
- When do they update? (watchers, computed props, events)

---

## 7. Test with Edge Cases
- Missing grouping key → `undefined` groups
- Empty array
- Duplicate group names
- Filter + grouping interaction

---

## Visual Flow Diagram

```plaintext
       [ UI / Design Goal ]
                │
                ▼
      Decide Grouping & Filtering
                │
                ▼
     (Imagine helpers already exist)
                │
                ▼
   Build helpers: getAtPath, groupByPath, filterBy
                │
                ▼
   Connect helpers to state & reactivity
                │
                ▼
       Render grouped/filtered data
