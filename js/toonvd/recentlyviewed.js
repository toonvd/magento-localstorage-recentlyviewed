/**
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @category   Magento Extensions
 * @package    Toonvd_Recentlyviewed
 * @copyright  Copyright (c) 2016 Toon Van Dooren
 * @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * @author     Toon Van Dooren <toon_vd@live.com>
 */

if (typeof window.Toonvd !== 'object') {
  window.Toonvd = {};
}

Toonvd.Recentlyviewed = Class.create({
  /**
   * Initializes the current class
   *
   * @param container
   * @param config
   */
  initialize: function (container, config) {

    this.container = $(container);
    this.config = config;

    if (this.container !== undefined) {
      if (container === "recently-viewed") {
        this.initRecentlyViewedBlock();
      }
      else if (container === "recently-viewed-listitem") {
        this.addListItemToStorage();
      }
    }

  },
  /**
   * Fetches client side storage type.
   *
   * @returns {*}
   */
  getClientSideStorage: function () {

    if (window.localStorage) {
      return window.localStorage;
    } else if (window.sessionStorage) {
      return window.sessionStorage;
    }

    return false;
  },
  /**
   * Checks if browser supports client side storage and starts creation of the list.
   */
  initRecentlyViewedBlock: function () {

    var storage = this.getClientSideStorage();
    if (!storage) {
      return false;
    }

    var recentlyViewedFullList = JSON.parse(storage.getItem("Toonvd_Recentlyviewed"));
    if (!recentlyViewedFullList) {
      return false;
    }

    return this.createRecentlyViewedList(recentlyViewedFullList);
  },
  /**
   * Creates recently viewed list for the block + shows the block.
   */
  createRecentlyViewedList: function (recentlyViewedFullList) {

    var recentlyViewedScopeList = recentlyViewedFullList[this.config.desiredScopeAndId];
    if (recentlyViewedScopeList.length <= 0) {
      return false;
    }

    console.log(recentlyViewedFullList);
    var recentlyViewedHtml = "";
    recentlyViewedScopeList.reverse().forEach(function loopThroughRecentlyViewed (item) {
      var productInfo = item.productInfo;

      // Escape all input vars
      for(var key in productInfo) {
        if(productInfo.hasOwnProperty(key)) {
          productInfo[key] = productInfo[key].escapeHTML()
        }
      }

      var li = document.createElement('li');
      li.setAttribute('class', 'item');

      // Add child to list item. TODO: Might need a rework
      // Output is the following emmet abbreviation:
      // a[href=productInfo.url]>span.product-image>img[src=productInfo.imageUrl][alt=productInfo.name][width=50][height=50]
      li.appendChild(function addLink () {
        var link = document.createElement('a');
        link.setAttribute('href', productInfo.url);

        link.appendChild(function addSpan () {
          var span = document.createElement('span');
          span.setAttribute('class', 'product-image');

          span.appendChild(function addImage () {
            var img = document.createElement('img');
            img.setAttribute('src', productInfo.imageUrl);
            img.setAttribute('alt', productInfo.name);
            img.setAttribute('width', 50);
            img.setAttribute('height', 50);

            return img;
          }());

          return span;
        }());

        return link;
      }());

      li.appendChild(function addDiv() {
        var div = document.createElement('div');
        div.setAttribute('class', 'product-details');
        div.appendChild(function addParagraph() {
          var p = document.createElement('p');
          p.setAttribute('class', 'product-name');
          p.appendChild(function addLink() {
            var a = document.createElement('a');
            a.setAttribute('href', productInfo.url);
            a.appendChild(document.createTextNode(productInfo.name));

            return a;
          }());

          return p;
        }());

        return div;
      }());

      recentlyViewedHtml += li.outerHTML;
    });

    this.container.down("ol").innerHTML = recentlyViewedHtml;
    this.container.show();
  },
  /**
   * Prepare the object and add to client side storage if condition applies.
   */
  addListItemToStorage: function () {

    var storage = this.getClientSideStorage();

    if (!storage) {
      return false;
    }

    var objectForStorage = {};
    var desiredScopeAndId = this.config.desiredScopeAndId;
    objectForStorage[desiredScopeAndId] = [];

    var recentlyViewedList = storage.getItem("Toonvd_Recentlyviewed");
    // If localstorage already exists. Parse and add it to object
    if (recentlyViewedList !== null) {
      objectForStorage = JSON.parse(recentlyViewedList);
    }

    this.addItemToList(objectForStorage);
  },
  /**
   * Adds product HTML to the client side storage object if it does not exist.
   * Timestamp is used so the object orders by last products viewed.
   */
  addItemToList: function (objectForStorage) {
    var currentScopeObject = objectForStorage[this.config.desiredScopeAndId] || [];

    if (this.productExistsInStoreScopeObject(currentScopeObject)) {
      return false;
    }

    currentScopeObject.push({
      productId: this.config.productId,
      productInfo: this.config.productInfo
    });

    if (currentScopeObject.length > this.config.maxLength) {
      var removeItemsCount = currentScopeObject.length - this.config.maxLength;
      // Remove oldest items from array when maxLength config is exceeded
      currentScopeObject = currentScopeObject.splice(removeItemsCount, recentlyViewedScopeListLength)
    }

    objectForStorage[this.config.desiredScopeAndId] = currentScopeObject;

    this.getClientSideStorage().setItem("Toonvd_Recentlyviewed", JSON.stringify(objectForStorage));
  },
  /**
   * Checks the client side storage object for existing products
   *
   * @returns {boolean}
   */
  productExistsInStoreScopeObject: function (storeScopeObject) {

    var hasProductInStoreScope = false;
    var productId = this.config.productId;

    // Use some instead of forEach for faster check
    storeScopeObject.some(function (item) {
      if (productId === item.productId) {
        hasProductInStoreScope = true;
        return true;
      }
    });

    return hasProductInStoreScope;

  }
});