<template>
    <form @submit.prevent="onSubmit"
        class="
            bg-slate-50 dark:bg-slate-800 energy:bg-gray-600 
            mb-8
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
            maxlength="4000"
            required 
            rows="2"
            v-model="comment">
        </textarea>
        <input id="acknowledgement" class="cursor-pointer" required type="checkbox" v-model="acknowledgement">
        <label for="acknowledgement" class="p-2 text-sm">I acknowledge that my comment is professional in nature and adheres to the commenting guidelines.</label>
        <select id="classification" class="block bg-transparent border-b-2 border-slate-400 cursor-pointer mt-8 text-sm" required v-model="classification">
            <option value="" disabled hidden>Please Classify...</option>
            <option value="U" class="dark:text-black energy:text-black">Unclassified</option>
            <option value="notU" class="dark:text-black energy:text-black">Not Unclassified</option>
        </select>
        <input type="submit" value="Submit Comment"
            class="
                border-2 border-slate-400 
                cursor-pointer 
                hover:bg-slate-200 dark:hover:bg-slate-700/80 energy:hover:bg-gray-700
                mt-8 
                p-2 
                rounded-md 
                shadow-md 
                text-sm
            "
        >
    </form>
</template>

<script>
    export default {
        data() {
            return {
                comment: '',
                acknowledgement: false,
                classification: '',
            }
        },
        methods: {
            onSubmit() {
                 if (this.comment === '' || !this.acknowledgement || this.classification === '') {
                     return
                }
                
                let productComment = {
                    comment: this.comment,
                    acknowledgement: this.acknowledgement,
                    classification: this.classification
                }
                this.$emit('comment-submitted', productComment)

                this.comment = ''
                this.acknowledgement = false
                this.classification = ''
            }
        }
    }
</script>

<style lang="scss">
</style>
