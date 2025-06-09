import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useRef, useState} from "react";
import useAuth from "../../hooks/useAuth";
import Dropzone from "react-dropzone";
import baseUrl from "../../api/baseUrl";

export default function AddGallery() {
    const {auth} = useAuth();
    const [image, setImage] = useState(null);
    const navigate =useNavigate()
    const [file, setFile] = useState();
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();

    const [selectedFiles, setSelectedFiles] = useState(undefined);

      const onDrop = (files) => {
        if (files.length > 0) {
            setSelectedFiles(files);
            setFile(URL.createObjectURL(files[0]));
        }
      };

      const handleSubmit = async (e) =>{
        e.preventDefault();
        if (selectedFiles && selectedFiles[0].name){
            var imgname=selectedFiles[0].name
        const file = new File(selectedFiles, imgname);
              setImage({
                image_url:file,
            });
        }else{
            setErrMsg("Select file")
            return;
        }
        if(!image){
            return;
        }

        try{
            let formData = new FormData();
            formData.append('image_url',image.image_url);
            const response = await axios.post(baseUrl+"/gallery/create/",{
            'image_url': image.image_url,
            'displayed': true,
            },
            {
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            }
            );
            console.log(response.data)
            navigate("/gallery")
            //clear input fields
        }
        catch(err){
            if (!err?.response) {
                setErrMsg('No Server Response'+err);
            } else if (err.response?.status === 404) {
                setErrMsg('problem with upload');
            } else{
                setErrMsg("Upload Failed"+err)
                console.log(err)
            }
            errRef.current.focus(); 
            navigate('/error');
        }
}


  return (
    <section className="form">
    <p ref={errRef} className={errMsg ? "errmsg" :"offscreen"} aria-live="assertive">
        {errMsg}
    </p>
   <center> <h1>Add Gallery photo</h1></center>
    <form onSubmit={handleSubmit}>
    <center>
    <img className="img-for-gallery" src={file} alt="" />
    <Dropzone onDrop={onDrop} multiple={false}>
            {({ getRootProps, getInputProps }) => (
                <section>
                <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    {selectedFiles && selectedFiles[0].name ? (
                        <div className="selected-file">
                        {selectedFiles && selectedFiles[0].name}
                        </div>
                    ) : (
                        <span><strong className="browse">Browse</strong> <strong>photo</strong><br/> or drag and drop</span>
                    )}
                </div>
                </section>
            )}
    </Dropzone>
    </center>
            <center>
            <div className="formpart">
                <label htmlFor="displayed">
                    Display this photo?
                </label>
                <select name="displayed">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>
            </center>
            <center><button type="submit">Save</button></center>
    </form>
    </section>
  )
}
