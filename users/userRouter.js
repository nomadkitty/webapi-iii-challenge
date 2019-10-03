const express = require("express");
const userDb = require("./userDb");
const postDb = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  const newUser = req.body;
  userDb
    .insert(newUser)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the user to the database",
      });
    });
});

router.post("/:id/posts", validatePost, validateUserId, (req, res) => {
  const id = req.params.id;
  const newPost = { ...req.body, user_id: id };

  postDb
    .insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

router.get("/", (req, res) => {
  userDb
    .get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  userDb
    .getById(id)
    .then(user => {
      // console.log(user);
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ error: "Error retrieving user" });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;
  userDb
    .getUserPosts(id)
    .then(posts => {
      if (!posts.length) {
        res.status(404).json({ message: "There's no post from this user." });
      } else {
        res.status(200).json(posts);
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Error retrieving posts" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  userDb
    .remove(id)
    .then(user => {
      res.status(200).json({ message: "User is deleted successfully." });
    })
    .catch(err => {
      res.status(500).json({ error: "Error removing user. " });
    });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  userDb
    .update(id, changes)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ error: "Error updating user." });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  userDb.getById(id).then(user => {
    if (user) {
      user = req.user;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  });
}

function validateUser(req, res, next) {
  const body = req.body;
  if (Object.keys(body).length === 0) {
    res.status(400).json({ message: "missing user data" });
  } else {
    if (!body.name) {
      res.status(400).json({ message: "missing required name field" });
    } else {
      next();
    }
  }
}

function validatePost(req, res, next) {
  const body = req.body;
  if (Object.keys(body).length === 0) {
    res.status(400).json({ message: "missing post data" });
  } else if (!body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
