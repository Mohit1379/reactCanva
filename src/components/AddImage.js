import React from 'react';
import useImage from 'use-image';
import { Image, Transformer } from 'react-konva';
function AddImage({ src, x, y, isSelected, onSelect, onChange }) {
    const [image] = useImage(src);
  const imageRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <>
    <Image
      ref={imageRef}
      x={x}
      y={y}
      image={image}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        const newX = e.target.x();
        const newY = e.target.y();
        onChange({ x: newX, y: newY });
      }}
    />
    {isSelected && <Transformer ref={trRef} />}
  </>
  )
}

export default AddImage