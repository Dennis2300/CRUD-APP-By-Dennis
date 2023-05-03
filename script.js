"use strict";

const endpoint = "https://fir-database-rest-api-dff4b-default-rtdb.europe-west1.firebasedatabase.app/"
let posts;

window.addEventListener("load", initApp)

function initApp() {
    console.log("website loaded!🥳🎉");
    document.querySelector("#create-post-dialog-button").addEventListener("click", showCreatePost)
    document.querySelector("#form-create-post").addEventListener("submit", createPostClicked)
    document.querySelector("#form-delete-post").addEventListener("submit", deletePostClicked)
    document.querySelector("#form-update-post").addEventListener("submit", updatePostClicked)
    updateDisplayPosts()
}

//---------Create Post----------//
function showCreatePost() {
    console.log("opened create post dialog!");
    document.querySelector("#create-post-dialog").showModal()
}

function createPostClicked() {
    const form = this
    const image = form.image.value
    const location = form.location.value
    const city = form.city.value
    const title = form.title.value
    const name = form.name.value
    const camera = form.camera.value
    createPost(image, location, city, title, name, camera)
    form.reset()
}

async function createPost(image, location, city, title, name, camera) {
    const newPost = {
        image: image,
        location: location,
        city: city,
        title: title,
        name: name,
        camera: camera,
    }
    const json = JSON.stringify(newPost)
    const response = await fetch(`${endpoint}/posts.json`,
        {   method: "POST",
            body: json
    })
    if (response.ok) {
        console.log("Data added to FireBase!");
        updateDisplayPosts()
    }
}

//----------------Shows posts-------------//
async function updateDisplayPosts() {
    posts = await getPosts();
    showPosts(posts);
}

async function getPosts() {
    const response = await fetch(`${endpoint}/posts.json`);
    const data = await response.json();
    const posts = prepareData(data);
    return posts;
}

function showPosts(listOfPosts) {
    document.querySelector("#display-posts").innerHTML = "";

    for (const post of listOfPosts) {
        showPost(post);
    }
}

//----------------------DOM-----------------//
function showPost(postObject) {
    const html = /*html*/ `
        <article class = "grid-item">
            <div id = "polaroid-container">
                <image src = "${postObject.image}"></image>
                <p>${postObject.title}</p>
            </div>
                <br>
            <div id = button-container>
                <button id = "update-button" class = "button">Update</button>
                <button id = "more-info-button" class = "button">More info...</button>
                <button id = "delete-button" class = "button">Delete</button>
            </div>
        </article>
    `;
    document.querySelector("#display-posts").insertAdjacentHTML("beforeend", html);   

//------------Event listener for buttons-------------//
    document.querySelector("#display-posts article:last-child #delete-button").addEventListener("click", deleteClicked)
    document.querySelector("#display-posts article:last-child #update-button").addEventListener("click", updateClicked)
    document.querySelector("#display-posts article:last-child #more-info-button").addEventListener("click", moreInfoClicked)

//-----------More info dialog----------------------//
function moreInfoClicked() {
    console.log("More info dialog opened!");
    document.querySelector("#more-info-picture").src = postObject.image
    document.querySelector("#more-info-title").textContent = postObject.title
    document.querySelector("#more-info-location").textContent = `${postObject.location} - ${postObject.city}`
    document.querySelector("#more-info-camera").textContent = postObject.camera
    document.querySelector("#more-info-name").textContent = postObject.name
    document.querySelector("#more-info-dialog").showModal()
}
//-----------Delete Dialog-------------------------//
function deleteClicked() {
        console.log("Delete dialog opened!");
    document.querySelector("#delete-post-title").textContent = postObject.title
    document.querySelector("#form-delete-post").setAttribute("data-id", postObject.id)
    document.querySelector("#delete-post-dialog").showModal()
    document.querySelector("#cancel-delete").addEventListener("click", closeDeleteConfirmation)
    }
//----------Update Dialog-----------------------//
function updateClicked() {
        console.log("update dialog opened!");
    document.querySelector("#update-post-picture").src = postObject.image
    const updateForm = document.querySelector("#form-update-post")
    updateForm.image.value = postObject.image;
    updateForm.location.value = postObject.location 
    updateForm.title.value = postObject.title;
    updateForm.name.value = postObject.name
    updateForm.camera.value = postObject.camera
    updateForm.setAttribute("data-id", postObject.id);
    document.querySelector("#update-post-dialog").showModal();
    }
}

//------------update post-----------//
function updatePostClicked(event) {
    const form = event.target
    const image = form.image.value
    const location = form.location.value
    const title = form.title.value
    const name = form.name.value
    const camera = form.camera.value
    const id = form.getAttribute("data-id")
updatePost(id, image, location, title, name, camera)
    document.querySelector("#update-post-dialog").close()
}

async function updatePost(id, image, location, title, name, camera) {
    const postToUpdate = {image, location, title, name, camera}
    const json = JSON.stringify(postToUpdate)
    const response = await fetch(`${endpoint}/posts/${id}.json`,
        {   method: "PUT", 
            body: json
            });
    if (response.ok) {
        console.log("Post has been updated!😱");
        updateDisplayPosts()
    }
}

//------------Delete post-----------//
function deletePostClicked(event) {
    const id = event.target.getAttribute("data-id")
    deletePost(id)
}

async function deletePost(id) {
    const response = await fetch(`${endpoint}/posts/${id}.json`,
    {
        method: "DELETE"
        }
    )
    if (response.ok) {
        console.log("Post has been deleted from Firebase!");
        updateDisplayPosts()
    }
}

//------------------Data Converter(objects to array)---------------//
function prepareData(dataObject) {
    const array = [];
    for (const key in dataObject) {
        const object = dataObject[key];
        object.id = key;
        array.push(object);
    }
    return array;
}

//----------------Close delete confirmation-------------------//
function closeDeleteConfirmation() {
    document.querySelector("#delete-post-dialog").close()
}