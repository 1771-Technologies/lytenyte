import { useState } from 'react';

const useMutableState = <S>(stateContainer: S) => useState<S>(stateContainer)[0];

export { useMutableState };
