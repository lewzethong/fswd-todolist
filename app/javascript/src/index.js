import $ from 'jquery';

import {
  indexTasks,
  postTask,
  deleteTask,
  markActiveTask,
  markCompleteTask
} from "./request.js";

$(document).on('turbolinks:load', function () {
  updateAllTask();

  $("#create-task").on("submit", function (e) {
    e.preventDefault();
    var newTaskContent = $("#new-task").val()
    postTask(newTaskContent, function (response) {
      $("#new-task").val("");
      updateAllTask();
    });
  });

  $(document).on("click", ".remove-button", function () {
    console.log('delete clicked', $(this).data("id"))
    deleteTask($(this).data("id"), function (response) {
      updateAllTask();
    });
  });

  $(document).on("change", ".task-container input", function () {
    if (this.checked) {
      markCompleteTask($(this).data("id"), function (response) {
        updateAllTask();
      });
    } else {
      markActiveTask($(this).data("id"), function (response) {
        updateAllTask();
      });
    }
  });

  //Show active-only tasks
  $(".toggle-active").on("click", function () {
    $(".task").each(function (i, ele) {
      console.log($(this).find("input").prop("checked"), $(this).hide())
      if ($(this).find(".task-container input").prop("checked")) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
    $(this).addClass("selected");
    $(this).siblings().removeClass("selected");
  });

  //Show aompleted-only tasks
  $(".toggle-completed").on("click", function () {
    $(".task").each(function (i, ele) {
      if ($(this).find(".task-container input").prop("checked") !== true) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
    $(this).addClass("selected");
    $(this).siblings().removeClass("selected");
  });

  //Show All tasks
  $(".toggle-all").on("click", function () {
    $(".task").each(function (i, ele) {
      $(this).show();
    });
    $(this).addClass("selected");
    $(this).siblings().removeClass("selected");
  });
});

const updateAllTask = () => {
  indexTasks(function (response) {
    let activeCount = 0
    var htmlString = response.tasks.map(function(task) {
      if (!task.completed) {
        activeCount += 1
      }
      return '<div class="task"><div class="task-container d-flex"><p class="flex-grow-1">' + task.content + '</p><button  class="remove-button mx-2" data-id=' + task.id + '>Delete</button><input style="width: 30px" type="checkbox" data-id="' +
      task.id +
      '"' +
      (task.completed ? 'checked="checked"' : "") +
      '></div></div>';
    });

    $("#todo-list").html(htmlString);
    $('.active-amount-left').html(activeCount)
  });
}


