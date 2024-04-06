class PlayerService {
  constructor(knex) {
    this.knex = knex;
  }

  // Get top100 player data
  async list() {
    const query = this.knex
      .select("*")
      .from("players")
      .orderBy("players.scores", "desc")
      .limit(100);

    try {
      const data = await query;
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getPlayerRank(id) {
    try {
      const record = await this.knex("players")
        .select("*")
        .where("id", id)
        .first();

      if (!record) {
        console.log("Record not found");
        return;
      }

      const index = await this.knex("players")
        .count("id as index")
        .where("scores", ">", record.scores)
        .first();

      const recordIndex = parseInt(index.index) + 1;

      const totalCount = await this.knex("players")
        .count("id as total")
        .first();

      const totalRecords = parseInt(totalCount.total);

      return {
        rank: recordIndex,
        totalRecords
      };
    } catch (error) {
      console.error("Error finding record:", error);
    }
  }

  // Insert player data to db
  async insert(data) {
    try {
      const [id] = await this.knex("players").insert({
        name: data.name,
        scores: data.scores,
      }).returning("id");

      return id
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = PlayerService;
