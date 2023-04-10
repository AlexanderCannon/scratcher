import React, { KeyboardEvent, useState } from "react";
import { createApi } from "unsplash-js";
import Input from "./Input";
import Modal from "./Modal";
import { type Basic } from "unsplash-js/dist/methods/photos/types";
import Typography from "./Typography";

const accessKey = "cKLowy_ifGyIzwvmSYWsgUme8DcrGzpzKi2TgVbAIeE";

const unsplash = createApi({ accessKey });

interface PhotoPickerProps {
  onSelect: (url: string) => void;
  placeHolder?: string;
}

export default function PhotoPicker({
  onSelect,
  placeHolder,
}: PhotoPickerProps) {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const [photos, setPhotos] = useState<Basic[]>();

  const searchPhotos = async () => {
    try {
      setShow(true);
      const { response } = await unsplash.search.getPhotos({
        perPage: 12,
        query,
        orientation: "landscape",
      });
      if (!response?.results) return;
      setPhotos(response.results);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectPhoto = (photo: Basic) => {
    setShow(false);
    onSelect(photo.urls.regular);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchPhotos();
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-center">
        <Input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeHolder ?? "Search for photos"}
          onKeyDown={handleKeyDown}
        />
        <button
          className="ml-4 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={searchPhotos}
        >
          Search
        </button>
      </div>
      <Modal isOpen={show} onClose={() => setShow(false)}>
        <div className="grid grid-cols-2 gap-4 overflow-y-scroll sm:grid-cols-4">
          {photos &&
            photos.map((photo) => (
              <button key={photo.id} onClick={() => handleSelectPhoto(photo)}>
                <img
                  className="h-auto w-full rounded"
                  src={photo.urls.thumb}
                  alt={photo.alt_description ?? ""}
                />
                <Typography>
                  From Unsplash, photo by {photo.user.name}
                </Typography>
              </button>
            ))}
        </div>
      </Modal>
    </div>
  );
}
