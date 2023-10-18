// --------------------------------------------------------------------
// 1. FUNCTION TO VALIDATE THE CURRENT USER REGISTERATION
// --------------------------------------------------------------------
module.exports.validateUserRegister = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  // IF USER PROVIDES AN EMPTY USERNAME
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  // IF USER PROVIDES AN EMPTY EMAIL
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    // Validate if it is an email
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  // IF USER PROVIDES AN EMPTY PASSWORD
  if (password === "") {
    errors.password = "Password must not be empty";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

// --------------------------------------------------------------------
// 2. FUNCTION TO VALIDATE THE CURRENT USER LOGIN
// --------------------------------------------------------------------

module.exports.validateUserLogin = (email, password) => {
  const errors = {};
  if (email.trim() === "") {
    errors.username = "Email must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

// --------------------------------------------------------------------
// 3. FUNCTION TO VALIDATE THE CURRENT USER POST
// --------------------------------------------------------------------

module.exports.validateUserPost = (type, text, image) => {
  const errors = {};

  // first validte the post type
  if (!type) {
    errors.type = "Specify the post type.";
  } else if (type !== "text" && type !== "image") {
    errors.type = "Invalid POST Type.";
  }

  // Depending on the post type, validate text or image
  if (type === "text") {
    if (!text || text.trim() === "") {
      errors.text = "Text post must not be empty";
    }
  } else if (type === "image") {
    if (!image || image.trim() === "") {
      errors.image = "Image URL must not be empty";
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateUserTextPost = (type, text) => {
  const errors = {};

  if (!type) {
    errors.type = "Post type must be specified.";
  } else if (type !== "text") {
    errors.type = "Invalid post type.";
  }

  if (type === "text" && (!text || text.trim() === "")) {
    errors.text = "Text post must not be empty.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};
