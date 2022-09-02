const validBookInput = { title: "Karcsi és a Csokigyár" };

const invalidBookInput = { author: "Ronald Dahl" };

const commentWithInvalidId = { _id: "abc", comment: "I like that book!" };

const invalidId = { _id: "abc" };

module.exports = { validBookInput, invalidBookInput, commentWithInvalidId, invalidId }