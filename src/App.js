import { useState, useEffect } from "react";
import Amplify, { Storage } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import awsConfig from "./aws-exports";
import logo from "./logo.svg";
import "./App.css";

Amplify.configure(awsConfig);

const imageName = "myImage";

function App() {
  const [status, setStatus] = useState('Waiting for upload.');
  const [myImage, setMyImage] = useState(undefined);

  useEffect(() => {
    if (myImage === undefined) {
      Storage.get(imageName, { level: "protected" })
        .then(setMyImage)
        .catch(err => console.error('could not generate image URL', err))
      ;
    } else {
      console.log("image loaded", myImage);
    }
  }, [status]);

  async function onImageChange(e) {
    const file = e.target.files[0];
    try {
      setStatus("Uploading ...");
      await Storage.put(imageName, file, { level: "protected" });
      setStatus("Upload complete.");
    } catch (err) {
      setStatus("Ruhoh. That didn't work! Try again.");
      console.log(err);
    }
  };

  return (
    <div className="App">
      <div>{status}</div>
      <div>
        Protected upload: <input type='file' onChange={onImageChange} />
      </div>
      <img src={myImage} />
      <div style={{
        width: "200px",
        height: "200px",
        WebkitMaskImage: "url('" + myImage + "')"
      }}></div>
    </div>
  );
}

export default withAuthenticator(App);
