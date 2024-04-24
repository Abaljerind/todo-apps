// menambahkan event pada halaman document ketika halaman web selesai dimuat / ditampilkan oleh browser.
document.addEventListener("DOMContentLoaded", function () {
  const todos = [];
  const RENDER_EVENT = "render-todo";

  // menambahkan event pada #form berupa 'submit' agar mencegah di refresh halaman websitenya & memanggil function addTodo();
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
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

  //   membuat listener dari RENDER_EVENT dengan menampilkan array todos menggunakan console.log();
  document.addEventListener(RENDER_EVENT, function () {
    console.log(todos);
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

    return container;
  }
});
