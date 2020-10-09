const http = require('http');
const fs = require('fs');
const requests = require('requests');

/// now i want to get the data of home.html
const homeFile = fs.readFileSync('home.html', 'utf-8');

/// i wnat data ek hi baar replace ho
// inside tempVal homefile comes n inside orgVal val comes
const replaceVal = (tempVal, orgVal) => {
	// inside the bracket i want to replace with what data
	let temperature = tempVal.replace('{% tempval%}', orgVal.main.temp);
	temperature = temperature.replace('{% tempmin%}', orgVal.main.temp_min);
	temperature = temperature.replace('{% tempmax%}', orgVal.main.temp_max);
	temperature = temperature.replace('{%location%}', orgVal.name);
	temperature = temperature.replace('{%country%}', orgVal.sys.country);
	temperature = temperature.replace('{%tempstatus%}', orgVal.weather[0].main);
	return temperature;
};

const server = http.createServer((req, res) => {
	if (req.url == '/') {
		requests(
			'http://api.openweathermap.org/data/2.5/weather?q=Bhubaneswar&appid=332dbeb40ca477032a8de5ff751dbc20'
		)
			.on('data', (chunk) => {
				// convert the json into object
				const objdata = JSON.parse(chunk);
				// convert objdata into arrdata
				const arrdata = [objdata];
				// now we will get the data array of an object
				// console.log(arrdata[0].main.temp);
				// i want to replace the temperture so to make it dynamic);
				// join means convert into string

				const realTimeData = arrdata
					.map((cvalue) => replaceVal(homeFile, cvalue))
					.join('');
				res.write(realTimeData);
			})
			.on('end', (err) => {
				if (err) return console.log('connection closed due to errors', err);
				res.end();
			});
	}
});
server.listen(8000, '127.0.0.1');
