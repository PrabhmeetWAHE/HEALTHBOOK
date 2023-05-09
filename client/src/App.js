import React, { useState } from "react";
import axios from "axios";
export default function App() {
  const [formData, setFormData] = useState({
    postTitle: "",
    postContent: "",
    img: null
  })
  const handleChange = (e) => {
    setFormData(prevData => {
      return {
        ...prevData,
        [e.target.name]: e.target.value
      }

    })

  }
  const handleImg =  (e) => {
    setFormData(prevState => {
      return {
          ...prevState,
          [e.target.name]: e.target.files[0]
  }
  })
  }
  const { postTitle, postContent, img } = formData

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/', {
        postTitle, postContent, img
      })

      if (response) {
        window.alert('Post created.')
      }
    } catch (error) {
      window.alert('Failed to create post.')
    }
  }
  return (
    <div>
      <div class="headpart">
        <h1 >HEALTHBOOK</h1>
      </div>

      <div class="create-post-box">
        <h2>ADD DETAILS</h2>
        <form method="post" enctype="multipart/form-data" onSubmit={handleSubmit}>
          <label htmlFor="post-title">Diagnosis</label>
          <input type="text" name="postTitle" placeholder="Enter Diagnosis" onChange={handleChange} value={formData.postTitle} />
          <label htmlFor="post-content">Symptoms</label>
          <textarea name="postContent" placeholder="Enter Symptoms" onChange={handleChange} value={formData.postContent}></textarea>
          <label htmlFor="post-image">Prescription-Image</label>
          <input type="file" name="img" onChange={handleImg} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}