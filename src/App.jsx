import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./components/searchBar/SearchBar";
import ImageGallery from "./components/imageGallery/ImageGallery";
import ImageModal from "./components/imageModal/ImageModal";
import Loader from "./components/loader/Loader";
import ErrorMessage from "./components/errorMessage/ErrorMessage";
import LoadMoreBtn from "./components/loadMoreBtn/LoadMoreBtn";
import { Toaster } from "react-hot-toast";

import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = async (searchQuery, numPage) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?page=${numPage}&query=${searchQuery}`,
        {
          headers: {
            Authorization:
              "Client-ID Ph4PpdJNR_bfnGbfoO28ljpqE_IueaOsvzxI3HR8ys0",
          },
        }
      );
      return res.data.results.slice(0, 9);
    } catch (error) {
      console.log("Error: ", error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (query !== "") {
          const newImages = await fetchImages(query, page);
          setImages((prevImg) => [...prevImg, ...newImages]);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [query, page]);

  function handleSubmit(searchQuery) {
    setQuery(searchQuery);
    setError(null);
    setPage(1);
    setImages([]);
  }

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const modalOpen = (photo) => {
    setSelectedImage(photo);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <SearchBar onSubmit={handleSubmit} />
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <ImageGallery images={images} openModal={modalOpen} />
      )}
      {images.length > 0 && !error && <LoadMoreBtn onClick={handleLoadMore} />}

      {modalIsOpen && selectedImage && (
        <ImageModal
          image={selectedImage}
          openModal={modalIsOpen}
          closeModal={closeModal}
        />
      )}
      {loading && <Loader />}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;