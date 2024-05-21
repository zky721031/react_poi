import React from 'react';

export default function lazyLoad(path) {
  const Component = React.lazy(() => import(`../pages/${path}/index.jsx`));

  return (
    <React.Suspense fallback={<>Loading...</>}>
      <Component />
    </React.Suspense>
  );
}
