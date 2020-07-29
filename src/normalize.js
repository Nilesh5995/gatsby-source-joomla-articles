const {
  createRemoteFileNode
} = require(`gatsby-source-filesystem`);
const _ = require(`lodash`);

exports.downloadMediaFiles = async ({
  entities,
  store,
  cache,
  createNode,
  createNodeId,
  touchNode,
  getCache,
  getNode,
  reporter,
}) => Promise.all(entities.map(async e => {
  let fileNodeIDImageIntro;
  let fileNodeIDImageFullText;
  let fileNodeIDCategoryImage;
  if (e.images.image_intro) {
    const mediaDataCacheKeyImageIntro = `joomla-media-image-image-intro-${e.id}`;
    const cacheMediaDataImageIntro = await cache.get(mediaDataCacheKeyImageIntro); // If we have cached media data and it wasn't modified, reuse
    // previously created file node to not try to redownload
    if (cacheMediaDataImageIntro && e.modified === cacheMediaDataImageIntro.modified) {
      const fileNodeImageIntro = getNode(cacheMediaDataImageIntro.fileNodeID); // check if node still exists in cache
      // it could be removed if image was made private
      if (fileNodeImageIntro) {
        fileNodeIDImageIntro = cacheMediaDataImageIntro.fileNodeID;
        touchNode({
          nodeId: fileNodeIDImageIntro
        });
      }
    } // If we don't have cached data, download the file
    if (!fileNodeIDImageIntro) {
      // WordPress does not properly encode it's media urls
      const encodedSourceUrl = encodeURI(e.images.image_intro);
      try {
        const fileNodeImageIntro = await createRemoteFileNode({
          url: e.images.image_intro,
          store,
          cache,
          createNode,
          createNodeId,
          getCache,
          parentNodeId: e.id,
          reporter
        });
        if (fileNodeImageIntro) {
          // console.log('This is file node..........')
          fileNodeIDImageIntro = fileNodeImageIntro.id;
          await cache.set(mediaDataCacheKeyImageIntro, {
            fileNodeIDImageIntro,
            modified: e.modified
          });
        }
        else {
           console.log("file node is not found");
        }
      } catch (e) {// Ignore
        console.log('\x1b[33m%s\x1b[0m',e, 'error')
      }
    }
  }

  if (e.images.image_fulltext) {
    const mediaDataCacheKeyImageFullText = `joomla-media-image-image-intro-${e.id}`;
    const cacheMediaDataImageFullText = await cache.get(mediaDataCacheKeyImageFullText); // If we have cached media data and it wasn't modified, reuse
    // previously created file node to not try to redownload
    if (cacheMediaDataImageFullText && e.modified === cacheMediaDataImageFullText.modified) {
      const fileNodeImageFullText = getNode(cacheMediaDataImageFullText.fileNodeID); // check if node still exists in cache
      // it could be removed if image was made private
      if (fileNodeImageFullText) {
        fileNodeIDImageFullText = cacheMediaDataImageFullText.fileNodeID;
        touchNode({
          nodeId: fileNodeIDImageFullText
        });
      }
    } // If we don't have cached data, download the file
    if (!fileNodeIDImageFullText) {
      // WordPress does not properly encode it's media urls
      const encodedSourceUrl = encodeURI(e.images.image_intro);
      try {
        const fileNodeImageFullText = await createRemoteFileNode({
          url: e.images.image_fulltext,
          store,
          cache,
          createNode,
          createNodeId,
          getCache,
          parentNodeId: e.id,
          reporter
        });
        if (fileNodeImageFullText) {
          // console.log('This is file node..........')
          fileNodeIDImageFullText = fileNodeImageFullText.id;
          await cache.set(mediaDataCacheKeyImageFullText, {
            fileNodeIDImageFullText,
            modified: e.modified
          });
        }
        else {
           console.log("file node is not found");
        }
      } catch (e) {// Ignore
        console.log('\x1b[33m%s\x1b[0m',e, 'error')
      }
    }
  }

  if (e.category.image) {
    const mediaDataCacheKeyCategoryImage = `joomla-media-category-image-${e.id}`;
    const cacheMediaDataCategoryImage = await cache.get(mediaDataCacheKeyCategoryImage); // If we have cached media data and it wasn't modified, reuse
    // previously created file node to not try to redownload
    if (cacheMediaDataCategoryImage && e.modified === cacheMediaDataCategoryImage.modified) {
      const fileNodeCategoryImage = getNode(cacheMediaDataCategoryImage.fileNodeID); // check if node still exists in cache
      // it could be removed if image was made private
      if (fileNodeCategoryImage) {
        fileNodeIDCategoryImage = cacheMediaDataCategoryImage.fileNodeID;
        touchNode({
          nodeId: fileNodeIDCategoryImage
        });
      }
    } // If we don't have cached data, download the file
    if (!fileNodeIDCategoryImage) {
      // WordPress does not properly encode it's media urls
      const encodedSourceUrl = encodeURI(e.category.image);
      try {
        const fileNodeCategoryImage = await createRemoteFileNode({
          url: e.category.image,
          store,
          cache,
          createNode,
          createNodeId,
          getCache,
          parentNodeId: e.id,
          reporter
        });
        if (fileNodeCategoryImage) {
          // console.log('This is file node..........')
          fileNodeIDCategoryImage = fileNodeCategoryImage.id;
          await cache.set(mediaDataCacheKeyCategoryImage, {
            fileNodeIDCategoryImage,
            modified: e.modified
          });
        }
        else {
           console.log("file node is not found");
        }
      } catch (e) {// Ignore
        console.log('\x1b[33m%s\x1b[0m',e, 'error')
      }
    }
  }

  if (fileNodeIDImageIntro) {
    e.imageIntro___NODE = fileNodeIDImageIntro;
  }

  if (fileNodeIDImageFullText) {
    e.imageFullText___NODE = fileNodeIDImageIntro;
  }

  if (fileNodeIDCategoryImage) {
    e.categoryImage___NODE = fileNodeIDCategoryImage;
  }

  return e;
}));