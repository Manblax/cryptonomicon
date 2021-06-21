<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <!--    <div class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center">-->
    <!--      <svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"-->
    <!--           viewBox="0 0 24 24">-->
    <!--        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>-->
    <!--        <path class="opacity-75" fill="currentColor"-->
    <!--              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>-->
    <!--      </svg>-->
    <!--    </div>-->

    <div class="container">
      <div class="w-full my-4"></div>
      <AddTicker :tickers="tickers" @add-ticker="addTicker"></AddTicker>

      <div class="flex items-end mt-4">
        <div class="w-1/5">
          <label for="filter" class="block text-sm font-medium text-gray-700"
          >Фильтр</label
          >
          <div class="mt-1 relative rounded-md shadow-md">
            <input
                v-model="filter"
                type="text"
                name="filter"
                id="filter"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Фильтр"
            />
          </div>
        </div>
        <button
            :class="{'bg-opacity-50 hover:bg-opacity-50': page <= 1}"
            @click="toPrevPage"
            type="button"
            class="inline-flex items-center ml-10 py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Назад
        </button>
        <button
            :class="{'bg-opacity-50 hover:bg-opacity-50': page >= lastPage}"
            @click="toNextPage"
            type="button"
            class="inline-flex items-center ml-5 py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Вперед
        </button>
        <span class="ml-4">{{ page }}</span>
      </div>

      <template v-if="paginatedTickers.length">
        <hr class="w-full border-t border-gray-600 my-4"/>
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
              v-for="(ticker, index) of paginatedTickers"
              @click="selectTicker(ticker)"
              :class="{'border-4': ticker === selectedTicker}"
              :key="index"
              class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer">
            <div class="px-4 py-5 sm:p-6 text-center">
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
      <Graph v-if="selectedTicker" :ticker="selectedTicker" :graph="graph" @ticker-reset="reset"></Graph>
    </div>
  </div>
</template>

<script>
import {fetchCoinList, subscribeToTicker} from '@/api';
import AddTicker from "./components/AddTicker";
import Graph from "./components/Graph";

export default {
  name: 'App',
  components: {
    AddTicker,
    Graph
  },
  data() {
    return {
      tickers: [],
      selectedTicker: null,
      graph: [],
      filter: '',
      page: 1,
    }
  },
  computed: {
    filteredTickers() {
      return this.filter
          ? this.tickers.filter(ticker => ticker.title.toLowerCase().includes(this.filter.trim().toLowerCase()))
          : [...this.tickers];
    },
    paginatedTickers() {
      return [...this.filteredTickers].splice((this.page - 1) * 6, 6);
    },
    lastPage() {
      return Math.ceil(this.filteredTickers.length / 6);
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      }
    }
  },
  methods: {
    updateTicker(tickerName, newPrice) {
      const foundTicker = this.tickers.find(t => t.title === tickerName);
      foundTicker.price = newPrice;
      if (foundTicker.title === this.selectedTicker?.title) {
        this.graph.push(newPrice);
      }
    },
    deleteTicker(tickerToRemove) {
      this.tickers = this.tickers.filter(ticker => ticker !== tickerToRemove);
      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null;
      }
    },
    async addTicker(newTicker) {
      this.tickers = [...this.tickers, newTicker];
      this.filter = '';
      subscribeToTicker(newTicker.title, (newPrice) => {
        this.updateTicker(newTicker.title, newPrice);
      })
    },
    formatPrice(price) {
      if (price === '-') {
        return price;
      }
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },
    async updateTickers() {
      // if (!this.tickers.length) return;
      // const tickerData = await fetchTickers(this.tickers.map(ticker => ticker.title));
      // this.tickers.forEach(ticker => {
      //   const price = tickerData[ticker.title.toUpperCase()];
      //   ticker.price = price ?? '-';
      // });
    },
    selectTicker(ticker) {
      this.selectedTicker = ticker;
    },
    async saveCoinList() {
      const coinList = JSON.parse(sessionStorage.getItem('coinlist'));
      if (!coinList) {
        sessionStorage.setItem('coinlist', JSON.stringify(await fetchCoinList()));
      }
    },
    initTickerList() {
      const searchParams = new URLSearchParams(window.location.search);
      this.filter = searchParams.get('filter') || this.filter;
      this.page = searchParams.get('page') || this.page;

      this.tickers = JSON.parse(localStorage.getItem('tickerList')) || [];
      this.tickers.forEach(ticker => subscribeToTicker(ticker.title, (newPrice) => {
        this.updateTicker(ticker.title, newPrice);
      }));
    },
    toPrevPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    toNextPage() {
      if (this.page < this.lastPage) {
        this.page++;
      }
    },
    reset() {
      this.selectedTicker = null;
    }
  },
  watch: {
    filter() {
      this.page = 1;
    },
    pageStateOptions(value) {
      window.history.pushState(null, document.title, `${window.location.pathname}?filter=${value.filter}&page=${value.page}`);
    },
    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page--;
      }
    },
    selectedTicker() {
      this.graph = [];
    },

    tickers() {
      localStorage.setItem('tickerList', JSON.stringify(this.tickers));
    }
  },
  created() {
    this.saveCoinList();
    this.initTickerList();
  }
}
</script>
