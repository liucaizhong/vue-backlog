var store = {
  save (k,v) {
    localStorage.setItem(k, JSON.stringify(v));
  },
  fetch (k) {
    return JSON.parse(localStorage.getItem(k)) || [];
  }
};

var list = store.fetch('backlog');

// var list = [{
//   title: '吃饭睡觉',
//   isChecked: true
// },{
//   title: '打豆豆',
//   isChecked: false
// }];

var filter = {
  'all': (list) => {
    return list;
  },
  'unfinished': (list) => {
    return list.filter((item)=>{
      return !item.isChecked;
    })
  },
  'finished': (list) => {
    return list.filter((item)=>{
      return item.isChecked;
    })
  }
};

var vm = new Vue({
  el: '.container',
  data: {
    list: list,
    todo: '',
    editTodos: '',
    beforeTitle: '',
    visibility: 'all'
  },
  computed: {
    unfinished: function() {
      return this.list.filter(function(v) {
        return !v.isChecked;
      }).length;
    },
    filterList: function() {
      if(filter[this.visibility]) {
        return filter[this.visibility](this.list);
      }else {
        this.visibility = 'all';
        return this.list;
      }
    }
  },
  watch: {
    list: {
      handler: function(val) {
        store.save('backlog', val)
      },
      deep: true
    }
  },
  directives:{
    'focus': {
      update (el, binding) {
        if(binding.value) {
          el.focus();
        }
      }
    }
  },
  methods: {
    addTodo () {
      // console.log(event);
      this.list.push({
        title: this.todo,
        isChecked: false
      });

      this.todo = '';
    },
    editTodo (todo) {
      this.beforeTitle = todo.title;
      this.editTodos = todo;
    },
    canclEdit (todo) {
      todo.title = this.beforeTitle;
      this.editTodos = '';
    },
    editDone (todo) {
      this.editTodos = '';
    },
    delTask (todo) {
      let i = this.list.indexOf(todo);
      this.list.splice(i,1);
    }
  }
});

function watchHashChange() {
  let hash = window.location.hash.slice(1);
  vm.visibility = hash;
}

watchHashChange();

window.addEventListener('hashchange', watchHashChange);
