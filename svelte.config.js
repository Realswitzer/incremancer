export default {
  compilerOptions: {
    warningFilter(w) {
      return !w.code.startsWith('a11y');
    }
  }
};
