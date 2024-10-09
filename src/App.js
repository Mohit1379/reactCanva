import React, { useState } from 'react';
import './App.css';
import { Stage, Layer, Text, Transformer } from 'react-konva';
import AddImage from './components/AddImage';

// Functional component for editable text
const EditableText = ({ text, fontSize, fontFamily, x, y, isSelected, onSelect, onChange }) => {
  const textRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={textRef}
        text={text}
        fontSize={fontSize}
        fontFamily={fontFamily}
        x={x}
        y={y}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();
          onChange({ text, fontSize, fontFamily, x: newX, y: newY });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

// Main App component
const App = () => {
  const [inputText, setInputText] = useState('');
  const [fontSize] = useState(40);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [submittedText, setSubmittedText] = useState('');
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedId, selectShape] = useState(null);
  const [textPosition, setTextPosition] = useState({ x: 100, y: 100 });
  const viewportRef = React.useRef();
  const videoRef = React.useRef();

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleFontFamilyChange = (event) => {
    setFontFamily(event.target.value);
  };

  const handleSubmit = () => {
    setSubmittedText(inputText);
    setTextPosition({ x: 100, y: 100 });
  };

  const moveToExtreme = (direction) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const { clientWidth: viewportWidth, clientHeight: viewportHeight } = viewport;
    const textWidth = submittedText.length * (fontSize / 2);
    const textHeight = fontSize;

    let newX = textPosition.x;
    let newY = textPosition.y;

    switch (direction) {
      case 'up':
        newY = 0;
        break;
      case 'down':
        newY = viewportHeight - textHeight;
        break;
      case 'left':
        newX = 0;
        break;
      case 'right':
        newX = viewportWidth - textWidth;
        break;
      default:
        break;
    }

    setTextPosition({ x: newX, y: newY });
  };

  const addImage = () => {
    setImages((prevImages) => [
      ...prevImages,
      { src: 'https://konvajs.org/assets/yoda.jpg', x: 150, y: 0 },
    ]);
  };

  const removeImage = () => {
    setImages((prevImages) => prevImages.slice(0, -1));
  };

  const toggleVideo = () => {
    if (!videoUrl) {
      setVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4');
      setIsVideoPlaying(true);
    } else {
      const videoElement = videoRef.current;
      if (isVideoPlaying) {
        videoElement.pause();
        setIsVideoPlaying(false);
      } else {
        videoElement.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const stopVideo = () => {
    setVideoUrl('');
    setIsVideoPlaying(false);
  };

  return (
    <div className="App">
      <div className='d-flex flex-wrap mt-5'>
        <div className='col-6 d-flex flex-column align-items-center'>
          <h2>Start Editing from here</h2>
          <div className='mt-5'>
            <h4>Insert text</h4>
            <input type='text' value={inputText} onChange={handleInputChange} />
          </div>
          <div className='d-flex flex-wrap'>
            <button type="button" className="btn btn-primary mt-4" onClick={handleSubmit}>Add</button>
            <button type="button" className="btn btn-danger mt-4 ms-4" onClick={() => setSubmittedText("")}>Remove</button>
          </div>
          <div className='mt-3 d-flex'>
            <h4 className='me-3'>Add Font Style</h4>
            <select value={fontFamily} onChange={handleFontFamilyChange}>
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
          <div className='d-flex'>
            <button className='mt-4 ms-2' onClick={() => moveToExtreme('up')}>Up</button>
            <button className='mt-4 ms-2' onClick={() => moveToExtreme('down')}>Down</button>
            <button className='mt-4 ms-2' onClick={() => moveToExtreme('left')}>Left</button>
            <button className='mt-4 ms-2' onClick={() => moveToExtreme('right')}>Right</button>
          </div>
          <div className='mt-5'>
            <h4>Add Image</h4>
          </div>
          <div className='d-flex flex-wrap'>
            <button type="button" className="btn btn-primary mt-4" onClick={addImage}>Add Image</button>
            <button type="button" className="btn btn-danger mt-4 ms-4" onClick={removeImage}>Remove Image</button>
          </div>
          <div className='mt-5'>
            <h4>Add Video</h4>
          </div>
          <div className='d-flex flex-wrap'>
            <button type="button" className="btn btn-primary" onClick={toggleVideo}>
              {videoUrl ? (isVideoPlaying ? 'Pause Video' : 'Play Video') : 'Add Video'}
            </button>
            <button type="button" className="btn btn-danger ms-4" onClick={stopVideo}>Stop Video</button>
          </div>
        </div>
        <div className='col-6 p-5'>
          <div className='viewportArea border' ref={viewportRef} style={{ position: 'relative', overflow: 'hidden' }}>
            {videoUrl && (
              <video
                ref={videoRef}
                src={videoUrl}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: -1,
                  display: 'block', // Always display the video
                }}
                autoPlay={isVideoPlaying}
                loop
                muted
              />
            )}
            <Stage width={window.innerWidth / 1} height={window.innerHeight}>
              <Layer>
                {submittedText && (
                  <EditableText
                    text={submittedText}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    x={textPosition.x}
                    y={textPosition.y}
                    isSelected={submittedText === selectedId}
                    onSelect={() => selectShape(submittedText)}
                    onChange={(newAttrs) => {
                      const textWidth = newAttrs.text.length * (fontSize / 2);
                      const textHeight = fontSize;

                      const viewport = viewportRef.current;
                      if (!viewport) return;
                      const { clientWidth: viewportWidth, clientHeight: viewportHeight } = viewport;

                      const boundedX = Math.max(0, Math.min(newAttrs.x, viewportWidth - textWidth));
                      const boundedY = Math.max(0, Math.min(newAttrs.y, viewportHeight - textHeight));

                      setSubmittedText(newAttrs.text);
                      setTextPosition({ x: boundedX, y: boundedY });
                    }}
                  />
                )}
                {images.map((img, index) => (
                  <AddImage
                    key={index}
                    src={img.src}
                    x={img.x}
                    y={img.y}
                    isSelected={img.src === selectedId}
                    onSelect={() => selectShape(img.src)}
                    onChange={(newAttrs) => {
                      const viewport = viewportRef.current;
                      if (!viewport) return;
                      const { clientWidth: viewportWidth, clientHeight: viewportHeight } = viewport;

                      const boundedX = Math.max(0, Math.min(newAttrs.x, viewportWidth - 100));
                      const boundedY = Math.max(0, Math.min(newAttrs.y, viewportHeight - 100));

                      const updatedImages = [...images];
                      updatedImages[index] = { ...updatedImages[index], x: boundedX, y: boundedY };
                      setImages(updatedImages);
                    }}
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
