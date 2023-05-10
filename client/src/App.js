import React, { useState, useEffect } from "react";
import axios from "axios";
export default function App() {
  const [healthData, setHealthData] = useState({
    postTitle: "",
    postContent: ""
  })

  const [formImg, setFormImg] = useState(null)

  const [resData, setResData] = useState([])

  // console.log(resData)

  useEffect(() => {
    async function fetchImg() {
      try {
        const response = await axios.get('http://localhost:5000/upload')
        setResData(response.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchImg()
  }, [formImg])

  const handleChange = (e) => {
    setHealthData(prevData => {
      return {
        ...prevData,
        [e.target.name]: e.target.value
      }

    })
  }

  const handleImg = (e) => {
    setFormImg(e.target.files[0])
  }

  const { postTitle, postContent } = healthData

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('formImg', formImg)
    formData.append('postTitle', postTitle)
    formData.append('postContent', postContent)

    try {
      const response = await axios.post('http://localhost:5000/upload', formData )

      if (response) {
        window.alert('Post created.')
      }
    } catch (error) {
      window.alert('Failed to create post.')
    }
  }

  return (
    <div>
      <div className="headpart">
        <h1 >HEALTHBOOK</h1>
      </div>

      <div className="create-post-box">
        <h2>ADD DETAILS</h2>
        <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
          <label htmlFor="postTitle">Diagnosis</label>
          <input id="postTitle" type="text" name="postTitle" placeholder="Enter Diagnosis" onChange={handleChange} value={healthData.postTitle} />
          <label htmlFor="postContent">Symptoms</label>
          <textarea id="postContent" name="postContent" placeholder="Enter Symptoms" onChange={handleChange} value={healthData.postContent}></textarea>
          <label htmlFor="formImg">Prescription-Image</label>
          <input id="formImg" type="file" name="formImg" onChange={handleImg} />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="image-div">
        {resData.map((item) => {
          console.log('resData', resData)
          console.log('binData', item.formImg.data.data)
          const base64String = window.btoa(
            String.fromCharCode(...new Uint8Array((item.formImg.data.data)))
          )
          const source = `data:${item.formImg.contentType};base64,${base64String}`
          console.log('source', source)
          return <img key={item._id} src={source} alt="IMAGES" className="image-block"/>
        })}
      </div>
    </div>
  )
}