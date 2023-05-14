import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Button} from 'react-bootstrap';

import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';

const firebaseConfig = {
  apiKey: "AIzaSyBmoTztiF13IR6QZLPQXzaPKDhLhu0wg94",
  authDomain: "myapp-49e09.firebaseapp.com",
  databaseURL: "https://myapp-49e09-default-rtdb.firebaseio.com",
  projectId: "myapp-49e09",
  storageBucket: "myapp-49e09.appspot.com",
  messagingSenderId: "588814649337",
  appId: "1:588814649337:web:d2ecb3f5f1b3df40331f28"
};

firebase.initializeApp(firebaseConfig);

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    post: '',
  });
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const dbRef = firebase.database().ref('myapp');
    dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const postsArray = Object.entries(data).map(([id, post]) => ({
          id,
          ...post,
        }));
        setPosts(postsArray.reverse()); // Reverse the order of posts
      } else {
        setPosts([]);
      }
    });
  }, []);
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPost((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePost = () => {
    const dbRef = firebase.database().ref('myapp');
    dbRef.push(newPost);
    setNewPost({ post: '' });
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setNewPost({ post: post.post });
  };

  const handleUpdate = () => {
    const dbRef = firebase.database().ref(`myapp/${editingPost.id}`);
    dbRef.update(newPost);
    setEditingPost(null);
    setNewPost({ post: '' });
  };

  const handleDelete = (post) => {
    const dbRef = firebase.database().ref(`myapp/${post.id}`);
    dbRef.remove();
  };


  return (
    <div className="class-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand navfont fw-bold ms-4">The Blog</a>
      </nav>

      <div className="bg-image p-5 text-white imahe sy">
        <h1 className="fs-6 mt-5 pt-5 text-center">WELCOME TO</h1>
        <h1 className="display-2 fw-bold tnr text-center">THE BLOG</h1>
        <p className="fw-bold mb-5 text-center">POST ANYTHING HERE</p>
        <form onSubmit={handlePost}>
          <div className="row ps-5 justify-content-center">
            <div className="col-auto mt-5">
              <img
                className="rounded sayz"
                src="https://i1.sndcdn.com/avatars-000699879415-rcm4zc-t240x240.jpg"
                alt="Image"
              />
            </div>
            <div className="col-sm-7 me-5 mt-5">
            <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="What's on your mind?"
            name="post"
            value={newPost.post} // Corrected value
            onChange={handleInputChange}
          ></textarea>
            </div>
          </div>
          <div>
          {!editingPost ? (
            <Button variant="dark" className="mt-3 me-6 float-end px-3" onClick={handlePost}>
              Post
            </Button>
          ) : (
            <Button variant="dark" className="mt-3 me-6 float-end px-3" onClick={handleUpdate}>
              Update
            </Button>
          )}
          </div>
        </form>

        <br/><br/><br/><br/><br/>

        <div className="col-sm-7 mx-auto mt-5">
        {posts.map((post) => (
            <div className="card shadow mt-5 bg-secondary" key={post.id}>
              <div className="card-body">
                <div className="card-title fw-bold">Anonymous</div>
                <div className="card-text">
                  <p>{post.post}</p>
                  <hr/>
                  <button className="btn btn-dark me-2" onClick={() => handleEdit(post)}>
                    Edit
                  </button>
                  <button className="btn btn-danger me-2" onClick={() => handleDelete(post)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;