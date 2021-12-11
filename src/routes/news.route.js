const express = require('express');
const Parser = require('rss-parser');
const { generateBasicResponse } = require('../utils/helpers/api.helper');

const router = new express.Router();
const parser = new Parser();

// GET
router.get('/', async (req, res) => {
	try {
		const { start, limit } = req.query;
		const feed = await parser.parseURL('https://vnexpress.net/rss/suc-khoe.rss');
		let newsData = feed.items.map((item) => {
			const img = item.content.match('\<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>');
			const imgUrl = img ? img[1] : '';
			const description = item.content.split('</br>')[1];

			return { 
			title: item.title,
			description,
			imgUrl,
			link: item.link
			};
		});
		console.log(Number(start) + Number(limit));
		if (newsData.length < Number(start) + Number(limit)) {
			newsData = newsData.slice(start, newsData.length);
		} else {
			newsData = newsData.slice(start, Number(start) + Number(limit));
		}

		res.json({
			...generateBasicResponse(true, false, 'get news successfully'),
			data: newsData,
		});
	} catch (error) {
		res.status(500).json(generateBasicResponse(false, true, error.message));
	}
});

module.exports = router;