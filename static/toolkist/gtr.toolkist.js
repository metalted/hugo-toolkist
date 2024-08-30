export var gtr = (function($) {
    var gtr = {};  

    // Generic function to make a GraphQL request
    gtr.graphQLRequest = function(query, variables) {
        return fetch('https://graphql.zeepkist-gtr.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        })
        .then(response => response.json())
        .then(data => data.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;  // Re-throw the error to handle it in the calling function if needed
        });
    };

    // Function to get all users
    gtr.getAllUsers = function() {
        const query = `
            query MyQuery {
                allUsers {
                    edges {
                        node {
                            id
                            steamName
                        }
                    }
                }
            }
        `;
        return gtr.graphQLRequest(query).then(data => {
            return data.allUsers.edges.map(edge => edge.node);
        });
    };  

    // Function to get personal bests for a specific user and query
    gtr.getPersonalBests = function(userId, query) {
        const gqlQuery = `
            query MyQuery($userId: Int, $query: String) {
                allPersonalBestGlobals(
                    first: 20
                    filter: {
                        idUser: { equalTo: $userId }
                        levelByIdLevel: {
                            levelItemsByIdLevel: { some: { name: { includesInsensitive: $query } } }
                        }
                    }
                ) {
                    nodes {
                        idRecord
                        levelByIdLevel {
                            levelItemsByIdLevel {
                                nodes {
                                    name
                                    fileAuthor
                                    fileUid
                                    workshopId
                                    imageUrl
                                }
                            }
                        }
                        recordByIdRecord {
                            id
                            time
                            splits
                            speeds
                        }
                        dateCreated
                        dateUpdated
                    }
                }
            }
        `;
        const variables = { userId, query };
        return gtr.graphQLRequest(gqlQuery, variables).then(data => {
            return data.allPersonalBestGlobals.nodes;
        });
    };

    // New function to get levels with metadata and personal bests
    gtr.getLevelsWithMetadataAndPersonalBests = function(hashes) {
        const gqlQuery = `
            query GetLevelsWithMetadataAndPersonalBests($hashes: [String!]) {
              allLevels(filter: { hash: { in: $hashes } }) {
                nodes {
                  hash
                  levelItemsByIdLevel {
                    nodes {
                      name
                      fileAuthor
                      fileUid
                      imageUrl
                      validationTimeAuthor
                      validationTimeBronze
                      validationTimeGold
                      validationTimeSilver
                      authorId
                      workshopId
                    }
                  }
                  levelMetadataByIdLevel {
                    nodes {
                      amountBlocks
                      amountCheckpoints
                      amountFinishes
                      typeGround
                      typeSkybox
                    }
                  }
                  personalBestGlobalsByIdLevel {
                    nodes {
                      recordByIdRecord {
                        isValid
                        time
                        splits
                        speeds
                      }
                      userByIdUser {
                        steamId
                        steamName
                      }
                    }
                  }
                }
              }
            }
        `;
        const variables = { hashes };
        return gtr.graphQLRequest(gqlQuery, variables).then(data => {
            return data.allLevels.nodes;
        });
    };

    gtr.searchLevelByName = function(query) {
        const gqlQuery = `
            query SearchLevelByName($query: String) {
              allLevels(
                first: 20
                filter: {levelItemsByIdLevel: {some: {name: {includesInsensitive: $query}}}}
              ) {
                nodes {
                  hash
                  levelItemsByIdLevel {
                    nodes {
                      name
                      fileAuthor
                      fileUid
                      imageUrl
                      validationTimeAuthor
                      validationTimeBronze
                      validationTimeGold
                      validationTimeSilver
                      authorId
                      workshopId
                    }
                  }
                  levelMetadataByIdLevel {
                    nodes {
                      amountBlocks
                      amountCheckpoints
                      amountFinishes
                      typeGround
                      typeSkybox
                    }
                  }                  
                }
              }
            }
        `;
        const variables = { query };
        return gtr.graphQLRequest(gqlQuery, variables).then(data => {
            return data.allLevels.nodes;
        });
    };

    gtr.searchLevelByWorkshopID = function(query) {
      const gqlQuery = `
          query SearchLevelByWorkshopID($query: BigFloat) {
          allLevels(
            first: 20
            filter: {levelItemsByIdLevel: {some: {workshopId: {equalTo: $query}}}}
          ) {
            nodes {
              hash
              levelItemsByIdLevel {
                nodes {
                  name
                  fileAuthor
                  fileUid
                  imageUrl
                  validationTimeAuthor
                  validationTimeBronze
                  validationTimeGold
                  validationTimeSilver
                  authorId
                  workshopId
                }
              }
              levelMetadataByIdLevel {
                nodes {
                  amountBlocks
                  amountCheckpoints
                  amountFinishes
                  typeGround
                  typeSkybox
                }
              }                  
            }
          }
        }
      `;
      const variables = { query };
      return gtr.graphQLRequest(gqlQuery, variables).then(data => {
          return data.allLevels.nodes;
      });
  };

    return gtr;
})(jQuery);
