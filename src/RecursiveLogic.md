
# How Do Our Cards Show Nested Data? (Beginner Guide)


## 1. What Are We Building?
Imagine you have a box of toys. Some toys are just one piece (like a ball), and some toys are sets (like a box of LEGO bricks). Sometimes, inside a box, you find another box with more toys!

We want to show all these toys using **cards** on the screen. Each card shows:
- The name of the toy or box
- What's inside

If what's inside is another box, we open it and show more cards inside. This is called **recursion**—the card can show itself again and again for every box inside a box!

---


## 2. App.vue: The Starter
`App.vue` is like the person who opens the first box. It says:
1. "Hey RecursiveCard, here is the first big box of toys. Start showing them!"
2. It gives a title like "Root" (which means the very beginning).
3. After that, RecursiveCard does all the work of opening boxes and showing toys.

So, App.vue just starts the process!

---


## 3. RecursiveCard.vue: The Card That Can Open Boxes
This is the smart card that knows how to show any toy or box you give it.

It checks:
### Step 1: Is it a simple thing?
- If yes, just show the name and value (like "Ball: Red").

### Step 2: Is it an object (a box with named toys inside)?
- Look inside:
	- If it has simple things, show them as "name: value".
	- If it has more boxes or lists, make a new RecursiveCard for each one.

### Step 3: Is it a list (an array of toys or boxes)?
- For each item in the list:
	- If it's simple, show it directly.
	- If it's a box or another list, make a new RecursiveCard for it.

---


## 4. Why Use Recursion?
Because sometimes boxes have boxes inside them, and you don't know how many layers deep it goes! The RecursiveCard can keep opening boxes inside boxes, no matter how deep, until everything is shown.

**Example:**

Losses 2022
	- totals
		- total_incurred: $1,000,000
		- total_paid: $500,000
	- losses
		- Item 1: claimant_name: Jane Doe, ...
		- Item 2: claimant_name: John Doe, ...

---


## 5. Quick Recap
- **App.vue**: Starts by giving the first box of data to RecursiveCard.
- **RecursiveCard.vue**:
	1. If it's simple, show it.
	2. If it's a box (object), show what's inside (and open more cards for boxes inside).
	3. If it's a list (array), show each item (and open more cards for boxes or lists inside).

It's like opening mystery boxes: some have candy (simple), some have more boxes (complex). We keep opening until we find everything!
