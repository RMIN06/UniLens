// CSS Module type declarations
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

// Global CSS side-effect imports
declare module './globals.css' {
  const content: unknown
  export default content
}
