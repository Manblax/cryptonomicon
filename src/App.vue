<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <Spin v-if="loader"/>

    <div class="container">
      <div class="w-full my-4"></div>
      <AddTicker :tickers="tickers" @add-ticker="addTicker"/>

      <div class="flex items-end mt-4">
        <Filter v-model:filter="filter"/>
        <Pagination @to-prev-page="toPrevPage" @to-next-page="toNextPage" :current="page" :last="lastPage"/>
      </div>

      <TickerList
          v-if="paginatedTickers.length"
          :tickers="paginatedTickers"
          :selectedTicker="selectedTicker"
          @selected-ticker="selectTicker"
          @deleted-ticker="deleteTicker"
      />
      <Graph v-if="selectedTicker" :ticker="selectedTicker" :graph="graph" @ticker-reset="reset"/>
    </div>
  </div>
</template>

<script>
import {fetchCoinList, tickerApi} from '@/api';
import AddTicker from "./components/AddTicker";
import Graph from "./components/Graph";
import Spin from "./components/Spin";
import TickerList from "./components/TickerList";
import Pagination from "./components/Pagination";
import Filter from "./components/Filter";

export default {
  name: 'App',
  components: {
    AddTicker,
    Graph,
    Spin,
    TickerList,
    Pagination,
    Filter
  },
  data() {
    return {
      tickers: [],
      selectedTicker: null,
      graph: [],
      filter: '',
      page: 1,
      loader: false,
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
      tickerApi.unsubscribeFromTicker(tickerToRemove.name);
    },
    async addTicker(newTicker) {
      this.tickers = [...this.tickers, newTicker];
      this.filter = '';
      tickerApi.subscribeToTicker(newTicker.title, (newPrice) => {
        this.updateTicker(newTicker.title, newPrice);
      })
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
      this.page = parseInt(searchParams.get('page') || this.page);

      this.loader = true;
      this.tickers = JSON.parse(localStorage.getItem('tickerList')) || [];
      this.loader = false;

      this.tickers.forEach(ticker => tickerApi.subscribeToTicker(ticker.title, (newPrice) => {
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
