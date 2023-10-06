
export function getDate(dateString, numberOfDaysToAdd = 0) {
  const updatedDate = new Date(dateString);
  updatedDate.setDate(updatedDate.getDate() + numberOfDaysToAdd);

  const year = updatedDate.getFullYear();
  const month = String(updatedDate.getMonth() + 1).padStart(2, "0");
  const day = String(updatedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export  function formatDate(dateString) {
  const dateParts = dateString.split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  const monthName = new Date(dateString).toLocaleString("default", { month: "short" });

  return `${parseInt(day, 10)} ${monthName} ${parseInt(year, 10)}`;
}