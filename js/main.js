//note: _ and $ assumed present because of preceeding script tags

var CRITERIA_DIV_ID = '#criteria',
	RATINGS_DIV_ID = '#ratings',
	bulletTemplate = _.template('<li><strong><span class="criteria"><%=shortTitle%></span></strong>: <%=principle%></li>'),
	sourceTitleTemplate = _.template('<td><a href="<%=url%>"><%=name%></a></td>'),
	ratingsTemplate = _.template('<td title="<%if(rationale) {%><%=rationale%>"<%} else {%>Not yet rated<%}%>" class=" <% if (rating === \'good\' ) { %> success <%} else if (rating === \'ok\') {%>warning<%} else if (rating === \'needs improvement\') {%>danger<%}%>"><%=rating%></td>'),
	ratingsHeaderTemplate = _.template('<th title="<%=principle%>"><%=shortTitle%></th>');

//load criteria and data source data from json files and use to render markup
loadJson('./data/criteria.json', function(criteria) {
	
	loadJson('./data/sources.json', function(sources) {

		var bulletList = $('<ul></ul>'),
			ratingTable = $('<table class="table table-striped table-bordered"></table>'),
			tableHeaderRow = $('<tr></tr>'),
			criteriaKeys = _.keys(criteria);

		tableHeaderRow.append('<th>Data Source</th>');

		//create bullet point list and table header row from criteria keys
		_.each(criteriaKeys, function(key) {
			bulletList.append(bulletTemplate(criteria[key]));
			tableHeaderRow.append(ratingsHeaderTemplate(criteria[key]));
		});

		tableHeaderRow.appendTo(ratingTable);

		//append list of sources and their respective ratings to table
		_.each(sources, function(source) {
			var row = $('<tr></tr>');
			row.append(sourceTitleTemplate(source));
			_.each(criteriaKeys, function(key) {
				if (source.ratings[key]) {
					row.append(ratingsTemplate(source.ratings[key]));
				}
				else {
					row.append('<td title="Not yet rated"></td>');
				}
			});
			row.appendTo(ratingTable);
		})

		//append everything to the DOM
		bulletList.appendTo(CRITERIA_DIV_ID);
		ratingTable.appendTo(RATINGS_DIV_ID);
		$(document).tooltip();

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
