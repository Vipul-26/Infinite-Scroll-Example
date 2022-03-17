import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const getPhotos = (page) => {
    setLoading(true);
    axios.get(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`)
      .then(res => {
        setPhotos((photos) => [...photos, ...res.data]);
        setLoading(false);
      });
  };

  const [element, setElement] = useState(null);

  var options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
  };

  const observer = useRef(
    new IntersectionObserver(
      entries => {
        const intersection = entries[0];
        if (intersection.isIntersecting) {
          const currPage = page + 1;
          setPage(currPage);
          getPhotos(currPage);
        }
      },
      options
    )
  );

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;
    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };

  }, [element]);

  return (
    <div>
      <div className='mainDiv'>
        {photos && photos.map(data => (
          <img src={data.url} height="100px" width="200px" />
        ))}
        <div ref={setElement} className='loadDiv'>
          <span className={`${loading ? 'loading' : 'notLoading'}`}>Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default App;
