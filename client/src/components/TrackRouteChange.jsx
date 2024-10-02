import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppContext from '../context/AppContext';

function TrackRouteChange() {
  const { setIsPhotoTaken, setCapturedImage } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setIsPhotoTaken(false);
        setCapturedImage(null);
        break;
    }
  }, [location]);

  return null;
}

export default TrackRouteChange;
