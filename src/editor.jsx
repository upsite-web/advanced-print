import { useState, useEffect, useRef } from "react";
import apiFetch from "@wordpress/api-fetch";

export default function Editor() {
  const [boxes, setBoxes] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [resizing, setResizing] = useState(null);
  const [editingBox, setEditingBox] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [settings, setSettings] = useState({
    paper: { width: 8.5, height: 11 },
    background: { url: "", fit: "cover" },
  });

  const canvasRef = useRef(null);
  const postId = APConfig.post_id;

  useEffect(() => {
    apiFetch({ path: `/wp/v2/product/${postId}` })
      .then((product) => {
        const meta = product.meta || {};
        if (meta._advanced_print_design) {
          try {
            const saved = JSON.parse(meta._advanced_print_design);
            if (saved.boxes) setBoxes(saved.boxes);
            if (saved.settings) setSettings(saved.settings);
          } catch (e) {
            console.error("Failed to parse design JSON", e);
          }
        }
      })
      .catch((error) => console.error("Error loading product meta:", error));
  }, [postId]);

  const addBox = () => {
    const newBox = {
      id: Date.now(),
      x: 100,
      y: 100,
      width: 150,
      height: 50,
      text: "New Text",
      fontSize: 20,
      color: "#000000",
      rotate: 0,
      align: "left",
    };
    setBoxes((prev) => [...prev, newBox]);
  };

  const saveDesign = () => {
    apiFetch({
      path: `/wp/v2/product/${postId}`,
      method: "POST",
      data: {
        meta: {
          _advanced_print_design: JSON.stringify({ boxes, settings }),
        },
      },
    })
      .then(() => alert("Design saved!"))
      .catch((error) => {
        console.error("Failed to save design:", error);
        alert("Failed to save.");
      });
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const canvasWidth = canvasRect.width;
    const canvasHeight = canvasRect.height;
    const snapThreshold = 10;

    // Define margin lines based on % (you can later replace with saved per-poster settings)
    const marginLeft = canvasWidth * 0.1;
    const marginRight = canvasWidth * 0.9;
    const marginTop = canvasHeight * 0.1;
    const marginBottom = canvasHeight * 0.9;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    if (draggingId !== null) {
      const currentBox = boxes.find((box) => box.id === draggingId);
      if (!currentBox) return;
    
      const rawX = e.clientX - canvasRect.left - offset.x;
      const rawY = e.clientY - canvasRect.top - offset.y;
      let snappedX = rawX;
      let snappedY = rawY;
    
      const marginLeft = canvasWidth * 0.1;
      const marginRight = canvasWidth * 0.9;
      const marginTop = canvasHeight * 0.1;
      const marginBottom = canvasHeight * 0.9;
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
    
      const boxCenterX = rawX + currentBox.width / 2;
      const boxCenterY = rawY + currentBox.height / 2;
      const boxPadding = 5;
const handleSize = 10;
const borderWidth = 1;
const edgeOffset = boxPadding + handleSize + borderWidth;

    
      if (Math.abs(rawX - marginLeft) < snapThreshold) snappedX = marginLeft;
      if (Math.abs(rawX + currentBox.width + edgeOffset - marginRight) < snapThreshold)
        snappedX = marginRight - currentBox.width - edgeOffset;
      
      if (Math.abs(rawY - marginTop) < snapThreshold) snappedY = marginTop;
      if (Math.abs(rawY + currentBox.height + edgeOffset - marginBottom) < snapThreshold)
        snappedY = marginBottom - currentBox.height - edgeOffset;
      if (Math.abs(boxCenterX - centerX) < snapThreshold)
        snappedX = centerX - currentBox.width / 2;
      if (Math.abs(boxCenterY - centerY) < snapThreshold)
        snappedY = centerY - currentBox.height / 2;
    
      setBoxes((prev) =>
        prev.map((box) =>
          box.id === draggingId ? { ...box, x: snappedX, y: snappedY } : box
        )
      );
    }
     else if (resizing !== null) {
      const dx = e.clientX - resizing.startX;
      const dy = e.clientY - resizing.startY;

      setBoxes((prev) =>
        prev.map((box) =>
          box.id === resizing.id
            ? {
                ...box,
                width: Math.max(30, box.width + dx),
                height: Math.max(20, box.height + dy),
              }
            : box
        )
      );

      setResizing({
        id: resizing.id,
        startX: e.clientX,
        startY: e.clientY,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setResizing(null);
  };

  const updateEditingBox = (field, value) => {
    if (!editingBox) return;
    setBoxes((prev) =>
      prev.map((box) =>
        box.id === editingBox.id ? { ...box, [field]: value } : box
      )
    );
    setEditingBox((prev) => ({ ...prev, [field]: value }));
  };

  const launchMediaUploader = () => {
    const frame = window.wp.media({
      title: "Select Background Image",
      button: { text: "Use this image" },
      multiple: false,
    });
    frame.on("select", () => {
      const attachment = frame.state().get("selection").first().toJSON();
      setSettings((prev) => ({
        ...prev,
        background: { ...prev.background, url: attachment.url },
      }));
    });
    frame.open();
  };

  return (
    <div style={{ padding: "20px" }}>
      <button type="button" onClick={addBox}>
        Add Text
      </button>
      <button onClick={saveDesign} style={{ marginLeft: "10px" }}>
        Save Design
      </button>
      <button
        type="button"
        onClick={launchMediaUploader}
        style={{ marginLeft: "10px" }}
      >
        Upload Background
      </button>

      <div style={{ marginTop: "10px" }}>
        Width (in):{" "}
        <input
          type="number"
          value={settings.paper.width}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              paper: { ...prev.paper, width: parseFloat(e.target.value) },
            }))
          }
        />
        &nbsp; Height (in):{" "}
        <input
          type="number"
          value={settings.paper.height}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              paper: { ...prev.paper, height: parseFloat(e.target.value) },
            }))
          }
        />
        &nbsp; Fit:{" "}
        <select
          value={settings.background.fit}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              background: { ...prev.background, fit: e.target.value },
            }))
          }
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
        </select>
      </div>

      <div
        ref={canvasRef}
        style={{
          position: "relative",
          width: `${settings.paper.width * 96}px`,
          height: `${settings.paper.height * 96}px`,
          marginTop: "20px",
          border: "1px dashed #999",
          backgroundImage: `url(${settings.background.url})`,
          backgroundSize: settings.background.fit,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Margin guides (visual only) */}
        <div
          style={{
            position: "absolute",
            left: "10%",
            top: 0,
            bottom: 0,
            width: "1px",
            background: "red",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "90%",
            top: 0,
            bottom: 0,
            width: "1px",
            background: "red",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: 0,
            right: 0,
            height: "1px",
            background: "red",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "90%",
            left: 0,
            right: 0,
            height: "1px",
            background: "red",
          }}
        />

        {boxes.map((box) => (
          <div
            key={box.id}
            style={{
              position: "absolute",
              left: box.x,
              top: box.y,
              width: box.width,
              height: box.height,
              border: "1px dashed black",
              padding: "5px",
              cursor: draggingId === box.id ? "grabbing" : "grab",
              backgroundColor: "white",
              userSelect: "none",
              transform: `rotate(${box.rotate}deg)`,
              color: box.color,
              fontSize: `${box.fontSize}px`,
              display: "flex",
              alignItems: "center",
              justifyContent:
                box.align === "left"
                  ? "flex-start"
                  : box.align === "center"
                  ? "center"
                  : "flex-end",
              textAlign: box.align,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const boxRect = e.currentTarget.getBoundingClientRect();
              const canvasRect = canvasRef.current.getBoundingClientRect();
              setDraggingId(box.id);
              setOffset({
                x: e.clientX - boxRect.left,
                y: e.clientY - boxRect.top,
              });
            }}
            onDoubleClick={() => setEditingBox(box)}
          >
            <div
              dir={/^[\u0590-\u05FF]/.test(box.text) ? "rtl" : "ltr"}
              style={{ width: "100%" }}
            >
              {box.text}
            </div>
            <div
              onMouseDown={(e) => {
                e.stopPropagation();
                setResizing({
                  id: box.id,
                  startX: e.clientX,
                  startY: e.clientY,
                });
              }}
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "black",
                position: "absolute",
                right: 0,
                bottom: 0,
                cursor: "se-resize",
              }}
            />
          </div>
        ))}
      </div>

      {editingBox && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "20px",
            border: "1px solid #ccc",
            zIndex: 9999,
            width: "300px",
          }}
        >
          <h3>Edit Text Box</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>Text:</label>
            <input
              type="text"
              value={editingBox.text}
              onChange={(e) => updateEditingBox("text", e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Font Size:</label>
            <input
              type="number"
              value={editingBox.fontSize}
              onChange={(e) =>
                updateEditingBox("fontSize", parseInt(e.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Color:</label>
            <input
              type="color"
              value={editingBox.color}
              onChange={(e) => updateEditingBox("color", e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Align:</label>
            <select
              value={editingBox.align}
              onChange={(e) => updateEditingBox("align", e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Rotation (deg):</label>
            <input
              type="number"
              value={editingBox.rotate}
              onChange={(e) =>
                updateEditingBox("rotate", parseInt(e.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>
          <button onClick={() => setEditingBox(null)}>Done</button>
        </div>
      )}
    </div>
  );
}
