// Overview - When the page loads and the button exist, we should be able to click the delete button in order to delete the blog

// When? Button exist
// Cause Of Trigger - click
// Trigger'd Effect - delete blog

/** Globals **/
const baseUrl = 'http://localhost:3001';
let blogs = [];
let editedBlog = null;

/** Node Getters **/
const blogList = () => document.getElementById('blogs');
const blogForm = () => document.getElementById('blog-form');
const getTitle = () => document.getElementById('title');
const getContent = () => document.getElementById('content');
const blogFormSubmit = () => document.getElementById('submit-blog');
const formHeader = () => document.getElementById('form-header');


/** Event Listeners **/
const attachFormEvent = () => {
  blogForm().addEventListener('submit', createBlog);
}

/** Event Handlers **/
const createBlog = async (e) => {
  e.preventDefault();

  const strongParams = {
    blog: {
      title: getTitle().value,
      content: getContent().value
    }
  }

  const response = await fetch(baseUrl + "/blogs", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(strongParams)
  });

  const blog = await response.json();
  console.log(blog);
  blogs.push(blog);
  renderBlog(blog);
  document.getElementById('title').value = ""
  document.getElementById('content').value = ""
  
}

const deleteBlog = async blog => {
  await fetch(baseUrl + '/blogs/' + blog.id, {
    method: "DELETE"
  });
  blogs = blogs.filter(b => b.id !== blog.id);
  renderBlogs();
}

const editBlog = blog => {
  blogForm().removeEventListener('submit', createBlog);
  getTitle().value = blog.title;
  getContent().value = blog.content;
  blogFormSubmit().value = 'update blog';
  formHeader().innerText = 'Edit Blog';
  updateBlog = updateBlog.bind(blog);
  blogForm().addEventListener('submit', updateBlog)
}

async function updateBlog(e) {
  e.preventDefault();

  console.log(this);

  const strongParams = {
    blog: {
      title: getTitle().value,
      content: getContent().value
    }
  }

  const response = await fetch(baseUrl + `/blogs/${ this.id }`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(strongParams)
  })

  const newBlog = await response.json();
  const index = blogs.indexOf(this)
  blogs[index] = newBlog

  blogForm().removeEventListener('submit', updateBlog)
  formHeader().innerText = "Create Blog";
  getTitle().value = '';
  getContent().value = '';
  blogFormSubmit().value = "create blog";
  blogForm().addEventListener('submit', createBlog);

  renderBlogs();
}

/** Renderers **/
const renderBlogs = () => {
  resetList();
  blogs.forEach(blog => renderBlog(blog));
}

const renderBlog = (blog) => {
  const div = document.createElement('div');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');
  const deleteButton = document.createElement('button');
  const editButton = document.createElement('button');

  h3.innerText = blog.title;
  h3.style.color = 'blue';

  p.innerText = blog.content;
  p.style.color = 'green';

  deleteButton.innerText = 'delete blog';
  deleteButton.addEventListener('click', e => deleteBlog(blog))

  editButton.innerText = 'edit blog';
  editButton.addEventListener('click', e => editBlog(blog))

  div.appendChild(h3);
  div.appendChild(p);
  div.appendChild(deleteButton);
  div.appendChild(editButton);

  blogList().appendChild(div);
}

/** Everything Else **/

const loadBlogs = async () => {
  const response = await fetch(baseUrl + '/blogs');
  blogs = await response.json()

  renderBlogs();
}

const resetList = () => {
  blogList().innerHTML = ''
}

/** SETUP **/

document.addEventListener('DOMContentLoaded', () => {
  loadBlogs();
  attachFormEvent();
})