// modalebis shignit arsebuli elementebi
const modal = document.querySelector("#form_modal");
const modalOpenerBtn = document.querySelector("#modal_opener");
const modalCloserBtn = document.querySelector("#form_closer_btn");

// modal form
const signupForm = document.querySelector("#user-signup-form");
// modal form inputs
const user_id = document.querySelector("#user_id");
const user_name = document.querySelector("#name");
const email = document.querySelector("#email");
const gender = document.querySelector("#gender");
const street = document.querySelector("#street");
const city = document.querySelector("#city");
const mobile_number = document.querySelector("#mobile_number");

// modalis gagheba
modalOpenerBtn.addEventListener("click", () => {
  modal.classList.add("show");
});

// modalis daxurva
modalCloserBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  signupForm.reset();
});

async function getUsers() {
  try {
    const response = await fetch("http://api.kesho.me/v1/user-test/index");
    const users = await response.json();

    await renderUsers(users);
  } catch (e) {
    console.log("Error - ", e);
  }
}

getUsers();

async function renderUsers(usersArray) {
  const tableBody = document.querySelector("#table_body");
  let tableBodyContent = "";
  for (let index = 0; index < usersArray.length; index++) {
    const user = usersArray[index];
    tableBodyContent =
      tableBodyContent +
      `<tr>
        <td>${user.id}</td>
        <td>${user.user_name}</td>
        <td>${user.email}</td>
        <td>${user.gender}</td>
        <td>${user.street}</td>
        <td>${user.city}</td>
        <td>${user.mobile}</td>
        <td>
            <button class="btn_edit" data-user-id="${user.id}">Edit</button>
            <button class="btn_delete" data-user-id="${user.id}">Delete</button>
        </td>
      <tr>
      `;
  }

  tableBody.innerHTML = tableBodyContent;
  userActions();
}

function userActions() {
  const allDeleteBtns = document.querySelectorAll(".btn_delete");
  const allEditBtns = document.querySelectorAll(".btn_edit");

  for (let index = 0; index < allDeleteBtns.length; index++) {
    const button = allDeleteBtns[index];
    button.addEventListener("click", async (e) => {
      await deleteUser(e.target.dataset.userId);
    });
  }

  for (let index = 0; index < allEditBtns.length; index++) {
    const button = allEditBtns[index];
    button.addEventListener("click", async (e) => {
      await getUser(e.target.dataset.userId);
    });
  }
}

async function getUser(userId) {
  try {
    const response = await fetch(`http://api.kesho.me/v1/user-test/view?id=${userId}`);
    const user = await response.json();

    user_id.value = user.id;
    user_name.value = user.user_name;
    email.value = user.email;
    gender.value = user.gender;
    street.value = user.street;
    city.value = user.city;
    mobile_number.value = user.mobile;

    modal.classList.add("show");
  } catch (e) {
    console.log("Error - ", e);
  }
}

async function deleteUser(userId) {
  try {
    await fetch(`http://api.kesho.me/v1/user-test/delete?id=${userId}`, {
      method: "delete",
      body: {},
      headers: { "Content-Type": "application/json" },
    });
    await getUsers();
  } catch (e) {
    console.log("Error - ", e);
  }
}

async function createUser(userData) {
  try {
    const response = await fetch("http://api.kesho.me/v1/user-test/create", {
      method: "post",
      body: JSON.stringify(userData),
      headers: { "Content-Type": "application/json" },
    });
    const createdUser = await response.json();
    await getUsers();
    return createdUser;
  } catch (e) {
    console.log("Error - ", e);
  }
}

async function updateUser(userObject) {
  try {
    const response = await fetch(`http://api.kesho.me/v1/user-test/update?id=${userObject.id}`, {
      method: "post",
      body: JSON.stringify(userObject),
      headers: { "Content-Type": "application/json" },
    });
    const updatedUser = await response.json();
    await getUsers();
    return updatedUser;
  } catch (e) {
    console.log("Error - ", e);
  }
}

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userData = {
    id: user_id.value,
    user_name: user_name.value,
    email: email.value,
    gender: gender.value,
    street: street.value,
    city: city.value,
    mobile: mobile_number.value,
  };

  if (user_id.value === "") {
    await createUser(userData);
  } else {
    await updateUser(userData);
  }
  modal.classList.remove("show");
  signupForm.reset();
});
