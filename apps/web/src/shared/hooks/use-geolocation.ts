import { useEffect, useState } from "react";

type Coordinates = {
  lat: number;
  lng: number;
};

type GeolocationState = {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
  retry: () => void;
};

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 30000,
};

export const useGeolocation = (): GeolocationState => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const currentRequest = retryCount;
    void currentRequest;

    if (!("geolocation" in navigator)) {
      setError("このブラウザでは位置情報が利用できません。");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates({
          lat: coords.latitude,
          lng: coords.longitude,
        });
        setIsLoading(false);
      },
      (positionError) => {
        setError(
          positionError.code === positionError.PERMISSION_DENIED
            ? "位置情報の利用が許可されていません。"
            : "位置情報を取得できませんでした。",
        );
        setIsLoading(false);
      },
      GEOLOCATION_OPTIONS,
    );
  }, [retryCount]);

  return {
    coordinates,
    error,
    isLoading,
    retry: () => setRetryCount((current) => current + 1),
  };
};
