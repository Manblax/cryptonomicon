<template>
  <button
      :class="{'bg-opacity-50 hover:bg-opacity-50': current <= 1}"
      @click="toPrevPage"
      type="button"
      class="inline-flex items-center ml-10 py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
  >
    Назад
  </button>
  <button
      :class="{'bg-opacity-50 hover:bg-opacity-50': current >= last}"
      @click="toNextPage"
      type="button"
      class="inline-flex items-center ml-5 py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
  >
    Вперед
  </button>
  <span class="ml-4">{{ current }}</span>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    current: {
      type: Number,
      required: true
    },
    last: {
      type: Number,
      required: true
    }
  },
  emits: ['to-prev-page', 'to-next-page'],
  methods: {
    toPrevPage() {
      this.$emit('to-prev-page');
    },
    toNextPage() {
      this.$emit('to-next-page');
    }
  }
}
</script>
