//note: will fix excessive string concatenation shortly 

var CRITERIA_DIV_ID = 'criteria',
	RATINGS_DIV_ID = 'ratings',
	bulletTemplate,
	sourceTitleTemplate,
	ratingsTemplate,
	ratingsHeaderTemplate;

bulletTemplate = _.template('<li><strong><%=shortTitle%></strong>: <%=principle%></li>');

ratingsHeaderTemplate = _.template('<th><%=shortTitle%></th>');

sourceTitleTemplate = _.template('<td><a href="<%=url%>"><%=name%></a></td>');

ratingsTemplate = _.template('<td class=" <% if (rating === \'good\' ) { %> success <%} else if (rating === \'ok\') {%>warning<%} else if (rating === \'needs improvement\') {%>danger<%}%>"><%=rating%></td>');


loadJson('./data/criteria.json', function(criteria) {
	
	loadJson('./data/sources.json', function(sources) {

		var criteriaString = '',
			ratingsString = '',
			ratingKeys;

		ratingKeys = _.pluck(criteria, 'key');

		//create bullet point list
		_.each(criteria, function(criteria) {
			criteriaString += bulletTemplate(criteria)
		});

		//create rating table headers
		ratingsString += '<tr><th>Data Source</th>';
		_.each(ratingKeys, function(key) {
			ratingsString += ratingsHeaderTemplate(_.findWhere(criteria, {key:key}));
		})

		ratingsString += '</tr>';

		//create rating table	
		_.each(sources, function(source) {
			var sourceString = '<tr>',
				r;
			sourceString += sourceTitleTemplate(source);
			_.each(ratingKeys, function(key) {
				sourceString += ratingsTemplate(source.ratings[key]);
			})
			sourceString += '</tr>';
			ratingsString += sourceString;
		})


		document.getElementById(CRITERIA_DIV_ID).innerHTML = criteriaString;
		document.getElementById(RATINGS_DIV_ID).innerHTML = ratingsString;

	})
});




function loadJson(path, callback) {
	
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) {
			return;
		}
		callback(JSON.parse(xhr.response));
	}

	xhr.open('GET', path, true);
	xhr.send();

}
