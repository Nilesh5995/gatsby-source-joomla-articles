const fetch = require("node-fetch");
const normalize = require(`./src/normalize`);
exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
  getNode,
  store,
  cache,
  getCache,
  reporter,
}, options) => {
  try {
    const {
      baseUrl
    } = options;
    const {
      rowLimits
    } = options;
    const {
    createNode,
    touchNode
  } = actions;
    if (rowLimits) {
      var {
        limit
      } = rowLimits;
      var {
        step
      } = rowLimits;
      limit = limit ? limit : 0;
      step = step ? step : 10;

      if (isNaN(limit)) {
        // Its not a number.
        console.warn("Limit is not a number, We are showing the all article");
      }
    } else {
      var limit = 0;
      var step = 10;
    }

    var limitstart = 0; //var step = 10;

    let load = true;
    var changeLimit = step;
    var fetchLimit = step; //assigbn the remaning article to load

    if (limit != 0) {
      var remainingArticle = limit;
    }

    while (load) {
      //If the limit is less then the step then only one cycle of the fetch is executed
      if (limit != 0 && limit <= step) {
        fetchLimit = limit;
        load = false;
      } //If the remaning article is less then the fetch


      if (remainingArticle < step && limit != 0) {
        load = false;
      }

      const res = await fetch(baseUrl + "&limitstart=" + limitstart + "&limit=" + fetchLimit);
      const resData = await res.json();
      //await normalize.mapEntitiesToMedia(resData.data.data.results);
      const entities = resData.data.data.results;
      await normalize.downloadMediaFiles({
        entities,
        store,
        cache,
        createNode,
        createNodeId,
        touchNode,
        getCache,
        getNode,
        reporter,
      })

      if (resData.data.success === true) {
        resData.data.data.results.forEach(articles => {
          const node = { ...articles,
            id: createNodeId(`AllJoomlaArticles${articles.id}`),
            internal: {
              type: "JoomlaArticle",
              contentDigest: createContentDigest(articles)
            }
          };
          actions.createNode(node);
        }); //chenges in the limit so that we know where we are now, limtstart start always from 0

        if (limit != 0 && changeLimit == limit) {
          load = false;
        }

        limitstart = limitstart + step;
        changeLimit = changeLimit + step; //check the remaning article

        if (limit != 0) {
          remainingArticle = remainingArticle - step;
        } //assign the fetch limit is the step is gretter and the article is less


        if (remainingArticle < step && limit != 0) {
          fetchLimit = remainingArticle;
        }
      } else {
        load = false;
      }
    }
  } catch (error) {
    console.log(error);
  }
};