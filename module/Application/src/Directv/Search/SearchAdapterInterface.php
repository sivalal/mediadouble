<?php

namespace Directv\Search;

interface SearchAdapterInterface
{
    /**
     * Get all the data with search query.
     */
    public function getAllDataBySearchValue($searchKey);
     public function GenericSearchParser_SingleResult($response,$key);
}
