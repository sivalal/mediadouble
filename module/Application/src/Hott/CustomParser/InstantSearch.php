<?php
namespace Hott\CustomParser;
/*
 * Custom parser for instant search
 */
class InstantSearch {
	
	public function parseSearchContent($content, $type, $searchKey) {
		if(!empty($content['Link'])) {
			$searchContent["SearchText"] = $searchKey;
			foreach ($content['Link'] as $key => $value) {
				$searchContent[$type][$key] = $value;
				$searchContent[$type][$key]['imagePath_large'] = $searchContent[$type][$key]['imagePath'] = BASE_URL . '/dummy/blank_image.png';
			}
			return $searchContent;
		} else {
			$peopleSearchContent = "no results for current query from instant search api";
			return $peopleSearchContent;
		}

	}
}
