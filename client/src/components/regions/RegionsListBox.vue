<template>
    <div>
        <label for="country" class="font-normal">Select your country from the map or the dropdown</label>
        <Listbox v-model="selectedCountry" class="w-1/3">
            <div class="relative mt-1">
                <ListboxButton
                    class="
                        flex
                        items-center
                        relative
                        w-full
                        p-2
                        text-left
                        capitalize
                        bg-white
                        dark:bg-slate-600
                        energy:bg-gray-600
                        rounded-lg
                        shadow-md
                        cursor-default
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-opacity-75
                        focus-visible:ring-white
                        focus-visible:ring-offset-orange-300
                        focus-visible:ring-offset-2
                        focus-visible:border-indigo-500
                    "
                >
                    <span class="block truncate">{{ selectedCountry.name }}</span>
                    <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <SelectorIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                </ListboxButton>
                 <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                >
                    <ListboxOptions
                        class="
                            absolute
                            w-full
                            py-1
                            mt-1
                            overflow-auto
                            text-base
                            bg-white
                            dark:bg-slate-600
                            energy:bg-slate-600
                            rounded-md
                            shadow-lg
                            max-h-60
                            ring-1 ring-black ring-opacity-5
                            focus:outline-none
                            z-10
                        "
                    >
                        <ListboxOption
                            v-for="country in countries"
                            :key="country"
                            :value="country"
                            class="
                                capitalize
                                px-2
                                py-1
                                cursor-pointer
                                hover:bg-slate-200/80
                                dark:hover:bg-slate-600/80
                                energy:hover:bg-gray-600/80
                                text-sm
                            "
                            >
                            {{ country.name }}
                        </ListboxOption>
                    </ListboxOptions>
                </transition>
            </div>
        </Listbox>
    </div>
</template>

<script>
import { ref } from 'vue';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
import { SelectorIcon } from "@heroicons/vue/solid";

