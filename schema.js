
var config = require('./config');
var pgp = require('pg-promise')();
var db = pgp(config.getDbConnectionString());

let {

  GraphQLString,
  GraphQLList,
  GraphQLObjectType,

  GraphQLNonNull,

  GraphQLSchema
} = require('graphql');


const TypevalueType = new GraphQLObjectType({
  name: "Typevalue",
  description: "This represent an typevalue",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    valuetype: { type: new GraphQLNonNull(GraphQLString) },
    dimension: { type: new GraphQLNonNull(GraphQLString) }
  })
});
const DatasensorType = new GraphQLObjectType({
  name: "Datasensor",
  description: "This represent a Datasensor",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    id_controllersensor: { type: new GraphQLNonNull(GraphQLString) },
    date_time: { type: GraphQLString },
    data: { type: GraphQLString },
    id_typevalue:{ type: new GraphQLNonNull(GraphQLString) }
  })
});


const DataQueryRootType = new GraphQLObjectType({
  name: 'DataAppSchema',
  description: "Data Application Schema Query Root",
  fields: () => ({
    typevalue: {
      type: new GraphQLList(TypevalueType),
      description: "List of all typevalue",
      resolve() {
        const query = `SELECT * FROM typevalue limit 10`;
        return db.any(query)
          .then(data => {
            return data;
          })
          .catch(err => {
            return 'The error is', err;
          });
      }
    },
    datasensor: {
      type: new GraphQLList(DatasensorType),
      description: "List of all datasensor",
      resolve() {
        const query = `SELECT * FROM datasensor limit 10`;
        return db.any(query)
          .then(data => {
            return data;
          })
          .catch(err => {
            return 'The error is', err;
          });
      }
    }
  })
});
const DataAppSchema = new GraphQLSchema({
  query: DataQueryRootType

});
module.exports = DataAppSchema;
