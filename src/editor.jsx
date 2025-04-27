import { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';


export default function Editor() {
  const [text, setText] = useState('');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [image, setImage] = useState(null);

  const postId = APConfig.post_id;


  useEffect(() => {
    // On load, fetch existing meta
    apiFetch({ path: `/wp/v2/product/${postId}` })
      .then((product) => {
        const meta = product.meta || {};
        if (meta._advanced_print_text) setText(meta._advanced_print_text);
        if (meta._advanced_print_image) setImage(meta._advanced_print_image);
      })
      .catch((error) => console.error('Error fetching product:', error));
  }, []);

  const saveMeta = (field, value) => {
    apiFetch({
      path: `/wp/v2/product/${postId}`,
      method: 'POST',
      data: {
        meta: {
          [field]: value,
        },
      },
    }).catch((error) => console.error('Error saving meta:', error));
  };

  const toggleBold = () => setBold(!bold);
  const toggleItalic = () => setItalic(!italic);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        saveMeta('_advanced_print_image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    saveMeta('_advanced_print_text', e.target.value);
  };

  const textStyle = {
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
    fontSize: '20px',
    marginBottom: '10px'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={toggleBold} style={{ marginRight: '10px' }}>
          Bold
        </button>
        <button onClick={toggleItalic}>
          Italic
        </button>
      </div>

      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter your text here..."
        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />

      <div style={{ marginBottom: '10px' }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', minHeight: '200px' }}>
        <div style={textStyle}>{text}</div>
        {image && (
          <div style={{ marginTop: '10px' }}>
            <img src={image} alt="Uploaded" style={{ maxWidth: '100%' }} />
          </div>
        )}
      </div>
    </div>

    
  );

  
}

import { createRoot } from 'react-dom/client';


const container = document.getElementById('advanced-print-editor');
if (container) {
  const root = createRoot(container);
  root.render(<Editor />);
}
