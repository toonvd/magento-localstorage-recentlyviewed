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

        var recentlyViewedHtml = "";
        recentlyViewedScopeList.reverse().forEach(function loopThroughRecentlyViewed(html) {
            recentlyViewedHtml += html.escapeHTML();
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

        var storage = this.getClientSideStorage();
        var currentScopeObject = objectForStorage[this.config.desiredScopeAndId];

        if (this.productExistsInStoreScopeObject(currentScopeObject)) {
            return false;
        }

        var itemObject = {};
        itemObject[this.config.productId] = this.container.innerHTML.escapeHTML();
        currentScopeObject = [];

        var recentlyViewedScopeListLength = currentScopeObject.length;
        if (recentlyViewedScopeListLength > this.config.maxLength) {
            var removeItemsCount = recentlyViewedScopeListLength - this.config.maxLength;
            currentScopeObject = currentScopeObject.splice(0, removeItemsCount)
        }
        currentScopeObject.push(itemObject);

        objectForStorage[this.config.desiredScopeAndId] = currentScopeObject;
        
        storage.setItem("Toonvd_Recentlyviewed", JSON.stringify(objectForStorage));
    },
    /**
     * Checks the client side storage object for existing products
     *
     * @returns {boolean}
     */
    productExistsInStoreScopeObject: function (storeScopeObject) {

        var hasProductInStoreScope = false;
        var productId = this.config.productId;

        storeScopeObject.forEach(function (productObject) {
            if (productObject[productId]) {
                hasProductInStoreScope = true;
            }
        });

        return hasProductInStoreScope;

    }
});