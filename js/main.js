let eventBus = new Vue()

Vue.component('columns', {
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
        },
    },
    template:`
    <div id="columns">
        <div class="column-wrapper">
            <div class="columns-wrapper">
                <div class="column">
                    <newnote></newnote>
                    <h2 class="column-title">Новые</h2>
                    <ul>
                        <li class="notes" v-for="note in column1">
                            <p class="p-title">{{ note.title }}</p>
                            <ul>
                                <li class="tasks" v-for="t in note.subtasks" v-if="t.title != null">
                                    <input @click="newStatus1(note, t)"
                                    class="checkbox" type="checkbox"
                                    :disabled="t.completed">
                                    <p :class="{completed: t.completed}">{{t.title}}</p>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="column">
                    <h2 class="column-title">В процессе</h2>
                    <ul>
                        <li class="notes" v-for="note in column2">
                            <p class="p-title">{{ note.title }}</p>
                            <ul>
                                <li class="tasks" v-for="t in note.subtasks" v-if="t.title != null">
                                    <input @click="newStatus2(note, t)"
                                    class="checkbox" type="checkbox" 
                                    :disabled="t.completed">
                                    <p :class="{completed: t.completed}">{{t.title}}</p>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="column">
                    <h2 class="column-title">Завершенные</h2>
                    <ul>
                        <li class="notes" v-for="note in column3">
                            <p class="p-title">{{ note.title }}</p>
                            <div class="flex-revers">
                                <p>{{ note.date | formatDate }}</p>
                                <ul>
                                    <li class="tasks" v-for="t in note.subtasks" v-if="t.title != null">
                                        <input @click="t.completed = true"
                                        class="checkbox" type="checkbox" 
                                        :disabled="t.completed">
                                        <p :class="{completed: t.completed}">{{t.title}}</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
				<h2 class="error" v-for="error in errors">{{error}}</h2>
    </div>
    `,
    data() {
        return {
            column1: [],
            column2: [],
            column3: [],
            errors: [],
        }
    },
    mounted() {
        this.column1 = JSON.parse(localStorage.getItem("column1")) || [];
        this.column2 = JSON.parse(localStorage.getItem("column2")) || [];
        this.column3 = JSON.parse(localStorage.getItem("column3")) || [];
        eventBus.$on('note-submitted', note => {
                this.errors = []
            if (this.column1.length < 3){
                this.column1.push(note)
                this.saveNote1();
            } else {
								eventBus.$emit('error-in-form', errors)
            }
        })
    },
    watch: {
        column1(newValue) {
            localStorage.setItem("column1", JSON.stringify(newValue));
        },
        column2(newValue) {
            localStorage.setItem("column2", JSON.stringify(newValue));
        },
        column3(newValue) {
            localStorage.setItem("column3", JSON.stringify(newValue));
        }
    },
    methods: {
        saveNote1(){
            localStorage.setItem('column1', JSON.stringify(this.column1));
        },
        saveNote2(){
            localStorage.setItem('column2', JSON.stringify(this.column2));
        },
        saveNote3(){
            localStorage.setItem('column3', JSON.stringify(this.column3));
        },
        newStatus1(note, t) {
            t.completed = true
            let count = 0
            note.status = 0
            this.errors = []
            for (let i = 0; i < 5; i++) {
                if (note.subtasks[i].title != null) {
                    count++
                }
            }
            for (let i = 0; i < count; i++) {
                if (note.subtasks[i].completed === true) {
                    note.status++
                }
            }
            if (note.status/count*100 >= 50 && note.status/count*100 < 100 && this.column2.length < 5) {
                    this.column2.push(note)
                    this.column1.splice(this.column1.indexOf(note), 1)
            } else if (this.column2.length === 5) {
                this.errors.push('Сначала завершите дела из первых двух колонок.')
                if(this.column1.length > 0) {
                    this.column1.forEach(item => {
                        item.subtasks.forEach(item => {
                            item.completed = true;
                        })
                    })
                }
            }
            this.saveNote2();
        },
        newStatus2(note, t) {
            t.completed = true
            let count = 0
            note.status = 0
            for (let i = 0; i < 5; i++) {
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
                this.column2.splice(this.column2.indexOf(note), 1)
                note.date = new Date()
            }
            if(this.column2.length < 5) {
                if(this.column1.length > 0) {
                    this.column1.forEach(item => {
                        item.subtasks.forEach(item => {
                            item.completed = false;
                        })
                    })
                }
            }
            this.saveNote3();
        },
			},
		filters: {
			formatDate: d => d.toLocaleString('ru-RU').replace(',', '').slice(0, -3)
    }		
})

Vue.component('newnote', {
    template: `
    <section>
        <a href="#openModal" class="modallink"></a>
        <div id="openModal" class="modal">
            <div class="modal-dialog">
                <div class="modal-content">
                        <a href="#close" title="Закрыть" class="close">x</a>
                    <div class="modal-header">
                        <h2 class="modal-title">Новая запись</h2>
												<h2 class="error" v-for="error in errors">{{error}}</h2>
                    </div>
                    <div class="modal-body">
                        <form class="addform" @submit.prevent="onSubmit">
                        <p>
                            <label for="title">Название заметки:</label>
                            <input type="text" id="title" placeholder="Название" v-model="title" required>
                        </p>
                        <label for="subtask1">Задания:</label>
                        <input id="subtask1" maxlength="30" placeholder="Задание 1" v-model="subtask1" required>
                        <input id="subtask2" maxlength="30" placeholder="Задание 2" v-model="subtask2" required>
                        <input id="subtask3" maxlength="30" placeholder="Задание 3" v-model="subtask3" required>
                        <input id="subtask4" maxlength="30" placeholder="Задание 4" v-model="subtask4">
                        <input id="subtask5" maxlength="30" placeholder="Задание 5" v-model="subtask5">
                        <button type="submit">Создать</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `,
    data() {
        return {
            title: null,
            subtask1: null,
            subtask2: null,
            subtask3: null,
            subtask4: null,
            subtask5: null,
            errors: [],
        }
    },
		mounted () {
			eventBus.$on('error-in-form', errors => {
				this.errors.push("Вы не можете добавить заметку, пока не выполните новые задания.")
			})
		},
    methods: {
        onSubmit() {
            let note = {
                title: this.title,
                subtasks: [{title: this.subtask1, completed: false},
                            {title: this.subtask2, completed: false},
                            {title: this.subtask3, completed: false},
                            {title: this.subtask4, completed: false},
                            {title: this.subtask5, completed: false}],
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