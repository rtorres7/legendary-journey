<template>
    <div>
            <p class="font-semibold mb-4">Discussion:</p>
            <div v-if="comments.length">
                <div v-for="(comment, index) in comments" :key="index" class="mb-4">
                    <div class="flex space-x-2 text-sm">
                        <p class="font-medium">Jane E. Doe</p>
                        <p class="">25 May 2022</p>
                    </div>
                    <p>(U) {{comment.comment}}</p>
                </div>
            </div>
            <div v-else>
                <p class="italic text-sm">No comments yet</p>
            </div>
        </div>
</template>

<script>
export default {
    props: {
        comments: {
            type: Array,
            required: true
        }
    }
}
</script>

<style lang="scss"></style>