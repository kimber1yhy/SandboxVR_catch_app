/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('players').del()
    .then(function () {
      // Inserts seed entries
      return knex('players').insert([
        { name: 'Mr. Deadwood', scores: 500 },
        { name: 'Davy Jones', scores: 1000 },
        { name: 'Squid G. VR', scores: 900 },
      ]);
    });
};
