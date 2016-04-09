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
;

Toonvd.Recentlyviewed = Class.create({

    initialize: function (container, config) {

        this.container = $(container);
        this.config = config;
        if (this.container != undefined) {
            if (container == "recently-viewed") {
                this.initRecentlyViewedBlock();
            }
            else if (container == "recently-viewed-listitem") {
                this.addListItemToStorage();
            }
        }

    },
    getClientSideStorage: function () {

        if (window.localStorage) {
            return window.localStorage;
        } else if (window.sessionStorage) {
            return window.sessionStorage;
        }

        return false;
    },
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
    createRecentlyViewedList: function () {
        var recentlyViewedScopeList = this.recentlyViewedFullList[this.config.desiredScopeAndId];
        var recentlyViewedScopeListLength = Object.keys(recentlyViewedScopeList).length;
        if (recentlyViewedScopeListLength > 0) {
            var recentlyViewedHtml = "";
            for (var key in recentlyViewedScopeList) {
                recentlyViewedHtml += recentlyViewedScopeList[key];
            }
            this.container.down("ol").innerHTML = recentlyViewedHtml;
            this.container.show();
        }
    },
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
    addItemToList: function () {
        var productId = this.config.productId;
        var desiredScopeAndId = this.config.desiredScopeAndId;
        var objectForStorage = this.objectForStorage;
        var storage = this.getClientSideStorage();
        if (objectForStorage[desiredScopeAndId][productId] === undefined) {
            objectForStorage[desiredScopeAndId][productId] = this.container.innerHTML;
            var objectForStorageKeys = Object.keys(objectForStorage[desiredScopeAndId]);
            var recentlyViewedScopeListLength = objectForStorageKeys.length;
            if (recentlyViewedScopeListLength > this.config.maxLength) {
                var firstKey = objectForStorageKeys[0];
                delete objectForStorage[desiredScopeAndId][firstKey];
            }
            storage.setItem("Toonvd_Recentlyviewed", JSON.stringify(objectForStorage));
        }
    }
});