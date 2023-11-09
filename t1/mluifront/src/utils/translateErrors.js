export default function translateErrors(er) {
  switch (er) {
    case "Failed to fetch":
      return "Please check you internet connection";
    case "Empty":
      return "Please check you internet connection";
    case "Login failed":
      return "Email or Password is incorrect";
    default:
      return er;
  }
}
