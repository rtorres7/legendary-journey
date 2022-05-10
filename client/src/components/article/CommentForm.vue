<template>
    <div>
        <div v-if="comments.length > 0" class="bg-slate-50 dark:bg-slate-800 energy:bg-gray-600 rounded-lg shadow-md p-4">
            <p class="font-bold mb-4">Discussion</p>
            <div v-for="comment in comments" :key="comment" class="mb-4">
                <p class="">Jane Doe</p>
                <p>(U) {{comment}}</p>
            </div>
        </div>
        <form 
            class="
                bg-slate-50 dark:bg-slate-800 energy:bg-gray-600 
                mt-8
                p-4 pt-8 
                rounded-lg 
                shadow-md 
                text-left
            "
        >
            <label for="comment" class="inline-block font-bold pb-4">Leave a Comment:</label>
            <textarea  
                id="comment"
                class="
                    bg-transparent 
                    border-b-2 border-slate-400 
                    block
                    mb-4
                    p-2
                    w-full
                " 
                required 
                rows="2"
                v-model="comment">
            </textarea>
            <input id="acknowledgement" class="cursor-pointer" required type="checkbox" v-model="acknowledgement">
            <label for="acknowledgement" class="p-2 text-sm">I acknowledge that my comment is professional in nature and adheres to the commenting guidelines.</label>
            <select id="classification" class="block bg-transparent border-b-2 border-slate-400 cursor-pointer mt-8 text-sm" required v-model="classification">
                <option value="" disabled hidden selected>Please Classify...</option>
                <option value="U">Unclassified</option>
                <option value="notU">Not Unclassified</option>
            </select>
            <input type="submit" @click="onSubmit" class="border-2 border-slate-400 cursor-pointer mt-8 p-2 rounded-md shadow-md text-sm">
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                comment: '',
                acknowledgement: false,
                classification: '',
                comments: []
            }
        },
        methods: {
            onSubmit() {
                if (this.comment != '' && this.acknowledgement) {
                    this.comments.push(this.comment)
                    this.comment = ''
                    this.acknowledgement = false
                    this.classification = ''
                }
            }
        }
    }
</script>

<style lang="scss">
</style>
