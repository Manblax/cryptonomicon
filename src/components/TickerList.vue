<template>
  <hr class="w-full border-t border-gray-600 my-4"/>
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div
        v-for="(ticker, index) of tickers"
        @click="selectTicker(ticker)"
        :class="{'border-4': ticker === selectedTicker}"
        :key="index"
        class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer">
      <div :class="{'bg-red-100 ': ticker.invalid}" class="px-4 py-5 sm:p-6 text-center">
        <dt class="text-sm font-medium text-gray-500 truncate">
          {{ ticker.title }} - USD
        </dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">
          {{ formatPrice(ticker.price) }}
        </dd>
      </div>
      <div class="w-full border-t border-gray-200"></div>
      <button @click.stop="deleteTicker(ticker)" class="flex items-center justify-center font-medium w-full bg-gray-100
                        px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600
                        hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
      >
        <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#718096"
            aria-hidden="true"
        >
          <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
          ></path>
        </svg>
        Удалить
      </button>
    </div>
  </dl>
  <hr class="w-full border-t border-gray-600 my-4"/>
</template>

<script>
export default {
  name: "TickerList",
  props: {
    tickers: {
      type: Array,
      default() {
        return []
      }
    },
    selectedTicker: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  emits: ['selected-ticker', 'deleted-ticker'],
  methods: {
    selectTicker(ticker) {
      this.$emit('selected-ticker', ticker);
    },
    formatPrice(price) {
      if (price === '-') {
        return price;
      }
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },
    deleteTicker(ticker) {
      this.$emit('deleted-ticker', ticker);
    }
  }
}
</script>

<style scoped>

</style>