export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem("saved_books")
    ? JSON.parse(localStorage.getItem("saved_books"))
    : [];

  return savedBookIds;
};

export const saveBookIds = (bookIdArr) => {
  if (bookIdArr.length) {
    localStorage.setItem("saved_books", JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem("saved_books");
  }
};

export const removeBookId = (bookId) => {
  const savedBookIds = localStorage.getItem("saved_books")
    ? JSON.parse(localStorage.getItem("saved_books"))
    : [];

  if (!savedBookIds) {
    return false;
  }

  const index = savedBookIds.indexOf(bookId);
  if (index !== -1) {
    savedBookIds.splice(index, 1);
    localStorage.setItem("saved_books", JSON.stringify(savedBookIds));
    return true;
  }

  return true;
};
