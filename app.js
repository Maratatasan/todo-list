//
// Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list"); // the <ul> where added items will go
const filterOption = document.querySelector(".filter-todo"); // it is the select element, with option of filtering;

// Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
// when the + button is clicked it will call - addTodo function
todoButton.addEventListener("click", addTodo);
// .todoList is the <ul> tag in the .todo-container
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);

// Functions
function addTodo(event) {
  // Prevent form from submitting
  // this will stop things from disappearing immediately
  event.preventDefault();

  // Todo div
  const todoDiv = document.createElement("div");
  // add class to the div
  todoDiv.classList.add("todo");

  //create li
  const newTodo = document.createElement("li");
  //   get value from input
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  //   put the li in the div
  todoDiv.appendChild(newTodo);

  //ADD TODO TO LOCAL STORAGE
  saveLocalTodos(todoInput.value);

  //button for a complete task
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);

  //button trash
  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);

  //append to list (ul)
  todoList.appendChild(todoDiv);
  //clear input text box(equal it to an empty string)
  todoInput.value = "";
}

function deleteCheck(event) {
  //event.target will return the tag that you click on, check with console.log(event.target);
  //ie if click on trash - <button class="trash-btn"><i class="fas fa-trash"></i></button>

  const item = event.target;

  //delete todo
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    //add animation class
    todo.classList.add("fall");
    // //CALL FUNCTION TO DELETE FROM LOCAL STORAGE
    removeLocelTodos(todo);
    // //special event listener that waits for the animation to finish
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  //check mark
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    //the class .completed is created in styles.css
    //the line below will add and remove class completed to todo when clicked
    todo.classList.toggle("completed");

    //remembers and alters the check marks
    const target = todo.innerText;

    let todos = JSON.parse(localStorage.getItem("todos"));
    findTarget(todos, target);
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function filterTodo(e) {
  //get the <ul> with the <li> elements
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    //will target values of <options> in the filter list
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break; // remember to put break after cases to stop the switch
      case "completed":
        //check if the todo has a class completed
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex"; //display flex is selected because that is the current setting in the css
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (todo.classList.contains("completed")) {
          todo.style.display = "none";
        } else {
          todo.style.display = "flex";
        }
        break;
    }
  });
}

//save list to local storage
function saveLocalTodos(todo) {
  //check if something is already saved in local storage
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  //local storage can hold arrays
  todos.push([todo, 0]);
  // the line below is how you save it to local storage - has to be string
  localStorage.setItem("todos", JSON.stringify(todos));
}

// retrieve info from local storage
function getTodos() {
  let todos;
  //check if something is already saved in local storage
  //get info if it is there
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  // will go over each element in the local storage array and present it in apps format
  todos.forEach(function (todo) {
    // Todo div
    const todoDiv = document.createElement("div");
    // add class to the div
    todoDiv.classList.add("todo");
    if (todo[1] > 0) {
      todoDiv.classList.add("completed");
    }

    //create li
    const newTodo = document.createElement("li");
    //   get value from input
    newTodo.innerText = todo[0];
    newTodo.classList.add("todo-item");
    //   put the li in the div
    todoDiv.appendChild(newTodo);

    //button for a complete task
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //button trash
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    //append to list (ul)
    todoList.appendChild(todoDiv);
  });
}

//delete things from local storage
function removeLocelTodos(todo) {
  //check if something is already saved in local storage
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    //if info was there put it in a variable
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;

  todos.forEach((item) => {
    if (item.includes(todoIndex)) {
      todos.splice(todos.indexOf(item), 1);
    }
  });

  // // save the amended list to local storage
  localStorage.setItem("todos", JSON.stringify(todos));
}

// change numbers from 1 to 0 or 0 to 1 in item array
function changeNumber(item) {
  switch (item[1]) {
    case 0:
      item[1] = 1;

      break;
    case 1:
      item[1] = 0;
      break;
  }
}

//will make changes in todos
function findTarget(array, target) {
  array.forEach((item) => {
    if (item.includes(target)) {
      changeNumber(item);
    }
  });
}
