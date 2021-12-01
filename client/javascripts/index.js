// Overview - When the page loads, we are able to fill out form and submit

// When? Load
// Cause Of Trigger - submit
// Trigger'd Effect - format data to send to backend, re-list the blogs

/** Globals **/
const baseUrl = 'http://localhost:3001';
let blogs = [];

/** Node Getters **/
const blogList = () => document.getElementById('blogs')
const blogForm = () => document.getElementById('blog-form');

/** Event Listeners **/
const attachFormEvent = () => {
  blogForm().addEventListener('submit', createBlog);
}

/** Event Handlers **/
const createBlog = async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value
  const content = document.getElementById('content').value

  const strongParams = {
    blog: {
      title,
      content
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

/** Renderers **/
const renderBlogs = () => {
  resetList();
  blogs.forEach(blog => renderBlog(blog));
}

const renderBlog = (blog) => {
  const div = document.createElement('div');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');

  h3.innerText = blog.title;
  h3.style.color = 'blue';

  p.innerText = blog.content;
  p.style.color = 'green';

  div.appendChild(h3);
  div.appendChild(p);

  blogList().appendChild(div);
}

/** Everything Else **/

const loadBlogs = async () => {
  const response = await fetch(baseUrl + '/blogs');
  blogs = await response.json();

  renderBlogs();
}

const resetList = () => {
  blogList.innerHTML = ''
}

/** SETUP **/

document.addEventListener('DOMContentLoaded', () => {
  loadBlogs();
  attachFormEvent();
})