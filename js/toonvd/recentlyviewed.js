/***
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

if (!window.Toonvd) {
    window.Toonvd = {};
}

Toonvd.Recentlyviewed = Class.create({
    /***
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
    /***
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
    /***
     * Checks if browser supports client side storage and starts creation of the list.
     */
    initRecentlyViewedBlock: function () {

        var storage = this.getClientSideStorage();

        if (storage !== false) {
            var recentlyViewedFullList = JSON.parse(storage.getItem("Toonvd_Recentlyviewed"));
            if (recentlyViewedFullList !== null) {
                this.recentlyViewedFullList = recentlyViewedFullList;
                this.createRecentlyViewedList();
            }
        }

    },
    /***
     * Creates recently viewed list for the block + shows the block.
     */
    createRecentlyViewedList: function () {

        var recentlyViewedScopeList = this.recentlyViewedFullList[this.config.desiredScopeAndId];
        var recentlyViewedScopeListKeys = Object.keys(recentlyViewedScopeList);

        if (recentlyViewedScopeListKeys.length > 0) {
            var recentlyViewedHtml = "";
            Object.keys(recentlyViewedScopeList).sort().reverse().forEach(function (key) {
                var finalKeys = Object.keys(recentlyViewedScopeList[key]);
                recentlyViewedHtml += recentlyViewedScopeList[key][finalKeys[0]];
            });
            this.container.down("ol").innerHTML = recentlyViewedHtml;
            this.container.show();
        }

    },
    /***
     * Prepare the object and add to client side storage if condition applies.
     */
    addListItemToStorage: function () {

        var storage = this.getClientSideStorage();

        if (storage !== false) {
            var desiredScopeAndId = this.config.desiredScopeAndId;
            var objectForStorage = {};
            objectForStorage[desiredScopeAndId] = {};
            var recentlyViewedList = storage.getItem("Toonvd_Recentlyviewed");
            if (recentlyViewedList !== null) {
                objectForStorage = JSON.parse(recentlyViewedList);
            }
            this.objectForStorage = objectForStorage;
            this.addItemToList();
        }

    },
    /***
     * Adds product HTML to the client side storage object if it does not exist.
     * Timestamp is used so the object orders by last products viewed.
     */
    addItemToList: function () {

        var storage = this.getClientSideStorage();
        var currentScopeObject = this.objectForStorage[this.config.desiredScopeAndId];
        this.currentScopeObject = currentScopeObject;

        if (!this.productExistsInStorage()) {
            currentScopeObject[Date.now()] = {};
            currentScopeObject[Date.now()][this.config.productId] = this.container.innerHTML;
            var objectForStorageKeys = Object.keys(currentScopeObject);
            var recentlyViewedScopeListLength = objectForStorageKeys.length;
            if (recentlyViewedScopeListLength > this.config.maxLength) {
                var firstKey = objectForStorageKeys[0];
                delete currentScopeObject[firstKey];
            }
            storage.setItem("Toonvd_Recentlyviewed", JSON.stringify(this.objectForStorage));
        }

    },
    /***
     * Checks the client side storage object for existing products
     *
     * @returns {boolean}
     */
    productExistsInStorage: function () {

        var hasProductInObject = false;
        var currentScopeObject = this.currentScopeObject;
        var productId = this.config.productId;

        Object.keys(currentScopeObject).forEach(function (key) {
            if (currentScopeObject[key][productId]) {
                hasProductInObject = true;
            }
        });

        return hasProductInObject;

    }
});