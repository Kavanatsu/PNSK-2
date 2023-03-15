let eventBus = new Vue()

Vue.component('columns', {
    template:`
    <div class="columns">
    <h2 class="error" v-for="error in errors">{{ error }}</h2>
    <newnote></newnote>
        <div class="columns-wrapper">
            <div class="column">
            <ul>
                <li class="notes" v-for="note in column1">
                <p class="p-title">{{ note.title }}</p>
                <ul>
                    <li class="tasks" v-for="t in note.subtasks" v-if="t.title != null">
                    <input class="checkbox" type="checkbox" @click="newStatus1(note, t)" :disabled="t.completed">
                    <p :class="{completed: t.completed}">{{ t.title }}</p>
                    </li>
                </ul>
                </li>
            </ul>
            </div>
            <div class="column">
            <ul>
                <li class="notes" v-for="note in column2">
                <p class="p-title">{{ note.title }}</p>
                <ul>
                    <li class="tasks" v-for="t in note.subtasks" v-if="t.title != null">
                    <input class="checkbox" type="checkbox" @click="newStatus2(note, t)" :disabled="t.completed">
                    <p :class="{completed: t.completed}">{{ t.title }}</p>
                    </li>
                </ul>
                </li>
            </ul>
            </div>
            <div class="column">
            <ul>
                <li class="notes" v-for="note in column3">
                <p class="p-title">{{ note.title }}</p>
                <div class="flex-revers">
                <p>{{ note.date }}</p>
                <ul>
                    <li class="tasks" v-for="t in note.subtasks" v-if="t.title != null">
                    <input class="checkbox" type="checkbox" @click="t.completed = true" :disabled="t.completed">
                    <p :class="{completed: t.completed}">{{ t.title }}</p>
                    </li>
                </ul>
                </div>
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
    mounted () {
        eventBus.$on('note-submitted', note => {
            this.errors = []
            if (this.column1.length < 3){
                this.column1.push(note)
            } else {
                this.errors.push("Вы не можете доваить новую заметку, пока не выполните остальные.")
            }
        })
    },
    props: {
        note: {
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
        newStatus1(note, t) {
            t.completed = true
            let count = 0
            note.status = 0
            this.errors = []
            for (let i = 0; i < 5; i++){
                if (note.subtasks[i].title != null) {
                    count++
                }
            }
            for (let i = 0; i < count; i++) {
                if (note.subtasks[i].completed === true) {
                    note.status++
                }
            }
            if (note.status/count*100 >= 50 && note.status/count*100 && this.column2.length < 5) {
                this.column2.push(note)
                this.column1.splice(this.column1.indexOf(note), 1)
            } else if (this.column2.length === 5) {
                this.errors.push("Выполните предыдущие задания чтобы добавить новую заметку")
                if (this.column1.length > 0) {
                    this.column1.forEach(item => {
                        item.subtasks.forEach(item => {
                            item.completed = true
                        })
                    })
                }
            }
        },
        newStatus2(note, t) {
            t.completed = true
            let count = 0
            note.status = 0
            for (let i = 0; i < 5; i++){
                if (note.subtasks[i].title != null) {
                    count++
                }
            }
            for (let i = 0; i < count; i++) {
                if (note.subtasks[i].completed === true) {
                    note.status++
                }
            }
            if (note.status/count*100 === 100) {
                this.column3.push(note)
                this.column2.splice(this.column1.indexOf(note), 1)
                note.date = new Date()
            }
            if (this.column2.length < 5) {
                if (this.column1.length > 0) {
                    this.column1.forEach(item => {
                        item.subtasks.forEach(item => {
                            item.completed = false
                        })
                    })
                }
            }
        }
    }
})

Vue.component('newnote', {
    template: `
    <section>
        <a href="#openModal">Создать заметку</a>
        <div id="openModal" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Новая запись</h2>
                    <a href="#close" title="close" class="close">x</a>
                </div>
                <div class="modal-body">
                    <form class="addform" @submit.prevent="onSubmit">
                    <p>
                        <label for="title">Название заметки</label>
                        <input type="text" id="title" v-model="title" required>
                    </p>
                    <input id="subtask1" maxlength="30" v-model="subtask1" required>
                    <input id="subtask2" maxlength="30" v-model="subtask2" required>
                    <input id="subtask3" maxlength="30" v-model="subtask3" required>
                    <input id="subtask4" maxlength="30" v-model="subtask4">
                    <input id="subtask5" maxlength="30" v-model="subtask5">
                    <button type="submit">Добавить заметку</button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    </section>
    `,
    data () {
        return {
            title: null,
            subtask1: null,
            subtask2: null,
            subtask3: null,
            subtask4: null,
            subtask5: null,
            errors: []
        }
    },
    methods: {
        onSubmit () {
            let note = {
                title: this.title,
                subtasks: [{title: this,subtask1, completed: false},
                            {title: this,subtask2, completed: false},
                            {title: this,subtask3, completed: false},
                            {title: this,subtask4, completed: false},
                            {title: this,subtask5, completed: false},],
                date: null,
                status: 0
            }
            eventBus.$emit('note-submitted', note)
            this.title = null
            this.subtask1 = null
            this.subtask2 = null
            this.subtask3 = null
            this.subtask4 = null
            this.subtask5 = null
        }
    }
})


let app = new Vue({
    el: '#app',
    data: {
        name: 'Заметки'
    }
})