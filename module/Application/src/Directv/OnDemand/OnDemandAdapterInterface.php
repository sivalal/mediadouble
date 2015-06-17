<?php

namespace Directv\OnDemand;

interface OnDemandAdapterInterface
{
    /**
     * Get all the data with search query.
     */
    public function getAllDataBySearchValue($searchKey);
    public function getAllLiveContent();
    public function getDataByID($searchID);
    public function getLiveDataBySearchValue($searchKey);
    public function getPeopleDataBySearchValue($searchKey);
    public function getTVDataBySearchValue($searchKey);
    public function getAssetDataByID($searchID);
    public function deleteItemFromWatchlist($accountToken, $titleId);
    public function deleteAllItemsFromWatchlist($accountToken);
    public function deleteItemFromXDR($accountToken, $embedCode);
    public function deleteAllItemsFromXDR($accountToken);
    public function addWatchlist($watchlistData);
    public function getGenreList($genre,$page,$pagecount,$format,$region);
    public function getRecentlyAddedList($amount);
    public function getAllGenreList($page,$pagecount,$format,$region);
    public function getEpisodeList($show_id,$show_type);
    public function getPeopleDetail($peopleList);

}
