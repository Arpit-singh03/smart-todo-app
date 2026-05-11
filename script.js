const taskInput = document.getElementById("taskInput");

const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");

const filterButtons =
  document.querySelectorAll(".filter-btn");

const micBtn =
  document.getElementById("micBtn");

const themeToggle =
  document.getElementById("themeToggle");


let tasks =
  JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// SAVE TASKS

function saveTasks() {

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}


// UPDATE TASK COUNT

function updateTaskCount() {

  taskCount.textContent = tasks.length;
}


// RENDER TASKS

function renderTasks() {

  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "completed") {

    filteredTasks =
      tasks.filter(task => task.completed);
  }

  if (currentFilter === "pending") {

    filteredTasks =
      tasks.filter(task => !task.completed);
  }

  filteredTasks.forEach((task) => {

    const actualIndex =
      tasks.indexOf(task);

    const li =
      document.createElement("li");

    li.innerHTML = `

      <span class="task-text ${
        task.completed ? "completed" : ""
      }">
        ${task.text}
      </span>

      <div class="task-buttons">

        <button
          class="complete-btn"
          onclick="toggleTask(${actualIndex})"
        >
          ✔
        </button>

        <button
          class="edit-btn"
          onclick="editTask(${actualIndex})"
        >
          ✏
        </button>

        <button
          class="delete-btn"
          onclick="deleteTask(${actualIndex})"
        >
          ✖
        </button>

      </div>
    `;

    taskList.appendChild(li);
  });

  updateTaskCount();
}


// ADD TASK

function addTask() {

  const text =
    taskInput.value.trim();

  if (text === "") {

    alert("Please enter a task");

    return;
  }

  tasks.push({

    text: text,
    completed: false
  });

  saveTasks();

  renderTasks();

  taskInput.value = "";
}


// TOGGLE TASK

function toggleTask(index) {

  tasks[index].completed =
    !tasks[index].completed;

  saveTasks();

  renderTasks();
}


// DELETE TASK

function deleteTask(index) {

  tasks.splice(index, 1);

  saveTasks();

  renderTasks();
}


// EDIT TASK

function editTask(index) {

  const updatedTask =
    prompt(
      "Edit your task:",
      tasks[index].text
    );

  if (
    updatedTask !== null &&
    updatedTask.trim() !== ""
  ) {

    tasks[index].text =
      updatedTask.trim();

    saveTasks();

    renderTasks();
  }
}


// ADD BUTTON

addBtn.addEventListener(
  "click",
  addTask
);


// ENTER KEY SUPPORT

taskInput.addEventListener(
  "keypress",
  function(event) {

    if (event.key === "Enter") {

      addTask();
    }
  }
);


// FILTER BUTTONS

filterButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      filterButtons.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      currentFilter =
        button.dataset.filter;

      renderTasks();
    }
  );
});


// DARK / LIGHT MODE

themeToggle.addEventListener(
  "click",
  () => {

    document.body.classList.toggle("light");

    if (
      document.body.classList.contains("light")
    ) {

      themeToggle.innerText = "☀️";

    } else {

      themeToggle.innerText = "🌙";
    }
  }
);


// VOICE INPUT

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

if (SpeechRecognition) {

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";

  recognition.continuous = true;

  recognition.interimResults = false;

  recognition.maxAlternatives = 1;

  micBtn.addEventListener("click", () => {

    try {

      recognition.start();

      micBtn.innerText = "Listening...";

    } catch (error) {

      console.log(error);
    }
  });

  recognition.onresult = (event) => {

    const transcript =
      event.results[event.results.length - 1][0].transcript;

    taskInput.value = transcript;

    micBtn.innerText = "🎤";

    recognition.stop();
  };

  recognition.onerror = (event) => {

    console.log(event.error);

    if (event.error === "no-speech") {

      alert("No speech detected. Try speaking louder.");

    } else if (event.error === "not-allowed") {

      alert("Microphone permission denied.");

    } else {

      alert("Voice error: " + event.error);
    }

    micBtn.innerText = "🎤";
  };

  recognition.onend = () => {

    micBtn.innerText = "🎤";
  };

} else {

  alert("Speech Recognition not supported in this browser.");
}
// INITIAL RENDER

renderTasks();