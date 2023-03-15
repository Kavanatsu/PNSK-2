

Vue.component('columns', {
    template:`
    <div class="columns">
        <div class="columns-wrapper">
            <div class="column">
            <ul>
                <li class="notes">
                <ul>
                    <li class="tasks">
                    <input class="checkbox" type="checkbox">
                    </li>
                </ul>
                </li>
            </ul>
            </div>
            <div class="column">
            <ul>
                <li class="notes">
                <ul>
                    <li class="tasks">
                    <input class="checkbox" type="checkbox">
                    </li>
                </ul>
                </li>
            </ul>
            </div>
            <div class="column">
            <ul>
                <li class="notes">
                <ul>
                    <li class="tasks">
                    <input class="checkbox" type="checkbox">
                    </li>
                </ul>
                </li>
            </ul>
            </div>
        </div>
    </div>
    `,
    data () {
        return {
            column1: [],
            column2: [],
            column3: [],
            errors: []
        }
    },
    props: {
        card: {
            title: {
                type: Text,
                required: true
            },
            subtasks: {
                type: Array,
                required: true,
                completed: {
                    type: Boolean,
                    required: true
                }
            },
            date: {
                type: Date,
                required: false
            },
            status: {
                type: Number,
                required: true
            },
            errors: {
                type: Array,
                required: false
            }
        }
    },
    methods: {

    }
})

Vue.component('newnote', {
    template: `
    
    `,
})


let app = new Vue({
    el: '#app',
    data: {

    }
})