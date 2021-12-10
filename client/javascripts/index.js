/** Event Handlers **/

const deleteBlog = async blog => {
  await fetch(Api.baseUrl + '/blogs/' + blog.id, {
    method: "DELETE"
  });
  Blog.all = Blog.all.filter(b => b.id !== blog.id);
  Blog.renderAll();
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

  const response = await fetch(Api.baseUrl + `/blogs/${ this.id }`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(strongParams)
  })

  const newBlog = await response.json();
  const index = Blog.all.indexOf(this)
  Blog.all[index] = new Blog(newBlog)

  blogForm().removeEventListener('submit', updateBlog)
  formHeader().innerText = "Create Blog";
  getTitle().value = '';
  getContent().value = '';
  blogFormSubmit().value = "create blog";
  blogForm().addEventListener('submit', createBlog);

  Blog.renderAll();
}

/** Everything Else **/

const resetList = () => {
  blogList().innerHTML = ''
}

/** SETUP **/

document.addEventListener('DOMContentLoaded', () => {
  Blog.loadAll();
  attachFormEvent();
})