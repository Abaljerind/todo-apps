/**
 * [
 *    {
 *      id: <int>
 *      task: <string>
 *      timestamp: <string>
 *      isCompleted: <boolean>
 *    }
 * ]
 */

const todos = [];
const RENDER_EVENT = "render-todo";

const SAVED_EVENT = "saved-todo"; // event baru untuk menyimpan todo
const STORAGE_KEY = "TODO_APPS"; // key untuk web storage

// menambahkan function isStorageExist untuk mengecek apakah browser yang digunakan mendukung adanya web browser.
function isStorageExist() /* Boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

// menambahkan event pada halaman document ketika halaman web selesai dimuat / ditampilkan oleh browser.
document.addEventListener("DOMContentLoaded", function () {
  // menambahkan event pada #form berupa 'submit' agar mencegah di refresh halaman websitenya & memanggil function addTodo();
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
});

//   function addTodo()
function addTodo() {
  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;

  const generatedID = generateId();
  const todoObject = generateTodoObject(
    generatedID,
    textTodo,
    timestamp,
    false
  );
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//   function generateId()
function generateId() {
  return +new Date();
  // return Number(new Date); // yang dibaris ini sama artinya dengan yg diatas
}

// function generateTodoObject()
function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
}

//   membuat listener dari RENDER_EVENT dengan menampilkan array todos yang dibuat dari function makeTodo()
document.addEventListener(RENDER_EVENT, function () {
  // console.log(todos);
  const uncompletedTODOList = document.getElementById("todos");
  uncompletedTODOList.innerHTML = "";

  const completedTODOList = document.getElementById("completed-todos");
  // Agar tidak terjadi duplikasi oleh item yang ada di tampilan ketika memperbarui data todo yang ditampilkan, maka hapus terlebih dahulu elemen sebelumnya (yang sudah ditampilkan) dengan perintah innerHTML = “”.
  completedTODOList.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    //   menambahkan filter dengan conditions agar yang ditampilkan hanya todo "yang harus dibaca" saja, dimana status isCompleted nya false dan ketika buttonCheck di klik maka isCompleted nya akan berubah menjadi true dan todoElement akan dipindahkan ke div "yang sudah dilakukan"
    if (!todoItem.isCompleted) {
      uncompletedTODOList.append(todoElement);
    } else {
      // ketika checkButton diklik maka status isCompleted berubah menjadi true dan merender ulang elemen html dengan memindahkan todo ke bagian / rak / div "yang sudah dilakukan"
      completedTODOList.append(todoElement);
    }
  }
});

//   function makeTodo untuk menghasilkan sebuah item untuk mengisi container todos
function makeTodo(todoObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);

  // menambahkan fungsi check, uncheck / undo dan menghapus todo.
  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });

    container.append(checkButton);
  }

  return container;
}

// menambahkan function removeTaskFromCompleted() agar bisa menghapus todo yang sudah selesai dilakukan
function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// menambahkan function findTodoIndex() untuk mendapatkan nilai index dari elemen id pada array todos
function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }

  return -1;
}

// menambahkan function undoTaskFromCompleted() agar bisa mengembalikan todo ke kondisi "yang harus dilakukan" dari kondisi "yang sudah dilakukan"
function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;
  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// menambahkan function addTaskToCompleted() agar bisa memindahkan task todo yang sudah selesai
function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT)); // panggil event RENDER_EVENT untuk memperbarui data yang ditampilkan.
  saveData();
}

// menambahkan function findTodo() untuk mencari todo dengan ID yang sesuai pada array "todos".
function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

// menambahkan function saveData() untuk menyimpan todos ke local storage browser.
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
