import React, { useState, useEffect } from 'react';

let current = 0;

const useIdShim = () => {
  const [id, setId] = useState<number>();
  useEffect(() => setId(++current), []);
  return id && `szh-ac${id}-`;
};

const useId = (React.useId || useIdShim) as () => string | undefined;

export { useId };
