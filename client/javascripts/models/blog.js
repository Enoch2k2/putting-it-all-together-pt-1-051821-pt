class Blog {
  static all = []

  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    Blog.all.push(this);
  }

  render() {
    const div = document.createElement('div');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');

    h3.innerText = this.title;
    h3.style.color = 'blue';

    p.innerText = this.content;
    p.style.color = 'green';

    deleteButton.innerText = 'delete blog';
    deleteButton.addEventListener('click', e => deleteBlog(this))

    editButton.innerText = 'edit blog';
    editButton.addEventListener('click', e => editBlog(this))

    div.appendChild(h3);
    div.appendChild(p);
    div.appendChild(deleteButton);
    div.appendChild(editButton);

    blogList().appendChild(div);
  }

  static renderAll() {
    resetList();
    Blog.all.forEach(blog => blog.render());
  }

  static async loadAll() {
    const blogs = await Api.get('/blogs');

    blogs.forEach(blog => new Blog(blog))

    Blog.renderAll();
  }

  static async create() {
    e.preventDefault();

    const strongParams = {
      blog: {
        title: getTitle().value,
        content: getContent().value
      }
    }
    
    const data = await Api.post('/blogs', strongParams);
    
    const blogObj = new Blog(data)

    blogObj.render();
    document.getElementById('title').value = ""
    document.getElementById('content').value = ""
  }
}