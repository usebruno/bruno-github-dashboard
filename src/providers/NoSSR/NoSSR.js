import { useEffect, useState, Suspense } from 'react';

const NoSSR = (props) => {
  const children = props.children;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  if (!isClient) {
    return null;
  }

  return <Suspense fallback={props.loading}>{children}</Suspense>;
};

export default NoSSR;