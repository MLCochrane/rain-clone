export default function sample(num) {
  const toAdd = 2;

  function addEmUp() {
    return num + toAdd;
  }

  return {
    getResult() {
      return `The result is ${addEmUp()}`;
    }
  }
}