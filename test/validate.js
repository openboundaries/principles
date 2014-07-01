var test = require('tape'),
	_ = require('underscore'),
	fs = require('fs');

//tests that each criteria object has the correct structure and has values for all of the required keys
fs.readFile('./data/criteria.json', function(err, data) {

	var criteria = JSON.parse(data.toString()),
		REQUIRED_KEYS = ['principle','shortTitle','importance'],
		REQUIRED_COMPLETE_KEYS = ['principle','shortTitle'];

	test('Criteria JSON document is non-empty.', function(t) {
		t.plan(1);
		t.equal(_.isEmpty(criteria), false, 'criteria variable passes _.isEmpty test');
	});

	//check for required keys and required truthy keys
	_.keys(criteria).forEach( function(c) {
		checkForKeys(criteria, c, REQUIRED_KEYS, 'Criteria');
		checkForNonEmptyKeys(criteria, c, REQUIRED_COMPLETE_KEYS, 'Criteria');
	});

	//test that each source object contains the required ratings and metadata
	fs.readFile('./data/sources.json', function(err, data) {
		
		var sources = JSON.parse(data.toString()),
			REQUIRED_KEYS = ['name','url','ratings'],
			REQUIRED_COMPLETE_KEYS = ['name'],
			RATINGS_KEY_GROUPS = [[]],
			criteriaKeys = _.keys(criteria);

		test('Sources JSON document is non-empty.', function(t) {
			t.plan(1);
			t.equal(_.isEmpty(sources), false, 'sources variable passes _.isEmpty test');
		})

		//check for required keys and required truthy keys
		_.keys(sources).forEach( function(s) {
			checkForKeys(sources, s, REQUIRED_KEYS, 'Source');
			checkForNonEmptyKeys(sources, s, REQUIRED_COMPLETE_KEYS, 'Source');
			//check that all possible rating keys are present
			test('Source ' + s + ' has appropriate keys for each possible criteria.', function(t) {
				
				var ratings = sources[s].ratings,
					REQUIRED_KEYS = ['rating', 'rationale'];

				t.plan(criteriaKeys.length * 2);
				criteriaKeys.forEach(function(key) {

					var ratingKeys,
						ratingValues;

					t.equal(_.has(ratings,key), true, 'Source ' + s + ' has an object for rating ' + key);
					//check that required keys are present
					checkForKeys(ratings,key,REQUIRED_KEYS,'Source ' + s + ' rating');
					//check that ratings are either complete or incomplete
					ratingKeys = _.keys(ratings[key]);
					ratingValues = _.chain(ratings[key]).values().compact().value(); //compact eliminates empty strings from array
					t.equal(ratingKeys.length === ratingValues.length || ratingValues.length === 0, true, 'All values are truthy if any are truthy for source \'' + s + '\' rating \'' + key + '\'');
				});

			})
		})

	})

});

function checkForKeys(obj, i, keys, name) {
	test(name + ' ' + i + ' has the required keys', function(t) {
		t.plan(keys.length);
		keys.forEach(function(key) {
			t.equal(_.has(obj[i], key), true, name + ' \'' + i + '\' has the key \'' + key + '\'');
		})
	})
}

function checkForNonEmptyKeys(obj, i, keys, name) {
	test(name + ' ' + i + ' has values for the mandatory keys', function(t) {
		t.plan(keys.length);
		keys.forEach(function(key) {
			t.ok(obj[i][key], name + ' \'' + i + '\' has a value for key \'' + key + '\'');
		})
	})
}