<?php

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
class Toonvd_Recentlyviewed_Block_Options extends Mage_Core_Block_Template
{
    /**
     * @var Mage_Catalog_Model_Product
     */
    protected $product;

    /**
     * Initializes product object if it exists
     */
    public function __construct()
    {
        if (is_object(Mage::registry("current_product")) &&
            !is_object($this->product)
        ) {
            $this->product = Mage::registry("current_product");
        }
        parent::__construct();
    }

    /**
     * Gets recently viewed block title.
     *
     * @return mixed
     */
    public function getListBlockTitle()
    {
        return $this->helper("toonvd_recentlyviewed")->__("Recently Viewed Products");
    }

    /**
     * Returns scope type and current scope id.
     *
     * @return string
     */
    public function getDesiredScopeAndId()
    {
        $desiredScope = $this->getConfig('catalog/recently_products/scope');

        switch ($desiredScope) {
            case 'website':
                $currentScopeId = Mage::app()->getStore()->getWebsite()->getId();
                break;
            case 'group':
                $currentScopeId = Mage::app()->getStore()->getGroup()->getId();
                break;
            default:
                $currentScopeId = Mage::app()->getStore()->getId();
                break;
        }

        return $desiredScope . $currentScopeId;
    }

    /**
     * Fetches the product url for images and links.
     *
     * @return string
     */
    public function getProductUrl()
    {
        return $this->helper("catalog/product")->getProductUrl($this->product);
    }

    /**
     * Fetches the product image.
     *
     * @return Mage_Catalog_Helper_Image
     */
    public function getProductImage()
    {
        return $this->helper("catalog/image")->init($this->product, "thumbnail")->resize(50,
            50)->setWatermarkSize("30x10");
    }

    /**
     * Fetches the product name the core way.
     *
     * @return string
     */
    public function getProductName()
    {
        return $this->helper("catalog/output")->productAttribute($this->product, $this->product->getName(), "name");
    }

    /**
     * Fetches the product id.
     *
     * @return mixed
     */
    public function getProductId()
    {
        return $this->product->getId();
    }

    /**
     * Fetches max recently viewed list length.
     *
     * @return mixed
     */
    public function getMaxLength()
    {
        return $this->getConfig('catalog/recently_products/viewed_count');
    }

    /**
     * Gets configuration by path.
     *
     * @param $configPath
     * @return mixed
     */
    protected function getConfig($configPath)
    {
        $config = Mage::getStoreConfig($configPath);
        return $config;
    }
}