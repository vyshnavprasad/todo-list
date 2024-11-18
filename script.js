const submitButton = document.querySelector("#submit");
const dateEl = document.querySelector("#date");
const timeEl = document.querySelector("#time");
const textEl = document.querySelector("#task");
const searchEl = document.querySelector("#search")

//On load set Date-Time to current values
let date = new Date();
dateEl.value = `${date.getFullYear()}-${date.getMonth().toString().padStart(2,'0')}-${date.getDay().toString().padStart(2,'0')}`;
timeEl.value = `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;

//Retreive Tasks from Local-storage
let tasks = JSON.parse(localStorage.getItem("task-list")) ?? [];

const dueTasks =  document.querySelector("#due-tasks")
const upcomingTasks =  document.querySelector("#upcoming-tasks")
const renderTasks = () => {

  const nowRaw = new Date;
  const now = `${nowRaw.getFullYear()}-${nowRaw.getMonth().toString().padStart(2,'0')}-${nowRaw.getDay().toString().padStart(2,'0')}${nowRaw.getHours().toString().padStart(2,'0')}:${nowRaw.getMinutes().toString().padStart(2,'0')}`;
  
  dueTasks.innerHTML = "";
  upcomingTasks.innerHTML = "";
  
  
  let i = 0;
  tasks.forEach(task => {
    const taskEl = document.createElement("div");
    taskEl.dataset.taskId = i++;
    if(task["task"].includes(searchEl.value)) {
      taskEl.classList.add("task");

      // Add Edit an Delete Button
      const editEl = document.createElement("button")
      editEl.classList.add("edt");
      editEl.innerText = "Edit";
      editEl.addEventListener("click", () => {
        dateEl.value = tasks[editEl.parentElement.dataset.taskId]["date"];
        timeEl.value = tasks[editEl.parentElement.dataset.taskId]["time"];
        textEl.value = tasks[editEl.parentElement.dataset.taskId]["task"];
        tasks.splice(editEl.parentElement.dataset.taskId, 1)
        renderTasks();
      })

      const deleteEl = document.createElement("button")
      deleteEl.classList.add("del");
      deleteEl.innerText = "Delete";
      deleteEl.addEventListener("click", () => {
        tasks.splice(editEl.parentElement.dataset.taskId, 1);
        localStorage.setItem("task-list", JSON.stringify(tasks));
        renderTasks(tasks);
      })

      // Text-values of Elements
      const h3El = document.createElement("h3")
      const h4El = document.createElement("h4")
      const pEl = document.createElement("p")
      h3El.innerText = task["date"];
      h4El.innerText = task["time"];
      pEl.innerText = task["task"];

      taskEl.append(h3El, h4El, editEl, deleteEl, pEl)

      if((task["date"]+task["time"]) < now){
        dueTasks.appendChild(taskEl);
      }else {
        upcomingTasks.appendChild(taskEl);
      }
    }
  })
  console.log(JSON.parse(localStorage.getItem("task-list")));
}
renderTasks();

//Sort and Store values in Local-storage on submit
submitButton.addEventListener("click", () => {
  tasks.push({ date: dateEl.value, time: timeEl.value, task: textEl.value});
  tasks = tasks.sort((a, b) => `${a["date"]}${a["time"]}`.localeCompare(`${b["date"]}${b["time"]}`));
  textEl.value = '';
  searchEl.value = '';
  renderTasks();
  localStorage.setItem("task-list", JSON.stringify(tasks));
});

//Refresh Task-list on search input
searchEl.oninput = () => renderTasks();
