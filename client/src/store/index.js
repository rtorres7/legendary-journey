import { createStore } from 'vuex'

export default createStore({
  state: {
    regions: [
      {
          name: "Africa",
          subRegions: [
              { name: "Africa Central" }, { name: "Africa East" }, { name: "Africa North" }, { name: "Africa Southern" }, { name: "Africa West" }
          ],
      },
      {
          name: "Americas",
          subRegions: [
              { name: "Americas Caribbean" }, { name: "Americas Central" }, { name: "Americas North" }, { name: "Americas South" }, { name: "Antarctica" }  
          ],
      },
      {
          name: "Asia",
          subRegions: [
              { name: "Asia East" }, { name: "Asia South" }, { name: "Asia South East" }
          ],
      },
      {
          name: "Eurasia",
          subRegions: [
              { name: "Eurasia Caucasus" }, { name: "Eurasia Central" }, { name: "Eurasia Western and Russia" }
          ],
      },
      {
          name: "Europe",
          subRegions: [
              { name: "Europe Balkans" }, { name: "Europe Central" }, { name: "Europe North" }, { name: "Europe South" }
          ],
      },
      {
          name: "Middle East",
          subRegions: [
              { name: "Middle East" }
          ],
      },
      {
          name: "Oceania",
          subRegions: [
              { name: "Oceania" }
          ],
      },
      {
          name: "Worldwide",
          subRegions: [
              { name: "Worldwide" }
          ]
      },
    ],
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
