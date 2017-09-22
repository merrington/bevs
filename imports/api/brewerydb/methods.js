import { HTTP } from 'meteor/http';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

const key = Meteor.settings.brewerydb_apikey;
const baseUrl = 'http://api.brewerydb.com/v2';

export const searchBeer = new ValidatedMethod({
  name: 'brewerydb.search',
  validate: null,
  run({ input }) {
    if (Meteor.isServer) {
      if (input.length) {
        const searchResults = HTTP.get(`${baseUrl}/search`, {
          params: {
            q: input,
            type: 'beer',
            key
          }
        });

        if (
          searchResults.data.status === 'success' &&
          searchResults.data.data
        ) {
          return searchResults.data.data.map(beer => ({
            value: beer.id,
            label: beer.name,
            labels: beer.labels || {}
          }));
        }
      }
      return [];
    }
  }
});