const countries = [
    {name: "Afghanistan"},
    {name: "Albania"},
    {name: "Algeria"},
    {name: "Andorra"},
    {name: "Angola"},
    {name: "Antigua and Barbuda"},
    {name: "Argentina"},
    {name: "Armenia"},
    {name: "Australia"},
    {name: "Austria"},
    {name: "Azerbaijan"},   
    {name: "The Bahamas"},
    {name: "Bahrain"},
    {name: "Bangladesh"},
    {name: "Barbados"},
    {name: "Belarus"},
    {name: "Belgium"},
    {name: "Belize"},
    {name: "Benin"},
    {name: "Bhutan"},
    {name: "Bolivia"},
    {name: "Bosnia and Herzegovina"},
    {name: "Botswana"},
    {name: "Brazil"},
    {name: "Brunei"},
    {name: "Bulgaria"},
    {name: "Burkina Faso"},
    {name: "Burundi"},
    {name: "Cabo Verde"},
    {name: "Cambodia"},
    {name: "Cameroon"},
    {name: "Canada"},
    {name: "Central African Republic"},
    {name: "Chad"},
    {name: "Chile"},
    {name: "China"},
    {name: "Colombia"},
    {name: "Comoros"},
    {name: "Congo, Democratic Republic of the"},
    {name: "Congo, Republic of the"},
    {name: "Costa Rica"},
    {name: "Côte d’Ivoire"},
    {name: "Croatia"},
    {name: "Cuba"},
    {name: "Cyprus"},
    {name: "Czech Republic"},
    {name: "Denmark"},
    {name: "Djibouti"},
    {name: "Dominica"},
    {name: "Dominican Republic"},
    {name: "East Timor (Timor-Leste)"},
    {name: "Ecuador"},
    {name: "Egypt"},
    {name: "El Salvador"},
    {name: "Equatorial Guinea"},
    {name: "Eritrea"},
    {name: "Estonia"},
    {name: "Eswatini"},
    {name: "Ethiopia"},
    {name: "Fiji"},
    {name: "Finland"},
    {name: "France"},
    {name: "Gabon"},
    {name: "The Gambia"},
    {name: "Georgia"},
    {name: "Germany"},
    {name: "Ghana"},
    {name: "Greece"},
    {name: "Grenada"},
    {name: "Guatemala"},
    {name: "Guinea"},
    {name: "Guinea-Bissau"},
    {name: "Guyana"},
    {name: "Haiti"},
    {name: "Honduras"},
    {name: "Hungary"},
    {name: "Iceland"},
    {name: "India"},
    {name: "Indonesia"},
    {name: "Iran"},
    {name: "Iraq"},
    {name: "Ireland"},
    {name: "Israel"},
    {name: "Italy"},
    {name: "Jamaica"},
    {name: "Japan"},
    {name: "Jordan"},
    {name: "Kazakhstan"},
    {name: "Kenya"},
    {name: "Kiribati"},
    {name: "Korea, North"},
    {name: "Korea, South"},
    {name: "Kosovo"},
    {name: "Kuwait"},
    {name: "Kyrgyzstan"},
    {name: "Laos"},
    {name: "Latvia"},
    {name: "Lebanon"},
    {name: "Lesotho"},
    {name: "Liberia"},
    {name: "Libya"},
    {name: "Liechtenstein"},
    {name: "Lithuania"},
    {name: "Luxembourg"},
    {name: "Madagascar"},
    {name: "Malawi"},
    {name: "Malaysia"},
    {name: "Maldives"},
    {name: "Mali"},
    {name: "Malta"},
    {name: "Marshall Islands"},
    {name: "Mauritania"},
    {name: "Mauritius"},
    {name: "Mexico"},
    {name: "Micronesia, Federated States of"},
    {name: "Moldova"},
    {name: "Monaco"},
    {name: "Mongolia"},
    {name: "Montenegro"},
    {name: "Morocco"},
    {name: "Mozambique"},
    {name: "Myanmar (Burma)"},
    {name: "Namibia"},
    {name: "Nauru"},
    {name: "Nepal"},
    {name: "Netherlands"},
    {name: "New Zealand"},
    {name: "Nicaragua"},
    {name: "Niger"},
    {name: "Nigeria"},
    {name: "North Macedonia"},
    {name: "Norway"},
    {name: "Oman"},
    {name: "Pakistan"},
    {name: "Palau"},
    {name: "Panama"},
    {name: "Papua New Guinea"},
    {name: "Paraguay"},
    {name: "Peru"},
    {name: "Philippines"},
    {name: "Poland"},
    {name: "Portugal"},
    {name: "Qatar"},
    {name: "Romania"},
    {name: "Russia"},
    {name: "Rwanda"},
    {name: "Saint Kitts and Nevis"},
    {name: "Saint Lucia"},
    {name: "Saint Vincent and the Grenadines"},
    {name: "Samoa"},
    {name: "San Marino"},
    {name: "Sao Tome and Principe"},
    {name: "Saudi Arabia"},
    {name: "Senegal"},
    {name: "Serbia"},
    {name: "Seychelles"},
    {name: "Sierra Leone"},
    {name: "Singapore"},
    {name: "Slovakia"},
    {name: "Slovenia"},
    {name: "Solomon Islands"},
    {name: "Somalia"},
    {name: "South Africa"},
    {name: "Spain"},
    {name: "Sri Lanka"},
    {name: "Sudan"},
    {name: "Sudan, South"},
    {name: "Suriname"},
    {name: "Sweden"},
    {name: "Switzerland"},
    {name: "Syria"},
    {name: "Taiwan"},
    {name: "Tajikistan"},
    {name: "Tanzania"},
    {name: "Thailand"},
    {name: "Togo"},
    {name: "Tonga"},
    {name: "Trinidad and Tobago"},
    {name: "Tunisia"},
    {name: "Turkey"},
    {name: "Turkmenistan"},
    {name: "Tuvalu"},
    {name: "Uganda"},
    {name: "Ukraine"},
    {name: "United Arab Emirates"},
    {name: "United Kingdom"},
    {name: "United States"},
    {name: "Uruguay"},
    {name: "Uzbekistan"},
    {name: "Vanuatu"},
    {name: "Vatican City"},
    {name: "Venezuela"},
    {name: "Vietnam"},
    {name: "Yemen"},
    {name: "Zambia"},
    {name: "Zimbabwe"},
];

export default {
    components: {
        Listbox,
        ListboxButton,
        ListboxOptions,
        ListboxOption,
        // CheckIcon,
        SelectorIcon,
    },
   setup() {
    const selectedCountry = ref(countries[0]);
    
    return {
        countries,
        selectedCountry,
    };
   },
}
</script>

<style scoped lang="scss">

</style>
