document.addEventListener("DOMContentLoaded", () => {
  let courses = JSON.parse(localStorage.getItem("coursesData")) || [];

  const coursesList = document.querySelector(".courses-list");
  const courseSelect = document.getElementById("course-select");
  const lecturesList = document.querySelector(".lectures-list");

  const saveData = () => {
    localStorage.setItem("coursesData", JSON.stringify(courses));
    renderCourses();
    if (courseSelect.value !== "") renderLectures(courseSelect.value);
  };

  const renderCourses = () => {
    coursesList.innerHTML = "";
    courseSelect.innerHTML = "<option value=''>Select Course</option>";

    courses.forEach((course, index) => {
      const div = document.createElement("div");
      div.classList.add("item-card");
      div.innerHTML = `
        <span><strong>${course.title}</strong> — ${course.description}</span>
        <div>
          <button class="edit-course" data-index="${index}">Edit</button>
          <button class="delete-course" data-index="${index}">Delete</button>
        </div>
      `;
      coursesList.appendChild(div);

      // Add to dropdown
      const option = document.createElement("option");
      option.value = index;
      option.textContent = course.title;
      courseSelect.appendChild(option);
    });

    // Handle Delete
    document.querySelectorAll(".delete-course").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.index;
        if (confirm("Delete this course?")) {
          courses.splice(idx, 1);
          saveData();
        }
      });
    });

    // Handle Edit
    document.querySelectorAll(".edit-course").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.index;
        const c = courses[idx];

        const newTitle = prompt("Edit course title:", c.title);
        if (newTitle === null) return;

        const newDesc = prompt("Edit course description:", c.description);
        if (newDesc === null) return;

        const newImg = prompt("Edit image URL:", c.image || "");

        c.title = newTitle.trim() || c.title;
        c.description = newDesc.trim() || c.description;
        c.image = newImg.trim() || c.image;

        saveData();
      });
    });
  };

  const renderLectures = (courseIndex) => {
    lecturesList.innerHTML = "";
    if (courseIndex === "") return;

    const course = courses[courseIndex];
    course.lectures.forEach((lec, idx) => {
      const div = document.createElement("div");
      div.classList.add("item-card");
      div.innerHTML = `
        <span>${lec.title}</span>
        <div>
          <button class="edit-lecture" data-idx="${idx}">Edit</button>
          <button class="delete-lecture" data-idx="${idx}">Delete</button>
        </div>
      `;
      lecturesList.appendChild(div);
    });

    // Delete Lecture
    document.querySelectorAll(".delete-lecture").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.idx;
        if (confirm("Delete this lecture?")) {
          course.lectures.splice(idx, 1);
          saveData();
          renderLectures(courseIndex);
        }
      });
    });

    // Edit Lecture
    document.querySelectorAll(".edit-lecture").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.idx;
        const lec = course.lectures[idx];

        const newTitle = prompt("Edit lecture title:", lec.title);
        if (newTitle === null) return;

        const newLink = prompt("Edit lecture YouTube link:", lec.link);
        if (newLink === null) return;

        lec.title = newTitle.trim() || lec.title;
        lec.link = newLink.trim() || lec.link;

        saveData();
        renderLectures(courseIndex);
      });
    });
  };

  // Add Course
  document.getElementById("add-course-btn").addEventListener("click", () => {
    const title = document.getElementById("new-course-title").value.trim();
    const desc = document.getElementById("new-course-desc").value.trim();
    const img = document.getElementById("new-course-img").value.trim();

    if (!title || !desc) return alert("Enter title and description");

    courses.push({
      title,
      description: desc,
      image: img || "/images/alphabet.png",
      lectures: [],
    });

    document.getElementById("new-course-title").value = "";
    document.getElementById("new-course-desc").value = "";
    document.getElementById("new-course-img").value = "";

    saveData();
  });

  // Add Lecture
  document.getElementById("add-lecture-btn").addEventListener("click", () => {
    const courseIndex = courseSelect.value;
    const title = document.getElementById("lecture-title").value.trim();
    const link = document.getElementById("lecture-link").value.trim();
    if (courseIndex === "" || !title || !link)
      return alert("Please select course and fill all fields");

    courses[courseIndex].lectures.push({ title, link });
    document.getElementById("lecture-title").value = "";
    document.getElementById("lecture-link").value = "";
    saveData();
    renderLectures(courseIndex);
  });

  courseSelect.addEventListener("change", (e) =>
    renderLectures(e.target.value)
  );

  // Initialize
  renderCourses();
});
