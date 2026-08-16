import { useEffect, useRef, useState } from "react";
import "./App.css";
const templates = [
  { id: "classic", name: "Classic", caption: "THE GOOD TIMES", shade: "paper" },
  {
    id: "mono",
    name: "Monochrome",
    caption: "STAY IN THIS MOMENT",
    shade: "ink",
  },
  { id: "soft", name: "Soft Frame", caption: "made with love", shade: "soft" },
];
function Strip({ template, photos, mock = false }) {
  return (
    <div className={`photo-strip ${template.shade}`}>
      <div className="strip-head">
        RINJAY BOOTH <span>2026</span>
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div className={`strip-photo ${mock ? "mock" : ""}`} key={i}>
          {photos[i] ? (
            <img src={photos[i]} alt={`Photo ${i + 1}`} />
          ) : mock ? (
            `PHOTO 0${i + 1}`
          ) : (
            <span>0{i + 1}</span>
          )}
        </div>
      ))}
      <div className="strip-caption">
        {template.caption}
        <small>JAKARTA, ID</small>
      </div>
    </div>
  );
}
function Studio({ template, setTemplate }) {
  const [title, setTitle] = useState(template.caption);
  return (
    <section className="studio">
      <div>
        <p className="eyebrow">DESIGN STUDIO / 01</p>
        <h1>
          Design your
          <br />
          <em>keepsake.</em>
        </h1>
        <p className="studio-copy">
          Atur gaya strip untuk sesi berikutnya. Template akan langsung
          diterapkan di photo booth.
        </p>
        <label>
          CAPTION
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <div className="template-list">
          {templates.map((item) => (
            <button
              key={item.id}
              className={`template-option ${template.id === item.id ? "selected" : ""}`}
              onClick={() => setTemplate({ ...item, caption: title })}
            >
              <span>{item.name}</span>
              <small>SELECT</small>
            </button>
          ))}
        </div>
      </div>
      <div className="studio-preview">
        <Strip template={{ ...template, caption: title }} photos={[]} mock />
        <p>LIVE PREVIEW</p>
      </div>
    </section>
  );
}
function App() {
  const videoRef = useRef(null),
    streamRef = useRef(null);
  const [view, setView] = useState("booth"),
    [template, setTemplate] = useState(templates[0]),
    [photos, setPhotos] = useState([]),
    [cameraOn, setCameraOn] = useState(false),
    [countdown, setCountdown] = useState(null),
    [message, setMessage] = useState("Pilih template, lalu mulai sesi fotomu.");
  useEffect(
    () => () => streamRef.current?.getTracks().forEach((t) => t.stop()),
    [],
  );
  useEffect(() => {
    if (cameraOn && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current
        .play()
        .catch(() =>
          setMessage(
            "Video kamera belum dapat diputar. Coba aktifkan kembali kamera.",
          ),
        );
    }
  }, [cameraOn]);
  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage(
        "Browser ini tidak mendukung akses kamera. Buka melalui localhost atau HTTPS.",
      );
      return;
    }
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "user" } },
        audio: false,
      });
      setCameraOn(true);
      setMessage("Kamera siap. Ambil empat momen terbaikmu.");
    } catch (error) {
      setMessage(
        error.name === "NotAllowedError"
          ? "Akses kamera ditolak. Periksa izin kamera pada browser."
          : "Kamera belum dapat diakses. Pastikan tidak digunakan aplikasi lain, lalu coba lagi.",
      );
    }
  };
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
    setCountdown(null);
    setMessage("Kamera ditutup. Kamu dapat menyalakannya kembali kapan saja.");
  };
  const capture = () => {
    if (!cameraOn || countdown !== null || photos.length >= 4) return;
    let remaining = 3;
    setCountdown(remaining);
    const timer = setInterval(() => {
      remaining -= 1;
      if (!remaining) {
        clearInterval(timer);
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        canvas
          .getContext("2d")
          .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setPhotos((current) => [
          ...current,
          canvas.toDataURL("image/jpeg", 0.9),
        ]);
        setCountdown(null);
      } else setCountdown(remaining);
    }, 1000);
  };
  const reset = () => {
    setPhotos([]);
    setMessage("Strip dikosongkan. Ambil empat foto baru.");
  };
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top">
          <span>RINJAY</span> BOOTH<sup>®</sup>
        </a>
        <nav>
          {[
            ["booth", "PHOTO BOOTH"],
            ["studio", "DESIGN STUDIO"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={view === id ? "active" : ""}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <button className="round-button">☰</button>
      </header>
      {view === "booth" ? (
        <section className="booth-layout" id="top">
          <aside className="control-panel">
            <p className="eyebrow">01 / CHOOSE A FRAME</p>
            <h1>
              Make the
              <br />
              <em>moment</em> yours.
            </h1>
            <div className="template-list">
              {templates.map((item) => (
                <button
                  key={item.id}
                  className={`template-option ${template.id === item.id ? "selected" : ""}`}
                  onClick={() => setTemplate(item)}
                >
                  <span>{item.name}</span>
                  <small>
                    {template.id === item.id ? "SELECTED" : "USE THIS"}
                  </small>
                </button>
              ))}
            </div>
            <div className="session-info">
              <span>PHOTOS</span>
              <strong>{photos.length}/4</strong>
              <span>•</span>
              <span>SELF TIMER</span>
              <strong>03 SEC</strong>
            </div>
          </aside>
          <section className="camera-stage">
            <div className="camera-window">
              {cameraOn ? (
                <video ref={videoRef} autoPlay playsInline muted />
              ) : (
                <div className="camera-placeholder">
                  <div className="viewfinder" />
                  <p>
                    YOUR MOMENT
                    <br />
                    STARTS HERE
                  </p>
                </div>
              )}
              <i className="corner tl" />
              <i className="corner tr" />
              <i className="corner bl" />
              <i className="corner br" />
              {countdown !== null && (
                <div className="countdown">{countdown}</div>
              )}
            </div>
            <p className="status">{message}</p>
            {!cameraOn ? (
              <button className="primary" onClick={startCamera}>
                ENABLE CAMERA <span>↗</span>
              </button>
            ) : (
              <div className="camera-controls">
                <button
                  className="shutter"
                  onClick={capture}
                  disabled={photos.length >= 4}
                >
                  {photos.length >= 4 ? "STRIP COMPLETE" : "TAKE PHOTO"}
                </button>
                <button className="close-camera" onClick={stopCamera}>
                  CLOSE CAMERA
                </button>
              </div>
            )}
          </section>
          <aside className="strip-zone">
            <p className="eyebrow">02 / YOUR STRIP</p>
            <Strip template={template} photos={photos} />
            <div className="strip-actions">
              <button onClick={reset}>RESET</button>
              <button
                className="print"
                disabled={!photos.length}
                onClick={() => window.print()}
              >
                PRINT STRIP ↗
              </button>
            </div>
          </aside>
        </section>
      ) : (
        <Studio template={template} setTemplate={setTemplate} />
      )}
      <footer>
        <span>RINJAY BOOTH / MAKE A MEMORY</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
export default App;
