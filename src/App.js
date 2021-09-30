import "./App.css";
import Dropzone from "react-dropzone";
import React, { useState} from "react";

const cloudName = "theikid";
const unsignedUploadPreset = "reframe";

function refreshPage() {
  window.location.reload(false);
}

function App() {
  // const [imageURL, setImageurl] = useState('');
  // useEffect(() => {
  //   function pasteURL(event) {
  //     let setPasteURL = (event.clipboardData || window.clipboardData).getData('text');
  //     setImageurl(setPasteURL);
  //   }

  //   document.addEventListener('paste', pasteURL)
  //   return () => {
  //     document.removeEventListener('paste', pasteURL)
  //   }
  // }, []);

  const [imageResized, setImagetoResize] = useState("");
  const [isPortrait, setPortrait] = useState(false);
  const [isLoading, setLoading] = useState(false);

  // *********** Upload file to Cloudinary ******************** //
  function uploadFile(file, returnURL) {
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {
      console.log(`fileuploadprogress data.loaded: ${e.loaded}, data.total: ${e.total}`);
    });

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // File uploaded successfully
        var response = JSON.parse(xhr.responseText);
        returnURL(response);
      }
    };
    setLoading(true);
    fd.append("upload_preset", unsignedUploadPreset);
    fd.append("tags", "browser_upload"); // Optional - add tag for image admin in Cloudinary
    fd.append("file", file);
    xhr.send(fd);
}

function resizeImage(data) {
  setImagetoResize(data);
}

const switchStyle = () => {
  setPortrait(!isPortrait);
};

const imgurlPortrait = new Image();
const imgurlSquare = new Image();

if (imageResized !== "") {
imgurlPortrait.src =
  "https://res.cloudinary.com/theikid/image/upload/c_fill,w_1008,h_1278,bo_36px_solid_rgb:ffffff/" +
  imageResized.public_id +
  ".png";

var downloadurlPortrait =
  "https://res.cloudinary.com/theikid/image/upload/c_fill,w_1008,h_1278,bo_36px_solid_rgb:ffffff,fl_attachment/" +
  imageResized.public_id +
  ".png";
imgurlPortrait.alt = "Format portrait";

imgurlSquare.src =
  "https://res.cloudinary.com/theikid/image/upload/c_fill,w_1008,h_1008,bo_36px_solid_rgb:ffffff/" +
  imageResized.public_id +
  ".png";

var downloadurlSquare =
    "https://res.cloudinary.com/theikid/image/upload/c_fill,w_1008,h_1008,bo_36px_solid_rgb:ffffff,fl_attachment/" +
    imageResized.public_id +
    ".png";
imgurlSquare.alt = "Format carré";
}

function rejectedfile() {
  console.log("fichier trop gros");
  //montrer un message d'erreur
}

  return (
    <div className="App">
      <div
        id="loading"
        style={isLoading ? { display: "flex" } : { display: "none" }}
      >
        <div className="spinner-container">
          <div className="spinner"></div>
          Chargement en cours...
        </div>
      </div>
      {imageResized === "" ? (
        <Dropzone
          onDropAccepted={(acceptedFiles) =>
            uploadFile(acceptedFiles[0], resizeImage)
          }
          onDropRejected={rejectedfile}
          multiple={false}
          maxSize={10485760}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="uploader">
              <input {...getInputProps()} />
              <p>
                Déposez des fichiers ou cliquez pour les sélectionner sur votre
                ordinateur
              </p>
            </div>
          )}
        </Dropzone>
      ) : (
        <div className="imageRender">
          <img
            src={isPortrait ? imgurlPortrait.src : imgurlSquare.src}
            alt={isPortrait ? imgurlPortrait.alt : imgurlSquare.alt}
            onLoad={() => {
              setLoading(false);
            }}
          />
          <div className="appBar">
            <div className="leftButtons">
              <button onClick={switchStyle} className="primary-btn">
                {isPortrait ? "Format Carré" : "Format Portrait"}
              </button>
              <a
                href={isPortrait ? downloadurlPortrait : downloadurlSquare}
                download
              >
                <button className="primary-btn">Télécharger</button>
              </a>
            </div>
            <button onClick={refreshPage} className="alt-btn">
              Nouvelle image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
