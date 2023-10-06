const letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  function createID() {
    let id = "";
  
    for (let i = 0; i < 2; i++) {
      const index = Math.floor(Math.random() * 25);
      id += letters[index].toUpperCase();
    }
  
    for (let i = 0; i < 4; i++) {
      const index = Math.floor(Math.random() * 9);
      id += index;
    }
  
    return id;
  }
  
  export { createID };