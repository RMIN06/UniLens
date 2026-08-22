// react-three-fiber v8 JSX intrinsics for @types/react v19 (which moved the
// JSX namespace under React.JSX). Must be a module file for `declare global`.
import type { ThreeElements } from '@react-three/fiber'

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
