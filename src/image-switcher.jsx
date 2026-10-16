import React, { useEffect, useState } from "react";

// Keep the displayed photo until its replacement is decoded. Cleanup prevents
// an older request from overwriting a more recent click.
export function ImageSwitcher({
  src,
  alt,
  className = "",
  transition = "fade",
  fit = "cover",
  priority = false,
}) {
  const [frame, setFrame] = useState({ src, alt, previous: null, revision: 0 });
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let committed = false;
    const image = new Image();
    setFailed(false);
    setPending(true);
    const commit = () => {
      if (cancelled || committed) return;
      committed = true;
      setFrame((old) =>
        old.src === src
          ? { ...old, alt }
          : {
              src,
              alt,
              previous: { src: old.src, alt: old.alt },
              revision: old.revision + 1,
            },
      );
      setPending(false);
    };
    image.onload = () => {
      if (image.decode) image.decode().then(commit, commit);
      else commit();
    };
    image.onerror = () => {
      if (!cancelled) {
        setPending(false);
        setFailed(true);
      }
    };
    image.src = src;
    if (image.complete && image.naturalWidth > 0) {
      if (image.decode) image.decode().then(commit, commit);
      else commit();
    }
    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [src, alt, retry]);
  return (
    <div
      className={"image-switcher switch-" + transition + " " + className}
      style={{ "--image-fit": fit }}
      aria-busy={pending}
      data-image-state={failed ? "error" : pending ? "loading" : "ready"}
    >
      {frame.previous && (
        <img
          className="switch-previous"
          src={frame.previous.src}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      )}
      <img
        key={frame.revision}
        className={
          frame.revision ? "switch-current switch-enter" : "switch-current"
        }
        src={frame.src}
        alt={frame.alt}
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
        onError={() => setFailed(true)}
      />
      {failed && (
        <div className="image-retry" role="status">
          Bild konnte nicht geladen werden.
          <button type="button" onClick={() => setRetry((v) => v + 1)}>
            Erneut laden
          </button>
        </div>
      )}
    </div>
  );
}
