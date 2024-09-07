const container = document.querySelector(".details");
const userName = document.querySelector("#username");
const userSurname = document.querySelector("#usersurname");
const CREATE_USER = document.querySelector("#createuser");
const BaseURL = "http://localhost:3001";
let isEditing = false;
let editingUserId = null;

const getApiWithCallback = async (endpoint, callback) => {
  let response = await fetch(`${BaseURL}/${endpoint}`).then((res) =>
    res.json()
  );
  callback(response);
};

const deletaApiDataById = async (endpoint, id) => {
  let response = await fetch(`${BaseURL}/${endpoint}/${id}`, {
    method: "DELETE",
  });
  return response;
};

const postApiData = async (endpoint, data) => {
  let response = fetch(`${BaseURL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
};

const updateApiData = async (endpoint, data, id) => {
  let response = fetch(`${BaseURL}/${endpoint}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

const createParagraph = (text) => {
  const p = document.createElement("p");
  p.textContent = text;
  return p;
};

const createButton = (text, onClick) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
};

getApiWithCallback("data", (data) => {
  console.log(data);
  data.map((item) => {
    const userDiv = document.createElement("div");
    userDiv.classList.add("user-item");

    const usernameParagraph = createParagraph(item.username);
    const usersurnameParagraph = createParagraph(item.usersurname);

    const deleteButton = createButton("Delete", () => {
      deletaApiDataById("data", item.id);
    });

    const editButton = createButton("Edit", () => {
      (userName.value = item.username),
        (userSurname.value = item.usersurname),
        (isEditing = true),
        (editingUserId = item.id);
    });

    userDiv.appendChild(usernameParagraph);
    userDiv.appendChild(usersurnameParagraph);
    userDiv.appendChild(deleteButton);
    userDiv.appendChild(editButton);

    container.appendChild(userDiv);
  });
});

CREATE_USER &&
  CREATE_USER.addEventListener("click", (e) => {
    e.preventDefault();

    const userData = {
      username: userName.value,
      usersurname: userSurname.value,
    };

    if (isEditing) {
      updateApiData("data", userData, editingUserId).then(() => {
        console.log("User edited succesfully");
        (isEditing = false), (editingUserId = null);
      });
    } else {
      postApiData("data", userData).then(() => {
        console.log("User created successfully");
      });
    }
  });
