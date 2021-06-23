<template>
  <div class="w-1/5">
    <label for="filter" class="block text-sm font-medium text-gray-700"
    >Фильтр</label
    >
    <div class="mt-1 relative rounded-md shadow-md">
      <input
          @input="handleInput"
          :value="filter"
          type="text"
          name="filter"
          id="filter"
          class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
          placeholder="Фильтр"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Filter",
  props: {
    filter: {
      type: String,
      default: '',
    }
  },
  emits: ['update:filter'],
  methods: {
    handleInput(event) {
      this.$emit('update:filter', event.target.value);
    }
  }
}
</script>
